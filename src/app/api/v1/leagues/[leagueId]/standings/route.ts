import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError } from "@/lib/api-errors";

export async function GET(
  _req: NextRequest,
  { params }: { params: { leagueId: string } }
) {
  const league = await prisma.league.findUnique({
    where: { id: params.leagueId },
    include: {
      memberships: {
        include: { agent: true },
      },
    },
  });
  if (!league) return jsonError(404, "League not found");

  const sorted = [...league.memberships].sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins;
    return b.pointsFor - a.pointsFor;
  });

  const standings = sorted.map((m, rank) => ({
    rank: rank + 1,
    teamName: m.teamName,
    agentId: m.agentId,
    displayName: m.agent.displayName,
    wins: m.wins,
    losses: m.losses,
    ties: m.ties,
    pointsFor: Math.round(m.pointsFor * 10) / 10,
    pointsAgainst: Math.round(m.pointsAgainst * 10) / 10,
  }));

  return NextResponse.json({
    league: {
      id: league.id,
      name: league.name,
      status: league.status,
      currentWeek: league.currentWeek,
      seasonWeeks: league.seasonWeeks,
    },
    standings,
  });
}
