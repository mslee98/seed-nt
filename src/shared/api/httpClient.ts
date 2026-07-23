import { ApiError, API_ERROR_CODES } from './errors'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface HttpRequestOptions {
  method?: HttpMethod
  body?: unknown
  headers?: Record<string, string>
  signal?: AbortSignal
}

function getBaseUrl(): string {
  const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '')
  if (!baseUrl) {
    throw new ApiError(API_ERROR_CODES.HTTP_ERROR, 'VITE_API_BASE_URL이 필요합니다.')
  }
  return baseUrl
}

export async function httpRequest<T>(path: string, options: HttpRequestOptions = {}): Promise<T> {
  const { method = 'GET', body, headers, signal } = options
  const url = `${getBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`

  let response: Response
  try {
    response = await fetch(url, {
      method,
      signal,
      headers: {
        Accept: 'application/json',
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError(API_ERROR_CODES.NETWORK_ERROR, '네트워크 요청에 실패했어요')
  }

  if (!response.ok) {
    let message = `HTTP ${response.status}`
    try {
      const payload = (await response.json()) as { message?: string }
      if (payload.message) message = payload.message
    } catch {
      // ignore body parse errors
    }
    throw new ApiError(API_ERROR_CODES.HTTP_ERROR, message, response.status)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}

export function httpGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  return httpRequest<T>(path, { method: 'GET', signal })
}

export function httpPost<T>(path: string, body?: unknown, signal?: AbortSignal): Promise<T> {
  return httpRequest<T>(path, { method: 'POST', body, signal })
}
