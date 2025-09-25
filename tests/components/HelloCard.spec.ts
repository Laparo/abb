import { describe, it, expect } from 'vitest'
import HelloCard from '../../components/HelloCard.vue'
import { mountWithVuetify } from '../utils/mountWithVuetify'

describe('HelloCard', () => {
  it('zeigt Titel und Startwert', () => {
    const wrapper = mountWithVuetify(HelloCard, { props: { title: 'Hi', count: 2 } })
    expect(wrapper.get('[data-testid="title"]').text()).toBe('Hi')
    expect(wrapper.get('[data-testid="count"]').text()).toContain('2')
  })

  it('erhöht Zähler beim Klick', async () => {
    const wrapper = mountWithVuetify(HelloCard, { props: { title: 'Hi' } })
    await wrapper.get('[data-testid="inc"]').trigger('click')
    expect(wrapper.get('[data-testid="count"]').text()).toContain('1')
  })
})
