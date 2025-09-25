import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

// Basic a11y smoke on the home page. We relax the 'region' rule similar to unit tests.
// For full-page audits in CI, consider removing disableRules and asserting specific critical rules.

test.describe('Accessibility', () => {
  test('home page has no detectable a11y violations', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('h1:has-text("ABB")', { state: 'visible' })

    const results = await new AxeBuilder({ page }).disableRules(['region']).analyze()

    // If this fails, the console will show rule IDs and nodes. Fix semantics/aria accordingly.
    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([])
  })
})
