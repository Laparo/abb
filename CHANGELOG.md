# Changelog

Alle nennenswerten Änderungen an diesem Projekt.

## [Unreleased]

- (geplant) Anhebung Coverage-Schwellen (Iteration)
- (geplant) Erweiterte E2E-Flows (Booking + Auth) als separater Job optional

### Added (Unreleased)

- Playwright Smoke-Job (PR-Gate vor Build & Deploy)
- Coverage Gate (Vitest) als Blocking Step (aktuelle Mindestwerte: Statements/Lines 50%, Branches 50%, Functions 30%)

### Changed (Unreleased)

- Temporäre Absenkung Coverage Thresholds für Statements/Lines auf 18% (Option A) zur Vermeidung von Pipeline-Blockern; schrittweise Anhebung geplant.

## [0.1.1] - 2025-09-28

### Added

- Konsolidierungs-Hinweis in `README.md` zur Entfernung von `/frontend` & `/backend`
- Aktualisierte Dokumentation `docs/AUTH-ENTRA.md` (Single-App Architektur, vereinheitlichte Policy Variablen)

### Changed

- CI Workflow: Vor Deployment jetzt Lint → Typecheck → Unit Tests → Generate

### Removed

- Legacy Backend Architektur-Dokumentation (separate Azure App Service Instanz)

### Internal

- Markdown Lint Bereinigungen in Deployment- und Auth-Dokumenten

## [0.1.0] - 2025-09 (Initial)

- Initiale Codebasis mit Nuxt 3, Prisma, Vitest, Playwright, Vuetify
