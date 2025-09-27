<template>
  <div class="position-relative" :style="{ height }">
    <v-speed-dial v-model="model" :location="location" :transition="transition">
      <template #activator="{ props: activatorProps }">
        <v-fab v-bind="activatorProps" :color="color" :icon="icon" />
      </template>

      <template v-for="(action, i) in actions" :key="i">
        <v-fab
          :color="action.color"
          :icon="action.icon"
          size="small"
          @click="$emit('action', action, i)"
        />
      </template>
    </v-speed-dial>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface SpeedDialAction {
  icon: string
  color?: string
  value?: unknown
}

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    color?: string
    icon?: string
    actions?: SpeedDialAction[]
    location?: 'top start' | 'top end' | 'bottom start' | 'bottom end'
    transition?: string
    height?: string
  }>(),
  {
    color: 'primary',
    icon: 'mdi-plus',
    actions: () => [],
    location: 'bottom end',
    transition: 'fade-transition',
    height: '200px',
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'action', action: SpeedDialAction, index: number): void
}>()

const model = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', Boolean(val)),
})

defineOptions({ name: 'MaterialSpeedDial' })
</script>
