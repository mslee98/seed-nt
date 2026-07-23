import { getSupabaseClient } from '../../../../shared/lib/supabase'

export interface CreateOctomoQrResponse {
  qrCode: string
}

export interface CheckOctomoResult {
  exists: boolean
}

export async function createOctomoQrFromSupabase(text: string): Promise<string> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.functions.invoke<CreateOctomoQrResponse>('octomo', {
    method: 'POST',
    body: {
      text,
      errorCorrectionLevel: 'M',
      margin: 2,
      width: 240,
    },
  })

  if (error) {
    throw new Error(error.message || 'QR 코드를 만들지 못했어요')
  }

  if (!data?.qrCode) {
    throw new Error('QR 코드 응답이 올바르지 않아요')
  }

  return data.qrCode
}

export async function checkOctomoMessageFromSupabase(input: {
  mobileNum: string
  text: string
  withinMinutes?: number
}): Promise<CheckOctomoResult> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, '')
  const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

  if (!supabaseUrl || !publishableKey) {
    throw new Error('Supabase 환경변수가 필요해요')
  }

  const url = new URL(`${supabaseUrl}/functions/v1/octomo`)
  url.searchParams.set('mobileNum', input.mobileNum.replace(/\D/g, ''))
  url.searchParams.set('text', input.text)
  if (input.withinMinutes !== undefined) {
    url.searchParams.set('withinMinutes', String(input.withinMinutes))
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      apikey: publishableKey,
      Authorization: `Bearer ${publishableKey}`,
      Accept: 'application/json',
    },
  })

  const data = (await response.json().catch(() => ({}))) as CheckOctomoResult & {
    message?: string
  }

  if (!response.ok) {
    throw new Error(data.message ?? '문자 인증 결과를 확인하지 못했어요')
  }

  return { exists: data.exists === true }
}
