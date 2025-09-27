import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  expect: {
    timeout: 30000,
  },
  globalSetup: './e2e/global-setup.ts',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  retries: 1,
  workers: 1,
  reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
  webServer: {
    // Stabilere Tests gegen lokalen Produktionsserver
    // 1) Build (falls nicht vorhanden), 2) Start mit .env
    // Use dedicated .env.e2e created by global-setup to ensure same DB
    command: 'npm run build && npm run start:e2e',
    port: 3000,
    reuseExistingServer: true,
    timeout: 120_000,
  },
})
