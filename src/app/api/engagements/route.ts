import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

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
