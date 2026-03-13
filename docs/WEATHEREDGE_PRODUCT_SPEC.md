# WeatherEdge — Product Specification

## ML-Powered Marine Weather Intelligence for Offshore Wind Operations

---

## 1. Vision

**Turn weather from a blocker into a planning advantage.**

Offshore wind operators lose millions of dollars every year to poor weather decisions — cancelled vessel transfers that could have gone ahead, campaigns launched into deteriorating conditions, and optimal work windows that nobody spotted in time. WeatherEdge replaces guesswork with operation-specific, site-calibrated, AI-driven weather intelligence.

---

## 2. The Problem in Detail

### How Weather Decisions Are Made Today

1. **Morning call (05:00–06:00)**: Marine coordinator pulls a generic forecast from MeteoGroup, StormGeo, or Infoplaza
2. **Manual interpretation**: Experienced coordinator mentally maps raw weather parameters to operational limits for each planned activity
3. **Go/no-go call**: Based on gut feel, conservative bias, and the coordinator's personal risk tolerance
4. **Intra-day changes**: Weather shifts mid-day; crew is already offshore; reactive scrambling ensues

### What Goes Wrong

| Problem | Impact | Frequency |
|---|---|---|
| **False negatives** — forecast says bad, reality was workable | Lost productive day ($15K–$50K in vessel + crew cost wasted) | 10–20% of no-go days could have been go days |
| **False positives** — forecast says good, conditions deteriorate | Safety incidents, crew stranded, emergency vessel recalls | 5–10% of go days turn bad mid-shift |
| **Single-point forecasts** — no probabilistic guidance | Coordinators can't assess risk; default to conservative | Every decision |
| **Generic thresholds** — same limits for all operations | Blade inspection cancelled at 15m/s wind when actual limit is 18m/s for that specific technique | Common for specialized operations |
| **No campaign-level view** — only daily forecasts | Can't plan a 3-day generator swap; don't know if Thursday-Saturday window holds | Every major campaign |
| **No site-specific calibration** — forecast for "North Sea" not for "WTG-47 at Hornsea 2" | Microclimate effects, shoal-induced wave changes, coastal sheltering missed | Persistent at complex sites |

### The Cost

For a typical 100-turbine offshore wind farm:

- **20–40 lost vessel days per year** due to weather misjudgment = **$300K–$800K/year**
- **5–15% more turbine downtime** than necessary = **$500K–$2M/year in lost generation**
- **2–4 weather-related safety incidents per year** = regulatory scrutiny, reputational risk
- **Total addressable waste per wind farm: $1M–$3M/year**

---

## 3. Product Definition

### 3.1 Core Concept

WeatherEdge is **not a weather forecasting service**. It's an **operational decision layer** that sits between raw weather data and human decision-makers. It translates weather into operational outcomes.

```
Raw Weather Data          WeatherEdge               Operational Decisions
─────────────────    ──────────────────────    ──────────────────────────────
Wave height (Hs)  →  "CTV transfer to         → Dispatch crew on Vessel A
Wave period (Tp)     WTG-47 is GO with         → Plan 6-hour work window
Wind speed (Ws)      92% confidence.           → Schedule return by 15:00
Wind direction       Window: 06:00–15:00.      → Have backup plan for
Visibility           Deterioration expected       WTG-12 if time allows"
Precipitation        after 16:00."
Current/tidal     →
Pressure trend
```

### 3.2 Key Differentiators vs. Standard Marine Forecasts

| Feature | Standard Forecast | WeatherEdge |
|---|---|---|
| Output format | Raw parameters (Hs, Ws, Tp) | Operation-specific go/no-go with confidence |
| Granularity | Regional (50km grid) | Per-turbine (via downscaling + site calibration) |
| Temporal view | 3-hourly snapshots | Continuous workable windows with duration estimates |
| Probabilistic | Single deterministic value | Probability distributions + confidence bands |
| Operation awareness | None — same output regardless of task | Different thresholds for CTV transfer vs. jack-up vs. rope access vs. crane lift |
| Learning | Static model updates quarterly | Continuous learning from operational outcomes |
| Campaign planning | Not supported | Multi-day window identification and reliability scoring |
| Forecast accuracy tracking | Not provided | Per-site, per-parameter accuracy dashboards |

### 3.3 Feature Breakdown

#### Feature 1: Operation-Specific Go/No-Go Engine

