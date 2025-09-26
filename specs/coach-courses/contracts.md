# API-Verträge: Coach Courses

Ziel: Schlanke, stabile HTTP-Contracts für Auth, Kurse, Buchungen und Materials. Konform zu Nuxt 3 Server-Routen (Nitro). Typen zeigen die erwarteten Shapes (informativ, TS-Skizzen).

## Leitprinzipien

- Stabile Response-Formate (camelCase, explizite Felder)
- Konsistente Fehlerstruktur
- Paginierung und Filter optional; defaults konservativ
- Auth: OIDC Session-Cookie (httpOnly, secure), kein Token im Client speichern

## Fehlerformat

```ts
export interface ApiError {
  error: {
    code: string // z.B. "not_found", "forbidden", "validation_error"
    message: string
    details?: Record<string, unknown>
  }
}
```

## Auth-Flows

### GET /api/auth/login

- Zweck: OIDC Authorization Code Flow mit PKCE starten
- Query: `returnTo?: string` (optionaler Zielpfad nach Login)
- Response: 302 Redirect zum Entra External ID Authorization Endpoint

### GET /api/auth/callback

- Zweck: OIDC Callback verarbeiten, Session-Cookie setzen
- Response (302): Redirect auf `returnTo` oder Startseite
- Fehler: 302 auf `/login?error=...`

### POST /api/auth/logout

- Zweck: Serverseitige Session invalidieren und IdP-Logout auslösen
- Body: leer
- Response: 204 No Content (Client kann auf Startseite navigieren)

### GET /api/session

- Zweck: Session-Status abfragen

```ts
export interface SessionOk {
  authenticated: true
  user: {
    id: string // interne UUID
    externalSubject: string // OIDC sub
    email?: string
    name?: string
  }
}

export interface SessionAnon {
  authenticated: false
}
```

- Status: 200
- Fehler: keine; immer 200 mit einem der Shapes

## Kurse

### GET /api/courses

- Zweck: Öffentliche Kursliste (nur `published`)
- Query:
  - `q?: string` (Suche im Titel/Beschreibung)
  - `limit?: number` (default 20, max 100)
  - `cursor?: string` (paginierter Cursor)

```ts
export interface CourseListItem {
  id: string
  slug: string
  title: string
  startsAt?: string // ISO-8601
  endsAt?: string // ISO-8601
}

export interface CourseListResponse {
  items: CourseListItem[]
  nextCursor?: string
}
```

- Status: 200 | 400 (Validation) | 500

### GET /api/courses/[slug]

- Zweck: Öffentliche Kursdetails

```ts
export interface CourseDetail {
  id: string
  slug: string
  title: string
  description: string
  priceCents?: number
  currency?: string // ISO-4217
  capacity?: number
  startsAt?: string // ISO
  endsAt?: string // ISO
}
```

- Status: 200 | 404 (not_found)

## Buchungen

Erfordern Authentifizierung (Session).

### POST /api/courses/[id]/book

- Zweck: Kursbuchung anlegen
- Body:

```ts
export interface CreateBookingBody {
  // heute ohne Felder; optional später: Notizen, Gutschein
}
```

- Response:

```ts
export interface BookingResponse {
  id: string
  status: 'booked' | 'cancelled' | 'completed'
  bookedAt: string // ISO
  paymentStatus: 'none' | 'pending' | 'paid' | 'refunded'
}
```

- Status: 201 | 400 | 401 | 409 (bereits gebucht) | 500

### DELETE /api/bookings/[id]

- Zweck: Buchung stornieren
- Response: 204 | 401 | 404

## Materials (geschützt)

Erfordern gültige Buchung des Kurses.

### GET /api/courses/[id]/materials

- Zweck: Liste der Kursmaterialien (Metadaten)

```ts
export interface MaterialItem {
  id: string
  kind: 'text' | 'video' | 'file'
  title: string
  description?: string
  mimeType?: string
  sortOrder: number
  accessFrom?: string // ISO
  accessUntil?: string // ISO
}

export interface MaterialsResponse {
  items: MaterialItem[]
}
```

- Status: 200 | 401 | 403 | 404

### GET /api/materials/[id]/download

- Zweck: Kurzlebige, signierte Auslieferung von Dateien/Videos
- Response: 302 Redirect auf signierte Storage-URL oder 200 Stream
- Status: 200/302 | 401 | 403 | 404

## Validierungsfehler (Beispiel)

```json
{
  "error": {
    "code": "validation_error",
    "message": "Invalid query params",
    "details": {
      "limit": "must be <= 100"
    }
  }
}
```

## Sicherheitsnotizen

- Alle geschützten Endpunkte prüfen: gültige Session, Kurs-Buchung, Zeitfenster
- Keine dauerhaften Storage-Links; nur on-demand signierte URLs
- Rate-Limits für Buchung und Download-Routen
- Minimale Datenrückgabe; keine internen IDs leaken außer erforderlich
