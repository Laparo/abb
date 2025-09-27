<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="mb-4">Kurse</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-alert v-if="error" type="error" variant="tonal">{{ error.message }}</v-alert>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-for="c in courses || []" :key="c.id" cols="12" md="6" lg="4">
        <v-card :to="`/courses/${c.id}`" class="h-100" variant="elevated">
          <v-card-title>{{ c.title }}</v-card-title>
          <v-card-text>
            <div class="text-body-2">{{ c.description }}</div>
            <div class="text-caption mt-2">
              {{ formatDateRange(c.startAt, c.endAt) }}
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn :to="`/courses/${c.id}`" color="primary" variant="flat">Details</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import {
  VContainer,
  VRow,
  VCol,
  VAlert,
  VCard,
  VCardTitle,
  VCardText,
  VCardActions,
  VBtn,
} from 'vuetify/components'
import { useCourses } from '@/composables/useCourses'

useHead({ title: 'Kurse' })

const { list } = useCourses()
const { data, error } = await list()
const courses = data.value

function formatDateRange(start?: string | null, end?: string | null) {
  if (!start && !end) return 'Termin wird bekanntgegeben'
  const s = start ? new Date(start).toLocaleDateString('de-DE') : '?'
  const e = end ? new Date(end).toLocaleDateString('de-DE') : '?'
  return `${s} – ${e}`
}
</script>

<style scoped>
.h-100 {
  height: 100%;
}
</style>
