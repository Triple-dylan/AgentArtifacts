# QBR Narrative Prompt Pack
**Product ID:** `AA-PRM-CSX-QBRNARRATIVE-166`  
**License:** Commercial use permitted · Single-seat license  
**Format:** Markdown + JSON  

---

## Overview

Prompts for building compelling QBR decks with ROI summaries, risk flags, and next steps

This pack covers: `prompt pack` workflows.
All prompts use `{{variable}}` placeholder syntax — replace before using.

**Compatible with:** Claude 3.5+, GPT-4o, Gemini 1.5+, any instruction-following LLM

---

## Prompt Library

### Prompt 01 — Core Analysis

```
Analyse the following qbr narrative in depth.

Input: {{input}}
Context: {{context}}
Goal: {{goal}}

Provide:
1. Executive summary (3 sentences)
2. Key findings (5 bullet points)
3. Actionable recommendations (3-5 items, ranked by impact)
4. Risks or caveats to consider
```

---

### Prompt 02 — Structured Output

```
Process the following qbr narrative and return a structured JSON response.

Input: {{input}}

Return JSON with fields:
- summary: string
- key_points: array of strings
- score: number (0-100)
- category: string
- next_actions: array of objects with 'action' and 'priority' fields
```

---

### Prompt 03 — Comparison Framework

```
Compare the following qbr narrative options and recommend the best choice.

Options: {{options}}
Criteria: {{criteria}}
Context: {{context}}

For each option:
- Pros (3 bullet points)
- Cons (3 bullet points)
- Score (1-10)

Final recommendation with rationale (2 paragraphs).
```

---

### Prompt 04 — Improvement Advisor

```
Review the following qbr narrative and identify the top 5 improvements.

Current state: {{current}}
Desired outcome: {{outcome}}
Constraints: {{constraints}}

For each improvement:
- Issue identified
- Recommended change
- Expected impact (high/medium/low)
- Implementation complexity (high/medium/low)
```

---

### Prompt 05 — Generator

```
Generate a complete, professional qbr narrative for the following specification.

Specification: {{spec}}
Audience: {{audience}}
Tone: {{tone}}
Length: {{length}}

Ensure the output is:
- Clear and actionable
- Appropriate for the specified audience
- Ready to use without further editing
```

---

### Prompt 06 — Validator

```
Validate the following qbr narrative against best practices and requirements.

Content: {{content}}
Requirements: {{requirements}}

Check:
1. Completeness — are all required elements present?
2. Quality — does it meet professional standards?
3. Accuracy — are all claims verifiable?
4. Clarity — would the target audience understand it?

Output: PASS/FAIL for each check with specific notes.
```

---

### Prompt 07 — Translator

```
Adapt the following qbr narrative for a different audience or context.

Original: {{original}}
Original audience: {{source_audience}}
Target audience: {{target_audience}}
Key differences to account for: {{differences}}

Preserve the core message while making it appropriate for the new audience.
```

---

### Prompt 08 — Summariser

```
Summarise the following qbr narrative for an executive audience.

Full content: {{content}}
Max length: {{max_words}} words

Prioritise: key decisions, risks, and recommended actions.
Avoid: technical jargon, implementation details, background context.
```

---

### Prompt 09 — Draft Reviewer

```
Review and improve the following qbr narrative draft.

Draft: {{draft}}
Review against: {{criteria}}

Provide:
1. Overall assessment (1 paragraph)
2. Strengths (bullet list)
3. Issues to fix (numbered, prioritised)
4. Revised version with tracked changes noted
```

---

### Prompt 10 — Question Generator

```
Generate 15 clarifying questions about the following qbr narrative.

Context: {{context}}
Purpose: {{purpose}}

Group questions by: (1) Scope & requirements, (2) Stakeholders & audience, (3) Constraints & risks, (4) Success metrics.
For each question, note why it matters.
```

---

### Prompt 11 — Prioritisation Engine

```
Prioritise the following qbr narrative items using the given criteria.

Items: {{items}}
Prioritisation framework: {{framework}} (e.g., ICE score, MoSCoW, effort/impact)
Context: {{context}}

Output: ranked list with scores, rationale for top 3, and recommended 'start now' item.
```

---

### Prompt 12 — Report Writer

```
Write a professional report on the following qbr narrative.

Data/findings: {{data}}
Audience: {{audience}}
Report format: {{format}} (e.g., 'executive summary + detailed analysis', 'one-pager', 'full report')

Include: title, date, executive summary, methodology, findings, recommendations, appendix (if applicable).
```

---

## Variable Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `{{input}}` | Primary input content | Your specific data |
| `{{context}}` | Background context | Domain, project, constraints |
| `{{goal}}` | Desired outcome | What success looks like |
| `{{audience}}` | Target audience | 'executive', 'developer', 'customer' |
| `{{tone}}` | Output tone | 'professional', 'concise', 'detailed' |
| `{{format}}` | Output format | 'bullet list', 'table', 'paragraph' |

---

## Usage Notes

- Replace all `{{placeholder}}` tokens before sending to your LLM
- Chain prompts 1 → 4 → 8 for a full analysis-to-report workflow
- Works best with Claude Opus 4.6 or GPT-4o for complex tasks
- For bulk processing, wrap in a Python loop with `anthropic.Anthropic().messages.create()`

---

## Compatibility

| Platform | Integration method | Notes |
|----------|-------------------|-------|
| Claude / Anthropic | SDK or claude.ai | Full support |
| GPT-4o / OpenAI | SDK or ChatGPT | Full support |
| Cursor | .cursorrules file | Paste as rule |
| Claude Code | .claude/skills/ | Skill file format |
| LangChain | ChatPromptTemplate | Use as system template |

---

## Product Manifest

```json
{
  "product_id": "AA-PRM-CSX-QBRNARRATIVE-166",
  "slug": "prompt-qbr-narrative-pack",
  "name": "QBR Narrative Prompt Pack",
  "category": "prompt",
  "subcategory": "prompt_pack",
  "version": "1.0.0",
  "license": "commercial-single-seat",
  "files": [
    "prompt-qbr-narrative-pack.md",
    "manifest.json"
  ],
  "compatibility": [
    "openai ",
    " anthropic"
  ],
  "tags": [
    "customer success ",
    " QBR ",
    " narrative ",
    " prompts"
  ]
}
```

---

*Purchased from [agentartifacts.io](https://agentartifacts.io)*  
*License: Commercial use permitted · Redistribution not permitted*