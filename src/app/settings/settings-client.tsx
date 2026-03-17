"use client";

import { PageHeader } from "@/components/page-header";
import { timeAgo, getInitials } from "@/lib/utils";
import {
  Shield,
  Users,
  Lock,
  Eye,
  Database,
  FileText,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Server,
  Key,
} from "lucide-react";
import { useState } from "react";

interface Props {
  activityLogs: any[];
  stats: { clients: number; engagements: number; tasks: number };
  roles: any[];
}

export function SettingsClient({ activityLogs, stats, roles }: Props) {
  const [activeTab, setActiveTab] = useState("roles");

  const tabs = [
    { id: "roles", label: "Roles & Permissions", icon: Shield },
    { id: "tenancy", label: "Data Isolation", icon: Lock },
    { id: "audit", label: "Audit Trail", icon: Eye },
    { id: "system", label: "System", icon: Server },
  ];

  return (
    <div className="p-8 space-y-8">
      <PageHeader
        title="Settings"
        description="Security, tenancy, permissions, and system configuration"
      />

      <div className="flex items-center gap-1 rounded-xl border border-gray-200 bg-white p-1.5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-primary-600 text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "roles" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Role-Based Access Control
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Define who can access what across your operating system
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {roles.map((role: any) => (
              <div
                key={role.name}
                className="rounded-xl border border-gray-200 bg-white p-6"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${role.color}`}
                  >
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{role.name}</h3>
                    <p className="text-sm text-gray-500">{role.description}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {role.permissions.map((perm: string) => (
                    <span
                      key={perm}
                      className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700"
                    >
                      <Key className="h-3 w-3 text-gray-400" />
                      {perm}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "tenancy" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Multi-Tenant Data Isolation
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Strict client data separation with secure knowledge vaults
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
                <Lock className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="mt-4 font-semibold text-gray-900">
                Data Isolation
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Each client&apos;s data is strictly isolated. Engagements, deliverables,
                messages, and knowledge assets are scoped to their tenant.
              </p>
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                <CheckCircle2 className="h-4 w-4" />
                Active — {stats.clients} isolated tenants
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                <Database className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mt-4 font-semibold text-gray-900">
                Knowledge Vaults
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Secure per-client knowledge repositories. Brand guides, style docs,
                and reference materials are encrypted at rest.
              </p>
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-700">
                <CheckCircle2 className="h-4 w-4" />
                Encrypted & isolated per client
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="mt-4 font-semibold text-gray-900">
                Audit Compliance
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Every action is logged with timestamp, actor, and entity references.
                Full traceability for compliance and quality assurance.
              </p>
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-purple-50 px-3 py-2 text-sm text-purple-700">
                <CheckCircle2 className="h-4 w-4" />
                {activityLogs.length} events logged
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              Tenant Overview
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-lg bg-gray-50 p-4 text-center">
                <Users className="mx-auto h-6 w-6 text-gray-400" />
                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {stats.clients}
                </p>
                <p className="text-sm text-gray-500">Client Tenants</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4 text-center">
                <FileText className="mx-auto h-6 w-6 text-gray-400" />
                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {stats.engagements}
                </p>
                <p className="text-sm text-gray-500">Engagements</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4 text-center">
                <Activity className="mx-auto h-6 w-6 text-gray-400" />
                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {stats.tasks}
                </p>
                <p className="text-sm text-gray-500">Tasks</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "audit" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Activity Audit Trail
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Complete log of all system actions for compliance and debugging
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Action
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Entity
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Client
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Performed By
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Details
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {activityLogs.map((log: any) => (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {log.action.includes("completed") ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        ) : log.action.includes("escalat") ? (
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                        ) : (
                          <Zap className="h-4 w-4 text-primary-500" />
                        )}
                        <span className="text-sm font-medium text-gray-900">
                          {log.action.replace(/_/g, " ")}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                        {log.entity}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {log.client ? (
                        <div className="flex items-center gap-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-[10px] font-bold text-gray-600">
                            {getInitials(log.client.name)}
                          </div>
                          <span className="text-sm text-gray-700">
                            {log.client.name}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-gray-600 capitalize">
                        {log.performedBy}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="max-w-xs truncate text-sm text-gray-500">
                        {log.details}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-right text-sm text-gray-400">
                      {timeAgo(log.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "system" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              System Configuration
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Core operating system settings and integrations
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="font-semibold text-gray-900">AI Engine</h3>
              <p className="mt-1 text-sm text-gray-500">
                Configure AI production workflows and model settings
              </p>
              <div className="mt-4 space-y-3">
                {[
                  { label: "Default Model", value: "GPT-4o" },
                  { label: "Max Concurrent Workflows", value: "8" },
                  { label: "Quality Threshold", value: "7.5/10" },
                  { label: "Auto-Revision Limit", value: "3" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2"
                  >
                    <span className="text-sm text-gray-600">{item.label}</span>
                    <span className="text-sm font-medium text-gray-900">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="font-semibold text-gray-900">SLA Configuration</h3>
              <p className="mt-1 text-sm text-gray-500">
                Task deadlines and auto-escalation rules
              </p>
              <div className="mt-4 space-y-3">
                {[
                  { label: "Default SLA", value: "24 hours" },
                  { label: "Urgent SLA", value: "4 hours" },
                  { label: "Auto-Escalation", value: "Enabled" },
                  { label: "Client Follow-up", value: "After 48h" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2"
                  >
                    <span className="text-sm text-gray-600">{item.label}</span>
                    <span className="text-sm font-medium text-gray-900">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="font-semibold text-gray-900">Integrations</h3>
              <p className="mt-1 text-sm text-gray-500">
                Connected services and API keys
              </p>
              <div className="mt-4 space-y-3">
                {[
                  { name: "OpenAI", status: "Connected", color: "text-emerald-600" },
                  { name: "Stripe", status: "Connected", color: "text-emerald-600" },
                  { name: "Slack", status: "Connected", color: "text-emerald-600" },
                  { name: "Gmail", status: "Not configured", color: "text-gray-400" },
                ].map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2"
                  >
                    <span className="text-sm font-medium text-gray-700">
                      {item.name}
                    </span>
                    <span className={`text-sm font-medium ${item.color}`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="font-semibold text-gray-900">
                Capacity Planning
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Operator bandwidth and engagement limits
              </p>
              <div className="mt-4 space-y-3">
                {[
                  { label: "Max Active Engagements", value: "12" },
                  { label: "Max Clients", value: "20" },
                  { label: "Weekly Oversight Hours", value: "40h" },
                  { label: "AI Delegation Target", value: "85%" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2"
                  >
                    <span className="text-sm text-gray-600">{item.label}</span>
                    <span className="text-sm font-medium text-gray-900">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
