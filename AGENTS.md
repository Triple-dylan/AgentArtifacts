# Agent Artifacts Store

## Cursor Cloud specific instructions

### Services overview

| Service | Command | Port | Notes |
|---------|---------|------|-------|
| API server | `npm run dev:api` | 8787 | In-memory mode by default (no Postgres needed). Stub checkout when `STRIPE_SECRET_KEY` is unset. |
| Next.js web | `cd apps/web && npm run dev` | 3000 | Requires API on 8787 for catalog data in some routes. |

### Running tests and checks

See `README.md` Quick Start for canonical commands. Key ones:

- **Tests:** `npm test` — runs `node --test tests/*.test.js`. Tests spin up their own API server instance; no need to start it manually first.
- **Data validation:** `npm run validate:data`
- **Registry build:** `npm run build:registry`
- **Lint:** `cd apps/web && npx eslint .`
- **Type check:** `cd apps/web && npx tsc --noEmit`

### Caveats

- The web app uses Next.js 16 with App Router. The `next dev` first compilation is slow (~15s); wait before curling port 3000.
- ESLint is only configured in `apps/web/eslint.config.mjs`; there is no root-level ESLint config.
- All external services (Postgres, Stripe, OpenAI, Twitter, Resend) are optional and have graceful fallbacks — the API and web app run fully without them.
- The API test suite spawns its own server on a random port; do not rely on an already-running API for tests.
