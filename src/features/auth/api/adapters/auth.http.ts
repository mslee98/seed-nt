import { httpPost } from '../../../../shared/api/httpClient'

export async function sendSmsCodeHttp(phone: string): Promise<{ success: true }> {
  return httpPost<{ success: true }>('/v1/auth/sms/send', { phone })
}

export async function verifySmsCodeHttp(
  phone: string,
  code: string,
): Promise<{ verified: true }> {
  return httpPost<{ verified: true }>('/v1/auth/sms/verify', { phone, code })
}

export async function verifyAccountHttp(payload: {
  name: string
  bankCode: string
  accountNumber: string
}): Promise<{ verified: true; holderName: string }> {
  return httpPost<{ verified: true; holderName: string }>('/v1/auth/accounts/verify', payload)
}

export async function registerPinHttp(pin: string): Promise<{ success: true }> {
  return httpPost<{ success: true }>('/v1/auth/pin', { pin })
}
