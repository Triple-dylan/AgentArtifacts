# Registry Schema Versioning Strategy

- Registry contract uses semantic versioning in `registry_schema_version`.
- Product artifact versions are independent of registry schema version.

## Rules

- Major (`X.0.0`): breaking field or structure changes.
- Minor (`0.X.0`): additive fields and non-breaking validation updates.
- Patch (`0.0.X`): clarifications and bug fixes without structural impact.

## Current Version

- `1.1.0`
- Additive update over 1.0.0 with trading metadata fields:
- `execution_mode`
- `market_type`
- `connector_type`
- `risk_level`
- `risk_profile`
- `disclosure_required`
- `disclosure_profile`
- `trade_action_schema`
- `market_data_schema`

## Backward Compatibility

- Consumers must ignore unknown fields.
- Existing non-trading entries remain valid without trading fields.
- If future major changes are introduced then publish adapter endpoint and migration notes.
