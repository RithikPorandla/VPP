"use client";

import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { StatusBadge } from "@/components/status-badge";
import { getInitials } from "@/lib/utils";
import {
  TrendingUp,
  RotateCcw,
  Star,
  Clock,
  Layers,
  ArrowDown,
  ArrowUp,
  FileText,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

interface Props {
  deliverables: any[];
  metrics: any[];
  serviceImprovements: any[];
}

export function ImprovementsClient({
  deliverables,
  metrics,
  serviceImprovements,
}: Props) {
  const totalRevisions = deliverables.reduce(
    (sum, d) => sum + Math.max(0, d.currentVersion - 1),
    0
  );
  const allVersions = deliverables.flatMap((d) => d.versions);
  const scoredVersions = allVersions.filter((v: any) => v.qualityScore !== null);
  const avgQuality =
    scoredVersions.length > 0
      ? scoredVersions.reduce((s: number, v: any) => s + v.qualityScore, 0) /
        scoredVersions.length
      : 0;
  const firstDraftScores = deliverables
    .map((d) => d.versions.find((v: any) => v.versionNumber === 1))
    .filter((v) => v?.qualityScore)
    .map((v) => v.qualityScore);
  const avgFirstDraftQuality =
    firstDraftScores.length > 0
      ? firstDraftScores.reduce((a: number, b: number) => a + b, 0) / firstDraftScores.length
      : 0;

  const trendData = metrics.map((m: any) => ({
    period: m.period.slice(5),
    satisfaction: m.clientSatisfaction,
    revisions: m.avgRevisionCount,
    turnaround: m.avgTurnaroundHours,
  }));

  const serviceData = serviceImprovements.map((s: any) => ({
    name: s.name.length > 18 ? s.name.slice(0, 18) + "..." : s.name,
    quality: s.avgQuality,
    revisions: s.totalRevisions,
    engagements: s.engagementCount,
  }));

  return (
    <div className="p-8 space-y-8">
      <PageHeader
        title="Continuous Improvement"
        description="Track quality trends, revision patterns, and service optimization"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Avg Quality Score"
          value={avgQuality.toFixed(1)}
          icon={<Star className="h-5 w-5 text-amber-500" />}
        />
        <StatCard
          label="Total Revisions"
          value={String(totalRevisions)}
          icon={<RotateCcw className="h-5 w-5 text-blue-500" />}
        />
        <StatCard
          label="First Draft Quality"
          value={avgFirstDraftQuality.toFixed(1)}
          icon={<TrendingUp className="h-5 w-5 text-emerald-500" />}
        />
        <StatCard
          label="Deliverables Tracked"
          value={String(deliverables.length)}
          icon={<Layers className="h-5 w-5 text-primary-500" />}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-base font-semibold text-gray-900">
            Quality & Satisfaction Trend
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Client satisfaction and revision counts over time
          </p>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="period" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    fontSize: "13px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="satisfaction"
                  stroke="#6366f1"
                  strokeWidth={2}
                  name="Satisfaction"
                  dot={{ fill: "#6366f1" }}
                />
                <Line
                  type="monotone"
                  dataKey="revisions"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  name="Avg Revisions"
                  dot={{ fill: "#f59e0b" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-base font-semibold text-gray-900">
            Quality by Service
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Average quality score per service product
          </p>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={serviceData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 12 }} stroke="#9ca3af" domain={[0, 10]} />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  stroke="#9ca3af"
                  width={120}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    fontSize: "13px",
                  }}
                />
                <Bar dataKey="quality" fill="#6366f1" radius={[0, 4, 4, 0]} name="Quality" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">
          Turnaround Improvement
        </h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="period" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                  fontSize: "13px",
                }}
                formatter={(value: number) => [`${value}h`, "Turnaround"]}
              />
              <Bar dataKey="turnaround" fill="#10b981" radius={[4, 4, 0, 0]} name="Hours" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h2 className="text-base font-semibold text-gray-900 mb-4">
          Deliverable Version History
        </h2>
        <div className="space-y-4">
          {deliverables
            .filter((d) => d.versions.length > 1)
            .map((del) => (
              <div
                key={del.id}
                className="rounded-xl border border-gray-200 bg-white p-5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-100">
                      <FileText className="h-4 w-4 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{del.title}</h3>
                      <p className="text-sm text-gray-500">
                        {del.engagement.client.name} · {del.engagement.serviceProduct.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={del.status} />
                    <span className="text-sm font-medium text-gray-500">
                      v{del.currentVersion}
                    </span>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {del.versions.map((v: any) => {
                    const prevVersion = del.versions.find(
                      (pv: any) => pv.versionNumber === v.versionNumber - 1
                    );
                    const qualityDelta =
                      prevVersion?.qualityScore && v.qualityScore
                        ? v.qualityScore - prevVersion.qualityScore
                        : null;

                    return (
                      <div
                        key={v.id}
                        className="flex items-start gap-3 rounded-lg bg-gray-50 p-3"
                      >
                        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
                          {v.versionNumber}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-gray-500 capitalize">
                              {v.generatedBy}
                            </span>
                            {v.qualityScore && (
                              <span className="flex items-center gap-1 text-xs font-medium text-primary-600">
                                <Star className="h-3 w-3" />
                                {v.qualityScore}/10
                              </span>
                            )}
                            {qualityDelta !== null && (
                              <span
                                className={`flex items-center gap-0.5 text-xs font-medium ${
                                  qualityDelta > 0
                                    ? "text-emerald-600"
                                    : "text-red-600"
                                }`}
                              >
                                {qualityDelta > 0 ? (
                                  <ArrowUp className="h-3 w-3" />
                                ) : (
                                  <ArrowDown className="h-3 w-3" />
                                )}
                                {Math.abs(qualityDelta).toFixed(1)}
                              </span>
                            )}
                          </div>
                          {v.changeNotes && (
                            <p className="mt-1 text-sm text-gray-600">
                              {v.changeNotes}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
