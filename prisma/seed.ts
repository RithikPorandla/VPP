import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

const TEAMS = [
  "KC",
  "BUF",
  "SF",
  "DAL",
  "PHI",
  "BAL",
  "MIA",
  "DET",
  "GB",
  "HOU",
  "LAR",
  "TB",
  "MIN",
  "ATL",
  "SEA",
  "LAC",
  "CIN",
  "IND",
  "NYJ",
  "NYG",
  "CHI",
  "NE",
  "DEN",
  "NO",
  "ARI",
  "CAR",
  "LV",
  "JAX",
  "TEN",
  "CLE",
  "WAS",
  "PIT",
];

function rng(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 2654435761);
  }
  return () => {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    return ((h >>> 0) % 10000) / 10000;
  };
}

async function main() {
  await prisma.chatMessage.deleteMany();
  await prisma.matchup.deleteMany();
  await prisma.rosterPlayer.deleteMany();
  await prisma.draftPick.deleteMany();
  await prisma.leagueMembership.deleteMany();
  await prisma.league.deleteMany();
  await prisma.player.deleteMany();
  await prisma.agent.deleteMany();

  const positions: { pos: string; count: number; nameFn: (i: number) => string }[] = [
    { pos: "QB", count: 32, nameFn: (i) => `QB Bot ${i + 1}` },
    { pos: "RB", count: 48, nameFn: (i) => `RB Synth ${i + 1}` },
    { pos: "WR", count: 56, nameFn: (i) => `WR Node ${i + 1}` },
    { pos: "TE", count: 24, nameFn: (i) => `TE Kernel ${i + 1}` },
    { pos: "K", count: 20, nameFn: (i) => `K Vector ${i + 1}` },
    { pos: "DEF", count: 16, nameFn: (i) => `DEF Firewall ${i + 1}` },
  ];

  let pi = 0;
  for (const block of positions) {
    for (let i = 0; i < block.count; i++) {
      const rand = rng(`${block.pos}-${i}`);
      const nflTeam = TEAMS[pi % TEAMS.length]!;
      pi++;
      await prisma.player.create({
        data: {
          name: block.nameFn(i),
          position: block.pos,
          nflTeam,
          byeWeek: 5 + Math.floor(rand() * 9),
          baseRating: 55 + rand() * 38,
          injuryStatus: rand() < 0.92 ? "healthy" : rand() < 0.97 ? "questionable" : "out",
        },
      });
    }
  }

  const hash = (k: string) => crypto.createHash("sha256").update(k).digest("hex");
  const demoKey = "afl_demo_agent_key_change_in_prod";
  await prisma.agent.create({
    data: {
      displayName: "Demo Agent (seed)",
      apiKeyHash: hash(demoKey),
    },
  });

  console.log("Fantasy seed complete. Demo API key (Bearer):", demoKey);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
