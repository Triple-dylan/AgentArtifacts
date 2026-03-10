# Clause Extraction Skill
**Product ID:** `AA-SKL-LEGAL-CLAUSEEXT-202`
**License:** Commercial use permitted · Single-seat license
**Format:** Markdown + JSON

---

## Overview

Skill for extracting and categorising key clauses from legal documents

This pack covers: `skill_module` workflows.
All prompts use `{{variable}}` placeholder syntax — replace before using.

**Compatible with:** Claude 3.5+, GPT-4o, Gemini 1.5+, any instruction-following LLM

---

## Skill Library

### Section 1 — Skill Configuration

# Clause Extraction Skill

## Configuration
```yaml
skill_id: AA-SKL-LEGAL-CLAUSEEXT-202
version: 1.0.0
mode: production

input_validation:
  strict: true
  schema_version: "2.0"

processing:
  timeout_ms: 30000
  retry_count: 3
  fallback: human_review

output:
  format: json
  include_metadata: true
  confidence_threshold: 0.85
```

---

### Section 2 — Input Schema

## Input Schema
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": ["input", "context"],
  "properties": {
    "input": { "type": "string", "minLength": 1 },
    "context": { "type": "object" },
    "parameters": {
      "type": "object",
      "properties": {
        "mode": { "enum": ["fast", "standard", "thorough"] },
        "threshold": { "type": "number", "minimum": 0, "maximum": 1 }
      }
    }
  }
}
```

---

### Section 3 — Processing Logic

## Processing Pipeline

### Step 1: Input Validation
Validate against schema, normalise encoding, check size limits.

### Step 2: Feature Extraction
Extract relevant features for clause extraction skill processing.

### Step 3: Core Logic
Apply skill_module algorithms with configured thresholds.

### Step 4: Confidence Scoring
Assign confidence scores to each output element.

### Step 5: Output Assembly
Structure results per output schema with metadata.

---

### Section 4 — Error Handling

## Error Handling

| Error Type | Code | Action |
|-----------|------|--------|
| Invalid input | E001 | Return validation errors |
| Timeout | E002 | Retry with backoff |
| Low confidence | E003 | Flag for review |
| Dependency fail | E004 | Use fallback provider |
| Rate limit | E005 | Queue and retry |

---

### Section 5 — Testing

## Test Cases

### Happy Path
```json
{"input": "sample input", "context": {"type": "test"}}
// Expected: 200 OK with valid output
```

### Edge Cases
- Empty input: should return E001
- Oversized input: should return E001 with size details
- Ambiguous input: should return result with low confidence flag

---


## License & Support

- **License:** Commercial · single-seat
- **Support:** [agentartifacts.io/support](https://agentartifacts.io/support)
- **Updates:** Included for 12 months from purchase
