# JSON Schema Pack
*Free download — Agent Artifacts*

> 🔧 **Utility** · Reusable schema pack for agent outputs

---

## About This Download

This is a complete, usable free download from Agent Artifacts.
It covers core use cases for **JSON Schema Pack** and works with any major LLM.

**Compatible with:** Claude (Anthropic), GPT-4o (OpenAI), Cursor, LangChain, LangGraph

---

## Schema / Template

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "JSON Schema Pack",
  "description": "Reusable schema pack for agent outputs",
  "type": "object",
  "required": ["id", "type", "payload", "created_at"],
  "properties": {
    "id": { "type": "string", "description": "Unique identifier" },
    "type": { "type": "string", "description": "Record type" },
    "payload": { "type": "object", "additionalProperties": true },
    "metadata": { "type": "object" },
    "created_at": { "type": "string", "format": "date-time" }
  }
}
```

---

## License

This free download is provided under the Agent Artifacts free content license.
You may use it in your own projects commercially.
You may not redistribute or resell this file.

---

*Full version available at [agentartifacts.io/products/utility-json-schema-pack](https://agentartifacts.io/products/utility-json-schema-pack)*

*Browse the full catalog at [agentartifacts.io/catalog](https://agentartifacts.io/catalog)*
