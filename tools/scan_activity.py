import os
import subprocess
import json
import datetime

def get_last_commit_date(path="."):
    """
    Returns the ISO date of the last commit for a given path.
    """
    try:
        # git log -1 --format=%cI -- <path>
        result = subprocess.run(
            ["git", "log", "-1", "--format=%cI", "--", path],
            capture_output=True,
            text=True,
            check=True
        )
        output = result.stdout.strip()
        if output:
            return output
        return None
    except subprocess.CalledProcessError:
        return None

def scan_project_activity():
    """
    Maps backlog items to project folders and checks last activity.
    """
    # Define mapping: Backlog ID -> Source Path
    # In a perfect world, this is in registry.json. For now, we infer or default to repo root.
    project_paths = {
        "001": "src/knowledge/personas", # Chaplain
        "002": "src/knowledge/projects", # Marketing
        "003": "terraform/wargames.tf", # War Games
        "004": "src/knowledge/wargames", # War Council
        "005": "terraform/modules/hyperscale_engine", # Trading (Simulated)
        "007": "docs/departments/EMPERORS_WILL_PROTOCOL.md", # Royal Seal
        "008": "docs/nation", # Sovereign Nation
        "013": "backlog/planning", # PMO
        "014": "backlog/active", # Engineering Systems
    }

    activity_data = {}

    for item_id, path in project_paths.items():
        last_date = get_last_commit_date(path)
        days_inactive = -1

        if last_date:
            commit_dt = datetime.datetime.fromisoformat(last_date)
            now_dt = datetime.datetime.now(commit_dt.tzinfo)
            delta = now_dt - commit_dt
            days_inactive = delta.days

            activity_data[item_id] = {
                "last_active": last_date.split('T')[0],
                "days_inactive": days_inactive,
                "status": "Healthy" if days_inactive < 7 else "Stale"
            }
        else:
             activity_data[item_id] = {
                "last_active": "Never",
                "days_inactive": 999,
                "status": "Inactive"
            }

    return activity_data

def main():
    print("Scanning Git Activity...")
    metrics = scan_project_activity()

    with open("activity_metrics.json", "w") as f:
        json.dump(metrics, f, indent=2)

    print("Activity Scan Complete. Metrics saved.")

if __name__ == "__main__":
    main()
