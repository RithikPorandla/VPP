"use client";

import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { StatCard } from "@/components/stat-card";
import { getInitials, timeAgo } from "@/lib/utils";
import { Cpu, Timer, DollarSign, Zap, Activity, Play } from "lucide-react";

interface Props {
  workflows: any[];
}

export function ProductionClient({ workflows }: Props) {
  const running = workflows.filter((w) => w.status === "running");
  const completed = workflows.filter((w) => w.status === "completed");
  const totalCost = workflows.reduce((s, w) => s + w.cost, 0);
  const avgDuration =
    completed.length > 0
      ? completed.reduce((s, w) => s + (w.duration || 0), 0) / completed.length
      : 0;

  const typeGroups = workflows.reduce(
    (acc: Record<string, { count: number; cost: number; avgDuration: number }>, w) => {
      if (!acc[w.type]) acc[w.type] = { count: 0, cost: 0, avgDuration: 0 };
      acc[w.type].count++;
      acc[w.type].cost += w.cost;
      if (w.duration) acc[w.type].avgDuration += w.duration;
      return acc;
    },
    {}
  );

  return (
    <div className="p-8 space-y-8">
      <PageHeader
        title="AI Production Engine"
        description="Monitor and manage AI-powered production workflows"
        actions={
          <button className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700">
            <Play className="h-4 w-4" />
            New Workflow
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Active Workflows"
          value={String(running.length)}
          icon={<Activity className="h-5 w-5 text-blue-500" />}
        />
        <StatCard
          label="Completed"
          value={String(completed.length)}
          icon={<Cpu className="h-5 w-5 text-emerald-500" />}
        />
        <StatCard
          label="Total AI Cost"
          value={`$${totalCost.toFixed(2)}`}
          icon={<DollarSign className="h-5 w-5 text-amber-500" />}
        />
        <StatCard
          label="Avg Duration"
          value={`${Math.round(avgDuration)}s`}
          icon={<Timer className="h-5 w-5 text-primary-500" />}
        />
      </div>

      {running.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            <span className="inline-flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-blue-500" />
              </span>
              Running Now
            </span>
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {running.map((wf) => (
              <div
                key={wf.id}
                className="rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white p-5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                      <Cpu className="h-5 w-5 text-blue-600 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{wf.name}</h3>
                      <p className="text-sm text-gray-500">
                        {wf.engagement.client.name} · {wf.engagement.serviceProduct.name}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status="running" size="md" />
                </div>
                <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                  <span>Type: {wf.type.replace(/_/g, " ")}</span>
                  <span>Cost: ${wf.cost.toFixed(2)}</span>
                  <span>Started: {timeAgo(wf.createdAt)}</span>
                </div>
                <div className="mt-3 h-1.5 w-full rounded-full bg-blue-100 overflow-hidden">
                  <div className="h-1.5 rounded-full bg-blue-500 animate-pulse" style={{ width: "65%" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-base font-semibold text-gray-900 mb-4">
          Workflow History
        </h2>
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Workflow
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Client
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Type
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Duration
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Cost
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {workflows
                .filter((w) => w.status !== "running")
                .map((wf) => (
                  <tr key={wf.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Zap className="h-4 w-4 text-primary-400" />
                        <span className="text-sm font-medium text-gray-900">
                          {wf.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-600">
                          {getInitials(wf.engagement.client.name)}
                        </div>
                        <span className="text-sm text-gray-700">
                          {wf.engagement.client.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500">
                      {wf.type.replace(/_/g, " ")}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={wf.status} />
                    </td>
                    <td className="px-5 py-4 text-right text-sm text-gray-500">
                      {wf.duration ? `${wf.duration}s` : "—"}
                    </td>
                    <td className="px-5 py-4 text-right text-sm font-medium text-gray-900">
                      ${wf.cost.toFixed(2)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="text-base font-semibold text-gray-900 mb-4">
          Workflows by Type
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(typeGroups).map(([type, data]) => (
            <div
              key={type}
              className="rounded-xl border border-gray-200 bg-white p-5"
            >
              <h3 className="text-sm font-semibold text-gray-900 capitalize">
                {type.replace(/_/g, " ")}
              </h3>
              <div className="mt-3 grid grid-cols-3 gap-3">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{data.count}</p>
                  <p className="text-xs text-gray-500">Runs</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    ${data.cost.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">Total Cost</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    ${(data.cost / data.count).toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">Avg Cost</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