**What**: For each planned operation, provide a clear GO / MARGINAL / NO-GO recommendation with a confidence percentage.

**Operation types and their weather envelopes**:

| Operation | Key Parameters | Typical Limits |
|---|---|---|
| CTV crew transfer | Hs, Tp, Ws | Hs < 1.5m, Ws < 20kn |
| SOV gangway transfer | Hs, Tp, vessel motion | Hs < 2.5m (vessel dependent) |
| Helicopter transfer | Ws, visibility, cloud base | Vis > 3nm, cloud > 500ft |
| External blade repair (rope access) | Ws at hub height, precipitation | Ws < 12m/s, no rain |
| Internal nacelle work | Hs (for transfer), Ws at hub height | Transfer limits + Ws < 25m/s |
| Crane operations (major component) | Ws, gusts, Hs | Ws < 10m/s, gusts < 12m/s |
| Jack-up positioning | Hs, current, Ws | Hs < 1.2m for 8+ consecutive hours |
| Blade inspection (drone) | Ws, precipitation, visibility | Ws < 8m/s, no rain, vis > 1km |
| Cable survey / ROV | Current, Hs, visibility (subsea) | Current < 1.5kn, Hs < 2.0m |

**How confidence is calculated**:
- Ensemble spread from multiple weather models (ECMWF ENS, GFS, ICON, UK Met Office)
- Historical forecast accuracy at this specific site and lead time
- Temporal stability (is the window robust or could it shift by 2 hours?)

**User sees**:
```
┌─────────────────────────────────────────────────────────┐
│  CTV Transfer to Array Zone B          Thursday 13 Mar  │
│                                                         │
│  ██████████████████████░░░░  87% GO                     │
│                                                         │
│  Window: 06:30 – 16:00 (9.5 hrs)                       │
│  Hs: 1.1m (±0.3m)  │  Ws: 14kn (±4kn)  │  Vis: Good   │
│                                                         │
│  ⚠ Deterioration from 15:00 — plan return by 14:30     │
│  ⚠ Friday window unlikely (Hs 2.1m forecast)           │
└─────────────────────────────────────────────────────────┘
```

#### Feature 2: Weather Window Finder

**What**: Given an operation type and minimum required duration, find the best windows in the next 7–14 days.

**Use case**: "I need an 8-hour window for a generator swap at WTG-23. When's the best opportunity in the next two weeks?"

**Output**:
```
Generator Swap — WTG-23 — Minimum 8hr window needed

Rank  │ Date          │ Window        │ Duration │ Confidence │ Risk
──────┼───────────────┼───────────────┼──────────┼────────────┼──────────────
  1   │ Sat 15 Mar    │ 05:00–18:00   │ 13 hrs   │ 91%        │ Low
  2   │ Thu 20 Mar    │ 06:00–16:00   │ 10 hrs   │ 72%        │ Medium
  3   │ Mon 17 Mar    │ 07:00–15:30   │  8.5 hrs │ 64%        │ Med-High
      │               │               │          │            │ (marginal Hs)
```

#### Feature 3: Campaign Planner

**What**: For multi-day operations (major component swaps, blade campaigns), assess whether a consecutive multi-day window will hold.

**Use case**: "We need 3 consecutive workable days for a blade set replacement. Jack-up needs Hs < 1.2m. Show me options for the next 30 days."

**Output includes**:
- Probability that the full window holds (not just each individual day)
- Fallback options if the window breaks mid-campaign
- Cost-risk analysis: "starting on Day X has 85% chance of completion vs. Day Y at 60% — but Day Y saves 5 days of vessel standby"

#### Feature 4: Site-Calibrated Accuracy

**What**: WeatherEdge learns the systematic biases at each customer's site by comparing forecasts to actual operational outcomes.

**How it works**:
1. Ingest raw forecasts from multiple NWP models
2. Compare against observed conditions (from met mast, SCADA nacelle anemometer, wave buoy, or vessel motion sensors)
3. Build a site-specific correction model: "ECMWF under-predicts Hs by 0.2m at this site when wind is from the NW"
4. Apply corrections to future forecasts
5. Continuously update as more data arrives

**This is the core data moat** — the more sites you operate at, the better your corrections become, and competitors can't replicate this without the same operational data.

#### Feature 5: Forecast Accuracy Dashboard

**What**: Show operators how accurate their forecasts have been, broken down by parameter, lead time, season, and direction.

