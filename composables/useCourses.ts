export interface CourseListItem {
  id: number
  title: string
  description?: string | null
  startAt?: string | null
  endAt?: string | null
  capacity?: number | null
}

export const useCourses = () => {
  const list = async () => {
    const { data, error } = await useFetch<CourseListItem[]>('/api/courses')
    return { data, error }
  }

  const getById = async (id: number) => {
    const { data, error } = await useFetch<CourseListItem | null>(`/api/courses-${id}`)
    return { data, error }
  }

  return { list, getById }
}
