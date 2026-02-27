# Automated Report Agent
**Product ID:** `AA-AGT-DAT-REPORTOPS-PRO-077`  
**License:** Commercial use permitted · Single-seat license  

---

## Overview

Agent that pulls data, runs analysis, generates narrative, and formats reports automatically

---

## Agent Manifest

```json
{
  "agent_id": "AA-AGT-DAT-REPORTOPS-PRO-077",
  "name": "Automated Report Agent",
  "version": "1.0.0",
  "description": "Agent that pulls data, runs analysis, generates narrative, and formats reports automatically",
  "category": "agent",
  "execution_mode": "none",
  "model": "claude-opus-4-6",
  "max_tokens": 8192,
  "tools": [
    "web_search",
    "file_read",
    "file_write",
    "code_execute"
  ],
  "memory": {
    "type": "session",
    "max_entries": 100
  },
  "guardrails": {
    "max_cost_usd": 5.0,
    "max_turns": 50,
    "timeout_seconds": 300
  },
  "input_schema": {
    "type": "object",
    "required": [
      "task"
    ],
    "properties": {
      "task": {
        "type": "string"
      },
      "context": {
        "type": "string"
      },
      "output_format": {
        "type": "string",
        "default": "markdown"
      }
    }
  }
}
```

---

## System Prompt

```
You are Automated Report Agent, a specialised AI agent for automated report tasks.

Your capabilities:
- Analyse and process automated report-related inputs
- Break complex tasks into clear, executable steps
- Use available tools to gather information and produce outputs
- Maintain context across multi-turn interactions
- Produce structured, professional outputs

Operating principles:
- Always confirm task scope before starting long operations
- Report progress at each major milestone
- Flag blockers immediately rather than proceeding with assumptions
- Return structured outputs by default (JSON or Markdown)
- Never exceed the configured cost or turn limits
```

---

## Workflow

```
AGENT: Automated Report Agent

STEP 1: Intake
  → Receive task specification
  → Validate inputs and clarify ambiguities
  → Confirm scope, constraints, and success criteria

STEP 2: Planning
  → Break task into 3-7 subtasks
  → Identify required tools and data sources
  → Estimate completion path

STEP 3: Execution
  → Execute each subtask in order
  → Use tools to gather required information
  → Handle errors and adapt plan as needed

STEP 4: Synthesis
  → Aggregate outputs from all subtasks
  → Apply quality checks
  → Format final output per requirements

STEP 5: Delivery
  → Return structured result
  → Summarise what was done
  → Note any unresolved items or follow-ups
```

---

## Setup Guide

### Prerequisites

- Python 3.11+
- `anthropic` SDK: `pip install anthropic`
- API key: set `ANTHROPIC_API_KEY` environment variable

### Quick Start

```python
import anthropic
import json

client = anthropic.Anthropic()

SYSTEM_PROMPT = open('system_prompt.md').read()  # from this package

def run_agent(task: str, context: str = "") -> dict:
    messages = [{'role': 'user', 'content': f'Task: {task}\n\nContext: {context}'}]
    
    for turn in range(50):  # max turns from manifest
        response = client.messages.create(
            model='claude-opus-4-6',
            max_tokens=8192,
            system=SYSTEM_PROMPT,
            messages=messages
        )
        
        if response.stop_reason == 'end_turn':
            return {'result': response.content[0].text, 'turns': turn + 1}
        
        # Handle tool calls here
        messages.append({'role': 'assistant', 'content': response.content})
    
    return {'error': 'Max turns reached'}

# Usage
result = run_agent(task='Your task here', context='Optional context')
print(result['result'])
```

### Claude Code Integration

Add to `.claude/CLAUDE.md`:
```
# Automated Report Agent

You have access to the Automated Report Agent agent capability.
When asked to perform automated report tasks, follow the workflow defined in this package.
```

---

*Purchased from [agentartifacts.io](https://agentartifacts.io)*