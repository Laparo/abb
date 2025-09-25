<!--
Sync Impact Report:
Version change: 1.4.0 → 1.5.0
Modified principles: none
Added sections: Azure Static Web Apps (SWA) Deployment Standards
Updated sections: none
Removed sections: none
Templates requiring updates:
✅ aligned: plan-template.md add "Deployment Target: Azure SWA" selector (informational)
✅ aligned: tasks-template.md unaffected
✅ aligned: copilot-instructions.md already references SSR/SPA and CI gates
Follow-up TODOs: Provide a repo issue template hint for SWA environment mapping (optional)
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

<!--
Sync Impact Report:
Version change: 1.5.0 → 1.6.0
Modified principles: Database Standards (environment matrix)
Added sections: Production Database: Azure SQL (REQUIRED)
Updated sections: Azure Static Web Apps (SWA) Deployment Standards (cross-reference to DB networking)
Removed sections: none
Templates requiring updates:
✅ aligned: plan-template.md add "Database Target: Azure SQL" selector (informational)
✅ aligned: tasks-template.md add checklist item "Prisma migrate deploy for Azure SQL" (informational)
✅ aligned: copilot-instructions.md already references Prisma ORM integration
Follow-up TODOs: Provide a README snippet for Azure SQL `DATABASE_URL` format and Key Vault integration (optional)
-->

- ESLint with Nuxt.js recommended rules
- Prettier for consistent formatting
- Commitlint for conventional commits
- Pre-commit hooks for linting and type checking

#### Git Hooks

Local git hooks MUST enforce quality gates before code enters the repository:

- pre-commit: runs lint-staged (ESLint + Prettier) and a TypeScript typecheck
- commit-msg: validates Conventional Commits via Commitlint

CI MUST validate commit messages and PR titles as an additional guardrail.

### Environment Matrix (REQUIRED)

- Development (local): SQLite for speed and simplicity OR a local SQL Server/Azure SQL Edge instance. Keep schema portable (avoid vendor-specific features unless guarded).
- CI: SQLite via `prisma db push` for fast checks; avoid long-running migration steps in CI except on release branches.
- Staging/Production: Azure SQL Database (SQL Server) only. No SQLite in any production-like environment.

Migrations MUST be generated and applied with production in mind. Prefer generating migrations against SQL Server semantics and using `prisma migrate deploy` in delivery pipelines.

## Production Database: Azure SQL (REQUIRED)

ABB verwendet in Staging und Produktion Azure SQL Database (SQL Server) in Kombination mit Prisma ORM. Dieses Kapitel ergänzt und konkretisiert die Datenbank-Standards für produktive Umgebungen.

### ORM und Treiber

- ORM: Prisma (NON-NEGOTIABLE)
- Provider: `sqlserver`
- Client: `@prisma/client` (typensicher)

### Verbindungs- und Sicherheitsrichtlinien

- `DATABASE_URL` MUSS als Secret pro Umgebung hinterlegt werden (GitHub Environments, Azure App Settings oder Key Vault). Keine Secrets im Repo.
- Azure SQL Verbindungszeichenfolge MUSS Verschlüsselung erzwingen: `encrypt=true` und `trustServerCertificate=false`.
- Authentifizierung: Bevorzugt Microsoft Entra (Azure AD) oder Managed Identity; Falls nicht möglich, SQL-Auth nur mit strikten Rotations- und Least-Privilege-Regeln.
- Netzwerk: Azure Static Web Apps (Functions für SSR) MUSS Zugriff auf Azure SQL bekommen (Firewall-Ausnahmen oder VNet-Integration beim Plan „Standard“). Öffentliche Zugriffe minimieren, IP-Ranges explizit setzen.

### Schema- und Migrationsstrategie

- Das Prisma-Schema MUSS mit SQL Server kompatibel sein. Vendor-spezifische Features nur mit Architektur-Freigabe.
- Migrations:
  - Lokale Entwicklung: `prisma db push` gegen SQLite oder lokale SQL Server-Instanz
  - Produktion: `prisma migrate deploy` gegen Azure SQL Database im Deploy-Job (nach allen Qualitätstoren)
