import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const clients = await prisma.client.findMany({
    include: {
      engagements: {
        include: { serviceProduct: true },
      },
      invoices: true,
      _count: {
        select: {
          messages: true,
          knowledgeAssets: true,
          engagements: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const enriched = clients.map((client) => {
    const totalRevenue = client.engagements.reduce(
      (sum, e) => sum + e.totalRevenue,
      0
    );
    const totalCost = client.engagements.reduce(
      (sum, e) => sum + e.totalCost,
      0
    );
    const activeEngagements = client.engagements.filter(
      (e) => e.status === "active" || e.status === "in_review"
    ).length;
    const paidInvoices = client.invoices
      .filter((i) => i.status === "paid")
      .reduce((sum, i) => sum + i.amount, 0);

    return {
      ...client,
      totalRevenue,
      totalCost,
      grossMargin: totalRevenue > 0 ? ((totalRevenue - totalCost) / totalRevenue) * 100 : 0,
      activeEngagements,
      paidInvoices,
    };
  });

  return NextResponse.json(enriched);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const client = await prisma.client.create({
    data: {
      name: body.name,
      contactName: body.contactName,
      contactEmail: body.contactEmail,
      industry: body.industry,
      brandVoice: body.brandVoice || "",
      status: body.status || "active",
      tier: body.tier || "standard",
      churnRisk: body.churnRisk || 0,
    },
  });
  return NextResponse.json(client, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const client = await prisma.client.update({
    where: { id: body.id },
    data: {
      name: body.name,
      contactName: body.contactName,
      contactEmail: body.contactEmail,
      industry: body.industry,
      brandVoice: body.brandVoice,
      status: body.status,
      tier: body.tier,
      churnRisk: body.churnRisk,
    },
  });
  return NextResponse.json(client);
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  await prisma.client.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
