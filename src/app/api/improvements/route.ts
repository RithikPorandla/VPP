import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const [deliverables, metrics, serviceProducts] = await Promise.all([
    prisma.deliverable.findMany({
      include: {
        versions: { orderBy: { versionNumber: "desc" } },
        engagement: {
          include: { client: true, serviceProduct: true },
        },
        approvals: true,
      },
    }),
    prisma.marginMetric.findMany({ orderBy: { period: "asc" } }),
    prisma.serviceProduct.findMany({
      include: {
        engagements: {
          include: { deliverables: { include: { versions: true } } },
        },
      },
    }),
  ]);

  const serviceImprovements = serviceProducts.map((sp) => {
    const allVersions = sp.engagements.flatMap((e) =>
      e.deliverables.flatMap((d) => d.versions)
    );
    const qualityScores = allVersions
      .filter((v) => v.qualityScore !== null)
      .map((v) => v.qualityScore!);
    const avgQuality =
      qualityScores.length > 0
        ? qualityScores.reduce((a, b) => a + b, 0) / qualityScores.length
        : 0;
    const totalRevisions = sp.engagements.reduce(
      (sum, e) =>
        sum +
        e.deliverables.reduce((s, d) => s + Math.max(0, d.currentVersion - 1), 0),
      0
    );

    return {
      id: sp.id,
      name: sp.name,
      category: sp.category,
      avgQuality,
      totalRevisions,
      engagementCount: sp.engagements.length,
      turnaroundHours: sp.turnaroundHours,
    };
  });

  return NextResponse.json({
    deliverables,
    metrics,
    serviceImprovements,
  });
}
