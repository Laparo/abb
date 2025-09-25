import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'

const ExampleCard = {
  render() {
    return h('div', { class: 'example' }, 'Hello Test')
  },
}

describe('ExampleCard', () => {
  it('renders', () => {
    const wrapper = mount(ExampleCard)
    expect(wrapper.text()).toContain('Hello Test')
  })
})
