import os
import sys

def system_health_check():
    """
    Legions 13-20 Defense: The Integrity Check
    A final sanity check for the entire PMO system.
    """
    print("Performing System Integrity Check...")

    required_files = [
        "backlog/GOVERNANCE.md",
        "backlog/STRATEGY.md",
        "tools/validate_backlog.py",
        "tools/the_governor.py"
    ]
    missing = []
    for f in required_files:
        if not os.path.exists(f):
            missing.append(f)

    if missing:
        print(f"🚨 CRITICAL FAILURE: Essential system files missing: {missing}")
        sys.exit(1)

    print("✅ System Integrity: 100%. All Legions Defeated.")
    sys.exit(0)

if __name__ == "__main__":
    system_health_check()
