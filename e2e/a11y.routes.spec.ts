import { test } from '@playwright/test'
import { checkPageA11y } from './utils/a11y'

test.describe('Accessibility routes', () => {
  test('home', async ({ page }) => {
    await checkPageA11y(page, '/')
  })

  test('404 page', async ({ page }) => {
    await checkPageA11y(page, '/definitiv-nicht-vorhanden')
  })
})
