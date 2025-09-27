<template>
  <v-snackbar v-model="model" class="v-snackbar--material" :color="'transparent'" v-bind="$attrs">
    <MaterialAlert
      class="ma-0"
      :color="color"
      :dismissible="dismissible"
      :icon="icon"
      @close="model = false"
    >
      <slot />
    </MaterialAlert>
  </v-snackbar>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MaterialAlert from './MaterialAlert.vue'

interface Props {
  /** Controls visibility */
  modelValue?: boolean
  /** Alert color */
  color?: string
  /** Optional icon (mdi-*) */
  icon?: string
  /** Show a close action */
  dismissible?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  color: undefined,
  icon: undefined,
  dismissible: true,
})

const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void }>()
const model = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit('update:modelValue', v),
})
</script>

<style scoped lang="sass">
.v-snackbar--material
  margin-top: 32px
  margin-bottom: 32px

  :deep(.v-alert--material),
  :deep(.v-snack__wrapper)
    border-radius: 8px

  :deep(.v-snack__content)
    overflow: visible
    padding: 0
</style>
