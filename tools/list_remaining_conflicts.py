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
        return sorted(list(files))
    except subprocess.CalledProcessError:
        return []

def get_file_content(filepath, stage):
    try:
        return subprocess.check_output(["git", "show", f":{stage}:{filepath}"], stderr=subprocess.DEVNULL)
    except subprocess.CalledProcessError:
        return None

def main():
    files = get_unmerged_files()

    with open("conflicts.txt", "w") as f:
        for filepath in files:
            content_ours = get_file_content(filepath, 2)
            content_theirs = get_file_content(filepath, 3)

            if content_ours != content_theirs:
                f.write(f"{filepath}\n")

if __name__ == "__main__":
    main()
