# 🚀 Azure Static Web Apps Deployment Guide

## Deployment-Status

✅ **Build erfolgreich**: Die App generiert korrekt statische Dateien  
✅ **Lokaler Test**: App funktioniert einwandfrei lokal  
⚠️ **Azure Deployment**: Benötigt manuellen Token für GitHub Actions  

## Manuelle Deployment-Optionen

### Option 1: GitHub Actions mit manuellem Token

1. **Öffnen Sie GitHub Actions**: <https://github.com/Laparo/abb/actions>
2. **Wählen Sie "Manual Deploy to Azure SWA"**
3. **Klicken Sie "Run workflow"**
4. **Geben Sie den Azure Static Web Apps Token ein**

### Option 2: Azure Static Web Apps CLI (Lokal)

```bash
# 1. Build generieren
npm run generate

# 2. Azure SWA CLI verwenden (falls Token verfügbar)
npx @azure/static-web-apps-cli deploy .output/public --deployment-token YOUR_DEPLOYMENT_TOKEN
```

### Option 3: Azure Portal Upload

1. **Öffnen Sie das Azure Portal**
2. **Navigieren zu Ihrer Static Web App: ambitious-meadow-017482503**
3. **Deployment Center → GitHub Actions**
4. **Prüfen Sie die Workflow-Konfiguration**

## Deployment-Token finden

Der Azure Static Web Apps Deployment Token ist verfügbar in:

1. **Azure Portal** → Static Web Apps → ambitious-meadow-017482503
2. **Overview** → "Manage deployment token"
3. **Kopieren Sie den Token** für GitHub Actions

## App-URLs nach Deployment

- **Staging URL**: <https://ambitious-meadow-017482503.1.azurestaticapps.net/>
- **Custom Domain** (falls konfiguriert): Ihre eigene Domain

## Lokale Validierung

Bevor Sie deployen, validieren Sie das Build lokal:

1. Build für Staging erstellen:

```bash
NODE_ENV=staging npm run generate
```

1. Lokaler Test:
1. Python Server starten:
1. App testen:

```bash
cd .output/public && python3 -m http.server 8001
```

Danach öffnen Sie `http://localhost:8001` um die App zu testen.

## Troubleshooting

### Häufige Probleme

1. **404 Fehler**: `staticwebapp.config.json` Routing-Problem
   - ✅ **Behoben**: Korrekte Navigation Fallback konfiguriert

2. **Build-Fehler**: Missing Dependencies
   - ✅ **Behoben**: Alle Dependencies installiert

3. **GitHub Actions Fehler**: Missing Secrets
   - ✅ **Lösung**: Manueller Workflow erstellt

## Nächste Schritte

1. **Token besorgen** aus Azure Portal
2. **Manuellen Workflow starten** in GitHub Actions
3. **App testen** auf der Azure-URL
4. **Automatische Deployments konfigurieren** (optional)

## Mission Impact 🌟

- **Zuverlässiges Staging**: Sichere Test-Umgebung für Features
- **Community Testing**: Benutzer können neue Features testen
- **Entwicklungszyklen**: Schnellere Iteration und Feedback
- **Qualitätssicherung**: Validierung vor Production-Deployment

---

*Dieser Deployment-Guide unterstützt unsere Mission, eine zuverlässige Plattform für weibliche Stärkung bereitzustellen.*
