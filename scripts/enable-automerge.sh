#!/bin/bash
set -euo pipefail

# Enable Auto-merge for Production Release PR
# Usage: ./scripts/enable-automerge.sh [pr-number]

# Configuration
REPO="Laparo/abb"
PR_NUMBER="${1:-}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    log_error "GitHub CLI (gh) is not installed. Please install it first:"
    log_error "  brew install gh"
    exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    log_error "GitHub CLI is not authenticated. Please run:"
    log_error "  gh auth login"
    exit 1
fi

# Get PR number if not provided
if [[ -z "$PR_NUMBER" ]]; then
    log_info "Getting current branch PR number..."
    CURRENT_BRANCH=$(git branch --show-current)
    
    if [[ "$CURRENT_BRANCH" == "main" ]] || [[ "$CURRENT_BRANCH" == "production" ]]; then
        log_error "Cannot enable automerge from main/production branch"
        log_error "Please specify PR number: $0 <pr-number>"
        exit 1
    fi
    
    # Try to find PR for current branch
    PR_NUMBER=$(gh pr list --head "$CURRENT_BRANCH" --json number --jq '.[0].number' 2>/dev/null || echo "")
    
    if [[ -z "$PR_NUMBER" ]]; then
        log_error "No PR found for current branch: $CURRENT_BRANCH"
        log_error "Please specify PR number: $0 <pr-number>"
        exit 1
    fi
    
    log_info "Found PR #$PR_NUMBER for branch: $CURRENT_BRANCH"
fi

# Validate PR exists and get details
log_info "Checking PR #$PR_NUMBER..."
PR_INFO=$(gh pr view "$PR_NUMBER" --json number,title,headRefName,baseRefName,mergeable,state 2>/dev/null || {
    log_error "PR #$PR_NUMBER not found or not accessible"
    exit 1
})

PR_TITLE=$(echo "$PR_INFO" | jq -r '.title')
HEAD_BRANCH=$(echo "$PR_INFO" | jq -r '.headRefName') 
BASE_BRANCH=$(echo "$PR_INFO" | jq -r '.baseRefName')
MERGEABLE=$(echo "$PR_INFO" | jq -r '.mergeable')
STATE=$(echo "$PR_INFO" | jq -r '.state')

log_info "PR Details:"
log_info "  Title: $PR_TITLE"
log_info "  Branch: $HEAD_BRANCH → $BASE_BRANCH"
log_info "  State: $STATE"
log_info "  Mergeable: $MERGEABLE"

# Validate PR state
if [[ "$STATE" != "OPEN" ]]; then
    log_error "PR #$PR_NUMBER is not open (state: $STATE)"
    exit 1
fi

if [[ "$MERGEABLE" == "CONFLICTING" ]]; then
    log_error "PR #$PR_NUMBER has merge conflicts that must be resolved first"
    exit 1
fi

# Enable auto-merge
log_info "Enabling auto-merge for PR #$PR_NUMBER..."

if gh pr merge --auto --squash "$PR_NUMBER" 2>/dev/null; then
    log_info "✅ Auto-merge enabled successfully!"
    log_info "PR will be automatically merged when all checks pass"
    
    # Show current status
    log_info "Current check status:"
    gh pr checks "$PR_NUMBER" || log_warn "Unable to fetch check status"
    
else
    log_error "Failed to enable auto-merge"
    log_error "This might be due to:"
    log_error "  - Repository settings don't allow auto-merge"
    log_error "  - You don't have permission to merge this PR"
    log_error "  - PR has failing checks that prevent auto-merge"
    
    log_info "You can manually enable auto-merge in the GitHub UI:"
    log_info "  https://github.com/$REPO/pull/$PR_NUMBER"
    exit 1
fi

log_info "🎉 Auto-merge setup complete!"
log_info "Monitor the PR at: https://github.com/$REPO/pull/$PR_NUMBER"