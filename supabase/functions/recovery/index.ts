// supabase/functions/recovery/index.ts
// Account recovery with 2+ factors. Sets sensitive_actions_locked_until (24h).

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, apikey, content-type, x-client-info",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface RecoveryBody {
  phone: string;
  octomoVerified: boolean;
  accountNumberLast4: string;
  name: string;
  birthDate: string;
  newLoginPassword: string;
}

function jsonResponse(data: Record<string, unknown>, status = 200): Response {
  return Response.json(data, { status, headers: corsHeaders });
}

function digitsOnly(phone: string): string {
  return phone.replace(/\D/g, "");
}

function toKoreaE164(phone: string): string {
  const digits = digitsOnly(phone);
  if (digits.startsWith("82")) return `+${digits}`;
  if (digits.startsWith("0")) return `+82${digits.slice(1)}`;
  return `+82${digits}`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return jsonResponse({ error: "METHOD_NOT_ALLOWED" }, 405);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) {
    return jsonResponse({ error: "SERVER_MISCONFIGURED" }, 500);
  }

  let body: RecoveryBody;
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: "INVALID_JSON" }, 400);
  }

  // OCTOMO alone is not enough
  if (!body.octomoVerified) {
    return jsonResponse({ error: "OCTOMO_REQUIRED" }, 400);
  }
  if (!body.accountNumberLast4 || body.accountNumberLast4.length !== 4) {
    return jsonResponse({ error: "ACCOUNT_REQUIRED" }, 400);
  }
  if (!body.name || !body.birthDate || !body.newLoginPassword) {
    return jsonResponse({ error: "IDENTITY_REQUIRED" }, 400);
  }
  if (body.newLoginPassword.length < 8) {
    return jsonResponse({ error: "INVALID_PASSWORD" }, 400);
  }

  const phoneE164 = toKoreaE164(body.phone);
  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: profile, error: profileError } = await admin
    .from("user_profiles")
    .select("user_id, name, birth_date, bank_account_number")
    .eq("phone_number", phoneE164)
    .maybeSingle();

  if (profileError || !profile) {
    return jsonResponse({ error: "USER_NOT_FOUND" }, 404);
  }

  const account = String(profile.bank_account_number ?? "");
  if (!account.endsWith(body.accountNumberLast4)) {
    return jsonResponse({ error: "ACCOUNT_MISMATCH" }, 400);
  }
  if (profile.name !== body.name) {
    return jsonResponse({ error: "NAME_MISMATCH" }, 400);
  }
  if (String(profile.birth_date) !== body.birthDate) {
    return jsonResponse({ error: "BIRTH_MISMATCH" }, 400);
  }

  const { error: updateAuthError } = await admin.auth.admin.updateUserById(
    profile.user_id,
    { password: body.newLoginPassword },
  );
  if (updateAuthError) {
    return jsonResponse({ error: "PASSWORD_UPDATE_FAILED", message: updateAuthError.message }, 400);
  }

  const lockedUntil = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  const now = new Date().toISOString();

  await admin
    .from("user_profiles")
    .update({
      last_recovery_at: now,
      sensitive_actions_locked_until: lockedUntil,
    })
    .eq("user_id", profile.user_id);

  // Invalidate other sessions when supported by project
  try {
    await admin.auth.admin.signOut(profile.user_id, "global");
  } catch {
    // optional
  }

  return jsonResponse({
    success: true,
    sensitiveActionsLockedUntil: lockedUntil,
  });
});
