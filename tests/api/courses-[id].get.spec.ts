/// <reference types="vitest" />
import '../utils/h3-globals'

const mockFindUnique = vi.fn()

vi.mock('@prisma/client', () => {
  return {
    PrismaClient: vi.fn(() => ({
      course: { findUnique: mockFindUnique },
    })),
  }
})

describe('GET /api/courses/:id', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns course with active materials', async () => {
    mockFindUnique.mockResolvedValueOnce({
      id: 1,
      materials: [{ id: 10, type: 'LINK', title: 'Doc' }],
    })
    const mod = await import('../../server/api/courses/[id].get')
    type Event = { context: { params: { id: string } } }
    const handler = mod.default as unknown as (e: Event) => Promise<unknown>
    const res = await handler({ context: { params: { id: '1' } } })
    expect(res).toEqual({ id: 1, materials: [{ id: 10, type: 'LINK', title: 'Doc' }] })
    expect(mockFindUnique).toHaveBeenCalledWith(expect.objectContaining({ where: { id: 1 } }))
  })

  it('400 on invalid id', async () => {
    const mod = await import('../../server/api/courses/[id].get')
    type Event = { context: { params: { id: string } } }
    const handler = mod.default as unknown as (e: Event) => Promise<unknown>
    await expect(handler({ context: { params: { id: 'NaN' } } })).rejects.toMatchObject({
      statusCode: 400,
    })
  })

  it('404 when not found', async () => {
    mockFindUnique.mockResolvedValueOnce(null)
    const mod = await import('../../server/api/courses/[id].get')
    type Event = { context: { params: { id: string } } }
    const handler = mod.default as unknown as (e: Event) => Promise<unknown>
    await expect(handler({ context: { params: { id: '999' } } })).rejects.toMatchObject({
      statusCode: 404,
    })
  })
})
