<template>
  <v-card class="h-100">
    <div v-if="previewVideoUrl" class="ratio-16x9">
      <video
        :src="previewVideoUrl"
        preload="metadata"
        playsinline
        muted
        controls
        aria-label="Kursvorschauvideo"
      />
    </div>
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
  /** URL eines Video-Previews; optional */
  previewVideoUrl?: string | null
}
defineProps<Props>()
</script>

<style scoped>
.h-100 {
  height: 100%;
}
.ratio-16x9 {
  position: relative;
  width: 100%;
  padding-top: 56.25%;
  overflow: hidden;
}
.ratio-16x9 > video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
