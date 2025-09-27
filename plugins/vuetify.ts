// Vuetify plugin integration for Nuxt 3 (MD3 + MDI icons)
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { md3 } from 'vuetify/blueprints'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import { defineNuxtPlugin } from 'nuxt/app'
import '@mdi/font/css/materialdesignicons.css'

export default defineNuxtPlugin((nuxtApp) => {
  // Register all Vuetify components/directives for SSR and runtime resolution
  const vuetify = createVuetify({
    blueprint: md3,
    components,
    directives,
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: { mdi },
    },
    theme: {
      defaultTheme: 'light',
    },
  })
  nuxtApp.vueApp.use(vuetify)
})
