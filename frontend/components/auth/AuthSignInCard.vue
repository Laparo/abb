<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card elevation="3">
          <v-card-title class="text-h5">{{ computedTitle }}</v-card-title>
          <v-card-text>
            <p class="mb-4">
              {{ computedDescription }}
            </p>
            <v-alert type="info" variant="tonal" class="mb-4">
              Du wirst zum Microsoft Entra External ID Login weitergeleitet.
            </v-alert>
            <v-btn
              color="primary"
              size="large"
              :loading="isLoading"
              :disabled="isLoading"
              prepend-icon="mdi-microsoft"
              data-testid="btn-microsoft-signin"
              @click="onSignIn"
            >
              {{ buttonLabel }}
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
// In Nuxt 3 sind Auto-Imports verfügbar; für ESLint-Zwecke importieren wir explizit aus '#imports'
import { useAuth } from '#imports'
interface Props {
  /** Überschrift über dem Login-Button */
  title?: string
  /** Provider-ID, muss zu server/api/auth/[...].ts passen */
  providerId: string
  /** Anzeigename des Providers */
  providerName?: string
  /** Optionale Ziel-URL nach erfolgreichem Login */
  redirectTo?: string
  /** Optionale Beschreibung unterhalb des Titels */
  description?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Anmelden',
  providerName: 'Microsoft Entra External ID',
  redirectTo: '/',
  description: 'Melde dich an, um auf deinen geschützten Bereich und gebuchte Kurse zuzugreifen.',
})

const computedTitle = computed(() => props.title)
const computedDescription = computed(() => props.description)
const buttonLabel = computed(() => `Mit ${props.providerName} anmelden`)

// nuxt-auth composable
const { signIn, status } = useAuth()
const isLoading = computed(() => status.value === 'loading')

const onSignIn = async () => {
  try {
    await signIn(props.providerId, { callbackUrl: props.redirectTo })
  } catch (e) {
    // Oberfläche bleibt einfach; Fehler werden im Redirect-Flow von Auth.js behandelt
    console.error('Sign-in failed', e)
  }
}
</script>

<style scoped>
.fill-height {
  min-height: 70vh;
}
</style>
