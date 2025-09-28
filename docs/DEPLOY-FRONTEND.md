# Deployment Guide - Azure Static Web Apps

Die Anwendung wurde konsolidiert: Es existiert nur noch eine Nuxt 3 Codebasis (Root). Früher getrennte Verzeichnisse `frontend/` und `backend/` wurden entfernt. Dieses Dokument beschreibt das Deployment der statisch generierten (SWA) Version.

## 🏗️ **Prerequisites**

1. **Azure Account** with active subscription
1. **Azure CLI** installed: [Install Azure CLI](https://learn.microsoft.com/cli/azure/install-azure-cli)
1. **SWA CLI** installed: `npm install -g @azure/static-web-apps-cli` (optional, nur für lokale Deploys notwendig)
1. **Frontend built** for production

## 🚀 **Method 1: Using Azure CLI (Recommended)**

### Step 1: Login to Azure

````bash
az login

- Öffne Developer Tools (Netzwerk)
- Prüfe relative Requests oder korrekten `NUXT_PUBLIC_API_BASE`
- CORS Response Header kontrollieren

1. **Test Authentication** (falls aktiviert)
    - Microsoft Entra Login ausführen
    - Prüfen, ob Redirect-URL passt
```bash
az staticwebapp create \
    --name abb-frontend \
    --resource-group abb-resources \
    --source https://github.com/YOUR_USERNAME/abb \
    --location "West Europe" \
    --branch main \
    --app-location "." \
    --output-location ".output/public" \
    --skip-app-build true


Hinweis: `--skip-app-build true`, weil der Build durch GitHub Actions erledigt wird. Lokal kann man auch zuerst `npm run build`/`npm run generate` ausführen und dann ohne Skip deployen.

### Step 4: (Optional) API Basis-URL setzen

```bash
# Set production API base URL and feature flags
az staticwebapp appsettings set \
    --name abb-frontend \
    --resource-group abb-resources \
    --setting-names NUXT_PUBLIC_API_BASE="" NUXT_ENABLE_AUTH="false"

# Set frontend origin
az staticwebapp appsettings set \
    --name abb-frontend \
    --resource-group abb-resources \
    --setting-names NUXT_PUBLIC_ORIGIN="https://abb-frontend.azurestaticapps.net"
````

## 🛠️ **Method 2: Using SWA CLI**

### Step 1: Install SWA CLI

```bash
npm install -g @azure/static-web-apps-cli
```

### Step 2: Build (falls lokal gewünscht)

```bash
npm ci
npm run build
```

### Step 3: Deploy

```bash
swa deploy .output/public \
    --deployment-token YOUR_DEPLOYMENT_TOKEN \
    --app-name abb-frontend
```

## 🔧 **Method 3: Using GitHub Actions (Automated)**

Das Projekt enthält ein GitHub-Actions-Workflow in `.github/workflows/azure-static-web-apps.yml`.

### Step 1: Set Repository Secrets

In deinem GitHub-Repository unter Settings → Secrets and variables → Actions folgende Secrets/Variablen setzen:

```text
Secrets
———
AZURE_STATIC_WEB_APPS_API_TOKEN_PROD = [Deployment-Token aus Azure Portal]

Variables (optional)
———
NUXT_PUBLIC_API_BASE = (leer oder externer API Origin)
NUXT_PUBLIC_ORIGIN = https://abb-frontend.azurestaticapps.net
```

### Step 2: Push to Main Branch

```bash
git add .
git commit -m "Deploy frontend to Azure Static Web Apps"
git push origin main
```

Der Workflow baut und deployed automatisch bei jedem Push auf `main`. Alternativ kannst du ihn manuell über „Run workflow“ auslösen und einen temporären Deployment-Token als Input `swa_token` übergeben (falls kein Secret gesetzt ist).

## 🌐 **Post-Deployment Configuration**

### 1. Update Azure Entra Redirect URLs

Add the production frontend URL to your Azure Entra app registration:

```text
https://abb-frontend.azurestaticapps.net/auth/callback
```

### 2. (Legacy) Backend CORS

Frühere getrennte Backend-Instanz entfällt. CORS-Konfiguration liegt – falls wieder eingeführt – in `nuxt.config.ts` unter `nitro`.

### 3. Custom Domain (Optional)

Configure a custom domain in Azure Portal:

1. Go to your Static Web App
1. Settings → Custom domains
1. Add your domain and configure DNS

## 🔍 **Verification Steps**

1. **Check Deployment Status**

```bash
az staticwebapp show --name abb-frontend --resource-group abb-resources
```

1. **Visit Your Site**: <https://abb-frontend.azurestaticapps.net>

1. **Test API Connectivity**

```bash
# Falls externe API gesetzt ist, Beispiel-Request (anpassen)
curl -I https://example-api.yourdomain.tld/api/health
```

- Öffne Developer Tools (Netzwerk)
- Prüfe relative Requests oder korrekten `NUXT_PUBLIC_API_BASE`
- CORS Response Header kontrollieren

1. **Test Authentication** (falls aktiviert)
   - Microsoft Entra Login ausführen
   - Prüfen, ob Redirect-URL passt

## 🐛 **Troubleshooting**

### Build Errors

```bash
# Clean and rebuild (Repo-Root)
rm -rf node_modules .nuxt .output
npm ci
npm run build
```

### CORS Issues

```bash
# Beispiel bei externem API Origin
curl -H "Origin: https://abb-frontend.azurestaticapps.net" \
    -v https://example-api.yourdomain.tld/api/courses
```

### Environment Variables

```bash
# List all environment variables
az staticwebapp appsettings list \
    --name abb-frontend \
    --resource-group abb-resources
```

## 📋 **Quick Deployment Script**

Use the provided script for easy deployment:

```bash
./scripts/deploy-frontend.sh
```

This script will:

1. ✅ Check prerequisites
1. 🔨 Build the frontend
1. ☁️ Deploy to Azure
1. 🌐 Show the deployment URL

## 🎯 **Expected Result**

After successful deployment:

- ✅ Frontend accessible at: `https://abb-frontend.azurestaticapps.net`
- ✅ SPA routing works correctly
- ✅ API Calls funktionieren (relative oder konfigurierter externer Origin)
- ✅ Authentication redirects work
- ✅ Static assets load properly
