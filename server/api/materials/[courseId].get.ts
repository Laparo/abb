import { PrismaClient } from '@prisma/client'
import type { Prisma, Booking } from '@prisma/client'
import { getServerSession } from '#auth'
import type { H3Event } from 'h3'
import crypto from 'crypto'

const prisma = new PrismaClient()

export default defineEventHandler(async (event: H3Event) => {
  const courseId = parseInt(getRouterParam(event, 'courseId') || '0')

  if (!courseId || isNaN(courseId)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid course ID',
    })
  }

  try {
    // Get user session
    const session = await getServerSession(event)

    const email = (session as { user?: { email?: string } } | null | undefined)?.user?.email
    if (!email) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Authentication required',
      })
    }

    // Find user in database
    const include = {
      bookings: {
        where: { courseId },
        include: { course: true },
      },
    } as const
    type UserWithBookings = Prisma.UserGetPayload<{ include: typeof include }>
    const user = (await prisma.user.findFirst({
      where: {
        AND: [
          { email: { equals: email } },
          { bookings: { some: { courseId: { equals: courseId } } } },
        ],
      },
      include,
    })) as UserWithBookings | null

    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found',
      })
    }

    // Check if user has access to this course
    const booking = user.bookings.find((b: Booking) => b.courseId === courseId)

    if (!booking) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Access denied: Course not booked',
      })
    }

    // Check booking status - allow BOOKED and COMPLETED, deny CANCELLED
    if (booking.status === 'CANCELLED') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Access denied: Booking cancelled',
      })
    }

    // Get course materials
    const materials = await prisma.material.findMany({
      where: {
        courseId,
        isActive: true,
      },
      orderBy: [
        { type: 'asc' }, // TEXT first, then VIDEO
        { title: 'asc' },
      ],
    })

    // Process materials based on type
    const processedMaterials = await Promise.all(
      materials.map(async (material) => {
        if (material.type === 'TEXT') {
          // Return text materials directly
          return {
            ...material,
            accessType: 'direct',
            url: material.url,
          }
        } else if (material.type === 'VIDEO') {
          // Generate signed streaming URL for videos
          const streamingUrl = await generateSignedStreamingUrl(material.url)
          return {
            ...material,
            accessType: 'stream',
            streamUrl: streamingUrl.url,
            expiresAt: streamingUrl.expiresAt,
            // Explicitly remove any download URLs
            downloadUrl: undefined,
          }
        }

        return material
      })
    )

    return {
      materials: processedMaterials,
      courseTitle: booking.course.title,
      accessGranted: true,
    }
  } catch (error: unknown) {
    console.error('Materials access error:', error)

    if (isNuxtError(error)) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to retrieve materials',
    })
  } finally {
    await prisma.$disconnect()
  }
})

// Generate signed streaming URL with short expiration
async function generateSignedStreamingUrl(materialPath: string) {
  const baseUrl = process.env.MATERIALS_CDN_BASE_URL || '/streaming'
  const secret = process.env.MATERIALS_SIGNING_SECRET || 'default-secret'

  // Create URL that expires in 4 hours
  const expiresAt = new Date(Date.now() + 4 * 60 * 60 * 1000)
  const timestamp = Math.floor(expiresAt.getTime() / 1000)

  // Create signature
  const payload = `${materialPath}:${timestamp}`
  const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex')

  // Construct signed URL
  const url = `${baseUrl}${materialPath}?expires=${timestamp}&signature=${signature}`

  return {
    url,
    expiresAt: expiresAt.toISOString(),
  }
}
