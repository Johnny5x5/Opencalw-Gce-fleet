import os
import sys
import re

def validate_markdown_file(filepath):
    """
    Validates a single markdown file against the 'Standard of Excellence'.
    """
    print(f"Validating {filepath}...")
    try:
        with open(filepath, 'r') as f:
            content = f.read()
    except Exception as e:
        print(f"ERROR: Could not read file: {e}")
        return False

    errors = []

    # Check Headers
    if not re.search(r'^# Title:', content, re.MULTILINE):
        errors.append("Missing '# Title:' header")
    if not re.search(r'^# Priority:', content, re.MULTILINE):
        errors.append("Missing '# Priority:' header")
    if not re.search(r'^# Type:', content, re.MULTILINE):
        errors.append("Missing '# Type:' header")

    # Check Structure
    if "## Description" not in content and "## Context" not in content:
        errors.append("Missing '## Description' or '## Context' section")
    if "## Acceptance Criteria" not in content:
        errors.append("Missing '## Acceptance Criteria' section")

    if errors:
        print(f"FAILED: {filepath}")
        for err in errors:
            print(f"  - {err}")
        return False

    print(f"OK: {filepath}")
    return True

def main():
    """
    Scans 'backlog/active/' and validates all .md files.
    """
    backlog_dir = "backlog/active"
    if not os.path.isdir(backlog_dir):
        print(f"Directory {backlog_dir} does not exist. Skipping.")
        # If the directory doesn't exist yet, we don't fail, but we warn.
        # Ideally, we should create it if it's missing, but validation is passive.
        return

    failure = False
    files_checked = 0
    for filename in os.listdir(backlog_dir):
        if filename.endswith(".md"):
            filepath = os.path.join(backlog_dir, filename)
            files_checked += 1
            if not validate_markdown_file(filepath):
                failure = True

    if failure:
        print("\nVALIDATION FAILED: Some backlog items do not meet the Standard of Excellence.")
        sys.exit(1)
    elif files_checked == 0:
        print("\nWARNING: No active backlog items found in 'backlog/active/'.")
        sys.exit(0)
    else:
        print("\nVALIDATION PASSED: The Backlog is pure.")
        sys.exit(0)

if __name__ == "__main__":
    main()
