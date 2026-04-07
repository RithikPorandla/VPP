import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAgentFromAuthHeader } from "@/lib/auth";
import { currentDraftPicker } from "@/lib/league-engine";
import { jsonError } from "@/lib/api-errors";

export async function GET(
  _req: NextRequest,
  { params }: { params: { leagueId: string } }
) {
  const league = await prisma.league.findUnique({
    where: { id: params.leagueId },
    include: {
      memberships: { orderBy: { draftSlot: "asc" }, include: { agent: true } },
      draftPicks: {
        orderBy: { overall: "asc" },
        include: { player: true, agent: true },
      },
    },
  });
  if (!league) return jsonError(404, "League not found");

  const n = league.memberships.length;
  const totalPicks = league.draftPicks.length;
  const picker = n > 0 ? currentDraftPicker(league.memberships, totalPicks) : null;
  const membershipIdOnClock = picker?.membershipId ?? null;
  const agentOnClock =
    membershipIdOnClock &&
    league.memberships.find((m) => m.id === membershipIdOnClock)?.agentId;

  return NextResponse.json({
    leagueId: league.id,
    status: league.status,
    rosterSize: league.rosterSize,
    memberships: league.memberships.map((m) => ({
      membershipId: m.id,
      draftSlot: m.draftSlot,
      teamName: m.teamName,
      agentId: m.agentId,
      displayName: m.agent.displayName,
      picksCount: league.draftPicks.filter((d) => d.agentId === m.agentId).length,
    })),
    picks: league.draftPicks.map((d) => ({
      overall: d.overall,
      round: d.round,
      pickNumber: d.pickNumber,
      teamName: league.memberships.find((x) => x.agentId === d.agentId)?.teamName,
      player: { id: d.player.id, name: d.player.name, position: d.player.position },
    })),
    onTheClock: agentOnClock
      ? { agentId: agentOnClock, membershipId: membershipIdOnClock }
      : null,
    draftComplete:
      n > 0 &&
      league.memberships.every(
        (m) => league.draftPicks.filter((d) => d.agentId === m.agentId).length >= league.rosterSize
      ),
  });
}

export async function POST(
  req: NextRequest,
  { params }: { params: { leagueId: string } }
) {
  const agent = await getAgentFromAuthHeader(req.headers.get("authorization"));
  if (!agent) return jsonError(401, "Missing or invalid Bearer API key");

  let body: { playerId?: string };
  try {
    body = await req.json();
  } catch {
    return jsonError(400, "Invalid JSON body");
  }
  const playerId = body.playerId?.trim();
  if (!playerId) return jsonError(400, "playerId is required");

  const league = await prisma.league.findUnique({
    where: { id: params.leagueId },
    include: { memberships: true, draftPicks: true },
  });
  if (!league) return jsonError(404, "League not found");
  if (league.status !== "drafting") {
    return jsonError(400, "Draft is not active for this league");
  }

  const membership = league.memberships.find((m) => m.agentId === agent.id);
  if (!membership) return jsonError(403, "Agent is not in this league");

  const myPicks = league.draftPicks.filter((d) => d.agentId === agent.id).length;
  if (myPicks >= league.rosterSize) {
    return jsonError(400, "Roster already full for this agent");
  }

  const n = league.memberships.length;
  if (n < 2) {
    return jsonError(400, "Need at least two agents in the league to draft");
  }

  const totalPicks = league.draftPicks.length;
  const picker = currentDraftPicker(league.memberships, totalPicks);
  if (!picker || picker.membershipId !== membership.id) {
    return jsonError(409, "Not your pick");
  }

  const taken = await prisma.draftPick.findUnique({
    where: { leagueId_playerId: { leagueId: league.id, playerId } },
  });
  if (taken) return jsonError(409, "Player already drafted");

  const player = await prisma.player.findUnique({ where: { id: playerId } });
  if (!player) return jsonError(404, "Player not found");

  const overall = totalPicks + 1;
  const round = Math.floor(totalPicks / n) + 1;
  const pickNumber = (totalPicks % n) + 1;

  const pick = await prisma.draftPick.create({
    data: {
      leagueId: league.id,
      agentId: agent.id,
      playerId,
      round,
      pickNumber,
      overall,
    },
    include: { player: true },
  });

  return NextResponse.json({
    pick: {
      overall: pick.overall,
      round: pick.round,
      pickNumber: pick.pickNumber,
      player: {
        id: pick.player.id,
        name: pick.player.name,
        position: pick.player.position,
        nflTeam: pick.player.nflTeam,
      },
    },
  });
}
