import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const [activityLogs, clientCount, engagementCount, taskCount] =
    await Promise.all([
      prisma.activityLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 50,
        include: { client: true },
      }),
      prisma.client.count(),
      prisma.engagement.count(),
      prisma.task.count(),
    ]);

  return NextResponse.json({
    activityLogs,
    stats: {
      clients: clientCount,
      engagements: engagementCount,
      tasks: taskCount,
    },
    roles: [
      {
        name: "Founder-Operator",
        description: "Full system access, all clients and data",
        permissions: ["all"],
      },
      {
        name: "Client-Admin",
        description: "Manage own engagements, approve deliverables",
        permissions: [
          "view_engagements",
          "approve_deliverables",
          "send_messages",
        ],
      },
      {
        name: "Client-Reviewer",
        description: "Review and provide feedback on deliverables",
        permissions: ["view_deliverables", "submit_feedback"],
      },
      {
        name: "Contractor",
        description: "Work on assigned tasks and deliverables",
        permissions: [
          "view_assigned_tasks",
          "update_deliverables",
          "view_briefs",
        ],
      },
    ],
  });
}