**Why it matters**: Operators currently have no idea how reliable their forecasts are. This builds trust and reveals where WeatherEdge adds the most value.

**Metrics displayed**:
- Bias (mean error) per parameter
- RMSE per parameter per lead time
- Hit rate: % of go/no-go decisions that were correct
- Missed opportunity rate: % of no-go days that were actually workable
- False confidence rate: % of go days where conditions exceeded limits

#### Feature 6: Alerting & Notifications

- **Weather watch**: conditions approaching operational limits — heads up to coordinators
- **Window opening**: a previously no-go day has improved — opportunity alert
- **Window closing**: conditions deteriorating faster than forecast — recall advisory
- **Cert expiry + weather combo**: "the only crew member qualified for this task has a cert expiring Friday, and the next weather window is Saturday" (when integrated with crew data)

---

## 4. Technical Architecture

### 4.1 System Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│  Web Dashboard (React)  │  Mobile PWA  │  API (for integrations) │
└──────────────┬───────────────────────────────────┬───────────────┘
               │                                   │
┌──────────────▼───────────────────────────────────▼───────────────┐
│                      APPLICATION LAYER                           │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────────┐ │
│  │ Go/No-Go    │  │ Window       │  │ Campaign                │ │
│  │ Engine      │  │ Finder       │  │ Planner                 │ │
│  └──────┬──────┘  └──────┬───────┘  └────────────┬────────────┘ │
│         │                │                        │              │
│  ┌──────▼────────────────▼────────────────────────▼────────────┐ │
│  │              Operational Rules Engine                        │ │
│  │    Operation profiles × Weather thresholds × Confidence     │ │
│  └──────────────────────────┬──────────────────────────────────┘ │
└─────────────────────────────┼────────────────────────────────────┘
                              │
┌─────────────────────────────▼────────────────────────────────────┐
│                        ML / DATA LAYER                           │
│  ┌──────────────────┐  ┌──────────────────┐  ┌───────────────┐  │
│  │ Forecast Blending │  │ Site Calibration │  │ Accuracy       │  │
│  │ (Multi-model      │  │ Model            │  │ Tracking       │  │
│  │  ensemble)        │  │ (Bias correction) │  │ Pipeline       │  │
│  └────────┬─────────┘  └────────┬─────────┘  └───────┬───────┘  │
│           │                     │                     │          │
│  ┌────────▼─────────────────────▼─────────────────────▼───────┐  │
│  │                    Feature Store                             │  │
│  │  Historical forecasts │ Observations │ Operational outcomes │  │
│  └─────────────────────────────────────────────────────────────┘  │
└──────────────────────────────┬───────────────────────────────────┘
                               │
┌──────────────────────────────▼───────────────────────────────────┐
│                     DATA INGESTION LAYER                         │
│  ┌─────────┐ ┌──────────┐ ┌──────────┐ ┌───────┐ ┌───────────┐ │
│  │ ECMWF   │ │ GFS/NOAA │ │ Open-    │ │ Met   │ │ Customer  │ │
│  │ IFS/ENS │ │          │ │ Meteo    │ │ Mast  │ │ SCADA     │ │
│  └─────────┘ └──────────┘ └──────────┘ └───────┘ └───────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Data Sources

#### Weather Model Inputs

| Source | Resolution | Update Freq | Coverage | Cost |
|---|---|---|---|---|
| ECMWF IFS (deterministic) | 9km, 1hr | 4x/day | Global | Paid (€2K–€20K/yr depending on volume) |
| ECMWF ENS (51 ensemble members) | 18km, 3hr | 2x/day | Global | Paid |
| GFS (NOAA) | 25km, 3hr | 4x/day | Global | Free |
| ICON (DWD) | 13km, 1hr | 4x/day | Global | Free |
| Open-Meteo Marine API | Aggregated, 5km | Hourly | Global | Free tier available |
| UK Met Office (MOGREPS) | 2.2km, 1hr | 4x/day | UK waters | Paid (via partnership) |
| WAM / WaveWatch III | ~25km, 3hr | 4x/day | Global wave model | Free |

#### Observational / Ground Truth Inputs

