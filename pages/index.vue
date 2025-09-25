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
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
// Example head for SEO
useHead({ title: 'ABB – Start' })
</script>
