# Implementation Plan: Öffentlich/geschützt – Coaching-Website

Input: Feature specification from `specs/001-clarify-coach-courses/spec.md`

Date: 2025-09-26

Status: Draft

## 1. Overview

Ziel ist die Umsetzung einer Nuxt 3 (TypeScript, SSR) Anwendung mit Vuetify 3 nach den Projektkonventionen. Auth über Microsoft Entra External ID (CIAM). Inhalte: öffentlicher Bereich (Kursangebot, Buchung) und geschützter Bereich (Kursverwaltung, Unterlagen). Klärungen integriert:

- Unbegrenzter Unterlagenzugriff bis Kündigung/Konto‑Löschung (FR‑011)
- Videos ausschließlich Streaming, kein Download (FR‑012)
- Benachrichtigungen E‑Mail‑only (FR‑007 konkret)
- DSGVO: Löschung nur auf Anforderung; keine automatische Frist (FR‑010 konkret)
- Stornoregel: bis 14 Tage vor Start kostenfrei; danach keine Storno (FR‑013)

## 2. Architecture & Folder Structure

- Nuxt 3 SSR; Vue 3 Composition API; TypeScript strict
- Vuetify 3 via vite-plugin-vuetify + Nuxt plugin (bestehende Konfiguration beibehalten)
- Prisma ORM (PostgreSQL); Migrations versioniert
- Server routes unter `server/api/*`
- Komponenten strikt wiederverwendbar; keine Geschäftslogik in Pages
- Alias `@dashboard` auf Vuetify Material Dashboard (lokales Sibling-Repo) beibehalten

Projektskizze:

```text
pages/
  index.vue                      # Landing/Angebote
  courses/index.vue              # Kursliste (öffentlich)
  courses/[id].vue               # Kursdetail + Buchung
  account/index.vue              # Übersicht gebuchte Kurse (geschützt)
  account/courses/[id].vue       # Kursdetails (geschützt) + Unterlagen
  auth/callback.vue              # OIDC Callback
components/
  course/
    CourseCard.vue
    CourseFilterBar.vue
    CourseMaterialList.vue
  booking/
    BookingSummary.vue
    CancellationPolicy.vue
  layout/
    AppNav.vue
    AppFooter.vue
composables/
  useAuth.ts                     # Entra External ID, session, roles
  useCourses.ts                  # fetch/list/filter courses
  useBookings.ts                 # buchen/stornieren, Regeln
  useMaterials.ts                # Zugriff auf Unterlagen (Streaming)
server/api/
  courses.get.ts
  courses-[id].get.ts
  bookings.post.ts
  bookings-[id]-cancel.post.ts
  materials-[courseId].get.ts    # signierte Streaming-URLs / gated proxy
  user-delete.post.ts            # DSGVO-Löschung on request
prisma/
  schema.prisma
```

## 3. Data Model (Prisma)

- User: id, email, name, externalId (OIDC sub/oid), status
- Course: id, title, description, capacity, price, startAt, endAt
- Booking: id, userId, courseId, status (BOOKED|CANCELLED|COMPLETED), bookedAt, cancelledAt, paymentStatus
- Material: id, courseId, type (TEXT|VIDEO), title, url/path, isActive
- Access: abgeleitet aus Booking.status und FR‑011 (unbefristeter Zugriff bis Konto-Löschung)

Konsistenzregeln:

- Booking unique (userId, courseId) aktiv
- Status-Transitions: BOOKED -> CANCELLED/COMPLETED

## 4. Authentication & Authorization

- Microsoft Entra External ID, OIDC PKCE; nur minimal lokale Zuordnung (externalId → user.id)
- Route Middleware: geschützte Seiten unter `/account/**`
- Server Handlers prüfen Session + Rollen; keine Passwörter speichern

## 5. Core Use Cases

- Kursliste/Details öffentlich mit Filter
- Buchung (public → booking.post): prüft Kapazität, erstellt Booking (BOOKED), sendet E‑Mail-Bestätigung
- Stornierung (account → bookings-[id]-cancel.post): erlaubt nur bis 14 Tage vor Start; danach 409
- Unterlagenzugriff (account → materials): TEXT direkt; VIDEO via Streaming-Endpoint/CDN-signierte URL; kein Download-Link
- DSGVO-Löschung (account → user-delete.post): anonymisiert/entfernt personenbezogene Daten, löscht lokale Zuordnung

## 6. Notifications (Email-only)

- Provider Placeholder (Resend/SES/SendGrid); Adapter-Interface mit minimalen Vorlagen: bookingConfirmation, cancellationConfirmation
- SPF/DKIM Domain Setup außerhalb Code; Templates mehrsprachig (de/en)

## 7. Non-Functional & Observability (Initial)

- Security: SSRF/CSRF/Rate-limit auf sensiblen Endpoints, Header-Härtung
- Observability: strukturierte Logs (requestId, userId optional), Basis-Metriken (req count/duration), Fehlertracking-Hook (optional Sentry später)
- Performance: SSR Caching für öffentliche Kursliste (stale-while-revalidate) optional im Plan+1

## 8. Edge Cases & Failure Handling

- Login-Fail: Rate-Limit/MFA spätere Iteration, vorerst Standard OIDC Errors anzeigen
- Ausgebucht: Anzeige “Warteliste TBD” (Plan+1), aktuell Buchung blocken mit klarer Meldung
- Externe Dienste down (Auth/E‑Mail/CDN): Retries mit Exponential Backoff; user-facing Fehlermeldungen

## 9. Acceptance Mapping

- FR‑001..FR‑013 durch obige Flows abgedeckt; E2E-Tests für Buchung, Storno-Grenzfall (14 Tage), Materialzugriff (Video/No-Download)

## 10. Risks & Mitigations

- Video-CDN/DRM offen → Start mit signierten, kurzlebigen URLs; später DRM prüfen
- E‑Mail-Zustellbarkeit → Domain Auth (SPF/DKIM) einplanen; Bounce-Handling Plan+1

## 11. Incremental Delivery

- Milestone 1: Public Kursliste/Detail + Buchung (ohne Payment), E‑Mail-Bestätigung
- Milestone 2: Geschützter Bereich + Materialzugriff (Streaming only)
- Milestone 3: Storno-Workflow (14‑Tage Grenze) + DSGVO-Löschung
- Milestone 4: Observability-Basics + Hardening

## 12. Out of Scope (v1)

- Payment-Integration, Warteliste, SMS/Push, DRM, SLOs formalisiert

## 13. Done Criteria

- Alle FR‑001..FR‑013 erfüllt; E2E happy path + Grenzfälle grün; Lint/Typecheck/Tests in CI grün; Core Web Vitals ok für öffentliche Seiten
