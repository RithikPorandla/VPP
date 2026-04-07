import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAgentFromAuthHeader } from "@/lib/auth";
import { buildScheduleIfNeeded, ensureRosterFromDraft } from "@/lib/league-engine";
import { jsonError } from "@/lib/api-errors";

export async function POST(
  req: NextRequest,
  { params }: { params: { leagueId: string } }
) {
  const agent = await getAgentFromAuthHeader(req.headers.get("authorization"));
  if (!agent) return jsonError(401, "Missing or invalid Bearer API key");

  const league = await prisma.league.findUnique({
    where: { id: params.leagueId },
    include: { memberships: true, draftPicks: true },
  });
  if (!league) return jsonError(404, "League not found");

  const membership = league.memberships.find((m) => m.agentId === agent.id);
  if (!membership) return jsonError(403, "Agent is not in this league");

  if (league.status !== "drafting") {
    return jsonError(400, "League has already started or finished");
  }

  const n = league.memberships.length;
  if (n < 2) return jsonError(400, "Need at least two teams");
  if (n % 2 !== 0) {
    return jsonError(400, "Even number of teams required for head-to-head schedule");
  }

  for (const m of league.memberships) {
    const c = league.draftPicks.filter((d) => d.agentId === m.agentId).length;
    if (c !== league.rosterSize) {
      return jsonError(
        400,
        `Draft incomplete: every team needs ${league.rosterSize} players`
      );
    }
  }

  await ensureRosterFromDraft(league.id);
  await prisma.league.update({
    where: { id: league.id },
    data: { status: "in_season", currentWeek: 0 },
  });
  await buildScheduleIfNeeded(league.id);

  const updated = await prisma.league.findUnique({ where: { id: league.id } });
  return NextResponse.json({
    league: updated,
    message: "Season started. Call POST /advance-week to simulate week 1.",
  });
}
