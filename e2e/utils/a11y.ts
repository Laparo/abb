import AxeBuilder from '@axe-core/playwright'
import type { Page } from '@playwright/test'

export async function checkPageA11y(page: Page, route: string) {
  await page.goto(route, { waitUntil: 'domcontentloaded' })
  // Nuxt Root sicherstellen und auf erste sichtbare Inhalte warten
  await page.waitForSelector('#__nuxt', { state: 'attached' })
  await page
    .waitForSelector('h1, main[role="main"]', { state: 'attached', timeout: 15000 })
    .catch(() => {})
  // Für ABB-Seiten ist 'region' auf Komponentenebene deaktiviert
  const results = await new AxeBuilder({ page }).disableRules(['region']).analyze()
  if (results.violations.length > 0) {
    throw new Error(JSON.stringify(results.violations, null, 2))
  }
}
