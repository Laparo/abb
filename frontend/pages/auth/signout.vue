<template>
  <v-container class="py-10">
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6" class="text-center">
        <v-icon size="56" class="mb-4">mdi-logout</v-icon>
        <h1 class="text-h5 mb-2">Du wurdest abgemeldet</h1>
        <p class="mb-6">Bis bald! Du kannst dich jederzeit erneut anmelden.</p>
        <NuxtLink to="/auth/signin">
          <v-btn color="primary" prepend-icon="mdi-login">Erneut anmelden</v-btn>
        </NuxtLink>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
// optional: call signOut when page loads if query `do` is present
const route = useRoute()
const { signOut } = useAuth()
if (route.query.do === 'now') {
  signOut({ callbackUrl: '/' })
}
</script>
