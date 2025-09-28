// Weiterleitung auf vereinheitlichten Auth-Composable (noch nicht migriert)
export * from '~/composables/useAuth'
/**
 * SPA Authentication composable
 * Handles authentication via backend API calls
 */
import { ref, computed, readonly } from 'vue'
import type { User } from '@prisma/client'

type BookingLite = { courseId: number; status: string }
type LocalUser = User & { bookings?: BookingLite[]; status: string }

interface AuthUser {
  id: string
  email?: string
  name?: string
  externalId?: string
}

interface Session {
  user: AuthUser
  expires: string
}

export const useAuth = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase as string
  const origin = config.public.origin as string

  // Reactive state
  const session = ref<Session | null>(null)
  const localUser = ref<LocalUser | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Computed properties
  const isAuthenticated = computed(() => !!session.value)
  const user = computed(() => session.value?.user || null)
  const isActiveUser = computed(() => localUser.value?.status === 'ACTIVE')

  /**
   * Check current authentication status
   */
  const checkAuth = async () => {
    try {
      isLoading.value = true
      error.value = null

      const response = await fetch(`${apiBase}/api/auth/session`, {
        credentials: 'include', // Include cookies for session
      })

      if (response.ok) {
        const sessionData = await response.json()
        session.value = sessionData

        // Sync with local database
        if (sessionData?.user) {
          await syncUserWithDatabase(sessionData.user)
        }
      } else {
        session.value = null
        localUser.value = null
      }
    } catch (err) {
      console.error('Auth check failed:', err)
      session.value = null
      localUser.value = null
      error.value = 'Authentication check failed'
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Sign in - redirect to backend auth
   */
  const signIn = (provider = 'microsoft-entra-external') => {
    // Redirect to backend authentication endpoint
    const callbackUrl = encodeURIComponent(`${origin}/auth/callback`)
    window.location.href = `${apiBase}/api/auth/signin/${provider}?callbackUrl=${callbackUrl}`
  }

  /**
   * Sign out
   */
  const signOut = async () => {
    try {
      isLoading.value = true
      error.value = null

      await fetch(`${apiBase}/api/auth/signout`, {
        method: 'POST',
        credentials: 'include',
      })

      session.value = null
      localUser.value = null

      // Redirect to home page
      await navigateTo('/')
    } catch (err) {
      console.error('Sign out failed:', err)
      error.value = 'Sign out failed'
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Sync authenticated user with local database
   */
  const syncUserWithDatabase = async (authUser: AuthUser) => {
    try {
      const { get } = useApiClient()
      const response = await get(`/api/auth/sync-user`, {
        method: 'POST',
        body: {
          externalId: authUser.externalId || authUser.id,
          email: authUser.email,
          name: authUser.name,
        },
      })

      localUser.value = (response as { user: LocalUser }).user
    } catch (err) {
      console.error('Failed to sync user with database:', err)
      // Don't throw here - authentication succeeded, database sync is secondary
    }
  }

  /**
   * Get user's access status for a course
   */
  const hasAccessToCourse = (courseId: number): boolean => {
    const bookings = localUser.value?.bookings
    if (!bookings || !Array.isArray(bookings)) return false

    return bookings.some(
      (booking: BookingLite) =>
        booking.courseId === courseId &&
        (booking.status === 'BOOKED' || booking.status === 'COMPLETED')
    )
  }

  /**
   * Get CSRF token for secure requests
   */
  const getCsrfToken = async () => {
    try {
      const response = await fetch(`${apiBase}/api/auth/csrf`, {
        credentials: 'include',
      })
      const data = await response.json()
      return data.csrfToken
    } catch (err) {
      console.error('Failed to get CSRF token:', err)
      return null
    }
  }

  // Auto-check auth status on composable creation
  if (process.client) {
    checkAuth()
  }

  return {
    // State
    session: readonly(session),
    localUser: readonly(localUser),
    isLoading: readonly(isLoading),
    error: readonly(error),

    // Computed
    isAuthenticated,
    user,
    isActiveUser,

    // Methods
    checkAuth,
    signIn,
    signOut,
    syncUserWithDatabase,
    hasAccessToCourse,
    getCsrfToken,
  }
}

// Alias for backward compatibility
export const useAppAuth = useAuth
