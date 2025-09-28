#!/bin/bash

# Azure Static Web Apps Frontend Deployment Script
# Usage: ./scripts/deploy-frontend.sh

set -e

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

# Check if logged in to Azure
if ! az account show &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged in to Azure. Please login first:${NC}"
    echo "   az login"
    exit 1
fi

# Set variables
FRONTEND_DIR="frontend"
BUILD_DIR="$FRONTEND_DIR/.output/public"
RESOURCE_GROUP="abb-resources"
STATIC_WEB_APP_NAME="abb-frontend"

echo -e "${YELLOW}📋 Configuration:${NC}"
echo "   Frontend Directory: $FRONTEND_DIR"
echo "   Build Directory: $BUILD_DIR"
echo "   Resource Group: $RESOURCE_GROUP"
echo "   Static Web App: $STATIC_WEB_APP_NAME"
echo ""

# Check if build directory exists
if [ ! -d "$BUILD_DIR" ]; then
    echo -e "${RED}❌ Build directory not found: $BUILD_DIR${NC}"
    echo "   Please run: cd $FRONTEND_DIR && npm run build:prod"
    exit 1
fi

# Build the frontend
echo -e "${YELLOW}🔨 Building frontend...${NC}"
cd $FRONTEND_DIR
npm run build:prod
cd ..

# Deploy to Azure Static Web Apps
echo -e "${YELLOW}☁️  Deploying to Azure Static Web Apps...${NC}"

# Upload static assets to SWA (requires Azure CLI extension 'staticwebapp')
if ! az extension show --name staticwebapp > /dev/null 2>&1; then
    echo -e "${YELLOW}ℹ️  Installing Azure CLI 'staticwebapp' extension...${NC}"
    az extension add --name staticwebapp
fi

az staticwebapp upload \
    --name "$STATIC_WEB_APP_NAME" \
    --resource-group "$RESOURCE_GROUP" \
    --source "$BUILD_DIR"

echo -e "${GREEN}✅ Frontend deployed successfully!${NC}"
echo ""
echo -e "${YELLOW}🌐 Your frontend should be available at:${NC}"
echo "   https://$STATIC_WEB_APP_NAME.azurestaticapps.net"
echo ""
echo -e "${YELLOW}📝 Next steps:${NC}"
echo "   1. Update DNS/domain settings if needed"
echo "   2. Configure environment variables in Azure Portal"
echo "   3. Update CORS settings in backend"