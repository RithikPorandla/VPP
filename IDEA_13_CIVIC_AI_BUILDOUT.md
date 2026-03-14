# Idea #13 Deep Dive: Civic AI Platform for New Bedford

> **Core thesis:** The opportunity is not a chatbot. It's a **civic intelligence layer** — middleware that sits between residents and every city system, proactively closing the gap between what people are eligible for and what they actually receive. The chatbot is one interface into it, not the product.

---

## Why "Just Another Chatbot" Fails Here

Generic municipal chatbots (Pea Ridge, Moreno Valley, etc.) answer questions. That's it. They are FAQ search engines with a conversational UI. They fail in a city like New Bedford for specific reasons:

1. **Answering questions assumes people know what to ask.** A Cape Verdean immigrant doesn't Google "How do I apply for SNAP?" — they don't know SNAP exists, or that they qualify, or that MA's HIP program doubles their produce spending.
2. **Chatbots are reactive.** New Bedford's problem isn't that residents can't get answers — it's that **17,000 eligible residents aren't enrolled in SNAP alone**. The city is leaving millions in federal dollars on the table because nobody is proactively connecting people to what they qualify for.
3. **NBConnected already exists.** The city launched a Granicus-powered 311 app in Feb 2025. It handles pothole reports and bill payments. Layering a chatbot on top of that adds marginal value. The city will not pay for a second version of what they just bought.
4. **38% of residents speak a non-English language at home.** Many are low-digital-literacy. An English-first chatbot on a website they'll never visit is useless.

---

## What You Actually Build: A Civic Intelligence Platform

### The Product in One Sentence

**An AI system that knows every benefit, service, and program available in New Bedford, figures out which residents are eligible but not enrolled, and reaches out to them through the channels they actually use — in their language.**

### Three Layers

```
┌─────────────────────────────────────────────────┐
│             LAYER 3: INTERFACES                  │
│   SMS / WhatsApp / Voice calls / Kiosks /        │
│   Community health workers / Web / NBConnected    │
└──────────────────────┬──────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────┐
│          LAYER 2: INTELLIGENCE ENGINE            │
│   Eligibility matching · Proactive outreach ·    │
│   Workflow orchestration · Resident profiles ·   │
│   Multilingual NLU · Community analytics         │
└──────────────────────┬──────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────┐
│          LAYER 1: DATA INTEGRATION               │
│   City systems (Granicus, permitting, billing) ·  │
│   State benefits (DTA, MassHealth, HIP, WIC) ·   │
│   Federal (HUD, SNAP, LIHEAP) · Nonprofits ·    │
│   Schools · Healthcare · Housing authorities      │
└─────────────────────────────────────────────────┘
```

---

## Layer 1: Data Integration (The Moat)

This is where the real defensibility lives. Not in the AI model — anyone can call an LLM API. The moat is in the **structured, maintained, real-time integration** with every system that matters in New Bedford.

### What you integrate with:

