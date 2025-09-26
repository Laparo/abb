// Nuxt 3 configuration with Vuetify and TypeScript strict
import { defineNuxtConfig } from 'nuxt/config'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
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
  modules: [],
  vite: {
    // Vuetify via Vite plugin
    ssr: {
      noExternal: ['vuetify'],
    },
    vue: {
      template: {
        transformAssetUrls,
      },
    },
    plugins: [
      // Auto-resolve Vuetify components and handle treeshaking
      vuetify({ autoImport: true }),
    ],
  },
  css: ['vuetify/styles'],
  build: {
    transpile: ['vuetify'],
  },
  nitro: {
    // Pin Nitro runtime behavior to a known date (see https://nitro.build/deploy#compatibility-date)
    compatibilityDate: '2025-09-26',
  },
})
