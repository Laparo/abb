<template>
  <v-card :variant="variant">
    <v-card-text>
      <v-file-input
        v-model="filesProxy"
        :accept="accept"
        :multiple="multiple"
        :label="label"
        prepend-icon="mdi-upload"
        clearable
        @change="onChange"
      />

      <div
        class="mt-4 pa-6 d-flex align-center justify-center rounded border-dashed"
        :class="dragOver ? 'border-primary' : 'border-grey'"
        data-testid="drop-zone"
        @dragover.prevent="dragOver = true"
        @dragleave.prevent="dragOver = false"
        @drop.prevent="onDrop"
      >
        <span class="text-medium-emphasis">Dateien hierher ziehen oder oben auswählen</span>
      </div>

      <v-row v-if="previews.length" class="mt-4" dense>
        <v-col v-for="(p, i) in previews" :key="i" cols="6" sm="4" md="3">
          <v-sheet class="pa-2 d-flex flex-column align-center" rounded>
            <v-img v-if="p.isImage" :src="p.url" height="120" contain />
            <v-icon v-else size="48">mdi-file</v-icon>
            <div class="text-truncate mt-2" :title="p.name">{{ p.name }}</div>
          </v-sheet>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'

interface Props {
  /** v-model files */
  modelValue?: File[]
  /** Accept string, e.g. 'image/*' */
  accept?: string
  /** Allow multiple selection */
  multiple?: boolean
  /** Input label */
  label?: string
  variant?: 'elevated' | 'flat' | 'tonal' | 'outlined' | 'text'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  accept: undefined,
  multiple: true,
  label: 'Datei-Upload',
  variant: 'elevated',
})

const emit = defineEmits<{
  (e: 'update:modelValue', val: File[]): void
}>()

const filesProxy = computed<File[] | undefined>({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val ?? []),
})

const dragOver = ref(false)

type Preview = { url: string; isImage: boolean; name: string }
const previews = ref<Preview[]>([])
const objectUrls = new Set<string>()

const buildPreviews = (files: File[] | undefined) => {
  previews.value = []
  for (const f of files ?? []) {
    const isImage = /^image\//.test(f.type)
    const url = URL.createObjectURL(f)
    objectUrls.add(url)
    previews.value.push({ url, isImage, name: f.name })
  }
}

const onChange = (val: File[] | undefined) => {
  buildPreviews(val)
}

const onDrop = (e: DragEvent) => {
  dragOver.value = false
  if (!e.dataTransfer?.files?.length) return
  const list = Array.from(e.dataTransfer.files)
  emit('update:modelValue', list)
  buildPreviews(list)
}

onBeforeUnmount(() => {
  objectUrls.forEach((url) => URL.revokeObjectURL(url))
  objectUrls.clear()
})
</script>

<style scoped>
.border-dashed {
  border: 2px dashed var(--v-theme-outline-variant);
}
.border-primary {
  border-color: var(--v-theme-primary);
}
.border-grey {
  border-color: var(--v-theme-outline-variant);
}
.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}
</style>
