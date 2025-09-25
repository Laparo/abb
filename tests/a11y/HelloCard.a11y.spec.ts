import { describe, it, expect } from 'vitest'
import { mountWithVuetify } from '../utils/mountWithVuetify'
import HelloCard from '../../components/HelloCard.vue'
import { configureAxe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

const axe = configureAxe({
  rules: {
    // In Komponenten-Unit-Tests fehlen Layout-Landmarks wie <main>, daher "region" deaktivieren
    region: { enabled: false },
  },
})

describe('HelloCard (a11y)', () => {
  it('hat keine offensichtlichen Accessibility-Verstöße (light)', async () => {
    const wrapper = mountWithVuetify(HelloCard, { props: { title: 'Hi' } }, 'light')
    const results = await axe(wrapper.element as unknown as HTMLElement)
    expect(results).toHaveNoViolations()
  })

  it('hat keine offensichtlichen Accessibility-Verstöße (dark)', async () => {
    const wrapper = mountWithVuetify(HelloCard, { props: { title: 'Hi' } }, 'dark')
    const results = await axe(wrapper.element as unknown as HTMLElement)
    expect(results).toHaveNoViolations()
  })
})
