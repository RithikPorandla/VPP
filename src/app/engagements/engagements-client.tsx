"use client";

import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { formatCurrency, getInitials, formatPercent, timeAgo } from "@/lib/utils";
import {
  Calendar,
  FileText,
  CheckCircle2,
  Clock,
  Cpu,
  ChevronDown,
  ChevronUp,
  DollarSign,
} from "lucide-react";
import { useState } from "react";

interface Props {
  engagements: any[];
}

export function EngagementsClient({ engagements }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const filtered =
    filter === "all"
      ? engagements
      : engagements.filter((e) => e.status === filter);

  const statusCounts = engagements.reduce(
    (acc: Record<string, number>, e) => {
      acc[e.status] = (acc[e.status] || 0) + 1;
      return acc;
    },
    {}
  );

  return (
    <div className="p-8 space-y-8">
      <PageHeader
        title="Engagements"
        description="Track all client engagements from proposal to completion"
        actions={
          <button className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700">
            New Engagement
          </button>
        }
      />

      <div className="flex items-center gap-2">
        {["all", "proposal", "active", "in_review", "completed", "cancelled"].map(
          (status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                filter === status
                  ? "bg-primary-100 text-primary-700"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {status === "all" ? "All" : status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              {status !== "all" && statusCounts[status] ? (
                <span className="ml-1.5 text-xs opacity-70">
                  ({statusCounts[status]})
                </span>
              ) : null}
            </button>
          )
        )}
      </div>

      <div className="space-y-4">
        {filtered.map((eng) => {
          const isExpanded = expandedId === eng.id;
          const daysLeft = Math.ceil(
            (new Date(eng.dueDate).getTime() - Date.now()) / 86400000
          );
          const isOverdue = daysLeft < 0 && eng.status !== "completed";
          const margin =
            eng.totalRevenue > 0
              ? ((eng.totalRevenue - eng.totalCost) / eng.totalRevenue) * 100
              : 0;

          return (
            <div
              key={eng.id}
              className="rounded-xl border border-gray-200 bg-white transition-all hover:border-primary-200"
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : eng.id)}
                className="flex w-full items-center justify-between p-5 text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-100 text-sm font-bold text-primary-700">
                    {getInitials(eng.client.name)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">
                        {eng.serviceProduct.name}
                      </h3>
                      <StatusBadge status={eng.status} />
                    </div>
                    <p className="mt-0.5 text-sm text-gray-500">
                      {eng.client.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="hidden items-center gap-4 text-sm sm:flex">
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <DollarSign className="h-3.5 w-3.5" />
                      {formatCurrency(eng.totalRevenue)}
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-600">
                      {formatPercent(margin)} margin
                    </div>
                    <div
                      className={`flex items-center gap-1.5 ${
                        isOverdue ? "text-red-600" : "text-gray-500"
                      }`}
                    >
                      <Calendar className="h-3.5 w-3.5" />
                      {isOverdue
                        ? `${Math.abs(daysLeft)}d overdue`
                        : eng.status === "completed"
                        ? "Completed"
                        : `${daysLeft}d left`}
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-gray-100 p-5 space-y-5">
                  {eng.notes && (
                    <p className="text-sm text-gray-600 italic">{eng.notes}</p>
                  )}

                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div className="rounded-lg bg-gray-50 p-3">
                      <p className="text-xs text-gray-500">Revenue</p>
                      <p className="mt-1 text-lg font-bold">
                        {formatCurrency(eng.totalRevenue)}
                      </p>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-3">
                      <p className="text-xs text-gray-500">AI Cost</p>
                      <p className="mt-1 text-lg font-bold">
                        {formatCurrency(eng.totalCost)}
                      </p>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-3">
                      <p className="text-xs text-gray-500">Gross Margin</p>
                      <p className="mt-1 text-lg font-bold text-emerald-600">
                        {formatPercent(margin)}
                      </p>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-3">
                      <p className="text-xs text-gray-500">Deliverables</p>
                      <p className="mt-1 text-lg font-bold">
                        {eng.deliverables.length}
                      </p>
                    </div>
                  </div>

                  {eng.deliverables.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">
                        Deliverables
                      </h4>
                      <div className="space-y-2">
                        {eng.deliverables.map((del: any) => (
                          <div
                            key={del.id}
                            className="flex items-center justify-between rounded-lg border border-gray-100 p-3"
                          >
                            <div className="flex items-center gap-3">
                              <FileText className="h-4 w-4 text-gray-400" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {del.title}
                                </p>
                                <p className="text-xs text-gray-500">
                                  v{del.currentVersion} · {del.type}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <StatusBadge status={del.status} />
                              {del.versions[0]?.qualityScore && (
                                <span className="text-xs font-medium text-primary-600">
                                  {del.versions[0].qualityScore}/10
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {eng.workflows.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">
                        AI Workflows
                      </h4>
                      <div className="space-y-2">
                        {eng.workflows.map((wf: any) => (
                          <div
                            key={wf.id}
                            className="flex items-center justify-between rounded-lg border border-gray-100 p-3"
                          >
                            <div className="flex items-center gap-3">
                              <Cpu className="h-4 w-4 text-primary-500" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {wf.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {wf.type} · Cost: ${wf.cost.toFixed(2)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <StatusBadge status={wf.status} />
                              {wf.duration && (
                                <span className="text-xs text-gray-500">
                                  {wf.duration}s
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {eng.tasks.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">
                        Tasks
                      </h4>
                      <div className="space-y-2">
                        {eng.tasks.map((task: any) => (
                          <div
                            key={task.id}
                            className="flex items-center justify-between rounded-lg border border-gray-100 p-3"
                          >
                            <div className="flex items-center gap-3">
                              {task.status === "completed" ? (
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                              ) : (
                                <Clock className="h-4 w-4 text-gray-400" />
                              )}
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {task.title}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Assigned: {task.assignedTo}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <StatusBadge status={task.priority} />
                              <StatusBadge status={task.status} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
