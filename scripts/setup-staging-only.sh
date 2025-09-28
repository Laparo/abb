#!/bin/bash

# ABB Staging Environment Setup
# Erstellt nur das Staging Environment - Production kommt später

set -e

echo "🧪 ABB Staging Environment Setup"
echo "================================"

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

echo "📋 Staging Konfiguration:"
echo "   Resource Group: $RESOURCE_GROUP"
echo "   Location: $LOCATION"
echo "   Repository: $REPO_URL"
echo "   Branch: staging"
echo ""

# Create resource group if it doesn't exist
echo "📦 Erstelle/überprüfe Resource Group..."
az group create --name "$RESOURCE_GROUP" --location "$LOCATION" --output none

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

echo ""
echo "✅ Staging Setup erfolgreich!"
echo "============================"
echo ""
echo "🧪 STAGING Environment:"
echo "   URL: https://$STAGING_URL"
echo "   Token: $STAGING_TOKEN"
echo ""
echo "📝 Nächste Schritte:"
echo "1. GitHub Secret hinzufügen:"
echo "   AZURE_STATIC_WEB_APPS_API_TOKEN_STAGING: $STAGING_TOKEN"
echo ""
echo "2. Staging deployment testen:"
echo "   git push origin staging"
echo ""
echo "🎯 Staging ist bereit für Tests!"
echo "Production Environment wird erst nach Staging-Freigabe erstellt."