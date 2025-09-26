/// <reference types="vitest" />

vi.stubGlobal(
  'useFetch',
  vi.fn(async (url: string) => {
    if (url === '/api/courses') {
      return { data: [{ id: 1, title: 'A' }], error: null }
    }
    if (url?.startsWith('/api/courses/')) {
      return { data: { id: 2, title: 'B' }, error: null }
    }
    return { data: null, error: new Error('not found') }
  })
)

describe('useCourses composable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('list() returns data', async () => {
    const mod = await import('../../composables/useCourses')
    const { list } = mod.useCourses()
    const { data, error } = await list()
    expect(error).toBeNull()
    expect(data).toEqual([{ id: 1, title: 'A' }])
  })

  it('getById() returns course', async () => {
    const mod = await import('../../composables/useCourses')
    const { getById } = mod.useCourses()
    const { data, error } = await getById(2)
    expect(error).toBeNull()
    expect(data).toEqual({ id: 2, title: 'B' })
  })
})
