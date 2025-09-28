// Nuxt 3 Backend configuration (API-only mode for Azure App Service)
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2025-09-27',
  // API-only mode - no frontend rendering
  experimental: {
    noVue: true, // Remove Vue for API-only mode
  },
  typescript: {
    strict: true,
    typeCheck: false, // handled in CI via vue-tsc
  },
  modules: ['@sidebase/nuxt-auth'],
  auth: {
    origin: process.env.NUXT_AUTH_ORIGIN || 'http://localhost:3000',
    provider: {
      type: 'authjs',
    },
  },
  nitro: {
    // Azure App Service preset
    preset: 'azure-functions',
    compatibilityDate: '2025-09-27',
    experimental: {
      wasm: false,
    },
    // CORS configuration for SPA frontend
    cors: {
      origin: process.env.NODE_ENV === 'development'
        ? ['http://localhost:3001']
        : [
            process.env.FRONTEND_ORIGIN || 'https://abb-frontend.azurestaticapps.net',
            // Allow any *.azurestaticapps.net subdomain for flexibility
            /https:\/\/.*\.azurestaticapps\.net$/
          ],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
    },
  },
  runtimeConfig: {
    public: {
      auth: {
        originEnvKey: 'NUXT_AUTH_ORIGIN',
        computed: {
          origin: process.env.NUXT_AUTH_ORIGIN || 'http://localhost:3000',
          pathname: '/api/auth',
        },
      },
    },
    // Server-only environment variables
    database: {
      url: process.env.DATABASE_URL,
    },
    entra: {
      tenantId: process.env.NUXT_ENTRA_TENANT_ID,
      clientId: process.env.NUXT_ENTRA_CLIENT_ID,
      clientSecret: process.env.NUXT_ENTRA_CLIENT_SECRET,
    },
  },
})