| Source | What It Provides | How You Get It |
|---|---|---|
| Customer met mast / LiDAR | Wind speed/dir at hub height, temperature | Customer data feed |
| SCADA nacelle anemometer | Wind at hub height (approximate), power output | Customer data feed |
| Wave buoy (Waverider) | Hs, Tp, wave direction at site | Customer or public buoy networks |
| Vessel motion sensors | Actual sea state experienced during transit | Vessel operator data feed |
| Operational logs | Did crew actually transfer? Was work completed? | Customer planning system export |

#### The Feedback Loop (Critical for ML)

```
Forecast made → Decision taken → Outcome recorded → Model updated
     │                │                │                    │
 "Hs 1.2m at         "GO"          "Transfer            Calibration
  08:00 Thu"                        successful,          model learns:
                                    actual Hs 1.4m,      ECMWF under-
                                    no issues"           predicts here
```

### 4.3 ML Models

#### Model 1: Multi-Model Forecast Blending

- **Purpose**: Combine ECMWF, GFS, ICON etc. into a single best-estimate forecast
- **Approach**: Weighted ensemble where weights are learned per site, per parameter, per lead time, per season
- **Input**: Raw NWP outputs (gridded)
- **Output**: Blended forecast with uncertainty bounds
- **Training data**: Historical forecasts vs. observations (need 6–12 months per site for good calibration)
- **Algorithm**: Gradient-boosted ensemble (XGBoost/LightGBM) or Bayesian model averaging

#### Model 2: Site-Specific Bias Correction

- **Purpose**: Remove systematic errors in forecasts at a specific location
- **Approach**: Quantile mapping + ML-based residual correction
- **Features**: Lead time, time of day, season, synoptic regime (NAO index, pressure patterns), wind direction, recent forecast errors
- **Output**: Corrected forecast values with tighter uncertainty bounds
- **Cold start**: Use transfer learning from nearby sites or regional models

#### Model 3: Window Duration Predictor

- **Purpose**: Predict how long a weather window will last (not just point-in-time conditions)
- **Approach**: Sequence model (LSTM or Transformer) trained on historical weather time series
- **Input**: Current conditions + forecast trajectory
- **Output**: Probability distribution over window duration
- **Why it matters**: A coordinator doesn't just need to know "is it OK at 08:00?" — they need "will it still be OK at 14:00?"

#### Model 4: Operational Outcome Predictor (Phase 2)

- **Purpose**: Predict whether a specific operation will succeed given the weather conditions
- **Approach**: Classification model trained on historical operation logs + weather
- **Input**: Operation type, weather conditions, crew experience level, vessel type
- **Output**: Success probability, expected duration, risk factors
- **Data requirement**: Needs operational outcome data from customers (Phase 2 after trust is built)

### 4.4 Tech Stack

| Component | Technology | Rationale |
|---|---|---|
| **Backend API** | Python (FastAPI) | Rich scientific computing ecosystem (xarray, numpy, scipy) |
| **ML Training** | PyTorch / scikit-learn / LightGBM | Flexible for both deep learning and traditional ML |
| **Data Pipeline** | Apache Airflow or Prefect | Scheduled ingestion of weather model runs (every 6 hours) |
| **Data Storage** | PostgreSQL + TimescaleDB | Time-series optimized, relational for metadata |
| **Gridded Data** | Zarr / NetCDF on S3 | Standard format for meteorological data, cloud-native |
| **Feature Store** | Custom on PostgreSQL (or Feast) | Store computed features for ML models |
| **Frontend** | React + TypeScript + Recharts/D3 | Interactive weather timeline visualizations |
| **Maps** | Mapbox GL JS or Deck.gl | Wind farm layout visualization with weather overlay |
| **Mobile** | Progressive Web App (PWA) | Coordinators check weather on tablets at 05:00 |
| **Auth** | Clerk or Auth0 | Multi-tenant, role-based access |
| **Hosting** | AWS (eu-west-1 / eu-west-2) | Proximity to European offshore wind markets |
| **CI/CD** | GitHub Actions | Standard, well-supported |
| **Monitoring** | Datadog or Grafana + Prometheus | Track model accuracy, API latency, data freshness |

---

## 5. Data Strategy & DaaS Layer

### 5.1 Data You Collect (as a Byproduct of the SaaS)

Every customer interaction generates valuable data:

