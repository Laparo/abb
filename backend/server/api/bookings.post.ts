import { defineEventHandler, readBody, createError } from 'h3'
import type { H3Event } from 'h3'
import { prisma } from '~/server/utils/prisma'

interface Body {
  userEmail: string
  courseId: number
}

export default defineEventHandler(async (event: H3Event) => {
  let body = undefined as unknown as Partial<Body>
  try {
    body = (await readBody(event)) as Partial<Body>
  } catch {
    // Vitest: allow passing plain objects with a `body` field
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body = (event as any)?.body as Partial<Body>
  }
  // Simple debug logs to help diagnose E2E flakiness

  console.log('[api/bookings] incoming body:', body)
  if (!body?.userEmail || !body?.courseId) {
    throw createError({ statusCode: 400, statusMessage: 'userEmail and courseId are required' })
  }
  const course = await prisma.course.findUnique({
    where: { id: Number(body.courseId) },
    include: { bookings: true },
  })

  console.log(
    '[api/bookings] course lookup:',
    !!course && { id: course.id, capacity: course.capacity, bookings: course.bookings.length }
  )
  if (!course) {
    throw createError({ statusCode: 404, statusMessage: 'Course not found' })
  }
  // Kapazitätsprüfung (falls gesetzt)
  if (course.capacity != null) {
    const active = course.bookings.filter((b) => b.status === 'BOOKED').length

    console.log('[api/bookings] capacity check:', { active, capacity: course.capacity })
    if (active >= course.capacity) {
      throw createError({ statusCode: 409, statusMessage: 'Course is fully booked' })
    }
  }
  // Nutzer finden/erstellen (rudimentär für v1)
  let user = await prisma.user.findUnique({ where: { email: body.userEmail } })
  if (!user) {
    user = await prisma.user.create({ data: { email: body.userEmail } })
  }
  const booking = await prisma.booking.create({
    data: { userId: user.id, courseId: course.id },
  })
  // TODO: E-Mail-Bestätigung senden (Adapter)

  console.log('[api/bookings] booking created:', { bookingId: booking.id })
  return { ok: true, bookingId: booking.id }
})
