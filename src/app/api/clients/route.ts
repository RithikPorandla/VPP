import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const clients = await prisma.client.findMany({
    include: {
      engagements: {
        include: { serviceProduct: true },
      },
      invoices: true,
      _count: {
        select: {
          messages: true,
          knowledgeAssets: true,
          engagements: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const enriched = clients.map((client) => {
    const totalRevenue = client.engagements.reduce(
      (sum, e) => sum + e.totalRevenue,
      0
    );
    const totalCost = client.engagements.reduce(
      (sum, e) => sum + e.totalCost,
      0
    );
    const activeEngagements = client.engagements.filter(
      (e) => e.status === "active" || e.status === "in_review"
    ).length;
    const paidInvoices = client.invoices
      .filter((i) => i.status === "paid")
      .reduce((sum, i) => sum + i.amount, 0);

    return {
      ...client,
      totalRevenue,
      totalCost,
      grossMargin: totalRevenue > 0 ? ((totalRevenue - totalCost) / totalRevenue) * 100 : 0,
      activeEngagements,
      paidInvoices,
    };
  });

  return NextResponse.json(enriched);
}
