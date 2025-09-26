/// <reference types="vitest" />

type FetchOptions = { method?: string; body?: unknown }
vi.stubGlobal(
  '$fetch',
  vi.fn(async (url: string, opts?: FetchOptions) => {
    if (url === '/api/bookings' && opts?.method === 'POST') {
      return { ok: true, bookingId: 123 }
    }
    throw new Error('unexpected')
  })
)

describe('useBookings composable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('create() posts and returns booking id', async () => {
    const mod = await import('../../composables/useBookings')
    const { create } = mod.useBookings()
    const res = await create({ courseId: 1, userEmail: 'jane@example.com' })
    expect(res).toEqual({ ok: true, bookingId: 123 })
    expect(vi.mocked(globalThis.$fetch)).toHaveBeenCalledWith(
      '/api/bookings',
      expect.objectContaining({ method: 'POST' })
    )
  })
})
