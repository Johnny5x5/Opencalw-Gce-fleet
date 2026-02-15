import os
import re
import urllib.request

def check_dead_links(backlog_dir="backlog/active"):
    """
    Legion 9 Defense: The Zombies (Dead Links)
    Scans backlog for broken URLs (404s).
    """
    if not os.path.exists(backlog_dir):
        return

    url_regex = r'https?://[^\s)"]+'
    broken_links = 0
    checked_links = 0

    # Cache to avoid duplicate checks
    link_cache = {}

    print("Hunting Zombies (Dead Links)...")

    for filename in os.listdir(backlog_dir):
        if filename.endswith(".md"):
            filepath = os.path.join(backlog_dir, filename)
            with open(filepath, 'r') as f:
                content = f.read()

            urls = re.findall(url_regex, content)
            for url in urls:
                if url in link_cache:
                    if not link_cache[url]:
                        print(f"💀 Zombie Link in {filename}: {url}")
                        broken_links += 1
                    continue

                checked_links += 1
                try:
                    # HEAD request to save bandwidth
                    req = urllib.request.Request(url, method='HEAD')
                    with urllib.request.urlopen(req, timeout=5) as response:
                        if response.getcode() >= 400:
                            print(f"💀 Zombie Link in {filename}: {url} ({response.getcode()})")
                            link_cache[url] = False
                            broken_links += 1
                        else:
                            link_cache[url] = True
                except urllib.error.HTTPError as e:
                     print(f"💀 Zombie Link in {filename}: {url} ({e.code})")
                     link_cache[url] = False
                     broken_links += 1
                except Exception as e:
                     print(f"⚠️ Warning: Could not check {url}: {e}")
                     # Don't count network errors as broken links immediately
                     pass

    if broken_links > 0:
        print(f"Legion 9 Defense Triggered: {broken_links} Dead Links found.")
    else:
        print(f"All {checked_links} links appear alive.")

if __name__ == "__main__":
    check_dead_links()
