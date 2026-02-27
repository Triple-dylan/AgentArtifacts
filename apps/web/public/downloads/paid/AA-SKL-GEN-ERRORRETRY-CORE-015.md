# Error Retry Skill Module
**Product ID:** `AA-SKL-GEN-ERRORRETRY-CORE-015`  
**License:** Commercial use permitted · Single-seat license  
**Version:** 1.0.0

---

## Overview

Retry timeout and fallback patterns

This skill module provides a standardised interface for integrating AI-powered
`error retry` capabilities into any agent workflow.

---

## Skill Definition

```markdown
# Skill: Error Retry Skill Module v1.0

## Purpose
Retry timeout and fallback patterns

## Input Schema
```json
{
  "type": "object",
  "required": [
    "input"
  ],
  "properties": {
    "input": {
      "type": "string",
      "description": "Primary input for this skill"
    },
    "context": {
      "type": "string",
      "description": "Optional background context"
    },
    "config": {
      "type": "object",
      "description": "Skill configuration options",
      "properties": {
        "output_format": {
          "type": "string",
          "enum": [
            "json",
            "markdown",
            "text"
          ],
          "default": "json"
        },
        "detail_level": {
          "type": "string",
          "enum": [
            "brief",
            "standard",
            "detailed"
          ],
          "default": "standard"
        },
        "max_tokens": {
          "type": "integer",
          "default": 2048
        }
      }
    }
  }
}
```

## Output Schema
```json
{
  "type": "object",
  "required": [
    "result",
    "status"
  ],
  "properties": {
    "result": {
      "type": "object",
      "description": "Skill output data"
    },
    "status": {
      "type": "string",
      "enum": [
        "success",
        "partial",
        "error"
      ]
    },
    "confidence": {
      "type": "number",
      "minimum": 0,
      "maximum": 1
    },
    "metadata": {
      "type": "object",
      "properties": {
        "model_used": {
          "type": "string"
        },
        "tokens_used": {
          "type": "integer"
        },
        "latency_ms": {
          "type": "integer"
        }
      }
    }
  }
}
```
```

---

## System Prompt

```
You are a specialised AI skill module for error retry.
Your job is to process the provided input and return a structured, high-quality result.

Rules:
- Be precise and consistent in your output format
- Return valid JSON matching the output schema exactly
- If input is ambiguous, make the most reasonable interpretation and note it in metadata
- Never fabricate data — if information is missing, indicate it clearly
- Optimise for correctness over verbosity
```

---

## Implementation

### Python (Anthropic SDK)

```python
import anthropic
import json

client = anthropic.Anthropic()

SKILL_SYSTEM_PROMPT = """You are a specialised AI skill module for error retry.
Process the input and return structured JSON matching the output schema."""

def run_skill(input_text: str, context: str = "", config: dict = None) -> dict:
    config = config or {}
    user_message = f"Input: {input_text}"
    if context:
        user_message += f"\n\nContext: {context}"

    response = client.messages.create(
        model="claude-opus-4-6",
        max_tokens=config.get("max_tokens", 2048),
        system=SKILL_SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_message}]
    )

    try:
        return json.loads(response.content[0].text)
    except json.JSONDecodeError:
        return {"result": response.content[0].text, "status": "success"}


# Usage
result = run_skill(
    input_text="Your input here",
    context="Optional context",
)
print(json.dumps(result, indent=2))
```

### Claude Code (Skill File)

Save as `.claude/skills/skill-error-retry.md` and invoke with `/error-retry`

### LangChain

```python
from langchain_anthropic import ChatAnthropic
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser

model = ChatAnthropic(model="claude-opus-4-6")
prompt = ChatPromptTemplate.from_messages([
    ("system", SKILL_SYSTEM_PROMPT),
    ("human", "Input: {input}\n\nContext: {context}")
])
chain = prompt | model | JsonOutputParser()
result = chain.invoke({"input": "...", "context": "..."})
```

---

## Error Handling

```python
from enum import Enum

class SkillError(Exception):
    def __init__(self, message: str, retryable: bool = False):
        self.message = message
        self.retryable = retryable

def run_skill_with_retry(input_text: str, max_retries: int = 3) -> dict:
    for attempt in range(max_retries):
        try:
            result = run_skill(input_text)
            if result.get("status") == "error" and result.get("retryable"):
                continue
            return result
        except Exception as e:
            if attempt == max_retries - 1:
                raise SkillError(str(e), retryable=False)
            continue
    raise SkillError("Max retries exceeded", retryable=False)
```

---

## Product Manifest

```json
{
  "product_id": "AA-SKL-GEN-ERRORRETRY-CORE-015",
  "skill_name": "Error Retry Skill Module",
  "version": "1.0.0",
  "category": "skill",
  "license": "commercial-single-seat",
  "compatibility": [
    "openai ",
    " anthropic ",
    " langchain"
  ]
}
```

---

*Purchased from [agentartifacts.io](https://agentartifacts.io)*