export interface CourseListItem {
  id: number
  title: string
  description?: string | null
  startAt?: string | null
  endAt?: string | null
  capacity?: number | null
  previewVideoUrl?: string | null
}

export const useCourses = () => {
  const { get } = useApiClient()

  const list = async (opts?: { limit?: number }) => {
    try {
      const limit = opts?.limit ?? 10
      const data = await get<CourseListItem[]>(`/api/courses?limit=${encodeURIComponent(limit)}`)
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const getById = async (id: number) => {
    try {
      const data = await get<CourseListItem | null>(`/api/courses/${id}`)
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  return { list, getById }
}
