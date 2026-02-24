# Launch Checklist

## Catalog Readiness

- [ ] 50 SKUs populated and validated in `data/catalog_master.csv`
- [ ] 8 bundle compositions validated in `data/bundles_master.csv`
- [ ] All live/high-risk SKUs have disclosure requirements set

## Registry and API

- [ ] Registry item schema v1.1.0 finalized
- [ ] Registry index schema v1.1.0 finalized
- [ ] Example objects for prompt/skill/agent/bundle published
- [ ] API endpoint contract reviewed by backend

## Commerce and Entitlements

- [ ] Stripe checkout and webhook mappings validated
- [ ] Entitlement and signed URL flow validated
- [ ] Disclosure acknowledgement flow integrated into checkout/download

## Funnel and Promotions

- [ ] Free-library and no-free routes enabled
- [ ] Email sequences configured for both variants
- [ ] Upsell rules loaded and tested
- [ ] Cart threshold and flash discount controls tested

## Compliance and Safety

- [ ] Disclosure text legal review completed
- [ ] Live-execution assets include preflight and kill-switch docs
- [ ] Secrets policy validated (no secret values in assets)

## Analytics and Operations

- [ ] KPI dashboard published
- [ ] Event coverage validated
- [ ] On-call escalation owner assigned
- [ ] Rollback plan documented
