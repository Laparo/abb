# Data Model: Coach Courses

Ziel: Minimales, pragmatisches Datenmodell für öffentliche Kursdarstellung, Buchung und zugriffsgeschützte Kursunterlagen. Identitätsverwaltung liegt extern bei Microsoft Entra External ID (CIAM).

## Leitlinien & Constraints

- Datenminimierung: Keine Passwörter in der App; nur Mapping von externer Identität → interner Nutzer.
- Auth-Quelle: Microsoft Entra External ID (OIDC). Primärer Identifikator aus ID-Token-Claims.
- Löschung/Retention: Physische Löschung sensibler Daten nach Fristen; ansonsten Statusfelder bevorzugen.
- Integrität: Eindeutigkeit für Slugs/Zuordnungen; referenzielle Integrität über FK.

## Claim-Mapping (Entra External ID)

- externalSubject: aus ID-Token `sub` (Fallback: `oid` falls erforderlich).
- email: aus Claim `email` (optional, kann fehlen oder variieren).
- name: aus Claim `name` (optional).

Hinweis: Bei wechselnden E-Mails bleibt `externalSubject` stabil und dient als Primärbezug.

## Entitäten

### User

- id: UUID (PK)
- externalSubject: string (unique, required) – aus OIDC `sub`
- email: string (unique, optional) – letzte bekannte E-Mail des Nutzers
- name: string (optional)
- status: enum { active, blocked } (default: active)
- createdAt: DateTime (default now)
- updatedAt: DateTime (auto-update)

Constraint/Notes:

- Unique(externalSubject)
- Optional: Index(email) für schnelle Suche

### Course

- id: UUID (PK)
- slug: string (unique)
- title: string
- description: string (rich text möglich; initial kurz)
- priceCents: int (optional, 0 wenn unverbindlich)
- currency: string(3) (optional, ISO-4217)
- capacity: int (optional)
- startsAt: DateTime (optional)
- endsAt: DateTime (optional)
- status: enum { draft, published, archived } (default: draft)
- createdAt: DateTime
- updatedAt: DateTime

Constraint/Notes:

- Unique(slug)
- Optional: Index(status), Index(startsAt)

### Booking

- id: UUID (PK)
- userId: UUID (FK → User.id)
- courseId: UUID (FK → Course.id)
- status: enum { booked, cancelled, completed } (default: booked)
- bookedAt: DateTime (default now)
- cancelledAt: DateTime (optional)
- completedAt: DateTime (optional)
- priceCentsAtBooking: int (optional)
- paymentStatus: enum { none, pending, paid, refunded } (default: none)

Constraint/Notes:

- Unique(userId, courseId) – pro Nutzer genau eine aktive Buchung pro Kurs
- Index(courseId), Index(userId)

### Material

- id: UUID (PK)
- courseId: UUID (FK → Course.id)
- kind: enum { text, video, file }
- title: string
- description: string (optional)
- storageKey: string (optional) – serverseitiger Schlüssel/Locator (z. B. Pfad im Storage)
- mimeType: string (optional)
- sortOrder: int (default: 0)
- accessFrom: DateTime (optional)
- accessUntil: DateTime (optional)
- createdAt: DateTime
- updatedAt: DateTime

Constraint/Notes:

- Index(courseId, sortOrder)
- Keine dauerhaften öffentlichen URLs speichern; signierte Zugriffs-URLs werden on-demand generiert

## Relationen (Übersicht)

- User 1—n Booking n—1 Course
- Course 1—n Material

## Zugriffsregeln (Server-seitig)

- Materials sind nur sichtbar, wenn:
  1. gültige Session (OIDC geprüft) UND
  1. Booking(userId, courseId).status ∈ { booked, completed } UND
  1. Zeitfenster gilt (accessFrom ≤ now ≤ accessUntil, falls gesetzt)

- Videos und Dateien werden ausschließlich über serverseitige Endpunkte ausgeliefert, die Storage-URLs kurzlebig signieren.

## Indizes & Eindeutigkeiten

- User.externalSubject: unique
- Course.slug: unique
- Booking(userId, courseId): unique
- Material(courseId, sortOrder): index

## Soft Deletion / Archivierung

- Kurse: `status=archived` statt Hard-Delete; Buchungen behalten (Audit/Zwecke)
- Nutzer: Blockieren via `status=blocked`; physische Löschung gemäß DSGVO-Entscheidung (Research)

## Beispiel (Prisma-Skizze – informativ)

```prisma
model User {
  id              String   @id @default(uuid())
  externalSubject String   @unique
  email           String?  @unique
  name            String?
  status          UserStatus @default(active)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  bookings        Booking[]
}

enum UserStatus {
  active
  blocked
}

model Course {
  id          String      @id @default(uuid())
  slug        String      @unique
  title       String
  description String
  priceCents  Int?
  currency    String?
  capacity    Int?
  startsAt    DateTime?
  endsAt      DateTime?
  status      CourseStatus @default(draft)
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  bookings    Booking[]
  materials   Material[]
}

enum CourseStatus {
  draft
  published
  archived
}

model Booking {
  id                   String       @id @default(uuid())
  userId               String
  courseId             String
  status               BookingStatus @default(booked)
  bookedAt             DateTime     @default(now())
  cancelledAt          DateTime?
  completedAt          DateTime?
  priceCentsAtBooking  Int?
  paymentStatus        PaymentStatus @default(none)

  user    User   @relation(fields: [userId], references: [id])
  course  Course @relation(fields: [courseId], references: [id])

  @@unique([userId, courseId])
  @@index([userId])
  @@index([courseId])
}

enum BookingStatus {
  booked
  cancelled
  completed
}

enum PaymentStatus {
  none
  pending
  paid
  refunded
}

model Material {
  id         String   @id @default(uuid())
  courseId   String
  kind       MaterialKind
  title      String
  description String?
  storageKey String?
  mimeType   String?
  sortOrder  Int      @default(0)
  accessFrom DateTime?
  accessUntil DateTime?
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  course Course @relation(fields: [courseId], references: [id])

  @@index([courseId, sortOrder])
}

enum MaterialKind {
  text
  video
  file
}
```

## Offene Punkte (für Research)

1. Payment-Felder in Booking finalisieren (Provider, Transaktionen, Rechnungen)
1. Eindeutigkeit von `email` in User (Alias-Adressen?) – ggf. nur Index statt Unique
1. Retention-/Löschkonzept (Timeline, Pseudonymisierung, Backups)
1. Material-Varianten (Mehrsprachigkeit, Untertitel, Transkripte) – Struktur erweitern
