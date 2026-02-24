# Product Taxonomy

## Categories and Subcategories

- Prompt Products
- Prompt Packs: single-use prompts grouped by use case and role.
- Prompt Suites: multi-role prompt systems with shared context scaffolds.
- Prompt Chains: stepwise prompts with handoff states and fallback prompts.

- Skill Modules
- Tool-Call Specs: tool invocation templates with argument contracts.
- I/O Schemas: input/output contracts and validation rules for predictable execution.
- Error Handling Modules: retry, timeout, and escalation logic.

- Agents
- Task Agents: narrow-purpose, high-reliability packaged agents.
- Workflow Agents: multi-step orchestration with defined state transitions.
- Vertical Agents: domain-specific implementations for marketing, support, and trading.

- Utilities/Libraries
- JSON Schema Packs: reusable schemas for messages, events, and structured outputs.
- Guardrails YAML: constraints, policy gates, and safety defaults.
- Memory Templates: short/long-term context management templates.
- OpenAPI Wrappers: adapter templates for external APIs.

- Training/Docs
- Guides: implementation walkthroughs and integration references.
- Best Practices: quality, testing, safety, and versioning guidance.
- Cookbooks: practical recipes by domain.

## Launch Product Line Extensions

- Prediction Markets
- Event thesis prompts, odds interpretation templates, event/contract schema packs.

- Trading Systems
- Signal generation modules, risk-check skills, paper/live orchestration agents.

## SKU Convention

- Pattern: `AA-[CAT]-[SUB]-[USECASE]-[TIER]-[NNN]`
- Category codes: `PRM`, `SKL`, `AGT`, `UTL`, `DOC`, `BND`
- Tier tags: `CORE`, `STD`, `PRO`, `ELT`, `CST`
- Example: `AA-SKL-TRD-RISKCHECK-PRO-022`

## Versioning

- Product version: semantic versioning (`MAJOR.MINOR.PATCH`)
- Major: breaking schema/interface/license changes
- Minor: backward-compatible additions
- Patch: fixes and non-breaking updates
- Bundle version increments when included paid components change

## Trading Metadata Vocabulary

- `execution_mode`: `research`, `paper`, `live`
- `market_type`: `prediction`, `crypto_perps`, `hybrid`
- `connector_type`: `api`, `websocket`, `webhook`
- `risk_level`: `low`, `med`, `high`
