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

    # 1. Check Headers (Metadata)
    headers = {
        'Title': False,
        'Priority': False,
        'Type': False
    }

    for line in content.split('\n'):
        if line.startswith('# Title:'): headers['Title'] = True
        if line.startswith('# Priority:'): headers['Priority'] = True
        if line.startswith('# Type:'): headers['Type'] = True

        # Early exit if all headers found (optimization)
        if all(headers.values()):
            break

    if not headers['Title']: errors.append("Missing '# Title:' header")
    if not headers['Priority']: errors.append("Missing '# Priority:' header")
    if not headers['Type']: errors.append("Missing '# Type:' header")

    # 2. Check Structure (Sections)
    if "## Description" not in content and "## Context" not in content:
        errors.append("Missing '## Description' or '## Context' section")
    if "## Acceptance Criteria" not in content and "## Objectives" not in content:
        errors.append("Missing '## Acceptance Criteria' or '## Objectives' section")

    # 3. Check for Checkboxes (Actionable items)
    if "- [ ]" not in content and "- [x]" not in content:
         # It's okay if it's just a concept, but usually active items need tasks.
         # We'll just warn for now or keep it strict? Let's keep it strict for 'active'.
         errors.append("No actionable tasks found (missing '- [ ]').")

    if errors:
        print(f"FAILED: {filepath}")
        for err in errors:
            print(f"  - {err}")
        return False

    print(f"OK: {filepath}")
    return True

def fix_markdown_file(filepath):
    """
    Attempts to apply simple fixes to a markdown file.
    """
    try:
        with open(filepath, 'r') as f:
            lines = f.readlines()
    except Exception:
        return

    new_lines = []
    has_title = any(l.startswith('# Title:') for l in lines)
    has_priority = any(l.startswith('# Priority:') for l in lines)
    has_type = any(l.startswith('# Type:') for l in lines)

    # Prepend missing headers if mostly empty
    if not has_title:
        # Try to infer title from first H1
        for i, line in enumerate(lines):
            if line.startswith('# '):
                lines[i] = line.replace('# ', '# Title: ')
                has_title = True
                break

    if not has_priority:
         new_lines.append("# Priority: Medium\n")
    if not has_type:
         new_lines.append("# Type: Feature\n")

    # Re-construct file
    final_content = "".join(new_lines) + "".join(lines)

    with open(filepath, 'w') as f:
        f.write(final_content)
    print(f"Auto-fixed headers for {filepath}")

def main():
    """
    Scans 'backlog/active/' and validates all .md files.
    """
    backlog_dir = "backlog/active"

    # CLI Argument to enable auto-fix
    auto_fix = "--fix" in sys.argv

    if not os.path.isdir(backlog_dir):
        print(f"Directory {backlog_dir} does not exist. Skipping.")
        return

    failure = False
    files_checked = 0
    for filename in os.listdir(backlog_dir):
        if filename.endswith(".md"):
            filepath = os.path.join(backlog_dir, filename)
            files_checked += 1

            if not validate_markdown_file(filepath):
                if auto_fix:
                    fix_markdown_file(filepath)
                    # Re-validate
                    if not validate_markdown_file(filepath):
                        failure = True
                else:
                    failure = True

    if failure:
        print("\nVALIDATION FAILED: Some backlog items do not meet the Standard of Excellence.")
        print("Tip: Run with --fix to attempt auto-correction.")
        sys.exit(1)
    elif files_checked == 0:
        print("\nWARNING: No active backlog items found in 'backlog/active/'.")
        sys.exit(0)
    else:
        print("\nVALIDATION PASSED: The Backlog is pure.")
        sys.exit(0)

if __name__ == "__main__":
    main()
