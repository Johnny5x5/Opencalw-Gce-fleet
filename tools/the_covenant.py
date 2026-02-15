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

    # 1. Authority (I am the Lord thy God)
    # Check for GOVERNANCE.md presence
    if not os.path.exists(os.path.join(repo_root, "backlog/GOVERNANCE.md")):
        violations.append("1. AUTHORITY: 'backlog/GOVERNANCE.md' is missing. The Law is lost.")

    # 2. Idolatry (No Graven Images)
    # Scan for "Oracle", "Divine", "Magic" in code
    # We allow "Oracle" only if it's explicitly secularized (e.g. in legacy comments, but we cleaned those).
    forbidden_idols = ["Divine", "Magic", "God Mode", "Deity"]

    # 3. Blasphemy (Name in Vain)
    profanity = ["damn", "hell", "wtf", "sucks"]

    # 10. Covet (Envy)
    competitors = ["Elon", "Musk", "Meta", "Facebook", "Zuck", "OpenAI"]

    # 4. Sabbath (Rest)
    # Check if today is Sunday
    today = datetime.datetime.now()
    if today.weekday() == 6: # 0=Mon, 6=Sun
        print("⚠️ 4. SABBATH: It is the Sabbath. Why are you working? (Warning Only)")

    # 5. Honor (Father/Mother)
    # Check for Corporate History
    if not os.path.exists(os.path.join(repo_root, "src/knowledge/memory/corporate_history.json")):
        # It might not exist in this repo structure yet, so we warn.
        print("⚠️ 5. HONOR: 'corporate_history.json' missing. Do we not know our ancestors?")

    # 11. Fractal Governance (Political Husk)
    # Ensure the Political Structure exists and inherits the Covenant
    pol_struct = os.path.join(repo_root, "docs/nation/POLITICAL_STRUCTURE.md")
    if not os.path.exists(pol_struct):
        violations.append("11. FRACTAL: 'docs/nation/POLITICAL_STRUCTURE.md' missing. The Husk is empty.")

    # Scan Files for Text Violations (2, 3, 6, 7, 10)
    for root, dirs, files in os.walk(repo_root):
        if ".git" in root or "node_modules" in root:
            continue

        for filename in files:
            if filename.endswith((".py", ".md", ".js", ".tf", ".sh", ".json")) and filename != "the_covenant.py":
                filepath = os.path.join(root, filename)
                try:
                    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                        content = f.read()

                        # Check 2 (Idols)
                        for idol in forbidden_idols:
                            if re.search(r'\b' + idol + r'\b', content, re.IGNORECASE):
                                violations.append(f"2. IDOLATRY: Found '{idol}' in {filepath}.")

                        # Check 3 (Profanity)
                        for bad_word in profanity:
                            if re.search(r'\b' + bad_word + r'\b', content, re.IGNORECASE):
                                violations.append(f"3. RESPECT: Found profane term '{bad_word}' in {filepath}.")

                        # Check 10 (Envy)
                        for comp in competitors:
                            # Context check: If "Blacklist", it's okay (Defense). If "Like", it's Envy.
                            # Simplified: Just flag mentions for review.
                            # We allow blacklist mentions in docs/memory.
                            if "blacklist" not in content.lower() and "competitor" not in content.lower() and re.search(r'\b' + comp + r'\b', content, re.IGNORECASE):
                                violations.append(f"10. COVET: Mention of competitor '{comp}' in {filepath}. Why do you look at them?")

                except Exception:
                    pass

    # 8. Theft (Copyright)
    # Ensure LICENSE exists
    if not os.path.exists(os.path.join(repo_root, "LICENSE")) and not os.path.exists(os.path.join(repo_root, "LICENSE.md")):
         # Warn for now as we might not have created it yet
         print("⚠️ 8. HONESTY: LICENSE file missing. Do not steal.")

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
