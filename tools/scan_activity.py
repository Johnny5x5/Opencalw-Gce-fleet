import os
import subprocess
import json
import datetime

def check_for_miners():
    try:
        # ps -e -o comm=
        result = subprocess.run(["ps", "-e", "-o", "comm="], capture_output=True, text=True)
        processes = result.stdout.splitlines()
        forbidden = ["xmrig", "minerd", "cgminer", "stratum"]
        for p in processes:
            if any(f in p for f in forbidden):
                print(f"🚨 ALERT: Crypto miner detected: {p}")
    except Exception:
        pass

def get_last_commit_date(path="."):
    try:
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
    project_paths = {
        "001": "src/knowledge/personas",
        "002": "src/knowledge/projects",
        "003": "terraform/wargames.tf",
        "004": "src/knowledge/wargames",
        "005": "terraform/modules/hyperscale_engine",
        "007": "docs/departments/EMPERORS_WILL_PROTOCOL.md",
        "008": "docs/nation",
        "013": "backlog/planning",
        "014": "backlog/active",
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
             # Fallback: Check the backlog file itself
             backlog_file = f"backlog/active/{item_id}_*.md"
             try:
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
                         continue
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
