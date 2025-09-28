import { ref } from 'vue'
import type { Booking } from '@prisma/client'

interface CreateBookingInput {
  userEmail: string
  courseId: number
}

export type BookingStatus = 'BOOKED' | 'CANCELLED' | 'COMPLETED'

// Unified composable using the shared useApiClient helper
export const useBookings = () => {
  const { get, post } = useApiClient()
  const bookings = ref<Booking[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const create = async (input: CreateBookingInput) => {
    return await post<{ ok: boolean; bookingId: number }>(
      '/api/bookings',
      input
    )
  }

  const getBookings = async (userId: number) => {
    try {
      isLoading.value = true
      error.value = null
      const res = await get<Booking[]>(`/api/bookings/${userId}`)
      bookings.value = res
      return res
    } catch (err) {
      const e = err as { data?: { message?: string }; message?: string }
      const msg = e?.data?.message || e?.message || 'Failed to load bookings'
      error.value = msg
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const refreshBookings = async (userId: number) => getBookings(userId)

  return { create, bookings, isLoading, error, getBookings, refreshBookings }
}
