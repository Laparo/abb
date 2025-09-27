<template>
  <v-card :elevation="elevation">
    <v-stepper v-model="step">
      <v-stepper-header>
        <v-stepper-item
          v-for="(s, i) in steps"
          :key="i"
          :value="i + 1"
          :complete="step > i + 1"
          :title="s.title"
        />
      </v-stepper-header>

      <v-stepper-window v-model="step">
        <v-stepper-window-item v-for="(s, i) in steps" :key="i" :value="i + 1">
          <slot name="step" :step="s" :index="i" />
        </v-stepper-window-item>
      </v-stepper-window>

      <v-stepper-actions
        :disabled="step <= 1"
        :next-text="step === steps.length ? finishText : nextText"
        @click:prev="prev"
        @click:next="next"
      />
    </v-stepper>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface StepItem {
  title: string
}

const props = withDefaults(
  defineProps<{
    modelValue?: number
    steps: StepItem[]
    elevation?: number | string
    nextText?: string
    finishText?: string
  }>(),
  {
    modelValue: 1,
    elevation: 2,
    nextText: 'Weiter',
    finishText: 'Fertig',
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
  (e: 'finish'): void
}>()

const step = computed({
  get: () => props.modelValue ?? 1,
  set: (val) => emit('update:modelValue', Number(val)),
})

const next = () => {
  if ((step.value ?? 1) >= props.steps.length) {
    emit('finish')
    return
  }
  step.value = (step.value ?? 1) + 1
}

const prev = () => {
  step.value = Math.max(1, (step.value ?? 1) - 1)
}

defineOptions({ name: 'MaterialStepper' })
</script>
