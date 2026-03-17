"use client";

import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { formatCurrency, getInitials, formatPercent } from "@/lib/utils";
import {
  Mail,
  Building2,
  AlertTriangle,
  TrendingUp,
  FileText,
  MessageSquare,
} from "lucide-react";

interface Props {
  clients: any[];
}

export function ClientsClient({ clients }: Props) {
  const activeClients = clients.filter((c) => c.status === "active");
  const totalRevenue = clients.reduce((s, c) => s + c.totalRevenue, 0);

  return (
    <div className="p-8 space-y-8">
      <PageHeader
        title="Clients"
        description={`${activeClients.length} active clients generating ${formatCurrency(totalRevenue)} total revenue`}
        actions={
          <button className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700">
            Add Client
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {clients.map((client) => (
          <div
            key={client.id}
            className="group rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-primary-200 hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-sm font-bold text-primary-700">
                  {getInitials(client.name)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{client.name}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Building2 className="h-3 w-3" />
                    {client.industry}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={client.status} />
                <StatusBadge status={client.tier} />
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
              <Mail className="h-3.5 w-3.5 text-gray-400" />
              <span>{client.contactName}</span>
              <span className="text-gray-300">·</span>
              <span className="text-gray-400">{client.contactEmail}</span>
            </div>

            {client.churnRisk > 0.2 && (
              <div className="mt-3 flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <span className="text-xs font-medium text-amber-700">
                  Churn Risk: {(client.churnRisk * 100).toFixed(0)}%
                </span>
              </div>
            )}

            <div className="mt-4 grid grid-cols-3 gap-3 border-t border-gray-100 pt-4">
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">
                  {formatCurrency(client.totalRevenue)}
                </p>
                <p className="text-xs text-gray-500">Revenue</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-emerald-600">
                  {formatPercent(client.grossMargin)}
                </p>
                <p className="text-xs text-gray-500">Margin</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">
                  {client.activeEngagements}
                </p>
                <p className="text-xs text-gray-500">Active</p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-4 border-t border-gray-100 pt-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                {client._count.engagements} engagements
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                {client._count.messages} messages
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                {client._count.knowledgeAssets} assets
              </div>
            </div>

            {client.brandVoice && (
              <div className="mt-3 rounded-lg bg-gray-50 px-3 py-2">
                <p className="text-xs text-gray-500">
                  <span className="font-medium text-gray-600">Voice:</span>{" "}
                  {client.brandVoice}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
