// Nuxt 3 Frontend configuration with Vuetify (SPA mode for Azure Static Web Apps)
import { defineNuxtConfig } from 'nuxt/config'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  compatibilityDate: '2025-09-27',
  // SPA mode for Azure Static Web Apps
  ssr: false,
  nitro: {
    preset: 'static',
    prerender: {
      routes: ['/']
    }
  },
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
  // SPA mode - authentication handled via backend API calls
  modules: [],
  vite: {
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
  runtimeConfig: {
    public: {
      // Backend API URL for cross-origin calls
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3000',
      // Frontend origin for redirects and CORS
      origin: process.env.NUXT_PUBLIC_ORIGIN || 'http://localhost:3001',
    },
  },
})