#!/bin/bash

# ABB Azure Static Web Apps Setup Script
# This script creates staging and production environments

set -e

echo "🚀 ABB Azure Static Web Apps Setup"
echo "=================================="

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo "❌ Azure CLI ist nicht installiert. Bitte installieren: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
    exit 1
fi

# Login check
if ! az account show &> /dev/null; then
    echo "🔐 Bitte bei Azure anmelden..."
    az login
fi

# Variables
RESOURCE_GROUP="abb-rg"
LOCATION="West Europe"
REPO_URL="https://github.com/Laparo/abb"

echo "📋 Konfiguration:"
echo "   Resource Group: $RESOURCE_GROUP"
echo "   Location: $LOCATION"
echo "   Repository: $REPO_URL"
echo ""

# Create resource group
echo "📦 Erstelle Resource Group..."
az group create --name "$RESOURCE_GROUP" --location "$LOCATION"

# Create staging Static Web App
echo "🧪 Erstelle Staging Environment..."
STAGING_RESULT=$(az staticwebapp create \
    --name "abb-staging" \
    --resource-group "$RESOURCE_GROUP" \
    --source "$REPO_URL" \
    --branch "staging" \
    --location "$LOCATION" \
    --output json)

STAGING_TOKEN=$(echo "$STAGING_RESULT" | jq -r '.repositoryToken')
STAGING_URL=$(echo "$STAGING_RESULT" | jq -r '.defaultHostname')

# Create production Static Web App  
echo "🚀 Erstelle Production Environment..."
PRODUCTION_RESULT=$(az staticwebapp create \
    --name "abb-production" \
    --resource-group "$RESOURCE_GROUP" \
    --source "$REPO_URL" \
    --branch "production" \
    --location "$LOCATION" \
    --output json)

PRODUCTION_TOKEN=$(echo "$PRODUCTION_RESULT" | jq -r '.repositoryToken')
PRODUCTION_URL=$(echo "$PRODUCTION_RESULT" | jq -r '.defaultHostname')

echo ""
echo "✅ Setup erfolgreich!"
echo "===================="
echo ""
echo "🧪 STAGING Environment:"
echo "   URL: https://$STAGING_URL"
echo "   Token: $STAGING_TOKEN"
echo ""
echo "🚀 PRODUCTION Environment:"  
echo "   URL: https://$PRODUCTION_URL"
echo "   Token: $PRODUCTION_TOKEN"
echo ""
echo "📝 Nächste Schritte:"
echo "1. Fügen Sie diese GitHub Secrets hinzu:"
echo "   - AZURE_STATIC_WEB_APPS_API_TOKEN_STAGING: $STAGING_TOKEN"
echo "   - AZURE_STATIC_WEB_APPS_API_TOKEN_PRODUCTION: $PRODUCTION_TOKEN"
echo ""
echo "2. Push zu staging branch für ersten Staging-Deploy:"
echo "   git push origin staging"
echo ""
echo "3. Push zu production branch für ersten Production-Deploy:"  
echo "   git push origin production"
echo ""
echo "🎉 Ihre ABB App ist bereit für Dual-Environment Deployments!"