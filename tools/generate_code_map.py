import os
import json
import datetime

def get_file_stats(filepath):
    """Returns basic stats: Lines of Code, Size, Last Mod."""
    try:
        stat = os.stat(filepath)
        size = stat.st_size
        mtime = datetime.datetime.fromtimestamp(stat.st_mtime).isoformat()

        with open(filepath, 'r', errors='ignore') as f:
            loc = sum(1 for _ in f)

        return {"size": size, "loc": loc, "mtime": mtime}
    except Exception:
        return {"size": 0, "loc": 0, "mtime": "Unknown"}

def generate_code_map(root_dir="."):
    """
    The Cartographer: Maps the repository structure and complexity.
    """
    print("🗺️ The Cartographer is mapping the territory...")

    code_map = {
        "generated_at": datetime.datetime.now().isoformat(),
        "structure": {}
    }

    ignore_dirs = {".git", "node_modules", "__pycache__", ".terraform"}

    total_files = 0
    total_loc = 0

    for root, dirs, files in os.walk(root_dir):
        # Filter directories
        dirs[:] = [d for d in dirs if d not in ignore_dirs]

        current_node = code_map["structure"]
        path_parts = os.path.relpath(root, root_dir).split(os.sep)

        # Navigate/Create JSON tree
        for part in path_parts:
            if part == ".": continue
            if part not in current_node:
                current_node[part] = {}
            current_node = current_node[part]

        # Process Files
        for file in files:
            if file.startswith("."): continue # Skip hidden files

            filepath = os.path.join(root, file)
            stats = get_file_stats(filepath)

            current_node[file] = stats
            total_files += 1
            total_loc += stats["loc"]

    # Summary Metrics
    code_map["metrics"] = {
        "total_files": total_files,
        "total_loc": total_loc
    }

    # Save JSON Map (For AI)
    with open("code_map.json", "w") as f:
        json.dump(code_map, f, indent=2)

    # Generate Markdown Map (For Humans)
    with open("CODE_MAP.md", "w") as f:
        f.write(f"# Repository Map\n**Generated:** {code_map['generated_at']}\n")
        f.write(f"**Total Files:** {total_files} | **Total LOC:** {total_loc}\n\n")
        f.write("## Structure\n")

        def walk_tree(node, level=0):
            indent = "  " * level
            for key, value in sorted(node.items()):
                if "loc" in value: # It's a file
                    f.write(f"{indent}- 📄 **{key}** (LOC: {value['loc']})\n")
                else: # It's a folder
                    f.write(f"{indent}- 📂 **{key}/**\n")
                    walk_tree(value, level + 1)

        walk_tree(code_map["structure"])

    print(f"✅ Mapping Complete. {total_files} files, {total_loc} lines of code.")

if __name__ == "__main__":
    generate_code_map()
