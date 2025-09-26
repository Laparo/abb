// Vuetify plugin integration for Nuxt 3
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { defineNuxtPlugin } from 'nuxt/app'

export default defineNuxtPlugin((nuxtApp) => {
  // Register all Vuetify components/directives for SSR and runtime resolution
  const vuetify = createVuetify({
    components,
    directives,
  })
  nuxtApp.vueApp.use(vuetify)
})
