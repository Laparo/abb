# Azure Static Web App "ABB" - Staging/Production Setup

Diese Anleitung zeigt die spezifische Konfiguration der Azure Static Web App "ABB" für staging und production Environments.

## 🎯 **Architektur Übersicht**

**Azure Static Web App: ABB**
- **Staging Environment**: Automatische Deployments vom `staging` Branch
- **Production Environment**: Automatische Deployments vom `main` Branch
- **PR Previews**: Temporäre Deployments für Pull Requests

## 🏗️ **1. Azure Static Web App ABB Konfiguration**

### Aktuelle App Details:
```
Name: ABB
Resource Group: (Ihr Resource Group)
Deployment: GitHub deployment authorization policy
Repository: Laparo/abb
```

### Notwendige Konfiguration:

#### 1.1 GitHub Deployment Authorization
1. **Azure Portal** → **Static Web Apps** → **ABB**
2. **Settings** → **Configuration** → **General**
3. **Deployment source**: GitHub
4. **Authorization**: GitHub deployment authorization policy
5. **Repository**: Laparo/abb
6. **Production branch**: main
7. **Preview branches**: staging

#### 1.2 Branch-Environment Mapping
```yaml
Branch Mapping:
  main → Production Environment
  staging → Staging Environment (Custom Environment)
  PR branches → Preview Environments
```

#### 1.3 Build Configuration
```yaml
App location: frontend
Output location: .output/public
Skip app build: true (da wir im Workflow builden)
```

## ⚙️ **2. GitHub Environments Setup**

### 2.1 Production Environment
```yaml
Name: production
Deployment branches: main
Environment Variables:
  NUXT_PUBLIC_API_BASE: https://abb-backend.azurewebsites.net
  NUXT_PUBLIC_ORIGIN: https://abb.azurestaticapps.net
```

### 2.2 Staging Environment
```yaml
Name: staging
Deployment branches: staging
Environment Variables:
  NUXT_PUBLIC_API_BASE: https://abb-backend-staging.azurewebsites.net
  NUXT_PUBLIC_ORIGIN: https://staging.abb.azurestaticapps.net
```

## 🔧 **3. Workflow Konfiguration**

Der ABB Workflow (`azure-static-web-apps-abb.yml`) ist konfiguriert für:

### 3.1 Environment Detection
```yaml
setup:
  outputs:
    environment: ${{ steps.env.outputs.environment }}
    app_location: frontend
    output_location: .output/public
```

### 3.2 Branch-spezifische Deployments
```yaml
if main branch:
  environment: production
  deployment: ABB Production

if staging branch:
  environment: staging
  deployment: ABB Staging Environment

if PR:
  environment: pr
  deployment: ABB Preview
```

## 🌐 **4. URLs und Endpoints**

### Production URLs:
- **Frontend**: https://abb.azurestaticapps.net
- **Backend**: https://abb-backend.azurewebsites.net

### Staging URLs:
- **Frontend**: https://staging.abb.azurestaticapps.net (Custom Domain)
- **Backend**: https://abb-backend-staging.azurewebsites.net

### Preview URLs:
- **Format**: https://pr-{nummer}.abb.azurestaticapps.net

## 🚀 **5. Deployment Commands**

### Manuelles Setup der GitHub Environments:
```bash
# Erstelle GitHub Environments
./scripts/setup-github-environments.sh

# Oder manuell über GitHub CLI:
gh api repos/Laparo/abb/environments/production --method PUT
gh api repos/Laparo/abb/environments/staging --method PUT
```

### Azure Static Web App Commands:
```bash
# Prüfe aktuelle Konfiguration
az staticwebapp show --name ABB --resource-group <resource-group>

# Liste alle Environments
az staticwebapp environment list --name ABB --resource-group <resource-group>

# Erstelle Staging Environment (falls nicht vorhanden)
az staticwebapp environment create \
  --name ABB \
  --resource-group <resource-group> \
  --environment-name staging \
  --source-branch staging
```

## ✅ **6. Verification Steps**

### 6.1 GitHub Actions Check:
```bash
# Prüfe Workflow Runs
gh run list --branch staging --limit 5
gh run list --branch main --limit 5
```

### 6.2 Azure Portal Check:
1. **Static Web Apps** → **ABB** → **Environments**
2. Sollte zeigen:
   - **Production** (main branch)
   - **Staging** (staging branch)
   - **Preview environments** (PR branches)

### 6.3 URL Accessibility:
```bash
# Test Production
curl -I https://abb.azurestaticapps.net

# Test Staging
curl -I https://staging.abb.azurestaticapps.net
```

## 🔍 **7. Troubleshooting**

### 7.1 Deployment Authorization Fehler:
```
Error: No matching Static Web App was found
```
**Lösung**: Verifizieren Sie GitHub deployment authorization policy in Azure Portal.

### 7.2 Environment Variables nicht gesetzt:
```
NUXT_PUBLIC_API_BASE is undefined
```
**Lösung**: Prüfen Sie GitHub Environment Variables Konfiguration.

### 7.3 Branch Mapping funktioniert nicht:
**Lösung**:
1. Stellen Sie sicher, dass `production_branch: main` im Workflow gesetzt ist
2. Prüfen Sie Azure Portal Branch-Konfiguration

## 📋 **8. Action Items**

### Für Sie zu erledigen:

1. **✅ Prüfen Sie Azure Portal Konfiguration**:
   - ABB Static Web App → Configuration
   - GitHub deployment authorization policy aktiviert
   - Repository: Laparo/abb korrekt verknüpft

2. **✅ GitHub Environments erstellen**:
   ```bash
   # Production Environment
   GitHub → Settings → Environments → New environment: "production"

   # Staging Environment
   GitHub → Settings → Environments → New environment: "staging"
   ```

3. **✅ Environment Variables setzen**:
   - In jedem GitHub Environment die entsprechenden NUXT_PUBLIC_* Variablen

4. **✅ Deployment testen**:
   ```bash
   # Push zu staging sollte Staging Environment deployen
   git push origin staging

   # Push zu main sollte Production Environment deployen
   git push origin main
   ```

## 🎯 **Expected Results**

Nach erfolgreichem Setup:
- ✅ Staging Branch → ABB Staging Environment
- ✅ Main Branch → ABB Production Environment
- ✅ PR → ABB Preview Environments
- ✅ Separate URLs für staging/production
- ✅ Environment-spezifische API Konfiguration