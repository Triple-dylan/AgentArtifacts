# Brief Scoring Skill
*Free download — Agent Artifacts*

> ⚙️ **Skill** · Quality scoring skill for marketing briefs

---

## About This Download

This is a complete, usable free download from Agent Artifacts.
It covers core use cases for **Brief Scoring Skill** and works with any major LLM.

**Compatible with:** Claude (Anthropic), GPT-4o (OpenAI), Cursor, LangChain, LangGraph

---

## Skill Definition

```markdown
# Skill: Brief Scoring Skill v1.0

## Purpose
Quality scoring skill for marketing briefs

## Input Schema
```json
{
  "input": "string (required) — primary input for this skill",
  "context": "string (optional) — additional context",
  "options": "object (optional) — skill-specific configuration"
}
```

## Output Schema
```json
{
  "result": "string — primary output",
  "confidence": "number (0-1) — confidence in the output",
  "metadata": "object — additional information about the result"
}
```

## System Prompt
```
You are a specialised skill module for brief scoring.
When given an input, process it carefully and return a structured JSON response
matching the output schema exactly. Be precise and consistent.
```
```

---

## License

This free download is provided under the Agent Artifacts free content license.
You may use it in your own projects commercially.
You may not redistribute or resell this file.

---

*Full version available at [agentartifacts.io/products/skill-marketing-brief-scoring](https://agentartifacts.io/products/skill-marketing-brief-scoring)*

*Browse the full catalog at [agentartifacts.io/catalog](https://agentartifacts.io/catalog)*
