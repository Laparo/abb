<template>
  <VContainer class="course-materials">
    <VRow>
      <VCol cols="12">
        <!-- Course Header -->
        <VCard class="mb-6">
          <VCardTitle class="text-h4">
            {{ courseTitle || 'Course Materials' }}
          </VCardTitle>
          <VCardText>
            <VRow>
              <VCol cols="12" md="8">
                <p v-if="course?.description" class="text-body-1 mb-4">
                  {{ course.description }}
                </p>
                <div class="course-meta">
                  <VChip
                    v-if="booking?.status"
                    :color="getBookingStatusColor(booking.status)"
                    class="mr-2"
                  >
                    {{ booking.status }}
                  </VChip>
                  <span v-if="course?.startAt" class="text-body-2">
                    Start: {{ formatDate(course.startAt) }}
                  </span>
                  <span v-if="course?.endAt" class="text-body-2 ml-4">
                    End: {{ formatDate(course.endAt) }}
                  </span>
                </div>
              </VCol>
              <VCol cols="12" md="4" class="text-right">
                <VBtn to="/account" variant="outlined" prepend-icon="mdi-arrow-left">
                  Back to Dashboard
                </VBtn>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>

        <!-- Materials Section -->
        <VRow>
          <VCol cols="12">
            <VCard>
              <VCardTitle class="text-h5"> Course Materials </VCardTitle>

              <VCardText>
                <!-- Loading State -->
                <div v-if="isLoading" class="text-center py-8">
                  <VProgressCircular indeterminate color="primary" size="64" />
                  <p class="mt-4 text-body-1">Loading course materials...</p>
                </div>

                <!-- Error State -->
                <div v-else-if="error" class="error-state py-8">
                  <VAlert type="error" class="mb-4">
                    <template #title>Failed to Load Materials</template>
                    {{ error }}
                  </VAlert>
                  <VBtn color="primary" variant="outlined" @click="refreshMaterials">
                    Try Again
                  </VBtn>
                </div>

                <!-- Access Denied -->
                <div v-else-if="!hasAccess" class="access-denied py-8">
                  <VAlert type="warning" class="mb-4">
                    <template #title>Access Restricted</template>
                    You don't have access to materials for this course. Please check your booking
                    status.
                  </VAlert>
                  <VBtn to="/account" variant="outlined"> Back to Dashboard </VBtn>
                </div>

                <!-- Materials List -->
                <div v-else-if="materials.length > 0">
                  <CourseMaterialList
                    :materials="materials"
                    :course-id="courseId"
                    @material-access-error="handleMaterialError"
                  />
                </div>

                <!-- No Materials -->
                <div v-else class="no-materials py-8">
                  <VAlert type="info" class="mb-4">
                    <template #title>No Materials Available</template>
                    No materials have been uploaded for this course yet. Check back later.
                  </VAlert>
                </div>
              </VCardText>
            </VCard>
          </VCol>
        </VRow>

        <!-- Course Actions -->
        <VRow class="mt-6">
          <VCol cols="12">
            <VCard variant="outlined" class="course-actions">
              <VCardTitle class="text-h6"> Course Actions </VCardTitle>
              <VCardText>
                <VRow>
                  <VCol cols="12" sm="6" md="3">
                    <VBtn color="info" variant="outlined" block @click="refreshMaterials">
                      Refresh Materials
                    </VBtn>
                  </VCol>
                  <VCol cols="12" sm="6" md="3">
                    <VBtn
                      v-if="canCancelBooking"
                      color="error"
                      variant="outlined"
                      block
                      @click="showCancelDialog = true"
                    >
                      Cancel Booking
                    </VBtn>
                  </VCol>
                  <VCol cols="12" sm="6" md="3">
                    <VBtn to="/courses" color="success" variant="elevated" block>
                      Browse Other Courses
                    </VBtn>
                  </VCol>
                  <VCol cols="12" sm="6" md="3">
                    <VBtn to="/account" color="primary" variant="elevated" block>
                      My Dashboard
                    </VBtn>
                  </VCol>
                </VRow>
              </VCardText>
            </VCard>
          </VCol>
        </VRow>

        <!-- Booking Cancellation Dialog -->
        <VDialog v-model="showCancelDialog" max-width="600">
          <VCard>
            <VCardTitle class="text-h6"> Cancel Booking </VCardTitle>
            <VCardText>
              <VAlert type="warning" class="mb-4">
                Cancellation is only allowed up to 14 days before the course start date.
              </VAlert>
              <p>Are you sure you want to cancel your booking for "{{ course?.title }}"?</p>
              <p class="mt-2">
                This action cannot be undone and you will lose access to all course materials.
              </p>
            </VCardText>
            <VCardActions>
              <VSpacer />
              <VBtn variant="outlined" @click="showCancelDialog = false"> Keep Booking </VBtn>
              <VBtn color="error" variant="elevated" @click="cancelBooking"> Cancel Booking </VBtn>
            </VCardActions>
          </VCard>
        </VDialog>
      </VCol>
    </VRow>
  </VContainer>
