<template>
  <div class="course-material-list">
    <!-- Text Materials Section -->
    <div v-if="textMaterials.length > 0" class="materials-section">
      <VCard variant="outlined" class="mb-6">
        <VCardTitle class="text-h6 d-flex align-center">
          <VIcon icon="mdi-file-document-outline" class="mr-2" />
          Text Materials
        </VCardTitle>
        <VCardText>
          <VRow>
            <VCol v-for="material in textMaterials" :key="material.id" cols="12" md="6">
              <VCard
                variant="outlined"
                class="material-card material-card--text"
                :class="{ 'material-card--loading': loadingMaterial === material.id }"
              >
                <VCardTitle class="text-subtitle-1">
                  {{ material.title }}
                </VCardTitle>
                <VCardText>
                  <div class="material-info">
                    <VChip size="small" color="primary" variant="outlined">
                      {{ material.type }}
                    </VChip>
                    <span class="text-caption ml-2">Direct access</span>
                  </div>
                </VCardText>
                <VCardActions>
                  <VBtn
                    :loading="loadingMaterial === material.id"
                    color="primary"
                    variant="elevated"
                    size="small"
                    prepend-icon="mdi-open-in-new"
                    @click="accessTextMaterial(material)"
                  >
                    Open
                  </VBtn>
                  <VBtn
                    :loading="loadingMaterial === material.id"
                    color="secondary"
                    variant="outlined"
                    size="small"
                    prepend-icon="mdi-download"
                    @click="downloadTextMaterial(material)"
                  >
                    Download
                  </VBtn>
                </VCardActions>
              </VCard>
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </div>

    <!-- Video Materials Section -->
    <div v-if="videoMaterials.length > 0" class="materials-section">
      <VCard variant="outlined" class="mb-6">
        <VCardTitle class="text-h6 d-flex align-center">
          <VIcon icon="mdi-play-circle-outline" class="mr-2" />
          Video Materials
          <VChip size="small" color="info" variant="outlined" class="ml-2"> Streaming Only </VChip>
        </VCardTitle>
        <VCardText>
          <VAlert type="info" class="mb-4" variant="outlined">
            <template #title>Streaming Only</template>
            Videos are available for streaming only. Download is not permitted to protect content.
          </VAlert>

          <VRow>
            <VCol v-for="material in videoMaterials" :key="material.id" cols="12" lg="6">
              <VCard
                variant="outlined"
                class="material-card material-card--video"
                :class="{ 'material-card--loading': loadingMaterial === material.id }"
              >
                <VCardTitle class="text-subtitle-1">
                  {{ material.title }}
                </VCardTitle>
                <VCardText>
                  <div class="material-info mb-3">
                    <VChip size="small" color="error" variant="outlined">
                      {{ material.type }}
                    </VChip>
                    <span class="text-caption ml-2">Streaming access</span>
                  </div>

                  <!-- Video Player or Stream Info -->
                  <div v-if="material.streamUrl" class="video-container">
                    <video
                      :src="material.streamUrl"
                      controls
                      controlslist="nodownload"
                      oncontextmenu="return false;"
                      class="material-video"
                    >
                      Your browser does not support the video tag.
                    </video>
                    <div class="stream-info mt-2">
                      <VChip size="x-small" color="warning" variant="outlined">
                        Expires: {{ formatExpiration(material.expiresAt) }}
                      </VChip>
                    </div>
                  </div>
                  <div v-else class="video-placeholder">
                    <VIcon icon="mdi-play-circle-outline" size="48" color="grey" />
                    <p class="text-body-2 mt-2">Click to load video stream</p>
                  </div>
                </VCardText>
                <VCardActions>
                  <VBtn
                    v-if="!material.streamUrl"
                    :loading="loadingMaterial === material.id"
                    color="primary"
                    variant="elevated"
                    size="small"
                    prepend-icon="mdi-play"
                    @click="loadVideoStream(material)"
                  >
                    Load Stream
                  </VBtn>
                  <VBtn
                    v-else
                    :loading="loadingMaterial === material.id"
                    color="info"
                    variant="outlined"
                    size="small"
                    prepend-icon="mdi-refresh"
                    @click="refreshVideoStream(material)"
                  >
                    Refresh Stream
                  </VBtn>
                  <VSpacer />
                  <VTooltip text="Download not available for videos">
                    <template #activator="{ props: tooltipProps }">
                      <VBtn
                        v-bind="tooltipProps"
                        disabled
                        color="grey"
                        variant="outlined"
                        size="small"
                        prepend-icon="mdi-download-off"
                      >
                        No Download
                      </VBtn>
                    </template>
                  </VTooltip>
                </VCardActions>
              </VCard>
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </div>

    <!-- No Materials Message -->
    <div v-if="materials.length === 0" class="no-materials">
      <VAlert type="info" class="text-center">
        <template #title>No Materials Available</template>
        No course materials have been uploaded yet. Please check back later.
      </VAlert>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useMaterials } from '#imports'
