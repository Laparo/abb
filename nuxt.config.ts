// Nuxt 3 configuration with Vuetify and TypeScript strict
import { defineNuxtConfig } from 'nuxt/config'
import path from 'node:path'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  compatibilityDate: '2025-09-27',
  typescript: {
    strict: true,
    typeCheck: false, // handled in CI via vue-tsc
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'de',
      },
    },
  },
  // Make auth module optional for static SWA builds (set NUXT_ENABLE_AUTH=false in CI)
  modules: process.env.NUXT_ENABLE_AUTH !== 'false' ? ['@sidebase/nuxt-auth'] : [],
  ...(process.env.NUXT_ENABLE_AUTH !== 'false'
    ? {
        auth: {
          origin:
            process.env.NUXT_AUTH_ORIGIN ||
            process.env.AUTH_ORIGIN ||
            process.env.NEXTAUTH_URL ||
            process.env.AUTH_URL ||
            'http://localhost:3000',
          provider: {
            type: 'authjs',
          },
        },
      }
    : {}),
  vite: {
    // Vuetify via Vite plugin
    ssr: {
      noExternal: ['vuetify'],
    },
    // Achtung: Keine manuelle Chunk-Aufteilung, da dies Nuxts Chunk-Graph stören kann
    // und zu Runtime-Fehlern wie "Cannot access 'Ao' before initialization" führen kann.
    server: {
      fs: {
        // Zugriff auf externes Dashboard-Repo (Sibling) erlauben
        allow: [path.resolve(__dirname, '../vuetify-material-dashboard')],
      },
    },
    resolve: {
      alias: {
        // Lokale Dashboard-Komponentenquelle (siehe specs/coach-courses/quickstart.md)
        '@dashboard': path.resolve(__dirname, '../vuetify-material-dashboard/src'),
      },
    },
    vue: {
      template: {
        transformAssetUrls,
      },
    },
    plugins: [
      // Disable auto-import for better bundle size control - components must be explicitly imported
      vuetify({ autoImport: false }),
    ],
  },
  css: ['vuetify/styles'],
  build: {
    transpile: ['vuetify'],
  },
  nitro: {
    // Pin Nitro runtime behavior to a known date (see https://nitro.build/deploy#compatibility-date)
    compatibilityDate: '2025-09-27',
  },
  runtimeConfig: {
    public: {
      // Basis-URL für API-Aufrufe im statischen Hosting (SWA)
      // Wird über NUXT_PUBLIC_API_BASE gesetzt; leer => relative Pfade
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '',
      auth: {
        // Key name the auth module uses to read origin from env
        originEnvKey: 'NUXT_AUTH_ORIGIN',
        computed: {
          origin:
            process.env.NUXT_AUTH_ORIGIN ||
            process.env.AUTH_ORIGIN ||
            process.env.NEXTAUTH_URL ||
            process.env.AUTH_URL ||
            'http://localhost:3000',
          // default path for auth endpoints in nuxt-auth
          pathname: '/api/auth',
        },
      },
    },
  },
})
