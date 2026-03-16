# AGENTS.md

## Cursor Cloud specific instructions

### Overview

AgentOS is a self-contained Next.js 14 monolith with an embedded SQLite database (via Prisma). There are no external services, Docker containers, or third-party API integrations. The entire application runs locally after installing dependencies and initializing the database.

### Quick Reference

Standard commands are documented in `README.md` and `package.json` scripts. Key commands:

- **Dev server:** `npm run dev` (runs on port 3000)
- **Lint:** `npm run lint`
- **Build:** `npm run build`
- **DB generate:** `npm run db:generate` (or `npx prisma generate`)
- **DB push:** `npm run db:push` (or `npx prisma db push`)
- **DB seed:** `npm run db:seed` (populates demo data via `tsx prisma/seed.ts`)

### Non-obvious caveats

- The SQLite database file lives at `prisma/dev.db`. If you encounter "table not found" errors, run `npx prisma db push` to recreate the schema, then `npm run db:seed` to repopulate data.
- Prisma client must be generated (`npx prisma generate`) after any `npm install` or schema change, otherwise you'll get import errors at runtime.
- There is no authentication — the app uses a hardcoded user "Jordan Davis" in the sidebar.
- No `.env` file is required; the database URL is hardcoded in `prisma/schema.prisma` as `file:./dev.db`.
- The seed script is idempotent and uses fixed IDs, so re-running `npm run db:seed` will upsert rather than duplicate data.
