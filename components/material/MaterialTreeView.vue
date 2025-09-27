<template>
  <v-treeview
    :items="items"
    activatable
    item-title="name"
    item-value="id"
    :open-strategy="openStrategy"
  >
    <template #prepend="{ item }">
      <v-icon v-if="item.icon">{{ item.icon }}</v-icon>
    </template>
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps" />
    </template>
  </v-treeview>
</template>

<script setup lang="ts">
export interface TreeItem {
  id: string | number
  name: string
  icon?: string
  children?: TreeItem[]
}

withDefaults(
  defineProps<{
    items: TreeItem[]
    openStrategy?: 'single' | 'multiple'
  }>(),
  {
    openStrategy: 'multiple',
  }
)

defineOptions({ name: 'MaterialTreeView' })
</script>
