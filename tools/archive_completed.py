import os
import shutil
import datetime

def archive_completed_items(backlog_dir="backlog/active", archive_dir="backlog/archive"):
    if not os.path.exists(backlog_dir) or not os.path.exists(archive_dir):
        return

    today = datetime.date.today().isoformat()
    moved_count = 0

    for filename in os.listdir(backlog_dir):
        if filename.endswith(".md"):
            filepath = os.path.join(backlog_dir, filename)

            with open(filepath, 'r') as f:
                content = f.read()

            open_tasks = content.count("- [ ]")
            closed_tasks = content.count("- [x]")

            is_done = False

            if "# Status: Done" in content:
                is_done = True

            # Defense 3: The Assassin (Prevent Empty Archive)
            elif open_tasks == 0 and closed_tasks > 0:
                is_done = True

            if is_done:
                print(f"Archiving {filename}...")
                with open(filepath, 'a') as f:
                    f.write(f"\n# Archived: {today}\n")
                shutil.move(filepath, os.path.join(archive_dir, filename))
                moved_count += 1

    if moved_count > 0:
        print(f"The Archivist has moved {moved_count} items to the Library.")
    else:
        print("The Archivist found no completed scrolls today.")

if __name__ == "__main__":
    archive_completed_items()