import {
  VCard,
  VCardTitle,
  VCardText,
  VCardActions,
  VBtn,
  VChip,
  VIcon,
  VRow,
  VCol,
  VAlert,
  VSpacer,
  VTooltip,
} from 'vuetify/components'

// Types
interface MaterialBase {
  id: number
  title: string
  // Prisma liefert `string`; Werte sind konventionell 'TEXT' | 'VIDEO'
  type: string
  // Optional stream fields for UI composition
  streamUrl?: string
  expiresAt?: string
  // Additional fields are allowed but not required here
  [key: string]: unknown
}

// Props
interface Props {
  materials: ReadonlyArray<MaterialBase>
  courseId: number
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  materialAccessError: [error: string]
}>()

// Composables
const { getTextMaterial, getVideoStreamUrl } = useMaterials()

// Reactive data
const loadingMaterial = ref<number | null>(null)
// Local stream state keyed by material id to avoid mutating props
const streamState = reactive(new Map<number, { streamUrl?: string; expiresAt?: string }>())

// Compose UI materials by merging props with local stream state
const uiMaterials = computed<MaterialBase[]>(() =>
  props.materials.map((m) => ({ ...m, ...(streamState.get(m.id) || {}) }))
)

// Computed properties
const textMaterials = computed(() => uiMaterials.value.filter((m) => m.type === 'TEXT'))

const videoMaterials = computed(() => uiMaterials.value.filter((m) => m.type === 'VIDEO'))

// Methods
type TextMaterial = MaterialBase & { type: 'TEXT' }
type VideoMaterial = MaterialBase & { type: 'VIDEO' }

const accessTextMaterial = async (material: TextMaterial) => {
  try {
    loadingMaterial.value = material.id

    const result = await getTextMaterial(material)

    // Open in new tab/window
    const newWindow = window.open('', '_blank')
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head>
            <title>${material.title}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; }
              h1 { color: #333; border-bottom: 2px solid #ccc; padding-bottom: 10px; }
            </style>
          </head>
          <body>
            <h1>${material.title}</h1>
            <div>${result.content}</div>
          </body>
        </html>
      `)
      newWindow.document.close()
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to access text material'
    emit('materialAccessError', errorMessage)
  } finally {
    loadingMaterial.value = null
  }
}

const downloadTextMaterial = async (material: TextMaterial) => {
  try {
    loadingMaterial.value = material.id

    const result = await getTextMaterial(material)

    // Create and trigger download
    const content: string =
      typeof result.content === 'string' ? result.content : String(result.content ?? '')
    const blob = new Blob([content], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${material.title}.html`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to download text material'
    emit('materialAccessError', errorMessage)
  } finally {
    loadingMaterial.value = null
  }
}

const loadVideoStream = async (material: VideoMaterial) => {
  try {
    loadingMaterial.value = material.id

    const result = await getVideoStreamUrl(material)

    // Store stream info locally without mutating props
    streamState.set(material.id, {
      streamUrl: result.streamUrl,
      expiresAt: result.expiresAt,
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to load video stream'
    emit('materialAccessError', errorMessage)
  } finally {
    loadingMaterial.value = null
  }
}

const refreshVideoStream = async (material: VideoMaterial) => {
  // Clear existing stream URL and reload (locally)
  streamState.set(material.id, { streamUrl: undefined, expiresAt: undefined })

  await loadVideoStream(material)
}

const formatExpiration = (expiresAt: string | undefined) => {
  if (!expiresAt) return 'Unknown'

  const expiry = new Date(expiresAt)
  const now = new Date()
  const diffMs = expiry.getTime() - now.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

  if (diffMs <= 0) return 'Expired'
  if (diffHours > 0) return `${diffHours}h ${diffMinutes}m`
  return `${diffMinutes}m`
}
</script>

<style scoped>
.course-material-list {
  width: 100%;
}

.materials-section {
  margin-bottom: 2rem;
}

.material-card {
  height: 100%;
  transition: all 0.3s ease;
}

.material-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.material-card--loading {
  opacity: 0.7;
}

.material-card--text {
  border-left: 4px solid #2196f3;
}

.material-card--video {
  border-left: 4px solid #f44336;
}

.material-info {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.video-container {
  width: 100%;
}

.material-video {
  width: 100%;
  height: auto;
  border-radius: 8px;
  background-color: #000;
}

.video-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  min-height: 200px;
}

.stream-info {
  display: flex;
  justify-content: flex-end;
}

.no-materials {
  text-align: center;
  padding: 2rem;
}

/* Prevent video download and right-click */
.material-video {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* Hide video download button in browsers that support it */
.material-video::-webkit-media-controls-download-button {
  display: none;
}

.material-video::-webkit-media-controls-enclosure {
  overflow: hidden;
}

.material-video::-webkit-media-controls-panel {
  width: calc(100% + 30px);
}

@media (max-width: 768px) {
  .video-placeholder {
    min-height: 150px;
    padding: 1rem;
  }

  .material-card {
    margin-bottom: 1rem;
  }
}
</style>
