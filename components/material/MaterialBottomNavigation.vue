<template>
  <v-bottom-navigation v-model="model" :color="color" class="rounded">
    <v-btn
      v-for="(item, i) in items"
      :key="i"
      :value="item.value"
      @click="$emit('select', item, i)"
    >
      <v-icon>{{ item.icon }}</v-icon>
      <span>{{ item.label }}</span>
    </v-btn>
  </v-bottom-navigation>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface BottomNavItem<T = string> {
  label: string
  value: T
  icon: string
}

const props = withDefaults(
  defineProps<{
    modelValue?: string | number
    items: BottomNavItem[]
    color?: string
  }>(),
  {
    modelValue: '',
    color: 'primary',
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
  (e: 'select', item: BottomNavItem, index: number): void
}>()

const model = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val as string | number),
})

defineOptions({ name: 'MaterialBottomNavigation' })
</script>
