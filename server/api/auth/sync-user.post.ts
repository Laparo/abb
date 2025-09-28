import { PrismaClient } from '@prisma/client'
import type { Prisma } from '@prisma/client'
import type { H3Event } from 'h3'

const prisma = new PrismaClient()

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody<{ email?: string; name?: string }>(event)
  const { email, name } = body

  if (!email) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required field: email',
    })
  }

  try {
    // Include definition and typed payload
    const include = {
      bookings: {
        include: {
          course: true,
        },
      },
    } as const
    type UserWithBookings = Prisma.UserGetPayload<{ include: typeof include }>

    // Find existing user by email
    let user = (await prisma.user.findFirst({
      where: {
        email,
      },
      include,
    })) as UserWithBookings | null

    if (user) {
      // Update existing user
      user = (await prisma.user.update({
        where: { id: user.id },
        data: {
          email,
          name: name || user.name,
        },
        include,
      })) as UserWithBookings
    } else {
      // Create new user
      user = (await prisma.user.create({
        data: {
          email,
          name,
        },
        include,
      })) as UserWithBookings
    }

    return {
      user,
      message: 'User synchronized successfully',
    }
  } catch (error) {
    console.error('User sync error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to synchronize user',
    })
  } finally {
    await prisma.$disconnect()
  }
})