| System | Data | Purpose |
|--------|------|---------|
| **Granicus (NBConnected/311)** | Service requests, complaint history, resolution status | Don't replace it — augment it. Ride on top of the city's existing investment. |
| **City permitting system** | Permit applications, status, inspections, code violations | Enable end-to-end permit tracking and proactive status updates |
| **City billing / Munis** | Water/sewer bills, tax bills, payment history | Identify households falling behind on payments → trigger assistance program outreach |
| **MA DTA (Dept. of Transitional Assistance)** | SNAP, TAFDC, EAEDC eligibility rules, application status | Eligibility screening engine — "based on your household, you likely qualify for X" |
| **MassHealth** | Healthcare coverage eligibility, enrollment status | Connect uninsured residents to coverage they qualify for |
| **HIP (Healthy Incentives Program)** | Participating vendors, benefit amounts | Proactively notify SNAP recipients about HIP and where to use it locally |
| **HUD / NBHA (housing authority)** | Affordable housing waitlists, open applications, unit availability | Feed into the Housing Navigator (Idea #7) — cross-sell opportunity |
| **LIHEAP / fuel assistance** | Heating assistance eligibility, application periods | Seasonal proactive outreach before winter |
| **School district (NBPS)** | Free/reduced lunch eligibility, ELL student data, parent contact info | Reach immigrant families through the school channel they trust |
| **Nonprofits** | Immigrants' Assistance Center, United Way 211, food banks, legal aid | Unified directory with real-time capacity/availability, not just a static list |
| **Workforce training** | MassHire programs, Bristol CC courses, NOWI certifications | Connect unemployed/underemployed residents to training opportunities |

### How you build the integration layer:

You don't need API access to every system on day one. You build a **hybrid ingestion pipeline**:

1. **API integrations** where available (Granicus has APIs, MA DTA has some data feeds)
2. **Web scraping + structured extraction** for public-facing data (benefit program rules, eligibility criteria, application URLs)
3. **Manual curation + AI extraction** for nonprofit/community resources — have community health workers verify and update
4. **Partnership data feeds** — negotiate with the city and state for structured data access as you prove value

The key: you maintain a **canonical knowledge graph** of every program, service, benefit, and resource available to a New Bedford resident, with structured eligibility rules, application steps, deadlines, and contact information. This is the asset nobody else has.

---

## Layer 2: Intelligence Engine (The Brain)

### 2A. Eligibility Matching Engine

This is the core differentiator. Not "answer questions" — **proactively determine what each household qualifies for.**

**How it works:**
- Resident provides basic household info (family size, income range, age of members, housing status, employment status) through any channel — SMS, phone call, kiosk, community health worker intake
- The engine cross-references against the eligibility rules of **every program in the knowledge graph**
- Returns a personalized "benefits package" — here's everything you qualify for, ranked by dollar value and ease of application
- Tracks what they've already enrolled in, what's pending, what they're missing

**Example output for a New Bedford family:**

> *Maria, household of 4, income $38K, renter, 2 kids in NBPS:*
>
> - **SNAP:** You likely qualify for ~$680/month. You're not currently enrolled. [Apply here — we can help you fill it out]
> - **HIP:** As a SNAP recipient, you'd get $20/month extra for produce at Brooklawn Farm Stand or the Farmers Market. Auto-enrolled once you have SNAP.
> - **LIHEAP:** Heating assistance applications open Oct 1. We'll remind you. Estimated benefit: $800-1,200.
> - **MassHealth:** Your kids qualify for free coverage. You may qualify for ConnectorCare (subsidized). [Start enrollment]
> - **Free school meals:** Your kids auto-qualify. Make sure NBPS has your updated info.
> - **Affordable housing:** 3 developments have open waitlists matching your family size. [See listings]
> - **Workforce training:** MassHire has a free Advanced Manufacturing program starting next month. [Learn more]

**This is the GetCalFresh model expanded to every benefit, not just food assistance.** GetCalFresh helped 6.2 million people access $12.8 billion in food benefits. Apply that approach to the full stack of services in one city.

### 2B. Proactive Outreach Engine

The system doesn't wait for residents to come to it. It reaches out.

**Trigger-based outreach:**
- **Seasonal:** LIHEAP applications open → SMS blast to all likely-eligible households in their language
- **Event-driven:** New affordable housing waitlist opens → notify all residents who previously expressed interest
- **Behavioral:** Resident paid water bill late 3 months in a row → gentle outreach about payment assistance programs
- **Life-event:** New baby enrolled in NBPS → outreach about WIC, MassHealth for newborns, childcare subsidies
- **Policy change:** HIP benefit amount changes → notify all current SNAP recipients about the update

**Channel selection is critical.** The system picks the right channel for each resident:
- Younger, English-speaking → push notification via app
- Portuguese-speaking elder → phone call with pre-recorded message in Portuguese, option to connect to a live navigator
- Cape Verdean family → WhatsApp message in Creole (WhatsApp penetration in immigrant communities is extremely high)
- No smartphone → SMS
- No phone at all → community health worker home visit flag

### 2C. Workflow Orchestration

When a resident engages, don't just point them to a website — **complete the workflow end-to-end.**

**Example: SNAP application assistance**
1. Resident responds to outreach SMS: "Yes I want to apply"
2. AI assistant (in their language) walks them through the application questions conversationally via SMS/WhatsApp — no forms, no PDFs, no portal
3. System pre-fills known information (address, household size from prior interactions)
4. Collects required documentation — resident texts photos of pay stubs, ID
5. System packages and submits the application to MA DTA
6. Tracks status and notifies resident of approval/denial/required action
7. On approval, immediately follows up with HIP enrollment info and nearest participating vendors

**Example: 311 request with intelligence**
1. Resident texts: "The streetlight on Acushnet Ave by the school has been out for 2 weeks"
2. System creates a 311 work order in Granicus (not a separate system — feeds into the city's existing workflow)
3. AI enriches the request: tags it as school-adjacent (safety priority), checks if other residents have reported the same light, identifies the DPW crew zone
4. Sends resident a tracking number and estimated resolution time
5. When resolved, confirms with resident and asks if there are other issues

### 2D. Community Intelligence Dashboard (For the City)

This is what you sell to the city — not the resident-facing piece (that's the mission), but the **intelligence layer** the city has never had.

**What the dashboard shows:**
- **Demand heatmap:** Which neighborhoods are requesting which services most? Where are the concentrations of SNAP-eligible-but-unenrolled households?
- **Service gap analysis:** "47% of inquiries in the North End are about affordable housing, but there are 0 open waitlists in that area"
- **Outreach effectiveness:** Which channels work for which demographics? SMS response rate for Portuguese speakers: 34%. WhatsApp: 61%. Adjust.
- **Benefits recovery tracking:** "This quarter, the platform helped 340 households enroll in benefits worth $1.2M in annual federal/state dollars flowing into New Bedford"
- **Emerging issues radar:** Spike in questions about lead paint → flag for housing department before it becomes a crisis
- **Language access compliance:** Automated reporting for MA Executive Order 615 (language access requirements for government services)

This dashboard is what makes the Director of Data Management's job possible. It's the intelligence layer the Bloomberg Cities / Johns Hopkins data strategy needs to sit on top of.

---

## Layer 3: Interfaces (Meet People Where They Are)

The product is **channel-agnostic.** The same intelligence engine powers every touchpoint.

### SMS / Text Message
- Works on every phone, including flip phones
- No app download, no internet required
- Resident texts a city number → AI responds in their language
- Conversational, not menu-driven
- Highest reach for low-digital-literacy populations

### WhatsApp
- Dominant communication channel in Portuguese, Cape Verdean, and Hispanic immigrant communities
- Supports voice messages (critical for low-literacy users — they can speak their question)
- Group channels for community updates
- End-to-end encrypted

### Voice (Phone)
- Resident calls 311 or a dedicated number → AI voice agent handles the call
- Full conversation in Portuguese, Cape Verdean Creole, Spanish, or English
- Warm transfer to human navigator for complex cases
- Records and transcribes for follow-up

### Community Kiosks
- Rugged tablets placed at: public library branches, community health centers, Immigrants' Assistance Center, senior centers, laundromats, churches
- Walk-up interface, no login required
- Multilingual, touch-friendly, large text
- Can scan documents (photo of ID, pay stub) for benefit applications
- Staffed by community health workers during peak hours

### Community Health Worker (CHW) App
- CHWs and navigators use a dedicated app during home visits and community events
- Do intake on behalf of residents, run eligibility checks, start applications
- Track follow-ups and outcomes
- The CHW is a force multiplier — one trained navigator with this tool can serve 50+ households/month

### Web / NBConnected Integration
- For residents who are digitally comfortable
- Embed as a widget in the city's website and inside the NBConnected app
- Don't compete with Granicus — complement it

---

## What Makes This Not a Chatbot

| Chatbot | This Platform |
|---------|---------------|
| Waits for questions | Proactively reaches out to eligible residents |
| Answers with information | Completes transactions end-to-end |
| One channel (website) | SMS, WhatsApp, voice, kiosks, CHWs, web |
| English-first, translation bolted on | Multilingual by architecture (NLU models per language) |
| Generic — same in any city | Deep integration with New Bedford's specific systems and programs |
| Sells to IT department | Sells to the Mayor — "I recovered $1.2M in federal benefits for your residents this quarter" |
| Metric: questions answered | Metric: dollars of benefits enrolled, households served, service gaps closed |
| Replaced in a weekend by any LLM wrapper | Moat is the data integrations + knowledge graph + community trust |

---

## Go-to-Market: How You Actually Launch This

### Phase 1: Single-Benefit MVP (Months 1-4)

**Pick one benefit. Prove the model. SNAP is the obvious choice.**

- ~17,000 New Bedford residents are SNAP-eligible but not enrolled
- Each enrolled household brings $3,000-8,000/year in federal dollars into the local economy
- MA's SNAP error rate is 14.1% — the state needs better tooling

**Build:**
- SMS-based eligibility screener in English, Portuguese, and Spanish
- 5-question conversational flow: household size, income range, citizenship/residency, age of members, current benefits
- Returns: "You likely qualify for $X/month in SNAP. Want help applying? Reply YES."
- If YES → guided application flow via SMS, document collection, submission
- Track enrollment outcomes

**Prove:**
- Partner with 2-3 community organizations (Immigrants' Assistance Center, Coastline Elderly, United Way of Greater New Bedford) who already do benefits outreach manually
- They share the SMS number with their clients
- Target: 200 successful enrollments in 4 months
- Quantify: "200 households × $5K average annual SNAP benefit = $1M/year in federal dollars flowing into New Bedford's economy"

**That number is your pitch to the city.**

### Phase 2: Multi-Benefit + City Partnership (Months 5-10)

- Expand to LIHEAP, MassHealth, HIP, WIC, free school meals
- Formalize partnership with City of New Bedford — the Director of Data Management is your champion
- Integrate with Granicus/NBConnected (augment, don't replace)
- Add WhatsApp and voice channels
- Deploy 5-10 community kiosks
- Add the city intelligence dashboard
- Launch proactive outreach engine (seasonal triggers)

**Target:** 1,000 households served, $5M+ in annual benefits enrolled

### Phase 3: Full Civic Intelligence Platform (Months 11-18)

- Add housing, workforce, education, and nonprofit resource layers
- Full 311 intelligence augmentation
- Community health worker app
- Cape Verdean Creole language support (harder — smaller NLU training corpus)
- Publish city dashboard publicly for transparency
- Begin conversations with Fall River, Brockton, Lowell (same demographics, same problems)

### Phase 4: Gateway Cities Expansion (Months 18+)

Massachusetts has 26 designated Gateway Cities. Most share New Bedford's profile:
- High immigrant populations (Portuguese, Spanish, Khmer, Haitian Creole, Arabic — varies by city)
- High poverty rates
- Significant benefits underenrollment
- Under-resourced municipal governments
- Same state benefit systems (DTA, MassHealth, HIP)

The state integrations you build for New Bedford work in every MA Gateway City. The knowledge graph needs local customization (different nonprofits, different housing authorities) but the engine is the same. This is where the business scales.

---

## Revenue Model

| Revenue Stream | Phase | Amount | Payer |
|---------------|-------|--------|-------|
| **Municipal SaaS contract** | 2+ | $3-8K/month | City of New Bedford |
| **Per-enrollment fees** | 1+ | $25-50 per successful benefits enrollment | State agencies (MA DTA, MassHealth) or grant-funded |
| **Benefits recovery share** | 2+ | 1-3% of new federal/state dollars brought into the city | City budget (it's free money for them — every $1 you bring in, they keep $0.97) |
| **Grant funding** | 1+ | $50-200K/year | HUD CDBG, MA Community Innovation Challenge, Bloomberg Philanthropies, Code for America |
| **Nonprofit navigator licenses** | 2+ | $200-500/month per org | Community orgs who use the CHW tools |
| **Gateway Cities expansion** | 4+ | $3-8K/month per city | Other MA municipalities |
| **State-level contract** | 4+ | $50-200K/year | MA Executive Office of Health and Human Services (statewide deployment) |

### The Compelling Math for the City

New Bedford's poverty rate exceeds 20%. At 100,700 residents, that's ~20,000 households likely eligible for some form of assistance. If even 2,000 of those households are connected to benefits they're missing:

- 2,000 households × $5,000/year average benefit value = **$10M/year in federal and state dollars flowing into New Bedford's economy** that currently aren't
- Those dollars are spent locally — groceries, rent, heating oil, childcare — directly benefiting New Bedford businesses
- The city's cost: a SaaS contract of $50-100K/year
- **ROI: 100:1**

That's not a tech pitch. That's an economic development pitch. The Mayor can stand at a podium and say "We brought $10 million in new federal dollars into our community this year."

---

## Technical Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                     INTERFACE LAYER                           │
│                                                              │
│  Twilio        WhatsApp       Vonage/       Kiosk      Web   │
│  (SMS)         Business       Deepgram      App        Widget │
│                API            (Voice AI)                      │
└──────────┬──────────┬──────────┬──────────┬──────────┬───────┘
           │          │          │          │          │
           ▼          ▼          ▼          ▼          ▼
┌──────────────────────────────────────────────────────────────┐
│              CONVERSATION ORCHESTRATOR                        │
│                                                              │
│  Language detection · Intent classification · Context mgmt ·  │
│  Session state · Channel routing · Escalation to human        │
└──────────────────────────┬───────────────────────────────────┘
                           │
           ┌───────────────┼───────────────┐
           ▼               ▼               ▼
┌────────────────┐ ┌──────────────┐ ┌──────────────────┐
│  ELIGIBILITY   │ │   OUTREACH   │ │    WORKFLOW      │
│  ENGINE        │ │   ENGINE     │ │    ENGINE        │
│                │ │              │ │                  │
│ Rule matching  │ │ Trigger eval │ │ Application      │
│ Scoring        │ │ Channel sel  │ │ assembly         │
│ Prioritization │ │ Scheduling   │ │ Doc collection   │
│ Explanation    │ │ A/B testing  │ │ Submission       │
│ generation     │ │ Compliance   │ │ Status tracking  │
└───────┬────────┘ └──────┬───────┘ └────────┬─────────┘
        │                 │                   │
        ▼                 ▼                   ▼
┌──────────────────────────────────────────────────────────────┐
│                   KNOWLEDGE GRAPH                             │
│                                                              │
│  Programs · Eligibility rules · Application steps ·           │
│  Deadlines · Contacts · Capacity · Outcomes ·                │
│  Resident profiles (anonymized) · Interaction history         │
└──────────────────────────┬───────────────────────────────────┘
                           │
┌──────────────────────────▼───────────────────────────────────┐
│                 DATA INTEGRATION LAYER                        │
│                                                              │
│  Granicus API · MA DTA feeds · MassHealth · HUD ·            │
│  City billing · School district · Nonprofit directory ·      │
│  Web scrapers · Manual curation pipeline                      │
└──────────────────────────────────────────────────────────────┘
```

### Tech Stack (Practical)

| Component | Technology | Why |
|-----------|-----------|-----|
| **LLM backbone** | Claude API or GPT-4o | Conversational NLU, multilingual, instruction-following |
| **SMS/voice** | Twilio | Industry standard, handles SMS + voice + WhatsApp Business API |
| **Voice AI** | Deepgram (STT) + ElevenLabs/PlayHT (TTS) | Low-latency, multilingual voice |
| **Knowledge graph** | PostgreSQL + pgvector (or Neo4j if graph queries get complex) | Structured program data + vector search for fuzzy matching |
| **Eligibility engine** | Custom rules engine (Python) | Deterministic — you can't hallucinate eligibility; rules must be exact |
| **Outreach scheduler** | Celery + Redis (or Temporal for complex workflows) | Trigger-based, scheduled, retry logic |
| **Dashboard** | Next.js + D3/Recharts | City-facing analytics |
| **Hosting** | AWS GovCloud or Azure Government | FedRAMP compliance for government data |
| **Auth/PII** | SOC 2 compliant, encrypted at rest, minimal PII retention | Non-negotiable for government trust |

### Critical Technical Decisions

**1. Eligibility rules must be deterministic, not LLM-generated.**
The LLM handles conversation — understanding what the resident is saying, asking follow-up questions, explaining things in plain language. But the eligibility determination itself runs through a hand-coded rules engine where every threshold, exception, and edge case is verified against official program documentation. You cannot have an LLM hallucinate that someone qualifies for a benefit they don't, or miss one they do.

**2. Multilingual NLU is harder than translation.**
Don't just translate English prompts. Portuguese-speaking residents phrase things differently, use different metaphors, have different assumptions about government. You need native-speaker prompt engineering and conversation design for each language. Cape Verdean Creole is especially challenging — limited NLP training data exists. Plan for a hybrid approach: AI handles Portuguese and Spanish natively, Creole conversations get AI-assisted human navigator support initially, with the AI learning from those interactions over time.

**3. Privacy architecture must be airtight from day one.**
You're handling PII for vulnerable populations. One data breach and you lose community trust permanently. Design for minimal data retention: collect only what's needed for the current transaction, anonymize for analytics, let residents delete their data, never sell or share individual data. Get SOC 2 certification early. This is also a selling point to the city — "we handle the compliance so you don't have to."

---

## Competitive Landscape & Why You Win

| Competitor | What They Do | Why You're Different |
|-----------|-------------|---------------------|
| **Granicus (NBConnected)** | 311 reporting, bill pay, permits | You augment Granicus, not replace it. They're a reporting tool; you're an intelligence layer. They have no eligibility engine, no proactive outreach, no multilingual AI. |
| **Code for America (GetCalFresh)** | SNAP enrollment in California | Single-benefit, single-state. You're multi-benefit, and they're a nonprofit — you can move faster as a startup. Their model validates the approach. |
| **GovWell** | AI permitting/licensing platform | Focused on internal government workflows, not resident-facing services or benefits enrollment. Different buyer, different problem. |
| **Common Sense AI** | Municipal request automation | Generic automation layer. No knowledge graph, no eligibility engine, no multilingual depth, no community outreach. |
| **LaplaceX** | City-wide AI (traffic, energy, safety) | Smart city infrastructure play. Completely different — they optimize traffic lights; you connect families to food assistance. |
| **United Way 211** | Phone-based referral service | Human operators, limited hours, no proactive outreach, no application completion, no follow-up tracking. You're 211 with an AI brain and proactive muscles. |

### Your Actual Moat (in order of defensibility)

1. **Community trust.** Once immigrant families trust your platform — that it's safe, that it works, that it speaks their language — they won't switch. Trust in government-adjacent services is earned slowly and lost instantly. First mover advantage is enormous.
2. **Knowledge graph.** The structured, maintained, verified database of every program, eligibility rule, and resource in New Bedford. This takes months to build and constant effort to maintain. A competitor can't copy it overnight.
3. **Data integrations.** Each API connection, data feed, and partnership agreement is a brick in the wall. The city won't want to renegotiate data access with a second vendor.
4. **Outcome data.** After a year, you have data no one else has: which outreach channels work for which demographics, which benefits are most underenrolled, which neighborhoods need what. The city depends on this intelligence.
5. **Regulatory compliance.** SOC 2, FedRAMP, MA language access compliance, PII handling — once you've done the work, it's a barrier for lighter-weight competitors.

---

## Risks & Mitigations

| Risk | Severity | Mitigation |
|------|----------|------------|
| **City won't partner / bureaucratic slowness** | High | Start with nonprofits (Phase 1 doesn't need city cooperation). Prove value with enrollment numbers. City comes to you. |
| **Data access blocked** | Medium | Phase 1 uses only public data (program rules, eligibility criteria). Deeper integrations come after trust is established. |
| **Community distrust ("is this ICE?")** | High | Partner with trusted community orgs from day one. Never collect immigration status. Make data deletion easy. Have community advisory board with immigrant leaders. |
| **LLM hallucination on eligibility** | High | Deterministic rules engine for eligibility — LLM only handles conversation, never makes eligibility decisions. |
| **Cape Verdean Creole language support** | Medium | Start with human navigators for Creole, AI-assisted. Build Creole NLU over time from real conversations (with consent). |
| **Sustainability / grant dependency** | Medium | Phase 1 can be grant-funded, but the municipal SaaS model + benefits recovery share creates sustainable revenue by Phase 2. The ROI math (100:1) makes this an easy budget line for the city. |
| **Privacy / data breach** | Critical | SOC 2 from day one. Minimal PII retention. Encrypted everything. Annual third-party audits. This is existential — over-invest in security. |

---

## Team You Need

| Role | Why | Where to Find |
|------|-----|---------------|
| **Founder / CEO** | Sells the vision to the city, nonprofits, funders. Needs to be credible in New Bedford — ideally local or deeply connected. | You |
| **Full-stack engineer** | Builds the conversation orchestrator, eligibility engine, integrations. | UMass Dartmouth CS, remote hire, EforAll network |
| **Community partnerships lead** | Bilingual (Portuguese or Spanish). Builds relationships with nonprofits, churches, community health centers. Recruits CHWs. | Immigrants' Assistance Center alumni, community organizing networks |
| **Benefits policy specialist** | Knows MA DTA, MassHealth, HUD programs inside-out. Builds and maintains the eligibility rules engine. | Former DTA caseworker, legal aid staff, community action agency |
| **Part-time: Portuguese/Creole conversation designer** | Designs the AI conversation flows in Portuguese and Creole — not translation, but native conversation design. | UMass Dartmouth linguistics, Cape Verdean community leaders |

You don't need a team of 15. You need 3-4 people for Phase 1. The community partnerships lead is arguably more important than the engineer — the tech is buildable, the trust is not.

---

## First 30 Days Action Plan

| Week | Action |
|------|--------|
| **1** | Meet with Immigrants' Assistance Center, Coastline Elderly, United Way of Greater NB. Pitch the concept. Get 2 partners committed to pilot. |
| **2** | Map every SNAP-related resource, rule, and application step in MA. Build v0.1 of the eligibility rules engine in a spreadsheet. |
| **3** | Set up Twilio SMS. Build a bare-bones conversational SNAP screener (5 questions → eligibility estimate → "want help applying?"). Test with 10 community org staff members. |
| **4** | Soft launch with 50 residents through partner orgs. Measure: completion rate, accuracy of eligibility estimates, language distribution, time to enrollment. Iterate. |
