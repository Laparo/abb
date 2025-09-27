<template>
  <v-card class="v-card--material pa-3" v-bind="$attrs">
    <div class="d-flex flex-wrap">
      <v-avatar
        v-if="avatar"
        :size="128"
        class="mx-auto v-card--material__avatar elevation-6"
        color="grey"
      >
        <v-img :src="avatar" />
      </v-avatar>

      <v-sheet
        v-else
        class="text-start v-card--material__heading mb-n6"
        elevation="6"
        :color="color"
        :class="{ 'pa-7': !hasImageSlot }"
        :max-height="icon ? 90 : undefined"
        :width="icon ? 'auto' : '100%'"
      >
        <slot v-if="hasHeadingSlot" name="heading" />
        <slot v-else-if="hasImageSlot" name="image" />

        <div v-else-if="title && !icon" class="text-h4 font-weight-light">
          {{ title }}
        </div>

        <v-icon v-else-if="icon" :size="32">{{ icon }}</v-icon>

        <div v-if="text" class="text-h5 font-weight-thin">
          {{ text }}
        </div>
      </v-sheet>

      <div v-if="$slots['after-heading']" class="ml-6">
        <slot name="after-heading" />
      </div>

      <div v-else-if="icon && title" class="ml-4">
        <div class="text-h6 font-weight-light">{{ title }}</div>
      </div>
    </div>

    <slot />

    <template v-if="$slots.actions">
      <v-divider class="mt-2" />
      <v-card-actions class="pb-0">
        <slot name="actions" />
      </v-card-actions>
    </template>
  </v-card>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'
// Ported for Vuetify 3 and Nuxt 3, using script setup + TS
interface Props {
  /** Bild-URL für Avatar im Header */
  avatar?: string
  /** Farbe des Heading-Sheets (MD3 Theme Color Name oder HEX) */
  color?: string
  /** Icon-Namen (mdi: string), z. B. mdi-account */
  icon?: string
  /** Alternativ-Textzeile unter dem Titel */
  text?: string
  /** Titel der Karte */
  title?: string
}

withDefaults(defineProps<Props>(), {
  avatar: '',
  color: 'success',
  icon: undefined,
  text: '',
  title: '',
})

const slots = useSlots()
const hasHeadingSlot = computed(() => Boolean(slots.heading))
const hasImageSlot = computed(() => Boolean(slots.image))

// Note: derived "hasHeading" not used in this port; can be reintroduced if needed
</script>

<style scoped lang="sass">
.v-card--material
  &__avatar
    position: relative
    top: -64px
    margin-bottom: -32px

  &__heading
    position: relative
    top: -40px
    transition: .3s ease
    z-index: 1
</style>
