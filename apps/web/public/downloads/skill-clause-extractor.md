# Clause Extraction Skill
*Free download — Agent Artifacts*

> Skill · Skill for extracting and categorising key clauses from legal documents

---

## About This Download

This is a complete, usable free download from Agent Artifacts.
It covers core use cases for **Clause Extraction Skill** and works with any major LLM.

**Compatible with:** openai | anthropic | langchain

---

## Quick Start

Copy any template below, replace `{{placeholder}}` tokens with your context,
and paste directly into your AI tool of choice.

---

# Clause Extraction Skill

## Purpose
Skill for extracting and categorising key clauses from legal documents

## Input Schema
```json
{
  "input": "{{input}}",
  "parameters": {
    "mode": "standard",
    "threshold": 0.8
  }
}
```

---

## Processing Steps
1. Validate input against schema
2. Apply clause extraction skill logic
3. Score and rank results
4. Return structured output

## Error Handling
- Invalid input: return validation error with specifics
- Timeout: retry with exponential backoff
- Ambiguous result: flag for human review

---

## Output Schema
```json
{
  "result": "{{result}}",
  "confidence": 0.95,
  "metadata": {
    "processing_time_ms": 120,
    "model_version": "1.0"
  }
}
```

---


## License

Free for personal and commercial use. Attribution appreciated but not required.
Visit [agentartifacts.io](https://agentartifacts.io) for premium assets.
