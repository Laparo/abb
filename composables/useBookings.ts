import { ref } from 'vue'
import type { Booking } from '@prisma/client'
interface CreateBookingInput {
  userEmail: string
  courseId: number
}

export type BookingStatus = 'BOOKED' | 'CANCELLED' | 'COMPLETED'

export const useBookings = () => {
  const config = useRuntimeConfig()
  const base = config.public.apiBase?.replace(/\/$/, '') || ''
  const bookings = ref<Booking[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const create = async (input: CreateBookingInput) => {
    return await $fetch<{ ok: boolean; bookingId: number }>(`${base}/api/bookings`, {
      method: 'POST',
      body: input,
    })
  }

  const getBookings = async (userId: number) => {
    try {
      isLoading.value = true
      error.value = null
      const res = await $fetch<Booking[]>(`${base}/api/bookings/${userId}`)
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
