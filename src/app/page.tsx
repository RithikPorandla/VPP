import { prisma } from "@/lib/prisma";
import { LeagueHub } from "./league-hub";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const leagues = await prisma.league.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      status: true,
      currentWeek: true,
      seasonWeeks: true,
    },
  });

  return (
    <LeagueHub
      initialLeagues={JSON.parse(JSON.stringify(leagues)) as typeof leagues}
    />
  );
}
