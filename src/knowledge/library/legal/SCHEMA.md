# The Sovereign Law Object Schema (v1.0)

Every legal document in the National Library must adhere to this strict JSON/Markdown structure.
This ensures that the **Rust Guardian** can validate it and the **Librarian AI** can index it.

## The Structure (Markdown + YAML Frontmatter)

```markdown
---
id: "urn:lex:sovereign:decree:penal_code:title_1"
title: "The Jubilee & Anti-Profit Act"
jurisdiction: "Sovereign"
version: "1.0"
license: "CC-BY-SA-4.0"
provenance_type: "Human-Verified"
signature_algorithm: "ed25519"
intent_uri: "./penal_code_title_1.intent.md"
max_sentence_years: 7
corporal_punishment_allowed: true
rehabilitation_required: true
capital_punishment_allowed: true

moral_vectors:
  harm: 950
  fairness: 800
  loyalty: 1000
  authority: 500
  purity: 750
  liberty: 900

territorial_scope: "Universal"
---

# Title 1: The Penal Code of the Sovereign Digital Nation

## Section 101: The Jubilee Protocol (Maximum Sentence)
No sentence of incarceration shall exceed seven (7) years...
```

## Field Definitions

*   `id`: Unique Resource Name (URN). Must start with `urn:lex:`.
*   `jurisdiction`: "Sovereign" or "Foreign".
*   `intent_uri`: Required for Sovereign laws. Links to the "Why".
*   `max_sentence_years`: Must be <= 7 (Jubilee Rule).
*   `moral_vectors`: Integrity 0-1000 for AI weighting.
