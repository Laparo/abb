# Implementation Plan: Coach Courses (öffentlicher/geschützter Bereich)

Branch: feature/coach-courses | Date: 2025-09-26 | Spec: specs/coach-courses-business-spec.md
Input: Feature specification from `specs/coach-courses-business-spec.md`

## Execution Flow (/plan command scope)

```text
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from context (Nuxt 3 web app)
   → Set Structure Decision accordingly (Nuxt 3 structure)
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

IMPORTANT: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands.

## Summary

Primary requirement: Öffentlicher Bereich zur Darstellung von Coaching-Angeboten inkl. Kursbuchung; geschützter Bereich mit Login, in dem Kund:innen gebuchte Kurse verwalten und Kursunterlagen (Texte und Videos) einsehen können.

Technical approach (high-level):

- Nuxt 3 mit SSR für öffentliche Seiten; Auth-geschützte Routen mit Middleware (serverseitig prüfbar), clientseitige Hydration optimiert.
- Vuetify 3 (MD3) für UI; Komponenten-first, Seiten orchestrieren nur.
- UI-Komponentenquelle: Alle Frontend-Elemente sind mit Komponenten aus `~/../vuetify-material-dashboard` (lokal: `/Users/Zauberflocke/Documents/GitHub/vuetify-material-dashboard`) zu erstellen.
- Persistenz via Prisma → PostgreSQL. Kurs-, Buchungs- und Material-Beziehungen als Kernmodell.
- Authentifizierung & Accounts: Microsoft Entra External ID (CIAM) mit Self-Service-Registrierung (SUSI). Nutzerverwaltung (Registrierung, Login, Passwort-Reset, Profil) wird durch Entra External ID übernommen; die App nutzt OIDC (Authorization Code Flow mit PKCE) und speichert nur minimale Zuordnung (z. B. `sub/oid` → interner Nutzer).
- Medienbereitstellung für Videos über Streaming-geeignete Quelle (NEEDS CLARIFICATION: Storage/CDN/DRM) und gesicherte Zugriffsprüfung per Server-API.
- Buchung inkl. Bestätigung; Benachrichtigungskanal (NEEDS CLARIFICATION: E-Mail-Provider); optionale Suche/Filter im Katalog.
- Datenschutz und Aufbewahrung gem. Vorgaben (NEEDS CLARIFICATION: Fristen/Löschkonzept).

## Technical Context

- Language/Version: Nuxt 3 + TypeScript (strict)
- Primary Dependencies: Nuxt 3, Vuetify 3 (MD3), Prisma ORM, Microsoft Entra External ID (OIDC)
- Storage: PostgreSQL via Prisma (Dev/Test über SQLite optional, falls gewünscht)
- Testing: Vitest, Vue Test Utils, Playwright
- Target Platform: Universal SSR mit clientseitiger Hydration; geschützte Routen via Middleware; OIDC-Flows mit Microsoft Entra External ID
- Project Type: Web (Nuxt 3)
- Performance Goals: Core Web Vitals-konform; LCP < 2.5 s, CLS < 0.1
- Constraints: p95 < 200 ms für Kern-API-Endpunkte; Bundle-Size niedrig durch Tree-Shaking; keine Passwortspeicherung in der App; serverseitige Token-Verifikation
- Scale/Scope: Öffentlich (Landing, Kursliste, Kursdetail, Buchung); Geschützt (Dashboard „Meine Kurse“, Unterlagenansicht, Kursstatus/Storno); Identitätsmanagement ausgelagert an Microsoft Entra External ID

Unknowns (NEEDS CLARIFICATION) to resolve in Phase 0:

1. Microsoft Entra External ID (Mandant/App): Tenant/Domain, Region, Custom Domain/Branding
1. User Flows vs. Custom Policies (Entra External ID): Sign-up/Sign-in (SUSI), Password Reset (SSPR), Profile Edit – Auswahl und Konfiguration
1. Token-Design & Claims-Mapping: benötigte Claims (z. B. `oid`, `emails`, `name`), Rollen/Groups, benutzerdefinierte Claims
1. Redirect-URIs & Routen: Login-/Logout-Redirects, Callback-Routen, Post-Logout Redirect
1. Sessions & Token Refresh: Access-/ID-Token-Laufzeiten, Silent-Refresh-Strategie, Clock Skew
1. Zahlungs-/Buchungsfluss: Externes Payment (Stripe/…)? Benötigt es Rechnungen?
1. Benachrichtigung: E-Mail-Provider (z. B. Resend, SES, SendGrid)? Inhalte/Sprachen?
1. Video-Delivery: Nur Streaming? CDN/DRM? Download erlaubt?
1. Zugriffsdauer nach Kursende: Wie lange bleiben Unterlagen verfügbar?
1. Storno-/Warteliste-Regeln: Fristen, Gebühren, Waitlist-Handling?
1. Datenschutz: Aufbewahrungsfristen, Löschkonzept, Datenminimierung (insb. nur Entra External ID `sub/oid` persistieren)

## Constitution Check

Gate: Must pass before Phase 0 research. Re-check after Phase 1 design.

I. Component-First Development

- ✅ Reusable Komponenten mit klaren Props + JSDoc
- ✅ Keine Business-Logik in Pages; Composables für Logik

II. File-Based Routing Discipline

- ✅ Nuxt /pages-Disziplin; [param].vue bei dynamischen Routen
- ✅ Keine manuellen Routen außer begründet

III. SSR/SPA Hybrid Strategy

- ✅ SSR für öffentliche Inhalte; geschützte Bereiche serverseitig prüfbar
- ✅ Hydration optimiert gegen Layout-Shifts

IV. TypeScript-First Development

- ✅ Striktes TS, keine any ohne TODO
- ✅ Typdefinitionen für externe APIs

V. Composables for Logic Sharing

- ✅ useFetch/$fetch serverseitig; Composables kapseln Logik
- ✅ Pinia nur bei komplexem State

VI. Prisma ORM Integration

- ✅ Schema-first (prisma/schema.prisma)
- ✅ Typ-sichere DB-Operationen, Migrations versioniert

VII. Vuetify UI Framework Standards

- ✅ MD3-Konformität; Layout via v-app, v-main
- ✅ Theme zentral konfiguriert; Tree-Shaking aktiv
- ✅ Primäre Komponentenquelle: lokales `vuetify-material-dashboard` (Sibling-Ordner neben `abb`, z. B. `../vuetify-material-dashboard`); Einbindung via Workspace/Alias; keine Ad-hoc-CSS, ausschließlich Vuetify- und Dashboard-Komponenten verwenden

VIII. MCP Tooling (optional)

- ✅ Prisma MCP nur lokal, optional, keine Prod-Abhängigkeit

IX. Git Branching Standards

- ⚠️ Plan schlägt `feature/coach-courses` vor; Arbeit erfolgt über PR (keine direkten main-Commits)

## Project Structure

Documentation (this feature)

```text
specs/coach-courses/
├─ plan.md              # This file (/plan output)
├─ research.md          # Phase 0 output (/plan)
├─ data-model.md        # Phase 1 output (/plan)
├─ quickstart.md        # Phase 1 output (/plan)
├─ contracts/           # Phase 1 output (/plan)
└─ tasks.md             # Phase 2 output (/tasks - NOT created by /plan)
```

Source Code (Nuxt 3 application)

```text
pages/                  # File-based routing (SSR by default)
components/             # Reusable Vue components (Vuetify-based)
composables/            # Business logic (Composition API)
server/
  ├─ api/               # API routes (REST endpoints)
  └─ services/          # Server-side services
