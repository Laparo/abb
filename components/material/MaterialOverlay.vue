<template>
  <v-overlay
    v-model="model"
    :scrim="scrim"
    :opacity="opacity"
    class="d-flex align-center justify-center"
  >
    <slot>
      <v-card class="pa-6 text-center">
        <v-progress-circular indeterminate color="primary" class="mb-4" />
        <div class="text-body-1">{{ text }}</div>
      </v-card>
    </slot>
  </v-overlay>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    text?: string
    scrim?: boolean
    opacity?: string | number
  }>(),
  {
    text: 'Laden...',
    opacity: 0.46,
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const model = computed({
  get: () => props.modelValue ?? false,
  set: (val) => emit('update:modelValue', Boolean(val)),
})

defineOptions({ name: 'MaterialOverlay' })
</script>
