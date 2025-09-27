<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 class="mb-4">ABB</h1>
        <v-card>
          <v-card-title>Willkommen</v-card-title>
          <v-card-text>
            <p>Das ist die ABB-Starterseite.</p>
            <p>
              Healthcheck:
              <code>/api/health</code>
            </p>
            <div class="mt-4">
              <v-btn color="primary" variant="flat" :to="'/courses'"> Kurse ansehen </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { VContainer, VRow, VCol, VCard, VCardTitle, VCardText, VBtn } from 'vuetify/components'

// Example head for SEO
useHead({ title: 'ABB – Start' })
</script>
