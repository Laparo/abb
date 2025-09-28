<template>
  <VContainer class="account-dashboard">
    <VRow>
      <VCol cols="12">
        <VCard>
          <VCardTitle class="text-h4 mb-4"> My Account </VCardTitle>

          <VCardText>
            <VRow>
              <VCol cols="12" md="4">
                <VCard variant="outlined" class="user-info">
                  <VCardTitle class="text-h6"> Profile Information </VCardTitle>
                  <VCardText>
                    <div class="user-details">
                      <p><strong>Name:</strong> {{ user?.name || 'Not provided' }}</p>
                      <p><strong>Email:</strong> {{ user?.email }}</p>
                      <p><strong>Member since:</strong> {{ formatDate(localUser?.createdAt) }}</p>
                      <p>
                        <strong>Status:</strong>
                        <VChip :color="getStatusColor(localUser?.status)" size="small">
                          {{ localUser?.status || 'Unknown' }}
                        </VChip>
                      </p>
                    </div>
                  </VCardText>
                </VCard>
              </VCol>

              <VCol cols="12" md="8">
                <VCard variant="outlined" class="courses-overview">
                  <VCardTitle class="text-h6"> My Courses </VCardTitle>

                  <VCardText>
                    <div v-if="isLoading" class="text-center">
                      <VProgressCircular indeterminate color="primary" />
                      <p class="mt-2">Loading your courses...</p>
                    </div>

                    <div v-else-if="error" class="error-state">
                      <VAlert type="error" class="mb-4">
                        {{ error }}
                      </VAlert>
                      <VBtn variant="outlined" @click="refreshBookings"> Try Again </VBtn>
                    </div>

                    <div v-else-if="!bookings?.length" class="empty-state">
                      <VAlert type="info" class="mb-4">
                        You haven't booked any courses yet.
                      </VAlert>
                      <VBtn to="/courses" color="primary" variant="elevated"> Browse Courses </VBtn>
                    </div>

                    <div v-else class="bookings-list">
                      <VRow>
                        <VCol v-for="booking in bookings" :key="booking.id" cols="12" md="6">
                          <VCard
                            variant="outlined"
                            class="booking-card"
                            :class="getBookingCardClass(booking.status)"
                          >
                            <VCardTitle class="text-subtitle-1">
                              {{ booking.course?.title || 'Course Title' }}
                            </VCardTitle>

                            <VCardText>
                              <p class="course-description">
                                {{ booking.course?.description || 'No description available' }}
                              </p>

                              <div class="booking-details mt-3">
                                <p>
                                  <strong>Status:</strong>
                                  <VChip
                                    :color="getBookingStatusColor(booking.status)"
                                    size="small"
                                  >
                                    {{ booking.status }}
                                  </VChip>
                                </p>
                                <p><strong>Booked:</strong> {{ formatDate(booking.bookedAt) }}</p>
                                <p v-if="booking.course?.startAt">
                                  <strong>Start Date:</strong>
                                  {{ formatDate(booking.course.startAt) }}
                                </p>
                                <p v-if="booking.course?.endAt">
                                  <strong>End Date:</strong> {{ formatDate(booking.course.endAt) }}
                                </p>
                              </div>
                            </VCardText>

                            <VCardActions>
                              <VBtn
                                v-if="canAccessMaterials(booking)"
                                :to="`/account/courses/${booking.courseId}`"
                                color="primary"
                                variant="elevated"
                                size="small"
                              >
                                View Materials
                              </VBtn>

                              <VBtn
                                v-if="canCancelBooking(booking)"
                                color="error"
                                variant="outlined"
                                size="small"
                                @click="initiateCancel(booking)"
                              >
                                Cancel Booking
                              </VBtn>
                            </VCardActions>
                          </VCard>
                        </VCol>
                      </VRow>
                    </div>
                  </VCardText>
                </VCard>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- Account Actions -->
    <VRow class="mt-6">
      <VCol cols="12">
        <VCard variant="outlined" class="account-actions">
          <VCardTitle class="text-h6"> Account Actions </VCardTitle>
          <VCardText>
            <VRow>
              <VCol cols="12" sm="6" md="3">
                <VBtn color="primary" variant="outlined" block @click="signOut"> Sign Out </VBtn>
              </VCol>
              <VCol cols="12" sm="6" md="3">
                <VBtn to="/courses" color="success" variant="elevated" block> Browse Courses </VBtn>
              </VCol>
              <VCol cols="12" sm="6" md="3">
                <VBtn color="info" variant="outlined" block @click="refreshData">
                  Refresh Data
                </VBtn>
              </VCol>
              <VCol cols="12" sm="6" md="3">
                <VBtn color="error" variant="text" block @click="showDeleteDialog = true">
                  Delete Account
                </VBtn>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- Account Deletion Dialog -->
    <VDialog v-model="showDeleteDialog" max-width="600">
      <VCard>
        <VCardTitle class="text-h6"> Delete Account </VCardTitle>
        <VCardText>
          <VAlert type="warning" class="mb-4">
            This action cannot be undone. All your personal data will be permanently deleted.
          </VAlert>
          <p>Are you sure you want to delete your account? This will:</p>
          <ul class="mt-2">
            <li>Remove all your personal information</li>
            <li>Cancel any active bookings</li>
            <li>Remove access to course materials</li>
            <li>Delete your account permanently</li>
          </ul>
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn variant="outlined" @click="showDeleteDialog = false"> Cancel </VBtn>
          <VBtn color="error" variant="elevated" @click="deleteAccount"> Delete Account </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
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
  VCardActions,
  VBtn,
  VChip,
  VAlert,
  VProgressCircular,
  VDialog,
  VSpacer,
} from 'vuetify/components'

