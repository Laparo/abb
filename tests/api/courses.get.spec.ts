/// <reference types="vitest" />
import '../utils/h3-globals'

// Mock PrismaClient used in the handler module
vi.mock('@prisma/client', () => {
  const findMany = vi
    .fn()
    .mockResolvedValue([
      { id: 1, title: 'Course A', description: 'A', startAt: null, endAt: null, capacity: 10 },
    ])
  return {
    PrismaClient: vi.fn(() => ({
      course: { findMany },
    })),
  }
})

describe('GET /api/courses handler', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns course list', async () => {
    const mod = await import('../../server/api/courses.get')
    const handler = mod.default as unknown as (e?: unknown) => Promise<unknown>
    const result = await handler()
    expect(result).toEqual([
      { id: 1, title: 'Course A', description: 'A', startAt: null, endAt: null, capacity: 10 },
    ])
  })
})
