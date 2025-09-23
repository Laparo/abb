# ABB - Nuxt.js Application

A modern web application built with Nuxt.js 3, following spec-driven development principles using GitHub Spec Kit (Specify).

## Project Overview

This project follows a structured development approach with strict architectural principles:
- **Component-First Development**: Reusable Vue components with clear interfaces
- **TypeScript-First**: Strict type safety throughout the application
- **SSR/SPA Hybrid**: Optimized rendering strategy for performance and SEO
- **File-Based Routing**: Following Nuxt.js conventions
- **Composables Pattern**: Business logic sharing via Vue 3 Composition API

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.13+ (for Specify CLI)
- UV package manager

### Setup
```bash
# Install Specify CLI (already configured)
uv run specify --help

# Initialize Nuxt.js project (when ready)
npx nuxi@latest init .
npm install

# Start development server
npm run dev
```

### Spec-Driven Development

This project uses GitHub Spec Kit for structured development. Available commands:

```bash
# Establish project principles (already done)
/constitution

# Create feature specifications  
/specify

# Clarify and de-risk specifications
/clarify

# Create implementation plans
/plan

# Generate actionable tasks
/tasks

# Validate alignment & consistency
/analyze

# Execute implementation
/implement
```

## Architecture

The project follows Nuxt.js best practices with additional constraints:
- Server-Side Rendering for public content
- Component-based architecture with clear separation of concerns  
- TypeScript throughout with strict mode enabled
- Composables for business logic and state management
- Performance-first approach with Core Web Vitals compliance

## Development

### Code Quality
- ESLint with Nuxt.js recommended rules
- Prettier for formatting
- Commitlint for conventional commits
- Pre-commit hooks for quality gates

### Testing Strategy
- Unit tests: Vitest for composables
- Component tests: Vue Test Utils
- E2E tests: Playwright for critical flows
- Performance monitoring: Core Web Vitals

## License

GNU General Public License v3.0 - see [LICENSE](LICENSE) file.
