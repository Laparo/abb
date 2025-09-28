<template>
  <v-container class="py-10">
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-alert type="error" variant="tonal" :title="title" class="mb-4">
          <div class="mb-2">{{ message }}</div>
          <div v-if="hint" class="text-body-2">{{ hint }}</div>
        </v-alert>
        <div class="d-flex ga-3">
          <NuxtLink to="/auth/signin">
            <v-btn color="primary" prepend-icon="mdi-login">Erneut anmelden</v-btn>
          </NuxtLink>
          <NuxtLink to="/">
            <v-btn variant="text">Zur Startseite</v-btn>
          </NuxtLink>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
const route = useRoute()
// NextAuth leitet u.a. mit error & error_description weiter
const error = computed(() => String(route.query.error || 'Unbekannter Fehler'))
const description = computed(() =>
  String(route.query.error_description || route.query.errorDescription || '')
)

const title = computed(() => `Anmeldung fehlgeschlagen (${error.value})`)
const message = computed(
  () =>
    description.value ||
    'Bitte versuche es erneut. Wenn das Problem bleibt, kontaktiere den Support.'
)

// Hilfetexte für häufige OIDC-/AADSTS-Meldungen
const hint = computed(() => {
  const d = description.value.toUpperCase()
  if (d.includes('AADSTS') && d.includes('REDIRECT') && d.includes('URI')) {
    return 'Prüfe die Redirect-URI in Microsoft Entra: http://localhost:3000/api/auth/callback/microsoft-entra-external'
  }
  if (d.includes('WELL-KNOWN') || d.includes('OPENID') || d.includes('DISCOVER')) {
    return 'Die OpenID-Konfiguration ist nicht erreichbar. Prüfe Tenant/Policy und Internetzugriff.'
  }
  if (d.includes('CLIENT') && d.includes('SECRET')) {
    return 'Client Secret/ID in .env prüfen.'
  }
  return ''
})
</script>