| Data Type | Source | DaaS Value |
|---|---|---|
| Forecast vs. observed conditions per site | Weather models + customer observations | Build the most accurate offshore wind weather correction dataset in the world |
| Go/no-go decisions and outcomes | Customer operational logs | "What weather conditions actually lead to successful operations?" |
| Operation durations by weather | Customer + weather | Realistic task duration estimates by conditions |
| Site-specific weather patterns | Long-term forecast analysis | Microclimate intelligence for new wind farm developers |
| Vessel transfer success rates by sea state | Customer operational logs | Data for vessel designers, charterers, insurers |

### 5.2 DaaS Products (Year 2+)

#### Product A: Site Weather Characterization Reports

**Buyer**: Wind farm developers, investors, insurers during pre-construction or due diligence

**Content**: For a proposed or existing site:
- Expected workable days per month by operation type
- Seasonal weather window patterns
- Comparison to similar sites in the portfolio
- Predicted O&M weather impact on availability and cost

**Pricing**: $10K–$50K per report (one-off) or annual subscription

#### Product B: Forecast Accuracy Benchmarks

**Buyer**: Weather service providers, operators evaluating forecast vendors

**Content**:
- How accurate is Provider X vs. Provider Y at North Sea sites?
- Which NWP model performs best for wave height in the Irish Sea?
- Accuracy degradation curves by lead time and parameter

**Pricing**: $5K–$20K/year subscription

#### Product C: Operational Weather Intelligence API

**Buyer**: Third-party planning tools, CMMS vendors, vessel operators

**Content**: API access to WeatherEdge's calibrated forecasts and go/no-go outputs

**Pricing**: Per-call ($0.01–$0.10/call) or monthly subscription ($500–$5K/month)

#### Product D: Fleet-Wide Weather Risk Analytics

**Buyer**: Large portfolio owners (Orsted, Equinor, RWE, SSE), insurers

**Content**:
- Cross-portfolio weather risk exposure
- Climate trend impact on O&M costs
- Optimal maintenance scheduling windows across the fleet

**Pricing**: $50K–$200K/year enterprise subscription

### 5.3 Data Moat Progression

```
Year 1:  5 sites   → basic bias correction, better than raw forecasts
Year 2:  20 sites  → robust regional models, transfer learning works well
Year 3:  50+ sites → industry-leading accuracy, DaaS products are credible
Year 4+: 100 sites → nobody can replicate this dataset; you ARE the benchmark
```

---

## 6. MVP Specification

### 6.1 Scope: "Weather Window Dashboard"

The smallest product that proves the core value proposition: **operation-specific go/no-go recommendations that are more useful than a raw forecast.**

### 6.2 MVP Features (8–10 weeks to build)

#### Must Have (Week 1–6)

1. **Site Setup**
   - Define a wind farm: name, location (lat/lon), turbine layout (optional)
   - Configure operation types and their weather limits (start with 4: CTV transfer, rope access, crane ops, internal work)

2. **Weather Data Ingestion**
   - Pull marine forecasts from Open-Meteo API (free, no contract needed)
   - Store forecast history for accuracy tracking
   - Auto-refresh every 6 hours

3. **Go/No-Go Engine (Rule-Based v1)**
   - For each configured operation, evaluate weather against thresholds
   - Output: GO / MARGINAL / NO-GO with parameter-level breakdown
   - Show which parameter is the limiting factor

4. **7-Day Weather Timeline**
   - Visual timeline showing workable windows per operation type
   - Color-coded (green/amber/red) hour-by-hour view
   - Hover for parameter details

5. **Weather Window Finder**
   - "Find me the next 8-hour CTV transfer window" — scans the 14-day forecast
   - Returns ranked windows by duration and confidence

6. **Daily Briefing View**
   - Single-page summary for the morning coordination call
   - Today's conditions, tomorrow's outlook, next 7 days at a glance
   - Printable / shareable

#### Nice to Have (Week 7–10)

7. **Multi-Model Comparison**
   - Show ECMWF vs. GFS vs. ICON side by side
   - Highlight where models disagree (= low confidence)

8. **Forecast Accuracy Log**
   - Manual observation entry: "actual Hs at 12:00 was 1.3m"
   - Calculate bias and RMSE over time
   - Foundation for ML calibration later

9. **Email/SMS Alerts**
   - "Weather window opening tomorrow for blade inspection"
   - "Conditions deteriorating — consider early recall"

10. **API for Integration**
    - REST API for go/no-go status
    - Webhook for weather alerts
    - Enables integration with existing planning tools

### 6.3 What the MVP Deliberately Skips

