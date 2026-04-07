# AGENTS.md

## Cursor Cloud specific instructions

This is a self-contained Next.js 14 monolith (App Router) with SQLite via Prisma ORM. No external services, Docker, or environment variables are required for core functionality.

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

### Authentication

NextAuth.js with credentials provider. Default test account can be registered at `/login`. Auth secret is set in `.env` (NEXTAUTH_SECRET). The login page is at `/login`.

### Optional integrations (require env vars)

- **OpenAI** (`OPENAI_API_KEY`): Powers AI deliverable generation at `/api/ai/generate`. App works without it — the endpoint returns a clear error message.
- **Stripe** (`STRIPE_SECRET_KEY`): Powers invoice creation with Stripe sync at `/api/invoices`. App works without it — invoices are created locally in the DB only.

### Gotchas

- `prisma generate` must run before `npm run dev` or `npm run build` — it generates the Prisma Client into `node_modules/@prisma/client`.
- The SQLite DB file (`prisma/dev.db`) is gitignored; every fresh checkout needs `npx prisma db push && npm run db:seed` to create and populate it.
- No `.env` file is required for core functionality; the Prisma datasource URL is hardcoded in `prisma/schema.prisma` as `file:./dev.db`.
- The `.env` file should contain `NEXTAUTH_SECRET` and `NEXTAUTH_URL` for auth. A dev default is coded as fallback.
