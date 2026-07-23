/**
 * auth.api
 *
 * 책임: 가입·본인인증·계좌·PIN 도메인 facade
 * 비책임: mock/HTTP 구현 (→ adapters)
 */
import {
  registerPinHttp,
  sendSmsCodeHttp,
  verifyAccountHttp,
  verifySmsCodeHttp,
} from './adapters/auth.http'
import {
  registerPinMock,
  sendSmsCodeMock,
  verifyAccountMock,
  verifySmsCodeMock,
} from './adapters/auth.mock'

function useHttpApi() {
  return Boolean(import.meta.env.VITE_API_BASE_URL)
}

export async function sendSmsCode(phone: string): Promise<{ success: true }> {
  if (useHttpApi()) return sendSmsCodeHttp(phone)
  return sendSmsCodeMock(phone)
}

export async function verifySmsCode(
  phone: string,
  code: string,
): Promise<{ verified: true }> {
  if (useHttpApi()) return verifySmsCodeHttp(phone, code)
  return verifySmsCodeMock(phone, code)
}

export async function verifyAccount(payload: {
  name: string
  bankCode: string
  accountNumber: string
}): Promise<{ verified: true; holderName: string }> {
  if (useHttpApi()) return verifyAccountHttp(payload)
  return verifyAccountMock(payload)
}

export async function registerPin(pin: string): Promise<{ success: true }> {
  if (useHttpApi()) return registerPinHttp(pin)
  return registerPinMock(pin)
}
