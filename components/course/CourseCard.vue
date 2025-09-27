<template>
  <v-card class="h-100">
    <v-card-title>{{ title }}</v-card-title>
    <v-card-text>
      <div class="text-body-2">{{ description }}</div>
      <div class="text-caption mt-2">{{ dateRange }}</div>
    </v-card-text>
    <v-card-actions>
      <slot name="actions" />
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
interface Props {
  title: string
  description?: string
  dateRange?: string
}
defineProps<Props>()
</script>

<style scoped>
.h-100 {
  height: 100%;
}
</style>
