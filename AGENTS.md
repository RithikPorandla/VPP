# AGENTS.md

## Cursor Cloud specific instructions

This is a self-contained Next.js 14 monolith (App Router) with SQLite via Prisma ORM. No external services, Docker, or environment variables are required.

### Services

| Service | Command | Port |
|---|---|---|
| Next.js dev server | `npm run dev` | 3000 |

The dev server serves both the React frontend and all API routes (`src/app/api/`).

### Database

SQLite file at `prisma/dev.db`. If the DB file is missing or schema has changed, re-initialize:

```
npx prisma generate
npx prisma db push
npm run db:seed
```

### Common commands

- **Lint:** `npm run lint`
- **Build:** `npm run build`
- **Dev server:** `npm run dev`
- **Seed DB:** `npm run db:seed`

See `package.json` scripts and `README.md` for full reference.

### Gotchas

- `prisma generate` must run before `npm run dev` or `npm run build` — it generates the Prisma Client into `node_modules/@prisma/client`.
- The SQLite DB file (`prisma/dev.db`) is gitignored; every fresh checkout needs `npx prisma db push && npm run db:seed` to create and populate it.
- No `.env` file is required; the Prisma datasource URL is hardcoded in `prisma/schema.prisma` as `file:./dev.db`.
