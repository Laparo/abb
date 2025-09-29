import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  expect: {
    timeout: 30000,
  },
  use: {
    baseURL: 'https://ambitious-meadow-017482503.2.azurestaticapps.net',
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  retries: 2,
  workers: 1,
  reporter: [['list'], ['html', { outputFolder: 'playwright-report-azure', open: 'never' }]],
  // Kein webServer needed - wir testen die deployed Azure Umgebung
})
