# Feature Specification: Öffentlich/geschützt – Coaching-Website (Business-Sicht)

**Feature Branch**: `001-clarify-coach-courses`
**Created**: 2025-09-26  
**Status**: Draft  
**Input**: User description: "Ich möchte eine Website erstellen, die einen öffentlichen und einen geschlossen Bereich hat. Der geschlossene Bereich soll durch einen Login geschützt sein. Der geschlossene Bereich erlaubt es Nutzern, gebuchte Kurse zu verwalten und Kursunterlagen einzusehen. Neben Textdokumenten sind auch Videos enthalten.
Der öffentliche Bereich stellt mein Angebot als Coach vor und ermöglicht es Interessenten Kurse zu buchen."

## Clarifications

### Session 2025-09-26

- Q: Wie lange sollen Kund:innen nach Kursabschluss weiterhin Zugriff auf die Kursunterlagen (Texte/Videos) haben? → A: Unbegrenzt, bis Kündigung/Konto-Löschung.
- Q: Sollen Videos nur gestreamt werden oder auch als Download verfügbar sein? → A: Nur Streaming, kein Download.
- Q: Welche Kanäle sollen wir für Buchungsbestätigungen und wichtige Konto-/Kurs-Ereignisse nutzen? → A: Nur E‑Mail (Standard).
- Q: Wie sollen Aufbewahrung und Löschung personenbezogener Daten geregelt sein? → A: Löschung nur auf Anforderung; keine automatische Frist.
- Q: Welche Stornoregelung soll gelten? → A: Kostenfreie Storno bis 14 Tage vor Start; danach keine Storno.

## User Scenarios & Testing

### Primary User Story

Als Interessent möchte ich die Coaching-Angebote einsehen und einen passenden Kurs buchen. Als bestehender Kunde möchte ich mich einloggen, meine gebuchten Kurse verwalten und auf Kursunterlagen (Texte und Videos) zugreifen.

### Acceptance Scenarios

1. Given ein Interessent befindet sich auf der öffentlichen Website, When er ein Kursangebot auswählt und die Buchung abschließt, Then wird die Buchung bestätigt und eine Zugangsmöglichkeit zum geschützten Bereich bereitgestellt.
1. Given ein bestehender Kunde hat gültige Zugangsdaten, When er sich im geschützten Bereich anmeldet, Then sieht er eine Übersicht seiner gebuchten Kurse mit Zugriff auf dazugehörige Unterlagen (Textdokumente und Videos).
1. Given ein Kunde hat einen Kurs storniert oder abgeschlossen, When er seine Kursliste aufruft, Then ist der Kursstatus entsprechend aktualisiert und die Zugriffsrechte auf Unterlagen sind gemäß Status geregelt.

### Edge Cases

- Was passiert bei fehlgeschlagenem Login (falsches Passwort, gesperrter Account)? [NEEDS CLARIFICATION]
- Welche Stornobedingungen gelten (Fristen, Gebühren)? [NEEDS CLARIFICATION]
- Wie wird mit ausgebuchten Kursen umgegangen (Warteliste)? [NEEDS CLARIFICATION]

## Requirements

### Functional Requirements

