/**
 * API client for cross-origin calls to the backend
 * Centralized in root composables directory so Nuxt auto-import works.
 */
interface ApiRequestOptions extends RequestInit {
  /** Optional body object that will be JSON.stringified automatically */
  body?: any
}

interface UseApiClientResult {
  apiCall: <T>(endpoint: string, options?: ApiRequestOptions) => Promise<T>
  get: <T>(endpoint: string) => Promise<T>
  post: <T>(endpoint: string, data?: any) => Promise<T>
  put: <T>(endpoint: string, data?: any) => Promise<T>
  delete: <T>(endpoint: string) => Promise<T>
}

export const useApiClient = (): UseApiClientResult => {
  // Versuche zuerst sidebase useAuth, sonst unsere erweiterte Variante useAppAuth
  let session: any = { value: null }
  try {
    if (typeof useAuth === 'function') {
      const a: any = useAuth()
      session = a?.session || session
    } else if (typeof useAppAuth === 'function') {
      const a: any = useAppAuth()
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
    const token = (session as any)?.value?.accessToken
    const hasNuxtFetch = typeof (globalThis as any).$fetch === 'function'

    if (hasNuxtFetch) {
      // Nutzung von $fetch (unter Nuxt vorhanden, im Test via Mock) – relative URLs werden akzeptiert
      const nuxtFetch: any = (globalThis as any).$fetch
      try {
  // Generic wird hier nicht angewandt, da Mock ungetypt ist
  return await nuxtFetch(url, {
          method: options.method || 'GET',
          headers: {
            ...(options.headers as Record<string, string> | undefined),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: options.body,
        })
      } catch (e: any) {
        // Fehler direkt weiterreichen (Tests erwarten H3/Fetch Fehlerstruktur)
        throw e
      }
    }

    // Fallback: native fetch (Browser/Node). Hier brauchen wir absolute URL -> prefix falls relativ
    const absoluteUrl = url.startsWith('http') ? url : `http://localhost${url.startsWith('/') ? '' : '/'}${url}`

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
  const post = <T>(endpoint: string, data?: any) => apiCall<T>(endpoint, { method: 'POST', body: data })
  const put = <T>(endpoint: string, data?: any) => apiCall<T>(endpoint, { method: 'PUT', body: data })
  const del = <T>(endpoint: string) => apiCall<T>(endpoint, { method: 'DELETE' })

  return { apiCall, get, post, put, delete: del }
}
