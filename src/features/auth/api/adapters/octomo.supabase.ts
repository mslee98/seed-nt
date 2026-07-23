import { getSupabaseClient } from '../../../../shared/lib/supabase'

export interface VerifyOctomoInput {
  phone: string
  message: string
}

export interface VerifyOctomoResponse {
  verified: boolean
  message?: string
}

export async function verifyOctomoFromSupabase({
  phone,
  message,
}: VerifyOctomoInput): Promise<VerifyOctomoResponse> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.functions.invoke<VerifyOctomoResponse>('verify-octomo', {
    body: {
      phone: phone.replace(/\D/g, ''),
      message,
    },
  })

  if (error) {
    throw new Error(error.message || '문자 인증을 확인하지 못했어요')
  }

  if (!data) {
    throw new Error('문자 인증을 확인하지 못했어요')
  }

  return data
}
