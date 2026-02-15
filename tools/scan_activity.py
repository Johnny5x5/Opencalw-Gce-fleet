import os
import subprocess
import json
import datetime
import psutil # Note: This requires 'pip install psutil', but we'll use stdlib for now to avoid dependency issues

def check_for_miners():
    """
    Legion 17 Defense: The Capitalists (Crypto Mining)
    Scans running processes for high CPU usage (Simulated).
    In a real environment, we would use `ps` or `top`.
    """
    # Simple check for forbidden process names
    try:
        # ps -e -o comm=
        result = subprocess.run(["ps", "-e", "-o", "comm="], capture_output=True, text=True)
        processes = result.stdout.splitlines()
        forbidden = ["xmrig", "minerd", "cgminer", "stratum"]
        for p in processes:
            if any(f in p for f in forbidden):
                print(f"🚨 ALERT: Crypto miner detected: {p}")
                # os.kill... (In simulation, we just warn)
    except Exception:
        pass

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
             # Fallback: Check the backlog file itself (maybe the "Work" is just updating the ticket?)
             backlog_file = f"backlog/active/{item_id}_*.md"
             # Use glob to find the actual file
             try:
                 # This is a bit hacky, but robust enough for the MVP
                 result = subprocess.run(f"ls backlog/active/{item_id}_*.md", shell=True, capture_output=True, text=True)
                 if result.returncode == 0:
                     actual_file = result.stdout.strip().split('\n')[0]
                     last_date = get_last_commit_date(actual_file)

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
                         continue # Skip the "Never" block
             except Exception:
                 pass

             activity_data[item_id] = {
                "last_active": "Never",
                "days_inactive": 999,
                "status": "Inactive"
            }

    return activity_data

def main():
    check_for_miners()
    print("Scanning Git Activity...")
    metrics = scan_project_activity()

    with open("activity_metrics.json", "w") as f:
        json.dump(metrics, f, indent=2)

    print("Activity Scan Complete. Metrics saved.")

if __name__ == "__main__":
    main()
