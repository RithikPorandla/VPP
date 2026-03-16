import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const tasks = await prisma.task.findMany({
    include: {
      engagement: {
        include: {
          client: true,
          serviceProduct: true,
        },
      },
    },
    orderBy: [{ priority: "asc" }, { slaDeadline: "asc" }],
  });

  const priorityOrder: Record<string, number> = {
    urgent: 0,
    high: 1,
    medium: 2,
    low: 3,
  };

  const sorted = tasks.sort((a, b) => {
    const pa = priorityOrder[a.priority] ?? 99;
    const pb = priorityOrder[b.priority] ?? 99;
    if (pa !== pb) return pa - pb;
    if (a.slaDeadline && b.slaDeadline)
      return new Date(a.slaDeadline).getTime() - new Date(b.slaDeadline).getTime();
    return 0;
  });

  return NextResponse.json(sorted);
}
