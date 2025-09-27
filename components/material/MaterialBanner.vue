<template>
  <v-banner v-if="show" :icon="icon" :color="color" :lines="lines" :text="text">
    <template #actions>
      <slot name="actions">
        <v-btn variant="text" @click="$emit('dismiss')">{{ dismissText }}</v-btn>
        <v-btn v-if="actionText" variant="text" @click="$emit('action')">{{ actionText }}</v-btn>
      </slot>
    </template>
  </v-banner>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    show?: boolean
    text?: string
    icon?: string
    color?: string
    lines?: 'one' | 'two' | 'three'
    dismissText?: string
    actionText?: string
  }>(),
  {
    show: true,
    text: '',
    icon: undefined,
    color: 'primary',
    lines: 'one',
    dismissText: 'Schließen',
    actionText: undefined,
  }
)

defineEmits<{
  (e: 'dismiss'): void
  (e: 'action'): void
}>()

defineOptions({ name: 'MaterialBanner' })
</script>
