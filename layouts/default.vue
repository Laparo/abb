<template>
  <v-app>
    <v-main tag="main" role="main">
      <slot />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { VApp, VMain } from 'vuetify/components'

// Standardlayout für Vuetify-Wrapper
defineOptions({
  name: 'DefaultLayout',
})
</script>
