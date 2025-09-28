# Deployment Guide - Azure Static Web Apps

Die Anwendung wurde konsolidiert: Es existiert nur noch eine Nuxt 3 Codebasis (Root). Früher getrennte Verzeichnisse `frontend/` und `backend/` wurden entfernt. Dieses Dokument beschreibt das Deployment der statisch generierten (SWA) Version.

## 🏗️ **Prerequisites**

1. **Azure Account** with active subscription
2. **Azure CLI** installed: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli
3. **SWA CLI** installed: `npm install -g @azure/static-web-apps-cli`
4. **Frontend built** for production

## 🚀 **Method 1: Using Azure CLI (Recommended)**

### Step 1: Login to Azure

```bash
az login
```

### Step 2: Create Resource Group (if needed)

```bash
az group create --name abb-resources --location "West Europe"
```

### Step 3: Create Static Web App (erstmalige Anlage)

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

Hinweis: `--skip-app-build true` weil der Build durch GitHub Actions erledigt wird. Lokal kann man auch zuerst `npm run build` ausführen und dann ohne Skip deployen.
```

### Step 4: (Optional) API Basis-URL setzen

```bash
# Set production API base URL
az staticwebapp appsettings set \
    --name abb-frontend \
    --resource-group abb-resources \
    --setting-names NUXT_PUBLIC_API_BASE="" \
    --setting-names NUXT_ENABLE_AUTH="false"

# Set frontend origin
az staticwebapp appsettings set \
    --name abb-frontend \
    --resource-group abb-resources \
    --setting-names NUXT_PUBLIC_ORIGIN="https://abb-frontend.azurestaticapps.net"
```

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

The project includes a GitHub Actions workflow in `.github/workflows/azure-static-web-apps.yml`.

### Step 1: Set Repository Secrets

In your GitHub repository settings, add these secrets:

```text
AZURE_STATIC_WEB_APPS_API_TOKEN: [Your deployment token from Azure Portal]
NUXT_PUBLIC_API_BASE: (leer oder externer API Origin)
NUXT_PUBLIC_ORIGIN: https://abb-frontend.azurestaticapps.net
```

### Step 2: Push to Main Branch

```bash
git add .
git commit -m "Deploy frontend to Azure Static Web Apps"
git push origin main
```

The workflow will automatically build and deploy on every push to main.

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

1. **Check Deployment Status**:

```bash
az staticwebapp show --name abb-frontend --resource-group abb-resources
```

1. **Visit Your Site**:

```text
https://abb-frontend.azurestaticapps.net
```

1. **Test API Connectivity**:

```bash
# Falls externe API gesetzt ist, Beispiel-Request (anpassen)
curl -I https://example-api.yourdomain.tld/api/health
```

    - Öffne Developer Tools (Netzwerk)
    - Prüfe relative Requests oder korrekten `NUXT_PUBLIC_API_BASE`
    - CORS Response Header kontrollieren

1. **Test Authentication** (falls aktiviert):
    - Microsoft Entra Login ausführen
    - Redirect-URL stimmt

## 🐛 **Troubleshooting**

### Build Errors

```bash
# Clean and rebuild
cd frontend
rm -rf node_modules .nuxt .output
npm install
npm run build:prod
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

