# Compliance Checklist Templates
*Free download — Agent Artifacts*

> Utility · SOC 2, HIPAA, and GDPR compliance checklist templates in YAML and Markdown

---

## About This Download

This is a complete, usable free download from Agent Artifacts.
It covers core use cases for **Compliance Checklist Templates** and works with any major LLM.

**Compatible with:** openai | anthropic

---

## Quick Start

Copy any template below, replace `{{placeholder}}` tokens with your context,
and paste directly into your AI tool of choice.

---

# Compliance Checklist Templates

## Purpose
SOC 2, HIPAA, and GDPR compliance checklist templates in YAML and Markdown

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
