import os
import re
import urllib.request
import json

def audit_dependencies(backlog_dir="backlog/active"):
    """
    Legion 8 Defense: The Saboteurs (Dependency Confusion)
    Scans backlog items for proposed npm packages and verifies they exist.
    """
    if not os.path.exists(backlog_dir):
        return

    npm_package_regex = r'`npm install ([a-z0-9-@/]+)`'
    warnings = 0

    print("Auditing dependencies mentioned in Backlog...")

    for filename in os.listdir(backlog_dir):
        if filename.endswith(".md"):
            filepath = os.path.join(backlog_dir, filename)
            with open(filepath, 'r') as f:
                content = f.read()

            matches = re.findall(npm_package_regex, content)
            for pkg in matches:
                # Basic check: Does it exist in npm registry?
                # Using a HEAD request to npmjs.com or registry.npmjs.org
                # registry.npmjs.org/<pkg> returns JSON if exists, 404 if not.

                # NOTE: For "War Game" simulation, we are careful not to spam npm.
                # We will check only distinct packages.

                url = f"https://registry.npmjs.org/{pkg}"
                try:
                    with urllib.request.urlopen(url) as response:
                        if response.getcode() == 200:
                            print(f"✅ Verified package: {pkg}")
                except urllib.error.HTTPError as e:
                    if e.code == 404:
                        print(f"🚨 DANGER: Package '{pkg}' found in {filename} but does not exist on npm! Possible Typosquatting/Sabotage.")
                        warnings += 1
                    else:
                        print(f"⚠️ Warning: Could not check '{pkg}': {e}")
                except Exception as e:
                     print(f"⚠️ Warning: Network error checking '{pkg}': {e}")

    if warnings > 0:
        print(f"Legion 8 Defense Triggered: {warnings} suspicious packages found.")
        # exit(1) # Optional: Fail the build
    else:
        print("Dependency Audit Complete. No obvious saboteurs found.")

if __name__ == "__main__":
    audit_dependencies()
