<template>
  <v-dialog v-model="model" :max-width="maxWidth">
    <v-card>
      <v-card-title>
        <slot name="title">{{ title }}</slot>
      </v-card-title>
      <v-card-text>
        <slot />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <slot name="actions">
          <v-btn color="grey" variant="text" @click="model = false">{{ cancelText }}</v-btn>
          <v-btn color="primary" variant="text" @click="$emit('confirm')">{{ confirmText }}</v-btn>
        </slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    title?: string
    maxWidth?: number | string
    cancelText?: string
    confirmText?: string
  }>(),
  {
    title: '',
    maxWidth: 500,
    cancelText: 'Abbrechen',
    confirmText: 'Bestätigen',
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
}>()

const model = computed({
  get: () => props.modelValue ?? false,
  set: (val) => emit('update:modelValue', Boolean(val)),
})

defineOptions({ name: 'MaterialDialog' })
</script>
