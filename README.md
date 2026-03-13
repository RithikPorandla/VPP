# WeatherEdge

ML-powered marine weather intelligence for offshore wind operations. Turns raw weather into operation-specific go/no-go decisions.

## Quick Start

```bash
docker compose up
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## Manual Setup

```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

Requires PostgreSQL running on `localhost:5432` (db: `weatheredge`, user: `weatheredge`, pass: `weatheredge`).

## Architecture

```
backend/         Python FastAPI — weather ingestion, go/no-go engine, window finder
frontend/        React + TypeScript — dashboard, briefing, window finder
docker-compose   PostgreSQL + backend + frontend
```

## Features

- **Go/No-Go Engine** — CTV transfer, crane ops, rope access, drone inspection, and more
- **Weather Window Finder** — "find me the next 8-hour window for X"
- **Daily Briefing** — morning ops briefing with 7-day outlook
- **Real weather data** — Open-Meteo marine + atmospheric APIs (free, no key needed)
- **Preset wind farms** — Hornsea 2, Dogger Bank, Borssele, East Anglia ONE

## Docs

- [Product Spec](docs/WEATHEREDGE_PRODUCT_SPEC.md)
- [Startup Ideas](docs/STARTUP_IDEAS.md)
