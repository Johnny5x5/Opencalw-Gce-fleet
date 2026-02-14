import os
import sys
import datetime

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
    report_lines.append("The Conglomerate is operating at nominal capacity. Below is the current status of all strategic initiatives.\n")

    report_lines.append("| ID | Title | Priority | Type | Status |")
    report_lines.append("|---|---|---|---|---|")

    items = []
    for filename in sorted(os.listdir(backlog_dir)):
        if filename.endswith(".md"):
            filepath = os.path.join(backlog_dir, filename)

            # Extract Metadata
            metadata = {'Title': 'Unknown', 'Priority': 'Unknown', 'Type': 'Unknown'}
            try:
                with open(filepath, 'r') as f:
                    for line in f:
                        if line.startswith('# Title:'): metadata['Title'] = line.split(':', 1)[1].strip()
                        if line.startswith('# Priority:'): metadata['Priority'] = line.split(':', 1)[1].strip()
                        if line.startswith('# Type:'): metadata['Type'] = line.split(':', 1)[1].strip()
                        if all(v != 'Unknown' for v in metadata.values()): break
            except Exception:
                continue

            item_id = filename.split('_')[0]
            # Infer status (simplified: if in 'active', it's In Progress/Todo)
            status = "In Progress"

            items.append((item_id, metadata['Title'], metadata['Priority'], metadata['Type'], status))

    for item in items:
        report_lines.append(f"| {item[0]} | {item[1]} | {item[2]} | {item[3]} | {item[4]} |")

    report_lines.append("\n## Metrics")
    report_lines.append(f"- **Total Active Initiatives:** {len(items)}")

    # Write to file
    with open(output_file, 'w') as f:
        f.write("\n".join(report_lines))

    print(f"Status report generated at {output_file}")

if __name__ == "__main__":
    generate_status_report()
