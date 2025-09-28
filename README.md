# ABB - Nuxt.js Application

[![Azure Static Web Apps (Staging)](https://github.com/Laparo/abb/actions/workflows/azure-static-web-apps.yml/badge.svg)](https://github.com/Laparo/abb/actions/workflows/azure-static-web-apps.yml)

A modern web application built with Nuxt.js 3, following spec-driven development principles using GitHub Spec Kit (How to handle Qodo findings:

1. Öffne den PR und prüfe den Qodo-Kommentar (Summary) und ggf. Inline-Kommentare.
1. Behebe Findings nach Priorität (security → correctness → performance → maintainability → style).
1. Markiere erledigte Threads als "resolved".
1. Falls keine Findings: merge-policy beachten (z. B. mindestens 1 manueller Review) oder manuellen Approve geben.

## Automatisches Anwenden von Suggestions

Dieses Projekt verfügt über ein Script zum automatischen Anwenden von GitHub suggestion blocks:

```bash
# Alle Suggestions eines PRs anwenden
npm run apply:qodo -- --pr <number>

# Dry-run (Vorschau ohne Änderungen)
npm run apply:qodo -- --pr <number> --dry

# Hilfe anzeigen
npm run apply:qodo -- --help
```

Das Script:

- Wendet `~~~suggestion` Blöcke aus PR-Reviews automatisch an
- Führt ESLint --fix und Prettier auf betroffenen Dateien aus
- Staged alle Änderungen für den nächsten Commit
- Unterstützt sowohl Inline-Dateireferenzen als auch "Affected:" Hinweisey).

## Project Overview

> Architektur-Update (2025-09): Ehemalige getrennte `/frontend` und `/backend` Verzeichnisse wurden konsolidiert. Alle API-Routen (Nitro) und das Frontend leben nun in einer einzigen Nuxt 3 Codebasis. Historische Referenzen zu `abb-backend.azurewebsites.net` sind obsolet (siehe `docs/AUTH-ENTRA.md`). Falls künftig wieder eine externe API benötigt wird, setze `NUXT_PUBLIC_API_BASE` und stelle CORS separat sicher.

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
# Standard: laufen in Azure SWA CI. Lokal nur bei Bedarf ausführen.
npm test -- --run --reporter=dot

# E2E-Tests (Playwright)
# Lokal sinnvoll für End-to-End-Flows; selektiv ausführen
npm run test:e2e

# Optional: letzten HTML-Report öffnen
npx playwright show-report
```

## Production Deployment

ABB uses a two-branch strategy for safe production deployments:

### Branch Strategy

- `main` → **Staging Environment** (Azure Static Web Apps Preview)
- `production` → **Production Environment** (Azure Static Web Apps Production)

### Release Workflow

```bash
# 1. Normal development: feature → main
git checkout -b feature/my-feature
# ... develop and test
# Create PR: feature/my-feature → main

# 2. Production release: main → production
git checkout main
git pull origin main
# Create PR: main → production (requires 2+ reviews)
```

### Production Requirements

- ✅ **2+ reviewer approvals** for production PRs
- ✅ **All quality gates pass**: lint, typecheck, unit tests, e2e tests
- ✅ **Database migration review** for schema changes
- ✅ **Zero downtime deployment** with health checks

### Environment Configuration

Create these GitHub repository secrets for production deployment:

```yaml
Secrets (Production Environment):
  PRODUCTION_DATABASE_URL: 'sqlserver://...'
  AZURE_STATIC_WEB_APPS_API_TOKEN_PROD: 'deployment-token'

Variables:
  AZURE_DEPLOYMENT_ENABLED: 'true' # Enable Azure deployments
```

### Emergency Hotfixes

For critical production issues:

```bash
# Create hotfix branch
git checkout production
git checkout -b hotfix/critical-fix

# Create PR: hotfix/critical-fix → production
# After merge, backport to main:
# Create PR: production → main
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

### Vuetify-Import (wichtig)

- Auto-Import von Vuetify-Komponenten ist deaktiviert.
- Importiere benötigte Komponenten immer explizit aus `vuetify/components`, z. B.:

```ts
import { VCard, VBtn } from 'vuetify/components'
```

Vorteil: deutlich kleinere Bundles durch Tree-Shaking (in diesem Projekt ca. 630 kB → 200–250 kB, abhängig von der Route). Details und Beispiel siehe `docs/CONTRIBUTING.md`.

### Remote Reviews mit Qodo (optional)

Dieses Repository kann PR-Reviews automatisiert durch einen Remote-Agenten (Qodo) anstoßen.

Einrichtung:

1. (Empfohlen) Installiere die Qodo GitHub App für dieses Repository/Organisation.
1. Optionalen Webhook konfigurieren:

- Repository Secret `QODO_WEBHOOK_URL` setzen (Settings → Secrets and variables → Actions).
- Qodo-Endpunkt hinterlegen, der PR-Events entgegennimmt.

1. Review-Trigger:

- Automatisch bei PR-Events (opened, reopened, synchronize, ready_for_review).
- Manuell durch Label `qodo:review` setzen (unterstützt in `qodo-review` Workflow).

Konfiguration:

- `.github/qodo.yml` steuert Pfade, Event-Trigger und Kommentarverhalten.
- `.github/workflows/qodo-review.yml` veröffentlicht optional einen Hinweis-Kommentar und kann (wenn Secret gesetzt) den Webhook auslösen.

Sicherheit & Hinweise:

- Der Workflow nutzt `pull_request` (Code aus Branch) und `pull_request_target` (für Label-Event). Sensible Aktionen passieren nur mit klaren Bedingungen und optionalem Secret.
- Wenn kein Secret `QODO_WEBHOOK_URL` gesetzt ist, wird der Webhook-Schritt übersprungen; die reine Hinweis-Kommentierung bleibt aktiv.

How to handle Qodo findings:

1. Öffne den PR und prüfe den Qodo-Kommentar (Summary) und ggf. Inline-Kommentare.
1. Behebe Findings nach Priorität (security → correctness → performance → maintainability → style).
1. Markiere erledigte Threads als “resolved”.
1. Falls keine Findings: merge-policy beachten (z. B. mindestens 1 manueller Review) oder manuellen Approve geben.

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

### CI & Tests Übersicht

Die GitHub Actions Pipeline (Azure Static Web Apps Workflow) führt gestaffelte Quality Gates aus:

1. (PR) Smoke-Test (Playwright) – schneller Render-/Routing-Check gegen lokal gebauten Nitro-Server
1. (PR & Push) Lint + Typecheck + Unit Tests
1. Coverage Gate (Vitest) – Abbruch wenn globale Schwellenwerte unterschritten
1. Static Generation & Deployment (SWA Upload via OIDC)

Artefakte:

- `playwright-smoke-report` (nur bei PRs / Fehleranalyse)
- `coverage/` HTML-Report (lokal via `npm run test:coverage`)

Coverage Schwellen (anfänglich konservativ, später anhebbar):

| Metric     | Minimum |
|------------|---------|
| Statements | 50%     |
| Lines      | 50%     |
| Branches   | 50%     |
| Functions  | 30%     |

Hinweis: Thresholds für Lines/Statements wurden vorübergehend abgesenkt (Option A) um CI nicht zu blockieren; Erhöhung erfolgt iterativ (siehe CHANGELOG ‘Unreleased’).

Ein fehlgeschlagener Coverage-Schritt blockiert Deployment.

### TDD Quick Start

- Tests kontinuierlich ausführen: `npm run test:watch`
- Komponenten mit Vuetify testen: `tests/utils/mountWithVuetify.ts` verwenden
- Coverage-Bericht: `npm run test:coverage` (HTML-Report unter `coverage/`)

### Playwright E2E – Setup & CI-Details

So laufen die E2E-Tests lokal und im CI stabil:

- Der Playwright Webserver startet einen produktionsähnlichen Nitro-Server über `npm run build && npm run start:prod`.
- Die Datenbank wird explizit per Environment-Variable gesetzt: `DATABASE_URL = file:[…/dev-e2e.db]` (absolute Pfadangabe). Dadurch ist keine `.env.e2e` notwendig und CI-Flakes werden vermieden.
- `e2e/global-setup.ts` sorgt vor dem Testlauf für Prisma Client, Migrationen und Seeding. Lokal genügt daher `npm run test:e2e` ohne weitere Vorbereitung.
- Erste Ausführung lokal: ggf. Playwright-Browser installieren: `npx playwright install --with-deps`.
- Reports: Playwright generiert einen HTML-Report unter `playwright-report/`; im CI wird er als Artefakt hochgeladen.

Troubleshooting:

- Timeout beim Start (120s): Build langsam oder Port 3000 belegt. Lösung: lokale Prozesse beenden, erneut ausführen.
- Prisma Fehler/fehlende Tabellen: `global-setup` führt Migration/Seed aus; falls abgebrochen, erneut starten.
- Fehlende Browser im CI: Der Workflow führt `npx playwright install --with-deps` aus (siehe Web CI).

### Lokaler Produktionslauf

Für einen lokalen Start im produktionsähnlichen Modus (Nitro Node-Server) gibt es zwei Varianten:

```bash
# 1) Lokal mit .env laden (empfohlen für Entwicklung)
npm run build
npm run start:local:prod

# 2) Reines Produktions-Startskript (ENV muss extern gesetzt sein)
npm run build
npm run start:prod
```

Hinweise:

- `start:local:prod` lädt Variablen aus `.env` (z. B. `DATABASE_URL` für Prisma/DB).
- Migrationen laufen nicht automatisch. Stelle sicher, dass die Datenbank migriert/initialisiert ist:
  - Lokal/CI (SQLite): `npm run prisma:migrate` und optional `npm run prisma:seed`.
  - Produktion (Azure SQL): Der GitHub Workflow führt auf `main` `prisma migrate deploy` mit `PRISMA_SCHEMA=prisma/schema.prod.prisma` aus.
- Troubleshooting:
  - Prisma Fehler `P1001` → Datenbank nicht erreichbar/Connection String prüfen.
  - Fehlende Tabellen → Migrationen ausführen (`prisma migrate deploy/dev`).

## License

GNU General Public License v3.0 – siehe [LICENSE](LICENSE)

## Deployment: Azure Static Web Apps (SWA)

ABB wird als Nuxt 3 Universal Rendering (SSR) App auf Azure Static Web Apps betrieben. Die CI-Pipeline ist bereits vorhanden und führt Lint, Typecheck, Unit- und E2E-Tests aus, bevor deployt wird.

### CI-Übersicht (Web CI)

- Trigger: PRs und Pushes auf `main`.
- Jobs:
  - Docs/Markdownlint (nur bei geänderten `.md`-Dateien)
  - Frontend: Lint → Typecheck → E2E (Playwright)
  - **Unit-Tests**: Laufen in Azure Static Web Apps (SWA) CI; lokal nur bei Bedarf
- Artefakte: `playwright-report` (E2E), `coverage` (Vitest).
- Concurrency: laufende Builds desselben PR/SHA werden abgebrochen, um Ressourcen zu sparen.

### Azure Unit Tests Integration

Die Unit-Tests werden direkt in Azure's Free-Tier-Umgebung ausgeführt:

- **Kostenoptimierung**: Spart GitHub Actions Minuten (~100-300 Minuten/Monat)
- **Native Integration**: Tests sind Teil der Azure Build-Pipeline
- **Fehlerbehandlung**: Deployment schlägt bei Test-Fehlern automatisch fehl
- **Performance**: Optimierte Node.js-Umgebung für schnellere Test-Ausführung

Konfiguration in `staticwebapp.config.json`:

```json
{
  "buildConfig": {
    "buildCommand": "npm run test -- --reporter=dot --run && npm run build"
  }
}
```

Siehe `docs/AZURE-UNIT-TESTS.md` für detaillierte Dokumentation.

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
