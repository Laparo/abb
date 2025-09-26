# Research: Coach Courses (öffentlicher/geschützter Bereich)

Datum: 2025-09-26  
Quelle (Spec): `specs/coach-courses-business-spec.md`  
Bezug (Plan): `specs/coach-courses-plan.md`

Ziel: Alle [NEEDS CLARIFICATION]-Punkte klären und belastbare Entscheidungen dokumentieren. Ergebnisse fließen in `data-model.md`, `/contracts/`, `quickstart.md` ein.

## Zusammenfassung offener Punkte

1. Authentifizierung: Methode (E-Mail+Passwort, Magic Link, Social Login) und Session-Strategie
1. Login-Fehlschläge: Fehlermeldungen, Lockout/Rate-Limiting, Account-Sperren
1. Buchung/Bezahlung: Reiner Buchungsvorgang vs. Zahlung (Provider, Rechnungspflichten)
1. Benachrichtigung: Kanal (E-Mail), Provider (z. B. Resend/SES/SendGrid), Inhalte/Sprachen
1. Video-Bereitstellung: Streaming vs. Download, Storage/CDN, DRM/Token-Absicherung
1. Zugriffsdauer nach Kursende: Zeitliche Begrenzung, Verlängerungsregeln
1. Stornobedingungen & Warteliste: Fristen, Gebühren, Waitlist-Verhalten bei Ausbuchung
1. Datenschutz/DSGVO: Aufbewahrung, Löschung, Datenminimierung, Auskunft

Hinweise auf diese Punkte finden sich in den Abschnitten „Edge Cases“ und „Functional Requirements (FR-007, FR-009, FR-010)“ der Spec.

## Entscheidungsformat

Für jeden Punkt dokumentieren wir:

- Decision
- Rationale
- Alternatives considered
- Impacts (Security, UX, Legal, Ops)
- Open questions (falls verbleibend)
- Owner, Due

## R-01 Authentifizierung

- Context: FR-009, Login geschützter Bereich, SSR/SPA-Hybrid, Nuxt 3
- Decision: [PENDING]
- Rationale: [PENDING]
- Alternatives considered:
  1. E-Mail + Passwort (klassisch, kontrollierbar)
  1. Magic Link (passwortlos, weniger Reibung)
  1. Social Login (schneller Einstieg, Datenschutz prüfen)
- Impacts:
  - Security: Passworthärtung, Rate-Limits, Session/Token, MFA optional?
  - UX: Onboarding-Reibung, Wiederanmeldung
  - Ops: Account-Verwaltung, Support-Aufwand
- Open questions:
  - MFA gewünscht? Passwort-Richtlinien? (Microsoft Entra External ID Policies)
  - Session-Lifetime, Remember-Me? (ID/Access/Refresh Token Lifetimes; Silent-Refresh)
  - User Flows vs. Custom Policies in Entra External ID (SUSI/SSPR/Profile Edit)
  - Claims-Mapping (benötigte Claims wie `sub`/`oid`, `email`, `name`, benutzerdefiniert)
  - Redirect-URIs (Login/Callback/Post-Logout) und Branding/Custom Domain
- Owner: [TBD], Due: [TBD]

## R-02 Login-Fehlschläge & Account-Sperren

- Context: Edge Case „fehlgeschlagener Login“
- Decision: [PENDING]
- Rationale: [PENDING]
- Alternatives considered:
  1. Exponentielles Backoff + Captcha nach n Fehlversuchen
  1. Temporärer Lockout (z. B. 15 Min nach 5 Fehlversuchen)
  1. Nur Rate-Limiting auf IP/User, kein expliziter Lockout
- Impacts: Security (Brute-Force-Schutz), Support (Entsperrprozesse)
- Open questions: Captcha notwendig? Kommunikation bei Sperre?
- Owner: [TBD], Due: [TBD]

## R-03 Buchung & Bezahlung

- Context: Öffentliche Buchung; Unklar, ob Zahlung integriert werden soll
- Decision: [PENDING]
- Rationale: [PENDING]
- Alternatives considered:
  1. Buchung ohne Online-Zahlung (manuelle Abrechnung)
  1. Zahlung via Provider (z. B. Stripe) inkl. Rechnungsstellung
  1. Anzahlung vs. Vollzahlung
- Impacts: Rechtliche Anforderungen (Rechnungen), Rückerstattungen, UX, Kosten/Fees
- Open questions: Zahlungsarten, Währung, Steuer (USt), Rechnungs-Layout
- Owner: [TBD], Due: [TBD]

## R-04 Benachrichtigung

- Context: FR-007 fordert Bestätigung/Benachrichtigung
- Decision: [PENDING]
- Rationale: [PENDING]
- Alternatives considered:
  1. E-Mail (Provider: Resend/SES/SendGrid)
  1. Zusätzlich Webhooks/Slack (intern)
