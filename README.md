# WeatherEdge — ML-Powered Marine Weather Intelligence for Offshore Wind

Turn weather from a blocker into a planning advantage.

## What Is This

WeatherEdge is an AI-powered operational decision layer for offshore wind farm O&M teams. It translates raw marine weather data into **operation-specific go/no-go recommendations** — telling coordinators not just "what's the wave height" but "can we do a CTV transfer to WTG-47 on Thursday with 92% confidence?"

## The Problem

Offshore wind operators lose **$1M–$3M per wind farm per year** to poor weather decisions:

- Generic forecasts that don't account for operation-specific thresholds
- Conservative no-go calls on days that were actually workable
- Campaigns launched into deteriorating conditions
- Optimal work windows that nobody spotted in time
- No tracking of forecast accuracy — no way to improve

## Core Capabilities

- **Go/No-Go Engine** — operation-specific recommendations (CTV transfer, crane ops, rope access, etc.) with confidence levels
- **Weather Window Finder** — "find me the next 8-hour window for a generator swap"
- **Campaign Planner** — multi-day window reliability for major component swaps
- **Site Calibration** — ML models that learn forecast biases at each specific location
- **Accuracy Dashboard** — track how good your forecasts actually are

## Documentation

- [Product Specification](docs/WEATHEREDGE_PRODUCT_SPEC.md) — full product spec with architecture, ML models, DaaS strategy, MVP plan, go-to-market, and financials
- [Initial Startup Ideas](docs/STARTUP_IDEAS.md) — early-stage ideation across the offshore wind AI space

## Tech Stack (Planned)

| Layer | Technology |
|---|---|
| Backend | Python (FastAPI) |
| ML | PyTorch, LightGBM, scikit-learn |
| Data Pipeline | Prefect / Airflow |
| Database | PostgreSQL + TimescaleDB |
| Weather Data | ECMWF, GFS, Open-Meteo |
| Frontend | React + TypeScript |
| Maps | Mapbox GL JS |
| Hosting | AWS |
