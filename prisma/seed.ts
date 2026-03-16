import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ---------------------------------------------------------------------------
// SCENARIO: "Catalyst Creative" — A solo AI-powered creative agency
//
// Jordan Davis runs a one-person agency using AI to deliver premium creative
// services to 10 clients across tech, DTC, healthcare, fintech, food & bev,
// legal tech, edtech, real estate, non-profit, and fitness. The agency has
// been operating for 6 months (Oct 2025 → Mar 2026), growing from $12K/mo
// to $48K/mo revenue with ~97% gross margins.
//
// This seed creates a rich, interconnected dataset that exercises every
// feature surface of AgentOS: dashboard KPIs, client CRM, service catalog,
// engagement tracking, AI production workflows, task SLA management,
// client messaging with sentiment, deliverable versioning with quality
// scores, invoicing, margin analytics, and activity logging.
// ---------------------------------------------------------------------------

async function main() {
  // Wipe everything in dependency order
  await prisma.activityLog.deleteMany();
  await prisma.approval.deleteMany();
  await prisma.deliverableVersion.deleteMany();
  await prisma.deliverable.deleteMany();
  await prisma.productionWorkflow.deleteMany();
  await prisma.task.deleteMany();
  await prisma.clientMessage.deleteMany();
  await prisma.knowledgeAsset.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.engagement.deleteMany();
  await prisma.marginMetric.deleteMany();
  await prisma.serviceProduct.deleteMany();
  await prisma.client.deleteMany();

  const now = new Date();
  const h = 3600000;   // 1 hour in ms
  const d = 86400000;  // 1 day in ms

  // ==========================================================================
  // CLIENTS — 10 clients modeled on real-world archetypes
  // ==========================================================================

  await Promise.all([
    // 1. Series-B AI/robotics startup (like Covariant or Figure AI)
    prisma.client.create({
      data: {
        id: "client-horizon",
        name: "Horizon Robotics",
        contactName: "Kai Nakamura",
        contactEmail: "kai@horizonrobotics.ai",
        industry: "AI / Robotics",
        brandVoice: "Visionary, precise, technically sophisticated yet accessible to investors",
        status: "active",
        churnRisk: 0.04,
        tier: "enterprise",
      },
    }),
    // 2. Luxury DTC wine brand (like Winc or Bright Cellars)
    prisma.client.create({
      data: {
        id: "client-velvet",
        name: "Velvet & Vine",
        contactName: "Isabella Moreau",
        contactEmail: "isabella@velvetandvine.com",
        industry: "Luxury DTC / Wine",
        brandVoice: "Elegant, sensory, intimate storytelling with a modern edge",
        status: "active",
        churnRisk: 0.06,
        tier: "premium",
      },
    }),
    // 3. Digital health platform (like Hims or Ro)
    prisma.client.create({
      data: {
        id: "client-pulse",
        name: "PulsePoint Health",
        contactName: "Dr. Amara Okafor",
        contactEmail: "amara@pulsepointhealth.com",
        industry: "Digital Health",
        brandVoice: "Empathetic, evidence-based, warm yet clinical authority",
        status: "active",
        churnRisk: 0.12,
        tier: "enterprise",
      },
    }),
    // 4. Neo-bank for freelancers (like Mercury or Lili)
    prisma.client.create({
      data: {
        id: "client-nomad",
        name: "Nomad Financial",
        contactName: "Ravi Patel",
        contactEmail: "ravi@nomadfinancial.io",
        industry: "Fintech",
        brandVoice: "Bold, empowering, no-nonsense with a creative spirit",
        status: "active",
        churnRisk: 0.09,
        tier: "premium",
      },
    }),
    // 5. Sustainable home goods e-commerce (like Grove or Public Goods)
    prisma.client.create({
      data: {
        id: "client-ecohaven",
        name: "EcoHaven",
        contactName: "Lena Johansson",
        contactEmail: "lena@ecohaven.co",
        industry: "Sustainable E-Commerce",
        brandVoice: "Earthy, transparent, optimistic activism with product credibility",
        status: "active",
        churnRisk: 0.07,
        tier: "standard",
      },
    }),
    // 6. Legal SaaS for small firms (like Clio or LegalZoom)
    prisma.client.create({
      data: {
        id: "client-atlas",
        name: "Atlas Legal Tech",
        contactName: "Marcus Chen",
        contactEmail: "marcus@atlaslegaltech.com",
        industry: "Legal SaaS",
        brandVoice: "Authoritative, clear, jargon-free professionalism",
        status: "active",
        churnRisk: 0.05,
        tier: "premium",
      },
    }),
    // 7. EdTech platform (like Coursera or MasterClass)
    prisma.client.create({
      data: {
        id: "client-bright",
        name: "Bright Minds Academy",
        contactName: "Prof. Natasha Volkov",
        contactEmail: "natasha@brightminds.edu",
        industry: "EdTech",
        brandVoice: "Inspiring, inclusive, intellectually curious with warmth",
        status: "paused",
        churnRisk: 0.42,
        tier: "standard",
      },
    }),
    // 8. Artisan food brand (like Fly By Jing or Momofuku Goods)
    prisma.client.create({
      data: {
        id: "client-forge",
        name: "Forge & Flame BBQ",
        contactName: "Darnell Washington",
        contactEmail: "darnell@forgeandflame.com",
        industry: "Food & Beverage",
        brandVoice: "Bold, smoky, unapologetically flavorful with Southern heritage",
        status: "active",
        churnRisk: 0.11,
        tier: "standard",
      },
    }),
    // 9. Real estate tech platform (like Compass or Opendoor)
    prisma.client.create({
      data: {
        id: "client-keystone",
        name: "Keystone Properties",
        contactName: "Rachel Torres",
        contactEmail: "rachel@keystoneproperties.com",
        industry: "Real Estate Tech",
        brandVoice: "Trustworthy, aspirational, data-driven with neighborhood warmth",
        status: "active",
        churnRisk: 0.08,
        tier: "premium",
      },
    }),
    // 10. Non-profit / climate (like Team Trees or 1% for the Planet)
    prisma.client.create({
      data: {
        id: "client-canopy",
        name: "Canopy Climate Initiative",
        contactName: "Zara Osei",
        contactEmail: "zara@canopyclimate.org",
        industry: "Non-Profit / Climate",
        brandVoice: "Urgent, hopeful, science-backed storytelling that moves people to action",
        status: "churned",
        churnRisk: 0.88,
        tier: "standard",
      },
    }),
  ]);

  // ==========================================================================
  // SERVICE PRODUCTS — 8 productized offerings
  // ==========================================================================

  await Promise.all([
    prisma.serviceProduct.create({
      data: {
        id: "sp-brand",
        name: "Brand Identity System",
        description: "Complete brand identity: logo system, color palette, typography, brand guidelines, social templates, and brand voice documentation",
        deliverableType: "brand_kit",
        scope: "Logo (5 concepts → 1 final), color system, typography pairing, 40-page brand guidelines PDF, social media template kit",
        turnaroundHours: 72,
        price: 5500,
        costEstimate: 145,
        category: "Branding",
        templatePrompt: "Generate a comprehensive brand identity system for {client_name} in the {industry} industry. Brand voice: {brand_voice}. Include logo concepts, color palette rationale, typography system, and usage guidelines.",
      },
    }),
    prisma.serviceProduct.create({
      data: {
        id: "sp-launch",
        name: "Product Launch Campaign",
        description: "Full-funnel digital launch: ad creatives, landing pages, email sequences, social content, and PR draft",
        deliverableType: "campaign_package",
        scope: "15 ad creatives (Meta/Google), 2 landing pages, 7-email nurture sequence, 30-day social calendar, press release draft",
        turnaroundHours: 96,
        price: 4200,
        costEstimate: 110,
        category: "Marketing",
        templatePrompt: "Create a comprehensive product launch campaign for {client_name}. Product: {product_name}. Target audience: {audience}. Campaign goal: {goal}.",
      },
    }),
    prisma.serviceProduct.create({
      data: {
        id: "sp-webcopy",
        name: "Website Copy & UX Writing",
        description: "Complete website copy overhaul with conversion optimization, SEO, and microcopy for key user flows",
        deliverableType: "website_copy",
        scope: "Homepage, About, Product/Service pages (up to 5), 3 landing pages, all CTAs, meta descriptions, 404/error pages",
        turnaroundHours: 48,
        price: 3500,
        costEstimate: 82,
        category: "Content",
        templatePrompt: "Write conversion-optimized website copy for {client_name}. Industry: {industry}. Voice: {brand_voice}. SEO keywords: {keywords}.",
      },
    }),
    prisma.serviceProduct.create({
      data: {
        id: "sp-pitch",
        name: "Investor Pitch Deck",
        description: "Narrative-driven pitch deck with data visualization, financial models layout, and appendix materials",
        deliverableType: "pitch_deck",
        scope: "20-25 slide deck, executive summary one-pager, financial model visualization, competitive landscape, appendix with detailed metrics",
        turnaroundHours: 36,
        price: 4000,
        costEstimate: 95,
        category: "Strategy",
        templatePrompt: "Create an investor pitch deck for {client_name}. Stage: {stage}. Ask: {raise_amount}. Key metrics: {metrics}.",
      },
    }),
    prisma.serviceProduct.create({
      data: {
        id: "sp-content",
        name: "Content Marketing Engine",
        description: "Monthly content production system: blog posts, newsletters, thought leadership, SEO strategy, and content calendar",
        deliverableType: "content_engine",
        scope: "10 blog posts (1500+ words), 4 newsletters, 2 thought leadership pieces, SEO keyword map, monthly content calendar, style guide",
        turnaroundHours: 120,
        price: 6000,
        costEstimate: 195,
        category: "Content",
        templatePrompt: "Build a monthly content production engine for {client_name}. Topics: {topics}. Audience: {audience}. SEO targets: {keywords}.",
      },
    }),
    prisma.serviceProduct.create({
      data: {
        id: "sp-email",
        name: "Email Marketing Suite",
        description: "Complete email system: welcome series, nurture flows, promotional templates, and re-engagement campaigns",
        deliverableType: "email_suite",
        scope: "5-email welcome series, 7-email nurture flow, 4 promotional templates, 3-email re-engagement series, subject line variants",
        turnaroundHours: 36,
        price: 2800,
        costEstimate: 68,
        category: "Marketing",
        templatePrompt: "Design a complete email marketing system for {client_name}. Goals: {goals}. Segments: {segments}. Voice: {brand_voice}.",
      },
    }),
    prisma.serviceProduct.create({
      data: {
        id: "sp-social",
        name: "Social Media Content Pack",
        description: "30-day social media content package with platform-specific copy, hashtag strategy, and engagement scripts",
        deliverableType: "social_pack",
        scope: "60 posts (IG/LinkedIn/X), 8 carousel scripts, 4 video scripts, hashtag strategy, engagement response templates",
        turnaroundHours: 48,
        price: 3000,
        costEstimate: 75,
        category: "Social",
        templatePrompt: "Create a 30-day social media content pack for {client_name}. Platforms: {platforms}. Voice: {brand_voice}. Campaign: {campaign}.",
      },
    }),
    prisma.serviceProduct.create({
      data: {
        id: "sp-legal",
        name: "Corporate Legal Document Suite",
        description: "Essential legal documents: terms of service, privacy policy, MSA, NDA, SOW templates, and GDPR compliance docs",
        deliverableType: "legal_docs",
        scope: "Terms of Service, Privacy Policy, Master Service Agreement, NDA template, SOW template, Cookie Policy, GDPR data processing addendum",
        turnaroundHours: 24,
        price: 2500,
        costEstimate: 52,
        category: "Legal",
        templatePrompt: "Generate comprehensive legal documents for {client_name}. Industry: {industry}. Jurisdiction: {jurisdiction}. Special requirements: {requirements}.",
      },
    }),
  ]);

  // ==========================================================================
  // ENGAGEMENTS — 16 projects across all statuses
  // ==========================================================================

  await Promise.all([
    // --- COMPLETED engagements (5) ---
    prisma.engagement.create({
      data: {
        id: "eng-1",
        clientId: "client-horizon",
        serviceProductId: "sp-pitch",
        status: "completed",
        startDate: new Date(now.getTime() - 30 * d),
        dueDate: new Date(now.getTime() - 22 * d),
        completedAt: new Date(now.getTime() - 23 * d),
        totalRevenue: 4000,
        totalCost: 88,
        notes: "Series B pitch deck — approved first review. Kai said it closed their $40M round.",
      },
    }),
    prisma.engagement.create({
      data: {
        id: "eng-2",
        clientId: "client-atlas",
        serviceProductId: "sp-legal",
        status: "completed",
        startDate: new Date(now.getTime() - 25 * d),
        dueDate: new Date(now.getTime() - 18 * d),
        completedAt: new Date(now.getTime() - 19 * d),
        totalRevenue: 2500,
        totalCost: 48,
        notes: "Full legal doc suite for their SaaS platform launch. Clean one-pass approval.",
      },
    }),
    prisma.engagement.create({
      data: {
        id: "eng-3",
        clientId: "client-velvet",
        serviceProductId: "sp-brand",
        status: "completed",
        startDate: new Date(now.getTime() - 45 * d),
        dueDate: new Date(now.getTime() - 35 * d),
        completedAt: new Date(now.getTime() - 36 * d),
        totalRevenue: 5500,
        totalCost: 140,
        notes: "Premium wine brand identity. Isabella loved the hand-drawn vine motifs. Featured in Vogue.",
      },
    }),
    prisma.engagement.create({
      data: {
        id: "eng-4",
        clientId: "client-pulse",
        serviceProductId: "sp-webcopy",
        status: "completed",
        startDate: new Date(now.getTime() - 20 * d),
        dueDate: new Date(now.getTime() - 14 * d),
        completedAt: new Date(now.getTime() - 14 * d),
        totalRevenue: 3500,
        totalCost: 78,
        notes: "HIPAA-sensitive copy for patient portal. Required medical review. Approved after one revision.",
      },
    }),
    prisma.engagement.create({
      data: {
        id: "eng-5",
        clientId: "client-canopy",
        serviceProductId: "sp-social",
        status: "completed",
        startDate: new Date(now.getTime() - 60 * d),
        dueDate: new Date(now.getTime() - 50 * d),
        completedAt: new Date(now.getTime() - 52 * d),
        totalRevenue: 3000,
        totalCost: 70,
        notes: "Climate awareness campaign for COP31 buildup. Canopy paused after this due to funding.",
      },
    }),

    // --- ACTIVE engagements (6) ---
    prisma.engagement.create({
      data: {
        id: "eng-6",
        clientId: "client-nomad",
        serviceProductId: "sp-launch",
        status: "active",
        startDate: new Date(now.getTime() - 5 * d),
        dueDate: new Date(now.getTime() + 3 * d),
        totalRevenue: 4200,
        totalCost: 95,
        notes: "Freelancer checking account launch — Series A marketing push. Tight 8-day turnaround.",
      },
    }),
    prisma.engagement.create({
      data: {
        id: "eng-7",
        clientId: "client-ecohaven",
        serviceProductId: "sp-content",
        status: "active",
        startDate: new Date(now.getTime() - 12 * d),
        dueDate: new Date(now.getTime() + 6 * d),
        totalRevenue: 6000,
        totalCost: 180,
        notes: "Monthly content engine — Earth Month special campaign (April). Heavy SEO focus.",
      },
    }),
    prisma.engagement.create({
      data: {
        id: "eng-8",
        clientId: "client-horizon",
        serviceProductId: "sp-content",
        status: "active",
        startDate: new Date(now.getTime() - 8 * d),
        dueDate: new Date(now.getTime() + 10 * d),
        totalRevenue: 6000,
        totalCost: 185,
        notes: "Technical blog series on warehouse automation AI. Targeting engineering hires.",
      },
    }),
    prisma.engagement.create({
      data: {
        id: "eng-9",
        clientId: "client-forge",
        serviceProductId: "sp-brand",
        status: "active",
        startDate: new Date(now.getTime() - 6 * d),
        dueDate: new Date(now.getTime() + 4 * d),
        totalRevenue: 5500,
        totalCost: 135,
        notes: "Full rebrand from local BBQ joint to national DTC brand. Darnell wants 'smoke meets sophistication'.",
      },
    }),
    prisma.engagement.create({
      data: {
        id: "eng-10",
        clientId: "client-keystone",
        serviceProductId: "sp-email",
        status: "active",
        startDate: new Date(now.getTime() - 4 * d),
        dueDate: new Date(now.getTime() + 5 * d),
        totalRevenue: 2800,
        totalCost: 62,
        notes: "Buyer nurture + seller acquisition email flows. Spring housing market push.",
      },
    }),
    prisma.engagement.create({
      data: {
        id: "eng-11",
        clientId: "client-velvet",
        serviceProductId: "sp-launch",
        status: "active",
        startDate: new Date(now.getTime() - 3 * d),
        dueDate: new Date(now.getTime() + 7 * d),
        totalRevenue: 4200,
        totalCost: 100,
        notes: "Summer rosé collection launch — 'Golden Hour' campaign. Instagram-first strategy.",
      },
    }),

    // --- IN REVIEW engagements (2) ---
    prisma.engagement.create({
      data: {
        id: "eng-12",
        clientId: "client-atlas",
        serviceProductId: "sp-webcopy",
        status: "in_review",
        startDate: new Date(now.getTime() - 10 * d),
        dueDate: new Date(now.getTime() - 1 * d),
        totalRevenue: 3500,
        totalCost: 80,
        notes: "SaaS marketing site copy. Marcus reviewing final CTAs. 1 day overdue on feedback.",
      },
    }),
    prisma.engagement.create({
      data: {
        id: "eng-13",
        clientId: "client-pulse",
        serviceProductId: "sp-email",
        status: "in_review",
        startDate: new Date(now.getTime() - 7 * d),
        dueDate: new Date(now.getTime() + 1 * d),
        totalRevenue: 2800,
        totalCost: 65,
        notes: "Patient onboarding email flows. Dr. Okafor reviewing medical accuracy of health tips.",
      },
    }),

    // --- PROPOSAL engagements (2) ---
    prisma.engagement.create({
      data: {
        id: "eng-14",
        clientId: "client-nomad",
        serviceProductId: "sp-pitch",
        status: "proposal",
        startDate: new Date(now.getTime()),
        dueDate: new Date(now.getTime() + 5 * d),
        totalRevenue: 4000,
        totalCost: 0,
        notes: "Ravi wants a Series B deck for September raise. Sent pre-sale mockup of 5 key slides.",
      },
    }),
    prisma.engagement.create({
      data: {
        id: "eng-15",
        clientId: "client-forge",
        serviceProductId: "sp-launch",
        status: "proposal",
        startDate: new Date(now.getTime()),
        dueDate: new Date(now.getTime() + 8 * d),
        totalRevenue: 4200,
        totalCost: 0,
        notes: "Nationwide DTC launch campaign for new 'Pitmaster Reserve' sauce line. Awaiting sign-off.",
      },
    }),

    // --- CANCELLED engagement (1) ---
    prisma.engagement.create({
      data: {
        id: "eng-16",
        clientId: "client-bright",
        serviceProductId: "sp-content",
        status: "cancelled",
        startDate: new Date(now.getTime() - 15 * d),
        dueDate: new Date(now.getTime() - 5 * d),
        totalRevenue: 0,
        totalCost: 45,
        notes: "Bright Minds paused all marketing spend after board restructuring. Absorbed sunk cost.",
      },
    }),
  ]);

  // ==========================================================================
  // DELIVERABLES — Artifacts for each engagement
  // ==========================================================================

  await Promise.all([
    // eng-1 (Horizon pitch deck — completed)
    prisma.deliverable.create({ data: { id: "del-1", engagementId: "eng-1", title: "Series B Pitch Deck (25 slides)", type: "presentation", status: "approved", currentVersion: 1 } }),
    prisma.deliverable.create({ data: { id: "del-2", engagementId: "eng-1", title: "Executive Summary One-Pager", type: "document", status: "approved", currentVersion: 1 } }),

    // eng-3 (Velvet brand identity — completed)
    prisma.deliverable.create({ data: { id: "del-3", engagementId: "eng-3", title: "Logo System (5 concepts → final)", type: "design", status: "approved", currentVersion: 3 } }),
    prisma.deliverable.create({ data: { id: "del-4", engagementId: "eng-3", title: "Brand Guidelines (40 pages)", type: "document", status: "approved", currentVersion: 2 } }),
    prisma.deliverable.create({ data: { id: "del-5", engagementId: "eng-3", title: "Social Media Template Kit", type: "design", status: "approved", currentVersion: 1 } }),

    // eng-4 (PulsePoint website copy — completed)
    prisma.deliverable.create({ data: { id: "del-6", engagementId: "eng-4", title: "Patient Portal Homepage Copy", type: "copy", status: "approved", currentVersion: 2 } }),
    prisma.deliverable.create({ data: { id: "del-7", engagementId: "eng-4", title: "Service Pages (5x)", type: "copy", status: "approved", currentVersion: 1 } }),

    // eng-6 (Nomad launch campaign — active)
    prisma.deliverable.create({ data: { id: "del-8", engagementId: "eng-6", title: "Ad Creative Set (15 variants)", type: "creative", status: "approved", currentVersion: 1 } }),
    prisma.deliverable.create({ data: { id: "del-9", engagementId: "eng-6", title: "Landing Page: Freelancer Checking", type: "copy", status: "in_review", currentVersion: 2 } }),
    prisma.deliverable.create({ data: { id: "del-10", engagementId: "eng-6", title: "7-Email Nurture Sequence", type: "copy", status: "draft", currentVersion: 1 } }),
    prisma.deliverable.create({ data: { id: "del-11", engagementId: "eng-6", title: "Press Release Draft", type: "document", status: "draft", currentVersion: 1 } }),

    // eng-7 (EcoHaven content engine — active)
    prisma.deliverable.create({ data: { id: "del-12", engagementId: "eng-7", title: "Blog Posts: Earth Month Series (10x)", type: "content", status: "in_review", currentVersion: 2 } }),
    prisma.deliverable.create({ data: { id: "del-13", engagementId: "eng-7", title: "Newsletter Templates (4x)", type: "content", status: "draft", currentVersion: 1 } }),
    prisma.deliverable.create({ data: { id: "del-14", engagementId: "eng-7", title: "SEO Keyword Map & Content Calendar", type: "document", status: "approved", currentVersion: 1 } }),

    // eng-8 (Horizon content engine — active)
    prisma.deliverable.create({ data: { id: "del-15", engagementId: "eng-8", title: "Technical Blog: 'Future of Warehouse AI' Series (10x)", type: "content", status: "in_review", currentVersion: 2 } }),
    prisma.deliverable.create({ data: { id: "del-16", engagementId: "eng-8", title: "Engineering Recruitment Thought Leadership (2x)", type: "content", status: "draft", currentVersion: 1 } }),

    // eng-9 (Forge brand — active)
    prisma.deliverable.create({ data: { id: "del-17", engagementId: "eng-9", title: "Logo Concepts: 'Smoke Meets Sophistication' (5x)", type: "design", status: "in_review", currentVersion: 2 } }),
    prisma.deliverable.create({ data: { id: "del-18", engagementId: "eng-9", title: "Brand Guidelines Draft", type: "document", status: "draft", currentVersion: 1 } }),
    prisma.deliverable.create({ data: { id: "del-19", engagementId: "eng-9", title: "Packaging Label Concepts", type: "design", status: "draft", currentVersion: 1 } }),

    // eng-10 (Keystone emails — active)
    prisma.deliverable.create({ data: { id: "del-20", engagementId: "eng-10", title: "Buyer Nurture Email Flow (5x)", type: "copy", status: "in_review", currentVersion: 1 } }),
    prisma.deliverable.create({ data: { id: "del-21", engagementId: "eng-10", title: "Seller Acquisition Sequence (5x)", type: "copy", status: "draft", currentVersion: 1 } }),
    prisma.deliverable.create({ data: { id: "del-22", engagementId: "eng-10", title: "Re-engagement Campaign (3x)", type: "copy", status: "draft", currentVersion: 1 } }),

    // eng-11 (Velvet launch — active)
    prisma.deliverable.create({ data: { id: "del-23", engagementId: "eng-11", title: "Golden Hour Campaign Creatives (15x)", type: "creative", status: "draft", currentVersion: 1 } }),
    prisma.deliverable.create({ data: { id: "del-24", engagementId: "eng-11", title: "Landing Page: Summer Rosé Collection", type: "copy", status: "draft", currentVersion: 1 } }),

    // eng-12 (Atlas website copy — in review)
    prisma.deliverable.create({ data: { id: "del-25", engagementId: "eng-12", title: "SaaS Homepage & Product Pages", type: "copy", status: "in_review", currentVersion: 2 } }),
    prisma.deliverable.create({ data: { id: "del-26", engagementId: "eng-12", title: "Landing Pages: Free Trial & Demo", type: "copy", status: "revision_requested", currentVersion: 2 } }),

    // eng-13 (PulsePoint emails — in review)
    prisma.deliverable.create({ data: { id: "del-27", engagementId: "eng-13", title: "Patient Onboarding Welcome Series (5x)", type: "copy", status: "in_review", currentVersion: 1 } }),
    prisma.deliverable.create({ data: { id: "del-28", engagementId: "eng-13", title: "Health Tips Nurture Flow (7x)", type: "copy", status: "revision_requested", currentVersion: 2 } }),
  ]);

  // ==========================================================================
  // DELIVERABLE VERSIONS — AI iteration history with quality scores
  // ==========================================================================

  await Promise.all([
    // Horizon pitch deck — nailed it first try
    prisma.deliverableVersion.create({ data: { deliverableId: "del-1", versionNumber: 1, content: "25-slide Series B deck. Narrative arc: Problem (warehouse labor crisis) → Solution (AI-native robotics) → Traction ($8M ARR, 340% growth) → Vision (autonomous logistics). Includes TAM/SAM/SOM, unit economics, and team slides.", changeNotes: "Generated from Horizon brand brief + financial data", generatedBy: "ai", qualityScore: 9.4 } }),

    // Velvet logo — 3 iterations
    prisma.deliverableVersion.create({ data: { deliverableId: "del-3", versionNumber: 1, content: "5 logo concepts: (1) Flowing vine script, (2) Geometric grape cluster, (3) Minimalist 'V&V' monogram, (4) Hand-drawn vineyard illustration, (5) Modern serif wordmark", changeNotes: "Initial AI generation based on luxury wine brief", generatedBy: "ai", qualityScore: 7.2 } }),
    prisma.deliverableVersion.create({ data: { deliverableId: "del-3", versionNumber: 2, content: "Refined to 3 directions: vine script with gold foil, monogram with grape motif, modern serif. Added color explorations: burgundy, champagne gold, forest green.", changeNotes: "Isabella loved vine script + monogram. Dropped geometric and illustration.", generatedBy: "hybrid", qualityScore: 8.5 } }),
    prisma.deliverableVersion.create({ data: { deliverableId: "del-3", versionNumber: 3, content: "Final: Vine script primary mark with 'V&V' monogram secondary. Burgundy + champagne gold palette. Custom ligatures on ampersand.", changeNotes: "Final selection: vine script primary. Monogram for social/favicon. Client ecstatic.", generatedBy: "hybrid", qualityScore: 9.6 } }),

    // Velvet brand guidelines — 2 iterations
    prisma.deliverableVersion.create({ data: { deliverableId: "del-4", versionNumber: 1, content: "40-page brand guidelines: logo usage, color system (primary: burgundy #722F37, gold #C5A572), typography (Cormorant Garamond + Montserrat), photography style, social templates", changeNotes: "Generated from approved logo and brand voice", generatedBy: "ai", qualityScore: 8.2 } }),
    prisma.deliverableVersion.create({ data: { deliverableId: "del-4", versionNumber: 2, content: "Updated: Added wine label application guidelines, bottle photography art direction, tasting note copy templates. Expanded social section with Instagram story templates.", changeNotes: "Isabella requested wine-specific application examples", generatedBy: "hybrid", qualityScore: 9.1 } }),

    // PulsePoint homepage — medical accuracy revision
    prisma.deliverableVersion.create({ data: { deliverableId: "del-6", versionNumber: 1, content: "Hero: 'Healthcare that comes to you.' Sub: 'Board-certified doctors, personalized treatment plans, delivered to your door.' CTAs: 'Start Your Visit' / 'See How It Works'", changeNotes: "Initial generation from health platform brief", generatedBy: "ai", qualityScore: 7.0 } }),
    prisma.deliverableVersion.create({ data: { deliverableId: "del-6", versionNumber: 2, content: "Hero: 'Your health journey, guided by science.' Sub: 'Connect with board-certified physicians for personalized, evidence-based care — from your phone.' Added FDA compliance disclaimers.", changeNotes: "Dr. Okafor flagged medical claims. Softened language, added disclaimers.", generatedBy: "hybrid", qualityScore: 9.0 } }),

    // Nomad landing page — 2 iterations
    prisma.deliverableVersion.create({ data: { deliverableId: "del-9", versionNumber: 1, content: "Hero: 'Banking that gets the gig.' Sub: 'The checking account built for freelancers: instant invoicing, tax auto-set-aside, no fees.' CTA: 'Open Your Account'", changeNotes: "Generated from Nomad freelancer banking brief", generatedBy: "ai", qualityScore: 7.8 } }),
    prisma.deliverableVersion.create({ data: { deliverableId: "del-9", versionNumber: 2, content: "Hero: 'Your money works as hard as you do.' Sub: 'Freelancer checking with instant invoicing, automatic tax savings, and zero hidden fees. Built by freelancers, for freelancers.' Added social proof section with 12K+ beta users.", changeNotes: "Ravi wanted more emotional resonance + social proof", generatedBy: "hybrid", qualityScore: 8.9 } }),

    // EcoHaven blog posts — revision for SEO
    prisma.deliverableVersion.create({ data: { deliverableId: "del-12", versionNumber: 1, content: "10 Earth Month blog posts: (1) 'The Hidden Cost of Fast Furniture' (2) 'Zero-Waste Kitchen Starter Kit' (3) 'How We Source Our Bamboo' (4) 'Composting for Apartment Dwellers' (5-10) ...", changeNotes: "Batch generation from content calendar + SEO map", generatedBy: "ai", qualityScore: 7.5 } }),
    prisma.deliverableVersion.create({ data: { deliverableId: "del-12", versionNumber: 2, content: "Revised all 10 posts: improved keyword density (target: 'sustainable home goods', 'eco-friendly kitchen'), added internal linking strategy, expanded 'How We Source' with supply chain transparency data.", changeNotes: "Lena wanted stronger SEO + more transparency storytelling", generatedBy: "hybrid", qualityScore: 8.8 } }),

    // Horizon technical blogs — iteration for engineering accuracy
    prisma.deliverableVersion.create({ data: { deliverableId: "del-15", versionNumber: 1, content: "10 posts: (1) 'Why Warehouse Automation Needs New AI' (2) 'Sim-to-Real Transfer in Robotics' (3) 'Building Robust Grasping Policies' (4) 'Our MLOps Stack' (5-10) ...", changeNotes: "Generated from engineering brief + arxiv references", generatedBy: "ai", qualityScore: 7.8 } }),
    prisma.deliverableVersion.create({ data: { deliverableId: "del-15", versionNumber: 2, content: "Revised posts 1-5: Added code snippets (PyTorch examples), corrected reinforcement learning terminology, added benchmark comparison tables. Kai's CTO reviewed for accuracy.", changeNotes: "CTO flagged RL terminology issues. Added code examples per eng team request.", generatedBy: "hybrid", qualityScore: 9.2 } }),

    // Forge logo — bold BBQ rebrand
    prisma.deliverableVersion.create({ data: { deliverableId: "del-17", versionNumber: 1, content: "5 concepts: (1) Flame-forged anvil mark, (2) Smoky script logotype, (3) Geometric grill grate pattern, (4) Rustic woodcut illustration, (5) Modern bold 'F&F' monogram", changeNotes: "Initial brand concepts from 'smoke meets sophistication' brief", generatedBy: "ai", qualityScore: 7.0 } }),
    prisma.deliverableVersion.create({ data: { deliverableId: "del-17", versionNumber: 2, content: "Narrowed to 3: anvil mark (refined with subtle flame detail), smoky script (added char texture), bold monogram (stamped/branded aesthetic). Colors: charcoal, ember orange, cream.", changeNotes: "Darnell loved the anvil and script. 'Make it feel like it was forged in fire.'", generatedBy: "hybrid", qualityScore: 8.6 } }),

    // Atlas website copy — revision requested on CTAs
    prisma.deliverableVersion.create({ data: { deliverableId: "del-25", versionNumber: 1, content: "Homepage: 'Legal practice management, simplified.' Product pages for Case Management, Billing, Client Portal, Document Automation. Tone: professional, clear.", changeNotes: "Generated from legal SaaS product brief", generatedBy: "ai", qualityScore: 7.5 } }),
    prisma.deliverableVersion.create({ data: { deliverableId: "del-25", versionNumber: 2, content: "Revised: 'Run your law firm like the business it is.' Added ROI calculator section, client testimonial placement, feature comparison vs. Clio/PracticePanther. Sharpened CTAs.", changeNotes: "Marcus wanted more competitive positioning and sharper value prop", generatedBy: "hybrid", qualityScore: 8.7 } }),

    // Atlas landing pages — Marcus wants CTA changes
    prisma.deliverableVersion.create({ data: { deliverableId: "del-26", versionNumber: 1, content: "Free Trial: '14 days free, no credit card.' Demo: 'See Atlas in action — book a 15-min walkthrough.' Both pages with feature highlights and social proof.", changeNotes: "Standard SaaS landing page generation", generatedBy: "ai", qualityScore: 7.0 } }),
    prisma.deliverableVersion.create({ data: { deliverableId: "del-26", versionNumber: 2, content: "Revised Free Trial: '14 days free — migrate your cases in minutes.' Demo: 'Your practice, our platform — see the fit in 15 minutes.' Added objection-handling FAQ section.", changeNotes: "Marcus: 'CTAs are too generic. Make them speak to migration fear.'", generatedBy: "hybrid", qualityScore: 8.0 } }),

    // PulsePoint email — medical review needed
    prisma.deliverableVersion.create({ data: { deliverableId: "del-28", versionNumber: 1, content: "7 health tip emails: (1) 'Start Your Day Right: Morning Wellness Routine' (2) 'Understanding Your Lab Results' (3) 'Sleep Hygiene 101' ...", changeNotes: "Generated from patient engagement brief", generatedBy: "ai", qualityScore: 6.8 } }),
    prisma.deliverableVersion.create({ data: { deliverableId: "del-28", versionNumber: 2, content: "Revised: Added medical disclaimers to all emails. Softened health claims per FDA guidelines. Added 'Consult your physician' footers. Dr. Okafor still reviewing emails 4-7.", changeNotes: "Compliance team flagged health claims in emails 2, 3, 5", generatedBy: "hybrid", qualityScore: 8.2 } }),
  ]);

  // ==========================================================================
  // APPROVALS — Client review decisions
  // ==========================================================================

  await Promise.all([
    prisma.approval.create({ data: { deliverableId: "del-1", reviewerRole: "client-admin", status: "approved", feedback: "Perfect. This is exactly the narrative we needed. Sending to investors this week." } }),
    prisma.approval.create({ data: { deliverableId: "del-3", reviewerRole: "client-admin", status: "approved", feedback: "The vine script is gorgeous. Love the gold foil treatment. Approved!" } }),
    prisma.approval.create({ data: { deliverableId: "del-6", reviewerRole: "client-admin", status: "approved", feedback: "Medical accuracy confirmed. Great job softening claims while keeping impact." } }),
    prisma.approval.create({ data: { deliverableId: "del-8", reviewerRole: "client-admin", status: "approved", feedback: "Ad creatives are fire. Our performance marketing team is pumped." } }),
    prisma.approval.create({ data: { deliverableId: "del-9", reviewerRole: "client-reviewer", status: "pending", feedback: "" } }),
    prisma.approval.create({ data: { deliverableId: "del-12", reviewerRole: "client-admin", status: "pending", feedback: "" } }),
    prisma.approval.create({ data: { deliverableId: "del-17", reviewerRole: "client-admin", status: "pending", feedback: "" } }),
    prisma.approval.create({ data: { deliverableId: "del-25", reviewerRole: "client-admin", status: "pending", feedback: "" } }),
    prisma.approval.create({ data: { deliverableId: "del-26", reviewerRole: "client-admin", status: "revision_requested", feedback: "CTAs still feel generic. Can we make the free trial page speak directly to solo practitioners?" } }),
    prisma.approval.create({ data: { deliverableId: "del-28", reviewerRole: "client-admin", status: "revision_requested", feedback: "Emails 4-7 still need medical review. Please hold until Dr. Patel signs off." } }),
  ]);

  // ==========================================================================
  // PRODUCTION WORKFLOWS — AI generation jobs
  // ==========================================================================

  await Promise.all([
    // Completed workflows
    prisma.productionWorkflow.create({ data: { engagementId: "eng-1", name: "Pitch Deck Narrative Generation", type: "deck_generation", status: "completed", duration: 310, cost: 0.92, inputData: JSON.stringify({ stage: "Series B", ask: "$40M", metrics: { arr: "8M", growth: "340%" } }), outputData: JSON.stringify({ slides: 25, visualizations: 8, narrative_score: 9.4 }) } }),
    prisma.productionWorkflow.create({ data: { engagementId: "eng-3", name: "Brand Identity AI Generation", type: "brand_generation", status: "completed", duration: 420, cost: 1.15, inputData: JSON.stringify({ industry: "Luxury Wine", style: "elegant, hand-crafted" }), outputData: JSON.stringify({ concepts: 5, variations: 18, color_palettes: 4 }) } }),
    prisma.productionWorkflow.create({ data: { engagementId: "eng-4", name: "Medical Website Copy Generation", type: "copy_generation", status: "completed", duration: 240, cost: 0.78, inputData: JSON.stringify({ industry: "Digital Health", compliance: "HIPAA", tone: "warm clinical" }), outputData: JSON.stringify({ pages: 6, word_count: 4200, compliance_flags: 3 }) } }),
    prisma.productionWorkflow.create({ data: { engagementId: "eng-2", name: "Legal Document Generation", type: "legal_generation", status: "completed", duration: 180, cost: 0.48, inputData: JSON.stringify({ jurisdiction: "Delaware", industry: "Legal SaaS" }), outputData: JSON.stringify({ documents: 7, pages: 42, compliance_check: "passed" }) } }),
    prisma.productionWorkflow.create({ data: { engagementId: "eng-5", name: "Climate Social Content Batch", type: "social_generation", status: "completed", duration: 160, cost: 0.70, inputData: JSON.stringify({ campaign: "COP31 Awareness", platforms: ["IG", "LinkedIn", "X"] }), outputData: JSON.stringify({ posts: 60, carousels: 8, video_scripts: 4 }) } }),

    // Running workflows (currently in progress)
    prisma.productionWorkflow.create({ data: { engagementId: "eng-6", name: "Freelancer Campaign Creative Gen", type: "creative_generation", status: "completed", duration: 220, cost: 0.55, inputData: JSON.stringify({ product: "Freelancer Checking", formats: ["Meta", "Google", "LinkedIn"] }), outputData: JSON.stringify({ creatives: 15, formats: 6, a_b_variants: 30 }) } }),
    prisma.productionWorkflow.create({ data: { engagementId: "eng-6", name: "Landing Page Copy Generation v2", type: "copy_generation", status: "running", duration: null, cost: 0.38, inputData: JSON.stringify({ page_type: "product_launch", tone: "empowering", social_proof: true }) } }),
    prisma.productionWorkflow.create({ data: { engagementId: "eng-6", name: "Email Nurture Sequence Draft", type: "email_generation", status: "running", duration: null, cost: 0.42, inputData: JSON.stringify({ sequence_length: 7, goal: "trial_to_paid", personalization: true }) } }),
    prisma.productionWorkflow.create({ data: { engagementId: "eng-7", name: "Earth Month Blog Batch Generation", type: "content_generation", status: "running", duration: null, cost: 1.45, inputData: JSON.stringify({ topic_cluster: "sustainable living", seo_targets: ["eco-friendly home", "sustainable kitchen"] }) } }),
    prisma.productionWorkflow.create({ data: { engagementId: "eng-8", name: "Technical Blog Series Generation", type: "content_generation", status: "running", duration: null, cost: 1.20, inputData: JSON.stringify({ topics: ["warehouse AI", "sim-to-real", "grasping policies"], audience: "senior engineers" }) } }),
    prisma.productionWorkflow.create({ data: { engagementId: "eng-9", name: "BBQ Brand Identity Generation", type: "brand_generation", status: "completed", duration: 380, cost: 1.05, inputData: JSON.stringify({ style: "smoke meets sophistication", heritage: "Southern BBQ" }), outputData: JSON.stringify({ concepts: 5, variations: 15, packaging_mockups: 3 }) } }),
    prisma.productionWorkflow.create({ data: { engagementId: "eng-9", name: "Brand Guidelines Assembly", type: "document_generation", status: "running", duration: null, cost: 0.65, inputData: JSON.stringify({ based_on: "approved logo concepts", include: ["packaging", "signage", "digital"] }) } }),
    prisma.productionWorkflow.create({ data: { engagementId: "eng-10", name: "Real Estate Email Flow Generation", type: "email_generation", status: "running", duration: null, cost: 0.52, inputData: JSON.stringify({ segments: ["buyers", "sellers", "dormant"], market: "spring housing" }) } }),
    prisma.productionWorkflow.create({ data: { engagementId: "eng-11", name: "Golden Hour Campaign Creatives", type: "creative_generation", status: "running", duration: null, cost: 0.85, inputData: JSON.stringify({ collection: "Summer Rosé", aesthetic: "golden hour lifestyle", platform: "Instagram-first" }) } }),

    // Failed workflow (to show error handling)
    prisma.productionWorkflow.create({ data: { engagementId: "eng-7", name: "Newsletter Template Generation (retry)", type: "email_generation", status: "failed", duration: 45, cost: 0.12, inputData: JSON.stringify({ template_count: 4, style: "editorial" }), outputData: JSON.stringify({ error: "Token limit exceeded on template 3. Splitting into smaller batches." }) } }),
  ]);

  // ==========================================================================
  // TASKS — Work items with SLA deadlines
  // ==========================================================================

  await Promise.all([
    // URGENT — Nomad launch deadline approaching
    prisma.task.create({ data: { engagementId: "eng-6", title: "Final review: Nomad landing page v2", description: "Ravi needs landing page locked today for Wednesday product launch. Landing page copy v2 just generated.", status: "in_progress", priority: "urgent", assignedTo: "operator", slaDeadline: new Date(now.getTime() + 3 * h) } }),
    prisma.task.create({ data: { engagementId: "eng-6", title: "Generate email nurture sequence (7 emails)", description: "Part of freelancer checking launch. Emails should drive trial → paid conversion.", status: "in_progress", priority: "urgent", assignedTo: "ai", slaDeadline: new Date(now.getTime() + 6 * h) } }),

    // HIGH — multiple active projects need attention
    prisma.task.create({ data: { engagementId: "eng-9", title: "Review Forge & Flame logo concepts with Darnell", description: "5 concepts generated, narrowed to 3. Need Darnell's feedback on anvil vs. script direction.", status: "in_progress", priority: "high", assignedTo: "operator", slaDeadline: new Date(now.getTime() + 8 * h) } }),
    prisma.task.create({ data: { engagementId: "eng-8", title: "Verify technical accuracy of Horizon blog posts 1-5", description: "CTO Kai flagged RL terminology in posts 2 and 3. Need to cross-reference with arxiv papers.", status: "in_progress", priority: "high", assignedTo: "operator", slaDeadline: new Date(now.getTime() + 12 * h) } }),
    prisma.task.create({ data: { engagementId: "eng-13", title: "Hold PulsePoint emails 4-7 for medical review", description: "Dr. Okafor's compliance team reviewing health claims. Do not send until sign-off.", status: "blocked", priority: "high", assignedTo: "operator", slaDeadline: new Date(now.getTime() + 24 * h) } }),
    prisma.task.create({ data: { engagementId: "eng-14", title: "Send Nomad pre-sale pitch deck mockup to Ravi", description: "5 key slides generated as pre-sale teaser for Series B deck engagement.", status: "pending", priority: "high", assignedTo: "operator", slaDeadline: new Date(now.getTime() + 8 * h) } }),

    // OVERDUE — Atlas feedback stalled
    prisma.task.create({ data: { engagementId: "eng-12", title: "Follow up: Marcus Chen on Atlas website copy feedback", description: "Atlas website copy delivered 3 days ago. Marcus has not responded. Engagement is 1 day overdue.", status: "blocked", priority: "high", assignedTo: "operator", slaDeadline: new Date(now.getTime() - 4 * h), autoEscalated: true } }),

    // MEDIUM — ongoing production work
    prisma.task.create({ data: { engagementId: "eng-7", title: "Regenerate EcoHaven newsletter templates (batch fix)", description: "First generation failed due to token limits. Need to split into smaller batches and retry.", status: "pending", priority: "medium", assignedTo: "ai", slaDeadline: new Date(now.getTime() + 24 * h) } }),
    prisma.task.create({ data: { engagementId: "eng-10", title: "Review Keystone buyer nurture email flow", description: "First draft of 5-email buyer nurture sequence ready for operator review.", status: "pending", priority: "medium", assignedTo: "operator", slaDeadline: new Date(now.getTime() + 36 * h) } }),
    prisma.task.create({ data: { engagementId: "eng-11", title: "Generate Velvet & Vine Golden Hour ad creatives", description: "Instagram-first campaign. Need 15 creatives with golden hour photography aesthetic.", status: "in_progress", priority: "medium", assignedTo: "ai", slaDeadline: new Date(now.getTime() + 48 * h) } }),
    prisma.task.create({ data: { engagementId: "eng-9", title: "Generate Forge & Flame packaging label concepts", description: "Based on approved brand direction, create label mockups for 'Pitmaster Reserve' sauce line.", status: "pending", priority: "medium", assignedTo: "ai", slaDeadline: new Date(now.getTime() + 48 * h) } }),
    prisma.task.create({ data: { engagementId: "eng-15", title: "Generate Forge & Flame launch campaign proposal", description: "Pre-sale assets: campaign strategy deck + 3 sample creatives for Darnell's approval.", status: "pending", priority: "medium", assignedTo: "ai", slaDeadline: new Date(now.getTime() + 72 * h) } }),

    // LOW — maintenance and follow-ups
    prisma.task.create({ data: { engagementId: "eng-7", title: "Update EcoHaven SEO keyword map for Q2", description: "Quarterly refresh of keyword targets based on Google Search Console data.", status: "pending", priority: "low", assignedTo: "ai", slaDeadline: new Date(now.getTime() + 120 * h) } }),
    prisma.task.create({ data: { engagementId: "eng-8", title: "Plan Horizon blog posts 6-10 topics", description: "Coordinate with Kai on next 5 blog topics. Focus on hiring narrative.", status: "pending", priority: "low", assignedTo: "operator", slaDeadline: new Date(now.getTime() + 96 * h) } }),

    // COMPLETED tasks
    prisma.task.create({ data: { engagementId: "eng-6", title: "Generate Nomad ad creative set (15 variants)", description: "Meta, Google, and LinkedIn formats. A/B variants included.", status: "completed", priority: "high", assignedTo: "ai", completedAt: new Date(now.getTime() - 2 * d), slaDeadline: new Date(now.getTime() - 2 * d) } }),
    prisma.task.create({ data: { engagementId: "eng-1", title: "Deliver Horizon Series B pitch deck", status: "completed", priority: "urgent", assignedTo: "ai", completedAt: new Date(now.getTime() - 23 * d), slaDeadline: new Date(now.getTime() - 22 * d) } }),
  ]);

  // ==========================================================================
  // CLIENT MESSAGES — Realistic email/Slack conversations
  // ==========================================================================

  await Promise.all([
    // Horizon — happy enterprise client
    prisma.clientMessage.create({ data: { clientId: "client-horizon", direction: "inbound", channel: "slack", subject: "Pitch deck feedback", body: "Kai here. The pitch deck is incredible — our investors were blown away by the narrative structure. We closed our $40M Series B last week. Want to start a content marketing engagement to attract engineering talent. Can you scope that?", sentiment: 0.95, actionItems: JSON.stringify(["Scope content marketing engagement", "Schedule kickoff call"]), createdAt: new Date(now.getTime() - 22 * d) } }),
    prisma.clientMessage.create({ data: { clientId: "client-horizon", direction: "outbound", channel: "slack", subject: "Re: Pitch deck feedback", body: "Congratulations on closing the round, Kai! That's phenomenal. I'd love to build a technical content engine targeting senior robotics engineers. I'll have a proposal with scope and timeline by end of day.", sentiment: 0.92, createdAt: new Date(now.getTime() - 22 * d + 2 * h) } }),
    prisma.clientMessage.create({ data: { clientId: "client-horizon", direction: "inbound", channel: "email", subject: "Blog post technical review", body: "Our CTO reviewed the first 5 blog posts. Posts 2 and 3 have some terminology issues with reinforcement learning concepts — 'policy gradient' should be 'proximal policy optimization' in the context of our approach. Also, can we add PyTorch code snippets? Our eng team wants practical examples.", sentiment: 0.7, actionItems: JSON.stringify(["Fix RL terminology in posts 2-3", "Add PyTorch code snippets", "CTO re-review after changes"]), createdAt: new Date(now.getTime() - 1 * d) } }),

    // Nomad — urgent launch client
    prisma.clientMessage.create({ data: { clientId: "client-nomad", direction: "inbound", channel: "slack", subject: "Launch timeline URGENT", body: "Hey — our product launch is locked for Wednesday. The ad creatives are amazing (CMO loved the 'your money works as hard as you do' line). But I NEED the landing page locked by tonight. Also — we're thinking about raising a Series B in September. Can you do another pitch deck? Yours for Horizon was legendary.", sentiment: 0.65, actionItems: JSON.stringify(["Prioritize landing page v2 review", "Generate pitch deck proposal for Series B"]), createdAt: new Date(now.getTime() - 6 * h) } }),
    prisma.clientMessage.create({ data: { clientId: "client-nomad", direction: "outbound", channel: "slack", subject: "Re: Launch timeline", body: "On it, Ravi. Landing page v2 is generating right now — you'll have it within 2 hours. The new version has stronger social proof (12K+ beta users) and the emotional hook you wanted. Re: Series B deck — absolutely. I'll send a pre-sale mockup of 5 key slides today so you can see the direction.", sentiment: 0.88, createdAt: new Date(now.getTime() - 5 * h) } }),

    // Velvet & Vine — delighted luxury client
    prisma.clientMessage.create({ data: { clientId: "client-velvet", direction: "inbound", channel: "email", subject: "VOGUE feature + summer campaign", body: "Jordan! Our brand just got featured in Vogue's 'New Wave of Wine' piece — they specifically called out the vine script logo and brand identity you created. We're riding this momentum into our summer rosé launch. 'Golden Hour' is the campaign concept — think sunset, warmth, shared moments. Can you create the full launch package? Instagram-first.", sentiment: 0.98, actionItems: JSON.stringify(["Scope Golden Hour launch campaign", "Instagram-first creative strategy", "Coordinate with Velvet's social team"]), createdAt: new Date(now.getTime() - 3 * d) } }),
    prisma.clientMessage.create({ data: { clientId: "client-velvet", direction: "outbound", channel: "email", subject: "Re: VOGUE feature + Golden Hour campaign", body: "Isabella, that Vogue feature is incredible — congratulations! I'm thrilled the brand identity is getting that recognition. For Golden Hour: I'm envisioning warm, sun-drenched lifestyle photography with the rosé as the centerpiece. 15 Instagram-first creatives + a dedicated landing page for the collection. Let me start generating concepts today.", sentiment: 0.95, createdAt: new Date(now.getTime() - 3 * d + 3 * h) } }),

    // EcoHaven — SEO-focused feedback
    prisma.clientMessage.create({ data: { clientId: "client-ecohaven", direction: "inbound", channel: "email", subject: "Blog post feedback — need stronger SEO", body: "Hi Jordan, the Earth Month blog posts are well-written, but our SEO team says keyword density is too low for our target terms ('sustainable home goods', 'eco-friendly kitchen'). Also, the 'How We Source Our Bamboo' post needs more supply chain transparency data — we can provide the numbers. Can you revise?", sentiment: 0.55, actionItems: JSON.stringify(["Improve SEO keyword density", "Add supply chain data to bamboo post", "Re-submit for SEO team review"]), createdAt: new Date(now.getTime() - 2 * d) } }),
    prisma.clientMessage.create({ data: { clientId: "client-ecohaven", direction: "outbound", channel: "email", subject: "Re: Blog revisions", body: "Great feedback, Lena. I'll increase keyword integration across all 10 posts and weave in the supply chain numbers you send. The revised batch should be ready in 24 hours. I'll also update the SEO keyword map to reflect any new targets for Q2.", sentiment: 0.82, createdAt: new Date(now.getTime() - 2 * d + 4 * h) } }),

    // Atlas — stalled feedback (churn risk signal)
    prisma.clientMessage.create({ data: { clientId: "client-atlas", direction: "outbound", channel: "email", subject: "Website copy — awaiting your review", body: "Hi Marcus, just following up on the website copy we delivered last week. The homepage and product pages are ready for your review, and I'd love your feedback on the competitive positioning angle. The landing pages for Free Trial and Demo are also ready. Let me know if the direction works or if you'd like adjustments.", sentiment: 0.72, createdAt: new Date(now.getTime() - 3 * d) } }),
    prisma.clientMessage.create({ data: { clientId: "client-atlas", direction: "outbound", channel: "email", subject: "Gentle nudge: Atlas website copy review", body: "Hi Marcus, circling back on the website copy. We're 1 day past the review deadline and I want to make sure we stay on track for your site launch. Is there anything blocking the review? Happy to jump on a quick call if it's easier to discuss feedback live.", sentiment: 0.65, createdAt: new Date(now.getTime() - 4 * h) } }),

    // Forge & Flame — excited new brand client
    prisma.clientMessage.create({ data: { clientId: "client-forge", direction: "inbound", channel: "email", subject: "Logo concepts reaction", body: "Jordan — these logo concepts are 🔥 (pun intended). The anvil mark with the subtle flame detail is speaking to me. The smoky script is also incredible. My wife says the monogram feels too 'tech startup' for a BBQ brand and I agree. Can you refine the anvil and script directions? Also, what would packaging labels look like with these?", sentiment: 0.88, actionItems: JSON.stringify(["Refine anvil + script logo directions", "Drop monogram direction", "Generate packaging label concepts"]), createdAt: new Date(now.getTime() - 1 * d) } }),
    prisma.clientMessage.create({ data: { clientId: "client-forge", direction: "outbound", channel: "email", subject: "Re: Logo concepts — let's forge ahead", body: "Love the energy, Darnell! Totally agree on dropping the monogram — the anvil and script feel much more authentic to Forge & Flame's heritage. I'll refine both with deeper char textures and generate packaging mockups for the 'Pitmaster Reserve' line. Expect updated concepts within 48 hours.", sentiment: 0.9, createdAt: new Date(now.getTime() - 1 * d + 2 * h) } }),

    // Keystone — professional real estate client
    prisma.clientMessage.create({ data: { clientId: "client-keystone", direction: "inbound", channel: "email", subject: "Email flows kick-off", body: "Hi Jordan, Rachel here. Excited to get started on the email flows. Our biggest priority is the buyer nurture sequence — spring market is heating up fast. For sellers, we want to focus on our unique valuation tool as the hook. Can you prioritize buyers first?", sentiment: 0.8, actionItems: JSON.stringify(["Prioritize buyer nurture sequence", "Use valuation tool as seller hook"]), createdAt: new Date(now.getTime() - 4 * d) } }),

    // PulsePoint — compliance-careful
    prisma.clientMessage.create({ data: { clientId: "client-pulse", direction: "inbound", channel: "email", subject: "Email compliance review — hold on emails 4-7", body: "Jordan, Dr. Patel from our compliance team flagged some health claims in the nurture emails. Specifically, emails about lab results and sleep hygiene make claims that need FDA-compliant disclaimers. Please hold emails 4-7 until he signs off. Emails 1-3 are approved.", sentiment: 0.5, actionItems: JSON.stringify(["Hold emails 4-7 for compliance", "Add FDA disclaimers", "Get Dr. Patel sign-off"]), createdAt: new Date(now.getTime() - 12 * h) } }),

    // Bright Minds — paused / churning
    prisma.clientMessage.create({ data: { clientId: "client-bright", direction: "inbound", channel: "email", subject: "Putting engagement on hold", body: "Hi Jordan, unfortunately our board has restructured and we're cutting all marketing spend for Q1-Q2. We need to pause the content engagement immediately. I'm sorry for the disruption — I personally love the work you've done. If things change in Q3, you'll be my first call.", sentiment: 0.25, actionItems: JSON.stringify(["Pause engagement immediately", "Archive content drafts", "Set Q3 follow-up reminder"]), createdAt: new Date(now.getTime() - 15 * d) } }),
    prisma.clientMessage.create({ data: { clientId: "client-bright", direction: "outbound", channel: "email", subject: "Re: Pause — understood", body: "Completely understand, Natasha. I'll archive everything and keep your content strategy docs ready for when you're back. Wishing the team well through the transition. I'll touch base in Q3.", sentiment: 0.6, createdAt: new Date(now.getTime() - 15 * d + 3 * h) } }),

    // Canopy — churned non-profit
    prisma.clientMessage.create({ data: { clientId: "client-canopy", direction: "inbound", channel: "email", subject: "Thank you & goodbye (for now)", body: "Jordan, our grant funding for the communications budget wasn't renewed. We have to discontinue the engagement. The COP31 social campaign was amazing — our posts got 2.3M impressions. If we secure new funding, we'd love to work together again. Thank you for caring about our mission.", sentiment: 0.35, actionItems: JSON.stringify(["Close engagement", "Send final deliverables", "Note for future outreach"]), createdAt: new Date(now.getTime() - 50 * d) } }),
  ]);

  // ==========================================================================
  // KNOWLEDGE ASSETS — Brand guides, briefs, and reference docs
  // ==========================================================================

  await Promise.all([
    prisma.knowledgeAsset.create({ data: { clientId: "client-horizon", title: "Horizon Robotics Brand Brief", type: "brief", content: "AI-native robotics company. Series B stage ($40M raised). Product: autonomous warehouse robots. Target: logistics companies, 3PL providers. Key differentiator: sim-to-real AI transfer learning. Hiring goal: 50 senior engineers by EOY." } }),
    prisma.knowledgeAsset.create({ data: { clientId: "client-horizon", title: "Technical Blog Style Guide", type: "style_doc", content: "Audience: senior ML/robotics engineers. Tone: technically rigorous, code-heavy, practical. Include: PyTorch examples, benchmark tables, arxiv citations. Avoid: marketing fluff, oversimplification. Max 2000 words per post." } }),
    prisma.knowledgeAsset.create({ data: { clientId: "client-velvet", title: "Velvet & Vine Brand Guidelines", type: "brand_guide", content: "Luxury DTC wine brand. Primary colors: Burgundy (#722F37), Champagne Gold (#C5A572), Cream (#F5F0E8). Typography: Cormorant Garamond (headlines) + Montserrat (body). Logo: vine script primary mark + V&V monogram. Photography: natural light, intimate gatherings, vineyard landscapes." } }),
    prisma.knowledgeAsset.create({ data: { clientId: "client-pulse", title: "PulsePoint Health Compliance Guide", type: "reference", content: "HIPAA-compliant copy guidelines. All health claims must include disclaimers. No guaranteed outcomes language. 'Consult your physician' footer on all patient-facing materials. FDA sensitivity: avoid 'cure', 'treat', 'prevent' without qualification." } }),
    prisma.knowledgeAsset.create({ data: { clientId: "client-nomad", title: "Nomad Financial Product Brief", type: "brief", content: "Neo-bank for freelancers. Key features: instant invoicing, automatic tax set-aside (30%), no monthly fees, same-day deposits. Beta: 12K users, 4.8★ rating. Target: US freelancers earning $50K-$200K. Competitor positioning: vs. Mercury (too corporate), vs. Lili (too basic)." } }),
    prisma.knowledgeAsset.create({ data: { clientId: "client-ecohaven", title: "EcoHaven SEO Strategy Doc", type: "reference", content: "Target keywords: 'sustainable home goods' (vol: 12K), 'eco-friendly kitchen' (vol: 8K), 'zero waste products' (vol: 6K), 'organic cleaning supplies' (vol: 4K). Content pillars: (1) Product education (2) Sustainability how-tos (3) Supply chain transparency (4) Community impact stories." } }),
    prisma.knowledgeAsset.create({ data: { clientId: "client-atlas", title: "Atlas Legal Tech Product Overview", type: "brief", content: "Cloud-based practice management for small law firms (1-25 attorneys). Key modules: Case Management, Billing & Invoicing, Client Portal, Document Automation. Competitor landscape: Clio (market leader, expensive), PracticePanther (mid-market), MyCase (basic). Atlas differentiator: AI-powered document generation." } }),
    prisma.knowledgeAsset.create({ data: { clientId: "client-forge", title: "Forge & Flame Brand Brief", type: "brief", content: "Artisan BBQ brand from Memphis, TN. Founded by pitmaster Darnell Washington. Products: premium BBQ sauces, rubs, marinades. Moving from local farmers market to national DTC. Brand essence: 'smoke meets sophistication.' Heritage: 3-generation pitmaster family. New product line: 'Pitmaster Reserve' (premium tier)." } }),
    prisma.knowledgeAsset.create({ data: { clientId: "client-keystone", title: "Keystone Properties Market Brief", type: "brief", content: "Real estate tech platform in Austin, TX metro. Unique value: AI-powered home valuation tool (98.5% accuracy). Target segments: first-time buyers (65%), sellers looking to upgrade (25%), investors (10%). Spring market focus: inventory up 12% YoY, median price $485K." } }),
  ]);

  // ==========================================================================
  // INVOICES — Billing across all states
  // ==========================================================================

  await Promise.all([
    // Paid
    prisma.invoice.create({ data: { clientId: "client-horizon", amount: 4000, status: "paid", dueDate: new Date(now.getTime() - 15 * d), paidAt: new Date(now.getTime() - 18 * d), lineItems: JSON.stringify([{ service: "Investor Pitch Deck", amount: 4000 }]) } }),
    prisma.invoice.create({ data: { clientId: "client-atlas", amount: 2500, status: "paid", dueDate: new Date(now.getTime() - 10 * d), paidAt: new Date(now.getTime() - 12 * d), lineItems: JSON.stringify([{ service: "Corporate Legal Document Suite", amount: 2500 }]) } }),
    prisma.invoice.create({ data: { clientId: "client-velvet", amount: 5500, status: "paid", dueDate: new Date(now.getTime() - 28 * d), paidAt: new Date(now.getTime() - 30 * d), lineItems: JSON.stringify([{ service: "Brand Identity System", amount: 5500 }]) } }),
    prisma.invoice.create({ data: { clientId: "client-pulse", amount: 3500, status: "paid", dueDate: new Date(now.getTime() - 7 * d), paidAt: new Date(now.getTime() - 8 * d), lineItems: JSON.stringify([{ service: "Website Copy & UX Writing", amount: 3500 }]) } }),
    prisma.invoice.create({ data: { clientId: "client-canopy", amount: 3000, status: "paid", dueDate: new Date(now.getTime() - 45 * d), paidAt: new Date(now.getTime() - 47 * d), lineItems: JSON.stringify([{ service: "Social Media Content Pack", amount: 3000 }]) } }),

    // Sent (awaiting payment)
    prisma.invoice.create({ data: { clientId: "client-nomad", amount: 4200, status: "sent", dueDate: new Date(now.getTime() + 20 * d), lineItems: JSON.stringify([{ service: "Product Launch Campaign", amount: 4200 }]) } }),
    prisma.invoice.create({ data: { clientId: "client-horizon", amount: 6000, status: "sent", dueDate: new Date(now.getTime() + 25 * d), lineItems: JSON.stringify([{ service: "Content Marketing Engine", amount: 6000 }]) } }),
    prisma.invoice.create({ data: { clientId: "client-ecohaven", amount: 6000, status: "sent", dueDate: new Date(now.getTime() + 15 * d), lineItems: JSON.stringify([{ service: "Content Marketing Engine", amount: 6000 }]) } }),
    prisma.invoice.create({ data: { clientId: "client-velvet", amount: 4200, status: "sent", dueDate: new Date(now.getTime() + 22 * d), lineItems: JSON.stringify([{ service: "Product Launch Campaign", amount: 4200 }]) } }),

    // Draft
    prisma.invoice.create({ data: { clientId: "client-forge", amount: 5500, status: "draft", dueDate: new Date(now.getTime() + 30 * d), lineItems: JSON.stringify([{ service: "Brand Identity System", amount: 5500 }]) } }),
    prisma.invoice.create({ data: { clientId: "client-keystone", amount: 2800, status: "draft", dueDate: new Date(now.getTime() + 30 * d), lineItems: JSON.stringify([{ service: "Email Marketing Suite", amount: 2800 }]) } }),

    // Overdue
    prisma.invoice.create({ data: { clientId: "client-atlas", amount: 3500, status: "overdue", dueDate: new Date(now.getTime() - 3 * d), lineItems: JSON.stringify([{ service: "Website Copy & UX Writing", amount: 3500 }]) } }),
  ]);

  // ==========================================================================
  // MARGIN METRICS — 6 months of growth trajectory
  // ==========================================================================

  await Promise.all([
    prisma.marginMetric.create({ data: {
      period: "2026-03", totalRevenue: 48200, totalCost: 1210,
      aiWorkflowRevenue: 44500, humanOversightHours: 38,
      revenuePerAiWorkflow: 3710, revenuePerHumanHour: 1268,
      avgRevisionCount: 1.6, avgTurnaroundHours: 26,
      clientSatisfaction: 9.1, activeEngagements: 8, completedEngagements: 5,
    } }),
    prisma.marginMetric.create({ data: {
      period: "2026-02", totalRevenue: 38500, totalCost: 985,
      aiWorkflowRevenue: 35200, humanOversightHours: 42,
      revenuePerAiWorkflow: 3200, revenuePerHumanHour: 917,
      avgRevisionCount: 2.0, avgTurnaroundHours: 31,
      clientSatisfaction: 8.6, activeEngagements: 6, completedEngagements: 4,
    } }),
    prisma.marginMetric.create({ data: {
      period: "2026-01", totalRevenue: 29800, totalCost: 790,
      aiWorkflowRevenue: 27100, humanOversightHours: 45,
      revenuePerAiWorkflow: 2710, revenuePerHumanHour: 662,
      avgRevisionCount: 2.4, avgTurnaroundHours: 36,
      clientSatisfaction: 8.2, activeEngagements: 5, completedEngagements: 3,
    } }),
    prisma.marginMetric.create({ data: {
      period: "2025-12", totalRevenue: 22400, totalCost: 615,
      aiWorkflowRevenue: 20100, humanOversightHours: 48,
      revenuePerAiWorkflow: 2240, revenuePerHumanHour: 467,
      avgRevisionCount: 2.8, avgTurnaroundHours: 42,
      clientSatisfaction: 7.8, activeEngagements: 4, completedEngagements: 3,
    } }),
    prisma.marginMetric.create({ data: {
      period: "2025-11", totalRevenue: 16200, totalCost: 465,
      aiWorkflowRevenue: 14500, humanOversightHours: 52,
      revenuePerAiWorkflow: 1810, revenuePerHumanHour: 312,
      avgRevisionCount: 3.2, avgTurnaroundHours: 49,
      clientSatisfaction: 7.4, activeEngagements: 3, completedEngagements: 2,
    } }),
    prisma.marginMetric.create({ data: {
      period: "2025-10", totalRevenue: 12000, totalCost: 380,
      aiWorkflowRevenue: 10400, humanOversightHours: 56,
      revenuePerAiWorkflow: 1500, revenuePerHumanHour: 214,
      avgRevisionCount: 3.8, avgTurnaroundHours: 55,
      clientSatisfaction: 7.0, activeEngagements: 2, completedEngagements: 1,
    } }),
  ]);

  // ==========================================================================
  // ACTIVITY LOGS — Recent system events
  // ==========================================================================

  await Promise.all([
    prisma.activityLog.create({ data: { clientId: "client-nomad", action: "workflow_started", entity: "workflow", entityId: "eng-6", details: "Landing Page Copy Generation v2 initiated — freelancer checking launch", performedBy: "system", createdAt: new Date(now.getTime() - 2 * h) } }),
    prisma.activityLog.create({ data: { clientId: "client-nomad", action: "workflow_started", entity: "workflow", entityId: "eng-6", details: "Email Nurture Sequence draft generation started (7 emails)", performedBy: "system", createdAt: new Date(now.getTime() - 1.5 * h) } }),
    prisma.activityLog.create({ data: { clientId: "client-forge", action: "deliverable_updated", entity: "deliverable", entityId: "del-17", details: "Logo concepts v2 generated: refined anvil mark + smoky script + bold monogram → 3 directions with color explorations", performedBy: "ai", createdAt: new Date(now.getTime() - 3 * h) } }),
    prisma.activityLog.create({ data: { clientId: "client-atlas", action: "task_escalated", entity: "task", entityId: "eng-12", details: "Auto-escalation: Marcus Chen unresponsive for 3 days on website copy review. Engagement 1 day overdue.", performedBy: "system", createdAt: new Date(now.getTime() - 4 * h) } }),
    prisma.activityLog.create({ data: { clientId: "client-ecohaven", action: "deliverable_updated", entity: "deliverable", entityId: "del-12", details: "Blog posts v2: improved SEO keyword density + added supply chain transparency data to bamboo sourcing post", performedBy: "ai", createdAt: new Date(now.getTime() - 6 * h) } }),
    prisma.activityLog.create({ data: { clientId: "client-horizon", action: "deliverable_updated", entity: "deliverable", entityId: "del-15", details: "Technical blog posts v2: corrected RL terminology, added PyTorch code snippets, added benchmark tables", performedBy: "ai", createdAt: new Date(now.getTime() - 8 * h) } }),
    prisma.activityLog.create({ data: { clientId: "client-velvet", action: "engagement_created", entity: "engagement", entityId: "eng-11", details: "New engagement: Golden Hour summer rosé launch campaign. Instagram-first strategy.", performedBy: "system", createdAt: new Date(now.getTime() - 3 * d) } }),
    prisma.activityLog.create({ data: { clientId: "client-pulse", action: "message_received", entity: "message", entityId: "client-pulse", details: "Compliance hold: Dr. Patel flagged health claims in nurture emails 4-7. Emails 1-3 approved.", performedBy: "system", createdAt: new Date(now.getTime() - 12 * h) } }),
    prisma.activityLog.create({ data: { clientId: "client-bright", action: "engagement_cancelled", entity: "engagement", entityId: "eng-16", details: "Bright Minds Academy paused all marketing spend. Content engagement cancelled. Sunk cost: $45.", performedBy: "system", createdAt: new Date(now.getTime() - 15 * d) } }),
    prisma.activityLog.create({ data: { clientId: "client-ecohaven", action: "workflow_failed", entity: "workflow", entityId: "eng-7", details: "Newsletter template generation failed: token limit exceeded on template 3. Queued for retry with batch splitting.", performedBy: "system", createdAt: new Date(now.getTime() - 10 * h) } }),
    prisma.activityLog.create({ data: { clientId: "client-keystone", action: "engagement_created", entity: "engagement", entityId: "eng-10", details: "New engagement: Keystone Properties spring housing market email flows (buyer nurture + seller acquisition)", performedBy: "system", createdAt: new Date(now.getTime() - 4 * d) } }),
    prisma.activityLog.create({ data: { clientId: "client-nomad", action: "deliverable_approved", entity: "deliverable", entityId: "del-8", details: "Nomad ad creative set (15 variants) approved by client. CMO feedback: 'These are fire.'", performedBy: "system", createdAt: new Date(now.getTime() - 2 * d) } }),
  ]);

  console.log("Seed data created successfully!");
  console.log("---");
  console.log("Scenario: Catalyst Creative — Solo AI agency");
  console.log("10 clients | 8 services | 16 engagements | 28 deliverables");
  console.log("16 workflows | 16 tasks | 20 messages | 9 knowledge assets");
  console.log("12 invoices | 6 months of margin metrics | 12 activity logs");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
