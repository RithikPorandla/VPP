import { prisma } from "@/lib/prisma";
import { EngagementsClient } from "./engagements-client";

export const dynamic = "force-dynamic";

export default async function EngagementsPage() {
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

  return <EngagementsClient engagements={JSON.parse(JSON.stringify(engagements))} />;
}
