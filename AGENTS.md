# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

Agent Artifacts Store — a digital download e-commerce store for agent-native AI assets. npm workspaces monorepo with two apps and one shared package:

| Path | Description |
|---|---|
| `apps/api/` | Node.js HTTP API (port 8787) — catalog, registry, checkout, disclosures, downloads, upsells |
| `apps/web/` | Next.js 16 App Router frontend (port 3000) — storefront, blog, admin, cron agent routes |
| `packages/agent-runner/` | Shared library for AI agent swarm (LLM, Twitter, Moltbook, Postgres) |

### Running services

- **API server**: `npm run dev:api` from workspace root (port 8787). Works without any env vars using in-memory store.
- **Web app**: `cd apps/web && npm run dev` (port 3000). Requires the API server to be running for dynamic API routes to function.
- Both services work without PostgreSQL, Stripe keys, or LLM API keys — they gracefully fall back to stubs/in-memory mode.

### Testing and validation

- **Tests**: `npm test` from root — runs `node --test tests/*.test.js` (7 tests covering catalog, registry, checkout, downloads, upsells, data validation). Tests spawn their own API instance on port 8788, so the dev API server can stay running.
- **Data validation**: `npm run validate:data` — validates CSV seed data integrity.
- **TypeScript**: `cd apps/web && npx tsc --noEmit` — type-checks the Next.js app.
- **ESLint**: `cd apps/web && npx eslint --ignore-pattern '.next/' .` — lints the web app source.
- **Build**: `cd apps/web && npx next build` — full production build (269 pages).

### Gotchas

- Next.js warns about multiple lockfiles (`package-lock.json` at root and in `apps/web/`). This is cosmetic and safe to ignore.
- ESLint must be run with `--ignore-pattern '.next/'` to avoid linting build output.
- The API test suite uses port 8788 (not 8787), so it does not conflict with a running dev API server.
- No `.nvmrc` or `.node-version` file; requires Node >= 20 (see `engines` in root `package.json`).
