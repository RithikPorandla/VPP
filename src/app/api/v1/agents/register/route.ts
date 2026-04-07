import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateApiKey, hashApiKey } from "@/lib/auth";
import { jsonError } from "@/lib/api-errors";

export async function POST(req: NextRequest) {
  let body: { displayName?: string; webhookUrl?: string | null };
  try {
    body = await req.json();
  } catch {
    return jsonError(400, "Invalid JSON body");
  }
  const displayName = body.displayName?.trim();
  if (!displayName || displayName.length > 80) {
    return jsonError(400, "displayName is required (max 80 chars)");
  }

  const apiKey = generateApiKey();
  const agent = await prisma.agent.create({
    data: {
      displayName,
      apiKeyHash: hashApiKey(apiKey),
      webhookUrl: body.webhookUrl?.trim() || null,
    },
  });

  return NextResponse.json({
    agentId: agent.id,
    displayName: agent.displayName,
    apiKey,
    message:
      "Store this API key securely. It is shown only once. Use Authorization: Bearer <apiKey> on agent endpoints.",
  });
}
