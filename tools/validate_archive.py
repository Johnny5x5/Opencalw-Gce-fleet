import os
import re

def validate_archive(archive_dir="backlog/archive"):
    """
    Legion 5 Defense: The Historians (Data Integrity)
    Ensures all archived files are readable and contain a valid Archive Date.
    """
    if not os.path.exists(archive_dir):
        print(f"Archive directory {archive_dir} not found. Skipping.")
        return

    corrupt_files = 0
    checked_files = 0

    for filename in os.listdir(archive_dir):
        if filename.endswith(".md"):
            filepath = os.path.join(archive_dir, filename)
            checked_files += 1

            try:
                with open(filepath, 'r') as f:
                    content = f.read()

                # Check 1: Can we read it? (Implicit in open/read)

                # Check 2: Does it have the Archive Stamp?
                if not re.search(r'# Archived: \d{4}-\d{2}-\d{2}', content):
                    print(f"⚠️ Warning: {filename} missing Archive Timestamp.")
                    corrupt_files += 1

            except Exception as e:
                print(f"🚨 Error: Could not read {filename}: {e}")
                corrupt_files += 1

    if corrupt_files > 0:
        print(f"The Historians found {corrupt_files} damaged scrolls in the Library.")
        # In a real system, we might alert Ops or try to repair.
    else:
        print(f"The Library is pristine. {checked_files} scrolls verified.")

if __name__ == "__main__":
    validate_archive()