- ML-based forecast blending (use simple multi-model average for now)
- Site-specific calibration (need 6+ months of data first)
- Campaign planning for multi-day operations
- Per-turbine spatial variation
- Mobile app (responsive web is enough)

These are all Phase 2 features that unlock once you have customers and data.

### 6.4 MVP User Workflow

```
05:30  Marine coordinator opens WeatherEdge on tablet
       → Sees daily briefing: "CTV GO until 15:00, Rope Access MARGINAL"

05:45  Checks 7-day timeline
       → Spots a 12-hour crane window on Saturday
       → Decides to pre-position parts for major component swap

06:00  Morning coordination call
       → Shares the daily briefing screen with the team
       → Everyone aligned on the plan in 5 minutes instead of 30

14:00  Gets alert: "Hs increasing faster than forecast — consider 14:30 return"
       → Coordinates early vessel return, avoids crew being stuck offshore

16:00  Enters actual observed conditions for the day
       → System tracks forecast accuracy, improves over time
```

---

## 7. Business Model

### 7.1 Pricing Tiers

| Tier | Features | Price | Target Customer |
|---|---|---|---|
| **Starter** | 1 site, basic go/no-go, 7-day timeline, email alerts | $1,500/month | Small ISPs, single wind farm operators |
| **Professional** | 3 sites, window finder, campaign planner, accuracy tracking, API | $4,000/month | Mid-size operators, multi-site ISPs |
| **Enterprise** | Unlimited sites, ML calibration, multi-model blending, custom integrations, DaaS reports | $8,000–$15,000/month | Large operators (Orsted, RWE, SSE, Equinor) |
| **API Only** | REST API access to go/no-go engine | $500–$2,000/month | CMMS vendors, planning tool integrators |

### 7.2 Revenue Projections

| Year | Customers | Sites | MRR | ARR | DaaS Revenue | Total |
|---|---|---|---|---|---|---|
| 1 | 3–5 | 5–8 | $8K–$20K | $100K–$240K | — | $100K–$240K |
| 2 | 10–15 | 20–35 | $40K–$80K | $480K–$960K | $50K–$100K | $530K–$1.06M |
| 3 | 25–40 | 60–120 | $120K–$250K | $1.4M–$3M | $200K–$500K | $1.6M–$3.5M |

### 7.3 Unit Economics

- **CAC (Customer Acquisition Cost)**: $5K–$20K (industry events, direct sales, pilot programs)
- **Payback period**: 1–3 months (product sells itself on ROI)
- **Gross margin**: 80%+ (primarily compute + weather data costs)
- **Net revenue retention**: 120%+ (upsell from Starter → Professional → Enterprise)
- **Churn**: Very low (<5% annual) — once embedded in daily operations, switching cost is high

---

## 8. Go-to-Market Strategy

### 8.1 Phase 1: Beachhead (Months 1–6)

**Target**: 2–3 ISPs or operators in UK North Sea (Humber, East Anglia)

**Why UK North Sea**:
- Largest operational offshore wind market in the world
- Mature O&M practices (they know the pain)
- English-speaking (no localization needed)
- Your existing network is here

**Approach**:
1. Offer 3-month free pilot to 2–3 friendly companies from your network
2. Co-locate with their marine coordination team for 2 weeks (understand workflow deeply)
3. Configure WeatherEdge for their sites and operations
4. Measure: days where WeatherEdge recommendation differed from their actual decision, and who was right
5. Publish case study with ROI numbers

### 8.2 Phase 2: UK & Northern Europe Expansion (Months 6–18)

**Target**: Expand to 10–15 customers across UK, Germany, Netherlands, Denmark, Belgium

**Channels**:
- **Direct sales** to operations managers and marine coordinators
- **Conference presence**: Global Offshore Wind (GOW), Wind Europe O&M, Offshore Energy
- **Content marketing**: "WeatherEdge Accuracy Report" — publish quarterly forecast accuracy benchmarks for major offshore wind regions (generates leads + establishes authority)
- **Partnerships**: CTV/SOV operators (Windcat, CWind, Esvagt) — they feel the pain too and can recommend to their clients

### 8.3 Phase 3: Global + Platform (Months 18–36)

- Expand to US East Coast (Vineyard Wind, South Fork, etc.), Taiwan, Japan
- Launch DaaS products
- API partnerships with CMMS vendors (SAP, Maximo, Orca)
- Explore integration with crew optimization tools (potential Idea 1 later)

