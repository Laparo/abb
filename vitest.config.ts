import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
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
        'e2e/**',
        'node_modules/**',
        'dist/**',
        '.nuxt/**',
      ],
      // TODO: Raise thresholds as the project grows; initial bootstrap values
      thresholds: {
        lines: 50,
        functions: 30,
        branches: 50,
        statements: 50,
      },
    },
  },
  ssr: {
    noExternal: ['vuetify'],
  },
})
