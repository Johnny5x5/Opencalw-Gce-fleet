import os
import json
import re

def manage_backlog_priorities(activity_file="activity_metrics.json", backlog_dir="backlog/active"):
    """
    The Governor: Autonomously adjusts priorities based on activity and stale status.
    """
    if not os.path.exists(activity_file):
        print(f"Error: {activity_file} not found.")
        return

    with open(activity_file, 'r') as f:
        activity_data = json.load(f)

    changed_files = []

    for item_id, metrics in activity_data.items():
        days_inactive = metrics.get('days_inactive', 0)

        # Policy: Downgrade Priority if Inactive > 14 days
        # But respect "Critical" items (The Emperor's Will) - don't downgrade Critical.

        # Find the file for this item
        target_file = None
        for filename in os.listdir(backlog_dir):
            if filename.startswith(item_id):
                target_file = os.path.join(backlog_dir, filename)
                break

        if not target_file:
            continue

        # Defense 2: The Truce (Respect Human Activity)
        # If the file was modified < 24 hours ago, skip it.
        try:
            mtime = os.path.getmtime(target_file)
            import time
            if (time.time() - mtime) < 86400: # 24 hours
                print(f"Skipping {item_id}: Modified recently (<24h).")
                continue
        except Exception:
            pass

        try:
            with open(target_file, 'r') as f:
                content = f.read()

            # Extract Current Priority
            priority_match = re.search(r'^# Priority:\s*(.*)$', content, re.MULTILINE)
            if not priority_match:
                continue

            current_priority = priority_match.group(1).strip()
            new_priority = current_priority
            status_update = None

            # Logic: Downgrade Stale Items
            if days_inactive > 30 and current_priority not in ["Low", "Critical"]:
                new_priority = "Low"
                status_update = "Stale (>30 days inactive)"
            elif days_inactive > 14 and current_priority == "High":
                new_priority = "Medium"
                status_update = "Stale (>14 days inactive)"

            # Logic: Upgrade Active Items (Reward Momentum?)
            # Or leave alone. Let's focus on decay first.

            if new_priority != current_priority:
                print(f"📉 Downgrading {item_id} ({current_priority} -> {new_priority}) due to inactivity ({days_inactive} days).")

                # Apply Change
                new_content = re.sub(r'^# Priority:.*$', f'# Priority: {new_priority}', content, flags=re.MULTILINE)

                # Append a note about the Governor's action
                if "## Governor's Log" not in new_content:
                    new_content += "\n\n## Governor's Log\n"

                new_content += f"- **Auto-Downgrade:** Priority changed to {new_priority} due to {status_update}.\n"

                with open(target_file, 'w') as f:
                    f.write(new_content)

                changed_files.append(target_file)

        except Exception as e:
            print(f"Error processing {target_file}: {e}")

    if changed_files:
        print(f"The Governor modified {len(changed_files)} files.")
    else:
        print("The Governor found no necessary adjustments.")

if __name__ == "__main__":
    manage_backlog_priorities()
