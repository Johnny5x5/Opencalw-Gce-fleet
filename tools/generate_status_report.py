import os
import sys
import datetime
import collections
import json

def generate_status_report(backlog_dir="backlog/active", output_file="STATUS.md"):
    """
    Generates a markdown status report from the backlog items.
    """
    if not os.path.exists(backlog_dir):
        print(f"Error: Directory {backlog_dir} does not exist.")
        return

    report_lines = []
    report_lines.append(f"# State of the Union: {datetime.date.today()}")
    report_lines.append("## Executive Summary")

    # Oracle Integration (Predictive)
    oracle_data = {}
    if os.path.exists("oracle_prediction.json"):
        with open("oracle_prediction.json", "r") as f:
            oracle_data = json.load(f)

    if oracle_data:
        report_lines.append(f"🔮 **The Oracle Predicts:** At current velocity ({oracle_data['velocity']} items/week), the active backlog will be cleared by **{oracle_data['completion_date']}** ({oracle_data['weeks_remaining']} weeks).")
    else:
        report_lines.append("The Conglomerate is operating at nominal capacity. Below is the current status of all strategic initiatives.")

    report_lines.append("")

    # Data Collection
    items = []
    directives = collections.defaultdict(list)
    types = collections.defaultdict(int)
    priorities = collections.defaultdict(int)

    for filename in sorted(os.listdir(backlog_dir)):
        if filename.endswith(".md"):
            filepath = os.path.join(backlog_dir, filename)

            # Extract Metadata
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
            status = "In Progress" # Simplified inference

            item_data = (item_id, metadata['Title'], metadata['Priority'], metadata['Type'], status, metadata['Prime Directive'])
            items.append(item_data)

            directives[metadata['Prime Directive']].append(item_data)
            types[metadata['Type']] += 1
            priorities[metadata['Priority']] += 1

    # Section 1: Strategic Alignment (Grouped by Directive)
    report_lines.append("## Strategic Alignment (The North Star)")
    for directive, group in sorted(directives.items()):
        report_lines.append(f"### {directive}")
        report_lines.append("| ID | Title | Priority | Type | Status | Risk |")
        report_lines.append("|---|---|---|---|---|---|")
        for item in group:
             # Simple Risk inference based on Priority
             risk = "Low"
             if item[2] == "Critical": risk = "**High**"
             elif item[2] == "High": risk = "Medium"

             report_lines.append(f"| {item[0]} | {item[1]} | {item[2]} | {item[3]} | {item[4]} | {risk} |")
        report_lines.append("") # Newline

    # Section 2: Blockers & Risks (Team Black Request)
    report_lines.append("## Critical Risks (Watchlist)")
    blockers_found = False
    for item in items:
        if item[2] == "Critical":
            report_lines.append(f"- 🔴 **CRITICAL:** {item[0]} - {item[1]} ({item[5]})")
            blockers_found = True

    if not blockers_found:
        report_lines.append("- No critical blockers identified.")
    report_lines.append("")

    # Section 3: Metrics (Velocity & Distribution)
    report_lines.append("## Intelligence Metrics")

    # Battle 2 Defense: Inbox Warning (DoS / Flood Risk)
    inbox_count = 0
    if os.path.exists("backlog/inbox"):
        inbox_count = len([f for f in os.listdir("backlog/inbox") if f.endswith(".md")])

    report_lines.append(f"- **Total Active Initiatives:** {len(items)}")
    if inbox_count > 50:
         report_lines.append(f"- ⚠️ **INBOX FLOOD WARNING:** {inbox_count} items in Inbox. Please triage immediately.")
    else:
         report_lines.append(f"- **Inbox Items:** {inbox_count}")

    report_lines.append("\n**Distribution by Type:**")
    for t, count in types.items():
        report_lines.append(f"- {t}: {count}")

    report_lines.append("\n**Distribution by Priority:**")
    for p, count in priorities.items():
        report_lines.append(f"- {p}: {count}")

    # Write to file
    with open(output_file, 'w') as f:
        f.write("\n".join(report_lines))

    print(f"Status report generated at {output_file}")

if __name__ == "__main__":
    generate_status_report()
