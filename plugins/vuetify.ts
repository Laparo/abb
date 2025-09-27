// Vuetify plugin integration for Nuxt 3 (MD3 + MDI SVG icons)
import { createVuetify } from 'vuetify'
import { md3 } from 'vuetify/blueprints'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'
import { defineNuxtPlugin } from 'nuxt/app'

export default defineNuxtPlugin((nuxtApp) => {
  // Register all Vuetify components/directives for SSR and runtime resolution
  const vuetify = createVuetify({
    blueprint: md3,
    components,
    directives,
    icons: {
      defaultSet: 'mdi', // uses SVG icon set (mdi-svg)
      aliases,
      sets: { mdi },
    },
    theme: {
      defaultTheme: 'light',
    },
  })
  nuxtApp.vueApp.use(vuetify)
})
