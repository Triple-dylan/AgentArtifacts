# Recruiter Automation Agent
**Product ID:** `AA-AGT-HR-RECRUITER-PRO-225`
**License:** Commercial use permitted · Single-seat license
**Format:** Markdown + JSON

---

## Overview

Agent for sourcing candidates, screening resumes, and scheduling interview pipelines

This pack covers: `agent_config` workflows.
All prompts use `{{variable}}` placeholder syntax — replace before using.

**Compatible with:** Claude 3.5+, GPT-4o, Gemini 1.5+, any instruction-following LLM

---

## Agent Library

### Section 1 — Agent Configuration

# Recruiter Automation Agent

## Configuration
```yaml
agent_id: AA-AGT-HR-RECRUITER-PRO-225
version: 1.0.0
type: agent_config

orchestration:
  max_steps: 20
  timeout_minutes: 10
  parallel_tasks: 3

tools:
  - name: search
    enabled: true
  - name: write
    enabled: true
  - name: review
    enabled: true

guardrails:
  require_human_approval: ["publish", "delete", "send"]
  max_retries: 3
  cost_limit_usd: 5.00
```

---

### Section 2 — Workflow Definition

## Workflow

### Phase 1: Intake
- Receive task input
- Validate parameters
- Plan execution steps

### Phase 2: Execution
- Execute planned steps sequentially
- Track progress and intermediate results
- Handle errors with retry logic

### Phase 3: Review
- Self-review output quality
- Check against guardrails
- Request human approval if needed

### Phase 4: Delivery
- Format final output
- Log execution metrics
- Return structured result

---

### Section 3 — Tool Definitions

## Tool Specifications

### Search Tool
```json
{"name": "search", "description": "Search knowledge base and external sources", "parameters": {"query": "string", "sources": ["internal", "external"], "limit": 10}}
```

### Write Tool
```json
{"name": "write", "description": "Generate structured content", "parameters": {"type": "string", "format": "string", "context": "object"}}
```

---

### Section 4 — Deployment Guide

## Deployment

### Prerequisites
- Node.js 18+ or Python 3.10+
- LLM API access (Claude or GPT-4)
- Environment variables configured

### Setup
1. Install dependencies
2. Configure `agent_config.yaml`
3. Set API keys in environment
4. Run health check
5. Deploy to production

### Monitoring
- Track task completion rate
- Monitor average latency
- Alert on error rate > 5%
- Review cost per task weekly

---


## License & Support

- **License:** Commercial · single-seat
- **Support:** [agentartifacts.io/support](https://agentartifacts.io/support)
- **Updates:** Included for 12 months from purchase
