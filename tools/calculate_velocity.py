import os
import datetime
import collections
import json

def calculate_velocity():
    """
    Calculates the team's velocity (items completed per week).
    Currently simulated as 3 items/week until we have real data.
    """
    # In a real system, this would read `backlog/archive/` and count timestamps.
    return 3.0 # Conservative estimate

def predict_completion_dates(backlog_dir="backlog/active", velocity=3.0):
    """
    Predicts completion dates for all active projects based on velocity.
    """
    if not os.path.exists(backlog_dir):
        return {}

    # 1. Count remaining items per project
    project_counts = collections.defaultdict(int)
    for filename in os.listdir(backlog_dir):
        if filename.endswith(".md"):
            # Assuming ID is first part of filename (e.g., 008_sovereign...)
            item_id = filename.split('_')[0]
            # Map item ID to Project ID (This mapping is usually in registry.json)
            # For now, we assume 1 item = 1 unit of work for its parent project.
            pass

    # Simplified Logic:
    # 1. Count total active items (N)
    # 2. Velocity (V) = 3 items/week
    # 3. Weeks to Complete All = N / V

    active_items = [f for f in os.listdir(backlog_dir) if f.endswith(".md")]
    total_items = len(active_items)

    # Round 9 Defense: The Flash Crash (Div0 Protection)
    if velocity <= 0.1:
         velocity = 0.1 # Minimum velocity to prevent infinite/crash

    weeks_remaining = total_items / velocity

    today = datetime.date.today()
    completion_date = today + datetime.timedelta(weeks=weeks_remaining)

    return {
        "velocity": velocity,
        "total_items": total_items,
        "completion_date": completion_date.isoformat(),
        "weeks_remaining": round(weeks_remaining, 1)
    }

def main():
    prediction = predict_completion_dates()

    print("Project Velocity Calculation Complete.")
    print(f"Current Velocity: {prediction['velocity']} items/week")
    print(f"Active Burden: {prediction['total_items']} items")
    print(f"Estimated Completion of Current Backlog: {prediction['completion_date']}")

    # Save to JSON for other tools to consume
    with open("velocity_metrics.json", "w") as f:
        json.dump(prediction, f, indent=2)

if __name__ == "__main__":
    main()
