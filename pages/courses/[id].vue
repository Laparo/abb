<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-btn variant="text" :to="'/courses'">← Zurück zur Übersicht</v-btn>
        <h1 class="mb-2">{{ course?.title || 'Kurs' }}</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="8">
        <v-card>
          <v-card-text>
            <p>{{ course?.description }}</p>
            <p class="text-caption">
              Zeitraum: {{ formatDateRange(course?.startAt, course?.endAt) }}
            </p>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>Buchen</v-card-title>
          <v-card-text>
            <v-text-field v-model="email" label="E-Mail" type="email" density="comfortable" />
            <v-alert v-if="bookError" type="error" class="mt-2" variant="tonal">
              {{ bookError }}
            </v-alert>
            <v-alert v-if="bookSuccess" type="success" class="mt-2" variant="tonal">
              Buchung erfolgreich!
            </v-alert>
          </v-card-text>
          <v-card-actions>
            <v-btn :loading="booking" color="primary" variant="flat" @click="book">
              Jetzt buchen
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useCourses } from '@/composables/useCourses'
import { useBookings } from '@/composables/useBookings'

useHead({ title: 'Kursdetails' })

const route = useRoute()
const id = Number(route.params.id)
const { getById } = useCourses()
const { data } = await getById(id)
const course = data

const email = ref('')
const booking = ref(false)
const bookError = ref('')
const bookSuccess = ref(false)

const { create } = useBookings()

async function book() {
  bookError.value = ''
  bookSuccess.value = false
  if (!email.value) {
    bookError.value = 'Bitte E-Mail-Adresse eingeben.'
    return
  }
  booking.value = true
  try {
    await create({ userEmail: email.value, courseId: id })
    bookSuccess.value = true
  } catch (e: unknown) {
    const err = e as { data?: { message?: string }; message?: string }
    bookError.value = err?.data?.message || err?.message || 'Fehler bei der Buchung'
  } finally {
    booking.value = false
  }
}

function formatDateRange(start?: string | null, end?: string | null) {
  if (!start && !end) return 'Termin wird bekanntgegeben'
  const s = start ? new Date(start).toLocaleDateString('de-DE') : '?'
  const e = end ? new Date(end).toLocaleDateString('de-DE') : '?'
  return `${s} – ${e}`
}
</script>

<style scoped></style>
