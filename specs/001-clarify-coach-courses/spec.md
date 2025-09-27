# Feature Specification: Öffentlich/geschützt – Coaching-Website (Business-Sicht)

**Feature Branch**: `001-clarify-coach-courses`
**Created**: 2025-09-26  
**Status**: Draft  
**Input**: User description: "Ich möchte eine Website erstellen, die einen öffentlichen und einen geschlossen Bereich hat. Der geschlossene Bereich soll durch einen Login geschützt sein. Der geschlossene Bereich erlaubt es Nutzern, gebuchte Kurse zu verwalten und Kursunterlagen einzusehen. Neben Textdokumenten sind auch Videos enthalten.
Der öffentliche Bereich stellt mein Angebot als Coach vor und ermöglicht es Interessenten Kurse zu buchen."

Siehe auch: [`analyze.md`](./analyze.md) für den Abgleich Anforderungen ↔ Umsetzung.

## Clarifications

### Session 2025-09-26

- Q: Wie lange sollen Kund:innen nach Kursabschluss weiterhin Zugriff auf die Kursunterlagen (Texte/Videos) haben? → A: Unbegrenzt, bis Kündigung/Konto-Löschung.
- Q: Sollen Videos nur gestreamt werden oder auch als Download verfügbar sein? → A: Nur Streaming, kein Download.
- Q: Welche Kanäle sollen wir für Buchungsbestätigungen und wichtige Konto-/Kurs-Ereignisse nutzen? → A: Nur E‑Mail (Standard).
- Q: Wie sollen Aufbewahrung und Löschung personenbezogener Daten geregelt sein? → A: Löschung nur auf Anforderung; keine automatische Frist.
- Q: Welche Stornoregelung soll gelten? → A: Kostenfreie Storno bis 14 Tage vor Start; danach keine Storno.

### Defaults (beschlossen am 2025-09-26)

- Login-Lockout: Nach 5 fehlgeschlagenen Login-Versuchen innerhalb von 15 Minuten wird der weitere Login für 15 Minuten gesperrt (Rate-Limit). Fehlermeldungen bleiben generisch ("Login fehlgeschlagen"). Sperre gilt nutzer- und IP-basiert. Entsperrung automatisch nach Ablauf der Zeit oder manuell durch Admin.
- Warteliste: Wenn ein Kurs ausgebucht ist, können Interessenten sich auf eine FIFO-Warteliste eintragen. Wird ein Platz frei, erhält die oberste Person eine E‑Mail und eine 24‑Stunden-Haltefrist, in der sie verbindlich buchen kann. Verfällt die Frist, erhält die nächste Person die Chance; Admin-Override möglich.
- Storno-Cutoff (Zeitzone): Die 14‑Tage‑Grenze wird strikt als Startzeitpunkt des Kurses minus 336 Stunden in der Zeitzone Europe/Berlin berechnet (startAt − 336h, TZ=Europe/Berlin).

## User Scenarios & Testing

### Primary User Story

Als Interessent möchte ich die Coaching-Angebote einsehen und einen passenden Kurs buchen. Als bestehender Kunde möchte ich mich einloggen, meine gebuchten Kurse verwalten und auf Kursunterlagen (Texte und Videos) zugreifen.

### Acceptance Scenarios

1. Given ein Interessent befindet sich auf der öffentlichen Website, When er ein Kursangebot auswählt und die Buchung abschließt, Then wird die Buchung bestätigt und eine Zugangsmöglichkeit zum geschützten Bereich bereitgestellt.
1. Given ein bestehender Kunde hat gültige Zugangsdaten, When er sich im geschützten Bereich anmeldet, Then sieht er eine Übersicht seiner gebuchten Kurse mit Zugriff auf dazugehörige Unterlagen (Textdokumente und Videos).
1. Given ein Kunde hat einen Kurs storniert oder abgeschlossen, When er seine Kursliste aufruft, Then ist der Kursstatus entsprechend aktualisiert und die Zugriffsrechte auf Unterlagen sind gemäß Status geregelt.

### Edge Cases & Policies

- Fehlgeschlagener Login: Es gilt die Lockout-Policy (s. Defaults). Nutzer erhalten keine Details, ob E‑Mail existiert; Nachricht bleibt generisch. Support-Fall über Admin-Entsperrung möglich.
- Stornobedingungen: Kostenfreie Stornierung bis zur exakten 14‑Tage‑Grenze gemäß Zeitzone-Definition (s. Defaults). Danach keine Stornierung möglich.
- Ausgebuchte Kurse: FIFO-Warteliste mit 24h-Haltefrist je Einladung; automatische E‑Mail-Benachrichtigung; Admin-Override möglich.

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
- **FR-013**: Stornobedingungen: Kostenfreie Stornierung bis 14 Tage vor Kursstart; innerhalb von 14 Tagen vor Kursstart ist keine Stornierung mehr möglich. Die 14‑Tage‑Grenze wird als `startAt − 336h` in der Zeitzone `Europe/Berlin` berechnet.
- **FR-014**: Warteliste für ausgebuchte Kurse: FIFO-Reihenfolge; bei frei werdendem Platz Einladung per E‑Mail mit 24‑Stunden-Haltefrist zur verbindlichen Buchung; Fristablauf → nächste Person.
- **FR-015**: Login-Lockout: Nach 5 Fehlversuchen in 15 Minuten wird der Login für 15 Minuten gesperrt (nutzer- und IP-basiert); Fehlermeldungen bleiben generisch.

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
- Lockout-Mechanik wird nach Möglichkeit durch den IdP (Entra External ID) abgedeckt; falls nicht verfügbar, wird sie application-seitig durch Rate-Limits/Counter auf API-Ebene umgesetzt.

## Execution Status

- [x] User description parsed
- [x] Key concepts extracted
- [x] Ambiguities marked
- [x] User scenarios defined
- [x] Requirements generated
- [x] Entities identified
- [x] Analysis documented (`analyze.md`)
- [ ] Review checklist passed
