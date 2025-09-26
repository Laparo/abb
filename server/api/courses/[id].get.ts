import { PrismaClient } from '@prisma/client'
import { defineEventHandler, getRouterParam, createError } from 'h3'
import type { H3Event } from 'h3'

const prisma = new PrismaClient()

export default defineEventHandler(async (event: H3Event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isFinite(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid course id' })
  }
  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      materials: {
        where: { isActive: true },
        select: { id: true, type: true, title: true },
      },
    },
  })
  if (!course) {
    throw createError({ statusCode: 404, statusMessage: 'Course not found' })
  }
  return course
})
