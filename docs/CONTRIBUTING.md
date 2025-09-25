# Contributing

Willkommen! Dieses Projekt folgt strengen Standards (siehe Projektverfassung unter `.specify/memory/constitution.md`). Diese Kurzreferenz bündelt die wichtigsten Praxisregeln für tägliche Beiträge.

## Branch-Naming

Verwende präfixbasierte Branches. Das Auto-Labeling in den Workflows stützt sich darauf.

1. feature/kurz-beschreibung
1. fix/kurz-beschreibung
1. chore/kurz-beschreibung
1. docs/kurz-beschreibung
1. hotfix/kurz-beschreibung
1. api/kurz-beschreibung
1. ci/kurz-beschreibung
1. build/kurz-beschreibung
1. refactor/kurz-beschreibung

## Conventional Commits

Format: `type(scope): subject`

- Typen (üblich): feat, fix, docs, chore, refactor, ci, build, test
- Erlaubte Scopes (Commitlint enforced): `db`, `ui`, `tests`, `seo`, `hotfix`, `api`, `ci`, `build`, `refactor`
- Beispiele:
  - `feat(ui): add dark theme toggle`
  - `fix(db): correct migration for user.email index`
  - `docs(ci): add docs lint to CI`

Hinweise:

1. Verwende imperative, kurze Subjects (kein Punkt am Ende).
1. Mehrzeilige Bodies für Kontext/Breaking-Changes sind willkommen.

## Pre-Commit Checks (Husky + lint-staged)

Vor jedem Commit laufen automatisch schnelle Checks:

1. ESLint für `*.{ts,vue}` (autofix)
1. Prettier für gängige Dateitypen (autofix)
1. Markdownlint für `*.md`
1. Typecheck (Vue/TS)

Manuelle Ausführung (optional):

```bash
npm run lint
npm run typecheck
npm test
npm run test:e2e
npm run lint:md
```

## CI/Gates

Pushes/PRs triggern die Pipeline:

1. Docs-Job (Markdownlint) nur bei Änderungen an `**/*.md`
1. Lint → Typecheck → Unit-Tests (Vitest)
1. E2E-Tests (Playwright) bei Bedarf
1. Azure Static Web Apps Deploy nach grünen Gates
1. Prisma `migrate deploy` auf `main` (Produktion) – mit `PRISMA_SCHEMA=prisma/schema.prod.prisma`

Artefakte (Berichte) werden als GitHub Actions Artifacts angehängt.

## Datenbank & Migrationen

1. Lokal/CI: SQLite (`prisma/schema.prisma`)
1. Produktion: Azure SQL/SQL Server (`prisma/schema.prod.prisma`)
1. Migrations gehören ins Repo (`prisma/migrations/*`)
1. Produktions-URL kommt aus `DATABASE_URL` (Secret); Netzwerkzugriff sicherstellen

## Pull Request Checkliste

1. Lint/Typecheck/Unit lokal grün
1. Relevante Tests ergänzt/aktualisiert
1. A11y beachtet (Grundregeln sind via Tests abgedeckt)
1. Docs (README/CONTRIBUTING) bei Änderungen am Prozess aktualisiert
1. Für DB-Änderungen: Migration erzeugt, getestet, im PR enthalten

## Verweise

1. Projektverfassung: `.specify/memory/constitution.md`
1. CI-Workflows: `.github/workflows/*.yml`
1. Prisma: `prisma/`
1. SWA Konfig: `staticwebapp.config.json`
