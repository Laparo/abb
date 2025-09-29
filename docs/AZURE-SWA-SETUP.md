# Azure Static Web Apps Setup mit GitHub Deployment Authorization

Diese Anleitung zeigt, wie Sie Azure Static Web Apps mit GitHub Deployment Authorization Policy für staging und production Branches konfigurieren.

## 🎯 **Übersicht**

**Deployment Strategy:**
- **Main Branch** → Production Environment → `abb-frontend.azurestaticapps.net`
- **Staging Branch** → Staging Environment → `abb-frontend-staging.azurestaticapps.net`
- **Pull Requests** → Preview Deployments → Temporäre URLs

## 🏗️ **1. Azure Static Web Apps erstellen**

### Production App
```bash
az staticwebapp create \
    --name abb-frontend \
    --resource-group abb-resources \
    --location "West Europe" \
    --sku Free
```

### Staging App
```bash
az staticwebapp create \
    --name abb-frontend-staging \
    --resource-group abb-resources \
    --location "West Europe" \
    --sku Free
```

## ⚙️ **2. GitHub Deployment Authorization konfigurieren**

### Für beide Apps (Production & Staging):

1. **Azure Portal öffnen**
   - Gehen Sie zu Ihrer Static Web App
   - **Settings** → **Configuration** → **General**

2. **Deployment Source konfigurieren**
   ```
   Deployment source: GitHub
   Authorization: GitHub deployment authorization policy

   GitHub repository: your-username/abb
   Branch:
     - main (für abb-frontend)
     - staging (für abb-frontend-staging)

   Build Details:
     App location: frontend
     Api location: (leer lassen)
     Output location: .output/public
   ```

3. **Speichern**

## 🔐 **3. GitHub Environments einrichten**

### Automatisch mit Script:
```bash
./scripts/setup-github-environments.sh
```

### Manuell über GitHub UI:

#### Production Environment
1. **GitHub Repository** → **Settings** → **Environments**
2. **New environment**: `production`
3. **Deployment branches**: Selected branches → `main`
4. **Environment variables**:
   ```
   NUXT_PUBLIC_API_BASE = https://abb-backend.azurewebsites.net
   NUXT_PUBLIC_ORIGIN = https://abb-frontend.azurestaticapps.net
   ```

#### Staging Environment
1. **New environment**: `staging`
2. **Deployment branches**: Selected branches → `staging`
3. **Environment variables**:
   ```
   NUXT_PUBLIC_API_BASE = https://abb-backend-staging.azurewebsites.net
   NUXT_PUBLIC_ORIGIN = https://abb-frontend-staging.azurestaticapps.net
   ```

## 🔄 **4. Workflow testen**

### Staging Deployment testen:
```bash
git checkout staging
git add .
git commit -m "test: staging deployment"
git push origin staging
```

### Production Deployment testen:
```bash
git checkout main
git merge staging
git push origin main
```

### PR Preview testen:
```bash
git checkout -b feature/test-pr
git add .
git commit -m "feat: test PR preview"
git push origin feature/test-pr
# Erstellen Sie dann eine Pull Request über GitHub UI
```

## 🌐 **5. URLs und Verification**

Nach erfolgreichem Setup:

### Production URLs:
- **Frontend**: https://abb-frontend.azurestaticapps.net
- **Backend**: https://abb-backend.azurewebsites.net

### Staging URLs:
- **Frontend**: https://abb-frontend-staging.azurestaticapps.net
- **Backend**: https://abb-backend-staging.azurewebsites.net

### Verification Steps:
1. **GitHub Actions**: Workflows laufen erfolgreich
2. **Azure Portal**: Deployments erscheinen automatisch
3. **Websites**: Frontend lädt und kann Backend erreichen
4. **Environment Variables**: Korrekte API URLs werden verwendet

## 🛠️ **6. Azure Entra Redirect URLs aktualisieren**

Für beide Environments fügen Sie diese Redirect URLs hinzu:

```
Production:
https://abb-frontend.azurestaticapps.net/auth/callback

Staging:
https://abb-frontend-staging.azurestaticapps.net/auth/callback
```

## 🔍 **7. Troubleshooting**

### GitHub OIDC Authentication Fehler
```
Error: OIDC token request failed
```
**Lösung**: Stellen Sie sicher, dass die Static Web App korrekt mit GitHub verknüpft ist.

### Environment Variables werden nicht gesetzt
```
NUXT_PUBLIC_API_BASE is undefined
```
**Lösung**:
1. Prüfen Sie GitHub Environment Variables
2. Stellen Sie sicher, dass der Branch dem richtigen Environment zugeordnet ist

### Azure Authorization Fehler
```
Error: GitHub deployment authorization failed
```
**Lösung**:
1. Überprüfen Sie die GitHub App Permissions
2. Stellen Sie sicher, dass das Repository öffentlich ist oder die richtigen Permissions hat

### CORS Fehler zwischen Frontend und Backend
```
Access to fetch blocked by CORS policy
```
**Lösung**: Backend CORS Konfiguration für neue Frontend URLs aktualisieren:
```typescript
// backend/nuxt.config.ts
cors: {
  origin: [
    'https://abb-frontend.azurestaticapps.net',
    'https://abb-frontend-staging.azurestaticapps.net',
    /https:\/\/.*\.azurestaticapps\.net$/
  ]
}
```

## 📊 **8. Monitoring und Logs**

### GitHub Actions Logs:
- Repository → Actions → Workflow runs

### Azure Static Web Apps Logs:
- Azure Portal → Static Web App → Overview → Functions

### Build Logs anzeigen:
```bash
az staticwebapp show --name abb-frontend --resource-group abb-resources
```

## ✅ **Success Criteria**

Nach erfolgreichem Setup sollten Sie haben:

1. ✅ **Automatische Deployments**
   - Push zu `main` → Production Deployment
   - Push zu `staging` → Staging Deployment
   - Pull Request → Preview Deployment

2. ✅ **Environment-spezifische Konfiguration**
   - Production: Produziert produktive Backend URLs
   - Staging: Nutzt Staging Backend URLs

3. ✅ **Keine API Tokens benötigt**
   - GitHub Deployment Authorization Policy funktioniert
   - Sicherere und wartungsfreundlichere Lösung

4. ✅ **Multi-Environment Support**
   - Separate Azure Static Web Apps für Production/Staging
   - Branch-spezifische Deployments