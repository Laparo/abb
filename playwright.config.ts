import { defineConfig } from '@playwright/test'
import path from 'node:path'

// Ensure consistent DATABASE_URL for both globalSetup and webServer
const e2eDbUrl = `file:${path.resolve(process.cwd(), 'dev-e2e.db')}`
process.env.DATABASE_URL = e2eDbUrl

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
    // Use production build for consistent results
    command: 'npm run build && npm run start:prod',
    port: 3000,
    reuseExistingServer: false,
    timeout: 180_000,
  },
})
