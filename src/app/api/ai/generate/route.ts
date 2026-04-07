import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { engagementId, deliverableTitle, deliverableType, prompt } = body;

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OpenAI API key not configured. Set OPENAI_API_KEY environment variable." },
      { status: 500 }
    );
  }

  const engagement = await prisma.engagement.findUnique({
    where: { id: engagementId },
    include: {
      client: { include: { knowledgeAssets: true } },
      serviceProduct: true,
    },
  });

  if (!engagement) {
    return NextResponse.json({ error: "Engagement not found" }, { status: 404 });
  }

  const brandContext = engagement.client.brandVoice
    ? `\nBrand Voice: ${engagement.client.brandVoice}`
    : "";

  const knowledgeContext = engagement.client.knowledgeAssets
    .map((ka) => `${ka.title}: ${ka.content}`)
    .join("\n");

  const systemPrompt = `You are a professional content creator working for a premium service agency. 
You are creating a ${deliverableType} for ${engagement.client.name} (${engagement.client.industry}).${brandContext}
${knowledgeContext ? `\nReference Materials:\n${knowledgeContext}` : ""}
${engagement.serviceProduct.templatePrompt ? `\nTemplate Instructions: ${engagement.serviceProduct.templatePrompt}` : ""}

Produce high-quality, professional output. Be specific, actionable, and aligned with the client's brand.`;

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const startTime = Date.now();

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt || `Create a ${deliverableType} titled "${deliverableTitle}"` },
    ],
    max_tokens: 4096,
  });

  const duration = Math.round((Date.now() - startTime) / 1000);
  const content = completion.choices[0]?.message?.content || "";
  const cost = (completion.usage?.total_tokens || 0) * 0.00000015;

  const deliverable = await prisma.deliverable.create({
    data: {
      engagementId,
      title: deliverableTitle || `${deliverableType} - ${new Date().toLocaleDateString()}`,
      type: deliverableType,
      status: "draft",
      versions: {
        create: {
          versionNumber: 1,
          content,
          generatedBy: "ai",
          qualityScore: 8.0,
        },
      },
    },
  });

  await prisma.productionWorkflow.create({
    data: {
      engagementId,
      name: `AI Generation: ${deliverableTitle}`,
      type: "content_generation",
      status: "completed",
      inputData: JSON.stringify({ prompt: prompt?.slice(0, 200) }),
      outputData: JSON.stringify({ deliverableId: deliverable.id, tokensUsed: completion.usage?.total_tokens }),
      duration,
      cost,
    },
  });

  return NextResponse.json({
    deliverable,
    content,
    duration,
    cost,
    tokensUsed: completion.usage?.total_tokens,
  });
}
