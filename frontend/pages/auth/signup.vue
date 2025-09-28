<template>
  <v-container class="py-8">
    <v-row justify="center">
      <v-col cols="12" sm="10" md="8" lg="6">
        <AuthSignInCard
          provider-id="microsoft-entra-external"
          title="Registrieren oder Anmelden"
          description="Erstelle ein neues Konto oder melde dich mit einem bestehenden Konto an. Wir verwenden einen kombinierten Anmelde- und Registrierungsfluss (Sign up and sign in)."
        />
        <v-alert type="info" variant="text" class="mt-4">
          Tipp: Dieser Flow ist kombiniert. Wenn du noch kein Konto hast, wähle im Microsoft Entra
          Dialog „Konto erstellen“.
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
// Seite nutzt denselben kombinierten Entra-Flow wie /auth/signin.
// Keine zusätzliche Logik notwendig – die Auswahl (Sign-up vs. Sign-in)
// erfolgt im Entra-Dialog gemäß konfigurierter User Flow Policy.
</script>

<style scoped></style>
