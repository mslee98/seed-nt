/**
 * octomo.api
 *
 * 책임: OCTOMO QR 발급·문자 exists 조회 facade
 * 비책임: Edge Function / OCTOMO secret
 */
import {
  checkOctomoMessageFromSupabase,
  createOctomoQrFromSupabase,
  type CheckOctomoResult,
} from './adapters/octomo.supabase'

export type { CheckOctomoResult }

export async function createOctomoQr(text: string): Promise<string> {
  return createOctomoQrFromSupabase(text)
}

export async function checkOctomoMessage(input: {
  mobileNum: string
  text: string
  withinMinutes?: number
}): Promise<CheckOctomoResult> {
  return checkOctomoMessageFromSupabase(input)
}
