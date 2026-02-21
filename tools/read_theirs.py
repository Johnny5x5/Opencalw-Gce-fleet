import subprocess
import sys

def read_theirs(filepath):
    try:
        # MERGE_HEAD is usually available during merge.
        # But git show :3:filepath is safer for unmerged files.
        content = subprocess.check_output(["git", "show", f":3:{filepath}"], text=True, stderr=subprocess.DEVNULL)
        print(content)
    except Exception as e:
        print(f"Error reading {filepath}: {e}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        read_theirs(sys.argv[1])
