#!/bin/bash

# GitHub Environments Setup Script für Azure Static Web Apps
# Dieser Script hilft beim Setup der GitHub Environments

set -e

echo "🔧 GitHub Environments Setup für Azure Static Web Apps"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Repository Information
REPO_OWNER=${1:-$(git config --get remote.origin.url | sed 's/.*github.com[:/]\([^/]*\).*/\1/')}
REPO_NAME=${2:-$(basename -s .git $(git config --get remote.origin.url))}

if [ -z "$REPO_OWNER" ] || [ -z "$REPO_NAME" ]; then
    echo -e "${RED}❌ Repository Informationen konnten nicht ermittelt werden.${NC}"
    echo "Usage: $0 [repo_owner] [repo_name]"
    echo "Example: $0 username abb"
    exit 1
fi

echo -e "${BLUE}📂 Repository: ${REPO_OWNER}/${REPO_NAME}${NC}"
echo ""

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo -e "${RED}❌ GitHub CLI (gh) ist nicht installiert.${NC}"
    echo "   Installation: https://cli.github.com/"
    exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo -e "${YELLOW}⚠️  Nicht bei GitHub angemeldet. Bitte melden Sie sich an:${NC}"
    echo "   gh auth login"
    exit 1
fi

echo -e "${GREEN}✅ GitHub CLI ist installiert und authentifiziert${NC}"
echo ""

# Azure Static Web Apps URLs
PRODUCTION_FRONTEND_URL="https://abb-frontend.azurestaticapps.net"
PRODUCTION_BACKEND_URL="https://abb-backend.azurewebsites.net"
STAGING_FRONTEND_URL="https://abb-frontend-staging.azurestaticapps.net"
STAGING_BACKEND_URL="https://abb-backend-staging.azurewebsites.net"

echo -e "${YELLOW}🏗️  GitHub Environments werden erstellt...${NC}"

# Create Production Environment
echo "Creating production environment..."
gh api repos/${REPO_OWNER}/${REPO_NAME}/environments/production \
    --method PUT \
    --field deployment_branch_policy='{"protected_branches":false,"custom_branch_policies":true}' \
    --silent || echo "Production environment might already exist"

# Set production environment variables
echo "Setting production environment variables..."
gh api repos/${REPO_OWNER}/${REPO_NAME}/environments/production/variables \
    --method POST \
    --field name="NUXT_PUBLIC_API_BASE" \
    --field value="$PRODUCTION_BACKEND_URL" \
    --silent || echo "Variable might already exist"

gh api repos/${REPO_OWNER}/${REPO_NAME}/environments/production/variables \
    --method POST \
    --field name="NUXT_PUBLIC_ORIGIN" \
    --field value="$PRODUCTION_FRONTEND_URL" \
    --silent || echo "Variable might already exist"

# Create Staging Environment
echo "Creating staging environment..."
gh api repos/${REPO_OWNER}/${REPO_NAME}/environments/staging \
    --method PUT \
    --field deployment_branch_policy='{"protected_branches":false,"custom_branch_policies":true}' \
    --silent || echo "Staging environment might already exist"

# Set staging environment variables
echo "Setting staging environment variables..."
gh api repos/${REPO_OWNER}/${REPO_NAME}/environments/staging/variables \
    --method POST \
    --field name="NUXT_PUBLIC_API_BASE" \
    --field value="$STAGING_BACKEND_URL" \
    --silent || echo "Variable might already exist"

gh api repos/${REPO_OWNER}/${REPO_NAME}/environments/staging/variables \
    --method POST \
    --field name="NUXT_PUBLIC_ORIGIN" \
    --field value="$STAGING_FRONTEND_URL" \
    --silent || echo "Variable might already exist"

echo ""
echo -e "${GREEN}✅ GitHub Environments wurden erstellt!${NC}"
echo ""

echo -e "${YELLOW}📋 Nächste Schritte:${NC}"
echo ""
echo "1. ${BLUE}Branch Protection Rules konfigurieren:${NC}"
echo "   → GitHub Repository → Settings → Branches"
echo "   → Add rule für 'main' und 'staging'"
echo ""
echo "2. ${BLUE}Azure Static Web Apps erstellen:${NC}"
echo "   → Production:  abb-frontend"
echo "   → Staging:     abb-frontend-staging"
echo ""
echo "3. ${BLUE}GitHub Deployment Authorization Policy aktivieren:${NC}"
echo "   → Azure Portal → Static Web App → Configuration"
echo "   → Deployment source: GitHub"
echo "   → Authorization: GitHub deployment authorization policy"
echo ""
echo "4. ${BLUE}Environment URLs verifizieren:${NC}"
echo "   → Production: $PRODUCTION_FRONTEND_URL"
echo "   → Staging:    $STAGING_FRONTEND_URL"
echo ""

echo -e "${GREEN}🎉 Setup abgeschlossen! Push zu main/staging startet automatische Deployments.${NC}"