export const API_ERROR_CODES = {
  BANKS_FETCH_FAILED: 'BANKS_FETCH_FAILED',
  HTTP_ERROR: 'HTTP_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  NICKNAME_TAKEN: 'NICKNAME_TAKEN',
  PHONE_EXISTS: 'PHONE_EXISTS',
  IDENTITY_EXISTS: 'IDENTITY_EXISTS',
  INVALID_NICKNAME: 'INVALID_NICKNAME',
  INVALID_PASSWORD: 'INVALID_PASSWORD',
  INVALID_PIN: 'INVALID_PIN',
  SIGNUP_FAILED: 'SIGNUP_FAILED',
  LOGIN_FAILED: 'LOGIN_FAILED',
  PASSKEY_FAILED: 'PASSKEY_FAILED',
  SENSITIVE_LOCKED: 'SENSITIVE_LOCKED',
  RECOVERY_FAILED: 'RECOVERY_FAILED',
} as const

export type ApiErrorCode = (typeof API_ERROR_CODES)[keyof typeof API_ERROR_CODES]

export class ApiError extends Error {
  readonly code: ApiErrorCode
  readonly status?: number

  constructor(code: ApiErrorCode, message?: string, status?: number) {
    super(message ?? code)
    this.name = 'ApiError'
    this.code = code
    this.status = status
  }
}
