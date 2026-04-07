import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

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

export async function POST(request: NextRequest) {
  const body = await request.json();
  const task = await prisma.task.create({
    data: {
      engagementId: body.engagementId,
      title: body.title,
      description: body.description || "",
      status: body.status || "pending",
      priority: body.priority || "medium",
      assignedTo: body.assignedTo || "ai",
      slaDeadline: body.slaDeadline ? new Date(body.slaDeadline) : null,
    },
  });
  return NextResponse.json(task, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const task = await prisma.task.update({
    where: { id: body.id },
    data: {
      title: body.title,
      description: body.description,
      status: body.status,
      priority: body.priority,
      assignedTo: body.assignedTo,
      slaDeadline: body.slaDeadline ? new Date(body.slaDeadline) : null,
      completedAt: body.status === "completed" ? new Date() : null,
    },
  });
  return NextResponse.json(task);
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  await prisma.task.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
