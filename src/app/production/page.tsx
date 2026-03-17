import { prisma } from "@/lib/prisma";
import { ProductionClient } from "./production-client";

export const dynamic = "force-dynamic";

export default async function ProductionPage() {
  const workflows = await prisma.productionWorkflow.findMany({
    include: {
      engagement: {
        include: { client: true, serviceProduct: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return <ProductionClient workflows={JSON.parse(JSON.stringify(workflows))} />;
}
