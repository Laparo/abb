<template>
  <v-tooltip :text="text" :location="location">
    <template #activator="{ props: activator }">
      <span v-bind="activator"><slot /></span>
    </template>
  </v-tooltip>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    text?: string
    location?: 'top' | 'bottom' | 'start' | 'end'
  }>(),
  {
    text: '',
    location: 'top',
  }
)

defineOptions({ name: 'MaterialTooltip' })
</script>