</template>

<script setup lang="ts">
import {
  VContainer,
  VRow,
  VCol,
  VCard,
  VCardTitle,
  VCardText,
  VBtn,
  VChip,
  VAlert,
  VProgressCircular,
  VDialog,
  VCardActions,
  VSpacer,
} from 'vuetify/components'
import CourseMaterialList from '@/components/course/CourseMaterialList.vue'
import { useAppAuth } from '@/composables/useAuth'

// Set page metadata
definePageMeta({
  middleware: 'auth',
})

// Get route params
const route = useRoute()
const courseId = parseInt(route.params.id as string)

// Composables
const { localUser, hasAccessToCourse } = useAppAuth()
const { materials, isLoading, error, getMaterials, refreshMaterials } = useMaterials()

// Reactive data
type CourseLite = {
  id: number
  title: string
  description?: string | null
  startAt?: string | Date | null
  endAt?: string | Date | null
}
type BookingLite = { id: number; status: string; courseId: number }
const course = ref<CourseLite | null>(null)
const booking = ref<BookingLite | null>(null)
const courseTitle = ref<string>('')
const hasAccess = ref(false)
const showCancelDialog = ref(false)

// Computed properties
const canCancelBooking = computed(() => {
  if (!booking.value || booking.value.status !== 'BOOKED') return false

  const startVal = course.value?.startAt ?? new Date(0)
  const courseStart = new Date(startVal as string | number | Date)
  const fourteenDaysFromNow = new Date()
  fourteenDaysFromNow.setDate(fourteenDaysFromNow.getDate() + 14)

  return courseStart > fourteenDaysFromNow
})

// Load course and materials on mount
onMounted(async () => {
  await loadCourseData()
})

// Methods
const loadCourseData = async () => {
  try {
    // Check access first
    hasAccess.value = hasAccessToCourse(courseId)

    if (!hasAccess.value) {
      return
    }

    // Load course details
    const courseResponse = await $fetch(`/api/courses/${courseId}`)
    course.value = courseResponse
    courseTitle.value = courseResponse.title

    // Find user's booking for this course
    if (localUser.value?.bookings) {
      booking.value = localUser.value.bookings.find(
        (b: { courseId: number }) => b.courseId === courseId
      ) as BookingLite | null
    }

    // Load materials
    await getMaterials(courseId)
  } catch (err) {
    console.error('Failed to load course data:', err)
  }
}

const formatDate = (dateString: string | Date | null | undefined) => {
  if (!dateString) return 'Not specified'
  const date = new Date(dateString)
  return date.toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const getBookingStatusColor = (status: string) => {
  switch (status) {
    case 'BOOKED':
      return 'success'
    case 'COMPLETED':
      return 'info'
    case 'CANCELLED':
      return 'error'
    default:
      return 'grey'
  }
}

const handleMaterialError = (error: string) => {
  console.error('Material access error:', error)
  // Could show a toast notification here
}

const cancelBooking = async () => {
  try {
    await $fetch(`/api/bookings/${booking.value.id}/cancel`, {
      method: 'POST',
    })

    showCancelDialog.value = false

    // Redirect to dashboard after successful cancellation
    await navigateTo('/account')
  } catch (err) {
    console.error('Booking cancellation failed:', err)
    // Could show error notification here
  }
}

// Validate course ID
if (!courseId || isNaN(courseId)) {
  throw createError({
    statusCode: 400,
    statusMessage: 'Invalid course ID',
  })
}
</script>

<style scoped>
.course-materials {
  max-width: 1200px;
  margin: 0 auto;
}

.course-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.error-state,
.access-denied,
.no-materials {
  text-align: center;
}

.course-actions {
  background-color: rgba(0, 0, 0, 0.02);
}

@media (max-width: 768px) {
  .course-meta {
    flex-direction: column;
    align-items: flex-start;
  }

  .course-meta .text-body-2 {
    margin-left: 0 !important;
    margin-top: 4px;
  }
}
</style>
