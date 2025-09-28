<template>
  <v-app>
    <v-main tag="main" role="main">
      <v-container class="py-8">
        <h1 class="text-h5 mb-4">{{ title }}</h1>
        <v-row align="center" justify="center">
          <v-col cols="12" md="8" lg="6">
            <v-card variant="elevated">
              <v-card-title class="text-h6">
                {{ message }}
              </v-card-title>
              <v-card-text>
                <p class="mb-4">Bitte nutzen Sie den folgenden Link:</p>
                <NuxtLink to="/" aria-label="Zur Startseite zurückkehren">Zur Startseite</NuxtLink>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  VApp,
  VMain,
  VContainer,
  VRow,
  VCol,
  VCard,
  VCardTitle,
  VCardText,
} from 'vuetify/components'

const props = defineProps<{ error: { statusCode?: number; message?: string } }>()

const title = computed(() => (props.error?.statusCode === 404 ? 'Seite nicht gefunden' : 'Fehler'))
const message = computed(
  () => props.error?.message || 'Es ist ein unerwarteter Fehler aufgetreten.'
)

useHead({
  title: () => (props.error?.statusCode === 404 ? '404 – Seite nicht gefunden' : 'Fehler'),
})
</script>

<style scoped>
.mb-4 {
  margin-bottom: 1rem;
}
</style>
