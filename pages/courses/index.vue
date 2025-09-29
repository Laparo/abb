<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 class="mb-4">Kurse</h1>
        <v-card>
          <v-card-title>Verfügbare Kurse</v-card-title>
          <v-card-text>
            <p>Hier werden die verfügbaren Kurse angezeigt.</p>
            <v-btn color="primary" variant="flat" :to="'/'"> Zurück zur Startseite </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
useHead({ title: 'ABB – Kurse' })
</script>