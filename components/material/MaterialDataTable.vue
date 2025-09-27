<template>
  <v-card :elevation="elevation">
    <v-card-title v-if="$slots.title || title" class="d-flex justify-space-between align-center">
      <slot name="title">{{ title }}</slot>
      <slot name="title-actions" />
    </v-card-title>

    <v-data-table
      :headers="headers"
      :items="items"
      :items-per-page="itemsPerPage"
      class="elevation-0"
    >
      <template v-for="(_, name) in $slots" #[name]="slotProps">
        <slot :name="name" v-bind="slotProps" />
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup lang="ts">
export interface TableHeader {
  title: string
  value: string
  sortable?: boolean
  align?: 'start' | 'end' | 'center'
}

export interface TableItem {
  [key: string]: unknown
}

withDefaults(
  defineProps<{
    title?: string
    headers: TableHeader[]
    items: TableItem[]
    itemsPerPage?: number
    elevation?: number | string
  }>(),
  {
    title: '',
    itemsPerPage: 5,
    elevation: 3,
  }
)

defineOptions({ name: 'MaterialDataTable' })
</script>
