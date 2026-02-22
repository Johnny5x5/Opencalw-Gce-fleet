# The Historical Schema (v1.0)

Historical records must follow this schema to ensure chronological accuracy and cryptographic provenance.

## Structure

```markdown
---
id: "urn:lex:historical:event:name"
title: "Event Name"
date: "YYYY-MM-DD"
type: "Founding" | "Battle" | "Discovery" | "Biography"
participants: ["urn:lex:person:name"]
provenance_hash: "sha256:..."
---

# Event Description

## Context
What led to this event?

## The Occurrence
What actually happened? (Facts only).

## Impact
How did this shape the Sovereign Nation?
```
