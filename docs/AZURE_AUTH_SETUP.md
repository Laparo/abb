# Azure AD B2C External ID Setup für ABB

## 1. Azure Portal Setup

### B2C Tenant erstellen

```bash
# 1. Azure Portal → "Create a resource" → "Azure Active Directory B2C"
# 2. Tenant Name: abb-external-id
# 3. Domain Name: abbexternalid.onmicrosoft.com
# 4. Region: West Europe
```

### App Registration

```bash
# 1. Azure Portal → Azure AD B2C → App registrations → New registration
# 2. Name: ABB Course Booking
# 3. Supported account types: Accounts in any identity provider
# 4. Redirect URI:
#    - Web: https://YOUR_SWA_HOSTNAME/api/auth/callback/azure-ad-b2c
#    - Web: http://localhost:3000/api/auth/callback/azure-ad-b2c (für Development)
```

### Client Secret erstellen

```bash
# 1. App Registration → Certificates & secrets → New client secret
# 2. Description: ABB Production Secret
# 3. Expires: 24 months
# 4. Value kopieren → wird zu AAD_CLIENT_SECRET
```

## 2. User Flows konfigurieren

### Sign-up and Sign-in Flow

```bash
# 1. Azure AD B2C → User flows → New user flow
# 2. Type: Sign up and sign in
# 3. Version: Recommended
# 4. Name: B2C_1_abb_signup_signin
# 5. Identity providers: Email signup
# 6. User attributes: Given name, Surname, Email Address
# 7. Application claims: Given name, Surname, Email addresses, User's Object ID
```

## 3. Environment Variables für Azure SWA

### GitHub Secrets hinzufügen

```bash
# GitHub Repository → Settings → Secrets and variables → Actions

AZURE_STATIC_WEB_APPS_API_TOKEN=<von Azure SWA bereitgestellt>
AZURE_STATIC_WEB_APPS_HOSTNAME=<your-app-name>.azurestaticapps.net
NUXT_AUTH_SECRET=<generiere mit: openssl rand -base64 32>
AAD_CLIENT_ID=<Application ID aus App Registration>
AAD_CLIENT_SECRET=<Client Secret Value>
AAD_TENANT_ID=<Tenant ID aus B2C Tenant>
```

### Azure SWA Configuration

```bash
# Azure Portal → Static Web App → Configuration
# Application settings hinzufügen:

AUTH_ORIGIN=https://<your-app>.azurestaticapps.net/api/auth
NUXT_AUTH_SECRET=<same as GitHub secret>
AAD_CLIENT_ID=<Application ID>
AAD_CLIENT_SECRET=<Client Secret>
AAD_TENANT_ID=<B2C Tenant ID>
```

## 4. Testing

### Local Development

```bash
npm run dev:stable
# → http://localhost:3000/api/auth/signin
```

### Production

```bash
npm run build
# Deploy via GitHub Actions
# → https://your-app.azurestaticapps.net/api/auth/signin
```

## 5. Troubleshooting

### Common Issues

- **AUTH_NO_ORIGIN**: Environment variables nicht gesetzt
- **Invalid redirect_uri**: Redirect URI in App Registration prüfen
- **CORS errors**: Static Web App routing configuration prüfen
- **404 on auth endpoints**: Azure Functions deployment prüfen

### Debug Commands

```bash
# Local auth test
curl http://localhost:3000/api/auth/providers

# Production auth test
curl https://your-app.azurestaticapps.net/api/auth/providers
```
