<template>
  <v-badge :content="content" :color="color" :dot="dot">
    <slot />
  </v-badge>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    content?: string | number
    color?: string
    dot?: boolean
  }>(),
  {
    content: '',
    color: 'primary',
    dot: false,
  }
)

defineOptions({ name: 'MaterialBadge' })
</script>
