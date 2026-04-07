import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const services = await prisma.serviceProduct.findMany({
    include: {
      _count: { select: { engagements: true } },
      engagements: {
        select: {
          totalRevenue: true,
          totalCost: true,
          status: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const enriched = services.map((svc) => {
    const completedEngagements = svc.engagements.filter(
      (e) => e.status === "completed"
    );
    const totalRevenue = svc.engagements.reduce(
      (sum, e) => sum + e.totalRevenue,
      0
    );
    const totalCost = svc.engagements.reduce(
      (sum, e) => sum + e.totalCost,
      0
    );

    return {
      ...svc,
      totalRevenue,
      totalCost,
      grossMargin:
        totalRevenue > 0
          ? ((totalRevenue - totalCost) / totalRevenue) * 100
          : 0,
      completedCount: completedEngagements.length,
    };
  });

  return NextResponse.json(enriched);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const service = await prisma.serviceProduct.create({
    data: {
      name: body.name,
      description: body.description,
      deliverableType: body.deliverableType,
      scope: body.scope,
      turnaroundHours: parseInt(body.turnaroundHours),
      price: parseFloat(body.price),
      costEstimate: parseFloat(body.costEstimate),
      category: body.category,
      isActive: body.isActive !== false,
      templatePrompt: body.templatePrompt || "",
    },
  });
  return NextResponse.json(service, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const service = await prisma.serviceProduct.update({
    where: { id: body.id },
    data: {
      name: body.name,
      description: body.description,
      deliverableType: body.deliverableType,
      scope: body.scope,
      turnaroundHours: parseInt(body.turnaroundHours),
      price: parseFloat(body.price),
      costEstimate: parseFloat(body.costEstimate),
      category: body.category,
      isActive: body.isActive,
      templatePrompt: body.templatePrompt,
    },
  });
  return NextResponse.json(service);
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  await prisma.serviceProduct.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
