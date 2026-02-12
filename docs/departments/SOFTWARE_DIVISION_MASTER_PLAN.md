# Software Division Master Plan

**Objective:** To achieve 100% self-replication capability within 30 days.

## 1. The Infrastructure (Factory)
*   **Pipeline:** Cloud Build (CI/CD) is the heart. Every commit triggers a deploy.
*   **Environment:** "Low Security" Dev Env (Level 1) allows direct npm/pip access for speed.
*   **Tools:** Agents use `google-code-studio` to edit this very repository.

## 2. The Agent (Co-Founder)
*   **Persona:** "Jules" (Engineering Lead).
*   **Capabilities:**
    *   Reads `backlog/` for tasks.
    *   Reads `docs/` for context.
    *   Writes code to `terraform/` and `src/`.
    *   Commits changes -> Triggers Pipeline -> Updates Self.

## 3. Fractal Scaling Strategy
1.  **Phase 1 (Bootstrap):** Agent can edit its own skills (done).
2.  **Phase 2 (Expansion):** Agent can define *new* departments in Terraform.
3.  **Phase 3 (Optimization):** Agent uses BigQuery logs to refactor expensive code.

## 4. The Loop
1.  Human writes Idea in `backlog/idea.md`.
2.  Agent reads Idea.
3.  Agent writes Code.
4.  Agent commits Code.
5.  Cloud Build deploys Code.
6.  Agent wakes up smarter.
