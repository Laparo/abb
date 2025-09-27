<template>
  <v-dialog v-model="model" :max-width="maxWidth" :max-height="maxHeight">
    <v-card v-if="images.length">
      <div class="position-relative">
        <v-img :src="images[currentIndex].src" :max-height="maxHeight" :contain="contain" />

        <v-btn
          icon="mdi-chevron-left"
          color="white"
          class="position-absolute"
          aria-label="Previous"
          :style="{ top: '50%', transform: 'translateY(-50%)', left: '8px' }"
          :disabled="currentIndex === 0"
          @click="prev"
        />
        <v-btn
          icon="mdi-chevron-right"
          color="white"
          class="position-absolute"
          aria-label="Next"
          :style="{ top: '50%', transform: 'translateY(-50%)', right: '8px' }"
          :disabled="currentIndex === images.length - 1"
          @click="next"
        />
        <v-btn
          icon="mdi-close"
          color="white"
          class="position-absolute"
          aria-label="Close"
          :style="{ top: '8px', right: '8px' }"
          @click="model = false"
        />
      </div>
      <v-card-text class="text-center">
        <h4>{{ images[currentIndex].title }}</h4>
        <p class="text-grey">{{ currentIndex + 1 }} / {{ images.length }}</p>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

export interface LightboxImage {
  src: string
  title?: string
}

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    images: LightboxImage[]
    startIndex?: number | null
    maxWidth?: string | number
    maxHeight?: string | number
    contain?: boolean
  }>(),
  {
    startIndex: null,
    maxWidth: '90vw',
    maxHeight: '80vh',
    contain: true,
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'update:startIndex', value: number | null): void
}>()

const model = computed({
  get: () => props.modelValue ?? false,
  set: (val) => emit('update:modelValue', Boolean(val)),
})

const isControlled = computed(() => props.startIndex !== null && props.startIndex !== undefined)
const currentIndex = ref<number>(props.startIndex ?? 0)

watch(
  () => props.startIndex,
  (val) => {
    if (val !== null && val !== undefined) currentIndex.value = val
  }
)

const prev = () => {
  if (isControlled.value) {
    emit('update:startIndex', Math.max(0, currentIndex.value - 1))
  } else {
    currentIndex.value = Math.max(0, currentIndex.value - 1)
  }
}
const next = () => {
  if (isControlled.value) {
    emit('update:startIndex', Math.min(props.images.length - 1, currentIndex.value + 1))
  } else {
    currentIndex.value = Math.min(props.images.length - 1, currentIndex.value + 1)
  }
}
</script>
