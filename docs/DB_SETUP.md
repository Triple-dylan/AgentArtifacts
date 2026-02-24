# Database Setup

## Requirements

- PostgreSQL 14+
- `DATABASE_URL` environment variable
- Node dependencies installed (`pg` package)

## Bootstrap

1. Set connection string:

```bash
export DATABASE_URL=postgres://user:pass@localhost:5432/agent_assets
```

2. Apply schema and migrations:

```bash
npm run db:migrate
```

3. Seed catalog, bundles, disclosures, and upsell rules:

```bash
npm run db:seed
```

4. Start API:

```bash
npm run dev:api
```

## Notes

- `db:migrate` applies baseline schema from `/db/schema.sql` once, then applies files in `/db/migrations/`.
- If an existing schema already exists, baseline is marked as applied and only incremental migrations run.
- API defaults to in-memory mode when `DATABASE_URL` is not set.
