import { ref, computed, readonly } from 'vue'
import { createError } from 'h3'
import type { Material, Booking, User } from '@prisma/client'

interface ProcessedMaterial extends Material {
  accessType: 'direct' | 'stream'
  streamUrl?: string
  expiresAt?: string
  downloadUrl?: never
}

interface MaterialsResponse {
  materials: ProcessedMaterial[]
  courseTitle: string
  accessGranted: boolean
}

export const useMaterials = () => {
  const { get } = useApiClient()
  const materials = ref<ProcessedMaterial[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const textMaterials = computed(() => materials.value.filter((m) => m.type === 'TEXT'))
  const videoMaterials = computed(() => materials.value.filter((m) => m.type === 'VIDEO'))

  type TestUser = Partial<User> & { bookings?: Array<Pick<Booking, 'courseId' | 'status'>> }

  const hasAccessToCourse = (user: TestUser, courseId: number): boolean => {
    if (!user?.bookings) return false
    const booking = user.bookings.find((b) => b.courseId === courseId)
    if (!booking) return false
    return booking.status === 'BOOKED' || booking.status === 'COMPLETED'
  }

  const getAccessDeniedMessage = (user: TestUser, courseId: number): string => {
    if (!user?.bookings) return 'Course not found'
    const booking = user.bookings.find((b) => b.courseId === courseId)
    if (!booking) return 'Access denied: Course not booked'
    if (booking.status === 'CANCELLED') return 'Access denied: Booking cancelled'
    return 'Access denied: Invalid booking status'
  }

  const getMaterials = async (courseId: number, user?: TestUser): Promise<ProcessedMaterial[]> => {
    try {
      isLoading.value = true
      error.value = null
      const response = await get<MaterialsResponse>(`/api/materials/${courseId}`)
      if (user?.bookings && !hasAccessToCourse(user, courseId)) {
        throw createError({
          statusCode: 403,
          statusMessage: getAccessDeniedMessage(user, courseId),
        })
      }
      materials.value = response.materials
      return response.materials
    } catch (err) {
      const e = err as { data?: { message?: string }; message?: string; statusCode?: number }
      const errorMessage = e?.data?.message || e?.message || 'Failed to load materials'
      error.value = errorMessage
      if ((e as any).statusCode) throw err
      throw createError({ statusCode: (e as any).statusCode || 500, statusMessage: errorMessage })
    } finally {
      isLoading.value = false
    }
  }

  const getTextMaterial = async (material: Material) => {
    if (material.type !== 'TEXT') throw new Error('Material is not a text type')
    try {
      const response = await get(material.url)
      return { type: 'direct' as const, content: response, title: material.title, id: material.id }
    } catch {
      throw new Error(`Failed to load text material: ${material.title}`)
    }
  }

  const getVideoStreamUrl = async (material: Material) => {
    if (material.type !== 'VIDEO') throw new Error('Material is not a video type')
    try {
      const response = await get<{ streamUrl: string; expiresAt: string }>(
        `/api/materials/video/${material.id}/stream`
      )
      return {
        type: 'stream' as const,
        streamUrl: response.streamUrl,
        expiresAt: response.expiresAt,
        title: material.title,
        id: material.id,
        downloadUrl: undefined,
      }
    } catch {
      throw new Error(`Failed to get streaming URL for: ${material.title}`)
    }
  }

  const refreshMaterials = (courseId: number) => getMaterials(courseId)
  const clearMaterials = () => {
    materials.value = []
    error.value = null
  }

  return {
    materials: readonly(materials),
    textMaterials,
    videoMaterials,
    isLoading: readonly(isLoading),
    error: readonly(error),
    getMaterials,
    getTextMaterial,
    getVideoStreamUrl,
    hasAccessToCourse,
    refreshMaterials,
    clearMaterials,
  }
}
