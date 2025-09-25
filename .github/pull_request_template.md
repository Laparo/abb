# PR-Template

<!--
Bitte fülle diesen PR-Template aus. Er hilft uns, die Governance (Konstitution v1.4.0) einzuhalten
und die neuen Git-Branching-Standards durchzusetzen.
-->

## Metadaten

- Branch-Name: `<!-- z. B. feature/login-form -->`
- PR-Typ: <!-- wähle: feature | fix | chore | docs | hotfix | refactor | build | ci | api -->
- Breaking Change: <!-- ja/nein (kurz begründen, falls ja) -->

## Bezüge

- Verknüpftes Issue: <!-- #123 -->
- Spezifikation/Plan: <!-- Link zu specs/[id-name]/ oder .specify/* (Specify) -->

## Zusammenfassung

<!-- Kurz: Was wird geändert und warum? Fokus auf Nutzerwert und Ziel aus der Spezifikation. -->

## Umsetzung / Änderungen

<!-- Wichtige technische Punkte, Struktur (Nuxt 3), neue/angepasste Komponenten, Composables, API-Routen, Migrations. -->

## Tests & Nachweise

- Unit-Tests (Vitest): <!-- hinzugefügt/aktualisiert? kurz beschreiben -->
- Component-Tests (Vue Test Utils): <!-- ja/nein, was -->
- E2E (Playwright): <!-- ja/nein, welche Flows -->
- Manuelle Nachweise (Screenshots/Video/GIF):
  - <!-- Bild/Video-Links oder kurze Beschreibung -->

## Datenbank & Deploy

- Prisma-Migrationen enthalten: <!-- ja/nein -->
- Migrationspfad(e): <!-- prisma/migrations/... -->
- Seed/Backfill erforderlich: <!-- ja/nein, kurz erklären -->
- Rollback-Strategie (falls relevant): <!-- kurz -->

---

## Checkliste: Git Branching Standards (REQUIRED)

- [ ] Branch-Name entspricht dem Schema: `feature|fix|chore|docs|hotfix|api|ci|build|refactor/<kurz-und-klar>`
- [ ] PR basiert auf aktuellem `main` (rebase bevorzugt), keine Merge-Commits
- [ ] PR ist fokussiert (bezieht sich nur auf ein Thema/Feature/Fix)
- [ ] Verknüpftes Issue und Spezifikation/Plan sind referenziert

## Auto-Labeling (Info)

Dieser PR wird automatisch gelabelt anhand von:

- Branch-Prefix (z. B. `feature/*`, `fix/*`, `docs/*`, `api/*`, `ci/*`, `build/*`, `refactor/*`)
- Geänderten Pfaden (z. B. `prisma/*` → `db`, `components/|pages/|plugins/vuetify` → `ui`, `tests?/|__tests__/|e2e/` → `tests`, `README.md|docs/|specs/|.specify/` → `docs` + `tests` bei `specs/`, `server/api/` → `api`, `.github/workflows/` → `ci`, Build-/Config-Dateien → `build`)

Bitte Labels ergänzen/anpassen, falls die Automatik etwas übersieht.

## Checkliste: Konstitution-Compliance (Nuxt 3 + TS + Vuetify + Prisma)

- Komponenten & Pages
  - [ ] Keine Business-Logik in Pages; Logik in Composables ausgelagert
  - [ ] Komponenten haben klare, getypte Props mit JSDoc
  - [ ] File-based Routing von Nuxt strikt eingehalten (inkl. `[param].vue`)
  - [ ] SSR standardmäßig aktiv; SPA nur für authentifizierte Admin-Bereiche

- TypeScript & Codequalität
  - [ ] TypeScript strict, keine `any` (Ausnahmen nur mit TODO und Begründung)
  - [ ] ESLint + Prettier sauber; Typecheck grün

- Composables & Datenzugriff
  - [ ] Server-seitiges Laden via `useFetch`/`$fetch` nach Nuxt-Standards
  - [ ] Vuetify-Composables (`useTheme`, `useDisplay`) korrekt genutzt, kein manuelles Breakpoint-Hardcoding

- Prisma ORM
  - [ ] Alle DB-Operationen laufen über Prisma-Client; kein Raw-SQL ohne triftigen Grund
  - [ ] Schema-Änderungen durch Migrationen versioniert; Typen sind konsistent

- Vuetify 3 (MD3)
  - [ ] UI setzt auf Vuetify-Komponenten; minimale Custom-CSS
  - [ ] Theming über zentrale Vuetify-Konfiguration; Tree-Shaking beachtet

- Tests & Qualitätssicherung
  - [ ] Unit- und Component-Tests für Kernlogik vorhanden/aktualisiert (Ziel: >80% für Business-Logik)
  - [ ] Kritische Flows via Playwright abgedeckt (falls Nutzerfluss betroffen)

- Performance & SEO
  - [ ] Meta-Tags via `useHead()` gepflegt
  - [ ] Assets/Images optimiert (Nuxt Image, Lazy-Loading)

- Sicherheit
  - [ ] Keine Secrets im Code, in Configs oder in MCP/Prompts

## MCP (optional, nur lokal)

- [ ] Falls MCP genutzt: nur lokal/ephemer, keine produktive Abhängigkeit
- [ ] Keine Secrets in MCP-Prompts; Outputs bestehen TypeScript-Checks

## Release-Notes (optional)

<!-- Kurzform für Changelog/Release: 1–3 Bullet-Points -->

## Sonstiges

<!-- Offene Punkte, Risiken, Follow-ups, Migrationshinweise für Betrieb/Support. -->

---

<!-- Hinweise
- PR-Titel kann sich an Conventional Commits orientieren (empfohlen):
  feat: … | fix: … | chore: … | docs: … | refactor: … | test: … | perf: … | build: … | ci: … | revert: …
- Bitte Squash & Merge bevorzugen; PR-Beschreibung wird zur Squash-Commit-Nachricht.
-->
