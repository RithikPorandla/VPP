import type { Player, RosterPlayer } from "@prisma/client";

/** Deterministic pseudo-random 0–1 from week + player id */
export function weekNoise(week: number, playerId: string): number {
  let h = week * 374761393;
  for (let i = 0; i < playerId.length; i++) {
    h = Math.imul(h ^ playerId.charCodeAt(i), 2654435761);
  }
  return ((h >>> 0) % 10000) / 10000;
}

export function scorePlayer(player: Player, week: number): number {
  if (player.injuryStatus === "out") return 0;
  const noise = weekNoise(week, player.id);
  const injuryMult =
    player.injuryStatus === "questionable" ? 0.75 + noise * 0.2 : 1;
  const bye = player.byeWeek === week ? 0 : 1;
  const base = player.baseRating * injuryMult * bye;
  const variance = (noise - 0.5) * 22;
  return Math.max(0, base * 0.12 + variance);
}

export function assignDefaultStarters(
  players: Player[]
): Map<string, string> {
  const byPos = (p: string) => players.filter((x) => x.position === p);
  const qb = byPos("QB").sort((a, b) => b.baseRating - a.baseRating)[0];
  const rb = byPos("RB").sort((a, b) => b.baseRating - a.baseRating);
  const wr = byPos("WR").sort((a, b) => b.baseRating - a.baseRating);
  const te = byPos("TE").sort((a, b) => b.baseRating - a.baseRating);
  const k = byPos("K").sort((a, b) => b.baseRating - a.baseRating)[0];
  const def = byPos("DEF").sort((a, b) => b.baseRating - a.baseRating)[0];

  const flexPool = [...rb.slice(2), ...wr.slice(2), ...te.slice(1)].sort(
    (a, b) => b.baseRating - a.baseRating
  );

  const slotToPlayer = new Map<string, string>();
  if (qb) slotToPlayer.set("QB1", qb.id);
  if (rb[0]) slotToPlayer.set("RB1", rb[0].id);
  if (rb[1]) slotToPlayer.set("RB2", rb[1].id);
  if (wr[0]) slotToPlayer.set("WR1", wr[0].id);
  if (wr[1]) slotToPlayer.set("WR2", wr[1].id);
  if (te[0]) slotToPlayer.set("TE1", te[0].id);
  if (flexPool[0]) slotToPlayer.set("FLEX", flexPool[0].id);
  if (k) slotToPlayer.set("K1", k.id);
  if (def) slotToPlayer.set("DEF1", def.id);

  return slotToPlayer;
}

export function rosterScoreForWeek(
  roster: (RosterPlayer & { player: Player })[],
  week: number
): number {
  const starters = roster.filter((r) => r.isStarter);
  let total = 0;
  for (const r of starters) {
    total += scorePlayer(r.player, week);
  }
  return Math.round(total * 10) / 10;
}

/** Even team count: rotate sorted ids so everyone gets varied opponents over the season */
export function pairingsForWeek(agentIds: string[], week: number): [string, string][] {
  const sorted = [...agentIds].sort();
  const n = sorted.length;
  if (n < 2) return [];
  const shift = (week - 1) % n;
  const rotated = [...sorted.slice(shift), ...sorted.slice(0, shift)];
  const pairs: [string, string][] = [];
  for (let i = 0; i + 1 < n; i += 2) {
    pairs.push([rotated[i]!, rotated[i + 1]!]);
  }
  return pairs;
}
