import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const [
    metrics,
    activeEngagements,
    recentActivity,
    clientCount,
    tasksByStatus,
    recentMessages,
  ] = await Promise.all([
    prisma.marginMetric.findMany({ orderBy: { period: "desc" }, take: 6 }),
    prisma.engagement.findMany({
      where: { status: { in: ["active", "in_review", "proposal"] } },
      include: { client: true, serviceProduct: true },
      orderBy: { dueDate: "asc" },
    }),
    prisma.activityLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { client: true },
    }),
    prisma.client.count({ where: { status: "active" } }),
    prisma.task.groupBy({
      by: ["status"],
      _count: { id: true },
    }),
    prisma.clientMessage.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { client: true },
    }),
  ]);

  const currentMetric = metrics[0];
  const prevMetric = metrics[1];

  const grossMargin = currentMetric
    ? ((currentMetric.totalRevenue - currentMetric.totalCost) /
        currentMetric.totalRevenue) *
      100
    : 0;

  const prevGrossMargin = prevMetric
    ? ((prevMetric.totalRevenue - prevMetric.totalCost) /
        prevMetric.totalRevenue) *
      100
    : 0;

  return NextResponse.json({
    metrics,
    activeEngagements,
    recentActivity,
    recentMessages,
    summary: {
      totalRevenue: currentMetric?.totalRevenue ?? 0,
      revenueChange: prevMetric
        ? ((currentMetric!.totalRevenue - prevMetric.totalRevenue) /
            prevMetric.totalRevenue) *
          100
        : 0,
      grossMargin,
      marginChange: grossMargin - prevGrossMargin,
      revenuePerHumanHour: currentMetric?.revenuePerHumanHour ?? 0,
      rphChange: prevMetric
        ? ((currentMetric!.revenuePerHumanHour - prevMetric.revenuePerHumanHour) /
            prevMetric.revenuePerHumanHour) *
          100
        : 0,
      activeClients: clientCount,
      activeEngagements: activeEngagements.length,
      avgSatisfaction: currentMetric?.clientSatisfaction ?? 0,
      satisfactionChange: prevMetric
        ? ((currentMetric!.clientSatisfaction - prevMetric.clientSatisfaction) /
            prevMetric.clientSatisfaction) *
          100
        : 0,
      avgRevisions: currentMetric?.avgRevisionCount ?? 0,
      revisionChange: prevMetric
        ? ((currentMetric!.avgRevisionCount - prevMetric.avgRevisionCount) /
            prevMetric.avgRevisionCount) *
          100
        : 0,
      avgTurnaround: currentMetric?.avgTurnaroundHours ?? 0,
      turnaroundChange: prevMetric
        ? ((currentMetric!.avgTurnaroundHours - prevMetric.avgTurnaroundHours) /
            prevMetric.avgTurnaroundHours) *
          100
        : 0,
      tasksByStatus: Object.fromEntries(
        tasksByStatus.map((t) => [t.status, t._count.id])
      ),
    },
  });
}
