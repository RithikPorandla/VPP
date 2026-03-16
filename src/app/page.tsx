import { prisma } from "@/lib/prisma";
import { DashboardClient } from "./dashboard-client";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [metrics, activeEngagements, recentActivity, clientCount, tasksByStatus, recentMessages] =
    await Promise.all([
      prisma.marginMetric.findMany({ orderBy: { period: "desc" }, take: 6 }),
      prisma.engagement.findMany({
        where: { status: { in: ["active", "in_review", "proposal"] } },
        include: { client: true, serviceProduct: true, tasks: true },
        orderBy: { dueDate: "asc" },
      }),
      prisma.activityLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        include: { client: true },
      }),
      prisma.client.count({ where: { status: "active" } }),
      prisma.task.groupBy({ by: ["status"], _count: { id: true } }),
      prisma.clientMessage.findMany({
        where: { direction: "inbound" },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { client: true },
      }),
    ]);

  const current = metrics[0];
  const prev = metrics[1];

  const grossMargin = current
    ? ((current.totalRevenue - current.totalCost) / current.totalRevenue) * 100
    : 0;
  const prevGrossMargin = prev
    ? ((prev.totalRevenue - prev.totalCost) / prev.totalRevenue) * 100
    : 0;

  const summary = {
    totalRevenue: current?.totalRevenue ?? 0,
    revenueChange: prev
      ? ((current!.totalRevenue - prev.totalRevenue) / prev.totalRevenue) * 100
      : 0,
    grossMargin,
    marginChange: grossMargin - prevGrossMargin,
    revenuePerHumanHour: current?.revenuePerHumanHour ?? 0,
    rphChange: prev
      ? ((current!.revenuePerHumanHour - prev.revenuePerHumanHour) / prev.revenuePerHumanHour) * 100
      : 0,
    activeClients: clientCount,
    activeEngagements: activeEngagements.length,
    avgSatisfaction: current?.clientSatisfaction ?? 0,
    satisfactionChange: prev
      ? ((current!.clientSatisfaction - prev.clientSatisfaction) / prev.clientSatisfaction) * 100
      : 0,
    avgRevisions: current?.avgRevisionCount ?? 0,
    revisionChange: prev
      ? ((current!.avgRevisionCount - prev.avgRevisionCount) / prev.avgRevisionCount) * 100
      : 0,
    avgTurnaround: current?.avgTurnaroundHours ?? 0,
    turnaroundChange: prev
      ? ((current!.avgTurnaroundHours - prev.avgTurnaroundHours) / prev.avgTurnaroundHours) * 100
      : 0,
    tasksByStatus: Object.fromEntries(tasksByStatus.map((t) => [t.status, t._count.id])),
  };

  return (
    <DashboardClient
      summary={JSON.parse(JSON.stringify(summary))}
      metrics={JSON.parse(JSON.stringify(metrics))}
      activeEngagements={JSON.parse(JSON.stringify(activeEngagements))}
      recentActivity={JSON.parse(JSON.stringify(recentActivity))}
      recentMessages={JSON.parse(JSON.stringify(recentMessages))}
    />
  );
}
