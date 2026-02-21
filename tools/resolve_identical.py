import subprocess
import os

def get_unmerged_files():
    try:
        output = subprocess.check_output(["git", "ls-files", "-u"], text=True)
        files = set()
        for line in output.splitlines():
            if line:
                parts = line.split('\t')
                if len(parts) > 1:
                    files.add(parts[1])
        return list(files)
    except subprocess.CalledProcessError:
        return []

def get_file_content(filepath, stage):
    # stage 2 = ours (HEAD), 3 = theirs (MERGE_HEAD)
    try:
        return subprocess.check_output(["git", "show", f":{stage}:{filepath}"], stderr=subprocess.DEVNULL)
    except subprocess.CalledProcessError:
        return None

def resolve_identical():
    files = get_unmerged_files()
    print(f"Found {len(files)} unmerged files.")

    resolved_count = 0
    conflict_count = 0

    for filepath in files:
        content_ours = get_file_content(filepath, 2)
        content_theirs = get_file_content(filepath, 3)

        if content_ours is None and content_theirs is None:
            # Both deleted?
            continue

        if content_ours == content_theirs:
            print(f"Resolving identical: {filepath}")
            # Checkout ours (or theirs, doesn't matter) and add
            subprocess.run(["git", "checkout", "--ours", filepath], check=True)
            subprocess.run(["git", "add", filepath], check=True)
            resolved_count += 1
        else:
            print(f"Conflict remains: {filepath}")
            conflict_count += 1

    print(f"Resolved {resolved_count} identical files.")
    print(f"Remaining conflicts: {conflict_count}")

if __name__ == "__main__":
    resolve_identical()
