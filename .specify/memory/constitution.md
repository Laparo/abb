<!-- 
Sync Impact Report:
Version change: 1.1.0 → 1.2.0
Modified principles: Updated V. Composables for Logic Sharing to include Vuetify integration
Added sections: VII. Vuetify UI Framework Standards (NEW)
Updated sections: Nuxt.js Standards - replaced TailwindCSS with Vuetify in Module Strategy
Removed sections: none
Templates requiring updates: 
✅ updated: plan-template.md Constitution Check includes Vuetify validation
✅ updated: tasks-template.md includes Vuetify setup, theming, and UI component tasks
✅ updated: copilot-instructions.md includes Vuetify architecture and component patterns
Follow-up TODOs: None - all templates synchronized with Vuetify integration
-->

# ABB Constitution

## Core Principles

### I. Component-First Development

Every feature MUST be implemented as reusable Vue components. Components MUST be self-contained with clear props interface, documented with JSDoc, and independently testable. No business logic in pages - pages orchestrate components only.

**Rationale**: Nuxt.js thrives on component reusability. This ensures maintainable, testable code that scales with the application.

### II. File-Based Routing Discipline

Follow Nuxt.js file-based routing conventions strictly. Page components MUST reside in `/pages/` directory with naming that reflects URL structure. Dynamic routes use square bracket notation `[param].vue`. No manual route configuration unless absolutely necessary.

**Rationale**: Nuxt.js routing conventions provide predictable URL structure and automatic code splitting benefits.

### III. SSR/SPA Hybrid Strategy (NON-NEGOTIABLE)

Default to Server-Side Rendering for SEO and performance. Client-side hydration MUST be optimized to prevent layout shifts. SPA mode only for authenticated admin areas. Universal rendering for public-facing content is mandatory.

**Rationale**: ABB project requires optimal performance and SEO capabilities that only proper SSR can provide.

### IV. TypeScript-First Development

All components, composables, and utilities MUST be written in TypeScript. Strict mode enabled. No `any` types except in migration scenarios with explicit TODO comments. Type definitions for all external APIs and data structures required.

**Rationale**: Type safety prevents runtime errors and improves developer experience in Nuxt.js applications.

### V. Composables for Logic Sharing

Business logic and state management MUST use Nuxt.js composables pattern. Server-side data fetching via `$fetch` and `useFetch`. Client-side reactivity via Vue 3 Composition API. UI state and theming MUST leverage Vuetify's composables (`useTheme`, `useDisplay`). No Vuex - use Pinia only if complex state management needed.

**Rationale**: Composables provide optimal code reuse and align with Vue 3, Nuxt.js, and Vuetify ecosystem best practices.

### VI. Prisma ORM Integration (NON-NEGOTIABLE)

All database operations MUST use Prisma ORM with type-safe client generation. Database schema MUST be defined in `schema.prisma` file. Database migrations MUST be version-controlled and applied through Prisma migrate. No raw SQL queries except for complex analytics with explicit justification and type safety.

**Rationale**: Prisma provides type safety, excellent developer experience, and seamless integration with TypeScript and Nuxt.js server API routes.

### VII. Vuetify UI Framework Standards (NON-NEGOTIABLE)

All UI components MUST use Vuetify 3 component library. Custom styling MUST follow Material Design 3 principles through Vuetify's theming system. Component composition MUST leverage Vuetify's layout system (`v-app`, `v-main`, `v-navigation-drawer`). Theme customization MUST be centralized in Vuetify configuration. No CSS frameworks other than Vuetify allowed.

**Rationale**: Vuetify provides comprehensive Material Design implementation, excellent TypeScript support, and seamless Vue 3 integration for consistent, accessible UI.

## Nuxt.js Standards

### Module and Plugin Strategy

Use official Nuxt modules when available (`@pinia/nuxt`, `@nuxtjs/google-fonts`, etc.). Vuetify integration MUST use official `@invictus.codes/nuxt-vuetify` or configure manually following Vuetify 3 SSR guidelines. Custom plugins MUST be documented and follow Nuxt.js plugin patterns. Server-side plugins separate from client-side plugins with clear naming convention.

### Performance and SEO Requirements

- Core Web Vitals compliance mandatory
- Image optimization via Nuxt Image module
- Meta tags management through `useHead()` composable
- Lazy loading for below-the-fold components
- Bundle size monitoring with build analysis
- Vuetify tree-shaking MUST be properly configured to reduce bundle size
- Material Design Icons MUST be selectively imported, not the entire icon set

### Database Standards

All database interactions MUST follow Prisma best practices:

- Schema-first development with `prisma/schema.prisma`
- Type-safe database client through `@prisma/client`
- Database migrations via `prisma migrate dev` and `prisma migrate deploy`
- Seeding through `prisma/seed.ts` for development and testing
- Connection pooling and optimization for production environments

## Development Constraints

### Testing Requirements

- Unit tests for all composables using Vitest
- Component testing with Vue Test Utils
- E2E testing for critical user flows with Playwright
- Test coverage minimum 80% for business logic
- Database integration tests with test database isolation
- Schema validation tests for Prisma models

### Code Quality Gates

- ESLint with Nuxt.js recommended rules
- Prettier for consistent formatting
- Commitlint for conventional commits
- Pre-commit hooks for linting and type checking

## Governance

Constitution supersedes all other development practices. All pull requests MUST verify compliance with these principles. Amendments require team consensus, version bump, and migration plan for existing code.

Complex architecture decisions that deviate from these principles MUST be documented with explicit justification and approved by senior team members.

**Version**: 1.2.0 | **Ratified**: 2025-09-23 | **Last Amended**: 2025-09-23