- Impacts: Zustellbarkeit, Template-/Mehrsprachigkeit, Abmeldelogik (Transaktional vs. Marketing)
- Open questions: Absenderdomain, DKIM/SPF, Sprache(n), rechtliche Pflichtangaben
- Owner: [TBD], Due: [TBD]

## R-05 Video-Bereitstellung & Zugriff

- Context: Kursunterlagen enthalten Videos; Schutz vor unbefugtem Zugriff/Sharing
- Decision: [PENDING]
- Rationale: [PENDING]
- Alternatives considered:
  1. Streaming-only aus geschütztem Storage/CDN, signierte URLs
  1. Externer Video-Host (Vimeo/Wistia) mit Embed + Access Control
  1. Download erlauben (mit Wasserzeichen) – Risikoabwägung
- Impacts: Bandbreite/Kosten, UX (Pufferung), Rechte/DRM, Implementierungsaufwand
- Open questions: Max. Dateigrößen, Formate, Bitraten/Adaptive Streaming
- Owner: [TBD], Due: [TBD]

## R-06 Zugriffsdauer nach Kursende

- Context: Edge Case „Wie lange Zugriff?“
- Decision: [PENDING]
- Rationale: [PENDING]
- Alternatives considered:
  1. Zeitlich begrenzt (z. B. 3/6/12 Monate)
  1. Unbegrenzt, solange Account aktiv
  1. Staffelung je Kurstyp
- Impacts: Kundenbindung, Supportanfragen, Daten-/Speicherkosten
- Open questions: Verlängerungsoption? Kulanzregeln?
- Owner: [TBD], Due: [TBD]

## R-07 Stornobedingungen & Warteliste

- Context: Edge Cases „Storno“ und „ausgebucht/Warteliste“
- Decision: [PENDING]
- Rationale: [PENDING]
- Alternatives considered:
  1. Storno bis X Tage kostenlos, danach Gebühr/Y-%
  1. Warteliste mit Auto-Nachrücklogik
  1. Manuelle Freigabe durch Admin
- Impacts: Rechtliches (AGB), Customer Experience, Abrechnung/Refund-Prozesse
- Open questions: Fristen, Gebührenstaffeln, Kommunikation bei Nachrücken
- Owner: [TBD], Due: [TBD]

## R-08 Datenschutz/DSGVO (Aufbewahrung & Löschung)

- Context: FR-010 verlangt rechtskonformen Umgang mit personenbezogenen Daten
- Decision: [PENDING]
- Rationale: [PENDING]
- Alternatives considered:
  1. Feste Retention-Perioden je Datentyp
  1. Event-basierte Löschung (z. B. X Monate nach Kursende)
  1. Pseudonymisierung/Anonymisierung historischer Datensätze
- Impacts: Compliance, Auditierbarkeit, technische Komplexität
- Open questions: Betroffenenrechte-Prozess (Auskunft/Löschung), Backups & Löschung
- Owner: [TBD], Due: [TBD]

## Annahmen (temporär – bis Entscheidung)

- Auth voraussichtlich E-Mail+Passwort mit optionalem Magic Link für Einfachheit
- Buchung zunächst ohne integrierte Zahlung; Rechnung/Bezahlung manuell (Pilotphase)
- Videos Streaming-only mit signierten, kurzlebigen URLs; Download deaktiviert
- Zugriff auf Unterlagen 6 Monate nach Kursende
- Storno bis 14 Tage vor Start kostenfrei, danach 30 % Gebühr; Warteliste mit Auto-Nachrücken
- E-Mail-Provider: Resend (Transaktionsmails)
- Datenschutz: Retention 24 Monate nach Kursende; regelmäßige Löschläufe

Diese Annahmen sind Platzhalter und müssen in „Decision“ überführt werden.

## Risiken & Abhängigkeiten

- Rechtliche Prüfung (AGB, Widerruf, DSGVO)
- Kosten & Komplexität von Video-Streaming/CDN
- Zustellbarkeit von E-Mails (Domain-Setup, Reputation)
- Skalierung von Buchungen (Spitzenlasten bei Launch/Promo)

## Nächste Schritte

1. Abstimmung mit Business/Legal zu Storno, Warteliste, DSGVO
1. Technische Evaluierung Auth-Optionen inkl. UX-Prototyp
1. Proof-of-Concept Video-Streaming (signierte URLs, Player, Bandbreite)
1. Auswahl E-Mail-Provider, DNS-Setup (SPF/DKIM)
1. Entscheidung Zahlungsintegration (jetzt/später) und Anforderungen an Rechnungen

## Abnahme-Kriterien dieses Research-Dokuments

- [ ] Alle Punkte R-01 … R-08 enthalten eine dokumentierte „Decision“
- [ ] Offene Fragen sind beantwortet oder als bewusste Risiken dokumentiert
- [ ] Auswirkungen auf Datenmodell/Contracts sind identifiziert
- [ ] Annahmen sind entfernt oder als Entscheidung bestätigt

---

Sobald „Decision“ pro Abschnitt gesetzt ist, kann Phase 1 (Design & Contracts) gestartet werden.
