<template>
  <v-alert class="v-alert--material" v-bind="$attrs">
    <template v-if="icon" #prepend>
      <v-icon class="v-alert__icon elevation-6" :color="color" size="24">
        {{ icon }}
      </v-icon>
    </template>

    <slot />

    <template v-if="dismissible" #close>
      <v-btn icon variant="text" size="small" @click="onClose">
        <v-icon size="20">mdi-close</v-icon>
      </v-btn>
    </template>
  </v-alert>
</template>

<script setup lang="ts">
interface Props {
  icon?: string
  color?: string
  dismissible?: boolean
}

withDefaults(defineProps<Props>(), {
  icon: undefined,
  color: undefined,
  dismissible: false,
})

const emit = defineEmits<{ (e: 'close'): void }>()
const onClose = () => emit('close')
</script>

<style scoped lang="sass">
.v-alert--material
  margin-top: 32px

  .v-alert__icon
    top: -4px

  .v-alert__dismissible
    align-self: flex-start
    margin: 0 !important
    padding: 0 !important
</style>
