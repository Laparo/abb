<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="text-h4 pa-6"> Kurse </v-card-title>
          <v-card-text>
            <p class="text-body-1 mb-4">Hier werden die verfügbaren Kurse angezeigt.</p>
            <v-alert type="info" variant="tonal" class="mb-4">
              Die Kurs-Funktionalität wird noch entwickelt.
            </v-alert>

            <v-btn color="primary" prepend-icon="mdi-arrow-left" @click="$router.back()">
              Zurück
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
// Meta-Tags für SEO
useHead({
  title: 'Kurse - ABB',
  meta: [{ name: 'description', content: 'Verfügbare Kurse in der ABB Anwendung' }],
})
</script>
