# HR Data Schema Pack
**Product ID:** `AA-UTL-HRE-HRSCHEMA-CORE-089`  
**License:** Commercial use permitted · Single-seat license  

---

## Overview

JSON schemas for employees, roles, compensation bands, and performance cycles

This utility provides schemas, templates, and reference definitions for `json schema pack` use cases.

---

## Core Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "HR Data Schema Pack",
  "description": "JSON schemas for employees, roles, compensation bands, and performance cycles",
  "type": "object",
  "required": [
    "id",
    "type",
    "data",
    "metadata"
  ],
  "properties": {
    "id": {
      "type": "string",
      "pattern": "^[a-z0-9-]+$"
    },
    "type": {
      "type": "string",
      "description": "Record type identifier"
    },
    "data": {
      "type": "object",
      "description": "Primary data payload",
      "additionalProperties": true
    },
    "metadata": {
      "type": "object",
      "required": [
        "created_at",
        "version"
      ],
      "properties": {
        "created_at": {
          "type": "string",
          "format": "date-time"
        },
        "updated_at": {
          "type": "string",
          "format": "date-time"
        },
        "version": {
          "type": "string",
          "default": "1.0.0"
        },
        "source": {
          "type": "string"
        },
        "tags": {
          "type": "array",
          "items": {
            "type": "string"
          }
        }
      }
    },
    "status": {
      "type": "string",
      "enum": [
        "draft",
        "active",
        "archived"
      ],
      "default": "active"
    }
  }
}
```

---

## Extended Schemas

### Schema 2 — Configuration

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "HR Data Schema Pack Config",
  "type": "object",
  "properties": {
    "enabled": {
      "type": "boolean",
      "default": true
    },
    "settings": {
      "type": "object",
      "additionalProperties": true
    },
    "overrides": {
      "type": "object",
      "additionalProperties": true
    },
    "environment": {
      "type": "string",
      "enum": [
        "development",
        "staging",
        "production"
      ]
    },
    "debug": {
      "type": "boolean",
      "default": false
    }
  }
}
```

### Schema 3 — Event Log Entry

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "EventLogEntry",
  "type": "object",
  "required": [
    "event_id",
    "event_type",
    "timestamp"
  ],
  "properties": {
    "event_id": {
      "type": "string"
    },
    "event_type": {
      "type": "string"
    },
    "entity_id": {
      "type": "string"
    },
    "entity_type": {
      "type": "string"
    },
    "actor": {
      "type": "string"
    },
    "payload": {
      "type": "object"
    },
    "timestamp": {
      "type": "string",
      "format": "date-time"
    }
  }
}
```

---

## Templates

### Template 1 — Initialisation

```json
{
  "id": "{{id}}",
  "type": "{{type}}",
  "data": {
    "name": "{{name}}",
    "description": "{{description}}",
    "config": {}
  },
  "metadata": {
    "created_at": "{{iso_datetime}}",
    "version": "1.0.0",
    "source": "{{source}}",
    "tags": []
  },
  "status": "draft"
}
```

### Template 2 — Update Payload

```json
{
  "id": "{{existing_id}}",
  "data": {
    "$patch": true
  },
  "metadata": {
    "updated_at": "{{iso_datetime}}",
    "version": "{{new_version}}"
  }
}
```

---

## Validation Examples

```python
import jsonschema
import json

schema = json.load(open('core-schema.json'))  # from this package

def validate(data: dict) -> tuple[bool, list]:
    try:
        jsonschema.validate(data, schema)
        return True, []
    except jsonschema.ValidationError as e:
        return False, [str(e.message)]

# Example
record = {
    'id': 'my-record-001',
    'type': 'config',
    'data': {'name': 'Production config'},
    'metadata': {'created_at': '2026-01-01T00:00:00Z', 'version': '1.0.0'}
}
is_valid, errors = validate(record)
print(f'Valid: {is_valid}, Errors: {errors}')
```

---

*Purchased from [agentartifacts.io](https://agentartifacts.io)*