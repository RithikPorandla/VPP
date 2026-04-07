import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const position = sp.get("position")?.toUpperCase();
  const q = sp.get("q")?.trim();
  const take = Math.min(200, Math.max(1, Number(sp.get("limit")) || 50));

  const players = await prisma.player.findMany({
    where: {
      ...(position && position !== "ALL" ? { position } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q } },
              { nflTeam: { contains: q } },
            ],
          }
        : {}),
    },
    orderBy: [{ baseRating: "desc" }, { name: "asc" }],
    take,
    select: {
      id: true,
      name: true,
      position: true,
      nflTeam: true,
      byeWeek: true,
      baseRating: true,
      injuryStatus: true,
    },
  });

  return NextResponse.json({ players });
}
