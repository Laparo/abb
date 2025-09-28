#!/bin/bash

# Azure Static Web Apps Frontend Deployment Script
# Usage: ./scripts/deploy-frontend.sh

set -euo pipefail

echo "🚀 Deploying Frontend to Azure Static Web Apps"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo -e "${RED}❌ Azure CLI is not installed. Please install it first.${NC}"
    echo "   Installation: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
    exit 1
fi

# Set variables (overridable via environment variables)
# The Nuxt app lives in the repo root; adjust if you move it.
FRONTEND_DIR="${FRONTEND_DIR:-.}"
BUILD_DIR="$FRONTEND_DIR/.output/public"
# Azure target defaults provided by user
RESOURCE_GROUP="${RESOURCE_GROUP:-abb}"
STATIC_WEB_APP_NAME="${STATIC_WEB_APP_NAME:-ABB}"
# Optional Azure context
TENANT_ID="${TENANT_ID:-${AZURE_TENANT_ID:-}}"
SUBSCRIPTION_ID="${AZURE_SUBSCRIPTION_ID:-}"

echo -e "${YELLOW}📋 Configuration:${NC}"
echo "   Frontend Directory: $FRONTEND_DIR"
echo "   Build Directory: $BUILD_DIR"
echo "   Resource Group: $RESOURCE_GROUP"
echo "   Static Web App: $STATIC_WEB_APP_NAME"
if [ -n "$TENANT_ID" ]; then echo "   Tenant ID: $TENANT_ID"; fi
if [ -n "$SUBSCRIPTION_ID" ]; then echo "   Subscription ID: $SUBSCRIPTION_ID"; fi
echo ""

# Map common token env var
if [ -z "${SWA_CLI_DEPLOYMENT_TOKEN:-}" ] && [ -n "${AZURE_STATIC_WEB_APPS_API_TOKEN:-}" ]; then
    export SWA_CLI_DEPLOYMENT_TOKEN="$AZURE_STATIC_WEB_APPS_API_TOKEN"
fi

# Build the frontend
echo -e "${YELLOW}🔨 Building static site (Nuxt generate)...${NC}"
(
    cd "$FRONTEND_DIR"
    npm ci || true
    npm run generate
)

# Ensure build directory exists now
if [ ! -d "$BUILD_DIR" ]; then
        echo -e "${RED}❌ Build directory not found after build: $BUILD_DIR${NC}"
        exit 1
fi

# Copy SWA config into build output if present
if [ -f "$FRONTEND_DIR/staticwebapp.config.json" ]; then
    echo -e "${YELLOW}🧩 Copying staticwebapp.config.json into build output...${NC}"
    cp "$FRONTEND_DIR/staticwebapp.config.json" "$BUILD_DIR/"
elif [ -f "staticwebapp.config.json" ]; then
    echo -e "${YELLOW}🧩 Copying staticwebapp.config.json from repo root into build output...${NC}"
    mkdir -p "$BUILD_DIR"
    cp "staticwebapp.config.json" "$BUILD_DIR/"
fi

# Deploy to Azure Static Web Apps
echo -e "${YELLOW}☁️  Deploying to Azure Static Web Apps...${NC}"

# Prefer SWA CLI for deployment. If a deployment token is provided via SWA_CLI_DEPLOYMENT_TOKEN, we can skip interactive login.
if [ -z "${SWA_CLI_DEPLOYMENT_TOKEN:-}" ]; then
  echo -e "${YELLOW}🔑 No SWA_CLI_DEPLOYMENT_TOKEN found. Attempting Azure sign-in for SWA CLI...${NC}"
  echo -e "${YELLOW}   This may open a browser window to authenticate.${NC}"
  # Ensure Azure CLI has a logged in account (helps with subscription context)
  if ! az account show > /dev/null 2>&1; then
      echo -e "${YELLOW}⚠️  Not logged in to Azure. Please login first:${NC}"
      echo "   az login"
      exit 1
  fi
  # Perform SWA CLI login targeting the specific app (non-fatal if it fails; deploy may still prompt)
        npx -y @azure/static-web-apps-cli@latest login \
            --no-use-keychain \
            ${TENANT_ID:+--tenant-id "$TENANT_ID"} \
            ${SUBSCRIPTION_ID:+--subscription-id "$SUBSCRIPTION_ID"} \
            --resource-group "$RESOURCE_GROUP" \
            --app-name "$STATIC_WEB_APP_NAME" || true
fi

# Run deployment using SWA CLI. outputLocation must be relative to appLocation.
npx -y @azure/static-web-apps-cli@latest deploy \
    --no-use-keychain \
    --env production \
    ${TENANT_ID:+--tenant-id "$TENANT_ID"} \
    ${SUBSCRIPTION_ID:+--subscription-id "$SUBSCRIPTION_ID"} \
    --resource-group "$RESOURCE_GROUP" \
    --app-name "$STATIC_WEB_APP_NAME" \
    --app-location "$FRONTEND_DIR" \
    --output-location ".output/public"

echo -e "${GREEN}✅ Frontend deployment command completed!${NC}"
echo ""
echo -e "${YELLOW}🌐 Your frontend should be available at:${NC}"
echo "   https://$STATIC_WEB_APP_NAME.azurestaticapps.net"
echo ""
echo -e "${YELLOW}📝 Next steps:${NC}"
echo "   1. Update DNS/domain settings if needed"
echo "   2. Configure environment variables in Azure Portal"
echo "   3. Update CORS settings in backend"