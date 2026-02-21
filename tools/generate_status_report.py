import os
import sys
import datetime
import collections
import json

def generate_status_report(backlog_dir="backlog/active", output_file="STATUS.md"):
    if not os.path.exists(backlog_dir):
        print(f"Error: Directory {backlog_dir} does not exist.")
        return

    report_lines = []
    report_lines.append(f"# State of the Union: {datetime.date.today()}")
    report_lines.append("## Executive Summary")

    # Velocity Integration (Predictive)
    velocity_data = {}
    if os.path.exists("velocity_metrics.json"):
        with open("velocity_metrics.json", "r") as f:
            velocity_data = json.load(f)

    # Activity Integration (Reality Check)
    activity_data = {}
    if os.path.exists("activity_metrics.json"):
        with open("activity_metrics.json", "r") as f:
            activity_data = json.load(f)

    if velocity_data:
        report_lines.append(f"📊 **Projected Velocity:** At current rate ({velocity_data['velocity']} items/week), the active backlog will be cleared by **{velocity_data['completion_date']}** ({velocity_data['weeks_remaining']} weeks).")
    else:
        report_lines.append("The Conglomerate is operating at nominal capacity. Below is the current status of all strategic initiatives.")

    # Battle 2 Defense: Inbox Warning
    inbox_count = 0
    if os.path.exists("backlog/inbox"):
        inbox_count = len([f for f in os.listdir("backlog/inbox") if f.endswith(".md")])
    if inbox_count > 50:
         report_lines.append(f"- ⚠️ **INBOX FLOOD WARNING:** {inbox_count} items in Inbox. Please triage immediately.")

    report_lines.append("")

    # Data Collection
    items = []
    directives = collections.defaultdict(list)
    types = collections.defaultdict(int)
    priorities = collections.defaultdict(int)

    for filename in sorted(os.listdir(backlog_dir)):
        if filename.endswith(".md"):
            filepath = os.path.join(backlog_dir, filename)

            metadata = {'Title': 'Unknown', 'Priority': 'Unknown', 'Type': 'Unknown', 'Prime Directive': 'Unassigned'}
            try:
                with open(filepath, 'r') as f:
                    for line in f:
                        if line.startswith('# Title:'): metadata['Title'] = line.split(':', 1)[1].strip()
                        if line.startswith('# Priority:'): metadata['Priority'] = line.split(':', 1)[1].strip()
                        if line.startswith('# Type:'): metadata['Type'] = line.split(':', 1)[1].strip()
                        if line.startswith('# Prime Directive:'): metadata['Prime Directive'] = line.split(':', 1)[1].strip()
            except Exception:
                continue

            item_id = filename.split('_')[0]
            status = "In Progress"

            item_data = (item_id, metadata['Title'], metadata['Priority'], metadata['Type'], status, metadata['Prime Directive'])
            items.append(item_data)

            directives[metadata['Prime Directive']].append(item_data)
            types[metadata['Type']] += 1
            priorities[metadata['Priority']] += 1

    # Section 1: Strategic Alignment (Grouped by Directive)
    report_lines.append("## Strategic Alignment (The North Star)")
    for directive, group in sorted(directives.items()):
        report_lines.append(f"### {directive}")
        report_lines.append("| ID | Title | Priority | Type | Status | Risk | Activity |")
        report_lines.append("|---|---|---|---|---|---|---|")
        for item in group:
             item_id = item[0]
             # Risk inference
             risk = "Low"
             if item[2] == "Critical": risk = "**High**"
             elif item[2] == "High": risk = "Medium"

             # Activity Check (Reality)
             activity = "Unknown"
             if item_id in activity_data:
                 metric = activity_data[item_id]
                 if metric['days_inactive'] > 7:
                     activity = f"⚠️ Inactive ({metric['days_inactive']}d)"
                 else:
                     activity = f"✅ Active ({metric['days_inactive']}d)"

             report_lines.append(f"| {item[0]} | {item[1]} | {item[2]} | {item[3]} | {item[4]} | {risk} | {activity} |")
        report_lines.append("") # Newline

    # Section 2: Blockers & Risks
    report_lines.append("## Critical Risks (Watchlist)")
    blockers_found = False
    for item in items:
        if item[2] == "Critical":
            report_lines.append(f"- 🔴 **CRITICAL:** {item[0]} - {item[1]} ({item[5]})")
            blockers_found = True

    if not blockers_found:
        report_lines.append("- No critical blockers identified.")
    report_lines.append("")

    # Section 3: Metrics
    report_lines.append("## Intelligence Metrics")
    report_lines.append(f"- **Total Active Initiatives:** {len(items)}")
    report_lines.append(f"- **Inbox Items:** {inbox_count}")

    report_lines.append("\n**Distribution by Type:**")
    for t, count in types.items():
        report_lines.append(f"- {t}: {count}")

    report_lines.append("\n**Distribution by Priority:**")
    for p, count in priorities.items():
        report_lines.append(f"- {p}: {count}")

    with open(output_file, 'w') as f:
        f.write("\n".join(report_lines))

    print(f"Status report generated at {output_file}")

if __name__ == "__main__":
    generate_status_report()
