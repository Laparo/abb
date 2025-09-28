// Konsolidierte Auth: delegiert an sidebase/nuxt-auth useAuth und erweitert lokale User-Daten
import { ref, computed, readonly } from 'vue'
import type { User } from '@prisma/client'

type BookingLite = { courseId: number; status: string }
type LocalUser = User & { bookings?: BookingLite[]; status: string }

interface SessionData {
  value?: {
    user?: {
      id?: string
      name?: string
      email?: string
    }
  }
}

interface StatusRef {
  value?: string
}

interface BaseAuth {
  data?: SessionData
  status?: StatusRef
  signIn?: (...args: unknown[]) => Promise<unknown>
  signOut?: (...args: unknown[]) => Promise<unknown>
}

export const useAppAuth = () => {
  // Original useAuth des Auth-Moduls (Auto-Import von sidebase/nuxt-auth)
  const baseAuth: BaseAuth = (globalThis as { useAuth?: () => unknown }).useAuth
    ? ((useAuth as () => unknown)() as BaseAuth)
    : {}
  const { data: session, status, signIn: authSignIn, signOut: authSignOut } = baseAuth
  const localUser = ref<LocalUser | null>(null)
  const error = ref<string | null>(null)
  const isLoading = ref(false)

  const isAuthenticated = computed(() => status?.value === 'authenticated')
  const user = computed(() => session?.value?.user || null)

  type AuthUserLite = {
    email?: string | null
    name?: string | null
    externalId?: string | null
    sub?: string | null
  }

  const syncUserWithDatabase = async (authUser: AuthUserLite) => {
    try {
      const { post } = useApiClient()
      const response = await post<{ user: LocalUser }>(`/api/auth/sync-user`, {
        externalId: authUser.externalId || authUser.sub || undefined,
        email: authUser.email || undefined,
        name: authUser.name || undefined,
      })
      localUser.value = response.user
    } catch (err) {
      console.error('Failed to sync user with database:', err)
    }
  }

  const signIn = async () => {
    if (!authSignIn) return
    try {
      isLoading.value = true
      error.value = null
      await authSignIn('microsoft-entra-external')
      if (session?.value?.user) await syncUserWithDatabase(session.value.user)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Authentication failed'
    } finally {
      isLoading.value = false
    }
  }

  const signOut = async () => {
    if (!authSignOut) return
    try {
      isLoading.value = true
      error.value = null
      localUser.value = null
      await authSignOut()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Sign out failed'
    } finally {
      isLoading.value = false
    }
  }

  const hasAccessToCourse = (courseId: number): boolean => {
    const bookings = localUser.value?.bookings
    if (!bookings) return false
    return bookings.some(
      (b) => b.courseId === courseId && (b.status === 'BOOKED' || b.status === 'COMPLETED')
    )
  }

  const isActiveUser = computed(() => localUser.value?.status === 'ACTIVE')

  const initializeAuth = async () => {
    if (isAuthenticated.value && session?.value?.user && !localUser.value) {
      await syncUserWithDatabase(session.value.user)
    }
  }

  if (process.client) void initializeAuth()

  return {
    user,
    session,
    status,
    localUser: readonly(localUser),
    isAuthenticated,
    isActiveUser,
    isLoading: readonly(isLoading),
    error: readonly(error),
    signIn,
    signOut,
    syncUserWithDatabase,
    hasAccessToCourse,
    initializeAuth,
  }
}

// Hinweis: Kein re-export als useAuth um Konflikt mit sidebase/nuxt-auth zu vermeiden.
