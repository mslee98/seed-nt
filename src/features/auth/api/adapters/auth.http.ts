import { httpPost } from '../../../../shared/api/httpClient'
import type {
  CompleteSignupPayload,
  CompleteSignupResult,
  RecoverAccountPayload,
  RecoverAccountResult,
} from '../../types/signup'

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

export async function completeSignupHttp(
  payload: CompleteSignupPayload,
): Promise<CompleteSignupResult> {
  return httpPost<CompleteSignupResult>('/v1/auth/signup', payload)
}

export async function changeTransactionPinHttp(payload: {
  currentPin: string
  newPin: string
}): Promise<{ success: true }> {
  return httpPost<{ success: true }>('/v1/auth/pin', payload)
}

export async function recoverAccountHttp(
  payload: RecoverAccountPayload,
): Promise<RecoverAccountResult> {
  return httpPost<RecoverAccountResult>('/v1/auth/recovery', payload)
}
