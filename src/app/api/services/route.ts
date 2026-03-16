import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const services = await prisma.serviceProduct.findMany({
    include: {
      _count: { select: { engagements: true } },
      engagements: {
        select: {
          totalRevenue: true,
          totalCost: true,
          status: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const enriched = services.map((svc) => {
    const completedEngagements = svc.engagements.filter(
      (e) => e.status === "completed"
    );
    const totalRevenue = svc.engagements.reduce(
      (sum, e) => sum + e.totalRevenue,
      0
    );
    const totalCost = svc.engagements.reduce(
      (sum, e) => sum + e.totalCost,
      0
    );

    return {
      ...svc,
      totalRevenue,
      totalCost,
      grossMargin:
        totalRevenue > 0
          ? ((totalRevenue - totalCost) / totalRevenue) * 100
          : 0,
      completedCount: completedEngagements.length,
    };
  });

  return NextResponse.json(enriched);
}
