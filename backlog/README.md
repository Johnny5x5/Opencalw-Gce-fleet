# OpenClaw Autonomous Backlog

This directory serves as the "Queuing System" for the Conglomerate.

## Governance
Please refer to [GOVERNANCE.md](./GOVERNANCE.md) for strict rules on how to contribute to this backlog.

## Directory Structure
- **[inbox/](./inbox/)**: The Well. Raw ideas and drafts.
- **[active/](./active/)**: The Forge. Approved work ready for execution.
- **[archive/](./archive/)**: The Library. Completed or discarded work.
- **[templates/](./templates/)**: Standardized templates for Features, RFCs, and Bugs.

## Automation
- A **Linter** runs on every push to verify that files in `active/` meet the [Standard of Excellence](../tools/validate_backlog.py).
- The `backlog_sync` workflow automatically merges architectural updates from the trunk every 2 days.
