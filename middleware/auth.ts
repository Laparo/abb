import { useAppAuth } from '~/composables/useAuth'
export default defineNuxtRouteMiddleware((to) => {
  // Nur für /account Routen anwenden
  if (!to.path.startsWith('/account')) {
    return
  }
  try {
    const { isAuthenticated, localUser } = useAppAuth()
    // Authentifizierung prüfen
    if (!isAuthenticated.value) {
      const redirectUrl = to.fullPath
      return navigateTo({
        path: '/auth/signin',
        query: { redirect: redirectUrl },
      })
    }

    // Benutzerstatus prüfen (lokaler Nutzer aus DB)
    const status = localUser.value?.status
    if (status && status !== 'ACTIVE') {
      if (status === 'DELETED') {
        return navigateTo('/auth/account-deleted')
      }
      if (status === 'INACTIVE') {
        return navigateTo('/auth/account-suspended')
      }
    }

    // Durchlassen
    return
  } catch (authError) {
    console.error('Auth middleware error:', authError)
    return navigateTo('/auth/error')
  }
})
