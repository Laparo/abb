import { mount } from '@vue/test-utils'
import MaterialCard from '@/components/material/MaterialCard.vue'
import { createVuetify } from 'vuetify'
import * as vuetifyComponents from 'vuetify/components'
import * as vuetifyDirectives from 'vuetify/directives'
import { md3 } from 'vuetify/blueprints'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'

const vuetify = createVuetify({
  blueprint: md3,
  components: vuetifyComponents,
  directives: vuetifyDirectives,
  icons: { defaultSet: 'mdi', aliases, sets: { mdi } },
})

describe('MaterialCard', () => {
  it('renders title and text when provided', () => {
    const wrapper = mount(MaterialCard, {
      props: { title: 'Hello', text: 'World' },
      global: { plugins: [vuetify] },
    })
    expect(wrapper.text()).toContain('Hello')
    expect(wrapper.text()).toContain('World')
  })

  it('renders icon when provided', () => {
    const wrapper = mount(MaterialCard, {
      props: { icon: 'mdi-account' },
      global: { plugins: [vuetify] },
    })
    expect(wrapper.find('.v-icon').exists()).toBe(true)
  })
})
