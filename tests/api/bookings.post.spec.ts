/// <reference types="vitest" />
import '../utils/h3-globals'

const mockCourseFindUnique = vi.fn()
const mockUserFindUnique = vi.fn()
const mockUserCreate = vi.fn()
const mockBookingCreate = vi.fn()

vi.mock('@prisma/client', () => {
  return {
    PrismaClient: vi.fn(() => ({
      course: { findUnique: mockCourseFindUnique },
      user: { findUnique: mockUserFindUnique, create: mockUserCreate },
      booking: { create: mockBookingCreate },
    })),
  }
})

describe('POST /api/bookings', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('creates a booking (happy path)', async () => {
    mockCourseFindUnique.mockResolvedValueOnce({
      id: 1,
      capacity: 2,
      bookings: [{ status: 'BOOKED' }],
    })
    mockUserFindUnique.mockResolvedValueOnce(null)
    mockUserCreate.mockResolvedValueOnce({ id: 7, email: 'a@b.c' })
    mockBookingCreate.mockResolvedValueOnce({ id: 42 })

    const mod = await import('../../server/api/bookings.post')
    type Event = { body: { userEmail: string; courseId: number } }
    type Resp = { ok: boolean; bookingId: number }
    const handler = mod.default as unknown as (e: Event) => Promise<Resp>
    const res = await handler({ body: { userEmail: 'a@b.c', courseId: 1 } })
    expect(res).toEqual({ ok: true, bookingId: 42 })
  })

  it('409 when course is fully booked', async () => {
    mockCourseFindUnique.mockResolvedValueOnce({
      id: 1,
      capacity: 1,
      bookings: [{ status: 'BOOKED' }],
    })
    const mod = await import('../../server/api/bookings.post')
    type Event = { body: { userEmail: string; courseId: number } }
    const handler = mod.default as unknown as (e: Event) => Promise<unknown>
    await expect(handler({ body: { userEmail: 'x@y.z', courseId: 1 } })).rejects.toMatchObject({
      statusCode: 409,
    })
  })

  it('400 when input missing', async () => {
    const mod = await import('../../server/api/bookings.post')
    type Event = { body: { userEmail: string; courseId: number | null } }
    const handler = mod.default as unknown as (e: Event) => Promise<unknown>
    await expect(handler({ body: { userEmail: '', courseId: null } })).rejects.toMatchObject({
      statusCode: 400,
    })
  })
})
