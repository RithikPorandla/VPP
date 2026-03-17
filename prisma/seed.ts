import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
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

  const clients = await Promise.all([
    prisma.client.create({
      data: {
        id: "client-1",
        name: "Meridian Health Systems",
        contactName: "Sarah Chen",
        contactEmail: "sarah@meridianhealth.com",
        industry: "Healthcare",
        brandVoice: "Professional, empathetic, clinical precision with warmth",
        status: "active",
        churnRisk: 0.08,
        tier: "enterprise",
      },
    }),
    prisma.client.create({
      data: {
        id: "client-2",
        name: "Nova Fintech",
        contactName: "Marcus Webb",
        contactEmail: "marcus@novafintech.io",
        industry: "Financial Services",
        brandVoice: "Bold, modern, trustworthy with a tech-forward edge",
        status: "active",
        churnRisk: 0.15,
        tier: "premium",
      },
    }),
    prisma.client.create({
      data: {
        id: "client-3",
        name: "Altitude Outdoor Co.",
        contactName: "Jamie Reeves",
        contactEmail: "jamie@altitudeoutdoor.com",
        industry: "Retail / DTC",
        brandVoice: "Adventurous, authentic, rugged yet refined",
        status: "active",
        churnRisk: 0.05,
        tier: "premium",
      },
    }),
    prisma.client.create({
      data: {
        id: "client-4",
        name: "Greenline Logistics",
        contactName: "Tom Park",
        contactEmail: "tom@greenlinelogistics.com",
        industry: "Logistics",
        brandVoice: "Efficient, reliable, sustainability-focused",
        status: "active",
        churnRisk: 0.22,
        tier: "standard",
      },
    }),
    prisma.client.create({
      data: {
        id: "client-5",
        name: "Luminary Education",
        contactName: "Priya Sharma",
        contactEmail: "priya@luminaryedu.org",
        industry: "Education",
        brandVoice: "Inspiring, inclusive, knowledge-forward",
        status: "paused",
        churnRisk: 0.45,
        tier: "standard",
      },
    }),
    prisma.client.create({
      data: {
        id: "client-6",
        name: "Apex SaaS",
        contactName: "Derek Liu",
        contactEmail: "derek@apexsaas.com",
        industry: "Technology",
        brandVoice: "Technical, clean, developer-friendly",
        status: "active",
        churnRisk: 0.03,
        tier: "enterprise",
      },
    }),
  ]);

  const serviceProducts = await Promise.all([
    prisma.serviceProduct.create({
      data: {
        id: "sp-1",
        name: "Launch-Ready Brand Kit",
        description:
          "Complete brand identity system including logo concepts, color palette, typography, and brand guidelines document",
        deliverableType: "brand_kit",
        scope: "Logo (3 concepts), color system, typography pairing, brand guidelines PDF, social media templates",
        turnaroundHours: 72,
        price: 4500,
        costEstimate: 120,
        category: "Branding",
        templatePrompt:
          "Generate a comprehensive brand identity system for {client_name} in the {industry} industry...",
      },
    }),
    prisma.serviceProduct.create({
      data: {
        id: "sp-2",
        name: "Campaign Launch Package",
        description:
          "Full digital campaign with ad creatives, landing page copy, email sequences, and social content calendar",
        deliverableType: "campaign_package",
        scope: "10 ad variations, landing page, 5-email nurture sequence, 30-day social calendar",
        turnaroundHours: 48,
        price: 3200,
        costEstimate: 85,
        category: "Marketing",
        templatePrompt:
          "Create a comprehensive digital marketing campaign for {client_name}...",
      },
    }),
    prisma.serviceProduct.create({
      data: {
        id: "sp-3",
        name: "Website Copy Overhaul",
        description:
          "Complete website copywriting including homepage, about, services, and key landing pages",
        deliverableType: "website_copy",
        scope: "Homepage, About, Services, 3 landing pages, meta descriptions, CTAs",
        turnaroundHours: 36,
        price: 2800,
        costEstimate: 65,
        category: "Content",
        templatePrompt:
          "Write conversion-optimized website copy for {client_name}...",
      },
    }),
    prisma.serviceProduct.create({
      data: {
        id: "sp-4",
        name: "Investor Pitch Deck",
        description:
          "Compelling pitch deck with narrative structure, data visualization, and investor-ready design",
        deliverableType: "pitch_deck",
        scope: "15-20 slide deck, executive summary, financial projections layout, appendix",
        turnaroundHours: 24,
        price: 3800,
        costEstimate: 95,
        category: "Strategy",
        templatePrompt:
          "Create a compelling investor pitch deck for {client_name}...",
      },
    }),
    prisma.serviceProduct.create({
      data: {
        id: "sp-5",
        name: "Legal Document Suite",
        description:
          "Standard business legal documents including terms of service, privacy policy, and contracts",
        deliverableType: "legal_docs",
        scope: "Terms of Service, Privacy Policy, MSA template, NDA template, SOW template",
        turnaroundHours: 24,
        price: 2200,
        costEstimate: 45,
        category: "Legal",
        templatePrompt:
          "Generate comprehensive legal documents for {client_name}...",
      },
    }),
    prisma.serviceProduct.create({
      data: {
        id: "sp-6",
        name: "Content Engine Setup",
        description:
          "Monthly content production system with blog posts, newsletters, and thought leadership",
        deliverableType: "content_engine",
        scope: "8 blog posts, 4 newsletters, content calendar, SEO keyword map, style guide",
        turnaroundHours: 96,
        price: 5500,
        costEstimate: 180,
        category: "Content",
        templatePrompt:
          "Build a content production engine for {client_name}...",
      },
    }),
  ]);

  const now = new Date();
  const dayMs = 86400000;

  const engagements = await Promise.all([
    prisma.engagement.create({
      data: {
        id: "eng-1",
        clientId: "client-1",
        serviceProductId: "sp-1",
        status: "active",
        startDate: new Date(now.getTime() - 5 * dayMs),
        dueDate: new Date(now.getTime() + 2 * dayMs),
        totalRevenue: 4500,
        totalCost: 115,
        notes: "Priority client - CEO personally involved in brand review",
      },
    }),
    prisma.engagement.create({
      data: {
        id: "eng-2",
        clientId: "client-2",
        serviceProductId: "sp-2",
        status: "active",
        startDate: new Date(now.getTime() - 3 * dayMs),
        dueDate: new Date(now.getTime() + 1 * dayMs),
        totalRevenue: 3200,
        totalCost: 78,
        notes: "Series B launch campaign - tight deadline",
      },
    }),
    prisma.engagement.create({
      data: {
        id: "eng-3",
        clientId: "client-3",
        serviceProductId: "sp-6",
        status: "active",
        startDate: new Date(now.getTime() - 10 * dayMs),
        dueDate: new Date(now.getTime() + 5 * dayMs),
        totalRevenue: 5500,
        totalCost: 165,
        notes: "Monthly retainer - spring collection launch",
      },
    }),
    prisma.engagement.create({
      data: {
        id: "eng-4",
        clientId: "client-4",
        serviceProductId: "sp-3",
        status: "in_review",
        startDate: new Date(now.getTime() - 8 * dayMs),
        dueDate: new Date(now.getTime() - 1 * dayMs),
        totalRevenue: 2800,
        totalCost: 60,
        notes: "Website relaunch - awaiting client feedback on homepage",
      },
    }),
    prisma.engagement.create({
      data: {
        id: "eng-5",
        clientId: "client-6",
        serviceProductId: "sp-4",
        status: "completed",
        startDate: new Date(now.getTime() - 15 * dayMs),
        dueDate: new Date(now.getTime() - 5 * dayMs),
        completedAt: new Date(now.getTime() - 6 * dayMs),
        totalRevenue: 3800,
        totalCost: 88,
        notes: "Series A deck - approved on first review",
      },
    }),
    prisma.engagement.create({
      data: {
        id: "eng-6",
        clientId: "client-1",
        serviceProductId: "sp-5",
        status: "completed",
        startDate: new Date(now.getTime() - 20 * dayMs),
        dueDate: new Date(now.getTime() - 12 * dayMs),
        completedAt: new Date(now.getTime() - 13 * dayMs),
        totalRevenue: 2200,
        totalCost: 42,
        notes: "HIPAA compliance docs",
      },
    }),
    prisma.engagement.create({
      data: {
        id: "eng-7",
        clientId: "client-2",
        serviceProductId: "sp-4",
        status: "proposal",
        startDate: new Date(now.getTime()),
        dueDate: new Date(now.getTime() + 3 * dayMs),
        totalRevenue: 3800,
        totalCost: 0,
        notes: "Pre-sale mockup generated - awaiting sign-off",
      },
    }),
    prisma.engagement.create({
      data: {
        id: "eng-8",
        clientId: "client-6",
        serviceProductId: "sp-6",
        status: "active",
        startDate: new Date(now.getTime() - 7 * dayMs),
        dueDate: new Date(now.getTime() + 8 * dayMs),
        totalRevenue: 5500,
        totalCost: 140,
        notes: "Developer blog and technical documentation content",
      },
    }),
  ]);

  const deliverables = await Promise.all([
    prisma.deliverable.create({
      data: {
        id: "del-1",
        engagementId: "eng-1",
        title: "Logo Concepts (3 variations)",
        type: "design",
        status: "in_review",
        currentVersion: 2,
      },
    }),
    prisma.deliverable.create({
      data: {
        id: "del-2",
        engagementId: "eng-1",
        title: "Brand Guidelines PDF",
        type: "document",
        status: "draft",
        currentVersion: 1,
      },
    }),
    prisma.deliverable.create({
      data: {
        id: "del-3",
        engagementId: "eng-2",
        title: "Ad Creative Set (10 variations)",
        type: "creative",
        status: "approved",
        currentVersion: 1,
      },
    }),
    prisma.deliverable.create({
      data: {
        id: "del-4",
        engagementId: "eng-2",
        title: "Landing Page Copy",
        type: "copy",
        status: "in_review",
        currentVersion: 3,
      },
    }),
    prisma.deliverable.create({
      data: {
        id: "del-5",
        engagementId: "eng-3",
        title: "Blog Posts (8x)",
        type: "content",
        status: "draft",
        currentVersion: 1,
      },
    }),
    prisma.deliverable.create({
      data: {
        id: "del-6",
        engagementId: "eng-4",
        title: "Homepage Copy",
        type: "copy",
        status: "revision_requested",
        currentVersion: 2,
      },
    }),
    prisma.deliverable.create({
      data: {
        id: "del-7",
        engagementId: "eng-5",
        title: "Investor Pitch Deck",
        type: "presentation",
        status: "approved",
        currentVersion: 1,
      },
    }),
    prisma.deliverable.create({
      data: {
        id: "del-8",
        engagementId: "eng-8",
        title: "Technical Blog Series",
        type: "content",
        status: "in_review",
        currentVersion: 2,
      },
    }),
  ]);

  await Promise.all([
    prisma.deliverableVersion.create({
      data: {
        deliverableId: "del-1",
        versionNumber: 1,
        content: "Initial logo concepts with three directions: modern geometric, organic flowing, bold typographic",
        changeNotes: "Initial generation based on brand brief",
        generatedBy: "ai",
        qualityScore: 7.5,
      },
    }),
    prisma.deliverableVersion.create({
      data: {
        deliverableId: "del-1",
        versionNumber: 2,
        content: "Refined logo concepts focusing on geometric direction per client feedback. Adjusted color palette to deeper blues.",
        changeNotes: "Client preferred geometric direction, requested deeper blues",
        generatedBy: "hybrid",
        qualityScore: 8.8,
      },
    }),
    prisma.deliverableVersion.create({
      data: {
        deliverableId: "del-4",
        versionNumber: 1,
        content: "Hero section: 'Banking reimagined for the digital generation'",
        generatedBy: "ai",
        qualityScore: 6.5,
      },
    }),
    prisma.deliverableVersion.create({
      data: {
        deliverableId: "del-4",
        versionNumber: 2,
        content: "Hero section: 'Your money, your rules. Welcome to intelligent finance.'",
        changeNotes: "Shifted tone to be more empowering, less generic",
        generatedBy: "ai",
        qualityScore: 7.8,
      },
    }),
    prisma.deliverableVersion.create({
      data: {
        deliverableId: "del-4",
        versionNumber: 3,
        content: "Hero section: 'Financial freedom starts here. Smart banking that adapts to your life.'",
        changeNotes: "Final iteration - combined empowerment with practical benefit",
        generatedBy: "hybrid",
        qualityScore: 9.1,
      },
    }),
    prisma.deliverableVersion.create({
      data: {
        deliverableId: "del-6",
        versionNumber: 1,
        content: "Greenline: Moving the world forward, sustainably.",
        generatedBy: "ai",
        qualityScore: 6.0,
      },
    }),
    prisma.deliverableVersion.create({
      data: {
        deliverableId: "del-6",
        versionNumber: 2,
        content: "Greenline: Where efficiency meets sustainability. Every mile counts.",
        changeNotes: "Client wanted more emphasis on efficiency alongside sustainability",
        generatedBy: "ai",
        qualityScore: 7.2,
      },
    }),
  ]);

  await Promise.all([
    prisma.productionWorkflow.create({
      data: {
        engagementId: "eng-1",
        name: "Brand Identity Generation",
        type: "brand_generation",
        status: "completed",
        duration: 340,
        cost: 0.85,
        inputData: JSON.stringify({ industry: "Healthcare", style: "modern professional" }),
        outputData: JSON.stringify({ concepts: 3, variations: 12 }),
      },
    }),
    prisma.productionWorkflow.create({
      data: {
        engagementId: "eng-2",
        name: "Ad Creative Generation",
        type: "creative_generation",
        status: "completed",
        duration: 180,
        cost: 0.45,
        inputData: JSON.stringify({ campaign: "Series B Launch", formats: ["social", "display"] }),
        outputData: JSON.stringify({ creatives: 10, formats: 4 }),
      },
    }),
    prisma.productionWorkflow.create({
      data: {
        engagementId: "eng-2",
        name: "Landing Page Copy Generation",
        type: "copy_generation",
        status: "running",
        duration: null,
        cost: 0.32,
        inputData: JSON.stringify({ page_type: "product_launch", tone: "bold, modern" }),
      },
    }),
    prisma.productionWorkflow.create({
      data: {
        engagementId: "eng-3",
        name: "Content Calendar Planning",
        type: "content_planning",
        status: "completed",
        duration: 120,
        cost: 0.28,
      },
    }),
    prisma.productionWorkflow.create({
      data: {
        engagementId: "eng-3",
        name: "Blog Post Batch Generation",
        type: "content_generation",
        status: "running",
        duration: null,
        cost: 1.20,
      },
    }),
    prisma.productionWorkflow.create({
      data: {
        engagementId: "eng-5",
        name: "Pitch Deck Generation",
        type: "deck_generation",
        status: "completed",
        duration: 280,
        cost: 0.92,
      },
    }),
    prisma.productionWorkflow.create({
      data: {
        engagementId: "eng-7",
        name: "Pre-sale Mockup Generation",
        type: "presale_generation",
        status: "completed",
        duration: 90,
        cost: 0.35,
      },
    }),
    prisma.productionWorkflow.create({
      data: {
        engagementId: "eng-8",
        name: "Technical Content Generation",
        type: "content_generation",
        status: "running",
        duration: null,
        cost: 0.88,
      },
    }),
  ]);

  await Promise.all([
    prisma.task.create({
      data: {
        engagementId: "eng-1",
        title: "Review logo feedback from Sarah",
        description: "Client submitted feedback on v2 logo concepts via email",
        status: "in_progress",
        priority: "high",
        assignedTo: "operator",
        slaDeadline: new Date(now.getTime() + 4 * 3600000),
      },
    }),
    prisma.task.create({
      data: {
        engagementId: "eng-1",
        title: "Generate brand guidelines PDF",
        status: "pending",
        priority: "medium",
        assignedTo: "ai",
        slaDeadline: new Date(now.getTime() + 24 * 3600000),
      },
    }),
    prisma.task.create({
      data: {
        engagementId: "eng-2",
        title: "Final review on landing page copy v3",
        status: "in_progress",
        priority: "urgent",
        assignedTo: "operator",
        slaDeadline: new Date(now.getTime() + 2 * 3600000),
      },
    }),
    prisma.task.create({
      data: {
        engagementId: "eng-2",
        title: "Generate email nurture sequence",
        status: "pending",
        priority: "high",
        assignedTo: "ai",
        slaDeadline: new Date(now.getTime() + 12 * 3600000),
      },
    }),
    prisma.task.create({
      data: {
        engagementId: "eng-3",
        title: "Publish first 4 blog posts",
        status: "pending",
        priority: "medium",
        assignedTo: "ai",
        slaDeadline: new Date(now.getTime() + 48 * 3600000),
      },
    }),
    prisma.task.create({
      data: {
        engagementId: "eng-4",
        title: "Follow up on homepage revision feedback",
        description: "Client has not responded in 3 days - auto-escalation triggered",
        status: "blocked",
        priority: "high",
        assignedTo: "operator",
        slaDeadline: new Date(now.getTime() - 2 * 3600000),
        autoEscalated: true,
      },
    }),
    prisma.task.create({
      data: {
        engagementId: "eng-8",
        title: "Review technical accuracy of blog series",
        status: "in_progress",
        priority: "medium",
        assignedTo: "operator",
        slaDeadline: new Date(now.getTime() + 36 * 3600000),
      },
    }),
    prisma.task.create({
      data: {
        engagementId: "eng-7",
        title: "Send pre-sale deck to Marcus",
        status: "pending",
        priority: "high",
        assignedTo: "operator",
        slaDeadline: new Date(now.getTime() + 6 * 3600000),
      },
    }),
  ]);

  await Promise.all([
    prisma.clientMessage.create({
      data: {
        clientId: "client-1",
        direction: "inbound",
        channel: "email",
        subject: "Logo feedback - love direction 2!",
        body: "Hi! We reviewed the three logo concepts and the team is really drawn to the geometric direction. Could we see some variations with deeper blues? The current palette feels a bit too light for our brand.",
        sentiment: 0.8,
        actionItems: JSON.stringify(["Revise logo colors to deeper blues", "Generate variations of geometric concept"]),
        createdAt: new Date(now.getTime() - 1 * dayMs),
      },
    }),
    prisma.clientMessage.create({
      data: {
        clientId: "client-1",
        direction: "outbound",
        channel: "email",
        subject: "Re: Logo feedback - updated concepts incoming",
        body: "Great feedback, Sarah! We're generating updated variations with the deeper blue palette now. You'll have the revised concepts within 4 hours. We'll also include some alternative geometric treatments based on your team's preference.",
        sentiment: 0.9,
        createdAt: new Date(now.getTime() - 0.5 * dayMs),
      },
    }),
    prisma.clientMessage.create({
      data: {
        clientId: "client-2",
        direction: "inbound",
        channel: "slack",
        subject: "Landing page urgency",
        body: "Hey - our Series B announcement is going live Wednesday. We need the landing page copy locked today if possible. The ad creatives look amazing btw. Can we also discuss a pitch deck for the board?",
        sentiment: 0.6,
        actionItems: JSON.stringify(["Prioritize landing page copy review", "Generate pitch deck proposal"]),
        createdAt: new Date(now.getTime() - 0.3 * dayMs),
      },
    }),
    prisma.clientMessage.create({
      data: {
        clientId: "client-4",
        direction: "outbound",
        channel: "email",
        subject: "Following up on homepage copy review",
        body: "Hi Tom, just checking in on the homepage copy we sent over last week. We'd love your feedback so we can finalize the remaining pages. Let us know if you need any changes or if we should proceed with the current direction.",
        sentiment: 0.7,
        createdAt: new Date(now.getTime() - 2 * dayMs),
      },
    }),
    prisma.clientMessage.create({
      data: {
        clientId: "client-5",
        direction: "inbound",
        channel: "email",
        subject: "Pausing engagement",
        body: "Hi, we need to pause our content engagement for now. Budget cuts this quarter. We'll likely pick back up in Q3. Sorry for the inconvenience.",
        sentiment: 0.3,
        actionItems: JSON.stringify(["Pause engagement", "Set follow-up for Q3", "Archive content drafts"]),
        createdAt: new Date(now.getTime() - 7 * dayMs),
      },
    }),
    prisma.clientMessage.create({
      data: {
        clientId: "client-6",
        direction: "inbound",
        channel: "slack",
        subject: "Blog series looking great",
        body: "The technical blog posts are really well-written. Our engineering team reviewed them and only had minor technical corrections. This is exactly the voice we want. Let's keep this cadence going!",
        sentiment: 0.95,
        actionItems: JSON.stringify(["Apply technical corrections", "Continue content cadence"]),
        createdAt: new Date(now.getTime() - 0.8 * dayMs),
      },
    }),
  ]);

  await Promise.all([
    prisma.knowledgeAsset.create({
      data: {
        clientId: "client-1",
        title: "Meridian Brand Brief",
        type: "brief",
        content: "Healthcare technology company focused on patient outcomes. Target audience: hospital administrators and healthcare CTOs.",
      },
    }),
    prisma.knowledgeAsset.create({
      data: {
        clientId: "client-2",
        title: "Nova Fintech Brand Guide",
        type: "brand_guide",
        content: "Disruptive fintech startup. Primary colors: Electric Blue, Midnight. Voice: confident, innovative, no jargon.",
      },
    }),
    prisma.knowledgeAsset.create({
      data: {
        clientId: "client-3",
        title: "Altitude Spring Collection Brief",
        type: "brief",
        content: "Premium outdoor lifestyle brand. Spring '26 collection focuses on ultralight hiking and sustainable materials.",
      },
    }),
    prisma.knowledgeAsset.create({
      data: {
        clientId: "client-6",
        title: "Apex Developer Docs Style Guide",
        type: "style_doc",
        content: "Technical documentation targeting senior developers. Use code examples liberally. Prefer practical over theoretical.",
      },
    }),
  ]);

  await Promise.all([
    prisma.invoice.create({
      data: {
        clientId: "client-1",
        amount: 4500,
        status: "sent",
        dueDate: new Date(now.getTime() + 15 * dayMs),
        lineItems: JSON.stringify([{ service: "Launch-Ready Brand Kit", amount: 4500 }]),
      },
    }),
    prisma.invoice.create({
      data: {
        clientId: "client-1",
        amount: 2200,
        status: "paid",
        dueDate: new Date(now.getTime() - 5 * dayMs),
        paidAt: new Date(now.getTime() - 7 * dayMs),
        lineItems: JSON.stringify([{ service: "Legal Document Suite", amount: 2200 }]),
      },
    }),
    prisma.invoice.create({
      data: {
        clientId: "client-2",
        amount: 3200,
        status: "sent",
        dueDate: new Date(now.getTime() + 10 * dayMs),
        lineItems: JSON.stringify([{ service: "Campaign Launch Package", amount: 3200 }]),
      },
    }),
    prisma.invoice.create({
      data: {
        clientId: "client-3",
        amount: 5500,
        status: "paid",
        dueDate: new Date(now.getTime() - 2 * dayMs),
        paidAt: new Date(now.getTime() - 3 * dayMs),
        lineItems: JSON.stringify([{ service: "Content Engine Setup", amount: 5500 }]),
      },
    }),
    prisma.invoice.create({
      data: {
        clientId: "client-6",
        amount: 3800,
        status: "paid",
        dueDate: new Date(now.getTime() - 10 * dayMs),
        paidAt: new Date(now.getTime() - 11 * dayMs),
        lineItems: JSON.stringify([{ service: "Investor Pitch Deck", amount: 3800 }]),
      },
    }),
    prisma.invoice.create({
      data: {
        clientId: "client-4",
        amount: 2800,
        status: "overdue",
        dueDate: new Date(now.getTime() - 5 * dayMs),
        lineItems: JSON.stringify([{ service: "Website Copy Overhaul", amount: 2800 }]),
      },
    }),
  ]);

  await Promise.all([
    prisma.marginMetric.create({
      data: {
        period: "2026-03",
        totalRevenue: 27500,
        totalCost: 688,
        aiWorkflowRevenue: 25200,
        humanOversightHours: 32,
        revenuePerAiWorkflow: 3150,
        revenuePerHumanHour: 859,
        avgRevisionCount: 1.8,
        avgTurnaroundHours: 28,
        clientSatisfaction: 8.7,
        activeEngagements: 5,
        completedEngagements: 2,
      },
    }),
    prisma.marginMetric.create({
      data: {
        period: "2026-02",
        totalRevenue: 22800,
        totalCost: 545,
        aiWorkflowRevenue: 20500,
        humanOversightHours: 38,
        revenuePerAiWorkflow: 2850,
        revenuePerHumanHour: 600,
        avgRevisionCount: 2.3,
        avgTurnaroundHours: 34,
        clientSatisfaction: 8.2,
        activeEngagements: 4,
        completedEngagements: 3,
      },
    }),
    prisma.marginMetric.create({
      data: {
        period: "2026-01",
        totalRevenue: 18200,
        totalCost: 480,
        aiWorkflowRevenue: 16400,
        humanOversightHours: 42,
        revenuePerAiWorkflow: 2280,
        revenuePerHumanHour: 433,
        avgRevisionCount: 2.8,
        avgTurnaroundHours: 41,
        clientSatisfaction: 7.8,
        activeEngagements: 3,
        completedEngagements: 4,
      },
    }),
    prisma.marginMetric.create({
      data: {
        period: "2025-12",
        totalRevenue: 15600,
        totalCost: 425,
        aiWorkflowRevenue: 13800,
        humanOversightHours: 45,
        revenuePerAiWorkflow: 1950,
        revenuePerHumanHour: 347,
        avgRevisionCount: 3.1,
        avgTurnaroundHours: 48,
        clientSatisfaction: 7.5,
        activeEngagements: 3,
        completedEngagements: 2,
      },
    }),
    prisma.marginMetric.create({
      data: {
        period: "2025-11",
        totalRevenue: 12400,
        totalCost: 380,
        aiWorkflowRevenue: 10800,
        humanOversightHours: 48,
        revenuePerAiWorkflow: 1550,
        revenuePerHumanHour: 258,
        avgRevisionCount: 3.5,
        avgTurnaroundHours: 52,
        clientSatisfaction: 7.2,
        activeEngagements: 2,
        completedEngagements: 3,
      },
    }),
    prisma.marginMetric.create({
      data: {
        period: "2025-10",
        totalRevenue: 9800,
        totalCost: 340,
        aiWorkflowRevenue: 8200,
        humanOversightHours: 52,
        revenuePerAiWorkflow: 1225,
        revenuePerHumanHour: 188,
        avgRevisionCount: 4.0,
        avgTurnaroundHours: 58,
        clientSatisfaction: 6.9,
        activeEngagements: 2,
        completedEngagements: 1,
      },
    }),
  ]);

  await Promise.all([
    prisma.activityLog.create({
      data: {
        clientId: "client-1",
        action: "deliverable_updated",
        entity: "deliverable",
        entityId: "del-1",
        details: "Logo concepts v2 generated with deeper blue palette",
        performedBy: "ai",
        createdAt: new Date(now.getTime() - 0.4 * dayMs),
      },
    }),
    prisma.activityLog.create({
      data: {
        clientId: "client-2",
        action: "workflow_started",
        entity: "workflow",
        entityId: "eng-2",
        details: "Landing page copy generation v3 initiated",
        performedBy: "system",
        createdAt: new Date(now.getTime() - 0.2 * dayMs),
      },
    }),
    prisma.activityLog.create({
      data: {
        clientId: "client-4",
        action: "task_escalated",
        entity: "task",
        entityId: "eng-4",
        details: "Auto-escalation: client unresponsive for 3 days on homepage review",
        performedBy: "system",
        createdAt: new Date(now.getTime() - 0.1 * dayMs),
      },
    }),
    prisma.activityLog.create({
      data: {
        clientId: "client-6",
        action: "engagement_completed",
        entity: "engagement",
        entityId: "eng-5",
        details: "Investor Pitch Deck approved on first review - 97.4% margin",
        performedBy: "system",
        createdAt: new Date(now.getTime() - 6 * dayMs),
      },
    }),
  ]);

  console.log("Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
