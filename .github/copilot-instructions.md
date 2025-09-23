# Copilot Instructions for ABB Project

## Project Overview
ABB is a Nuxt.js-based web application following strict spec-driven development principles. This project uses GitHub Spec Kit (Specify) for structured development workflows.

## Architecture & Technology Stack
- **Framework**: Nuxt.js 3 with Vue 3 Composition API
- **Language**: TypeScript (strict mode)
- **Database**: Prisma ORM with type-safe client generation
- **UI Framework**: Vuetify 3 with Material Design 3
- **State Management**: Vue 3 composables, Pinia if complex state needed
- **Testing**: Vitest for unit tests, Vue Test Utils for components, Playwright for E2E
- **Development**: ESLint + Prettier, Commitlint, pre-commit hooks

## Key Development Principles

### Component-First Development
- Every feature = reusable Vue components
- Components must have clear props interface + JSDoc
- No business logic in pages - pages orchestrate components only
- Self-contained, independently testable components

### File-Based Routing Discipline  
- Follow Nuxt.js `/pages/` directory structure strictly
- Dynamic routes use `[param].vue` notation
- URL structure reflects file structure
- No manual route configuration unless absolutely necessary

### SSR/SPA Hybrid Strategy
- Default to Server-Side Rendering for SEO/performance
- Optimize client-side hydration to prevent layout shifts
- SPA mode only for authenticated admin areas
- Universal rendering for public-facing content

### TypeScript-First Development
- All code in TypeScript with strict mode
- No `any` types (except migration with TODO comments)
- Type definitions for all external APIs and data structures
- Proper type safety throughout the application

### Composables for Logic Sharing
- Business logic implemented as Nuxt.js composables
- Server-side data fetching via `$fetch` and `useFetch`
- Client-side reactivity via Vue 3 Composition API
- UI state and theming via Vuetify composables (`useTheme`, `useDisplay`)
- Use Pinia only for complex state management needs

### Prisma ORM Integration
- All database operations through Prisma client
- Schema-first development with `prisma/schema.prisma`
- Type-safe database operations with full TypeScript support
- Database migrations version-controlled via Prisma migrate

### Vuetify UI Framework Standards
- All UI components use Vuetify 3 component library
- Follow Material Design 3 principles through Vuetify theming system
- Layout system uses `v-app`, `v-main`, `v-navigation-drawer`
- Theme customization centralized in Vuetify configuration
- Tree-shaking properly configured for optimal bundle size

## Project Structure
```
├── pages/              # File-based routing
├── components/         # Reusable Vue components
├── composables/        # Business logic and state
├── server/api/         # Nuxt server API routes
├── prisma/             # Database schema and migrations
├── plugins/            # Nuxt plugins
├── middleware/         # Route middleware
├── assets/             # Uncompiled assets
├── public/             # Static assets
├── .specify/           # Spec-driven development files
└── specs/              # Feature specifications
```

## Development Workflow

### Spec-Driven Development Commands
Use these slash commands in GitHub Copilot:
- `/constitution` - Establish project principles
- `/specify` - Create feature specifications
- `/clarify` - Clarify and de-risk specifications
- `/plan` - Create implementation plans
- `/tasks` - Generate actionable tasks
- `/analyze` - Validate alignment & consistency
- `/implement` - Execute implementation

### Code Quality Requirements
- ESLint with Nuxt.js recommended rules
- Prettier for consistent formatting  
- Commitlint for conventional commits
- Pre-commit hooks for linting and type checking
- 80% minimum test coverage for business logic

### Performance & SEO Standards
- Core Web Vitals compliance mandatory
- Image optimization via Nuxt Image module
- Meta tags management through `useHead()` composable
- Lazy loading for below-the-fold components
- Bundle size monitoring with build analysis

## Testing Strategy
- **Unit Tests**: All composables using Vitest
- **Component Tests**: Vue Test Utils for component logic
- **E2E Tests**: Playwright for critical user flows
- **Performance Tests**: Core Web Vitals monitoring

## Common Patterns

### Component Structure
```typescript
<template>
  <v-container>
    <!-- Use Vuetify components for consistent Material Design -->
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>{{ title }}</v-card-title>
          <v-card-text>
            <!-- Component content -->
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
// Props interface
interface Props {
  /** @description The title to display */
  title: string
  // More typed props with JSDoc
}

// Vuetify composables
const { theme } = useTheme()
const { mobile } = useDisplay()

// Other composables and logic
</script>

<style scoped>
/* Minimal custom styles - let Vuetify handle most styling */
</style>
```

### Composable Pattern
```typescript
// composables/useFeature.ts
export const useFeature = () => {
  // Server-side data fetching
  const { data, pending, error } = useFetch('/api/feature')
  
  // Vuetify theme integration
  const { theme } = useTheme()
  const { mobile } = useDisplay()
  
  // Client-side reactivity
  const state = reactive({
    isDark: computed(() => theme.current.value.dark),
    isMobile: mobile
  })
  
  // Return interface
  return {
    data: readonly(data),
    pending: readonly(pending),
    error: readonly(error),
    state: readonly(state)
  }
}
```

### Prisma Pattern
```typescript
// server/api/users.get.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true
    }
  })
  
  return users
})
```

## Anti-Patterns to Avoid
- ❌ Business logic in page components
- ❌ Manual route configuration without justification  
- ❌ Using `any` types without TODO comments
- ❌ Client-side rendering for public content
- ❌ Vuex for state management (use composables/Pinia)
- ❌ Skipping TypeScript strict mode
- ❌ Missing JSDoc for component props
- ❌ Raw SQL queries without Prisma (use Prisma client)
- ❌ Database operations without type safety
- ❌ Custom CSS instead of Vuetify components
- ❌ Manual responsive breakpoints (use Vuetify's useDisplay)
- ❌ Importing entire Material Design Icons set
- ❌ Not using Vuetify's theming system for colors/typography

## Constitution Compliance
All code must comply with the project constitution at `.specify/memory/constitution.md`. The constitution supersedes other practices and requires team approval for deviations.