// Nuxt 3 configuration with Vuetify and TypeScript strict
import { defineNuxtConfig } from 'nuxt/config'

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
    plugins: [],
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
