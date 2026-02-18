# The Council Chamber
**Package:** `council-chamber`
**Version:** 0.1.0
**Description:** A multi-agent simulation environment for the Sovereign Digital Nation's Tri-Council (War Council, Chaplaincy, Scribes).

## Usage

```javascript
const { Facilitator } = require('council-chamber');

const facilitator = new Facilitator();

// 1. Register Agents (Scribes, Generals, Chaplains)
facilitator.registerScribe('The Chronicler', 'Historian', 'Solemn', logicFn);
facilitator.registerWarCouncil('General Red', 'Aggressor', 'Bold', logicFn);
facilitator.registerChaplain('The Chaplain', 'Auditor', 'Righteous', logicFn);

// 2. Run a Session
await facilitator.session('Should we invade the Meta ecosystem?');
```

## Architecture
*   **Chamber:** The message bus and event log.
*   **Agent:** The base class for all participants.
*   **Facilitator:** The orchestrator of the "Session" phases (Context -> Debate -> Audit -> Edict).

## Integration
This package is the "Twist" component of the **Mobius Decision Engine** (`packages/mobius-engine`).
