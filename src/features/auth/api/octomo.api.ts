/**
 * octomo.api
 *
 * 책임: OCTOMO 문자 인증 확인 facade
 * 비책임: Edge Function / OCTOMO secret (→ adapters, Supabase Secrets)
 */
import {
  verifyOctomoFromSupabase,
  type VerifyOctomoInput,
  type VerifyOctomoResponse,
} from './adapters/octomo.supabase'

export type { VerifyOctomoInput, VerifyOctomoResponse }

export async function verifyOctomo(input: VerifyOctomoInput): Promise<VerifyOctomoResponse> {
  return verifyOctomoFromSupabase(input)
}
