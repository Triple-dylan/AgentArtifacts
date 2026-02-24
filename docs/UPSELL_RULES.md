# Upsell and Promotion Logic

## Core Rules

- If user downloads free prompt sample -> show Starter Bundle.
- If user downloads free trading template -> show Prediction Market Starter Pack.
- If user buys prompt pack -> offer skills add-on at checkout.
- If user buys trading prompt -> offer trading risk-check skill add-on.
- If user buys skill -> offer vertical pack upgrade with purchase credit window.
- If user buys paper-trade agent -> offer live execution connector bundle.
- If user buys any live-capable SKU -> offer support/integration package + updates feed.

## Cart Logic

- If cart has 2+ standalone SKUs from same vertical, show bundle delta upgrade.
- If cart mixes trading and non-trading SKUs, prioritize bundle with highest savings and highest compatibility score.
- If cart exceeds threshold, offer bonus utility add-on before applying discount.

## Discount Policy

- Bundle flash discounts: 10%-20%, 72-hour expiry, one per user per bundle.
- Do not stack flash discounts with major campaign discounts.
- Preserve minimum margin floor per SKU and bundle.

## Suppression Rules

- Do not show beginner offers to users owning Trading Systems Kit, Pro Suite, or Enterprise Kit.
- Do not show free-library prompts to users with active high-tier subscriptions.
- Do not surface live-trading upsells unless disclosure acknowledgements are complete.

## Priority Order (highest to lowest)

1. Bundle upgrade with positive savings and compatibility fit
2. High-intent category add-on (prompt->skill, skill->utility)
3. Support/integration upsell for live-capable products
4. Limited-time promotional discount
