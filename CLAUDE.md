# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development

- `npm run dev` - Start development server (<http://localhost:3000>)
- `npm run build` - Build for production
- `npm run start:prod` - Start production server (run build first)
- `npm run start:local:prod` - Start production server with .env loaded

### Quality Gates

- `npm run lint` - Run ESLint with max-warnings=0
- `npm run typecheck` - Run TypeScript type checking (includes Prisma generate)
- `npm test` or `npm run test:unit` - Run unit tests with Vitest
- `npm run test:watch` - Run unit tests in watch mode
- `npm run test:coverage` - Generate test coverage report
- `npm run test:e2e` - Run Playwright end-to-end tests

### Database

- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations for development
- `npm run prisma:seed` - Seed the database with test data

### Other

- `npm run apply:qodo -- --pr <number>` - Apply Qodo suggestions from PR (use `--dry` for preview)

## Architecture

This is a Nuxt.js 3 application with Vue 3 Composition API, TypeScript strict mode, and Vuetify 3 for UI components.

### Key Technologies

- **Framework**: Nuxt.js 3 with Universal Rendering (SSR/SPA hybrid)
- **Database**: Prisma ORM with SQLite (dev) and Azure SQL Server (production)
- **UI Framework**: Vuetify 3 with Material Design 3
- **Testing**: Vitest (unit), Vue Test Utils (components), Playwright (E2E)
- **Code Quality**: ESLint, Prettier, Commitlint, Husky pre-commit hooks

### Project Structure

- `pages/` - File-based routing (Nuxt.js convention)
- `components/` - Reusable Vue components, organized by domain
  - `components/booking/` - Business logic components for course bookings
  - `components/course/` - Course-related UI components
- `composables/` - Business logic and state management (Vue 3 Composition API)
- `server/api/` - Nuxt server API routes
- `prisma/` - Database schema, migrations, and seeding

### Database Setup

- Development uses SQLite (`prisma/schema.prisma`)
- Production uses Azure SQL Server (`prisma/schema.prod.prisma`)
- Always run `npm run prisma:generate` after schema changes
- Run `npm run prisma:migrate` for new migrations in development

### Component Development Patterns

- Follow component-first development: reusable Vue components with clear prop interfaces
- Use Vuetify 3 components for consistent Material Design implementation
- Business logic belongs in composables, not in page components
- All components should be TypeScript with strict mode enabled
- Use Vue 3 Composition API with `<script setup>` syntax

### Vuetify Component Usage

- **IMPORTANT**: Vuetify auto-import is disabled for bundle size optimization
- All Vuetify components must be explicitly imported from 'vuetify/components'
- Example: `import { VCard, VBtn, VIcon } from 'vuetify/components'`
- Only import components that are actually used in the template
- This reduces bundle size from ~630kB to ~200-250kB

- Icons: mdi-svg is configured in `plugins/vuetify.ts`; do not import `@mdi/font`.
- Use only standard Vuetify components; no custom Material wrapper components.

### Testing Requirements

- Unit tests for all composables using Vitest
- Component tests using Vue Test Utils with Vuetify integration
- E2E tests for critical user flows using Playwright
- Tests run against a production-like build for E2E stability
- Coverage thresholds are configured in vitest.config.ts

### Performance & SEO

- Server-side rendering enabled for public content
- File-based routing follows Nuxt.js conventions
- Vuetify tree-shaking configured for optimal bundle size
- Core Web Vitals compliance expected

### Deployment

- Staging: `main` branch → Azure Static Web Apps Preview
- Production: `production` branch → Azure Static Web Apps Production
- Production deployments require 2+ reviewer approvals
- All quality gates (lint, typecheck, unit tests, E2E) must pass
- Prisma migrations run automatically on main branch deployments
