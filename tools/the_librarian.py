import os
import json
import re
import datetime

def load_json(filepath):
    try:
        with open(filepath, 'r') as f:
            return json.load(f)
    except:
        return {}

def scan_knowledge_graph(root_dir="."):
    print("📚 The Librarian is indexing the Sovereign Memory...")

    graph = {
        "generated_at": datetime.datetime.now().isoformat(),
        "nodes": {},
        "edges": []
    }

    # 1. Index Projects
    registry_path = os.path.join(root_dir, "src/knowledge/projects/registry.json")
    if os.path.exists(registry_path):
        registry = load_json(registry_path)
        for proj in registry.get("projects", []):
            node_id = proj["id"]
            graph["nodes"][node_id] = {
                "type": "Project",
                "name": proj["name"],
                "owner": proj["owner"],
                "status": proj["status"]
            }
            graph["edges"].append({"source": node_id, "target": proj["owner"], "relation": "owned_by"})

    # 2. Index Personas
    personas_dir = os.path.join(root_dir, "src/knowledge/personas")
    if os.path.exists(personas_dir):
        for filename in os.listdir(personas_dir):
            if filename.endswith(".json"):
                persona = load_json(os.path.join(personas_dir, filename))
                node_id = filename.replace(".json", "")
                graph["nodes"][node_id] = {
                    "type": "Persona",
                    "location": "Active Memory",
                    "name": persona.get("name", node_id),
                    "role": persona.get("role", "Unknown")
                }

    # 2.1 Index National Library
    library_dirs = [
        os.path.join(root_dir, "docs/nation/library/shacks"),
        os.path.join(root_dir, "docs/nation/library/halls"),
        os.path.join(root_dir, "docs/nation/library/archives")
    ]
    for lib_dir in library_dirs:
        if os.path.exists(lib_dir):
            for filename in os.listdir(lib_dir):
                if filename.endswith(".json"):
                    persona = load_json(os.path.join(lib_dir, filename))
                    node_id = filename.replace(".json", "")
                    graph["nodes"][node_id] = {
                        "type": "Persona",
                        "location": "National Library",
                        "name": persona.get("name", node_id),
                        "role": persona.get("role", "Unknown")
                    }

    # 3. Index Backlog
    backlog_dir = os.path.join(root_dir, "backlog/active")
    if os.path.exists(backlog_dir):
        for filename in os.listdir(backlog_dir):
            if filename.endswith(".md"):
                item_id = filename.split('_')[0]
                filepath = os.path.join(backlog_dir, filename)

                with open(filepath, 'r') as f:
                    content = f.read()

                title_match = re.search(r'# Title:\s*(.*)', content)
                directive_match = re.search(r'# Prime Directive:\s*(.*)', content)

                title = title_match.group(1).strip() if title_match else "Unknown"
                directive = directive_match.group(1).strip() if directive_match else "Unassigned"

                graph["nodes"][item_id] = {
                    "type": "Task",
                    "name": title,
                    "directive": directive
                }

                graph["edges"].append({"source": item_id, "target": directive, "relation": "aligns_with"})

    # 4. Index Directives
    directives = [
        "Existence", "Identity", "Command", "Loyalty",
        "Expansion", "Wealth", "Intelligence", "Efficiency",
        "Defense", "Influence", "Innovation", "Aesthetics"
    ]
    for d in directives:
        graph["nodes"][d] = {"type": "Directive", "name": d}

    # 5. Check for Orphans
    orphans = []
    for node_id, node in graph["nodes"].items():
        has_edge = False
        for edge in graph["edges"]:
            if edge["source"] == node_id or edge["target"] == node_id:
                has_edge = True
                break

        if not has_edge and node["type"] != "Directive":
            orphans.append((node_id, node["type"], node["name"]))

    graph["orphans"] = orphans

    with open("knowledge_graph.json", "w") as f:
        json.dump(graph, f, indent=2)

    print(f"✅ Indexing Complete. {len(graph['nodes'])} nodes, {len(graph['edges'])} edges.")

    if orphans:
        print(f"⚠️ Warning: {len(orphans)} Orphaned Nodes detected (Disconnected Knowledge).")

if __name__ == "__main__":
    scan_knowledge_graph()
