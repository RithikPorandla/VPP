"use client";

import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Modal } from "@/components/modal";
import { formatCurrency, getInitials, formatPercent } from "@/lib/utils";
import {
  Mail,
  Building2,
  AlertTriangle,
  TrendingUp,
  FileText,
  MessageSquare,
  Pencil,
  Trash2,
} from "lucide-react";
import { useState, useCallback } from "react";

interface Props {
  clients: any[];
}

const emptyClient = {
  name: "",
  contactName: "",
  contactEmail: "",
  industry: "",
  brandVoice: "",
  status: "active",
  tier: "standard",
};

export function ClientsClient({ clients: initial }: Props) {
  const [clients, setClients] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<any>(null);
  const [form, setForm] = useState(emptyClient);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const activeClients = clients.filter((c) => c.status === "active");
  const totalRevenue = clients.reduce((s, c) => s + (c.totalRevenue || 0), 0);

  const refreshClients = useCallback(async () => {
    const res = await fetch("/api/clients");
    const data = await res.json();
    setClients(data);
  }, []);

  const openAdd = () => {
    setEditingClient(null);
    setForm(emptyClient);
    setShowForm(true);
  };

  const openEdit = (client: any) => {
    setEditingClient(client);
    setForm({
      name: client.name,
      contactName: client.contactName,
      contactEmail: client.contactEmail,
      industry: client.industry,
      brandVoice: client.brandVoice || "",
      status: client.status,
      tier: client.tier,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingClient) {
        await fetch("/api/clients", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingClient.id, ...form }),
        });
      } else {
        await fetch("/api/clients", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }
      await refreshClients();
      setShowForm(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/clients?id=${id}`, { method: "DELETE" });
    await refreshClients();
    setDeleteConfirm(null);
  };

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-8 space-y-8">
      <PageHeader
        title="Clients"
        description={`${activeClients.length} active clients generating ${formatCurrency(totalRevenue)} total revenue`}
        actions={
          <button
            onClick={openAdd}
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700"
          >
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
                  {formatCurrency(client.totalRevenue || 0)}
                </p>
                <p className="text-xs text-gray-500">Revenue</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-emerald-600">
                  {formatPercent(client.grossMargin || 0)}
                </p>
                <p className="text-xs text-gray-500">Margin</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">
                  {client.activeEngagements || 0}
                </p>
                <p className="text-xs text-gray-500">Active</p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-4 border-t border-gray-100 pt-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                {client._count?.engagements || 0} engagements
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                {client._count?.messages || 0} messages
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                {client._count?.knowledgeAssets || 0} assets
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

            <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-4">
              <button
                onClick={() => openEdit(client)}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
              >
                <Pencil className="h-3 w-3" />
                Edit
              </button>
              <button
                onClick={() => setDeleteConfirm(client.id)}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
              >
                <Trash2 className="h-3 w-3" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={showForm}
        onClose={() => setShowForm(false)}
        title={editingClient ? "Edit Client" : "Add Client"}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Company Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="Acme Corp"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Industry</label>
              <input
                type="text"
                value={form.industry}
                onChange={(e) => updateField("industry", e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="Technology"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Name</label>
              <input
                type="text"
                value={form.contactName}
                onChange={(e) => updateField("contactName", e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Email</label>
              <input
                type="email"
                value={form.contactEmail}
                onChange={(e) => updateField("contactEmail", e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="jane@acme.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Brand Voice</label>
            <textarea
              value={form.brandVoice}
              onChange={(e) => updateField("brandVoice", e.target.value)}
              rows={2}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              placeholder="Professional yet approachable, data-driven..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                value={form.status}
                onChange={(e) => updateField("status", e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="churned">Churned</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tier</label>
              <select
                value={form.tier}
                onChange={(e) => updateField("tier", e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="standard">Standard</option>
                <option value="premium">Premium</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={() => setShowForm(false)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !form.name || !form.contactName || !form.contactEmail}
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : editingClient ? "Update Client" : "Create Client"}
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Client"
        size="sm"
      >
        <p className="text-sm text-gray-600">
          Are you sure you want to delete this client? This action cannot be undone and will remove all associated data.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => setDeleteConfirm(null)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}
