// ESLint v9 flat config
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import vue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'
import prettierPlugin from 'eslint-plugin-prettier'

export default [
  // Ignore patterns
  {
    ignores: [
      'dist',
      '.nuxt',
      'coverage',
      'node_modules',
      '.output',
      'e2e/playwright-report',
      'playwright-report',
      'test-results',
      // Legacy ESLint config files
      '.eslintrc.cjs',
      '**/.eslintrc.*',
      '.eslintignore',
      '**/.eslintignore',
      // Ignore CJS config scripts
      '**/*.cjs',
      'commitlint.config.js',
    ],
  },

  // Base JS recommended rules
  js.configs.recommended,

  // TypeScript recommended
  ...tseslint.configs.recommended,

  // Vue 3 recommended flat config
  ...vue.configs['flat/recommended'],

  // Project-wide settings for TS + Vue SFCs
  {
    files: ['**/*.{ts,vue}'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        ecmaVersion: 'latest',
        sourceType: 'module',
        extraFileExtensions: ['.vue'],
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      vue,
      prettier: prettierPlugin,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': ['error', { ignoreRestArgs: true }],
      'prettier/prettier': 'error',
      // Relax overly verbose Vue style rules
      'vue/max-attributes-per-line': 'off',
      'vue/singleline-html-element-content-newline': 'off',
    },
  },

  // Nuxt-specific overrides: allow single-word names for pages and error component,
  // and turn off no-undef due to Nuxt auto-imports in SFCs
  {
    files: ['pages/**/*.vue', 'error.vue'],
    rules: {
      'vue/multi-word-component-names': 'off',
      'no-undef': 'off',
    },
  },
]