// Set page metadata
definePageMeta({
  middleware: 'auth',
})

// Composables
const { user, localUser, signOut } = useAppAuth()
const { bookings, isLoading, error, getBookings, refreshBookings } = useBookings()

// Reactive data
const showDeleteDialog = ref(false)

// Load bookings on mount
onMounted(async () => {
  if (localUser.value?.id) {
    await getBookings(localUser.value.id)
  }
})

// Methods
const formatDate = (dateString: string | Date | null | undefined) => {
  if (!dateString) return 'Not specified'
  const date = new Date(dateString)
  return date.toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const getStatusColor = (status: string | undefined) => {
  switch (status) {
    case 'ACTIVE':
      return 'success'
    case 'INACTIVE':
      return 'warning'
    case 'DELETED':
      return 'error'
    default:
      return 'grey'
  }
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

const getBookingCardClass = (status: string) => {
  return {
    'booking-card--cancelled': status === 'CANCELLED',
    'booking-card--completed': status === 'COMPLETED',
    'booking-card--active': status === 'BOOKED',
  }
}

type BookingLite = {
  status: string
  course?: { startAt?: string | Date | null; endAt?: string | Date | null }
} & Record<string, unknown>
const canAccessMaterials = (booking: BookingLite) => {
  return booking.status === 'BOOKED' || booking.status === 'COMPLETED'
}

const canCancelBooking = (booking: BookingLite) => {
  if (booking.status !== 'BOOKED') return false

  const startVal = booking.course?.startAt ?? new Date(0)
  const courseStart = new Date(startVal as string | number | Date)
  const fourteenDaysFromNow = new Date()
  fourteenDaysFromNow.setDate(fourteenDaysFromNow.getDate() + 14)

  return courseStart > fourteenDaysFromNow
}

const initiateCancel = (booking: { id: number }) => {
  // TODO: Implement booking cancellation
  console.log('Cancel booking:', booking.id)
}

const refreshData = async () => {
  if (localUser.value?.id) {
    await getBookings(localUser.value.id)
  }
}

const deleteAccount = async () => {
  try {
    await $fetch('/api/user-delete', { method: 'POST' })
    showDeleteDialog.value = false
    await signOut()
    navigateTo('/')
  } catch (err) {
    console.error('Account deletion failed:', err)
  }
}
</script>

<style scoped>
.account-dashboard {
  max-width: 1200px;
  margin: 0 auto;
}

.user-details p {
  margin-bottom: 8px;
}

.booking-card {
  height: 100%;
  transition: all 0.3s ease;
}

.booking-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.booking-card--cancelled {
  opacity: 0.7;
}

.booking-card--completed {
  border-left: 4px solid #2196f3;
}

.booking-card--active {
  border-left: 4px solid #4caf50;
}

.course-description {
  color: rgba(0, 0, 0, 0.7);
  font-size: 0.9rem;
  line-height: 1.4;
}

.booking-details p {
  margin-bottom: 4px;
  font-size: 0.9rem;
}

.empty-state,
.error-state {
  text-align: center;
  padding: 2rem;
}

.account-actions {
  background-color: rgba(0, 0, 0, 0.02);
}
</style>
