import { PrismaClient } from '@prisma/client'

declare global {
  var __prisma: PrismaClient | undefined
}

/**
 * Prisma singleton to prevent multiple instances during development hot reloads
 * and ensure proper connection management across the application.
 */
export const prisma = globalThis.__prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma
}
