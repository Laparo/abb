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

### Unit-Tests: Lokal vs. CI

- Standard: Unit-Tests (Vitest) laufen in der Azure Static Web Apps CI-Pipeline.
- Lokal nur ausführen, wenn es für deine nächsten Schritte nötig ist (z. B. neue Business-Logik, Debugging, schnelles Feedback).
- Empfohlene lokale Ausführung:

```bash
# Einmaliger Lauf (schnell, CI-nah)
npm test -- --run --reporter=dot

# Watch-Modus zum Entwickeln/Debuggen
npm test -- --watch
```

Hinweis: E2E-Tests (Playwright) bleiben lokal sinnvoll für End-to-End-Flows; führe sie selektiv aus, wenn deine Änderung relevante Flows betrifft.

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

## Vuetify-Komponenten: Import-Guidelines (verbindlich)

Damit Bundles klein bleiben und Tree-Shaking greift, ist der automatische Import von Vuetify-Komponenten bewusst deaktiviert. Bitte halte dich an folgende Regeln:

1. Achtung: Auto-Import ist deaktiviert

- Es gibt keine automatische globale Registrierung von Vuetify-Komponenten.
- Komponenten müssen immer explizit importiert werden, sonst schlägt der Build/TS-Check fehl.

1. Immer explizit aus 'vuetify/components' importieren

- Beispiel: `import { VCard, VBtn } from 'vuetify/components'`
- Nicht aus dem Root-Paket `vuetify` importieren, da dies Tree-Shaking verschlechtert.

1. Beispiel-Syntax

```vue
<template>
  <v-card class="pa-4">
    <v-card-title>Beispiel</v-card-title>
    <v-card-text>Nur benötigte Komponenten importieren.</v-card-text>
    <v-btn color="primary">Action</v-btn>
  </v-card>
</template>

<script setup lang="ts">
// Explizite, selektive Imports aus Vuetify
import { VCard, VCardTitle, VCardText, VBtn } from 'vuetify/components'

// Optional: Nur falls Direktiven gebraucht werden
// import { Ripple } from 'vuetify/directives'
</script>
```

1. Best Practice: Nur verwenden, was du importierst

- Importiere ausschließlich die Komponenten, die in der Datei tatsächlich genutzt werden.
- Vermeide Wildcard-/Sammel-Imports oder globale Registrierungen.
- Halte Templates sauber: Nutze Vuetify-Komponenten direkt, vermeide unnötige Wrapper.

1. Performance-Vorteil: Kleinere Bundles

- Durch selektive Imports reduziert sich das Client-Bundle erfahrungsgemäß deutlich.
- In diesem Projekt: ca. 630 kB → 200–250 kB (route-abhängig), dank besserem Tree-Shaking.
- Ergebnis: Schnellere Ladezeiten, bessere Core Web Vitals und flüssigere Interaktion.

Kurzfassung

- Auto-Import aus: Ja.
- Import-Pfad: Immer 'vuetify/components'.
- Nur benutzen, was importiert ist: Ja.
- Ziel: Minimale Bundle Size und saubere, nachvollziehbare Komponenten-Nutzung.
