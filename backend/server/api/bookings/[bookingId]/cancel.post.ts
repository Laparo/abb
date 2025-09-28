import { defineEventHandler, getRouterParam, createError } from 'h3'
import type { H3Event } from 'h3'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event: H3Event) => {
  const bookingIdParam = getRouterParam(event, 'bookingId')
  const bookingId = Number(bookingIdParam)
  if (!Number.isFinite(bookingId)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid booking id' })
  }

  const booking = await prisma.booking.findUnique({
    include: { course: true },
    where: { id: bookingId },
  })
  if (!booking) {
    throw createError({ statusCode: 404, statusMessage: 'Booking not found' })
  }

  // Cancellation allowed only 14+ days before course start
  const courseStart = booking.course?.startAt ? new Date(booking.course.startAt) : null
  if (courseStart) {
    const fourteenDaysFromNow = new Date()
    fourteenDaysFromNow.setDate(fourteenDaysFromNow.getDate() + 14)
    if (!(courseStart > fourteenDaysFromNow)) {
      throw createError({ statusCode: 409, statusMessage: 'Cancellation window passed' })
    }
  }

  const updated = await prisma.booking.update({
    where: { id: bookingId },
    data: { status: 'CANCELLED', cancelledAt: new Date() },
  })

  return { ok: true, bookingId: updated.id }
})
