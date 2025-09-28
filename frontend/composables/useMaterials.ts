import { ref, computed, readonly } from 'vue'
import type { Material, Booking, User } from '@prisma/client'

interface ProcessedMaterial extends Material {
  accessType: 'direct' | 'stream'
  streamUrl?: string
  expiresAt?: string
  downloadUrl?: never // Explicitly never allow download URLs
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

  // Computed properties for different material types
  const textMaterials = computed(() => materials.value.filter((m) => m.type === 'TEXT'))

  const videoMaterials = computed(() => materials.value.filter((m) => m.type === 'VIDEO'))

  // Get materials for a course
  type TestUser = Partial<User> & { bookings?: Array<Pick<Booking, 'courseId' | 'status'>> }
  const getMaterials = async (courseId: number, user?: TestUser): Promise<ProcessedMaterial[]> => {
    try {
      isLoading.value = true
      error.value = null

      // Fetch from server first to surface server-side errors (e.g., 404)
      const response = await get<MaterialsResponse>(`/api/materials/${courseId}`)

      // Optional client-side access validation (used in unit/integration tests only)
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

      // Re-throw with standardized error format
      if (e.statusCode) {
        throw err
      }

      throw createError({
        statusCode: e.statusCode || 500,
        statusMessage: errorMessage,
      })
    } finally {
      isLoading.value = false
    }
  }

  // Get text material content directly
  const getTextMaterial = async (material: Material) => {
    if (material.type !== 'TEXT') {
      throw new Error('Material is not a text type')
    }

    try {
      // For text materials, we return direct access
      const response = await get(material.url)
      return {
        type: 'direct' as const,
        content: response,
        title: material.title,
        id: material.id,
      }
    } catch {
      throw new Error(`Failed to load text material: ${material.title}`)
    }
  }

  // Get video streaming URL (no downloads allowed)
  const getVideoStreamUrl = async (material: Material) => {
    if (material.type !== 'VIDEO') {
      throw new Error('Material is not a video type')
    }

    // This would typically be called from the materials API response
    // But we can also generate fresh streaming URLs if needed
    try {
      const response = await get(`/api/materials/video/${material.id}/stream`)

      return {
        type: 'stream' as const,
        streamUrl: response.streamUrl,
        expiresAt: response.expiresAt,
        title: material.title,
        id: material.id,
        // Explicitly no download URL
        downloadUrl: undefined,
      }
    } catch {
      throw new Error(`Failed to get streaming URL for: ${material.title}`)
    }
  }

  // Check if user has access to course materials
  const hasAccessToCourse = (user: TestUser, courseId: number): boolean => {
    if (!user?.bookings) return false

    const booking = user.bookings.find((b) => b.courseId === courseId)
    if (!booking) return false

    // Allow access for BOOKED and COMPLETED, deny for CANCELLED
    return booking.status === 'BOOKED' || booking.status === 'COMPLETED'
  }

  // Get appropriate access denied message
  const getAccessDeniedMessage = (user: TestUser, courseId: number): string => {
    if (!user?.bookings) {
      return 'Course not found'
    }

    const booking = user.bookings.find((b) => b.courseId === courseId)

    if (!booking) {
      return 'Access denied: Course not booked'
    }

    if (booking.status === 'CANCELLED') {
      return 'Access denied: Booking cancelled'
    }

    return 'Access denied: Invalid booking status'
  }

  // Refresh materials for a course
  const refreshMaterials = async (courseId: number) => {
    return getMaterials(courseId)
  }

  // Clear current materials
  const clearMaterials = () => {
    materials.value = []
    error.value = null
  }

  return {
    // State
    materials: readonly(materials),
    textMaterials,
    videoMaterials,
    isLoading: readonly(isLoading),
    error: readonly(error),

    // Methods
    getMaterials,
    getTextMaterial,
    getVideoStreamUrl,
    hasAccessToCourse,
    refreshMaterials,
    clearMaterials,
  }
}
