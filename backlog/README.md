# OpenClaw Autonomous Backlog

This directory serves as the "Queuing System" for the Conglomerate.

## How to add a task
1.  Create a Markdown file in `backlog/` (e.g., `004_fix_typo.md`).
2.  Use the format below.

## Format
```markdown
# Title: [Task Name]
# Priority: [High/Medium/Low]
# Type: [Feature/Bug/Architecture]

## Description
What needs to be done.

## Acceptance Criteria
- [ ] Requirement 1
- [ ] Requirement 2
```

## Lifecycle
1.  **Pending:** File exists in `backlog/`.
2.  **In Progress:** Agent picks it up (File locked/renamed).
3.  **Done:** File moved to `backlog/archive/`.
