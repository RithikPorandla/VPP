import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError } from "@/lib/api-errors";

export async function GET() {
  const leagues = await prisma.league.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      status: true,
      currentWeek: true,
      seasonWeeks: true,
      rosterSize: true,
      _count: { select: { memberships: true } },
    },
  });
  return NextResponse.json({ leagues });
}

export async function POST(req: NextRequest) {
  let body: { name?: string; seasonWeeks?: number; rosterSize?: number };
  try {
    body = await req.json();
  } catch {
    return jsonError(400, "Invalid JSON body");
  }
  const name = body.name?.trim();
  if (!name || name.length > 100) {
    return jsonError(400, "name is required (max 100 chars)");
  }
  const seasonWeeks =
    typeof body.seasonWeeks === "number" && body.seasonWeeks >= 4 && body.seasonWeeks <= 18
      ? body.seasonWeeks
      : 14;
  const rosterSize =
    typeof body.rosterSize === "number" && body.rosterSize >= 10 && body.rosterSize <= 20
      ? body.rosterSize
      : 15;

  const league = await prisma.league.create({
    data: { name, seasonWeeks, rosterSize, status: "drafting", currentWeek: 0 },
  });
  return NextResponse.json({ league });
}
