import { PrismaClient } from '@prisma/client'
import { defineEventHandler } from 'h3'

const prisma = new PrismaClient()

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
