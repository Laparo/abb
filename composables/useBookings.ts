interface CreateBookingInput {
  userEmail: string
  courseId: number
}

export const useBookings = () => {
  const create = async (input: CreateBookingInput) => {
    return await $fetch<{ ok: boolean; bookingId: number }>('/api/bookings', {
      method: 'POST',
      body: input,
    })
  }

  return { create }
}
