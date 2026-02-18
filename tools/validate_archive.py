import os
import re

def validate_archive(archive_dir="backlog/archive"):
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

                # Check 2: Does it have the Archive Stamp?
                match = re.search(r'# Archived: (\d{4})-\d{2}-\d{2}', content)
                if not match:
                    print(f"⚠️ Warning: {filename} missing Archive Timestamp.")
                    corrupt_files += 1
                else:
                    year = int(match.group(1))
                    if year < 2020 or year > 2050:
                        print(f"⚠️ Warning: {filename} has improbable archive year ({year}). Temporal anomaly detected.")
                        corrupt_files += 1

            except Exception as e:
                print(f"🚨 Error: Could not read {filename}: {e}")
                corrupt_files += 1

    if corrupt_files > 0:
        print(f"The Historians found {corrupt_files} damaged scrolls in the Library.")
    else:
        print(f"The Library is pristine. {checked_files} scrolls verified.")

if __name__ == "__main__":
    validate_archive()
