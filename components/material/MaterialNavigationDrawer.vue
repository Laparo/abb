<template>
  <v-navigation-drawer
    v-model="model"
    :temporary="temporary"
    :permanent="permanent"
    :location="location"
    :width="width"
  >
    <slot name="header" />
    <v-divider v-if="showDivider" />
    <v-list :density="density" nav>
      <v-list-item
        v-for="(item, i) in items"
        :key="i"
        :prepend-icon="item.icon"
        :title="item.title"
        :value="item.value"
        @click="$emit('select', item, i)"
      />
    </v-list>
    <slot name="footer" />
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface NavItem<T = string> {
  title: string
  icon?: string
  value?: T
}

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    items?: NavItem[]
    density?: 'default' | 'comfortable' | 'compact'
    width?: number | string
    location?: 'start' | 'end' | 'left' | 'right'
    temporary?: boolean
    permanent?: boolean
    showDivider?: boolean
  }>(),
  {
    items: () => [],
    density: 'compact',
    width: 320,
    location: 'start',
    temporary: false,
    permanent: false,
    showDivider: true,
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'select', item: NavItem, index: number): void
}>()

const model = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', Boolean(val)),
})

defineOptions({ name: 'MaterialNavigationDrawer' })
</script>
