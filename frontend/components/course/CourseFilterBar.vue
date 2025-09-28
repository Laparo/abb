<template>
  <v-row class="mb-4" align="center" no-gutters>
    <v-col cols="12" md="8">
      <v-text-field
        v-model="q"
        label="Suche"
        density="comfortable"
        prepend-inner-icon="mdi-magnify"
      />
    </v-col>
    <v-col cols="12" md="4" class="d-flex justify-end">
      <v-btn variant="text" @click="$emit('clear')">Zurücksetzen</v-btn>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
const q = defineModel<string>('q', { default: '' })
defineEmits<{ (e: 'clear'): void }>()
</script>

<style scoped></style>