- Empfohlen: Nutzung einer dedizierten Schema-Datei für Produktion (z. B. `prisma/schema.prod.prisma` mit `provider = "sqlserver"`) und Auswahl via `PRISMA_SCHEMA` in CI/CD, falls lokal SQLite bevorzugt wird.

### Betriebs- und Performanceleitlinien

- Connection Pooling: SSR/Functions-Umgebung MUSS so konfiguriert sein, dass Verbindungen effizient wiederverwendet werden. Timeouts und Retries konservativ konfigurieren; Leaks vermeiden (Client als Singleton pro Prozess).
- Backups & DR: Azure SQL PITR aktivieren; Retention gemäß Compliance. Regelmäßige Restore-Tests.
- Observability: Langsame Queries loggen, Query-Pläne periodisch prüfen; Metriken und Alerts in Azure Monitor.

### CI/CD und Freigaben

- Deploy-Pipeline führt NUR auf Azure SQL `prisma migrate deploy` aus, niemals `migrate dev`.
- Pipeline bricht ab, wenn Migrationsfehler auftreten; kein „force push“ von Schemaänderungen in Produktion.
- Änderungen an Tabellen mit Downtime-Risiko benötigen einen Migrationsplan (Expand/Contract, Backfill, Entkopplung).
- pre-commit: runs lint-staged (ESLint + Prettier) and a TypeScript typecheck
- commit-msg: validates Conventional Commits via Commitlint

CI MUST validate commit messages and PR titles as an additional guardrail.

## Git Branching Standards (REQUIRED)

All work MUST occur on topic branches. Direct commits to `main` are prohibited.

### Branching Model

- Default branch: `main` (protected; merge via PR only)
- Branch naming:
  - `feature/<issueId>-<kebab-slug>` (e.g., `feature/123-user-profile`)
  - `fix/<issueId>-<kebab-slug>` (bugfixes)
  - `chore/<kebab-slug>` (build, tooling, housekeeping)
  - `docs/<kebab-slug>` (documentation-only)
  - `hotfix/<issueId>-<kebab-slug>` (urgent production fixes)
  - `api/<kebab-slug>` (server APIs, contracts)
  - `ci/<kebab-slug>` (workflows & pipelines)
  - `build/<kebab-slug>` (build tooling & configs)
  - `refactor/<kebab-slug>` (internal refactors)
- Start branches from up-to-date `main`.
- Keep branches focused: one feature/fix per branch; prefer small, reviewable PRs.

### Merge & History

- Prefer rebase to keep a linear history; avoid unnecessary merge commits.
- PRs MUST pass all checks (lint, typecheck, tests) and require at least one review approval.
- Link PRs to the corresponding spec under `specs/[###-feature]/` and include the issue ID.
- After merge, delete the source branch.

### Release & Hotfixes

- Hotfix branches are created from `main` and merged back into `main` via PR.
- Follow semantic versioning for release tags; automate changelogs where feasible.

### Consistency with Planning

- The “Branch” field in feature plans MUST reflect the actual branch name (e.g., `[###-feature-name]` → `feature/<id>-<slug>`).
- Commit messages MUST follow Conventional Commits (enforced by Commitlint).

#### Conventional Commits – Allowed Scopes

To keep history consistent and searchable, the following scopes are allowed and enforced:

- db — Prisma schema/migrations and database-related changes
- ui — UI/Vuetify changes
- tests — unit/e2e tests and test infra
- seo — meta tags, head management, sitemaps
- hotfix — urgent production fix
- api — Nuxt server endpoints, composables API shape
- ci — CI workflows, build pipelines, PR/branch policy
- build — build tooling, bundler, config
- refactor — internal refactors without behavior change
  **Version**: 1.6.0 | **Ratified**: 2025-09-23 | **Last Amended**: 2025-09-26

## MCP Tooling Standards (Prisma MCP)

Local AI tooling MAY use the Prisma MCP server to assist with schema reasoning and safe query generation. If used, the following rules apply:

