#!/bin/bash
# FORCE DEPLOY SCRIPT
# CAUTION: This script will OVERWRITE 'main' with the current branch.
# Use this only if you are the Emperor and you want to establish a new timeline.

echo "🚨 WARNING: You are about to FORCE PUSH the current branch to 'main'."
echo "This will rewrite history on the remote repository."
echo "All current work on 'origin/main' will be lost (archived to 'old-main')."
echo ""
read -p "Are you absolutely sure? (Type 'YES' to proceed): " confirmation

if [ "$confirmation" != "YES" ]; then
    echo "Aborted."
    exit 1
fi

echo "🚀 Initiating Protocol Omega..."

# 1. Fetch latest
git fetch origin

# 2. Backup current main locally (if it exists)
if git show-ref --verify --quiet refs/heads/main; then
    git branch -m main old-main-$(date +%s)
    echo "✅ Backed up local 'main'."
fi

# 3. Rename current branch to main
current_branch=$(git rev-parse --abbrev-ref HEAD)
git branch -m "$current_branch" main
echo "✅ Renamed '$current_branch' to 'main'."

# 4. Push to remote
echo "🔥 Pushing to origin/main (Force)..."
git push origin main --force

echo "🎉 SUCCESS. The Timeline has been reset. Long live the Sovereign Digital Nation."
