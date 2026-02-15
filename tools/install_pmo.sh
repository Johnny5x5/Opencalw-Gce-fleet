#!/bin/bash
# PMO Installer Script
# Installs the OpenClaw Project Management Office structure into a target directory.

set -e

DRY_RUN=false

if [ "$1" == "--dry-run" ]; then
  DRY_RUN=true
  shift
fi

if [ -z "$1" ]; then
  echo "Usage: ./tools/install_pmo.sh [--dry-run] <target_directory>"
  exit 1
fi

TARGET_DIR="$1"
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"

echo "Installing PMO into $TARGET_DIR..."

if [ "$DRY_RUN" = true ]; then
  echo "[DRY RUN] Would create directories in $TARGET_DIR/backlog/"
  echo "[DRY RUN] Would copy templates and governance docs."
  echo "[DRY RUN] Would install tools and workflows."
  exit 0
fi

# 1. Create Directory Structure
mkdir -p "$TARGET_DIR/backlog/active"
mkdir -p "$TARGET_DIR/backlog/archive"
mkdir -p "$TARGET_DIR/backlog/inbox"
mkdir -p "$TARGET_DIR/backlog/planning"
mkdir -p "$TARGET_DIR/backlog/roadmaps"
mkdir -p "$TARGET_DIR/backlog/templates"
mkdir -p "$TARGET_DIR/tools"
mkdir -p "$TARGET_DIR/.github/workflows"
mkdir -p "$TARGET_DIR/docs/departments/project_management"

# 2. Copy Core Documentation
cp "$REPO_ROOT/backlog/GOVERNANCE.md" "$TARGET_DIR/backlog/"
cp "$REPO_ROOT/backlog/README.md" "$TARGET_DIR/backlog/"
cp "$REPO_ROOT/backlog/STRATEGY.md" "$TARGET_DIR/backlog/"
cp "$REPO_ROOT/backlog/templates/"* "$TARGET_DIR/backlog/templates/"
cp "$REPO_ROOT/backlog/planning/RITUALS.md" "$TARGET_DIR/backlog/planning/"
cp "$REPO_ROOT/docs/departments/project_management/ROLES.md" "$TARGET_DIR/docs/departments/project_management/"

# 3. Copy Tools & Workflows
# Legion 4 Defense: The Ghosts (Supply Chain Verification)
echo "Verifying Tool Integrity..."
if [ -f "$REPO_ROOT/tools/SHA256SUMS" ]; then
    pushd "$REPO_ROOT/tools" > /dev/null
    sha256sum -c SHA256SUMS
    if [ $? -ne 0 ]; then
        echo "🚨 ERROR: Tool integrity check failed! Aborting installation."
        exit 1
    fi
    popd > /dev/null
fi

cp "$REPO_ROOT/tools/the_covenant.py" "$TARGET_DIR/tools/"
cp "$REPO_ROOT/tools/validate_backlog.py" "$TARGET_DIR/tools/"
cp "$REPO_ROOT/tools/generate_status_report.py" "$TARGET_DIR/tools/"
cp "$REPO_ROOT/tools/calculate_velocity.py" "$TARGET_DIR/tools/"
cp "$REPO_ROOT/tools/scan_activity.py" "$TARGET_DIR/tools/"
cp "$REPO_ROOT/tools/the_governor.py" "$TARGET_DIR/tools/"
cp "$REPO_ROOT/tools/archive_completed.py" "$TARGET_DIR/tools/"
cp "$REPO_ROOT/tools/audit_dependencies.py" "$TARGET_DIR/tools/"
cp "$REPO_ROOT/tools/check_links.py" "$TARGET_DIR/tools/"
cp "$REPO_ROOT/tools/detect_duplicates.py" "$TARGET_DIR/tools/"
cp "$REPO_ROOT/tools/validate_archive.py" "$TARGET_DIR/tools/"
cp "$REPO_ROOT/tools/SHA256SUMS" "$TARGET_DIR/tools/"

cp "$REPO_ROOT/.github/workflows/backlog_validation.yml" "$TARGET_DIR/.github/workflows/"
cp "$REPO_ROOT/.github/workflows/daily_status_report.yml" "$TARGET_DIR/.github/workflows/"
cp "$REPO_ROOT/.github/workflows/citadel_automation.yml" "$TARGET_DIR/.github/workflows/"

# 4. Success Message
echo "PMO Installation Complete!"
echo "Structure created in $TARGET_DIR/backlog"
echo "Tools installed in $TARGET_DIR/tools"
echo "Workflows installed in $TARGET_DIR/.github/workflows"
echo ""
echo "Next Steps:"
echo "1. Define your Prime Directives in $TARGET_DIR/backlog/STRATEGY.md"
echo "2. Add your first task to $TARGET_DIR/backlog/active/"
