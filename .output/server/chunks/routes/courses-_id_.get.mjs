import { PrismaClient } from '@prisma/client'
import { d as defineEventHandler, g as getRouterParam, c as createError } from '../nitro/nitro.mjs'
import 'node:http'
import 'node:https'
import 'node:events'
import 'node:buffer'
import 'node:fs'
import 'node:path'
import 'node:crypto'
import 'node:url'

const prisma = new PrismaClient()
const courses__id__get = defineEventHandler(async (event) => {
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

export { courses__id__get as default }
//# sourceMappingURL=courses-_id_.get.mjs.map
