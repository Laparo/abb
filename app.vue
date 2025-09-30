<template>
  <v-app>
    <!-- Navigation Bar -->
    <v-app-bar color="primary" dark>
      <v-app-bar-title>
        <NuxtLink to="/" class="text-decoration-none text-white"> ABB </NuxtLink>
      </v-app-bar-title>

      <v-spacer />

      <v-btn
        icon
        :aria-label="isDark ? 'Zu hellem Modus wechseln' : 'Zu dunklem Modus wechseln'"
        @click="toggleTheme"
      >
        <v-icon>{{ isDark ? 'mdi-brightness-7' : 'mdi-brightness-4' }}</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- Main Content -->
    <v-main>
      <NuxtPage />
    </v-main>

    <!-- Footer -->
    <v-footer color="grey-lighten-3" class="text-center">
      <div class="px-4">
        <strong>ABB</strong> &copy; {{ new Date().getFullYear() }} - Powered by Nuxt 3 + Vuetify 3
      </div>
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
// Theme Management - simplified for build compatibility
const isDark = ref(false)

const toggleTheme = () => {
  isDark.value = !isDark.value
  // Theme toggle functionality can be implemented later if needed
}

// Global Meta Tags
useHead({
  htmlAttrs: {
    lang: 'de',
  },
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'format-detection', content: 'telephone=no' },
  ],
})
</script>

<style>
/* Global Styles */
html {
  scroll-behavior: smooth;
}

.text-decoration-none {
  text-decoration: none !important;
}
</style>
