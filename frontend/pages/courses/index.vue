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
        <CourseCard
          class="h-100"
          :title="c.title"
          :description="c.description || ''"
          :date-range="formatDateRange(c.startAt, c.endAt)"
          :preview-video-url="c.previewVideoUrl || undefined"
        >
          <template #actions>
            <v-btn
              :to="`/courses/${c.id}`"
              color="primary"
              variant="flat"
              aria-label="Details zu {{ c.title }}"
            >
              Details
            </v-btn>
          </template>
        </CourseCard>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { VContainer, VRow, VCol, VAlert, VBtn } from 'vuetify/components'
import { useCourses } from '@/composables/useCourses'
import CourseCard from '@/components/course/CourseCard.vue'

useHead({ title: 'Kurse' })

const { list } = useCourses()
const { data, error } = await list({ limit: 10 })
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
