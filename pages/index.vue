<template>
  <v-app>
    <v-main>
      <v-container fluid>
        <v-row justify="center">
          <v-col cols="12" md="8">
            <v-card class="pa-6">
              <v-card-title class="text-h4 text-center mb-4"> ABB - Nuxt App </v-card-title>
              <v-card-text>
                <p class="text-body-1 mb-4">
                  Willkommen zur ABB-Anwendung! Diese Nuxt.js-App verwendet:
                </p>
                <v-list>
                  <v-list-item>
                    <v-list-item-title>⚡ Nuxt 3 mit TypeScript</v-list-item-title>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>🎨 Vuetify 3 Material Design</v-list-item-title>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>🔐 Nuxt Auth mit NextAuth.js</v-list-item-title>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>🗄️ Prisma ORM</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-card-text>
              <v-card-actions class="justify-center">
                <v-btn color="primary" variant="elevated" size="large" @click="navigateToCourses">
                  Kurse anzeigen
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
// Meta-Tags für SEO
useHead({
  title: 'ABB - Startseite',
  meta: [{ name: 'description', content: 'ABB Nuxt.js Anwendung mit Vuetify und TypeScript' }],
})

// Navigation zu Kursen
const navigateToCourses = () => {
  navigateTo('/courses')
}
</script>

<style scoped>
/* Zusätzliche Styles falls benötigt */
</style>
