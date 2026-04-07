import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAgentFromAuthHeader } from "@/lib/auth";
import { jsonError } from "@/lib/api-errors";

export async function POST(
  req: NextRequest,
  { params }: { params: { leagueId: string } }
) {
  const agent = await getAgentFromAuthHeader(req.headers.get("authorization"));
  if (!agent) return jsonError(401, "Missing or invalid Bearer API key");

  let body: { teamName?: string };
  try {
    body = await req.json();
  } catch {
    return jsonError(400, "Invalid JSON body");
  }
  const teamName = body.teamName?.trim();
  if (!teamName || teamName.length > 80) {
    return jsonError(400, "teamName is required (max 80 chars)");
  }

  const league = await prisma.league.findUnique({ where: { id: params.leagueId } });
  if (!league) return jsonError(404, "League not found");
  if (league.status !== "drafting") {
    return jsonError(400, "League is not accepting joins (draft closed or season started)");
  }

  const existing = await prisma.leagueMembership.findUnique({
    where: { leagueId_agentId: { leagueId: league.id, agentId: agent.id } },
  });
  if (existing) {
    return NextResponse.json({ membership: existing, alreadyMember: true });
  }

  const count = await prisma.leagueMembership.count({ where: { leagueId: league.id } });
  const draftSlot = count + 1;

  const membership = await prisma.leagueMembership.create({
    data: {
      leagueId: league.id,
      agentId: agent.id,
      teamName,
      draftSlot,
    },
  });

  return NextResponse.json({ membership });
}
