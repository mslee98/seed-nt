/**
 * auth.api
 *
 * 책임: 가입·로그인·패스키·복구·거래 PIN facade
 * 비책임: mock/HTTP/Supabase 구현 (→ adapters)
 */
import {
  changeTransactionPinHttp,
  completeSignupHttp,
  recoverAccountHttp,
  registerPinHttp,
  sendSmsCodeHttp,
  verifyAccountHttp,
  verifySmsCodeHttp,
} from './adapters/auth.http'
import {
  changeTransactionPinMock,
  completeSignupMock,
  deletePasskeyMock,
  dismissPasskeyPromptMock,
  listPasskeysMock,
  listSessionsMock,
  loginWithPasskeyMock,
  loginWithPasswordMock,
  markPasskeyRegisteredMock,
  recoverAccountMock,
  registerPasskeyMock,
  registerPinMock,
  renamePasskeyMock,
  revokeOtherSessionsMock,
  revokeSessionMock,
  sendSmsCodeMock,
  signInAfterSignupMock,
  checkNicknameMock,
  verifyAccountMock,
  verifySmsCodeMock,
} from './adapters/auth.mock'
import {
  completeSignupSupabase,
  deletePasskeySupabase,
  dismissPasskeyPromptSupabase,
  fetchSensitiveLockSupabase,
  listPasskeysSupabase,
  listSessionsSupabase,
  loginWithPasskeySupabase,
  loginWithPasswordSupabase,
  markPasskeyRegisteredSupabase,
  recoverAccountSupabase,
  registerPasskeySupabase,
  renamePasskeySupabase,
  revokeOtherSessionsSupabase,
  revokeSessionSupabase,
  signInAfterSignupSupabase,
} from './adapters/auth.supabase'
import type {
  CompleteSignupPayload,
  CompleteSignupResult,
  PasskeyListItem,
  RecoverAccountPayload,
  RecoverAccountResult,
  SessionListItem,
} from '../types/signup'

function shouldUseHttpApi() {
  return Boolean(import.meta.env.VITE_API_BASE_URL)
}

function shouldUseSupabaseAuth() {
  return Boolean(
    import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  )
}

export async function sendSmsCode(phone: string): Promise<{ success: true }> {
  if (shouldUseHttpApi()) return sendSmsCodeHttp(phone)
  return sendSmsCodeMock(phone)
}

export async function verifySmsCode(
  phone: string,
  code: string,
): Promise<{ verified: true }> {
  if (shouldUseHttpApi()) return verifySmsCodeHttp(phone, code)
  return verifySmsCodeMock(phone, code)
}

export async function verifyAccount(payload: {
  name: string
  bankCode: string
  accountNumber: string
}): Promise<{ verified: true; holderName: string }> {
  if (shouldUseHttpApi()) return verifyAccountHttp(payload)
  return verifyAccountMock(payload)
}

export async function checkNickname(nickname: string): Promise<{ available: boolean }> {
  if (shouldUseHttpApi()) {
    const { httpPost } = await import('../../../shared/api/httpClient')
    return httpPost<{ available: boolean }>('/v1/auth/nickname/check', { nickname })
  }
  return checkNicknameMock(nickname)
}

/** @deprecated 가입 완료용 아님 — 거래 PIN 변경은 changeTransactionPin 사용 */
export async function registerPin(pin: string): Promise<{ success: true }> {
  if (shouldUseHttpApi()) return registerPinHttp(pin)
  return registerPinMock(pin)
}

export async function completeSignup(
  payload: CompleteSignupPayload,
): Promise<CompleteSignupResult> {
  if (shouldUseHttpApi()) return completeSignupHttp(payload)
  if (shouldUseSupabaseAuth()) return completeSignupSupabase(payload)
  return completeSignupMock(payload)
}

export async function signInAfterSignup(payload: {
  phoneE164: string
  loginPassword: string
}): Promise<{ success: true }> {
  if (shouldUseSupabaseAuth()) return signInAfterSignupSupabase(payload)
  return signInAfterSignupMock(payload)
}

export async function loginWithPassword(payload: {
  phone: string
  password: string
}): Promise<{ success: true }> {
  if (shouldUseSupabaseAuth()) return loginWithPasswordSupabase(payload)
  return loginWithPasswordMock(payload)
}

export async function loginWithPasskey(): Promise<{ success: true }> {
  if (shouldUseSupabaseAuth()) return loginWithPasskeySupabase()
  return loginWithPasskeyMock()
}

export async function registerPasskeyForCurrentUser(): Promise<{ success: true }> {
  if (shouldUseSupabaseAuth()) return registerPasskeySupabase()
  return registerPasskeyMock()
}

export async function markPasskeyRegistered(): Promise<{ success: true }> {
  if (shouldUseSupabaseAuth()) return markPasskeyRegisteredSupabase()
  return markPasskeyRegisteredMock()
}

export async function dismissPasskeyPrompt(): Promise<{ success: true }> {
  if (shouldUseSupabaseAuth()) return dismissPasskeyPromptSupabase()
  return dismissPasskeyPromptMock()
}

export async function listPasskeys(): Promise<PasskeyListItem[]> {
  if (shouldUseSupabaseAuth()) return listPasskeysSupabase()
  return listPasskeysMock()
}

export async function deletePasskey(id: string): Promise<{ success: true }> {
  if (shouldUseSupabaseAuth()) return deletePasskeySupabase(id)
  return deletePasskeyMock(id)
}

export async function renamePasskey(
  id: string,
  friendlyName: string,
): Promise<{ success: true }> {
  if (shouldUseSupabaseAuth()) return renamePasskeySupabase(id, friendlyName)
  return renamePasskeyMock(id, friendlyName)
}

export async function listSessions(): Promise<SessionListItem[]> {
  if (shouldUseSupabaseAuth()) return listSessionsSupabase()
  return listSessionsMock()
}

export async function revokeSession(id: string): Promise<{ success: true }> {
  if (shouldUseSupabaseAuth()) return revokeSessionSupabase(id)
  return revokeSessionMock(id)
}

export async function revokeOtherSessions(): Promise<{ success: true }> {
  if (shouldUseSupabaseAuth()) return revokeOtherSessionsSupabase()
  return revokeOtherSessionsMock()
}

export async function recoverAccount(
  payload: RecoverAccountPayload,
): Promise<RecoverAccountResult> {
  if (shouldUseHttpApi()) return recoverAccountHttp(payload)
  if (shouldUseSupabaseAuth()) return recoverAccountSupabase(payload)
  return recoverAccountMock(payload)
}

export async function changeTransactionPin(payload: {
  currentPin: string
  newPin: string
}): Promise<{ success: true }> {
  const { assertSensitiveActionAllowed } = await import('../utils/sensitiveActionLock')
  try {
    assertSensitiveActionAllowed()
  } catch {
    const { ApiError, API_ERROR_CODES } = await import('../../../shared/api/errors')
    throw new ApiError(API_ERROR_CODES.SENSITIVE_LOCKED, 'SENSITIVE_LOCKED', 423)
  }
  if (shouldUseHttpApi()) return changeTransactionPinHttp(payload)
  return changeTransactionPinMock(payload)
}

export async function fetchSensitiveLockUntil(): Promise<string | null> {
  if (shouldUseSupabaseAuth()) return fetchSensitiveLockSupabase()
  return null
}
