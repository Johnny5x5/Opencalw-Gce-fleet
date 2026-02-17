import os
import sys
import re
import datetime
import json

def the_covenant(repo_root="."):
    """
    The Covenant: Enforces the Ten Commandments as the Supreme Law of the Repository.
    """
    print("📜 READING THE COVENANT...")
    violations = []

    # 1. Authority
    if not os.path.exists(os.path.join(repo_root, "backlog/GOVERNANCE.md")):
        violations.append("1. AUTHORITY: 'backlog/GOVERNANCE.md' is missing.")

    # 11. Fractal Governance
    pol_struct = os.path.join(repo_root, "docs/nation/POLITICAL_STRUCTURE.md")
    if not os.path.exists(pol_struct):
        violations.append("11. FRACTAL: 'docs/nation/POLITICAL_STRUCTURE.md' missing.")

    # 2. Idolatry
    forbidden_idols = ["Divine", "Magic", "God Mode", "Deity"]

    # 3. Blasphemy
    profanity = ["damn", "hell", "wtf", "sucks"]

    # 10. Covet
    competitors = ["Elon", "Musk", "Meta", "Facebook", "Zuck", "OpenAI"]

    # 4. Sabbath
    today = datetime.datetime.now()
    if today.weekday() == 6:
        print("⚠️ 4. SABBATH: It is the Sabbath. Why are you working? (Warning Only)")

    # 5. Honor
    if not os.path.exists(os.path.join(repo_root, "src/knowledge/memory/corporate_history.json")):
        print("⚠️ 5. HONOR: 'corporate_history.json' missing.")

    # Scan Files
    for root, dirs, files in os.walk(repo_root):
        if ".git" in root or "node_modules" in root:
            continue

        for filename in files:
            if filename.endswith((".py", ".md", ".js", ".tf", ".sh", ".json")) and filename != "the_covenant.py":
                filepath = os.path.join(root, filename)
                try:
                    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                        content = f.read()

                        for idol in forbidden_idols:
                            if re.search(r'\b' + idol + r'\b', content, re.IGNORECASE):
                                violations.append(f"2. IDOLATRY: Found '{idol}' in {filepath}.")

                        for bad_word in profanity:
                            if re.search(r'\b' + bad_word + r'\b', content, re.IGNORECASE):
                                violations.append(f"3. RESPECT: Found profane term '{bad_word}' in {filepath}.")

                        for comp in competitors:
                            if "blacklist" not in content.lower() and "competitor" not in content.lower() and re.search(r'\b' + comp + r'\b', content, re.IGNORECASE):
                                violations.append(f"10. COVET: Mention of competitor '{comp}' in {filepath}.")

                except Exception:
                    pass

    # 8. Theft
    if not os.path.exists(os.path.join(repo_root, "LICENSE")) and not os.path.exists(os.path.join(repo_root, "LICENSE.md")):
         print("⚠️ 8. HONESTY: LICENSE file missing.")

    if violations:
        print("\n🚨 COVENANT VIOLATIONS DETECTED:")
        for v in violations:
            print(f"  - {v}")
        print("\nThe System is Unclean. Repent and Fix.")
        sys.exit(1)
    else:
        print("✅ The System is Righteous.")
        sys.exit(0)

if __name__ == "__main__":
    the_covenant()