prisma/                 # Schema + migrations
plugins/                # Nuxt plugins (Vuetify setup)
middleware/             # Route middleware (auth)
assets/                 # Uncompiled assets
public/                 # Static assets
types/                  # Shared TS types
tests/                  # unit/component/integration/e2e
.specify/               # Spec-driven development files
```

Structure Decision: Default to Nuxt 3 structure above.

Security Considerations (Microsoft Entra External ID)

- OIDC Authorization Code Flow mit PKCE; Verwendung von `state` und `nonce`
- Serverseitige Token-Verifikation (JWKS-Caching, Prüfung von `iss`/`aud`, Ablauf, Clock Skew)
- Minimalprinzip: Keine Passwörter speichern; nur `oid/sub` und notwendige Profildaten mappen
- Front-/Back-Channel-Logout berücksichtigen; Session-Invaliderung auf App-Seite
- Fehlerfälle: abgelaufene/ungültige Tokens, zurückgezogene Einwilligungen, gesperrte Nutzer

## Phase 0: Outline & Research

Extract unknowns from Technical Context → create research tasks per Unknown.

Deliverable: `specs/coach-courses/research.md` including for each item

- Decision: [chosen approach]
- Rationale: [why]
- Alternatives: [considered]

Key research tracks:

1. Auth (credentials vs magic link vs social) und Sessions/Token-Strategie
1. Payment/Booking (falls erforderlich) inkl. rechtliche Aspekte (Rechnungen)
1. Video-Hosting/-Streaming (Storage, CDN, DRM, Bandbreite, Kosten)
1. Datenschutz/DSGVO (Retention, Löschung, Datensparsamkeit)
1. Kurslebenszyklus (Status, Zugriffsdauer, Storno/Warteliste)

## Phase 1: Design & Contracts

Prerequisite: research.md complete.

1. Data Model → `data-model.md`
   - Entities: User, Course, Booking, Material
   - Beziehungen & Status-Übergänge (Booking: gebucht/storniert/abgeschlossen)

1. API Contracts → `/contracts/`
   - Public: GET /api/courses, GET /api/courses/[id]
   - Booking: POST /api/bookings (create), GET /api/bookings/[id]
   - Auth (Microsoft Entra External ID via OIDC):
     - GET /auth/login → Redirect zum Entra External ID SUSI-Flow
     - GET /auth/callback → Code→Token-Exchange (serverseitig), Session setzen
     - GET /auth/logout → Front-/Back-Channel-Logout (Entra External ID), Redirect zurück
     - GET /api/auth/session → Session-/Token-Status prüfen (für Client)
   - Protected: GET /api/me/courses, GET /api/me/courses/[id]/materials
   - Access control: Serverseitige Token-Validierung (Signatur, Aud/Iss, Nonce/State), Claims-basierte Autorisierung

1. Contract Tests (failing by design)
   - Request/Response-Schema je Endpoint
   - Access-Control-Tests für Materials

1. Quickstart → `quickstart.md`
   - Lokales Starten, Seed-Daten, Demo-Flows (Buchen, Anmelden, Unterlagen ansehen)
   - Microsoft Entra External ID Setup: App-Registrierung, Redirect-URIs, User Flows (SUSI/SSPR), Test-Account
   - Details und Schritt-für-Schritt siehe [Quickstart](coach-courses/quickstart.md)
   - `.env`-Variablen (Überblick): `ENTRA_TENANT_ID`, `ENTRA_TENANT_DOMAIN`, `ENTRA_CLIENT_ID`, `ENTRA_USER_FLOW`, `ENTRA_ISSUER`, `ENTRA_AUTHORITY`, `ENTRA_REDIRECT_URI`, `ENTRA_POST_LOGOUT_REDIRECT_URI`, `ENTRA_SCOPES`

1. Agent Context Update (optional)
   - `.specify/scripts/bash/update-agent-context.sh copilot` falls vorhanden

## Phase 2: Task Planning Approach (description only)

Task Generation Strategy:

- Nutze `.specify/templates/tasks-template.md` als Basis
- Ableitung aus Contracts, Data Model, Quickstart
- TDD-Reihenfolge: Tests vor Implementierung; Abhängigkeiten: Modelle → Services → UI
- [P] parallelisierbare Tasks markieren

Ordering Strategy:

- Zuerst Contract- und Integrationstests; dann Datenmodell/Services; dann UI

Estimated Output: 25–30 nummerierte Tasks in `tasks.md` (durch /tasks Befehl)

## Phase 3+: Future Implementation (out of scope for /plan)

- Phase 3: /tasks generiert tasks.md
- Phase 4: Umsetzung gemäß tasks.md und Constitution
- Phase 5: Validierung (Tests, Quickstart, Performance)

## Complexity Tracking

Nur ausfüllen, wenn Constitution-Verstöße begründet werden müssen.

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --------- | ---------- | ------------------------------------ |

## Progress Tracking

Phase Status:

- [ ] Phase 0: Research complete (/plan)
- [ ] Phase 1: Design complete (/plan)
- [ ] Phase 2: Task planning complete (/plan - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

Gate Status:

- [ ] Initial Constitution Check: PASS
- [ ] Post-Design Constitution Check: PASS
- [ ] All NEEDS CLARIFICATION resolved
- [ ] Complexity deviations documented

---

Based on Constitution v1.3.0 — see `/.specify/memory/constitution.md`.

## Verwandte Spezifikationen

- Data Model: [specs/coach-courses/data-model.md](specs/coach-courses/data-model.md)
- API-Verträge: [specs/coach-courses/contracts.md](specs/coach-courses/contracts.md)
- Runtime Config Mapping: [specs/coach-courses/runtime-config.md](specs/coach-courses/runtime-config.md)
