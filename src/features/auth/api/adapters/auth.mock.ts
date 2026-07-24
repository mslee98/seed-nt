import { ApiError, API_ERROR_CODES } from '../../../../shared/api/errors'
import { toKoreaE164 } from '../../utils/phoneE164'
import type {
  CompleteSignupPayload,
  CompleteSignupResult,
  PasskeyListItem,
  RecoverAccountPayload,
  RecoverAccountResult,
  SessionListItem,
} from '../../types/signup'

function delay(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

function randomDelay(min = 300, max = 800) {
  return delay(min + Math.floor(Math.random() * (max - min)))
}

const takenNicknames = new Set(['Brit유저', 'admin', '브릿유저'])

export async function checkNicknameMock(
  nickname: string,
): Promise<{ available: boolean }> {
  await randomDelay(200, 450)
  if (takenNicknames.has(nickname.trim())) {
    return { available: false }
  }
  return { available: true }
}

export async function sendSmsCodeMock(phone: string): Promise<{ success: true }> {
  const mockCode = String(Math.floor(100000 + Math.random() * 900000))
  if (import.meta.env.DEV) {
    console.info(`[mock] SMS code for ${phone}: ${mockCode}`)
  }
  await randomDelay()
  return { success: true }
}

export async function verifySmsCodeMock(
  _phone: string,
  code: string,
): Promise<{ verified: true }> {
  await randomDelay(400, 700)
  if (!/^\d{6}$/.test(code)) {
    throw new Error('INVALID_CODE')
  }
  return { verified: true }
}

export async function verifyAccountMock(_payload: {
  name: string
  bankCode: string
  accountNumber: string
}): Promise<{ verified: true; holderName: string }> {
  await randomDelay(600, 1200)
  return { verified: true, holderName: _payload.name }
}

export async function registerPinMock(_pin: string): Promise<{ success: true }> {
  await randomDelay(300, 600)
  if (!/^\d{4}$/.test(_pin)) {
    throw new ApiError(API_ERROR_CODES.INVALID_PIN)
  }
  return { success: true }
}

export async function completeSignupMock(
  payload: CompleteSignupPayload,
): Promise<CompleteSignupResult> {
  await randomDelay(500, 900)
  if (takenNicknames.has(payload.nickname)) {
    throw new ApiError(API_ERROR_CODES.NICKNAME_TAKEN, 'NICKNAME_TAKEN', 409)
  }
  if (!/^\d{4}$/.test(payload.transactionPin)) {
    throw new ApiError(API_ERROR_CODES.INVALID_PIN, 'INVALID_PIN', 400)
  }
  takenNicknames.add(payload.nickname)
  return {
    success: true,
    userId: `mock-${Date.now()}`,
    nickname: payload.nickname,
    phoneE164: toKoreaE164(payload.phone),
  }
}

export async function signInAfterSignupMock(_payload: {
  phoneE164: string
  loginPassword: string
}): Promise<{ success: true }> {
  void _payload
  await randomDelay(200, 400)
  return { success: true }
}

export async function loginWithPasswordMock(_payload: {
  phone: string
  password: string
}): Promise<{ success: true }> {
  await randomDelay(300, 600)
  if (!_payload.password) {
    throw new ApiError(API_ERROR_CODES.LOGIN_FAILED)
  }
  return { success: true }
}

export async function loginWithPasskeyMock(): Promise<{ success: true }> {
  await randomDelay(400, 800)
  return { success: true }
}

export async function registerPasskeyMock(): Promise<{ success: true }> {
  await randomDelay(400, 800)
  return { success: true }
}

export async function markPasskeyRegisteredMock(): Promise<{ success: true }> {
  return { success: true }
}

export async function dismissPasskeyPromptMock(): Promise<{ success: true }> {
  return { success: true }
}

export async function listPasskeysMock(): Promise<PasskeyListItem[]> {
  await randomDelay(200, 400)
  return [
    {
      id: 'pk-1',
      friendlyName: '이 기기',
      createdAt: new Date().toISOString(),
      lastUsedAt: new Date().toISOString(),
    },
  ]
}

export async function deletePasskeyMock(id: string): Promise<{ success: true }> {
  void id
  await randomDelay(200, 400)
  return { success: true }
}

export async function renamePasskeyMock(
  id: string,
  friendlyName: string,
): Promise<{ success: true }> {
  void id
  void friendlyName
  await randomDelay(200, 400)
  return { success: true }
}

export async function listSessionsMock(): Promise<SessionListItem[]> {
  await randomDelay(200, 400)
  return [
    {
      id: 'sess-current',
      createdAt: new Date().toISOString(),
      userAgent: navigator.userAgent,
      isCurrent: true,
    },
  ]
}

export async function revokeSessionMock(id: string): Promise<{ success: true }> {
  void id
  await randomDelay(200, 400)
  return { success: true }
}

export async function revokeOtherSessionsMock(): Promise<{ success: true }> {
  await randomDelay(200, 400)
  return { success: true }
}

export async function recoverAccountMock(
  payload: RecoverAccountPayload,
): Promise<RecoverAccountResult> {
  await randomDelay(500, 900)
  if (!payload.octomoVerified || payload.accountNumberLast4.length !== 4) {
    throw new ApiError(API_ERROR_CODES.RECOVERY_FAILED)
  }
  const lockedUntil = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  return { success: true, sensitiveActionsLockedUntil: lockedUntil }
}

export async function changeTransactionPinMock(payload: {
  currentPin: string
  newPin: string
}): Promise<{ success: true }> {
  void payload
  await randomDelay(300, 500)
  return { success: true }
}
