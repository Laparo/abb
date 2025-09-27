<template>
  <v-skeleton-loader v-if="loading" :type="type" />
  <slot v-else />
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    loading?: boolean
    type?: string
  }>(),
  {
    loading: true,
    type: 'card',
  }
)

defineOptions({ name: 'MaterialSkeleton' })
</script>
