# Onboarding Flow Templates
**Product ID:** `AA-UTL-HR-ONBOARDFLOW-204`
**License:** Commercial use permitted · Single-seat license
**Format:** Markdown + JSON

---

## Overview

Structured onboarding checklists and 30-60-90 day plan templates

This pack covers: `utility_module` workflows.
All prompts use `{{variable}}` placeholder syntax — replace before using.

**Compatible with:** Claude 3.5+, GPT-4o, Gemini 1.5+, any instruction-following LLM

---

## Utility Library

### Section 1 — Template Pack

# Onboarding Flow Templates

## Templates Included

### Template 1: Standard Configuration
```yaml
name: {{project}}
version: 1.0.0
configuration:
  mode: production
  validation: strict
  output: json
```

### Template 2: Advanced Configuration
```yaml
name: {{project}}
version: 1.0.0
configuration:
  mode: production
  validation: strict
  output: json
  plugins:
    - name: validator
    - name: transformer
    - name: reporter
```

---

### Section 2 — Schema Definitions

## Schemas

### Input Schema
```json
{
  "type": "object",
  "required": ["name", "config"],
  "properties": {
    "name": {"type": "string"},
    "config": {"type": "object"},
    "metadata": {"type": "object"}
  }
}
```

### Output Schema
```json
{
  "type": "object",
  "properties": {
    "result": {"type": "string"},
    "status": {"enum": ["success", "warning", "error"]},
    "details": {"type": "array"}
  }
}
```

---

### Section 3 — Usage Guide

## Usage

1. Select the appropriate template
2. Replace all `{{placeholder}}` values
3. Validate against the provided schema
4. Integrate into your workflow

## Customisation

All templates support:
- Custom field additions
- Conditional sections
- Multi-format export (JSON, YAML, Markdown)

---


## License & Support

- **License:** Commercial · single-seat
- **Support:** [agentartifacts.io/support](https://agentartifacts.io/support)
- **Updates:** Included for 12 months from purchase