---

## 9. Competitive Analysis

| Competitor | Strengths | Weaknesses | Your Advantage |
|---|---|---|---|
| **StormGeo** | Large, established, broad maritime coverage | Generic marine forecasts, not operation-specific, no ML calibration | Operation-specific intelligence, site calibration, feedback loop |
| **MeteoGroup (DTN)** | Good data, enterprise relationships | Forecast provider, not a decision tool; no operational context | Decision layer, not just data; learns from outcomes |
| **Infoplaza** | Strong in offshore wind, good forecasters | Manual forecaster model doesn't scale; expensive per-site | Automated, scalable, improves with data |
| **Vortex (wind resource)** | Great for pre-construction wind assessment | Not an operational tool; no real-time forecasting | Real-time operational focus |
| **Windguru / Windy** | Free, widely used by coordinators informally | Consumer tools, no enterprise features, no operation awareness | Purpose-built for commercial offshore wind operations |
| **In-house spreadsheets** | Free, familiar | Doesn't scale, no ML, no accuracy tracking, person-dependent | Everything they can't build themselves |

**Key insight**: Weather providers sell data. You sell decisions. That's a fundamentally different value proposition with higher willingness to pay.

---

## 10. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Weather data providers restrict access or raise prices | Medium | High | Use multiple sources; negotiate volume deals; build relationships with met offices |
| Large incumbents (DTN, StormGeo) copy the product | Medium | Medium | Move fast, build data moat through site calibration; they're slow-moving enterprises |
| Customers won't share observational data | Low-Medium | High | Start with publicly available data; make accuracy tracking opt-in; show clear value exchange |
| ML models don't outperform simple rules initially | Medium | Low | Rule-based engine is the MVP — still valuable; ML is the moat, not the launch feature |
| Long sales cycles in offshore wind | High | Medium | Free pilots, target ISPs (faster decisions), use your network |
| Regulatory/liability if bad recommendation causes incident | Low | Very High | Clear disclaimers; always show underlying data; decision support not decision making; insurance |

---

## 11. Team Requirements

### Founding Team (to MVP)

| Role | Responsibility | Profile |
|---|---|---|
| **You (Domain Expert / CEO)** | Product direction, customer relationships, industry knowledge | Offshore wind operations experience |
| **ML Engineer** | Weather model blending, bias correction, prediction models | Background in meteorology, geophysics, or climate science is ideal |
| **Full-Stack Developer** | Backend API, frontend dashboard, data pipeline | Python + React, experience with time-series data |

### First Hires (Post-Seed)

| Role | When | Why |
|---|---|---|
| Meteorologist / Data Scientist | After 3 customers | Deepen model accuracy, build DaaS products |
| Sales / Customer Success | After 5 customers | Can't do all sales yourself; need someone to manage pilots |
| DevOps / Platform Engineer | After 10 customers | Multi-tenancy, reliability, data pipeline scaling |

---

## 12. Funding Strategy

| Stage | Amount | Use of Funds | Timeline |
|---|---|---|---|
| **Pre-Seed** (friends/angels) | $100K–$250K | Build MVP, first 2 pilots, 6 months runway | Now |
| **Seed** (climate VC) | $1M–$2.5M | Team of 5, 15 customers, ML models, first DaaS product | Month 12–18 |
| **Series A** | $5M–$10M | International expansion, platform integrations, enterprise sales | Month 24–36 |

**Target investors** (climate/energy-tech focus):
- Breakthrough Energy Ventures
- Congruent Ventures
- Clean Energy Ventures
- Energy Impact Partners
- SET Ventures (Europe)
- Contrarian Ventures (Europe)

---

## 13. Key Metrics to Track

| Metric | What It Measures | Target (Year 1) |
|---|---|---|
| **Forecast accuracy improvement** | RMSE reduction vs. raw NWP at customer sites | 15–25% better than raw ECMWF |
| **Decision accuracy** | % of go/no-go recommendations validated by outcomes | >90% |
| **Missed opportunity reduction** | Fewer days called "no-go" that were actually workable | 30–50% reduction |
| **Customer NPS** | Would they recommend it? | >50 |
| **Daily active usage** | Are coordinators opening it every morning? | >80% of workdays |
| **Data coverage** | Number of sites with 6+ months of calibration data | 5+ sites |
| **Revenue retention** | Do customers renew and expand? | >100% net retention |
