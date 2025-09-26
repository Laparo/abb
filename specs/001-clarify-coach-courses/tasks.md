# Tasks: Coach Courses Feature

Scope: Umsetzung gemäß `specs/001-clarify-coach-courses/spec.md` und Plan `plan.md`.

Date: 2025-09-26

Status: Draft

## Milestone 1: Public Kurse + Buchung (ohne Payment)

- [ ] Pages anlegen: `pages/index.vue`, `pages/courses/index.vue`, `pages/courses/[id].vue`
- [ ] Komponenten: `CourseCard.vue`, `CourseFilterBar.vue`, `BookingSummary.vue`, `CancellationPolicy.vue`
- [ ] Server API: `server/api/courses.get.ts`, `server/api/courses-[id].get.ts`, `server/api/bookings.post.ts`
- [ ] Prisma Schema: User, Course, Booking, Material; Migration erstellen
- [ ] Composables: `useCourses.ts`, `useBookings.ts`
- [ ] E-Mail-Adapter Interface mit Dummy-Implementation; Template bookingConfirmation
- [ ] SSR Caching optional vorbereiten (Flag), aber standardmäßig aus
- [ ] Akzeptanz: Kursliste rendert SSR, Detail abrufbar, Buchung mit Kapazitätsprüfung, Bestätigungs-E-Mail versendet

## Milestone 2: Geschützter Bereich + Materialien (Streaming only)

- [ ] Auth: `useAuth.ts` (OIDC PKCE, Entra External ID), Route-Middleware für `/account/**`
- [ ] Pages: `pages/account/index.vue`, `pages/account/courses/[id].vue`
- [ ] Server API: `server/api/materials-[courseId].get.ts` (signierte kurzlebige URL oder Proxy)
- [ ] Composable: `useMaterials.ts` (TEXT direkt, VIDEO über Streaming-Endpoint)
- [ ] UI: Materialliste, Zugriff nur für gebuchte Nutzer (auch nach Kursende, bis Account-Löschung)
- [ ] Akzeptanz: Auth-Flow funktioniert, Materialien sichtbar, Videos ohne Download-Link

## Milestone 3: Storno-Workflow + DSGVO-Löschung

- [ ] Endpoint: `server/api/bookings-[id]-cancel.post.ts` mit 14-Tage-Regel und 409 nach Frist
- [ ] E-Mail-Template: cancellationConfirmation
- [ ] Endpoint: `server/api/user-delete.post.ts` (Deletion on request), lokale Zuordnung entfernen, personenbezogene Daten löschen/anonymisieren
- [ ] UI: Stornieren-Button mit Deaktivierung nach Frist, Hinweistext FR-013
- [ ] Akzeptanz: Storno vor Frist möglich, nach Frist gesperrt; DSGVO-Löschung löscht Account-Daten lokal

## Milestone 4: Observability + Hardening

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
