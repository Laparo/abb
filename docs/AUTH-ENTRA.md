# Microsoft Entra External ID – Detaillierte Konfigurationsanleitung

Diese Anleitung zeigt Schritt für Schritt, wie Sie Microsoft Entra External ID im Azure Portal konfigurieren, um die Authentifizierung für Ihre Nuxt.js-Anwendung zu aktivieren.

## 📋 Übersicht

Microsoft Entra External ID (ehemals Azure AD B2C) ermöglicht die Verwaltung von Benutzeridentitäten für kundenorientierte Anwendungen. Diese Anleitung konfiguriert OIDC PKCE-Authentifizierung.

## ⚡ Schnellauftrag: User Flow für Tenant b9c21f48-ea16-41a0-946a-41441585616b anlegen

Dieser Abschnitt beschreibt die minimal notwendigen Schritte, um in eurem Microsoft Entra External ID Tenant (GUID: `b9c21f48-ea16-41a0-946a-41441585616b`) einen neuen Sign-up/Sign-in User Flow zu erstellen und mit der App zu verbinden. Wir nehmen an, dass ein kombinierter „Sign up and sign in“-Flow gewünscht ist. Falls strikt „Sign-up only“ benötigt wird, siehe Hinweis in Schritt 3.

1. Im richtigen Tenant arbeiten

   - Öffne das Microsoft Entra Admin Center: [entra.microsoft.com](https://entra.microsoft.com)
   - Klicke oben rechts auf „Settings“ → „Directories + subscriptions“ und wechsle in den External-ID Tenant mit der ID `b9c21f48-ea16-41a0-946a-41441585616b`.
   - Notiere den Tenant Name und die Standarddomain (z. B. `contoso.onmicrosoft.com`). Der Teil vor `.onmicrosoft.com` ist dein `TENANT_NAME`.

1. App-Registrierung prüfen bzw. erstellen

   - Entra ID → External Identities → App registrations → ggf. „New registration“.
   - Name: „ABB Course Booking App“ (oder vorhandene auswählen)
   - Redirect URI (Web): `http://localhost:3000/api/auth/callback/microsoft-entra-external`
   - Nach Anlage unter „Authentication“ sicherstellen: „ID tokens“ und „Access tokens“ für Web aktiviert; speichern.

1. Neuen User Flow anlegen

   - Entra ID → External Identities → User flows → „New user flow“
   - Typ: „Sign up and sign in“ (empfohlen). Hinweis: Falls wirklich ein reiner „Sign-up“-Flow benötigt wird, verwende den passenden Self-service Sign-up User Flow, siehe Microsoft-Doku unten.
   - Name: `B2C_1_signupsignin` (empfohlenes, kurzes Namensschema)
   - Identity providers: mindestens „Email with password“ oder „Email one-time passcode“ auswählen
   - User attributes: „Email address“, „Display name“ sammeln; als Claims: „Email“, „Display Name“, „User’s object ID“ zurückgeben
   - „Create“ klicken

1. Anwendung dem User Flow zuordnen

   - Öffne den soeben erstellten Flow → „Applications“ → „Add application“
   - Wähle deine App-Registrierung aus und bestätige mit „Select“

1. Umgebungsvariablen in .env setzen/aktualisieren (Single-App)

   Füge bzw. aktualisiere folgende Einträge:

```bash
# ==== Auth.js / nuxt-auth ====
NUXT_AUTH_ORIGIN="http://localhost:3000"
NUXT_AUTH_SECRET="<sicherer-random-32+Zeichen>"

# ==== Microsoft Entra External ID ====
NUXT_ENTRA_TENANT_ID="b9c21f48-ea16-41a0-946a-41441585616b"
# Tenant Name (vor .onmicrosoft.com / .ciamlogin.com)
NUXT_ENTRA_TENANT_NAME="laparo"
# Vollständige Tenant Domain (empfohlen – ohne https)
NUXT_ENTRA_TENANT_DOMAIN="laparo.onmicrosoft.com"

# Kombinierter SignUp/SignIn Flow – vollständiger Name inkl. Präfix!
NUXT_ENTRA_POLICY_SIGNIN="B2C_1_signupsignin"
# (Veraltet) Separater Signup Flow – nur setzen falls separat genutzt
# NUXT_ENTRA_POLICY_SIGNUP="B2C_1_signup"  # optional, nicht nötig bei kombiniertem Flow

# Login Domain bleibt in External ID Tenants ciamlogin.com
NUXT_ENTRA_LOGIN_DOMAIN="ciamlogin.com"

# App Registration
NUXT_ENTRA_CLIENT_ID="c33a9594-4b28-4ef6-93b2-2c00415e3787"
NUXT_ENTRA_CLIENT_SECRET="aeea2129-70a9-4619-8750-d8e7f31049c1" # Confidential Web-App Szenario
```

Hinweise:

- Den `TENANT_NAME` findest du unter „Custom domain names“ (z. B. `contoso.onmicrosoft.com` → `contoso`).
- Unsere Implementierung bevorzugt die Pfad-Variante der Well-known-URL mit Tenant-Domain. Falls die Domain nicht gesetzt ist, wird ein Fallback mit `?p=`-Parameter genutzt.
- Der ursprüngliche Gebrauch von Kurzformen (`signin`, `signup`) wurde vereinheitlicht → bitte immer den vollständigen Policy Namen inklusive Präfix `B2C_1_` verwenden.

1. Funktionstest durchführen

   - Dev-Server starten: `npm run dev`
   - Provider prüfen: <http://localhost:3000/api/auth/providers> → der Provider „Microsoft Entra External ID“ muss angezeigt werden
   - Sign-in testen: <http://localhost:3000/auth/signin> → Button „Microsoft Entra External ID“
   - Optional: Well-known OIDC manuell prüfen (ersetze Platzhalter):
     - `https://<TENANT_NAME>.ciamlogin.com/<TENANT_NAME>.onmicrosoft.com/B2C_1_signupsignin/v2.0/.well-known/openid-configuration`
     - Alternativ (mit Tenant ID): `https://<TENANT_NAME>.ciamlogin.com/b9c21f48-ea16-41a0-946a-41441585616b/v2.0/.well-known/openid-configuration?p=B2C_1_signupsignin`

1. Produktion vorbereiten

    - In der App-Registrierung zusätzlich die produktive Redirect URI hinterlegen: `https://<prod-domain>/api/auth/callback/microsoft-entra-external`
    - In der Produktionsumgebung setzen:
       - `NUXT_AUTH_ORIGIN="https://<prod-domain>"`
       - eigener `NUXT_AUTH_SECRET`

Referenzen (Microsoft Learn):

- [Create a sign-up and sign-in user flow (External tenants)](https://learn.microsoft.com/entra/external-id/customers/how-to-user-flow-sign-up-sign-in-customers)
- [Add your application to the user flow](https://learn.microsoft.com/entra/external-id/customers/how-to-user-flow-add-application)
- [Self-service sign-up user flow (B2B Kollaboration, „Sign-up only“)](https://learn.microsoft.com/entra/external-id/self-service-sign-up-user-flow)

## 🚀 Schritt 1: Azure Portal Zugang

1. **Öffnen Sie das Azure Portal**: [https://portal.azure.com](https://portal.azure.com)
1. **Melden Sie sich an** mit Ihrem Azure-Konto
1. **Suchen Sie** nach "Microsoft Entra External ID" in der Suchleiste

## 🏢 Schritt 2: External ID Tenant erstellen

### 2.1 Neuen Tenant erstellen

1. **Navigieren Sie** zu **Microsoft Entra External ID**
1. **Klicken Sie** auf **"Create a tenant"** oder **"Tenant erstellen"**
1. **Wählen Sie** **"External ID"** als Tenant-Typ
1. **Geben Sie ein**:
   - **Organization name**: z.B. "Mein Unternehmen"
   - **Initial domain name**: z.B. "meinunternehmen" (wird zu `meinunternehmen.ciamlogin.com`)
   - **Country/Region**: Ihr Land
1. **Klicken Sie** **"Review + create"** → **"Create"**

### 2.2 Tenant-Informationen notieren

**Wichtig**: Notieren Sie sich diese Werte für später:

- **Tenant Name**: `meinunternehmen` (der Teil vor `.ciamlogin.com`)
- **Tenant ID**: GUID (zu finden unter "Tenant overview" → "Tenant ID")
- **Domain**: `meinunternehmen.ciamlogin.com`

## 👥 Schritt 3: User Flow (Anmeldeprozess) konfigurieren

### 3.1 User Flow erstellen

1. **Im External ID Tenant** → **User flows**
1. **Klicken Sie** **"+ New user flow"**
1. **Wählen Sie**:
   - **Flow type**: "Sign up and sign in"
   - **Version**: "Recommended"
1. **Geben Sie einen Namen ein**: `B2C_1_signupsignin`
   - ⚠️ **Wichtig**: Der Präfix "B2C_1_" wird automatisch hinzugefügt

### 3.2 User Flow konfigurieren

1. **Identity providers**:
   - ✅ **Email signup** aktivieren
   - Optional: Weitere Provider (Google, Facebook, etc.)

1. **User attributes and claims**:
   - **Collect attributes**: Email address, Display name
   - **Return claims**: Email addresses, Display name, User's object ID

1. **Klicken Sie** **"Create"**

### 3.3 User Flow testen (optional)

1. **Wählen Sie** den erstellten User Flow
1. **Klicken Sie** **"Run user flow"**
1. **Testen Sie** die Anmeldung in der Vorschau

## 📱 Schritt 4: App-Registrierung erstellen

### 4.1 Neue App registrieren

1. **Im External ID Tenant** → **App registrations**
1. **Klicken Sie** **"+ New registration"**
1. **Geben Sie ein**:
   - **Name**: "ABB Course Booking App"
   - **Supported account types**: "Accounts in this organizational directory only"
   - **Redirect URI**:
     - **Platform**: Web
     - **URI**: `http://localhost:3000/api/auth/callback/microsoft-entra-external`

1. **Klicken Sie** **"Register"**

### 4.2 App-Konfiguration anpassen

1. **Nach der Erstellung** → **Authentication**
1. **Unter "Web"** → **"Advanced settings"**:
   - ✅ **Access tokens** aktivieren
   - ✅ **ID tokens** aktivieren
1. **Klicken Sie** **"Save"**

### 4.3 Client Secret erstellen

1. **Gehen Sie zu** **"Certificates & secrets"**
1. **Klicken Sie** **"+ New client secret"**
1. **Geben Sie ein**:
   - **Description**: "Nuxt.js App Secret"
   - **Expires**: 24 months
1. **Klicken Sie** **"Add"**
1. **⚠️ WICHTIG**: Kopieren Sie den **Secret Value** sofort (wird nur einmal angezeigt)

### 4.4 App-Informationen notieren

**Notieren Sie sich** von der **Overview**-Seite:

- **Application (client) ID**: z.B. `12345678-1234-1234-1234-123456789abc`
- **Client Secret**: Der gerade erstellte Secret Value

## 🔧 Schritt 5: Produktions-Redirect URL hinzufügen (später)

**Für Produktionsdeployment** müssen Sie später weitere Redirect URLs hinzufügen:

1. **Authentication** → **Redirect URIs**
1. **Hinzufügen**:
   - `https://ihre-domain.com/api/auth/callback/microsoft-entra-external`

## 📝 Schritt 6: Umgebungsvariablen konfigurieren

**Öffnen Sie** Ihre `.env`-Datei und **tragen Sie die gesammelten Werte ein**:

```bash
# ==== Auth.js / nuxt-auth ====
NUXT_AUTH_ORIGIN="http://localhost:3000"
NUXT_AUTH_SECRET="ihr-geheimer-random-string-min-32-zeichen"

# ==== Microsoft Entra External ID ====
# Tenant Name (vor .ciamlogin.com)
NUXT_ENTRA_TENANT_NAME="meinunternehmen"

# Vollständige Tenant Domain (optional aber empfohlen)
NUXT_ENTRA_TENANT_DOMAIN="meinunternehmen.ciamlogin.com"

# Tenant ID (GUID aus Azure Portal)
NUXT_ENTRA_TENANT_ID="12345678-1234-1234-1234-123456789abc"

# User Flow Name (mit B2C_1_ Präfix)
NUXT_ENTRA_POLICY_SIGNIN="B2C_1_signupsignin"

# Login Domain (für External ID: ciamlogin.com)
NUXT_ENTRA_LOGIN_DOMAIN="ciamlogin.com"

# App Registration Werte
NUXT_ENTRA_CLIENT_ID="ihre-app-client-id"
NUXT_ENTRA_CLIENT_SECRET="ihr-client-secret"
```

### 🔐 Auth Secret generieren

**Für NUXT_AUTH_SECRET** verwenden Sie einen sicheren, zufälligen String:

```bash
# Linux/macOS:
openssl rand -base64 32

# Oder online:
# https://generate-secret.vercel.app/32
```

## ✅ Schritt 7: Anwendung testen

### 7.1 Development Server starten

```bash
npm run dev
```

### 7.2 Authentifizierung testen

1. **Öffnen Sie**: [http://localhost:3000](http://localhost:3000)
1. **Klicken Sie** auf "Anmelden" oder navigieren Sie zu `/auth/signin`
1. **Testen Sie** die Anmeldung mit dem Microsoft Entra Flow

### 7.3 Erfolgreiche Konfiguration prüfen

**Keine Fehlermeldungen** in der Konsole wie:

- ❌ `Missing NUXT_ENTRA_TENANT_NAME or NUXT_ENTRA_TENANT_ID`
- ❌ `expected 200 OK, got: 404`

## 🔍 Troubleshooting

### Häufige Probleme und Lösungen

#### 1. `Missing NUXT_ENTRA_TENANT_NAME or NUXT_ENTRA_TENANT_ID`

**Problem**: Umgebungsvariablen nicht korrekt gesetzt

**Lösung**:

- Prüfen Sie die `.env`-Datei
- Starten Sie den Dev-Server neu nach Änderungen

#### 2. `expected 200 OK, got: 404`

**Problem**: Well-Known OpenID Connect URL ist falsch

**Lösung**:

- Prüfen Sie `NUXT_ENTRA_TENANT_NAME`
- Prüfen Sie `NUXT_ENTRA_POLICY_SIGNIN` (mit B2C_1_ Präfix)
- Prüfen Sie `NUXT_ENTRA_LOGIN_DOMAIN` (sollte `ciamlogin.com` sein)

#### 3. `AADSTS50011: Redirect URI mismatch`

**Problem**: Redirect URI in Azure stimmt nicht mit der Anfrage überein

**Lösung**:

- Prüfen Sie die exakte URL in Azure App Registration
- Format: `http://localhost:3000/api/auth/callback/microsoft-entra-external`

#### 4. `outgoing request timed out`

**Problem**: Netzwerkproblem oder falsche Domain

**Lösung**:

- Prüfen Sie Internetverbindung
- Prüfen Sie `NUXT_ENTRA_LOGIN_DOMAIN`

### Debug-URLs testen

**Prüfen Sie** diese URLs manuell im Browser:

```bash
# Provider-Konfiguration
http://localhost:3000/api/auth/providers

# Well-Known OpenID Connect
https://TENANT_NAME.ciamlogin.com/TENANT_DOMAIN/POLICY/v2.0/.well-known/openid-configuration
```

## 🚀 Produktionsdeployment

### Architektur (aktuell Single-App)

Seit 2025-09 Konsolidierung: Keine separate Backend-App mehr. Nuxt 3 (inkl. Nitro API Routen unter `server/api/*`) wird statisch + Edge Functions via Azure Static Web Apps ausgeliefert.

Alt (Backend App Service) = entfernt. Dokumentations-Abschnitte dazu wurden ersetzt. Falls erneut eine externe API benötigt wird, nutze `NUXT_PUBLIC_API_BASE` und stelle CORS sicher.

### Produktions-Umgebungsvariablen (Azure Static Web Apps → Konfiguration / GitHub Action Environments)

```bash
# Origin der produktiven Anwendung (SWA Domain oder Custom Domain)
NUXT_AUTH_ORIGIN="https://<prod-domain>"

# Microsoft Entra External ID
NUXT_ENTRA_TENANT_NAME="meinunternehmen"
NUXT_ENTRA_TENANT_ID="12345678-1234-1234-1234-123456789abc"
NUXT_ENTRA_CLIENT_ID="ihre-app-client-id"
NUXT_ENTRA_CLIENT_SECRET="ihr-client-secret"  # Nur wenn confidential client konfiguriert
NUXT_ENTRA_POLICY_SIGNIN="B2C_1_signupsignin"
NUXT_ENTRA_TENANT_DOMAIN="meinunternehmen.onmicrosoft.com"
NUXT_ENTRA_LOGIN_DOMAIN="ciamlogin.com"

# Auth Secret (muss einzigartig & sicher sein)
NUXT_AUTH_SECRET="unterschiedlicher-produktions-secret"

# Optional – Externes API (falls später ausgelagert)
# NUXT_PUBLIC_API_BASE="https://api.example.com"
```

### Redirect URIs (Produktion)

Nur die statische App-Domain muss registriert sein:

- `https://<prod-domain>/api/auth/callback/microsoft-entra-external`

Lokale Entwicklung bleibt: `http://localhost:3000/api/auth/callback/microsoft-entra-external`

### Secret Handling Hinweise

- Secrets immer über SWA Environment / GitHub Actions Environments setzen – nicht in Git committen.
- `NUXT_ENTRA_CLIENT_SECRET` nur nötig, wenn App Registration als „Web“ (confidential) mit Secret arbeitet. Für reine Public Client PKCE Szenarien weglassen.

### Optionaler External-API-Modus (zukünftig)

Falls später wieder eine ausgelagerte API eingeführt wird:

1. `NUXT_PUBLIC_API_BASE` setzen (ohne trailing `/`).
1. API muss CORS erlauben: `Origin: https://<prod-domain>` + Credentials falls nötig.
1. Auth Flows unverändert – Callback bleibt bei der Nuxt App.

Beispiel Health Check:

```bash
curl -I -H "Origin: https://<prod-domain>" https://api.example.com/api/health
```

### Migrationshinweis

Die frühere Dokumentation mit getrennten Blöcken „Backend (.env)“ und „Frontend (.env)“ ist obsolet. Historische Referenzen (z.B. `abb-backend.azurewebsites.net`) bitte nicht mehr verwenden.

## 📚 Weitere Ressourcen

- [Microsoft Entra External ID Dokumentation](https://docs.microsoft.com/en-us/azure/active-directory-b2c/)
- [Nuxt Auth Dokumentation](https://sidebase.io/nuxt-auth)
- [NextAuth.js Azure AD B2C Provider](https://next-auth.js.org/providers/azure-ad-b2c)

---

**🎉 Geschafft!** Ihre Microsoft Entra External ID Authentifizierung ist jetzt konfiguriert und einsatzbereit.
