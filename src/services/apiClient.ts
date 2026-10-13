import { AuthConfigurationError, getSupabaseClient } from '../lib/supabase'

export class ApiError extends Error {
  readonly status: number
  readonly code: string

  constructor(status: number, code: string, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

type ApiPath = '/api/health' | '/api/plans/current' | '/api/plans/current/purchases'
export interface RequestOptions { signal?: AbortSignal; timeoutMs?: number }
export interface ApiRequestOptions extends RequestOptions {
  method?: 'GET' | 'PUT' | 'POST'
  body?: unknown
  authenticated?: boolean
}
export interface ApiClient {
  request<T>(path: ApiPath, options?: ApiRequestOptions): Promise<T>
}

interface ApiClientOptions {
  getAccessToken?: () => Promise<string | null>
  fetchImpl?: typeof fetch
  baseUrl?: string
  timeoutMs?: number
}

function validateBaseUrl(value: string): string {
  if (!value) return '' // Production uses same-origin /api, never a loopback fallback.
  try {
    const url = new URL(value)
    if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash ||
        ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)) throw new Error()
    return value.replace(/\/$/, '')
  } catch {
    throw new ApiError(0, 'API_CONFIGURATION_INVALID', 'Use a same-origin API or an HTTPS API URL.')
  }
}

function responseError(status: number, body: unknown): ApiError {
  if (body && typeof body === 'object' && 'error' in body) {
    const error = body.error
    if (error && typeof error === 'object' && 'code' in error && 'message' in error &&
        typeof error.code === 'string' && typeof error.message === 'string') {
      return new ApiError(status, error.code, error.message)
    }
  }
  const fallback: Record<number, [string, string]> = {
    401: ['UNAUTHENTICATED', 'Sign in to continue.'],
    404: ['NOT_FOUND', 'The requested resource was not found.'],
    409: ['CONFLICT', 'The request conflicts with the current plan.'],
    422: ['INVALID_REQUEST', 'The request data is invalid.'],
    503: ['SERVICE_UNAVAILABLE', 'The service is unavailable. Please retry.'],
  }
  const [code, message] = fallback[status] ?? ['HTTP_ERROR', 'The request failed. Please retry.']
  return new ApiError(status, code, message)
}

export function createApiClient(options: ApiClientOptions = {}): ApiClient {
  const baseUrl = validateBaseUrl(options.baseUrl ?? import.meta.env.VITE_API_BASE_URL ?? '')
  const fetchImpl = options.fetchImpl ?? ((...args) => globalThis.fetch(...args))
  const getToken = options.getAccessToken ?? (async () => {
    const { data, error } = await getSupabaseClient().auth.getSession()
    if (error) throw new ApiError(401, 'SESSION_UNAVAILABLE', 'Sign in again to continue.')
    return data.session?.access_token ?? null
  })

  return {
    async request<T>(path: ApiPath, request: ApiRequestOptions = {}): Promise<T> {
      const controller = new AbortController()
      const timeoutMs = request.timeoutMs ?? options.timeoutMs ?? 15_000
      if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
        throw new ApiError(0, 'TIMEOUT_INVALID', 'Request timeout must be positive.')
      }
      let timedOut = false
      const abort = () => controller.abort()
      let rejectAbort: (error: ApiError) => void = () => {}
      const aborted = new Promise<never>((_resolve, reject) => { rejectAbort = reject })
      const onAbort = () => rejectAbort(new ApiError(0, timedOut ? 'REQUEST_TIMEOUT' : 'REQUEST_ABORTED',
        timedOut ? 'The request timed out. Its outcome may be unknown.' : 'The request was cancelled.'))
      controller.signal.addEventListener('abort', onAbort, { once: true })
      request.signal?.addEventListener('abort', abort, { once: true })
      const timeout = setTimeout(() => { timedOut = true; controller.abort() }, timeoutMs)
      async function perform(): Promise<T> {
        if (controller.signal.aborted) throw new ApiError(0, 'REQUEST_ABORTED', 'The request was cancelled.')
        const headers = new Headers({ Accept: 'application/json' })
        if (request.authenticated !== false) {
          const token = await getToken()
          if (!token) throw new ApiError(401, 'UNAUTHENTICATED', 'Sign in to continue.')
          headers.set('Authorization', `Bearer ${token}`)
        }
        if (controller.signal.aborted) throw new ApiError(0, 'REQUEST_ABORTED', 'The request was cancelled.')
        if (request.body !== undefined) headers.set('Content-Type', 'application/json')
        const response = await fetchImpl(`${baseUrl}${path}`, {
          method: request.method ?? 'GET', headers, signal: controller.signal, credentials: 'omit', cache: 'no-store',
          ...(request.body !== undefined ? { body: JSON.stringify(request.body) } : {}),
        })
        let body: unknown
        try { body = await response.json() } catch {
          if (!response.ok) throw responseError(response.status, null)
          throw new ApiError(502, 'INVALID_RESPONSE', 'The server returned an invalid response.')
        }
        if (!response.ok) throw responseError(response.status, body)
        return body as T
      }
      try {
        if (request.signal?.aborted) controller.abort()
        // Race the whole request, including token acquisition/body parsing, against cancellation.
        return await Promise.race([perform(), aborted])
      } catch (error) {
        if (error instanceof ApiError) throw error
        if (error instanceof AuthConfigurationError) {
          throw new ApiError(503, 'AUTH_CONFIGURATION_MISSING', error.message)
        }
        throw new ApiError(0, 'NETWORK_ERROR', 'The API could not be reached. Please retry.')
      } finally {
        clearTimeout(timeout)
        request.signal?.removeEventListener('abort', abort)
        controller.signal.removeEventListener('abort', onAbort)
      }
    },
  }
}

export const apiClient = createApiClient()
