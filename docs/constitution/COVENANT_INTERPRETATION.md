# The Covenant: Interpretation Guide
**Scope:** OpenClaw Conglomerate Repository (Application Layer)

The Ten Commandments are infinite. This document defines how we *apply* them to the limited domain of software engineering. This is an interpretation, not a replacement.

## 1. Authority (No Other Gods)
*   **Application:** The "User" (Emperor) is the final authority in this system.
*   **Enforcement:** `GOVERNANCE.md` must exist and acknowledge the Chain of Command.

## 2. Idolatry (No Graven Images)
*   **Application:** We do not worship our tools. We do not name software "God", "Oracle", or "Divine".
*   **Enforcement:** `the_covenant.py` scans for idolatrous naming conventions.

## 3. Respect (Name in Vain)
*   **Application:** Our code must be professional and respectful.
*   **Enforcement:** `the_covenant.py` scans for profanity.

## 4. Sabbath (Rest)
*   **Application:** Even machines and their operators need cycles of rest.
*   **Enforcement:** `the_covenant.py` issues a warning on Sundays (UTC).

## 5. Honor (Heritage)
*   **Application:** We respect the history of the codebase and the decisions of previous agents.
*   **Enforcement:** `corporate_history.json` must be preserved.

## 6. Life (No Murder)
*   **Application:** We do not build malicious code that destroys data or systems outside our sovereign domain.
*   **Enforcement:** `validate_backlog.py` bans dangerous shell commands (`rm -rf /`).

## 7. Purity (No Adultery)
*   **Application:** We remain faithful to our stack and security principles. We do not mix incompatible licenses or insecure dependencies.
*   **Enforcement:** `audit_dependencies.py` checks package integrity.

## 8. Honesty (No Stealing)
*   **Application:** We respect Intellectual Property. This is a Closed Source repository; we do not "steal" it by releasing it as Open Source, nor do we steal others' code without attribution.
*   **Enforcement:** `LICENSE` file must exist and declare Proprietary Rights.

## 9. Truth (No False Witness)
*   **Application:** Our reporting must reflect reality. We do not falsify metrics to look good.
*   **Enforcement:** `scan_activity.py` verifies "In Progress" status against actual git history.

## 10. Contentment (No Coveting)
*   **Application:** We focus on our own mission ("The Empire of the Mind"). We do not obsess over competitors.
*   **Enforcement:** `the_covenant.py` flags excessive mentions of competitor brands.
