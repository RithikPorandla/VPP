import { prisma } from "@/lib/prisma";
import { SettingsClient } from "./settings-client";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const [activityLogs, clientCount, engagementCount, taskCount] = await Promise.all([
    prisma.activityLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { client: true },
    }),
    prisma.client.count(),
    prisma.engagement.count(),
    prisma.task.count(),
  ]);

  const roles = [
    {
      name: "Founder-Operator",
      description: "Full system access — all clients, data, and configuration",
      permissions: ["Full Access", "Client Management", "Revenue Analytics", "System Config"],
      color: "bg-primary-100 text-primary-700",
    },
    {
      name: "Client-Admin",
      description: "Manage own engagements, approve deliverables, send messages",
      permissions: ["View Engagements", "Approve Deliverables", "Send Messages", "View Invoices"],
      color: "bg-blue-100 text-blue-700",
    },
    {
      name: "Client-Reviewer",
      description: "Review and provide feedback on deliverables only",
      permissions: ["View Deliverables", "Submit Feedback"],
      color: "bg-emerald-100 text-emerald-700",
    },
    {
      name: "Contractor",
      description: "Work on assigned tasks and update deliverables",
      permissions: ["View Assigned Tasks", "Update Deliverables", "View Briefs"],
      color: "bg-amber-100 text-amber-700",
    },
  ];

  return (
    <SettingsClient
      activityLogs={JSON.parse(JSON.stringify(activityLogs))}
      stats={{ clients: clientCount, engagements: engagementCount, tasks: taskCount }}
      roles={roles}
    />
  );
}
