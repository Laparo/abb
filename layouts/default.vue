<template>
  <v-app>
    <v-main tag="main" role="main">
      <slot />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
// Standardlayout für Vuetify-Wrapper
defineOptions({
  name: 'DefaultLayout',
})
</script>
