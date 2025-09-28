# Analysis: Alignment & Consistency (Coach Courses)

Date: 2025-09-26
Branch: 001-clarify-coach-courses
Status: Completed (spec defaults eingepflegt; pending final review checklist)

## Zusammenfassung

Diese Analyse prüft die Konsistenz zwischen Spezifikation, Plan und aktuellem Codezustand (Nuxt 3 + Vuetify + Prisma). Ergebnis: Milestone 1 (Öffentliche Kurse + Buchung) ist weitgehend umgesetzt; Milestone 2 (Geschützter Bereich + Materialien) ist geplant; ein neuer Milestone 3 (Öffentliche Website – Struktur & Design) wurde eingefügt; Storno/DSGVO ist nun Milestone 4; Observability/Hardening ist Milestone 5. Nachgelagerte Anforderungen (Auth/Materials/Storno/DSGVO/E-Mail) stehen entsprechend aus und sind den Meilensteinen zugeordnet.

## Mapping: Anforderungen (FR-001 … FR-013) → Status

- FR-001 Öffentlich sichtbarer Bereich: Done
  - Seiten vorhanden: `pages/index.vue`, `pages/courses/index.vue`, `pages/courses/[id].vue`
- FR-002 Kursbuchung inkl. Bestätigung: Partial
  - API `POST /api/bookings` + UI-Flow implementiert (Success-Alert); E-Mail-Bestätigung steht aus
- FR-003 Geschützter Bereich (Login erforderlich): TBD (Milestone 2)
- FR-004 Verwaltung gebuchter Kurse: TBD (Milestone 2/3)
- FR-005 Kursunterlagen (Text/Video) abrufen: Partial (Datenmodell vorhanden; UI/API fehlt – Milestone 2)
- FR-006 Zugriffssteuerung Materialien: TBD (Milestone 2)
- FR-007 E-Mail-Benachrichtigungen (Buchung/Events): TBD (Adapter + Templates fehlen)
- FR-008 Suche/Filter im öffentlichen Bereich: Optional/TBD
- FR-009 Login via externer IdP (Entra External ID, OIDC PKCE): TBD (Milestone 2)
- FR-010 DSGVO-Löschung auf Anforderung: TBD (Milestone 4)
- FR-011 Unbegrenzter Zugriff bis Konto-Löschung: TBD (Milestone 2 – Policy/Enforcement)
- FR-012 Videos nur Streaming, kein Download: TBD (Milestone 2 – Streaming-Proxy/Signierte URLs/CDN)
- FR-013 Storno bis 14 Tage vor Start: TBD (Milestone 4)

## Tests & Qualität

- Unit-Tests: vorhanden (API-Handler, Composables, Komponenten) – grün
- E2E (Playwright): Smoke + A11y vorhanden; Booking Happy Path ergänzt (`e2e/booking-flow.spec.ts`)
- Global-Setup migriert/seeden der DB (`e2e/global-setup.ts`)
- Typecheck/ESLint/Prettier/markdownlint: integriert; CI-Workflow aktiv

## Offene Klärungen (aus Spezifikation)

Alle drei Punkte wurden in der Spezifikation als Defaults festgelegt (siehe Abschnitt "Defaults" in `spec.md`):

- Lockout/Fehlertexte: 5 Fehlversuche/15min → 15min Sperre; generische Meldungen.
- Warteliste: FIFO + 24h-Haltefrist pro Einladung.
- 14‑Tage-Grenze: `startAt − 336h` in TZ `Europe/Berlin`.

## Risiken/Annahmen

- Auth (Entra External ID) beeinflusst Nutzermodell (Zuordnung externer `sub/oid` ↔ lokaler User)
- Video-Streaming erfordert Architekturentscheidung (Proxy/Tokenized URLs/CDN)
- E‑Mail-Provider-Setup (SPF/DKIM) noch festzulegen

## Fazit

/analyze ist inhaltlich durchgeführt: Lücken und Abhängigkeiten sind identifiziert und den Meilensteinen zugeordnet. Die Spezifikation bleibt „Draft“, bis die offenen Klärungen beantwortet und die Review-Checkliste final abgehakt ist.
