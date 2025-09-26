import { PrismaClient } from '@prisma/client'
import { d as defineEventHandler, r as readBody, c as createError } from '../../nitro/nitro.mjs'
import 'node:http'
import 'node:https'
import 'node:events'
import 'node:buffer'
import 'node:fs'
import 'node:path'
import 'node:crypto'
import 'node:url'

const prisma = new PrismaClient()
const bookings_post = defineEventHandler(async (event) => {
  let body = void 0
  try {
    body = await readBody(event)
  } catch {
    body = event == null ? void 0 : event.body
  }
  if (!(body == null ? void 0 : body.userEmail) || !(body == null ? void 0 : body.courseId)) {
    throw createError({ statusCode: 400, statusMessage: 'userEmail and courseId are required' })
  }
  const course = await prisma.course.findUnique({
    where: { id: Number(body.courseId) },
    include: { bookings: true },
  })
  if (!course) {
    throw createError({ statusCode: 404, statusMessage: 'Course not found' })
  }
  if (course.capacity != null) {
    const active = course.bookings.filter((b) => b.status === 'BOOKED').length
    if (active >= course.capacity) {
      throw createError({ statusCode: 409, statusMessage: 'Course is fully booked' })
    }
  }
  let user = await prisma.user.findUnique({ where: { email: body.userEmail } })
  if (!user) {
    user = await prisma.user.create({ data: { email: body.userEmail } })
  }
  const booking = await prisma.booking.create({
    data: { userId: user.id, courseId: course.id },
  })
  return { ok: true, bookingId: booking.id }
})

export { bookings_post as default }
//# sourceMappingURL=bookings.post.mjs.map
