import { prisma } from "@/lib/prisma";
import { ServicesClient } from "./services-client";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const services = await prisma.serviceProduct.findMany({
    include: {
      _count: { select: { engagements: true } },
      engagements: { select: { totalRevenue: true, totalCost: true, status: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const enriched = services.map((svc) => {
    const totalRevenue = svc.engagements.reduce((s, e) => s + e.totalRevenue, 0);
    const totalCost = svc.engagements.reduce((s, e) => s + e.totalCost, 0);
    const completedCount = svc.engagements.filter((e) => e.status === "completed").length;

    return {
      ...svc,
      totalRevenue,
      totalCost,
      grossMargin: totalRevenue > 0 ? ((totalRevenue - totalCost) / totalRevenue) * 100 : 0,
      completedCount,
    };
  });

  return <ServicesClient services={JSON.parse(JSON.stringify(enriched))} />;
}
