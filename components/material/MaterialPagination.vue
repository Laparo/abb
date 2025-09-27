<template>
  <div class="d-flex justify-center">
    <v-pagination v-model="model" :length="length" :total-visible="totalVisible" :color="color" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: number
    length: number
    totalVisible?: number
    color?: string
  }>(),
  {
    modelValue: 1,
    totalVisible: 7,
    color: 'primary',
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const model = computed({
  get: () => props.modelValue ?? 1,
  set: (val) => emit('update:modelValue', Number(val)),
})

defineOptions({ name: 'MaterialPagination' })
</script>
