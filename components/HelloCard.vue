<template>
  <v-card class="pa-4">
    <v-card-title data-testid="title">{{ title }}</v-card-title>
    <v-card-text>
      <div data-testid="count">Count: {{ current }}</div>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" data-testid="inc" @click="inc">Increment</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { VCard, VCardTitle, VCardText, VCardActions, VBtn } from 'vuetify/components'

interface Props {
  /** Überschrift im Card-Header */
  title: string
  /** Startwert des Zählers (optional, Default 0) */
  count?: number
}

const props = defineProps<Props>()

const current = ref(props.count ?? 0)
const inc = () => {
  current.value += 1
}
</script>

<style scoped></style>
