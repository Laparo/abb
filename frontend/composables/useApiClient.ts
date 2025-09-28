/**
 * API client for cross-origin calls to the backend
 */
export const useApiClient = () => {
  const { data: session } = useAuth()
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase as string

  /**
   * Make authenticated API request to the backend
   */
  const apiCall = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    const url = `${apiBase}${endpoint}`

    // Add authentication header if session exists
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (session.value?.accessToken) {
      headers.Authorization = `Bearer ${session.value.accessToken}`
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * GET request to backend API
   */
  const get = <T>(endpoint: string): Promise<T> => {
    return apiCall<T>(endpoint, { method: 'GET' })
  }

  /**
   * POST request to backend API
   */
  const post = <T>(endpoint: string, data?: any): Promise<T> => {
    return apiCall<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  /**
   * PUT request to backend API
   */
  const put = <T>(endpoint: string, data?: any): Promise<T> => {
    return apiCall<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  /**
   * DELETE request to backend API
   */
  const del = <T>(endpoint: string): Promise<T> => {
    return apiCall<T>(endpoint, { method: 'DELETE' })
  }

  return {
    apiCall,
    get,
    post,
    put,
    delete: del,
  }
}