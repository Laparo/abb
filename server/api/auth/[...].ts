import { NuxtAuthHandler } from '#auth'
import type { AuthOptions, Profile } from 'next-auth'
import { randomUUID } from 'crypto'

// Helper to build the correct OpenID Connect discovery URL for Microsoft Entra External ID (ex Azure AD B2C)
// External ID requires a user flow (policy) like B2C_1_signupsignin to be present in the discovery URL.
function getEntraWellKnown(): string | undefined {
  const tenantName = process.env.NUXT_ENTRA_TENANT_NAME
  const tenantId = process.env.NUXT_ENTRA_TENANT_ID
  // Prefer explicit sign-in policy; fallback to sign-up policy if provided (combined flows typically use one policy)
  const policy = process.env.NUXT_ENTRA_POLICY_SIGNIN || process.env.NUXT_ENTRA_POLICY_SIGNUP
  // Allow overriding base domain; defaults to ciamlogin.com (External ID). For legacy B2C use b2clogin.com.
  const baseDomain = process.env.NUXT_ENTRA_LOGIN_DOMAIN || 'ciamlogin.com'
  // Prefer explicit tenant domain, otherwise derive default onmicrosoft.com domain
  const tenantDomain =
    process.env.NUXT_ENTRA_TENANT_DOMAIN ||
    (tenantName ? `${tenantName}.onmicrosoft.com` : undefined)

  if (!tenantName || !tenantId) {
    console.warn(
      '[auth] Missing NUXT_ENTRA_TENANT_NAME or NUXT_ENTRA_TENANT_ID – Microsoft Entra provider will not work.'
    )
    return undefined
  }
  if (!policy) {
    console.warn(
      '[auth] Missing NUXT_ENTRA_POLICY_SIGNIN (or NUXT_ENTRA_POLICY_SIGNUP) – add a user flow/policy like B2C_1_signupsignin to enable login.'
    )
    return undefined
  }
  if (!policy.startsWith('B2C_')) {
    console.warn(
      `[auth] Policy '${policy}' does not start with 'B2C_'. In External ID/B2C, the effective policy name is usually prefixed, e.g. 'B2C_1_${policy}'.`
    )
  }
  // Preferred format (path-based):
  // https://{tenant}.ciamlogin.com/{tenant}.onmicrosoft.com/{policy}/v2.0/.well-known/openid-configuration
  if (tenantDomain) {
    return `https://${tenantName}.${baseDomain}/${tenantDomain}/${encodeURIComponent(policy)}/v2.0/.well-known/openid-configuration`
  }
  // Fallback (query param based with tenant ID):
  // https://{tenant}.ciamlogin.com/{tenantId}/v2.0/.well-known/openid-configuration?p={policy}
  return `https://${tenantName}.${baseDomain}/${tenantId}/v2.0/.well-known/openid-configuration?p=${encodeURIComponent(policy)}`
}

export const authOptions: AuthOptions = {
  secret: process.env.NUXT_AUTH_SECRET,
  providers: [
    {
      id: 'microsoft-entra-external',
      name: 'Microsoft Entra External ID',
      type: 'oauth',
      wellKnown: getEntraWellKnown(),
      clientId: process.env.NUXT_ENTRA_CLIENT_ID,
      clientSecret: process.env.NUXT_ENTRA_CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'openid profile email',
          response_type: 'code',
          response_mode: 'query',
          // Ensure the user flow/policy is also applied on authorization endpoint
          ...(process.env.NUXT_ENTRA_POLICY_SIGNIN || process.env.NUXT_ENTRA_POLICY_SIGNUP
            ? { p: process.env.NUXT_ENTRA_POLICY_SIGNIN || process.env.NUXT_ENTRA_POLICY_SIGNUP }
            : {}),
        },
      },
      idToken: true,
      checks: ['pkce', 'state'],
      profile(
        profile: Profile & {
          sub?: string
          oid?: string
          id?: string
          email?: string
          name?: string
        }
      ) {
        const id = String(profile.sub || profile.oid || profile.id || randomUUID())
        const email = profile.email
        const name = profile.name
        return { id, email, name }
      },
    },
  ],
  callbacks: {
    async signIn() {
      // Here we would sync the user with our local database
      // For now, just allow sign in
      return true
    },
    async jwt({ token, user, profile }) {
      // Store externalId in JWT token for database lookups
      const externalId =
        (user as { externalId?: string } | null | undefined)?.externalId ||
        (profile as { sub?: string } | null | undefined)?.sub
      if (externalId) {
        ;(token as Record<string, unknown>).externalId = externalId
      }
      return token
    },
    async session({ session, token }) {
      // Add externalId to session for client-side access
      const t = token as Record<string, unknown>
      if (t.externalId && session.user) {
        ;(session.user as Record<string, unknown>).externalId = t.externalId as string
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
}

export default NuxtAuthHandler(authOptions)
