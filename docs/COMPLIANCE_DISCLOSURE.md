# Compliance and Disclosure Controls

## Positioning

- Products are sold as tooling, education, and workflow automation assets.
- No investment advice, no custody, no guaranteed outcomes.
- Users are responsible for execution decisions, credentials, and venue compliance.

## Disclosure Requirements

- Disclosure acknowledgement required for SKUs with:
- `execution_mode = live`
- `risk_level = high`
- `disclosure_required = Y`

## Disclosure Versioning

- Disclosure text is versioned in `data/disclosure_versions.csv`.
- Acknowledgements must store:
- disclosure version
- timestamp
- session/order/user reference
- product scope

## Live-Execution Launch Controls

- default-safe configs with live mode disabled
- mandatory preflight checklist in product package
- kill-switch policy template in guardrails assets
- environment separation guidance (`sandbox`, `paper`, `live`)
- no secret values in product files; metadata only references secret names

## Review Gates

- Legal review for every live-capable SKU before activation
- Product QA sign-off for risk controls and docs completeness
- Disclosure text changes trigger re-acknowledgement flow
