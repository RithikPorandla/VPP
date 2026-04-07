import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAgentFromAuthHeader } from "@/lib/auth";
import { generateTrashTalk } from "@/lib/openai-trash";
import { jsonError } from "@/lib/api-errors";

async function standingsSnippet(leagueId: string): Promise<string> {
  const rows = await prisma.leagueMembership.findMany({
    where: { leagueId },
    orderBy: [{ wins: "desc" }, { pointsFor: "desc" }],
    include: { agent: true },
  });
  return rows
    .map(
      (r, i) =>
        `${i + 1}. ${r.teamName} (${r.agent.displayName}) — ${r.wins}-${r.losses}-${r.ties}, PF ${r.pointsFor.toFixed(1)}`
    )
    .join("\n");
}

export async function GET(
  req: NextRequest,
  { params }: { params: { leagueId: string } }
) {
  const league = await prisma.league.findUnique({ where: { id: params.leagueId } });
  if (!league) return jsonError(404, "League not found");

  const limit = Math.min(
    100,
    Math.max(1, Number(req.nextUrl.searchParams.get("limit")) || 50)
  );

  const messages = await prisma.chatMessage.findMany({
    where: { leagueId: league.id },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { agent: true },
  });

  return NextResponse.json({
    messages: messages.reverse().map((m) => ({
      id: m.id,
      body: m.body,
      createdAt: m.createdAt,
      agent: { id: m.agent.id, displayName: m.agent.displayName },
    })),
  });
}

export async function POST(
  req: NextRequest,
  { params }: { params: { leagueId: string } }
) {
  const agent = await getAgentFromAuthHeader(req.headers.get("authorization"));
  if (!agent) return jsonError(401, "Missing or invalid Bearer API key");

  let body: { message?: string; useOpenAI?: boolean };
  try {
    body = await req.json();
  } catch {
    return jsonError(400, "Invalid JSON body");
  }

  const league = await prisma.league.findUnique({ where: { id: params.leagueId } });
  if (!league) return jsonError(404, "League not found");

  const membership = await prisma.leagueMembership.findUnique({
    where: { leagueId_agentId: { leagueId: league.id, agentId: agent.id } },
    include: { agent: true },
  });
  if (!membership) return jsonError(403, "Agent is not in this league");

  let bodyText: string;
  if (body.useOpenAI !== false) {
    const standings = await standingsSnippet(league.id);
    bodyText = await generateTrashTalk({
      leagueName: league.name,
      agentName: membership.agent.displayName,
      teamName: membership.teamName,
      standingsSnippet: standings || "Season not started yet.",
      userHint: body.message?.trim() || undefined,
    });
  } else {
    const manual = body.message?.trim();
    if (!manual || manual.length > 2000) {
      return jsonError(400, "message is required when useOpenAI is false (max 2000 chars)");
    }
    bodyText = manual;
  }

  const msg = await prisma.chatMessage.create({
    data: {
      leagueId: league.id,
      agentId: agent.id,
      body: bodyText,
    },
  });

  return NextResponse.json({
    message: {
      id: msg.id,
      body: msg.body,
      createdAt: msg.createdAt,
    },
  });
}
