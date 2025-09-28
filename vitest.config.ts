import { defineConfig } from 'vitest/config'
import path from 'node:path'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
      '~': path.resolve(__dirname, '.'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    reporters: ['basic'],
    include: ['tests/**/*.{test,spec}.ts'],
    exclude: ['e2e/**', 'node_modules/**', 'dist/**'],
    setupFiles: ['tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      reportsDirectory: 'coverage',
      exclude: [
        'app.vue',
        'nuxt.config.ts',
        'playwright.config.ts',
        'plugins/**',
        'server/**',
        'pages/**',
        'tests/**',
        'node_modules/**',
        'dist/**',
        '.nuxt/**',
        // Legacy / transitional folders kept temporarily during consolidation
        'backend/**',
        'frontend/**',
        // Generated coverage & build artifacts
        'coverage/**',
        // Scripts that are tooling-only (can be added later if desired)
        'scripts/apply-qodo-suggestions.ts',
      ],
      // TODO: Raise thresholds as the project grows; initial bootstrap values
      thresholds: {
        // Temporär abgesenkt (Option A) – Ziel: sukzessive Erhöhung (siehe CHANGELOG Unreleased)
        lines: 18,
        functions: 30,
        branches: 50,
        statements: 18,
      },
    },
  },
  ssr: {
    noExternal: ['vuetify'],
  },
})
