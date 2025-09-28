# Tasks: Coach Courses Feature

Scope: Umsetzung gemäß `specs/001-clarify-coach-courses/spec.md` und Plan `plan.md`.

Date: 2025-09-26

Status: Draft

## Milestone 1: Public Kurse + Buchung (ohne Payment)

- [ ] Pages anlegen: `pages/index.vue`, `pages/courses/index.vue`, `pages/courses/[id].vue`
- [ ] Komponenten: `CourseCard.vue`, `CourseFilterBar.vue`, `BookingSummary.vue`, `CancellationPolicy.vue`
- [ ] Server API: `server/api/courses.get.ts`, `server/api/courses/[id].get.ts`, `server/api/bookings.post.ts`
- [ ] Prisma Schema: User, Course, Booking, Material; Migration erstellen
- [ ] Composables: `useCourses.ts`, `useBookings.ts`
- [ ] E-Mail-Adapter Interface mit Dummy-Implementation; Template bookingConfirmation
- [ ] SSR Caching optional vorbereiten (Flag), aber standardmäßig aus
- [ ] Akzeptanz: Kursliste rendert SSR, Detail abrufbar, Buchung mit Kapazitätsprüfung, Bestätigungs-E-Mail versendet

## Milestone 2: Geschützter Bereich + Materialien (Streaming only)

### Phase 3.1: Setup
- [x] T020 [P] Configure authentication dependencies in `package.json`
- [x] T021 [P] Update User schema with externalId and status fields in `prisma/schema.prisma`
- [x] T022 Run Prisma migration for User schema changes
- [x] T023 [P] Configure authentication module in `nuxt.config.ts`

### Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3

Note: These tests MUST be written and MUST FAIL before ANY implementation.

- [x] T024 [P] Auth integration test in `tests/integration/auth.spec.ts`
- [x] T025 [P] Materials access control test in `tests/integration/materials.spec.ts`
- [x] T026 [P] Protected route middleware test in `tests/integration/middleware.spec.ts`

### Phase 3.3: Core Implementation (ONLY after tests are failing)

- [x] T027 [P] Create `composables/useAuth.ts` (OIDC PKCE, Entra External ID)
- [x] T028 [P] Create `middleware/auth.ts` for `/account/**` routes
- [x] T029 Implement `server/api/materials/[courseId].get.ts` (signierte kurzlebige URL oder Proxy)
- [x] T030 [P] Create `composables/useMaterials.ts` (TEXT direkt, VIDEO über Streaming-Endpoint)
- [x] T031 [P] Create `pages/account/index.vue` (user dashboard)
- [x] T032 [P] Create `pages/account/courses/[id].vue` (course details with materials)
- [x] T033 [P] Create `components/course/CourseMaterialList.vue`

### Phase 3.4: Integration

- [ ] T034 Apply route middleware to protected pages in `pages/account/**`
- [ ] T035 Wire materials access control to user bookings
- [ ] T036 [P] Test materials access (only for gebuchte Nutzer, auch nach Kursende, bis Account-Löschung)
- [ ] T037 [P] Configure streaming-only video access (keine Download-Links)

### Phase 3.5: Polish

- [ ] T038 [P] Unit tests for `useAuth.ts` composable
- [ ] T039 [P] Unit tests for `useMaterials.ts` composable
- [ ] T040 [P] Component tests for `CourseMaterialList.vue`
- [ ] T041 E2E test: Auth-Flow funktioniert, Materialien sichtbar, Videos ohne Download-Link

### Dependencies

- Tests (T024-T026) before implementation (T027-T033)
- Database schema (T021-T022) before auth implementation (T027-T028)
- Auth setup (T023, T027-T028) before protected pages (T031-T032)
- Materials API (T029-T030) before materials UI (T033)
- Core implementation before integration (T034-T037)
- Implementation before polish (T038-T041)

## Milestone 3: Storno-Workflow + DSGVO-Löschung