- Local-only: The MCP server MUST run locally only and MUST NOT be exposed publicly or used in production environments.
- Endpoint: Prefer SSE endpoint <http://127.0.0.1:8765/sse> (default).
- Start command: Recommended to start via `npx -y prisma mcp` during development.
- Editor configuration: When using VS Code, configure the MCP server in the user `mcp.json` (platform-specific path) with the local SSE endpoint.
- Secrets and safety: Never include secrets in prompts. Generated queries MUST still pass code review and type checks.
- Opt-in: This tooling is optional and MUST NOT introduce a hard dependency for builds or CI.

## Governance

Constitution supersedes all other development practices. All pull requests MUST verify compliance with these principles. Amendments require team consensus, version bump, and migration plan for existing code.

Complex architecture decisions that deviate from these principles MUST be documented with explicit justification and approved by senior team members.

## Azure Static Web Apps (SWA) Deployment Standards (REQUIRED)

ABB wird mit Nuxt 3 Universal Rendering (SSR) auf Azure Static Web Apps (SWA) veröffentlicht. Diese Regeln sind verbindlich und Bestandteil der CI-Gates.

### Hosting-Ziel und Rendering

- Zielplattform: Azure Static Web Apps Free/Standard
- Rendering: Nuxt 3 Universal Rendering (SSR) via Nitro; keine reinen SPA-Deployments für öffentliche Inhalte
- Region: möglichst nah an der Nutzerbasis (SWA-Region für Functions/Previews)

### Build- und Output-Kontrakt (Nuxt 3 → SWA)

Beim Build erzeugt Nuxt/Nitro die SWA-kompatiblen Artefakte. Die Pfade sind fest definiert und dürfen nicht verändert werden:

- app_location: "/" (Repository-Root)
- api_location: ".output/server" (Nitro Azure Functions App für SSR/API)
- output_location: ".output/public" (statische Assets)

Quelle: Microsoft Learn – Deploy Nuxt 3 on Azure Static Web Apps (Universal Rendering).

### CI/CD-Integrationsregeln

- Pipeline: GitHub Actions mit dem offiziellen SWA Deploy Workflow (Portal-provisioniert oder manuell konfiguriert)
- Gating: Deploy-Job darf nur starten, wenn Lint, Typecheck, Unit und E2E (inkl. A11y) grün sind
- Branch → Umgebung:
  - main → production
  - Pull Requests → Preview-Umgebung (staging)
- Secrets: Keine Secrets im Repo. Bei Portal-Onboarding wird das Token/Setup automatisch hinterlegt. Alternativ GitHub OIDC bzw. `AZURE_STATIC_WEB_APPS_API_TOKEN` als Secret verwenden

### SWA Konfiguration und Sicherheit

- Routen/Headers/Access: falls erforderlich über `staticwebapp.config.json` steuern (z. B. Security Headers, Role-basierte Zugriffe, Redirects). SSR-Rewrites werden von Nitro/SWA-Adapter abgedeckt
- Minimal-Empfehlung für Security Headers (als Richtlinie, konkret im `staticwebapp.config.json` zu pflegen):
  - Strict-Transport-Security
  - X-Content-Type-Options
  - Referrer-Policy
  - Permissions-Policy (sparsam und gezielt)
- 404/Fehlerseiten: durch Nuxt `error.vue` abgedeckt, A11y-konform (H1, Main-Landmarke)
- Datenbank-Netz: Staging/Prod-Funktionen müssen Azure SQL erreichen (Firewall/VNet). Siehe „Production Database: Azure SQL“

### Lokale Entwicklung und Diagnose (optional)

- Lokale Emulation via SWA CLI zulässig (optional), kein Produktions-Dependency
- Observability/Logs: SWA Diagnostik-Tools nutzen; CI lädt Playwright-/Coverage-Artefakte hoch

### Änderungsmanagement

- Abweichungen (z. B. andere Output-Pfade oder alternatives Hosting) erfordern Architekturentscheidung und Teamfreigabe
- Rollback: über Redeploy eines vorherigen Commits (SWA behält vergangene Workflow-Runs), Previews dienen als Vorab-Qualitätssicherung

### Referenzen

- Microsoft Learn: Deploy Nuxt 3 sites with universal rendering on Azure Static Web Apps
- Nitro Provider: Azure Static Web Apps (für SSR/Functions-Adapter)
