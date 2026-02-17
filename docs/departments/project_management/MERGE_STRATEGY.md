# Merge Strategy: The Fortress to Main

**Status:** High Risk (Unrelated Histories)
**Source:** `feature/backlog-management`
**Target:** `main`

## The Conflict Zones
We anticipate conflicts in the following core files:

1.  **`README.md`**
    - *Source:* Heavily modified to point to PMO docs.
    - *Target:* Likely the original "Opencalw-Gce-fleet" text.
    - *Resolution:* **Accept Source (The Fortress).** The new README is the superior entry point.

2.  **`terraform/main.tf`**
    - *Source:* Added `google_project_iam_custom_role.pmo_enforcer`.
    - *Target:* Infrastructure definitions.
    - *Resolution:* **Manual Merge.** Ensure the new IAM role is appended, not overwriting existing modules.

3.  **`cloudbuild.yaml`**
    - *Source:* Added `the_covenant.py` and `validate_backlog.py` steps.
    - *Target:* Build steps.
    - *Resolution:* **Manual Merge.** Insert the Governance steps at the *start* of the pipeline (Step 0).

## The Grafting Protocol
Since the histories are unrelated, use the following command sequence:

```bash
# 1. Checkout Main
git checkout main

# 2. Pull latest
git pull origin main

# 3. Merge with allowance
git merge feature/backlog-management --allow-unrelated-histories

# 4. Resolve Conflicts
# (Accept 'feature/backlog-management' for README.md)
# (Carefully merge main.tf and cloudbuild.yaml)

# 5. Commit
git commit -m "merge: Integrate PMO Fortress into Main"
```

## The Payload (New Assets)
The following directories are **Safe to Add** (No conflict expected):
- `backlog/` (The entire PMO structure)
- `tools/` (The Defense System)
- `docs/nation/library/` (The National Library)
- `docs/constitution/` (The Law)
- `.github/workflows/` (The Citadel Automation)
