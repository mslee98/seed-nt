// supabase/functions/octomo/index.ts

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "jsr:@supabase/server@^1";

const OCTOMO_QR_URL =
  "https://api.octoverse.kr/octomo/v1/public/message/qr-code";

const OCTOMO_EXISTS_URL =
  "https://api.octoverse.kr/octomo/v1/public/message/exists";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, apikey, content-type, x-client-info",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

interface CreateQrRequest {
  text: string;
  errorCorrectionLevel?: "L" | "M" | "Q" | "H";
  margin?: number;
  width?: number;
}

interface CreateQrResponse {
  qrCode: string;
}

interface ExistsResponse {
  exists: boolean;
}

function jsonResponse(
  data: Record<string, unknown>,
  status = 200,
): Response {
  return Response.json(data, {
    status,
    headers: corsHeaders,
  });
}

async function parseResponse(response: Response): Promise<unknown> {
  const responseText = await response.text();

  if (!responseText) {
    return {};
  }

  try {
    return JSON.parse(responseText);
  } catch {
    return {
      message: responseText,
    };
  }
}

function getOctomoHeaders(apiKey: string): HeadersInit {
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Octomo ${apiKey}`,
  };
}

function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

console.info("octomo edge function started");

export default {
  fetch: withSupabase(
    {
      // 회원가입 전 호출이므로 publishable key 허용
      auth: ["publishable"],
    },
    async (req) => {
      if (req.method === "OPTIONS") {
        return new Response("ok", {
          headers: corsHeaders,
        });
      }

      const apiKey = Deno.env.get("OCTOMO_API_KEY");

      if (!apiKey) {
        console.error("OCTOMO_API_KEY is missing");

        return jsonResponse(
          {
            error: "SERVER_CONFIGURATION_ERROR",
            message: "OCTOMO API Key가 설정되지 않았습니다.",
          },
          500,
        );
      }

      try {
        /**
         * POST /functions/v1/octomo
         *
         * QR 코드 발급
         */
        if (req.method === "POST") {
          let payload: CreateQrRequest;

          try {
            payload = await req.json();
          } catch {
            return jsonResponse(
              {
                error: "INVALID_JSON",
                message: "요청 형식이 올바르지 않습니다.",
              },
              400,
            );
          }

          const text = payload.text?.trim();

          if (!text) {
            return jsonResponse(
              {
                error: "TEXT_REQUIRED",
                message: "QR에 포함할 문자 내용이 필요합니다.",
              },
              400,
            );
          }

          const errorCorrectionLevel =
            payload.errorCorrectionLevel ?? "M";

          const margin = payload.margin ?? 2;
          const width = payload.width ?? 200;

          if (
            !["L", "M", "Q", "H"].includes(errorCorrectionLevel)
          ) {
            return jsonResponse(
              {
                error: "INVALID_ERROR_CORRECTION_LEVEL",
                message:
                  "오류 정정 수준은 L, M, Q, H 중 하나여야 합니다.",
              },
              400,
            );
          }

          if (
            !Number.isInteger(margin) ||
            margin < 0 ||
            margin > 20
          ) {
            return jsonResponse(
              {
                error: "INVALID_MARGIN",
                message: "QR 여백은 0~20이어야 합니다.",
              },
              400,
            );
          }

          if (
            !Number.isInteger(width) ||
            width < 100 ||
            width > 1000
          ) {
            return jsonResponse(
              {
                error: "INVALID_WIDTH",
                message: "QR 크기는 100~1000px이어야 합니다.",
              },
              400,
            );
          }

          const octomoResponse = await fetch(OCTOMO_QR_URL, {
            method: "POST",
            headers: getOctomoHeaders(apiKey),
            body: JSON.stringify({
              text,
              errorCorrectionLevel,
              margin,
              width,
            }),
          });

          const octomoData = await parseResponse(octomoResponse);

          if (!octomoResponse.ok) {
            console.error("OCTOMO QR API failed", {
              status: octomoResponse.status,
              response: octomoData,
            });

            return jsonResponse(
              {
                error: "OCTOMO_QR_FAILED",
                message: "QR 코드 발급에 실패했습니다.",
                octomoStatus: octomoResponse.status,
              },
              octomoResponse.status,
            );
          }

          const qrResult = octomoData as CreateQrResponse;

          return jsonResponse({
            qrCode: qrResult.qrCode,
          });
        }

        /**
         * GET /functions/v1/octomo
         *   ?mobileNum=01012345678
         *   &text=BRIT-205364
         *   &withinMinutes=5
         *
         * 프론트에서는 GET이지만
         * OCTOMO에는 POST로 전달합니다.
         */
        if (req.method === "GET") {
          const url = new URL(req.url);

          const mobileNum = normalizePhone(
            url.searchParams.get("mobileNum") ?? "",
          );

          const text =
            url.searchParams.get("text")?.trim() ?? "";

          const withinMinutesValue =
            url.searchParams.get("withinMinutes");

          if (!/^01\d{8,9}$/.test(mobileNum)) {
            return jsonResponse(
              {
                error: "INVALID_MOBILE_NUMBER",
                message: "휴대폰 번호 형식이 올바르지 않습니다.",
              },
              400,
            );
          }

          if (!text) {
            return jsonResponse(
              {
                error: "TEXT_REQUIRED",
                message: "확인할 문자 내용이 필요합니다.",
              },
              400,
            );
          }

          let withinMinutes: number | undefined;

          if (withinMinutesValue !== null) {
            withinMinutes = Number(withinMinutesValue);

            if (
              !Number.isInteger(withinMinutes) ||
              withinMinutes <= 0
            ) {
              return jsonResponse(
                {
                  error: "INVALID_WITHIN_MINUTES",
                  message:
                    "조회 시간은 1 이상의 정수여야 합니다.",
                },
                400,
              );
            }
          }

          const requestBody: {
            mobileNum: string;
            text: string;
            withinMinutes?: number;
          } = {
            mobileNum,
            text,
          };

          // 생략하면 OCTOMO 기본값 5분 적용
          if (withinMinutes !== undefined) {
            requestBody.withinMinutes = withinMinutes;
          }

          const octomoResponse = await fetch(
            OCTOMO_EXISTS_URL,
            {
              method: "POST",
              headers: getOctomoHeaders(apiKey),
              body: JSON.stringify(requestBody),
            },
          );

          const octomoData = await parseResponse(octomoResponse);

          if (!octomoResponse.ok) {
            console.error("OCTOMO exists API failed", {
              status: octomoResponse.status,
              // 휴대폰 번호와 인증문자는 로그에 남기지 않음
            });

            return jsonResponse(
              {
                error: "OCTOMO_EXISTS_FAILED",
                message: "문자 인증 결과 조회에 실패했습니다.",
                octomoStatus: octomoResponse.status,
              },
              octomoResponse.status,
            );
          }

          const existsResult = octomoData as ExistsResponse;

          return jsonResponse({
            exists: existsResult.exists === true,
          });
        }

        return jsonResponse(
          {
            error: "METHOD_NOT_ALLOWED",
            message: "GET 또는 POST만 지원합니다.",
          },
          405,
        );
      } catch (error) {
        console.error(
          "OCTOMO Edge Function error",
          error instanceof Error
            ? error.message
            : "Unknown error",
        );

        return jsonResponse(
          {
            error: "OCTOMO_UNAVAILABLE",
            message:
              "OCTOMO 서비스에 연결할 수 없습니다.",
          },
          502,
        );
      }
    },
  ),
} satisfies Deno.ServeDefaultExport;
