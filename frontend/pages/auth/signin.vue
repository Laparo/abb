<template>
  <v-container class="py-8">
    <v-row justify="center">
      <v-col cols="12" md="6">
        <AuthSignInCard
          provider-id="microsoft-entra-external"
          provider-name="Microsoft Entra External ID"
          title="Willkommen zurück"
        />

        <v-alert
          v-if="dev && providers && !providers['microsoft-entra-external']"
          type="warning"
          variant="tonal"
          class="mt-6"
          title="Provider nicht verfügbar"
          text="Der Auth-Provider wird vom Server nicht ausgeliefert. Prüfe .env Variablen und Server-Logs."
        />
        <v-alert v-else-if="dev && providers" type="info" variant="tonal" class="mt-6">
          Provider geladen. Du kannst dich anmelden.
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
const dev = process.dev
const { data: providers } = await useFetch<Record<string, unknown> | null>('/api/auth/providers', {
  default: () => null,
})
</script>
