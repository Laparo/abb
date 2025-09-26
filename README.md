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

- Node.js 20+
- Optional: Python 3.13+ (für Specify CLI), UV Package Manager

### Setup

```bash
# Abhängigkeiten installieren
npm install

# (Optional) .env erzeugen
cp -n .env.example .env || true

# Prisma Client generieren (nach Bedarf)
npm run prisma:generate

# (Optional) Migration für SQLite (Entwicklung)
npm run prisma:migrate

# Husky Hooks einrichten (wird durch npm install via prepare-Skript automatisch ausgeführt)
npm run prepare
```

### Entwickeln & Qualität

```bash
# Dev-Server starten (http://localhost:3000)
npm run dev

# Linting (ESLint)
npm run lint

# Typecheck (vue-tsc)
npm run typecheck

# Unit-Tests (Vitest)
npm test

# E2E-Tests (Playwright)
npm run test:e2e
```

### Optional: MCP (lokal)

Siehe `docs/MCP.md` für einen lokalen, ephemeren Prisma MCP-Server und die VS Code Anbindung.

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

Hooks:

- pre-commit: lint-staged (ESLint + Prettier) und Typecheck
- commit-msg: Commitlint (Conventional Commits)

#### Commit Messages

Format: \<type>(\<scope>): \<subject>

Erlaubte Scopes: db, ui, tests, seo, hotfix, api, ci, build, refactor

Beispiele:

- feat(ui): add dark theme toggle
- fix(db): correct migration for user.email index
- chore(tests): speed up vitest workers
- docs(seo): document meta tags strategy in README
- ci(ci): enforce branch naming policy

#### Auto-Labeling

PRs werden automatisch gelabelt, basierend auf Branch-Prefixen und geänderten Pfaden:

- Nach Branch-Prefix:
  - feature/\* → feature
  - fix/\* → fix
  - chore/\* → chore
  - docs/\* → docs
  - hotfix/\* → hotfix
  - api/\* → api
  - ci/\* → ci
  - build/\* → build
  - refactor/\* → refactor

- Nach Pfaden (Änderungen im PR):
  - `prisma/schema.prisma`, `prisma/migrations/` → db
  - `components/`, `pages/`, `plugins/vuetify`, `nuxt.config.[jt]s`, `composables/`, `public/`, `assets/` → ui
  - `tests?/`, `__tests__/`, `e2e/` → tests
  - `app.vue`, `app.config.[jt]s` → seo
  - `README.md`, `docs/`, `specs/`, `.specify/` → docs (Hinweis: `specs/` fügt zusätzlich `tests` hinzu)
  - `server/api/`, `server/routes/` → api
  - `.github/workflows/`, `.github/labels.yml` → ci
  - `vite.config.[jt]s`, `vitest.config.[jt]s`, `playwright.config.[jt]s`, `tsconfig.json`, `eslint*`, `prettier*` → build
  - `composables/` oder `components/` ohne gleichzeitige Änderungen unter `tests?/` → refactor

### Testing Strategy

- Unit tests: Vitest for composables
- Component tests: Vue Test Utils
- E2E tests: Playwright for critical flows
- Performance monitoring: Core Web Vitals

### TDD Quick Start

- Tests kontinuierlich ausführen: `npm run test:watch`
- Komponenten mit Vuetify testen: `tests/utils/mountWithVuetify.ts` verwenden
- Coverage-Bericht: `npm run test:coverage` (HTML-Report unter `coverage/`)

## License

GNU General Public License v3.0 – siehe [LICENSE](LICENSE)

## Deployment: Azure Static Web Apps (SWA)

ABB wird als Nuxt 3 Universal Rendering (SSR) App auf Azure Static Web Apps betrieben. Die CI-Pipeline ist bereits vorhanden und führt Lint, Typecheck, Unit- und E2E-Tests aus, bevor deployt wird.

### Voraussetzungen (Produktion)

- Azure Subscription mit Berechtigung zum Erstellen von SWA-Ressourcen
- GitHub Repository (dieses Projekt) mit Schreibrechten für Actions

### Provisionierung (Option A – Azure Portal)

1. Im Azure Portal: Static Web App erstellen (Free/Standard)
1. Source: GitHub, Repository: dieses Repo, Branch: `main`
1. Build-Konfiguration:

- App location: `/`
- Api location: `.output/server`
- Output location: `.output/public`

1. Den vom Portal angelegten GitHub Workflow prüfen/anpassen (hier liegt bereits `azure-static-web-apps.yml` vor und nutzt dieselben Pfade)

### Provisionierung (Option B – GitHub OIDC + bestehender Workflow)

1. In Microsoft Entra ID eine Föderierte Anmeldeinformation für dieses Repo/Branch anlegen (OIDC)
1. Folgende GitHub Secrets im Repository setzen:

