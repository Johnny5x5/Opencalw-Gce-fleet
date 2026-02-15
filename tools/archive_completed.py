import os
import shutil
import datetime

def archive_completed_items(backlog_dir="backlog/active", archive_dir="backlog/archive"):
    """
    Moves completed backlog items to the archive.
    An item is "Completed" if all checkboxes are checked OR if it has `# Status: Done` metadata.
    """
    if not os.path.exists(backlog_dir) or not os.path.exists(archive_dir):
        return

    today = datetime.date.today().isoformat()
    moved_count = 0

    for filename in os.listdir(backlog_dir):
        if filename.endswith(".md"):
            filepath = os.path.join(backlog_dir, filename)

            with open(filepath, 'r') as f:
                content = f.read()

            # Check if all tasks are done
            # A task is "- [ ]" (open). If none exist, but "- [x]" exist, it's done.
            open_tasks = content.count("- [ ]")
            closed_tasks = content.count("- [x]")

            is_done = False

            # Condition 1: Explicit Status
            if "# Status: Done" in content:
                is_done = True

            # Condition 2: All tasks checked (and at least one task existed)
            # Defense 3: The Assassin (Prevent Empty Archive)
            # Ensure there is at least one closed task.
            elif open_tasks == 0 and closed_tasks > 0:
                is_done = True

            if is_done:
                print(f"Archiving {filename}...")

                # Append Archive Date
                with open(filepath, 'a') as f:
                    f.write(f"\n# Archived: {today}\n")

                # Move file
                shutil.move(filepath, os.path.join(archive_dir, filename))
                moved_count += 1

    if moved_count > 0:
        print(f"The Archivist has moved {moved_count} items to the Library.")
    else:
        print("The Archivist found no completed scrolls today.")

if __name__ == "__main__":
    archive_completed_items()
