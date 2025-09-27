<template>
  <v-card :variant="variant">
    <v-card-text class="d-flex align-center justify-space-between">
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
      <div class="text-truncate">{{ title }}</div>
    </v-card-text>
    <audio ref="audioRef" :src="src" :muted="muted" :controls="false" />
  </v-card>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

interface Props {
  src: string
  title?: string
  modelValue?: boolean
  muted?: boolean
  variant?: 'elevated' | 'flat' | 'tonal' | 'outlined' | 'text'
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Audio',
  modelValue: undefined,
  muted: false,
  variant: 'elevated',
})

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void
  (e: 'update:muted', val: boolean): void
}>()

const audioRef = ref<HTMLAudioElement | null>(null)
const isControlled = () => typeof props.modelValue === 'boolean'
const internalPlaying = ref<boolean>(props.modelValue ?? false)

watch(
  () => props.modelValue,
  (v) => {
    if (typeof v === 'boolean') internalPlaying.value = v
  }
)

const applyPlayback = async (playing: boolean) => {
  const el = audioRef.value
  if (!el) return
  try {
    if (playing) await el.play()
    else el.pause()
  } catch {
    // ignore autoplay/test environment issues
  }
}

watch(internalPlaying, (v) => applyPlayback(v))
onMounted(() => applyPlayback(internalPlaying.value))

const togglePlay = () => {
  if (isControlled()) emit('update:modelValue', !internalPlaying.value)
  else internalPlaying.value = !internalPlaying.value
}
</script>

<style scoped>
.gap-2 {
  gap: 8px;
}
.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
