import os
import sys
import re

# Approved Metadata Values (The Emperor's Will)
VALID_DIRECTIVES = [
    "Existence", "Identity", "Command", "Loyalty",
    "Expansion", "Wealth", "Intelligence", "Efficiency",
    "Defense", "Influence", "Innovation", "Aesthetics"
]
VALID_PRIORITIES = ["Critical", "High", "Medium", "Low"]
VALID_TYPES = ["Feature", "Architecture", "Bug", "Security", "Test", "Hotfix"]

def validate_markdown_file(filepath):
    print(f"Validating {filepath}...")
    try:
        # Check file size (DoS Protection - Battle 1)
        if os.path.getsize(filepath) > 1024 * 1024: # 1MB limit
             print(f"FAILED: {filepath} - File too large (>1MB)")
             return False

        with open(filepath, 'r') as f:
            content = f.read()
    except Exception as e:
        print(f"ERROR: Could not read file: {e}")
        return False

    errors = []
    metadata = {}

    # 1. Check Headers (Metadata)
    for line in content.split('\n'):
        if line.startswith('# Title:'): metadata['Title'] = line.split(':', 1)[1].strip()
        if line.startswith('# Priority:'): metadata['Priority'] = line.split(':', 1)[1].strip()
        if line.startswith('# Type:'): metadata['Type'] = line.split(':', 1)[1].strip()
        if line.startswith('# Prime Directive:'): metadata['Prime Directive'] = line.split(':', 1)[1].strip()
        if len(metadata) == 4: break

    # 1.1 Header Presence
    if 'Title' not in metadata: errors.append("Missing '# Title:' header")
    if 'Priority' not in metadata: errors.append("Missing '# Priority:' header")
    if 'Type' not in metadata: errors.append("Missing '# Type:' header")
    if 'active' in filepath and 'Prime Directive' not in metadata:
         errors.append("Missing '# Prime Directive:' header (Required for Active items)")

    # 1.2 Header Value Validation (Battle 4 Fix)
    if 'Priority' in metadata and metadata['Priority'] not in VALID_PRIORITIES:
         errors.append(f"Invalid Priority: '{metadata['Priority']}'. Must be one of {VALID_PRIORITIES}")
    if 'Type' in metadata and metadata['Type'] not in VALID_TYPES:
         errors.append(f"Invalid Type: '{metadata['Type']}'. Must be one of {VALID_TYPES}")
    if 'Prime Directive' in metadata and metadata['Prime Directive'] not in VALID_DIRECTIVES:
         errors.append(f"Invalid Prime Directive: '{metadata['Prime Directive']}'. Must be one of {VALID_DIRECTIVES}")

    # 2. Check Structure (Sections)
    if "## Description" not in content and "## Context" not in content and "## Problem" not in content:
        errors.append("Missing '## Description', '## Context', or '## Problem' section")
    if "## Acceptance Criteria" not in content and "## Objectives" not in content:
        errors.append("Missing '## Acceptance Criteria' or '## Objectives' section")

    # 2.1 Round 2 Defense: Semantic Density Check (The Lie)
    description_match = re.search(r'## (Description|Context|Problem)(.*?)(##|$)', content, re.DOTALL)
    if description_match:
        desc_text = description_match.group(2).strip()
        word_count = len(desc_text.split())
        if word_count < 10:
             errors.append(f"Description too short ({word_count} words). Minimum 10 words required.")

    # 2.2 Legion 1 Defense: The Swarm (Input Sanitization)
    emoji_count = len(re.findall(r'[^\x00-\x7F]', content))
    if emoji_count > 50:
         errors.append(f"Excessive Unicode characters detected ({emoji_count}). Possible spam or binary injection.")

    if re.search(r'\[(.*?)\]\(\1\)', content):
         errors.append("Recursive Markdown link detected. Possible render crash attempt.")

    # 2.3 Legion 11/14 Defense: The Linguists & Maximalists (Content Policing)
    if re.search(r'\.(jar|exe|bin|dll|so|dmg|iso)\)', content, re.IGNORECASE):
         errors.append("⛔ BLOCKED: Binary file link detected. Do not distribute binaries via backlog.")

    if 'Title' in metadata:
        if re.search(r'[a-zA-Z]', metadata['Title']) and re.search(r'[\u0400-\u04FF\u0370-\u03FF]', metadata['Title']):
             errors.append("⚠️ SPOOFING RISK: Mixed-script Title detected (Homoglyph).")

    # 3. Check for Checkboxes (Actionable items)
    if "- [ ]" not in content and "- [x]" not in content:
         errors.append("No actionable tasks found (missing '- [ ]').")

    # 4. Security Scan (The Moat) - Prevent leaked secrets
    secret_patterns = {
        "AWS Key": r"AKIA[0-9A-Z]{16}",
        "Google API Key": r"AIza[0-9A-Za-z-_]{35}",
        "Private Key": r"-----BEGIN PRIVATE KEY-----",
        "Generic Token": r"token\s*=\s*['\"][a-zA-Z0-9]{20,}['\"]"
    }
    for name, pattern in secret_patterns.items():
        if re.search(pattern, content):
            errors.append(f"⚠️ SECURITY RISK: Potential {name} detected in file!")

    # 4.1 Legion 2 Defense: The Lawyers (PII & Compliance)
    pii_patterns = {
        "Email Address": r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}",
        "Phone Number": r"\b\d{3}[-.]?\d{3}[-.]?\d{4}\b"
    }
    for name, pattern in pii_patterns.items():
        matches = re.findall(pattern, content)
        if matches:
             filtered = [m for m in matches if "example.com" not in m and "test.com" not in m]
             if filtered:
                 errors.append(f"⚠️ PRIVACY RISK: Potential {name} detected! Don't commit PII.")

    # 5. Legion 6 Defense: The Cryptographers (Weak Crypto)
    weak_crypto = {
        "MD5": r"\bMD5\b",
        "SHA1": r"\bSHA-?1\b",
        "DES": r"\bDES\b",
        "RC4": r"\bRC4\b",
        "Telnet": r"\bTelnet\b",
        "FTP": r"\bFTP\b"
    }
    for name, pattern in weak_crypto.items():
        if re.search(pattern, content, re.IGNORECASE):
            errors.append(f"⛔ COMPLIANCE RISK: Banned cryptographic term '{name}' detected.")

    # 6. Legion 7 Defense: The Spies (Metadata Leakage)
    private_ips = r"\b(10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3})\b"
    if re.search(private_ips, content):
        errors.append("⚠️ SECURITY RISK: Private IP address detected. Do not leak internal network topology.")

    # 7. Legion 15 Defense: The Anarchists (Shell Injection)
    dangerous_shell = [
        r"rm\s+-[rRf]+\s+/",
        r":\(\)\s*\{\s*:\|:&",
        r"sudo\s+",
        r"mkfs",
        r"dd\s+if="
    ]
    for pattern in dangerous_shell:
        if re.search(pattern, content):
            errors.append("🚨 CRITICAL: Destructive shell command detected! Investigation required.")

    if errors:
        print(f"FAILED: {filepath}")
        for err in errors:
            print(f"  - {err}")
        return False

    print(f"OK: {filepath}")
    return True

def main():
    backlog_dir = "backlog/active"
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
                failure = True

    if failure:
        sys.exit(1)
    elif files_checked == 0:
        print("\nWARNING: No active backlog items found in 'backlog/active/'.")
        sys.exit(0)
    else:
        print("\nVALIDATION PASSED: The Backlog is pure.")
        sys.exit(0)

if __name__ == "__main__":
    main()
