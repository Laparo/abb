# ABB - Azure Static Web Apps Environment Setup

## Environment Architecture

- **Staging**: Branch `staging` → staging-abb.azurestaticapps.net
- **Production**: Branch `production` → abb.azurestaticapps.net

## Deployment Flow

```text
main → staging → production
```

## Required Azure Setup

Create two Azure Static Web Apps:

```bash
# Staging
az staticwebapp create --name "abb-staging" --branch "staging"

# Production
az staticwebapp create --name "abb-production" --branch "production"
```

## GitHub Secrets

- `AZURE_STATIC_WEB_APPS_API_TOKEN_STAGING`
- `AZURE_STATIC_WEB_APPS_API_TOKEN_PRODUCTION`

## Environment Variables

Both use static generation:

```yaml
NUXT_SSR: 'false'
NUXT_ENABLE_AUTH: 'false'
```
