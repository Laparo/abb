import { FullConfig } from '@playwright/test'
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

export default async function globalSetup(_: FullConfig) {
  // mark parameter as intentionally unused (satisfy lint rules)
  void _
  // Ensure Prisma client is generated and DB is migrated + seeded before E2E.
  // Using sync commands keeps setup simple and visible in logs.
  // Provide a fallback DATABASE_URL for CI environments without .env
  // Use an absolute path to avoid CWD differences between Playwright and Nitro server.
  const absoluteDbUrl = `file:${path.resolve(process.cwd(), 'dev-e2e.db')}`
  process.env.DATABASE_URL = process.env.DATABASE_URL || absoluteDbUrl
  // Reset persistent SQLite file to ensure deterministic E2E state across runs
  try {
    const dbFilePath = path.resolve(process.cwd(), 'dev-e2e.db')
    if (fs.existsSync(dbFilePath)) {
      fs.rmSync(dbFilePath)

      console.log('[e2e setup] removed existing DB file:', dbFilePath)
    }
  } catch (err) {
    console.warn('[e2e setup] could not reset DB file:', (err as Error)?.message)
  }
  // Persist this value for the web server via a dedicated env file used only for E2E
  const envE2EPath = path.resolve(process.cwd(), '.env.e2e')
  try {
    const origin = process.env.NUXT_AUTH_ORIGIN || 'http://localhost:3000'
    const secret = process.env.NUXT_AUTH_SECRET || 'test-e2e-secret-change-me'
    fs.writeFileSync(
      envE2EPath,
      `DATABASE_URL="${process.env.DATABASE_URL}"\nNUXT_AUTH_ORIGIN="${origin}"\nNUXT_AUTH_SECRET="${secret}"\nNEXTAUTH_URL="${origin}"\nAUTH_URL="${origin}"\nAUTH_ORIGIN="${origin}"\nAUTH_TRUST_HOST="true"\n`
    )
  } catch {
    // non-fatal
  }
  try {
    execSync('npx prisma generate', { stdio: 'inherit' })
    // Use dev migrate for SQLite; for CI this creates/updates the local file DB.
    execSync('npx prisma migrate deploy', { stdio: 'inherit' })
  } catch {
    // Fallback for local runs where migrate deploy has no migrations yet
    try {
      execSync('npx prisma migrate dev --name init --skip-seed', { stdio: 'inherit' })
    } catch {
      // ignore
    }
  }
  try {
    execSync('npm run -s prisma:seed', { stdio: 'inherit' })
  } catch {
    // Seeding is optional but recommended; do not fail tests if it fails.
  }
}
