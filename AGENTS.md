# AGENTS.md

## Cursor Cloud specific instructions

### Overview

WeatherEdge is a full-stack marine weather intelligence platform for offshore wind operations. It has three services:

| Service | Stack | Port | Run Command |
|---------|-------|------|-------------|
| **PostgreSQL** | PostgreSQL 16 | 5432 | `sudo pg_ctlcluster 16 main start` |
| **Backend** | Python 3.12 / FastAPI | 8000 | `cd backend && source .venv/bin/activate && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000` |
| **Frontend** | React 19 / Vite 8 / TypeScript 5.9 | 5173 | `cd frontend && VITE_API_URL=http://localhost:8000/api npm run dev -- --host 0.0.0.0` |

### Non-obvious caveats

- **PostgreSQL must be started manually** (`sudo pg_ctlcluster 16 main start`) — there is no systemd in the cloud VM environment. The database uses credentials `weatheredge`/`weatheredge`/`weatheredge`.
- **Frontend `VITE_API_URL`**: If you omit `VITE_API_URL=http://localhost:8000/api` when starting the frontend, it falls back to built-in mock data instead of connecting to the real backend.
- **Frontend `base` path**: `vite.config.ts` sets `base: '/VPP/'` for GitHub Pages deployment, so the local dev URL is `http://localhost:5173/VPP/` (not root `/`).
- **No external API keys needed**: Weather data comes from Open-Meteo's free marine and atmospheric APIs.
- **No automated tests exist** in this codebase. Lint: `cd frontend && npm run lint`. Build check: `cd frontend && npm run build`.
- The backend auto-creates database tables on startup via `init_db()` in the FastAPI lifespan. No manual migrations needed.
