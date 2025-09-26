# Feature Specification: Öffentlicher Auftritt + Geschlossener Kursbereich (Deprecated)

> Deprecated: Diese Spezifikation wurde durch die Coach-Courses-Dokumente ersetzt.
> Aktuelle Quelle: `specs/coach-courses-business-spec.md` sowie Plan/Contracts/Data-Model/Quickstart unter `specs/coach-courses/`.

**Feature Branch**: `001-ich-m-chte`  
**Created**: 2025-09-26  
**Status**: Archived (superseded)  
**Input**: User description: "Ich möchte eine Website erstellen, die einen öffentlichen und einen geschlossen Bereich hat. Der geschlossene Bereich soll durch einen Login geschützt sein. Der geschlossene Bereich erlaubt es Nutztern, gebuchte Kurse zu verwalten und Kursunterlagen einzusehen. Neben Textdokumenten sindn die Videos.\nDer öffentliche Bereich stellt mein Angebot als Coach vor und ermöglicht es Interessenten Kurse zu buchen."

## Execution Flow (main)

```text
1. Parse user description from Input
   → If empty: ERROR "No feature description provided"
2. Extract key concepts from description
   → Identify: actors, actions, data, constraints
3. For each unclear aspect:
   → Mark with [NEEDS CLARIFICATION: specific question]
4. Fill User Scenarios & Testing section
   → If no clear user flow: ERROR "Cannot determine user scenarios"
5. Generate Functional Requirements
   → Each requirement must be testable
   → Mark ambiguous requirements
6. Identify Key Entities (if data involved)
7. Run Review Checklist
   → If any [NEEDS CLARIFICATION]: WARN "Spec has uncertainties"
   → If implementation details found: ERROR "Remove tech details"
8. Return: SUCCESS (spec ready for planning)
```

---

## ⚡ Quick Guidelines

- ✅ Focus on WHAT users need and WHY
- ❌ Avoid HOW to implement (no tech stack, APIs, code structure)
- 👥 Written for business stakeholders, not developers

### Section Requirements

- **Mandatory sections**: Must be completed for every feature
- **Optional sections**: Include only when relevant to the feature
- When a section doesn't apply, remove it entirely (don't leave as "N/A")

### For AI Generation

When creating this spec from a user prompt:

1. **Mark all ambiguities**: Use [NEEDS CLARIFICATION: specific question] for any assumption you'd need to make
1. **Don't guess**: If the prompt doesn't specify something (e.g., "login system" without auth method), mark it
1. **Think like a tester**: Every vague requirement should fail the "testable and unambiguous" checklist item
1. **Common underspecified areas**:
   - User types and permissions
   - Data retention/deletion policies
   - Performance targets and scale
   - Error handling behaviors
   - Integration requirements
   - Security/compliance needs

---

## User Scenarios & Testing (mandatory)

### Primary User Story

Als Interessent möchte ich öffentlich Informationen über das Coaching-Angebot einsehen und Kurse buchen. Als bestehende:r Kund:in möchte ich mich einloggen, meine gebuchten Kurse verwalten und Kursunterlagen (Texte und Videos) ansehen.

### Acceptance Scenarios

1. **Given** ein:e nicht eingeloggte:r Besucher:in befindet sich auf der öffentlichen Website, **When** er/sie einen Kurs bucht, **Then** wird der Buchungsvorgang abgeschlossen und eine Bestätigung angezeigt.
1. **Given** ein:e bestehende:r Kund:in mit gültigen Zugangsdaten, **When** er/sie sich einloggt, **Then** sieht er/sie eine Übersicht der gebuchten Kurse und kann Kursunterlagen einsehen.
1. **Given** ein:e bestehende:r Kund:in ist eingeloggt, **When** ein Kurs mit Video- und Textunterlagen geöffnet wird, **Then** sind alle freigeschalteten Materialien sichtbar und abrufbar.
1. **Given** ein:e nicht eingeloggte:r Besucher:in versucht, den geschlossenen Bereich aufzurufen, **When** Zugriff erfolgt, **Then** wird er/sie zur Login-Seite geleitet.

