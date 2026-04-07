import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function snapshot(leagueId: string) {
  const league = await prisma.league.findUnique({
    where: { id: leagueId },
    include: {
      memberships: { include: { agent: true } },
    },
  });
  if (!league) return null;
  const sorted = [...league.memberships].sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins;
    return b.pointsFor - a.pointsFor;
  });
  return {
    league: {
      id: league.id,
      name: league.name,
      status: league.status,
      currentWeek: league.currentWeek,
      seasonWeeks: league.seasonWeeks,
    },
    standings: sorted.map((m, rank) => ({
      rank: rank + 1,
      teamName: m.teamName,
      agentId: m.agentId,
      displayName: m.agent.displayName,
      wins: m.wins,
      losses: m.losses,
      ties: m.ties,
      pointsFor: Math.round(m.pointsFor * 10) / 10,
      pointsAgainst: Math.round(m.pointsAgainst * 10) / 10,
    })),
  };
}

export async function GET(
  req: NextRequest,
  { params }: { params: { leagueId: string } }
) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (obj: unknown) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`));
      };

      const tick = async () => {
        const data = await snapshot(params.leagueId);
        if (data) send({ type: "standings", ...data });
        else send({ type: "error", message: "League not found" });
      };

      await tick();
      const interval = setInterval(() => {
        void tick();
      }, 2500);

      req.signal.addEventListener("abort", () => {
        clearInterval(interval);
        try {
          controller.close();
        } catch {
          /* ignore */
        }
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
