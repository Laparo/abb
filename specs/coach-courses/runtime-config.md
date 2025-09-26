# Runtime Config Mapping (Nuxt 3)

Ziel: Eindeutige Abbildung der .env-Variablen auf Nuxt runtimeConfig (server & public) für Microsoft Entra External ID und weitere Funktionen.

## .env → runtimeConfig

Server-seitig (nicht öffentlich):

- OIDC_ISSUER: string – OpenID Provider Issuer (z. B. https://{tenant}.ciamlogin.com/{tenantId}/v2.0/)
- OIDC_CLIENT_ID: string – App-Registrierung (Web)
- OIDC_CLIENT_SECRET: string – Client Secret (nur serverseitig)
- OIDC_REDIRECT_URI: string – z. B. <https://app.example.com/api/auth/callback>
- OIDC_POST_LOGOUT_REDIRECT_URI: string – z. B. <https://app.example.com/>
- OIDC_SCOPES: string – z. B. "openid profile email"

Öffentlich (Client-lesbar):

- public.BASE_URL: string – z. B. <https://app.example.com> (für Links)

## nuxt.config.ts (Skizze)

TypeScript-Skizze, keine Umsetzung hier – dient der eindeutigen Zuordnung.

```ts
export default defineNuxtConfig({
  runtimeConfig: {
    oidc: {
      issuer: process.env.OIDC_ISSUER,
      clientId: process.env.OIDC_CLIENT_ID,
      clientSecret: process.env.OIDC_CLIENT_SECRET,
      redirectUri: process.env.OIDC_REDIRECT_URI,
      postLogoutRedirectUri: process.env.OIDC_POST_LOGOUT_REDIRECT_URI,
      scopes: process.env.OIDC_SCOPES || 'openid profile email',
    },
    public: {
      baseUrl: process.env.NUXT_PUBLIC_BASE_URL,
    },
  },
})
```

Hinweise:

- Client Secret nur auf dem Server; niemals in `public` ablegen
- `NUXT_PUBLIC_*`-Variablen werden automatisch in `public` sichtbar
- `issuer` muss exakt mit dem Discovery-Dokument übereinstimmen; Trailing Slash konsistent halten
- `redirectUri` und `postLogoutRedirectUri` müssen in Entra-App-Registrierung whitelisted sein
