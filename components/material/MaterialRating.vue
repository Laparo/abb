<template>
  <v-rating
    v-model="model"
    :color="color"
    :half-increments="half"
    :readonly="readonly"
    :density="density"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: number
    color?: string
    half?: boolean
    readonly?: boolean
    density?: 'default' | 'comfortable' | 'compact'
  }>(),
  {
    modelValue: 0,
    color: 'amber',
    half: false,
    readonly: false,
    density: 'default',
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const model = computed({
  get: () => props.modelValue ?? 0,
  set: (val) => emit('update:modelValue', Number(val)),
})

defineOptions({ name: 'MaterialRating' })
</script>
