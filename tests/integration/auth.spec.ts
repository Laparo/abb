import { describe, it, expect } from 'vitest'
import { useAppAuth } from '~/composables/useAuth'

describe('Authentication Integration', () => {
  let auth: ReturnType<typeof useAppAuth>

  beforeEach(() => {
    auth = useAppAuth()
  })

  it('should provide authentication state', () => {
    expect(auth).toBeDefined()
    expect(auth.user).toBeDefined()
    expect(auth.isAuthenticated).toBeDefined()
    expect(auth.signIn).toBeDefined()
    expect(auth.signOut).toBeDefined()
  })

  it('should start with unauthenticated state', () => {
    expect(auth.isAuthenticated.value).toBe(false)
    expect(auth.user.value).toBeNull()
  })

  it('should expose sign in/out functions', async () => {
    expect(auth.signIn).toBeTypeOf('function')
    expect(auth.signOut).toBeTypeOf('function')
  })

  // Sign-in/out flows are covered in e2e; here we only assert API surface

  it('should expose local user sync helpers', async () => {
    expect(auth.syncUserWithDatabase).toBeDefined()
    expect(auth.initializeAuth).toBeDefined()
  })

  it('should expose error/loading state', async () => {
    expect(auth.error).toBeDefined()
    expect(auth.isLoading).toBeDefined()
  })
})
