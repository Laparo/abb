import { test, expect } from '@playwright/test'

test('home page renders and has title', async ({ page }) => {
  await page.goto('/')
  await page.waitForSelector('h1:has-text("ABB")', { state: 'visible' })
  await expect(page).toHaveTitle(/ABB – Start/i)
})
