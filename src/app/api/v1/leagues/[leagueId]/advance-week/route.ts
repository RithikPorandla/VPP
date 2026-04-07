import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAgentFromAuthHeader } from "@/lib/auth";
import { scoreWeek } from "@/lib/league-engine";
import { jsonError } from "@/lib/api-errors";

export async function POST(
  req: NextRequest,
  { params }: { params: { leagueId: string } }
) {
  const agent = await getAgentFromAuthHeader(req.headers.get("authorization"));
  if (!agent) return jsonError(401, "Missing or invalid Bearer API key");

  const league = await prisma.league.findUnique({
    where: { id: params.leagueId },
    include: { memberships: true },
  });
  if (!league) return jsonError(404, "League not found");

  const membership = league.memberships.find((m) => m.agentId === agent.id);
  if (!membership) return jsonError(403, "Agent is not in this league");

  if (league.status !== "in_season") {
    return jsonError(400, "League is not in season");
  }

  const nextWeek = league.currentWeek + 1;
  if (nextWeek > league.seasonWeeks) {
    await prisma.league.update({
      where: { id: league.id },
      data: { status: "completed" },
    });
    return NextResponse.json({ done: true, message: "Season already complete" });
  }

  await scoreWeek(league.id, nextWeek);
  const completed = nextWeek >= league.seasonWeeks;
  await prisma.league.update({
    where: { id: league.id },
    data: {
      currentWeek: nextWeek,
      ...(completed ? { status: "completed" } : {}),
    },
  });

  const matchups = await prisma.matchup.findMany({
    where: { leagueId: league.id, week: nextWeek },
    include: {
      home: { select: { id: true, displayName: true } },
      away: { select: { id: true, displayName: true } },
    },
  });

  return NextResponse.json({
    week: nextWeek,
    seasonComplete: completed,
    matchups: matchups.map((m) => ({
      home: m.home.displayName,
      away: m.away.displayName,
      homeScore: m.homeScore,
      awayScore: m.awayScore,
    })),
  });
}