- **FR-001**: Das System MUSS einen öffentlichen Bereich bereitstellen, in dem Coaching-Angebote einsehbar sind.
- **FR-002**: Interessenten MÜSSEN Kurse im öffentlichen Bereich buchen können (inkl. Bestätigung der Buchung).
- **FR-003**: Das System MUSS einen geschützten Bereich bereitstellen, der ausschließlich nach Anmeldung zugänglich ist.
- **FR-004**: Angemeldete Nutzer MÜSSEN ihre gebuchten Kurse einsehen und verwalten können (z. B. Status, Termine, Storno).
- **FR-005**: Angemeldete Nutzer MÜSSEN Kursunterlagen pro Kurs abrufen können, mindestens Textdokumente und Videos.
- **FR-006**: Das System MUSS den Zugriff auf Kursunterlagen abhängig von Kursstatus und Nutzerberechtigungen steuern (z. B. nur für gebuchte/aktive Kurse).
- **FR-007**: Das System MUSS Buchungsbestätigungen per E‑Mail bereitstellen (Bestätigungsseite + E‑Mail); wichtige Konto-/Kurs-Ereignisse ebenfalls per E‑Mail. Keine weiteren Kanäle.
- **FR-008**: Das System MUSS eine Such-/Filtermöglichkeit nach Kursen im öffentlichen Bereich bereitstellen. [optional]
- **FR-009**: Das System MUSS einen Login-Prozess über einen externen, vertrauenswürdigen Identitätsanbieter mit Self-Service-Registrierung und Passwort-Reset anbieten.
- **FR-010**: Das System MUSS den Umgang mit personenbezogenen Daten gemäß geltender Vorschriften sicherstellen; Daten werden auf Anforderung gelöscht (DSGVO-konform), es gibt keine automatische Löschfrist.
- **FR-011**: Nach Kursabschluss bleibt der Zugriff auf Kursunterlagen unbegrenzt bestehen, bis zur Kündigung oder Konto-Löschung.
- **FR-012**: Videos sind ausschließlich per Streaming abrufbar; Downloads sind nicht verfügbar.
- **FR-013**: Stornobedingungen: Kostenfreie Stornierung bis 14 Tage vor Kursstart; innerhalb von 14 Tagen vor Kursstart ist keine Stornierung mehr möglich.

### Key Entities

- **Nutzer/Kunde**: Person mit Zugang zum geschützten Bereich; Attribute: Name, E-Mail, Zugangsdaten; Beziehung zu Buchungen/Kursen.
- **Kurs**: Angebot mit Titel, Beschreibung, Terminen, Kapazität, Preis; Beziehung zu Unterlagen und Buchungen.
- **Buchung**: Zuordnung Nutzer↔Kurs mit Status (gebucht, storniert, abgeschlossen), Zeitpunkten, Zahlungsstatus.
- **Kursunterlage**: Materialien (Textdokumente, Videos) je Kurs, mit Zugriffsregeln (verfügbar, gesperrt).

## Review & Acceptance Checklist

### Content Quality

- [ ] Keine Implementierungsdetails (Tech-Stack, APIs, Code)
- [ ] Fokus auf Nutzerwert und Geschäftsziele
- [ ] Für nicht-technische Stakeholder verständlich
- [ ] Alle Pflichtabschnitte vollständig

### Requirement Completeness

- [ ] Keine [NEEDS CLARIFICATION]-Marker verbleiben
- [ ] Anforderungen sind testbar und eindeutig
- [ ] Erfolgskriterien sind messbar
- [ ] Umfang ist klar begrenzt
- [ ] Abhängigkeiten und Annahmen beschrieben

## Annahmen & Abhängigkeiten

- Identitäts- & Zugangsmanagement (Registrierung, Login, Passwort-Reset, Profilverwaltung) wird durch einen externen Anbieter bereitgestellt. Vorgesehen ist Microsoft Entra External ID (CIAM). Die Anwendung speichert nur minimal erforderliche Zuordnungen (z.\ B. `sub/oid` → interner Nutzer) und keine Passwörter.
- Benachrichtigung erfolgt E‑Mail-only über einen externen Provider (z. B. Resend/SES/SendGrid), inkl. Domain-Setup (SPF/DKIM) und mehrsprachigen Templates.
- Video-Bereitstellung erfolgt ausschließlich als Streaming über gesicherte Endpunkte/CDN; Downloads sind nicht verfügbar.

## Execution Status

- [x] User description parsed
- [x] Key concepts extracted
- [x] Ambiguities marked
- [x] User scenarios defined
- [x] Requirements generated
- [x] Entities identified
- [ ] Review checklist passed
