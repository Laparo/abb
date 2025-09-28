# Frontend Deployment Guide - Azure Static Web Apps

This guide explains how to deploy the ABB frontend to Azure Static Web Apps.

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

### Step 3: Create Static Web App
```bash
az staticwebapp create \
    --name abb-frontend \
    --resource-group abb-resources \
    --source https://github.com/YOUR_USERNAME/abb \
    --location "West Europe" \
    --branch main \
    --app-location "frontend" \
    --output-location ".output/public"
```

### Step 4: Configure Environment Variables
```bash
# Set production API base URL
az staticwebapp appsettings set \
    --name abb-frontend \
    --resource-group abb-resources \
    --setting-names NUXT_PUBLIC_API_BASE="https://abb-backend.azurewebsites.net"

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

### Step 2: Build Frontend
```bash
cd frontend
npm run build:prod
cd ..
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

```
AZURE_STATIC_WEB_APPS_API_TOKEN: [Your deployment token from Azure Portal]
NUXT_PUBLIC_API_BASE: https://abb-backend.azurewebsites.net
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
```
https://abb-frontend.azurestaticapps.net/auth/callback
```

### 2. Update Backend CORS
Ensure your backend allows the production frontend origin:
```typescript
// backend/nuxt.config.ts
cors: {
  origin: ['https://abb-frontend.azurestaticapps.net'],
  credentials: true
}
```

### 3. Custom Domain (Optional)
Configure a custom domain in Azure Portal:
1. Go to your Static Web App
2. Settings → Custom domains
3. Add your domain and configure DNS

## 🔍 **Verification Steps**

1. **Check Deployment Status**:
   ```bash
   az staticwebapp show --name abb-frontend --resource-group abb-resources
   ```

2. **Visit Your Site**:
   ```
   https://abb-frontend.azurestaticapps.net
   ```

3. **Test API Connectivity**:
   - Open browser developer tools
   - Check that API calls go to: `https://abb-backend.azurewebsites.net`
   - Verify CORS headers are present

4. **Test Authentication**:
   - Try signing in with Microsoft Entra
   - Verify redirect URLs work correctly

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
# Check backend CORS configuration
curl -H "Origin: https://abb-frontend.azurestaticapps.net" \
     -v https://abb-backend.azurewebsites.net/api/courses
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
2. 🔨 Build the frontend
3. ☁️ Deploy to Azure
4. 🌐 Show the deployment URL

## 🎯 **Expected Result**

After successful deployment:
- ✅ Frontend accessible at: `https://abb-frontend.azurestaticapps.net`
- ✅ SPA routing works correctly
- ✅ API calls reach backend at: `https://abb-backend.azurewebsites.net`
- ✅ Authentication redirects work
- ✅ Static assets load properly