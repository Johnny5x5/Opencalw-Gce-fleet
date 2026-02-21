import os
import datetime
import collections
import json

def calculate_velocity():
    # In a real system, this would read `backlog/archive/` and count timestamps.
    return 3.0 # Conservative estimate

def predict_completion_dates(backlog_dir="backlog/active", velocity=3.0):
    if not os.path.exists(backlog_dir):
        return {}

    active_items = [f for f in os.listdir(backlog_dir) if f.endswith(".md")]
    total_items = len(active_items)

    # Round 9 Defense: The Flash Crash (Div0 Protection)
    if velocity <= 0.1:
         velocity = 0.1

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

    with open("velocity_metrics.json", "w") as f:
        json.dump(prediction, f, indent=2)

if __name__ == "__main__":
    main()
