"use client";

import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { StatCard } from "@/components/stat-card";
import { getInitials, timeAgo } from "@/lib/utils";
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  User,
  Cpu,
  Wrench,
  Timer,
} from "lucide-react";
import { useState } from "react";

interface Props {
  tasks: any[];
}

export function TasksClient({ tasks }: Props) {
  const [filter, setFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");

  const filtered = tasks
    .filter((t) => filter === "all" || t.status === filter)
    .filter((t) => assigneeFilter === "all" || t.assignedTo === assigneeFilter);

  const urgentCount = tasks.filter(
    (t) => t.priority === "urgent" && t.status !== "completed"
  ).length;
  const overdueCount = tasks.filter(
    (t) =>
      t.slaDeadline &&
      new Date(t.slaDeadline) < new Date() &&
      t.status !== "completed"
  ).length;
  const escalatedCount = tasks.filter((t) => t.autoEscalated).length;

  const capacityUsed = tasks.filter(
    (t) => t.status === "in_progress" || t.status === "pending"
  ).length;
  const maxCapacity = 12;

  const getAssigneeIcon = (assignee: string) => {
    switch (assignee) {
      case "ai":
        return <Cpu className="h-3.5 w-3.5 text-primary-500" />;
      case "operator":
        return <User className="h-3.5 w-3.5 text-blue-500" />;
      case "contractor":
        return <Wrench className="h-3.5 w-3.5 text-amber-500" />;
      default:
        return <User className="h-3.5 w-3.5 text-gray-400" />;
    }
  };

  return (
    <div className="p-8 space-y-8">
      <PageHeader
        title="Task Board"
        description="SLA-tracked tasks with auto-escalation and smart prioritization"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Urgent Tasks"
          value={String(urgentCount)}
          icon={<AlertTriangle className="h-5 w-5 text-red-500" />}
        />
        <StatCard
          label="Overdue (SLA breach)"
          value={String(overdueCount)}
          icon={<Timer className="h-5 w-5 text-red-500" />}
        />
        <StatCard
          label="Auto-Escalated"
          value={String(escalatedCount)}
          icon={<AlertTriangle className="h-5 w-5 text-amber-500" />}
        />
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm font-medium text-gray-500">Capacity Load</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {capacityUsed}/{maxCapacity}
          </p>
          <div className="mt-3 h-2 w-full rounded-full bg-gray-100">
            <div
              className={`h-2 rounded-full transition-all ${
                capacityUsed / maxCapacity > 0.8
                  ? "bg-red-500"
                  : capacityUsed / maxCapacity > 0.6
                  ? "bg-amber-500"
                  : "bg-emerald-500"
              }`}
              style={{
                width: `${Math.min(100, (capacityUsed / maxCapacity) * 100)}%`,
              }}
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            {maxCapacity - capacityUsed} slots available
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-500">Status:</span>
          {["all", "pending", "in_progress", "blocked", "completed"].map(
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
                {status === "all"
                  ? "All"
                  : status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              </button>
            )
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-500">Assignee:</span>
          {["all", "ai", "operator", "contractor"].map((assignee) => (
            <button
              key={assignee}
              onClick={() => setAssigneeFilter(assignee)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                assigneeFilter === assignee
                  ? "bg-primary-100 text-primary-700"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {assignee !== "all" && getAssigneeIcon(assignee)}
              {assignee === "all"
                ? "All"
                : assignee.charAt(0).toUpperCase() + assignee.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((task) => {
          const isOverdue =
            task.slaDeadline &&
            new Date(task.slaDeadline) < new Date() &&
            task.status !== "completed";
          const slaTime = task.slaDeadline
            ? new Date(task.slaDeadline)
            : null;
          const hoursLeft = slaTime
            ? (slaTime.getTime() - Date.now()) / 3600000
            : null;

          return (
            <div
              key={task.id}
              className={`rounded-xl border p-5 transition-all hover:shadow-sm ${
                task.autoEscalated
                  ? "border-amber-200 bg-amber-50/50"
                  : isOverdue
                  ? "border-red-200 bg-red-50/30"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="mt-0.5">
                    {task.status === "completed" ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    ) : task.status === "blocked" ? (
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                    ) : (
                      <Clock className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">
                        {task.title}
                      </h3>
                      {task.autoEscalated && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                          <AlertTriangle className="h-3 w-3" />
                          Auto-escalated
                        </span>
                      )}
                    </div>
                    {task.description && (
                      <p className="mt-1 text-sm text-gray-500">
                        {task.description}
                      </p>
                    )}
                    <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-[10px] font-bold text-gray-600">
                          {getInitials(task.engagement.client.name)}
                        </div>
                        {task.engagement.client.name}
                      </div>
                      <span className="text-gray-300">·</span>
                      <span>{task.engagement.serviceProduct.name}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-sm">
                    {getAssigneeIcon(task.assignedTo)}
                    <span className="text-xs font-medium text-gray-600 capitalize">
                      {task.assignedTo}
                    </span>
                  </div>
                  <StatusBadge status={task.priority} />
                  <StatusBadge status={task.status} />
                </div>
              </div>

              {slaTime && task.status !== "completed" && (
                <div className="mt-3 flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2">
                  <Timer className="h-3.5 w-3.5 text-gray-400" />
                  <span
                    className={`text-xs font-medium ${
                      isOverdue
                        ? "text-red-600"
                        : hoursLeft !== null && hoursLeft < 4
                        ? "text-amber-600"
                        : "text-gray-600"
                    }`}
                  >
                    SLA:{" "}
                    {isOverdue
                      ? `Breached ${timeAgo(task.slaDeadline)}`
                      : hoursLeft !== null && hoursLeft < 1
                      ? `${Math.round(hoursLeft * 60)}m remaining`
                      : hoursLeft !== null && hoursLeft < 24
                      ? `${Math.round(hoursLeft)}h remaining`
                      : `Due ${new Date(task.slaDeadline).toLocaleDateString()}`}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
