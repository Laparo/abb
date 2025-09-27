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
  modules: [],
  vite: {
    // Vuetify via Vite plugin
    ssr: {
      noExternal: ['vuetify'],
    },
    // Kleinere, risikoarme Optimierung der Client-Bundle-Größe:
    // Teile Vendor-Code (Vuetify/Vue) in separate Chunks auf.
    build: {
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (id.includes('node_modules')) {
              if (id.includes('/vuetify')) return 'vuetify'
              if (id.includes('/vue') || id.includes('/vue-router')) return 'vue'
              return 'vendor'
            }
          },
        },
      },
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
})
