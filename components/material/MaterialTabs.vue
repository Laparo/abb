<template>
  <v-card :elevation="elevation">
    <v-tabs v-model="model" :bg-color="bgColor" :color="color">
      <template v-for="tab in tabs" :key="tab.value">
        <v-tab :value="tab.value">
          <slot name="label" :tab="tab">{{ tab.label }}</slot>
        </v-tab>
      </template>
    </v-tabs>

    <v-window v-model="model">
      <v-window-item v-for="tab in tabs" :key="tab.value" :value="tab.value">
        <slot name="panel" :tab="tab" />
      </v-window-item>
    </v-window>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface TabItem<T = string> {
  label: string
  value: T
}

const props = withDefaults(
  defineProps<{
    /** v-model for selected tab value */
    modelValue?: string | number
    /** List of tabs */
    tabs: TabItem[]
    /** Colors */
    color?: string
    bgColor?: string
    /** Card elevation */
    elevation?: number | string
  }>(),
  {
    modelValue: undefined,
    color: 'primary',
    bgColor: 'white',
    elevation: 2,
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()

const model = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val as string | number),
})

defineOptions({ name: 'MaterialTabs' })
</script>
