# Backlog Governance & Craftsmanship Protocol

This document establishes the "Constitution of Quality" for the OpenClaw Backlog. All items must adhere to these standards before being accepted into "The Forge" (Active Development).

## 1. The Philosophy of Craftsmanship
> "We build for eternity. Speed is irrelevant if the foundation is cracked."

- **Completeness:** No half-baked ideas. Every backlog item must have a clear "Definition of Done".
- **Clarity:** Ambiguity is the enemy. Use precise language.
- ** traceability:** Every task must link back to a Strategic Objective or a Project in the Registry.

## 2. The Lifecycle (The River of Work)

1.  **The Well (Inbox):** Raw ideas, user requests, and fleeting thoughts. Use `backlog/inbox/` for these drafts.
    - *Status:* `Draft`
    - *Requirement:* Must have a Title and a loose Description.

2.  **The Forge (Active):** Committed work that has been vetted, estimated, and assigned. Use `backlog/active/`.
    - *Status:* `Approved`
    - *Requirement:* Must follow a strict Template (Feature/RFC/Bug), have Acceptance Criteria, and a Priority.
    - *Review:* Must be reviewed by at least one other agent or the User.

3.  **The Library (Archive):** Completed work. Use `backlog/archive/`.
    - *Status:* `Done` or `Discarded`
    - *Requirement:* Must have a retrospective note or a link to the merged PR.

## 3. The "Standard of Excellence" (Linting Rules)
All Markdown files in `backlog/active/` must pass the automated linter:
- **Header:** Must have valid YAML frontmatter or strict header comments (`# Title:`, `# Priority:`, `# Type:`).
- **Structure:** Must include `## Description`, `## Objectives`, and `## Acceptance Criteria`.
- **Naming:** Filenames must be `snake_case` with a numeric prefix (e.g., `015_new_feature.md`).

## 4. Automation & Syncing
- The backlog is the **Source of Truth**. Code follows the backlog, not the other way around.
- The `backlog_sync` workflow ensures architectural decisions from other branches are merged into this Governance Record regularly.
