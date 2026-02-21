import subprocess

def check_status():
    try:
        output = subprocess.check_output(["git", "status", "--porcelain"], text=True)
        unmerged = 0
        total = 0
        lines = output.splitlines()
        for line in lines:
            total += 1
            if line.startswith("UU") or line.startswith("AA") or line.startswith("DU") or line.startswith("UD"):
                unmerged += 1
        print(f"Total changed files: {total}")
        print(f"Unmerged files: {unmerged}")

        if unmerged > 0:
            print("Unmerged files list (limited):")
            count = 0
            for line in lines:
                if line.startswith("UU") or line.startswith("AA"):
                    print(line)
                    count += 1
                    if count >= 10:
                        break
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_status()
