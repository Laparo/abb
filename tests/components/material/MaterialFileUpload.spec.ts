import { nextTick } from 'vue'
import MaterialFileUpload from '@/components/material/MaterialFileUpload.vue'
import { mountWithVuetify } from '@/tests/utils/mountWithVuetify'

function createFile(name: string, type: string, content = 'x') {
  return new File([content], name, { type })
}

describe('MaterialFileUpload', () => {
  it('emits files on drop and shows previews', async () => {
    const wrapper = mountWithVuetify(MaterialFileUpload, {
      attachTo: document.body,
    })

    const dropZone = wrapper.get('[data-testid="drop-zone"]')
    const files = [createFile('a.jpg', 'image/jpeg'), createFile('b.txt', 'text/plain')]

    const dataTransfer = new DataTransfer()
    files.forEach((f) => dataTransfer.items.add(f))

    await dropZone.trigger('drop', { dataTransfer })
    await nextTick()

    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted && emitted[0] && (emitted[0][0] as File[]).length).toBe(2)

    // previews rendered (one image + one generic icon)
    expect(wrapper.html()).toContain('a.jpg')

    wrapper.unmount()
  })
})
