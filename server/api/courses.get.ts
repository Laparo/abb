import { defineEventHandler, getQuery } from 'h3'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const q = getQuery(event)
  let take = 10
  if (typeof q.limit === 'string') {
    const parsed = Number.parseInt(q.limit, 10)
    if (Number.isFinite(parsed)) {
      // clamp to [1, 10]
      take = Math.max(1, Math.min(10, parsed))
    }
  }

  const rows = await prisma.course.findMany({
    take,
    orderBy: { startAt: 'asc' },
    select: {
      id: true,
      title: true,
      description: true,
      startAt: true,
      endAt: true,
      capacity: true,
      materials: {
        where: { isActive: true, type: 'VIDEO' },
        select: { url: true },
        take: 1,
        orderBy: { id: 'asc' },
      },
    },
  })

  const courses = rows.map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    startAt: r.startAt,
    endAt: r.endAt,
    capacity: r.capacity,
    previewVideoUrl: (r.materials && r.materials[0] && r.materials[0].url) || null,
  }))

  return courses
})
