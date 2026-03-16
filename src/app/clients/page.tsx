import { prisma } from "@/lib/prisma";
import { ClientsClient } from "./clients-client";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  const clients = await prisma.client.findMany({
    include: {
      engagements: { include: { serviceProduct: true } },
      invoices: true,
      _count: { select: { messages: true, knowledgeAssets: true, engagements: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const enriched = clients.map((client) => {
    const totalRevenue = client.engagements.reduce((s, e) => s + e.totalRevenue, 0);
    const totalCost = client.engagements.reduce((s, e) => s + e.totalCost, 0);
    const activeEngagements = client.engagements.filter(
      (e) => e.status === "active" || e.status === "in_review"
    ).length;

    return {
      ...client,
      totalRevenue,
      totalCost,
      grossMargin: totalRevenue > 0 ? ((totalRevenue - totalCost) / totalRevenue) * 100 : 0,
      activeEngagements,
    };
  });

  return <ClientsClient clients={JSON.parse(JSON.stringify(enriched))} />;
}
