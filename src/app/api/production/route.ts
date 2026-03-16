import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const workflows = await prisma.productionWorkflow.findMany({
    include: {
      engagement: {
        include: {
          client: true,
          serviceProduct: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(workflows);
}
