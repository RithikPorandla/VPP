# AgentOS — AI Service Operating System

Infrastructure for building AI-native service companies with software-like margins. Enable a single founder-operator to deliver premium, high-quality client outcomes at massive leverage using AI — without scaling headcount.

## Quick Start

```bash
npm install
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite via Prisma ORM
- **Charts**: Recharts
- **Icons**: Lucide React

## Architecture

- `src/app/` — Pages and API routes (Next.js App Router)
- `src/components/` — Shared UI components
- `src/lib/` — Utilities and database client
- `prisma/` — Database schema and seed data
