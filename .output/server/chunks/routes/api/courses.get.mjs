import { PrismaClient } from '@prisma/client'
import { d as defineEventHandler } from '../../nitro/nitro.mjs'
import 'node:http'
import 'node:https'
import 'node:events'
import 'node:buffer'
import 'node:fs'
import 'node:path'
import 'node:crypto'
import 'node:url'

const prisma = new PrismaClient()
const courses_get = defineEventHandler(async () => {
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

export { courses_get as default }
//# sourceMappingURL=courses.get.mjs.map
