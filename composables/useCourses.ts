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
  const config = useRuntimeConfig()
  const base = config.public.apiBase?.replace(/\/$/, '') || ''
  const list = async (opts?: { limit?: number }) => {
    const limit = opts?.limit ?? 10
    const { data, error } = await useFetch<CourseListItem[]>(
      `${base}/api/courses?limit=${encodeURIComponent(limit)}`
    )
    return { data, error }
  }

  const getById = async (id: number) => {
    const { data, error } = await useFetch<CourseListItem | null>(`${base}/api/courses/${id}`)
    return { data, error }
  }

  return { list, getById }
}