- `AZURE_CLIENT_ID`
- `AZURE_TENANT_ID`
- `AZURE_SUBSCRIPTION_ID`

1. Optional statt OIDC: `AZURE_STATIC_WEB_APPS_API_TOKEN` setzen (weniger flexibel)

1. Push auf `main` (Production) oder PR gegen `main` (Preview) auslösen – der Workflow `Azure Static Web Apps` baut und deployed nach erfolgreichen Quality Gates

Hinweis: Die Pfade sind ebenfalls in der Projektverfassung und im Workflow dokumentiert.

### Lokale Emulation (optional)

Die SWA CLI kann für lokale Tests genutzt werden (optional; nicht als Build-Abhängigkeit). Siehe Microsoft Learn Doku zur SWA CLI.

### Sicherheits- und Routing-Konfiguration

- Security Headers und weitere Regeln werden über `staticwebapp.config.json` verwaltet
- Nuxt `error.vue` deckt 404/Fehlerseiten ab (A11y: H1, Main-Landmark)

## Produktion: Azure SQL + Prisma

Diese App nutzt lokal/CI SQLite (`prisma/schema.prisma`) und in Produktion Azure SQL/SQL Server (`prisma/schema.prod.prisma`). Auf dem Main-Branch führt das Deploy‑Workflow automatisch Datenbank‑Migrationen aus.

### Voraussetzungen

- Azure SQL Server + Datenbank sind provisioniert.
- Produktions‑Schema liegt unter `prisma/schema.prod.prisma` (provider: `sqlserver`).
- GitHub Actions Runner hat Netzwerkzugriff auf die DB (Firewall/VNet, siehe unten).

### Secret konfigurieren

- GitHub → Repository → Settings → Secrets and variables → Actions → New repository secret
- Name: `DATABASE_URL`
- Wert: Verbindungstring (Beispiele unten)

Das Deploy‑Workflow `.github/workflows/azure-static-web-apps.yml` nutzt:

- `PRISMA_SCHEMA=prisma/schema.prod.prisma`
- `DATABASE_URL` (Secret)
- Führt auf `main` automatisch `prisma migrate deploy` aus.

### Beispiel‑Verbindungsstrings (Azure SQL)

- SQL‑Authentifizierung (einfacher Einstieg):

```text
sqlserver://myserver.database.windows.net:1433;database=mydb;user=myuser;password=My$tr0ngP4ss!;encrypt=true;TrustServerCertificate=false
```

- Verwaltete Identität / Entra ID (fortgeschritten, Treiber-/Version‑abhängig):

```text
sqlserver://myserver.database.windows.net:1433;database=mydb;encrypt=true;Authentication=ActiveDirectoryMsi
```

Hinweise:

- Für MSI/Entra ID muss die Identität auf dem DB‑Server berechtigt sein (CREATE USER FROM EXTERNAL PROVIDER + Rollen).
- Unterstützung ist vom verwendeten ODBC‑Treiber/Prisma‑Version abhängig; bitte vor Produktion testen.

### Netzwerk‑Checkliste

- Azure SQL Firewall: Zugriff erlauben (z. B. „Allow Azure services…“ oder gezielte IP‑Regeln).
- GitHub‑gehostete Runner haben dynamische IPs. Sichere Optionen:
  - Self‑hosted Runner in Azure (statische Absender‑IP).
  - Migrationen aus einer Azure‑Ressource mit Managed Identity ausführen (Container/Function).
- Für App‑Zugriff (Azure Functions) ggf. VNet‑Integration + Private Endpoint erwägen.

### Lokale Verifikation (optional)

```bash
PRISMA_SCHEMA=prisma/schema.prod.prisma \
DATABASE_URL="<azure-sql-connection-string>" \
npx prisma migrate deploy
```

### Verhalten im CI/CD

- Quality Gates (Lint/Types/Tests/E2E) laufen vor Deploy.
- Migrationen laufen nur auf `main`. Feature‑Branches verändern keine Produktions‑DB.
- Häufige Fehlerbilder:
  - Login/Timeout → Firewall/Netzwerk oder Credentials prüfen.
  - „Drift/older schema“ → Migrationen erneut ausführen bzw. sicherstellen, dass alle `prisma/migrations/*` im Repo sind.

### Secrets & Key Vault (optional)

- Produktions‑App‑Settings können Secrets via Azure Key Vault Referenzen beziehen.
- Für den GitHub‑Migrationsschritt wird weiterhin ein nutzbarer `DATABASE_URL` benötigt — alternativ Workflow anpassen, um das Secret via OIDC/`az` aus Key Vault zur Laufzeit zu holen.
