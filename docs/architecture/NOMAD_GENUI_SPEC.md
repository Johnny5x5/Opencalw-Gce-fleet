# NomadOS Generative UI (GenUI) Specification
## The Interface That Codes Itself

### 1. Overview
GenUI is the rendering engine of NomadOS. Unlike traditional toolkits (GTK, Qt, Android View) which rely on static XML/Declarative layouts, GenUI uses a **Large Language Model (LLM)** to hallucinate the interface in real-time based on the user's intent and context.

### 2. The UIDL (User Interface Description Language)
The NPU does not output pixels. It outputs **UIDL**, a compact JSON format describing the *intent* of the interface.

**Example UIDL:**
```json
{
  "intent": "ride_request",
  "layout": "vertical_stack",
  "elements": [
    { "type": "map_view", "center": "current_location", "marker": "airport_lax" },
    { "type": "text", "style": "h1", "content": "Ride to LAX" },
    { "type": "row", "elements": [
      { "type": "button", "action": "select_uber", "label": "$45 (Uber)" },
      { "type": "button", "action": "select_lyft", "label": "$42 (Lyft)" }
    ]}
  ]
}
```

### 3. The GenUI Pipeline
1.  **Intent Detection:** User speaks/types. The **Scout AI** identifies the intent (`ride_request`).
2.  **Context Retrieval:** The **Librarian** fetches relevant data (Current GPS, Saved Locations, API Keys for Uber/Lyft).
3.  **Hallucination (NPU):** The GenUI Model (Specialized 3B Model) generates the UIDL JSON.
4.  **Rendering (GPU):** The **Compositor (Rust)** parses the UIDL and draws high-performance vectors/widgets using the GPU (Vulkan/Metal).
5.  **Interaction:** When the user clicks, the event is fed back to the AI Loop.

### 4. Component Library (The "Legos")
The GenUI Model is trained on a specific set of "Atomic Components" it can assemble:
*   **Input:** `text_field`, `voice_recorder`, `slider`.
*   **Display:** `map`, `image`, `markdown`, `chart`.
*   **Action:** `button`, `toggle`, `gesture_area`.

### 5. Polymorphic Adaptation
*   **Phone Mode:** The NPU is prompted with `"constraint": "mobile_portrait"`. It generates a vertical stack.
*   **Station Mode:** The NPU is prompted with `"constraint": "desktop_wide"`. It generates a multi-pane dashboard.

### 6. Latency Budget
*   **Intent to UIDL:** < 50ms (NPU).
*   **UIDL to Pixels:** < 16ms (GPU).
*   **Total Response:** < 100ms (Perceptible "Instant").
