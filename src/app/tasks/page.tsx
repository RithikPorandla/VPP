import { prisma } from "@/lib/prisma";
import { TasksClient } from "./tasks-client";

export const dynamic = "force-dynamic";

export default async function TasksPage() {
  const tasks = await prisma.task.findMany({
    include: {
      engagement: {
        include: { client: true, serviceProduct: true },
      },
    },
    orderBy: [{ slaDeadline: "asc" }],
  });

  const priorityOrder: Record<string, number> = { urgent: 0, high: 1, medium: 2, low: 3 };
  const sorted = tasks.sort((a, b) => {
    if (a.status === "completed" && b.status !== "completed") return 1;
    if (a.status !== "completed" && b.status === "completed") return -1;
    const pa = priorityOrder[a.priority] ?? 99;
    const pb = priorityOrder[b.priority] ?? 99;
    if (pa !== pb) return pa - pb;
    return 0;
  });

  return <TasksClient tasks={JSON.parse(JSON.stringify(sorted))} />;
}
