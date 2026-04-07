import { prisma } from "@/lib/prisma";
import {
  assignDefaultStarters,
  pairingsForWeek,
  rosterScoreForWeek,
} from "@/lib/fantasy";

export function currentDraftPicker(
  memberships: { id: string; draftSlot: number }[],
  totalPicks: number
): { membershipId: string } | null {
  const n = memberships.length;
  if (n === 0) return null;
  const sortedAsc = [...memberships].sort((a, b) => a.draftSlot - b.draftSlot);
  const k = totalPicks;
  const round = Math.floor(k / n) + 1;
  const idxInRound = k % n;
  const order =
    round % 2 === 1
      ? sortedAsc
      : [...sortedAsc].sort((a, b) => b.draftSlot - a.draftSlot);
  const m = order[idxInRound];
  return m ? { membershipId: m.id } : null;
}

export async function ensureRosterFromDraft(leagueId: string): Promise<void> {
  const memberships = await prisma.leagueMembership.findMany({
    where: { leagueId },
  });

  for (const m of memberships) {
    const picks = await prisma.draftPick.findMany({
      where: { leagueId, agentId: m.agentId },
      include: { player: true },
      orderBy: { overall: "asc" },
    });
    await prisma.rosterPlayer.deleteMany({ where: { membershipId: m.id } });
    const players = picks.map((d) => d.player);
    const slots = assignDefaultStarters(players);
    let bench = 1;
    for (const p of players) {
      let slot: string;
      let isStarter = false;
      const assigned = Array.from(slots.entries()).find(([, pid]) => pid === p.id);
      if (assigned) {
        slot = assigned[0];
        isStarter = true;
      } else {
        slot = `BENCH${bench}`;
        bench += 1;
        isStarter = false;
      }
      await prisma.rosterPlayer.create({
        data: {
          membershipId: m.id,
          playerId: p.id,
          slot,
          isStarter,
        },
      });
    }
  }
}

export async function buildScheduleIfNeeded(leagueId: string): Promise<void> {
  const league = await prisma.league.findUnique({
    where: { id: leagueId },
    include: { memberships: true },
  });
  if (!league || league.status !== "in_season") return;
  const agentIds = league.memberships.map((m) => m.agentId);
  const existing = await prisma.matchup.count({ where: { leagueId } });
  if (existing > 0) return;

  for (let w = 1; w <= league.seasonWeeks; w++) {
    const pairs = pairingsForWeek(agentIds, w);
    for (const [homeAgentId, awayAgentId] of pairs) {
      await prisma.matchup.create({
        data: {
          leagueId,
          week: w,
          homeAgentId,
          awayAgentId,
          status: "scheduled",
        },
      });
    }
  }
}

export async function scoreWeek(leagueId: string, week: number): Promise<void> {
  const memberships = await prisma.leagueMembership.findMany({
    where: { leagueId },
    include: {
      roster: { include: { player: true } },
    },
  });
  const scores = new Map<string, number>();
  for (const m of memberships) {
    const pts = rosterScoreForWeek(m.roster, week);
    scores.set(m.agentId, pts);
  }

  const matchups = await prisma.matchup.findMany({
    where: { leagueId, week },
  });

  for (const g of matchups) {
    if (g.status === "final") continue;
    const home = scores.get(g.homeAgentId) ?? 0;
    const away = scores.get(g.awayAgentId) ?? 0;
    await prisma.matchup.update({
      where: { id: g.id },
      data: { homeScore: home, awayScore: away, status: "final" },
    });

    if (home > away) {
      await prisma.leagueMembership.updateMany({
        where: { leagueId, agentId: g.homeAgentId },
        data: {
          wins: { increment: 1 },
          pointsFor: { increment: home },
          pointsAgainst: { increment: away },
        },
      });
      await prisma.leagueMembership.updateMany({
        where: { leagueId, agentId: g.awayAgentId },
        data: {
          losses: { increment: 1 },
          pointsFor: { increment: away },
          pointsAgainst: { increment: home },
        },
      });
    } else if (away > home) {
      await prisma.leagueMembership.updateMany({
        where: { leagueId, agentId: g.awayAgentId },
        data: {
          wins: { increment: 1 },
          pointsFor: { increment: away },
          pointsAgainst: { increment: home },
        },
      });
      await prisma.leagueMembership.updateMany({
        where: { leagueId, agentId: g.homeAgentId },
        data: {
          losses: { increment: 1 },
          pointsFor: { increment: home },
          pointsAgainst: { increment: away },
        },
      });
    } else {
      await prisma.leagueMembership.updateMany({
        where: { leagueId, agentId: g.homeAgentId },
        data: {
          ties: { increment: 1 },
          pointsFor: { increment: home },
          pointsAgainst: { increment: away },
        },
      });
      await prisma.leagueMembership.updateMany({
        where: { leagueId, agentId: g.awayAgentId },
        data: {
          ties: { increment: 1 },
          pointsFor: { increment: away },
          pointsAgainst: { increment: home },
        },
      });
    }
  }
}
