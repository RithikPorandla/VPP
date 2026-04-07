import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const engagements = await prisma.engagement.findMany({
    include: {
      client: true,
      serviceProduct: true,
      deliverables: {
        include: {
          versions: { orderBy: { versionNumber: "desc" }, take: 1 },
          approvals: true,
        },
      },
      tasks: true,
      workflows: true,
    },
    orderBy: { dueDate: "asc" },
  });

  return NextResponse.json(engagements);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const serviceProduct = await prisma.serviceProduct.findUnique({
    where: { id: body.serviceProductId },
  });

  const engagement = await prisma.engagement.create({
    data: {
      clientId: body.clientId,
      serviceProductId: body.serviceProductId,
      status: body.status || "proposal",
      dueDate: new Date(body.dueDate),
      totalRevenue: parseFloat(body.totalRevenue) || serviceProduct?.price || 0,
      totalCost: parseFloat(body.totalCost) || serviceProduct?.costEstimate || 0,
      notes: body.notes || "",
    },
  });
  return NextResponse.json(engagement, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const engagement = await prisma.engagement.update({
    where: { id: body.id },
    data: {
      status: body.status,
      dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
      totalRevenue: body.totalRevenue !== undefined ? parseFloat(body.totalRevenue) : undefined,
      totalCost: body.totalCost !== undefined ? parseFloat(body.totalCost) : undefined,
      notes: body.notes,
      completedAt: body.status === "completed" ? new Date() : undefined,
    },
  });
  return NextResponse.json(engagement);
}
