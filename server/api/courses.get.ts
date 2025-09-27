import { defineEventHandler } from 'h3'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async () => {
  const courses = await prisma.course.findMany({
    orderBy: { startAt: 'asc' },
    select: {
      id: true,
      title: true,
      description: true,
      startAt: true,
      endAt: true,
      capacity: true,
    },
  })
  return courses
})
