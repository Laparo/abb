// Nuxt 3 configuration with Vuetify and TypeScript strict
import { defineNuxtConfig } from 'nuxt/config'
import path from 'node:path'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  compatibilityDate: '2025-09-29',
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
  modules: ['@sidebase/nuxt-auth'],

  // Runtime Configuration
  runtimeConfig: {
    // Private keys (only available on server-side)
    authSecret: process.env.NUXT_AUTH_SECRET,

    // Public keys (exposed to client-side)
    public: {
      authUrl: process.env.NUXT_PUBLIC_AUTH_URL || '/api/auth',
    },
  },

  // Auth Configuration
  auth: {
    baseURL:
      process.env.AUTH_ORIGIN ||
      process.env.NUXT_PUBLIC_AUTH_URL ||
      'http://localhost:3000/api/auth',
    provider: {
      type: 'authjs',
    },
  },
  vite: {
    // Vuetify via Vite plugin
    ssr: {
      noExternal: ['vuetify'],
    },
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
    // Vite plugins are injected via hook below to ensure proper order in Nuxt
  },
  hooks: {
    // Ensure Vuetify Vite plugin is added for both client and server builds
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    'vite:extendConfig'(config: any) {
      // Initialize plugins array if missing and push Vuetify plugin
      ;(config.plugins || (config.plugins = [])).push(vuetify({ autoImport: true }))

      // EBADF-Fix: Optimiere Vite dev server file watching
      if (config.server) {
        config.server.watch = {
          usePolling: true, // Polling reduziert EBADF auf MacOS
          interval: 2500, // Weniger häufig prüfen
          binaryInterval: 5000, // Noch seltener für Binärdateien
          ignored: [
            '**/node_modules/**',
            '**/.git/**',
            '**/dist/**',
            '**/.nuxt/**',
            '**/.output/**',
            '**/coverage/**',
            '**/playwright-report/**',
            '**/test-results/**',
            '**/prisma/**',
            '**/dev-e2e.db',
            '**/dev.db',
            '**/migrations/**',
          ],
        }

        // Stabilere HMR-Konfiguration
        config.server.hmr = {
          port: 24678,
          clientPort: 24678,
        }
      }
    },
  },
  css: ['vuetify/styles'],
  build: {
    transpile: ['vuetify'],
  },
  nitro: {
    // Pin Nitro runtime behavior to a known date (see https://nitro.build/deploy#compatibility-date)
    compatibilityDate: '2025-09-29',
    // Azure Static Web Apps preset für korrekten Build Output
    preset: 'azure-swa',
    // Prerendering für statische Seitenerstellung
    prerender: {
      routes: ['/', '/courses'],
      crawlLinks: true,
      failOnError: false,
    },
  },
  // Static site generation für Azure Static Web Apps
  ssr: true,
})
