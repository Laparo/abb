<template>
  <v-timeline>
    <v-timeline-item
      v-for="(item, i) in items"
      :key="i"
      :dot-color="item.color"
      :size="item.size ?? 'small'"
    >
      <template #opposite>
        <span class="text-caption">{{ item.time }}</span>
      </template>
      <v-card :elevation="2">
        <v-card-title class="text-subtitle-1">{{ item.title }}</v-card-title>
        <v-card-text>{{ item.description }}</v-card-text>
      </v-card>
    </v-timeline-item>
  </v-timeline>
</template>

<script setup lang="ts">
export interface TimelineItem {
  title: string
  description: string
  time?: string
  color?: string
  size?: 'x-small' | 'small' | 'default' | 'large'
}

defineProps<{ items: TimelineItem[] }>()

defineOptions({ name: 'MaterialTimeline' })
</script>
