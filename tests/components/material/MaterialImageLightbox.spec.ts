import { describe, it, expect } from 'vitest'
import { nextTick } from 'vue'
import { mountWithVuetify } from '@/tests/utils/mountWithVuetify'
import MaterialImageLightbox from '@/components/material/MaterialImageLightbox.vue'

const images = [
  { src: 'https://example.com/1.jpg', title: 'One' },
  { src: 'https://example.com/2.jpg', title: 'Two' },
]

describe('MaterialImageLightbox', () => {
  it('renders and navigates between images', async () => {
    const wrapper = mountWithVuetify(MaterialImageLightbox, {
      props: {
        modelValue: true,
        images,
      },
      attachTo: document.body,
    })

    await nextTick()

    expect(document.body.innerHTML).toContain('One')

    const nextBtn = document.body.querySelector('[aria-label="Next"]') as HTMLButtonElement | null
    expect(!!nextBtn).toBe(true)
    nextBtn!.click()
    await nextTick()
    await nextTick()

    expect(document.body.innerHTML).toContain('Two')

    wrapper.unmount()
  })
})
