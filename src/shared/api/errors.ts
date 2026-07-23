export const API_ERROR_CODES = {
  BANKS_FETCH_FAILED: 'BANKS_FETCH_FAILED',
  HTTP_ERROR: 'HTTP_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
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
