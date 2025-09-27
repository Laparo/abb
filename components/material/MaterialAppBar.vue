<template>
  <v-app-bar :color="color" :density="density" :flat="flat" class="rounded">
    <v-app-bar-nav-icon v-if="nav" @click="$emit('click:nav')" />

    <v-app-bar-title>
      <slot name="title">{{ title }}</slot>
    </v-app-bar-title>

    <v-spacer />

    <slot name="actions">
      <template v-for="(action, idx) in actions" :key="idx">
        <v-btn
          :icon="action.icon"
          variant="text"
          :color="action.color"
          @click="$emit('action', action, idx)"
        />
      </template>
    </slot>
  </v-app-bar>
  <v-divider v-if="divider" />
  <slot />
  <v-divider v-if="dividerBottom" />
</template>

<script setup lang="ts">
interface AppBarAction {
  /** Material Design Icons name, e.g. 'mdi-magnify' */
  icon: string
  /** Optional color name from theme */
  color?: string
  /** Optional value used by consumer */
  value?: unknown
}

interface Props {
  /** Title text to display when no custom title slot is used */
  title?: string
  /** Show navigation icon on the left */
  nav?: boolean
  /** Predefined actions when no custom actions slot is used */
  actions?: AppBarAction[]
  /** Color of the app bar */
  color?: string
  /** Density of the app bar (default, comfortable, compact) */
  density?: 'default' | 'comfortable' | 'compact'
  /** Remove elevation */
  flat?: boolean
  /** Show a divider below the app bar */
  divider?: boolean
  /** Show an extra divider below projected default content */
  dividerBottom?: boolean
}

withDefaults(defineProps<Props>(), {
  title: '',
  nav: false,
  actions: () => [],
  color: 'primary',
  density: 'default',
  flat: false,
  divider: false,
  dividerBottom: false,
})

defineEmits<{
  /** Emitted when the nav icon is clicked */
  (e: 'click:nav'): void
  /** Emitted when one of the provided actions is clicked */
  (e: 'action', action: AppBarAction, index: number): void
}>()

defineOptions({ name: 'MaterialAppBar' })
</script>
