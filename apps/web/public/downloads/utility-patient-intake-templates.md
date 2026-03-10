# Patient Intake Form Templates
*Free download — Agent Artifacts*

> Utility · Structured patient intake and medical history form templates

---

## About This Download

This is a complete, usable free download from Agent Artifacts.
It covers core use cases for **Patient Intake Form Templates** and works with any major LLM.

**Compatible with:** openai | anthropic

---

## Quick Start

Copy any template below, replace `{{placeholder}}` tokens with your context,
and paste directly into your AI tool of choice.

---

# Patient Intake Form Templates

## Purpose
Structured patient intake and medical history form templates

## Quick Start
1. Copy the template below
2. Replace {{placeholders}} with your values
3. Customise sections as needed

---

## Template

```yaml
name: {{project_name}}
version: 1.0.0
type: utility_module

configuration:
  mode: standard
  output_format: json

steps:
  - name: init
    action: validate_input
  - name: process
    action: transform
  - name: output
    action: deliver_result
```

---

## Customisation

- **Mode**: Choose `standard`, `strict`, or `lenient`
- **Output**: Supports `json`, `yaml`, `csv`, and `markdown`
- **Steps**: Add, remove, or reorder processing steps
- **Validation**: Configure input validation rules per field

---


## License

Free for personal and commercial use. Attribution appreciated but not required.
Visit [agentartifacts.io](https://agentartifacts.io) for premium assets.
