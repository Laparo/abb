<template>
  <v-breadcrumbs :items="items" :divider="divider">
    <template #item="{ item }">
      <v-breadcrumbs-item :href="item.href" :disabled="item.disabled">
        <slot name="item" :item="item">{{ item.title }}</slot>
      </v-breadcrumbs-item>
    </template>
  </v-breadcrumbs>
</template>

<script setup lang="ts">
export interface BreadcrumbItem {
  title: string
  href?: string
  disabled?: boolean
}

interface Props {
  items: BreadcrumbItem[]
  divider?: string
}

withDefaults(defineProps<Props>(), {
  divider: '/',
})

defineOptions({ name: 'MaterialBreadcrumbs' })
</script>
