<template>
  <v-card variant="tonal">
    <v-card-title>Buchungsübersicht</v-card-title>
    <v-card-text>
      <div class="text-body-2">{{ title }}</div>
      <div class="text-caption">{{ dateRange }}</div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
interface Props {
  title: string
  dateRange?: string
}
defineProps<Props>()
</script>

<style scoped></style>
