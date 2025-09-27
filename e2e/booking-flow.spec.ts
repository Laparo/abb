import { test, expect } from '@playwright/test'

// Happy path: list courses -> open details -> submit booking
// Assumes prisma seed created at least one future course.

test('booking happy path', async ({ page }) => {
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
  await page.fill('input[type="email"]', `e2e-${Date.now()}@example.com`)
  await page.click('button:has-text("Jetzt buchen")')

  // Expect success alert
  await page.waitForSelector('text=Buchung erfolgreich!', { timeout: 10000 })
})
