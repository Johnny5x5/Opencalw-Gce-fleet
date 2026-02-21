import os
import sys
import re
import datetime

def the_covenant(repo_root="."):
    """The Covenant: Enforces the Ten Commandments."""
    print("📜 READING THE COVENANT...")
    violations = []

    if not os.path.exists(os.path.join(repo_root, "backlog/GOVERNANCE.md")):
        violations.append("1. AUTHORITY: 'backlog/GOVERNANCE.md' is missing.")

    pol_struct = os.path.join(repo_root, "docs/nation/POLITICAL_STRUCTURE.md")
    if not os.path.exists(pol_struct):
        violations.append("11. FRACTAL: 'docs/nation/POLITICAL_STRUCTURE.md' missing.")

    forbidden_idols = ["Divine", "Magic", "God Mode", "Deity"]
    profanity = ["damn", "hell", "wtf", "sucks"]
    competitors = ["Elon", "Musk", "Meta", "Facebook", "Zuck", "OpenAI"]

    today = datetime.datetime.now()
    if today.weekday() == 6:
        print("⚠️ 4. SABBATH: It is the Sabbath. Why are you working? (Warning Only)")

    for root, dirs, files in os.walk(repo_root):
        if ".git" in root or "node_modules" in root: continue
        for filename in files:
            if filename.endswith((".py", ".md", ".js")) and filename != "the_covenant.py":
                filepath = os.path.join(root, filename)
                try:
                    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                        content = f.read()
                        for idol in forbidden_idols:
                            if re.search(r'\b' + idol + r'\b', content, re.IGNORECASE):
                                violations.append(f"2. IDOLATRY: Found '{idol}' in {filepath}.")
                        for word in profanity:
                            if re.search(r'\b' + word + r'\b', content, re.IGNORECASE):
                                violations.append(f"3. RESPECT: Found '{word}' in {filepath}.")
                except: pass

    if violations:
        print("\n🚨 COVENANT VIOLATIONS:")
        for v in violations: print(f"  - {v}")
        sys.exit(1)
    print("✅ The System is Righteous.")
    sys.exit(0)

if __name__ == "__main__":
    the_covenant()
