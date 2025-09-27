<template>
  <v-carousel :height="height" :cycle="cycle" hide-delimiter-background show-arrows="hover">
    <v-carousel-item v-for="(slide, i) in slides" :key="i" :src="slide.src" :cover="cover">
      <slot name="slide" :slide="slide" :index="i">
        <div class="d-flex fill-height justify-end align-end">
          <v-card :color="overlayColor" flat tile class="pa-4" style="color: white">
            <v-card-title>{{ slide.title }}</v-card-title>
            <v-card-text>{{ slide.description }}</v-card-text>
          </v-card>
        </div>
      </slot>
    </v-carousel-item>
  </v-carousel>
</template>

<script setup lang="ts">
export interface CarouselSlide {
  src: string
  title?: string
  description?: string
}

withDefaults(
  defineProps<{
    slides: CarouselSlide[]
    height?: string | number
    cycle?: boolean
    cover?: boolean
    overlayColor?: string
  }>(),
  {
    height: 300,
    cycle: true,
    cover: true,
    overlayColor: 'rgba(0,0,0,0.4)',
  }
)

defineOptions({ name: 'MaterialCarousel' })
</script>