- [ ] Endpoint: `server/api/bookings-[id]-cancel.post.ts` mit 14-Tage-Regel und 409 nach Frist
- [ ] E-Mail-Template: cancellationConfirmation
- [ ] Endpoint: `server/api/user-delete.post.ts` (Deletion on request), lokale Zuordnung entfernen, personenbezogene Daten löschen/anonymisieren
- [ ] UI: Stornieren-Button mit Deaktivierung nach Frist, Hinweistext FR-013
- [ ] Akzeptanz: Storno vor Frist möglich, nach Frist gesperrt; DSGVO-Löschung löscht Account-Daten lokal

## Milestone 3: Öffentliche Website – Struktur und Design (Coursera-inspiriert, max. 10 Kurse)

- [ ] Landing-Layout: Hero-Sektion + Kursbereich (Vuetify MD3, SSR-freundlich)
- [ ] Kursliste: Grid/Karten mit klarer Hierarchie; maximal 10 Einträge gleichzeitig sichtbar
- [ ] `CourseCard.vue` erweitert: zeigt Titel, Beschreibung, Referenz‑Video (Preview)
- [ ] A11y: semantische Überschriften, Landmarken, Tastaturfokus, Kontrast; Axe-Checks
- [ ] Performance/SSR: stabiler Hydration‑Flow, keine Layout‑Shifts für Above‑the‑Fold
- [ ] Akzeptanz: Startseite und Kursliste folgen Coursera-inspiriertem Layout, max. 10 Karten sichtbar, Preview‑Video pro Kurs vorhanden


### Abnahmekriterien (Design/Zielgruppe)

- [ ] Farbschema, Flächengestaltung und Übersichtlichkeit orientieren sich sichtbar an <https://www.villeroy-boch.de/r/wohn-esszimmer/nehmen>
- [ ] Keine Möbel- oder Dekomaterialien auf der öffentlichen Website sichtbar
- [ ] Florale Elemente sind stilisiert und als Illustration/Pattern umgesetzt; kein visueller Konflikt mit Video-Previews
- [ ] Zielgruppe (berufstätige Frauen 35–55, karriereorientiert, ästhetikaffin) wird im UI sichtbar adressiert (z. B. Bildsprache, Text, Call-to-Action)

### Visual/A11y-Checks (Playwright)

- [ ] Axe-Check: keine kritischen A11y-Fehler auf Start/Kursliste
- [ ] Visual-Regression: Hero, Kursgrid und CourseCard mit Preview-Video werden pixelgenau geprüft
- [ ] Manuelle Prüfung: max. 10 Kurskarten sichtbar, keine Möbel/Deko, florale Elemente stilisiert

## Milestone 4: Storno-Workflow + DSGVO-Löschung

- [ ] Endpoint: `server/api/bookings-[id]-cancel.post.ts` mit 14-Tage-Regel und 409 nach Frist
- [ ] E-Mail-Template: cancellationConfirmation
- [ ] Endpoint: `server/api/user-delete.post.ts` (Deletion on request), lokale Zuordnung entfernen, personenbezogene Daten löschen/anonymisieren
- [ ] UI: Stornieren-Button mit Deaktivierung nach Frist, Hinweistext FR-013
- [ ] Akzeptanz: Storno vor Frist möglich, nach Frist gesperrt; DSGVO-Löschung löscht Account-Daten lokal

## Milestone 5: Observability + Hardening

- [ ] Strukturierte Logs (requestId, optional userId) auf Server-APIs
- [ ] Basis-Metriken (Anfragen/Duration) via einfache Zähler (später Observability-Stack)
- [ ] Security-Hardening: CSRF für mutierende Endpoints, Rate Limits, sichere Headers
- [ ] Akzeptanz: Logs vorhanden, Rate-Limits greifen, Headliner-Check bestanden

## Tests

- [ ] Unit: Composables (useCourses/useBookings/useMaterials)
- [ ] Component: CourseCard, CourseMaterialList
- [ ] E2E (Playwright): Buchung Happy Path, Storno Grenzfall (14 Tage), Materialzugriff Video/Text

## Definition of Done

- [ ] Lint (ESLint/Prettier/markdownlint) und Typecheck grün
- [ ] Tests >= 80% für Business-Logik; E2E für Kernflüsse grün
- [ ] CI/PR Checks grün; Dokumentation (README Abschnitt Feature) aktualisiert
