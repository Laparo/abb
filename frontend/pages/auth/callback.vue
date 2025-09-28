<template>
  <div class="d-flex justify-center align-center" style="min-height: 100vh">
    <VCard class="pa-6" width="400" elevation="2">
      <VCardTitle class="text-center">
        <VIcon icon="mdi-loading" class="animate-spin me-2" />
        Authentifizierung wird verarbeitet...
      </VCardTitle>

      <VCardText class="text-center">
        <VProgressLinear indeterminate color="primary" />
        <p class="mt-4 text-body-2">
          Sie werden in Kürze weitergeleitet.
        </p>
      </VCardText>

      <VCardActions v-if="error" class="justify-center">
        <VAlert type="error" variant="tonal" class="mb-4">
          {{ error }}
        </VAlert>
        <VBtn color="primary" @click="goHome">
          Zur Startseite
        </VBtn>
      </VCardActions>
    </VCard>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { VCard, VCardTitle, VCardText, VCardActions, VBtn, VIcon, VProgressLinear, VAlert } from 'vuetify/components'

const error = ref<string | null>(null)
const { checkAuth } = useAuth()

const goHome = () => {
  navigateTo('/')
}

onMounted(async () => {
  try {
    // Check authentication status after callback
    await checkAuth()

    // Small delay for UX
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Redirect to intended destination or home
    const route = useRoute()
    const callbackUrl = route.query.callbackUrl as string

    if (callbackUrl) {
      window.location.href = decodeURIComponent(callbackUrl)
    } else {
      await navigateTo('/')
    }
  } catch (err) {
    console.error('Authentication callback error:', err)
    error.value = 'Authentifizierung fehlgeschlagen. Bitte versuchen Sie es erneut.'
  }
})
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>