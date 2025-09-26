# Quickstart: Coach Courses – Microsoft Entra External ID

Ziel: Projekt lokal starten und den Auth-Flow mit Microsoft Entra External ID (CIAM) testen.

Dieser Quickstart fokussiert sich auf die für Auth notwendigen Schritte und Umgebungsvariablen. Er ergänzt die allgemeine Projekt-Onboarding-Doku.

## Voraussetzungen

- Nuxt 3 / Node.js LTS installiert
- Entra External ID-Mandant (CIAM) mit App-Registrierung
- Zugriff auf Redirect-URIs-Konfiguration und User Flows (SUSI/SSPR)

## .env – notwendige Variablen

Folgende Variablen werden für OIDC Code Flow mit PKCE benötigt. Namen sind Vorschläge; das konkrete Nuxt-Runtime-Mapping erfolgt später.

- ENTRA_TENANT_ID: Mandanten-ID (GUID)
- ENTRA_TENANT_DOMAIN: Tenant/Domain, z. B. example.onmicrosoft.com oder Custom Domain
- ENTRA_CLIENT_ID: App-Registrierung (Application/Client ID)
- ENTRA_USER_FLOW: Name des User Flow/Policy, z. B. B2C_1_susi (Entra External ID unterstützt weiterhin B2C-kompatible User Flows)
- ENTRA_ISSUER: Issuer-URL inkl. Policy/User Flow
- ENTRA_AUTHORITY: Authority-URL (OpenID Authority, enthält Tenant/Policy)
- ENTRA_REDIRECT_URI: <https://localhost:3000/auth/callback>
- ENTRA_POST_LOGOUT_REDIRECT_URI: <https://localhost:3000/>
- ENTRA_SCOPES: openid profile email (weitere bei Bedarf)

Beispiel (.env.local):

```bash
ENTRA_TENANT_ID=00000000-0000-0000-0000-000000000000
ENTRA_TENANT_DOMAIN=contoso.onmicrosoft.com
ENTRA_CLIENT_ID=11111111-1111-1111-1111-111111111111
ENTRA_USER_FLOW=B2C_1_susi
ENTRA_ISSUER=https://contoso.ciamlogin.com/contoso.onmicrosoft.com/v2.0/.well-known/openid-configuration?p=B2C_1_susi
ENTRA_AUTHORITY=https://contoso.ciamlogin.com/contoso.onmicrosoft.com/B2C_1_susi/v2.0
ENTRA_REDIRECT_URI=http://localhost:3000/auth/callback
ENTRA_POST_LOGOUT_REDIRECT_URI=http://localhost:3000/
ENTRA_SCOPES=openid profile email
```

Hinweise:

- Domänen/URLs variieren je nach Region/Custom Domain. Nutzen Sie die in Entra External ID angezeigten Endpunkte.
- Für lokale Entwicklung <http://localhost> ist i. d. R. ausreichend; in Produktion sind HTTPS-URLs zwingend.

## Entra External ID – Setup (Kurzfassung)

1. App-Registrierung erstellen (Web)
   - Redirect-URI: <http://localhost:3000/auth/callback>
   - Logout-Redirect: <http://localhost:3000/>
   - Scopes: openid, profile, email
1. User Flow(s) anlegen/prüfen
   - Sign-up/Sign-in (SUSI), Password Reset (SSPR), ggf. Profile Edit
   - Branding/Sprachen konfigurieren
1. Endpunkte ermitteln
   - Authority- und Issuer-URL inklusive Policy/User Flow notieren
   - OpenID-Konfiguration prüfen (.well-known/openid-configuration)
1. Test-User erstellen
   - Registrieren über SUSI oder manuellen Nutzer anlegen

## Projekt lokal starten (in späteren Implementierungsschritten)

- Abhängigkeiten installieren
- Nuxt-Dev-Server starten
- /auth/login aufrufen → Redirect zum SUSI-Flow → nach erfolgreichem Login Redirect zu /auth/callback

## Security-Hinweise

- PKCE (S256) verwenden, state/nonce prüfen
- Serverseitige Token-Validierung (JWKS, iss/aud, Ablauf, Clock Skew)
- Session-Cookies sicher setzen (HttpOnly, Secure, SameSite)
- Nur minimal notwendige personenbezogene Daten speichern (Mapping `sub/oid` → interner User)

## Troubleshooting

- 400/401 nach Callback: Authority/Issuer/Policy prüfen, Redirect-URI exakt abgleichen
- Login-Loop: Session-/Cookie-Konfiguration oder Token-Lifetime prüfen
- Claims fehlen: User Flow-Claims konfigurieren oder Custom Claims definieren

## UI-Komponentenquelle: lokales vuetify-material-dashboard

Vorgabe: Alle Frontend-Elemente sind mit Komponenten aus dem lokalen Dashboard-Repo zu erstellen. Empfehlung: Das Dashboard-Repo als Sibling neben `abb` platzieren (z. B. `../vuetify-material-dashboard`).

Empfohlene Einbindung (eine der Optionen):

1. Monorepo/Workspace (empfohlen)
   - Falls pnpm/Workspaces genutzt werden: Dashboard-Repo als Workspace hinzufügen und via Alias importieren (z. B. `@dashboard/*`).
   - Vorteil: Einheitliche Versionierung, kein manuelles Link-Management.
1. npm/pnpm link
   - Im Dashboard-Repo `npm link` bzw. `pnpm link --global` ausführen.
   - Im ABB-Repo das Paket verlinken (z. B. `npm link <paketname>` / `pnpm link --global <paketname>`).
1. Pfad-Alias (portabel)
   - In `nuxt.config.ts` einen Alias auf den Sibling-Pfad definieren (via `path.resolve(__dirname, '../vuetify-material-dashboard/src')`).
   - In `tsconfig.json` Pfad-Mapping ergänzen: `"@dashboard/*": ["../vuetify-material-dashboard/src/*"]`.
   - In `nuxt.config.ts` sicherstellen: `vite.server.fs.allow` enthält `path.resolve(__dirname, '../vuetify-material-dashboard')`.

Hinweise

- MD3-Konformität beibehalten; keine Ad-hoc-CSS einsetzen.
- SSR: Darauf achten, dass externe Pfade bei Vite/Nuxt als „optimizable/external“ korrekt behandelt werden (noExternal/optimizeDeps anpassen, falls benötigt).
- Nur Vuetify- und Dashboard-Komponenten verwenden; eigene UI nur als dünne Wrapper mit klaren Props/JSDoc.
