<template>
  <v-card :variant="variant">
    <v-responsive :aspect-ratio="aspect">
      <video
        ref="videoRef"
        :src="src"
        :poster="poster"
        :muted="muted"
        :playsinline="true"
        :controls="false"
        class="w-100"
        data-testid="material-video"
      />
    </v-responsive>

    <v-card-actions class="justify-space-between">
      <div class="d-flex align-center gap-2">
        <v-btn
          size="small"
          :icon="internalPlaying ? 'mdi-pause' : 'mdi-play'"
          aria-label="PlayPause"
          @click="togglePlay"
        />
        <v-btn
          size="small"
          :icon="muted ? 'mdi-volume-off' : 'mdi-volume-high'"
          aria-label="MuteToggle"
          @click="$emit('update:muted', !muted)"
        />
      </div>
      <slot name="actions" />
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

/**
 * MaterialVideoPlayer
 * A simple MD3-styled video player with play/pause and mute controls.
 */
interface Props {
  /** Video source URL */
  src: string
  /** Poster image URL shown before playback */
  poster?: string
  /** v-model for playing state (optional). If omitted, internal state is used. */
  modelValue?: boolean
  /** v-model for muted state */
  muted?: boolean
  /** Card variant */
  variant?: 'elevated' | 'flat' | 'tonal' | 'outlined' | 'text'
  /** Aspect ratio, e.g., 16/9 = 1.777... */
  aspect?: number
}

const props = withDefaults(defineProps<Props>(), {
  poster: undefined,
  modelValue: undefined,
  muted: false,
  variant: 'elevated',
  aspect: 16 / 9,
})

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void
  (e: 'update:muted', val: boolean): void
}>()

const videoRef = ref<HTMLVideoElement | null>(null)

const isControlled = () => typeof props.modelValue === 'boolean'
const internalPlaying = ref<boolean>(props.modelValue ?? false)

watch(
  () => props.modelValue,
  (v) => {
    if (typeof v === 'boolean') internalPlaying.value = v
  }
)

const applyPlayback = async (playing: boolean) => {
  const vid = videoRef.value
  if (!vid) return
  try {
    if (playing) await vid.play()
    else vid.pause()
  } catch {
    // ignore JSDOM/auto-play restrictions during tests
  }
}

watch(internalPlaying, (v) => {
  applyPlayback(v)
})

onMounted(() => {
  applyPlayback(internalPlaying.value)
})

const togglePlay = () => {
  if (isControlled()) emit('update:modelValue', !internalPlaying.value)
  else internalPlaying.value = !internalPlaying.value
}
</script>

<style scoped>
.w-100 {
  width: 100%;
  display: block;
}
.gap-2 {
  gap: 8px;
}
</style>
