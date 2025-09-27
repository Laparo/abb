import { test, expect } from '@playwright/test'

// Happy path: list courses -> open details -> submit booking
// Assumes prisma seed created at least one future course.

test('booking happy path', async ({ page }) => {
  // Debug hooks to surface client-side issues in CI
  page.on('console', (msg) => {
    console.log('[browser console]', msg.type(), msg.text())
  })
  page.on('pageerror', (err) => {
    console.log('[pageerror]', err.message)
  })
  page.on('request', (req) => {
    if (req.url().includes('/api/bookings')) {
      console.log('[request]', req.method(), req.url())
    }
  })
  page.on('response', (res) => {
    if (res.url().includes('/api/bookings')) {
      console.log('[response]', res.status(), res.url())
    }
  })
  await page.goto('/courses')
  // There should be at least one course card rendered
  await page.waitForSelector('text=Kurse')
  // Click the first course "Details" button
  const buttons = page.locator('a:has-text("Details")')
  const count = await buttons.count()
  expect(count).toBeGreaterThan(0)
  await buttons.first().click()

  // On details page, fill email and book
  await page.waitForSelector('text=Buchen')
  // Vuetify may not render a native <input type="email">; use accessible label instead
  await page.getByLabel('E-Mail').fill(`e2e-${Date.now()}@example.com`)
  const bookButton = page.getByRole('button', { name: 'Jetzt buchen' })
  // In manchen SSR-Szenarien feuert der Request sehr schnell. Prüfe sowohl absolute als auch relative URL
  const apiUrlMatcher = (url: string) =>
    url.endsWith('/api/bookings') ||
    url.includes('/api/bookings?') ||
    url.includes('/api/bookings#')
  const [maybeResp] = await Promise.all([
    page.waitForResponse((r) => apiUrlMatcher(r.url()) && r.request().method() === 'POST'),
    bookButton.click(),
  ])
  // Basic response assertion (defensive); allow non-2xx but surface body
  const json = await maybeResp.json().catch(() => ({}))

  console.log('[assert] bookings response status', maybeResp.status(), json)
  expect(maybeResp.status()).toBeLessThan(400)
  expect(json.ok).toBeTruthy()
  // Expect success alert
  await page.waitForSelector('text=Buchung erfolgreich!', { timeout: 15000 })
})
