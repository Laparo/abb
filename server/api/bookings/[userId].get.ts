import { defineEventHandler, getRouterParam, createError } from 'h3'
import type { H3Event } from 'h3'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event: H3Event) => {
  const userIdParam = getRouterParam(event, 'userId')
  const userId = Number(userIdParam)
  if (!Number.isFinite(userId)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid user id' })
  }

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) {
    throw createError({ statusCode: 404, statusMessage: 'User not found' })
  }

  const bookings = await prisma.booking.findMany({
    where: { userId },
    orderBy: { bookedAt: 'desc' },
    include: {
      course: true,
    },
  })

  return bookings
})