### Edge Cases

- Was passiert, wenn der/die Nutzer:in keinen aktiven Kurs gebucht hat? Erwartung: Hinweis und ggf. Link zur Buchung.
- Wie wird mit abgelaufenen/abgelehnten Zahlungen umgegangen? [NEEDS CLARIFICATION: Stornierung/Retry/Support-Kontakt]
- Zugriff auf Kursunterlagen vor Kursstart oder nach Kursende? [NEEDS CLARIFICATION: Freigabe-Fenster]
- Offline- oder schwache Verbindung beim Videozugriff? [NEEDS CLARIFICATION: Streaming/Download-Optionen]
- Passwort vergessen/Account gesperrt? [NEEDS CLARIFICATION: Self-Service Reset/Support]

## Requirements (mandatory)

### Functional Requirements

- **FR-001**: System MUST provide a public area to present coaching offering (Beschreibung, Inhalte, Termine, Preise).
- **FR-002**: System MUST allow prospects to book courses from the public area.
- **FR-003**: System MUST provide an authentication mechanism to protect a private area (Login erforderlich).
- **FR-004**: System MUST show, in the private area, a dashboard of all courses booked by the logged-in user.
- **FR-005**: System MUST allow users to access course materials (text documents and videos) for their booked courses.
- **FR-006**: System MUST restrict access to course materials to authorized (booked) users only.
- **FR-007**: System MUST provide a logout capability.
- **FR-008**: System MUST provide a booking confirmation/feedback to the user after a successful booking.
- **FR-009**: System MUST support basic account recovery for locked out users [NEEDS CLARIFICATION: exact flow – password reset vs. support].
- **FR-010**: System MUST surface errors to users with clear messages during login/booking/material access.
- **FR-011**: System MUST record the relationship between users, bookings, courses, and materials for authorization decisions.
- **FR-012**: System MUST handle materials of type text document and video as first-class content types.
- **FR-013**: System MUST provide navigation from public area to login and from private area back to public marketing pages.
- **FR-014**: System MUST prevent unauthenticated access to the private area (redirect to login).
- **FR-015**: System MUST provide a way for users to update basic account details [NEEDS CLARIFICATION: which fields].

### Key Entities (include if feature involves data)

- **User**: Identität einer Person, die Kurse buchen und sich einloggen kann. Attribute: Name, E-Mail, Zugangsdaten. Beziehungen: hat 0..\* Bookings.
- **Course**: Ein buchbares Angebot. Attribute: Titel, Beschreibung, Preis, Termine. Beziehungen: hat 0..*Materials, ist mit 0..*Bookings verknüpft.
- **Booking**: Die Buchung eines Kurses durch einen User. Attribute: Status (gebucht, storniert, ausstehend), Zeitstempel. Beziehungen: gehört zu genau 1 User und 1 Course.
- **Material**: Kursunterlagen, die zu Kursen gehören. Typen: Textdokument, Video. Attribute: Titel, Typ, Sichtbarkeit/Freigabe. Beziehungen: gehört zu genau 1 Course.

---

## Review & Acceptance Checklist

Note: Automated checks run during main() execution

### Content Quality

- [ ] No implementation details (languages, frameworks, APIs)
- [ ] Focused on user value and business needs
- [ ] Written for non-technical stakeholders
- [ ] All mandatory sections completed

### Requirement Completeness

- [ ] No [NEEDS CLARIFICATION] markers remain
- [ ] Requirements are testable and unambiguous
- [ ] Success criteria are measurable
- [ ] Scope is clearly bounded
- [ ] Dependencies and assumptions identified

---

## Execution Status

Note: Updated by main() during processing

- [ ] User description parsed
- [ ] Key concepts extracted
- [ ] Ambiguities marked
- [ ] User scenarios defined
- [ ] Requirements generated
- [ ] Entities identified
- [ ] Review checklist passed
