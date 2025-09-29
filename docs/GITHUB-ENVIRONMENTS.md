# GitHub Environments Konfiguration

Für die korrekte Funktion des Azure Static Web Apps Deployments mit GitHub Deployment Authorization Policy müssen Sie GitHub Environments konfigurieren.

## 🏗️ **GitHub Environments erstellen**

### 1. **Repository Settings öffnen**
```
GitHub Repository → Settings → Environments
```

### 2. **Production Environment erstellen**
```
Name: production
Deployment branches: Selected branches
  ✅ main
```

**Environment Variables (production):**
```
NUXT_PUBLIC_API_BASE = https://abb-backend.azurewebsites.net
NUXT_PUBLIC_ORIGIN = https://abb-frontend.azurestaticapps.net
```

### 3. **Staging Environment erstellen**
```
Name: staging
Deployment branches: Selected branches
  ✅ staging
```

**Environment Variables (staging):**
```
NUXT_PUBLIC_API_BASE = https://abb-backend-staging.azurewebsites.net
NUXT_PUBLIC_ORIGIN = https://abb-frontend-staging.azurestaticapps.net
```

### 4. **PR Environment (optional)**
```
Name: pr
Deployment branches: All branches (for PR previews)
```

**Environment Variables (pr):**
```
NUXT_PUBLIC_API_BASE = https://abb-backend-staging.azurewebsites.net
NUXT_PUBLIC_ORIGIN = (dynamisch von Azure SWA vergeben)
```

## ⚙️ **Azure Static Web Apps Konfiguration**

### Production App
```
Name: abb-frontend
Resource Group: abb-resources
Deployment: GitHub (authorization policy)
Repository: your-username/abb
Branch: main
App location: frontend
Output location: .output/public
```

### Staging App
```
Name: abb-frontend-staging
Resource Group: abb-resources
Deployment: GitHub (authorization policy)
Repository: your-username/abb
Branch: staging
App location: frontend
Output location: .output/public
```

## 🔐 **GitHub Deployment Authorization Policy**

### 1. **Azure Portal Konfiguration**
1. Gehen Sie zu Ihrer Static Web App
2. **Settings** → **Configuration** → **General**
3. **Deployment source**: GitHub
4. **Authorization**: GitHub deployment authorization policy
5. **Repository**: your-username/abb
6. **Branch**: main (für production) / staging (für staging)

### 2. **Permissions konfigurieren**
Der Workflow benötigt folgende Permissions:
```yaml
permissions:
  contents: read
  id-token: write      # Für GitHub OIDC
  pull-requests: write # Für PR Kommentare
```

## 🚀 **Deployment Workflow**

### **Automatische Deployments:**
- **Push zu `main`** → Production Deployment
- **Push zu `staging`** → Staging Deployment
- **Pull Request** → Preview Deployment

### **Environment URLs:**
- **Production**: https://abb-frontend.azurestaticapps.net
- **Staging**: https://abb-frontend-staging.azurestaticapps.net
- **PR Preview**: https://orange-forest-xxx.azurestaticapps.net (dynamisch)

## 🛠️ **Setup Schritte**

### 1. **GitHub Environments erstellen** (wie oben beschrieben)

### 2. **Azure Static Web Apps erstellen**
```bash
# Production App
az staticwebapp create \
    --name abb-frontend \
    --resource-group abb-resources \
    --location "West Europe" \
    --source https://github.com/your-username/abb \
    --branch main \
    --app-location "frontend" \
    --output-location ".output/public"

# Staging App
az staticwebapp create \
    --name abb-frontend-staging \
    --resource-group abb-resources \
    --location "West Europe" \
    --source https://github.com/your-username/abb \
    --branch staging \
    --app-location "frontend" \
    --output-location ".output/public"
```

### 3. **GitHub Authorization konfigurieren**
In Azure Portal für beide Apps:
1. **Settings** → **Configuration**
2. **Deployment source**: GitHub
3. **Authorization policy**: GitHub deployment authorization policy

### 4. **Branch Protection Rules (optional)**
```
main branch:
  ✅ Require status checks before merging
  ✅ Require branches to be up to date
  ✅ Require deployments to succeed before merging

staging branch:
  ✅ Require status checks before merging
```

## ✅ **Verification**

Nach dem Setup sollten Sie folgendes sehen:

1. **GitHub Actions**:
   - Workflows laufen bei Push zu main/staging
   - Umgebungsvariablen werden korrekt gesetzt

2. **Azure Static Web Apps**:
   - Automatische Deployments ohne API Tokens
   - Branch-spezifische Deployments

3. **URLs funktionieren**:
   - Production: Frontend kann Backend erreichen
   - Staging: Frontend kann Staging-Backend erreichen

## 🔍 **Troubleshooting**

### GitHub OIDC Fehler
```
Error: OIDC provider not configured
```
**Lösung**: Stellen Sie sicher, dass `id-token: write` Permission gesetzt ist.

### Environment Variables nicht gesetzt
```
NUXT_PUBLIC_API_BASE is undefined
```
**Lösung**: Prüfen Sie GitHub Environment Variables Konfiguration.

### Azure Authorization Fehler
```
Deployment authorization failed
```
**Lösung**: Verifizieren Sie GitHub Deployment Authorization Policy in Azure Portal.