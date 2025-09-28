/**
 * API client for cross-origin calls to the backend
 * Centralized in root composables directory so Nuxt auto-import works.
 */
interface ApiRequestOptions {
  /** HTTP method */
  method?: string
  /** Request headers */
  headers?: Record<string, string>
  /** Optional body object that will be JSON.stringified automatically */
  body?: Record<string, unknown> | unknown[] | string | number | boolean | null
}

interface GlobalThis {
  $fetch?: (
    url: string,
    options?: {
      method?: string
      headers?: Record<string, string>
      body?: Record<string, unknown> | unknown[] | string | number | boolean | null
    }
  ) => Promise<unknown>
}

interface AuthSession {
  value?: {
    accessToken?: string
  }
}

interface AuthResult {
  session?: AuthSession
}

interface UseApiClientResult {
  apiCall: <T>(endpoint: string, options?: ApiRequestOptions) => Promise<T>
  get: <T>(endpoint: string) => Promise<T>
  post: <T>(
    endpoint: string,
    data?: Record<string, unknown> | unknown[] | string | number | boolean | null
  ) => Promise<T>
  put: <T>(
    endpoint: string,
    data?: Record<string, unknown> | unknown[] | string | number | boolean | null
  ) => Promise<T>
  delete: <T>(endpoint: string) => Promise<T>
}

export const useApiClient = (): UseApiClientResult => {
  // Versuche zuerst sidebase useAuth, sonst unsere erweiterte Variante useAppAuth
  let session: AuthSession = { value: undefined }
  try {
    if (typeof useAuth === 'function') {
      const a = useAuth() as AuthResult
      session = a?.session || session
    } else if (typeof useAppAuth === 'function') {
      const a = useAppAuth() as AuthResult
      session = a?.session || session
    }
  } catch {
    // still fallback
  }
  const config = useRuntimeConfig()
  const apiBase = (config.public.apiBase as string) || ''

  const apiCall = async <T>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> => {
    const base = apiBase.replace(/\/$/, '')
    const url = `${base}${endpoint}`
    const token = (session as { value?: { accessToken?: string } })?.value?.accessToken
    const hasNuxtFetch = typeof (globalThis as GlobalThis).$fetch === 'function'

    if (hasNuxtFetch) {
      // Nutzung von $fetch (unter Nuxt vorhanden, im Test via Mock) – relative URLs werden akzeptiert
      const nuxtFetch = (globalThis as GlobalThis).$fetch!
      // Generic wird hier nicht angewandt, da Mock ungetypt ist
      return (await nuxtFetch(url, {
        method: options.method || 'GET',
        headers: {
          ...(options.headers as Record<string, string> | undefined),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: options.body,
      })) as T
    }

    // Fallback: native fetch (Browser/Node). Hier brauchen wir absolute URL -> prefix falls relativ
    const absoluteUrl = url.startsWith('http')
      ? url
      : `http://localhost${url.startsWith('/') ? '' : '/'}${url}`

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> | undefined),
    }
    if (token) headers.Authorization = `Bearer ${token}`

    const response = await fetch(absoluteUrl, {
      ...options,
      method: options.method || 'GET',
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : options.body,
    })
    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`)
    }
    return (await response.json()) as T
  }

  const get = <T>(endpoint: string) => apiCall<T>(endpoint, { method: 'GET' })
  const post = <T>(
    endpoint: string,
    data?: Record<string, unknown> | unknown[] | string | number | boolean | null
  ) => apiCall<T>(endpoint, { method: 'POST', body: data })
  const put = <T>(
    endpoint: string,
    data?: Record<string, unknown> | unknown[] | string | number | boolean | null
  ) => apiCall<T>(endpoint, { method: 'PUT', body: data })
  const del = <T>(endpoint: string) => apiCall<T>(endpoint, { method: 'DELETE' })

  return { apiCall, get, post, put, delete: del }
}
