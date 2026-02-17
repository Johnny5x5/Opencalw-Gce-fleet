import os
import difflib

def detect_duplicates(backlog_dir="backlog/active"):
    if not os.path.exists(backlog_dir):
        return

    titles = []
    for filename in os.listdir(backlog_dir):
        if filename.endswith(".md"):
            filepath = os.path.join(backlog_dir, filename)
            with open(filepath, 'r') as f:
                for line in f:
                    if line.startswith('# Title:'):
                        title = line.split(':', 1)[1].strip()
                        titles.append((title, filename))
                        break

    duplicates = 0
    checked = set()
    print("Scanning for Clones (Duplicate Tickets)...")

    for i in range(len(titles)):
        for j in range(i + 1, len(titles)):
            title1, file1 = titles[i]
            title2, file2 = titles[j]

            if file1 in checked or file2 in checked:
                continue

            similarity = difflib.SequenceMatcher(None, title1.lower(), title2.lower()).ratio()

            if similarity > 0.85:
                print(f"👯 CLONE DETECTED: '{title1}' ({file1}) is {int(similarity*100)}% similar to '{title2}' ({file2})")
                duplicates += 1
                checked.add(file2)

    if duplicates > 0:
        print(f"Legion 10 Defense Triggered: {duplicates} clones found.")
    else:
        print("No clones detected. The gene pool is diverse.")

if __name__ == "__main__":
    detect_duplicates()
