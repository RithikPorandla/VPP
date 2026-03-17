"use client";

import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { StatusBadge } from "@/components/status-badge";
import { formatCurrency, timeAgo, getInitials } from "@/lib/utils";
import {
  DollarSign,
  TrendingUp,
  Clock,
  Users,
  Star,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Zap,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  summary: any;
  metrics: any[];
  activeEngagements: any[];
  recentActivity: any[];
  recentMessages: any[];
}

export function DashboardClient({
  summary,
  metrics,
  activeEngagements,
  recentActivity,
  recentMessages,
}: Props) {
  const chartData = [...metrics].reverse().map((m: any) => ({
    period: m.period.slice(5),
    revenue: m.totalRevenue,
    margin: ((m.totalRevenue - m.totalCost) / m.totalRevenue) * 100,
    rph: m.revenuePerHumanHour,
  }));

  return (
    <div className="p-8 space-y-8">
      <PageHeader
        title="Command Center"
        description="Your AI-native service operating system at a glance"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Monthly Revenue"
          value={formatCurrency(summary.totalRevenue)}
          change={summary.revenueChange}
          changeLabel="vs last month"
          icon={<DollarSign className="h-5 w-5" />}
          accent
        />
        <StatCard
          label="Gross Margin"
          value={`${summary.grossMargin.toFixed(1)}%`}
          change={summary.marginChange}
          changeLabel="vs last month"
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <StatCard
          label="Revenue / Human Hour"
          value={formatCurrency(summary.revenuePerHumanHour)}
          change={summary.rphChange}
          changeLabel="vs last month"
          icon={<Zap className="h-5 w-5" />}
        />
        <StatCard
          label="Client Satisfaction"
          value={`${summary.avgSatisfaction}/10`}
          change={summary.satisfactionChange}
          changeLabel="vs last month"
          icon={<Star className="h-5 w-5" />}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Active Engagements"
          value={String(summary.activeEngagements)}
          icon={<Users className="h-5 w-5" />}
        />
        <StatCard
          label="Avg Revisions"
          value={summary.avgRevisions.toFixed(1)}
          change={summary.revisionChange}
          changeLabel="vs last month"
          icon={<RotateCcw className="h-5 w-5" />}
        />
        <StatCard
          label="Avg Turnaround"
          value={`${summary.avgTurnaround}h`}
          change={summary.turnaroundChange}
          changeLabel="vs last month"
          icon={<Clock className="h-5 w-5" />}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-base font-semibold text-gray-900">
            Revenue & Leverage Trend
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Monthly revenue and revenue per human hour
          </p>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorRph" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="period" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 12 }}
                  stroke="#9ca3af"
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 12 }}
                  stroke="#9ca3af"
                  tickFormatter={(v) => `$${v}`}
                />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    name === "revenue"
                      ? formatCurrency(value)
                      : `$${value.toFixed(0)}/hr`,
                    name === "revenue" ? "Revenue" : "Rev/Human Hour",
                  ]}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    fontSize: "13px",
                  }}
                />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fill="url(#colorRevenue)"
                />
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="rph"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#colorRph)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">
              Task Overview
            </h2>
            <Link
              href="/tasks"
              className="text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              View all
            </Link>
          </div>
          <div className="mt-5 space-y-3">
            {[
              {
                label: "Urgent",
                count: summary.tasksByStatus.urgent ?? 0,
                color: "bg-red-500",
                icon: AlertTriangle,
              },
              {
                label: "In Progress",
                count: summary.tasksByStatus.in_progress ?? 0,
                color: "bg-blue-500",
                icon: Clock,
              },
              {
                label: "Pending",
                count: summary.tasksByStatus.pending ?? 0,
                color: "bg-yellow-500",
                icon: Clock,
              },
              {
                label: "Blocked",
                count: summary.tasksByStatus.blocked ?? 0,
                color: "bg-red-400",
                icon: AlertTriangle,
              },
              {
                label: "Completed",
                count: summary.tasksByStatus.completed ?? 0,
                color: "bg-emerald-500",
                icon: CheckCircle2,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                  <span className="text-sm font-medium text-gray-700">
                    {item.label}
                  </span>
                </div>
                <span className="text-lg font-bold text-gray-900">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">
              Active Engagements
            </h2>
            <Link
              href="/engagements"
              className="flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {activeEngagements.slice(0, 5).map((eng: any) => {
              const daysLeft = Math.ceil(
                (new Date(eng.dueDate).getTime() - Date.now()) / 86400000
              );
              const isOverdue = daysLeft < 0;
              return (
                <div
                  key={eng.id}
                  className="flex items-center justify-between rounded-lg border border-gray-100 p-4 transition-colors hover:bg-gray-50"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
                        {getInitials(eng.client.name)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {eng.serviceProduct.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {eng.client.name}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={eng.status} />
                    <span
                      className={`text-xs font-medium ${
                        isOverdue
                          ? "text-red-600"
                          : daysLeft <= 1
                          ? "text-amber-600"
                          : "text-gray-500"
                      }`}
                    >
                      {isOverdue
                        ? `${Math.abs(daysLeft)}d overdue`
                        : `${daysLeft}d left`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">
              Recent Messages
            </h2>
            <Link
              href="/messages"
              className="flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {recentMessages.map((msg: any) => (
              <div
                key={msg.id}
                className="rounded-lg border border-gray-100 p-4 transition-colors hover:bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-600">
                      {getInitials(msg.client.contactName)}
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {msg.client.contactName}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {timeAgo(msg.createdAt)}
                  </span>
                </div>
                <p className="mt-2 text-sm font-medium text-gray-700">
                  {msg.subject}
                </p>
                <p className="mt-1 line-clamp-2 text-xs text-gray-500">
                  {msg.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">
            Activity Feed
          </h2>
        </div>
        <div className="mt-4 space-y-4">
          {recentActivity.map((log: any) => (
            <div key={log.id} className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-100">
                {log.action.includes("completed") ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                ) : log.action.includes("escalat") ? (
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                ) : (
                  <Zap className="h-4 w-4 text-primary-500" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-700">{log.details}</p>
                <div className="mt-1 flex items-center gap-2">
                  {log.client && (
                    <span className="text-xs font-medium text-gray-500">
                      {log.client.name}
                    </span>
                  )}
                  <span className="text-xs text-gray-400">
                    {timeAgo(log.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
