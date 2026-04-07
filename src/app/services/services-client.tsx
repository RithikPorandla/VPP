"use client";

import { PageHeader } from "@/components/page-header";
import { Modal } from "@/components/modal";
import { formatCurrency, formatPercent } from "@/lib/utils";
import {
  Clock,
  DollarSign,
  Package,
  TrendingUp,
  Layers,
  Zap,
  Pencil,
  Trash2,
} from "lucide-react";
import { useState, useCallback } from "react";

interface Props {
  services: any[];
}

const categoryIcons: Record<string, typeof Package> = {
  Branding: Layers,
  Marketing: TrendingUp,
  Content: Package,
  Strategy: Zap,
  Legal: Package,
};

const categoryColors: Record<string, string> = {
  Branding: "bg-purple-100 text-purple-700",
  Marketing: "bg-blue-100 text-blue-700",
  Content: "bg-emerald-100 text-emerald-700",
  Strategy: "bg-amber-100 text-amber-700",
  Legal: "bg-gray-100 text-gray-700",
};

const emptyService = {
  name: "",
  description: "",
  deliverableType: "",
  scope: "",
  turnaroundHours: "24",
  price: "",
  costEstimate: "",
  category: "Marketing",
  templatePrompt: "",
};

export function ServicesClient({ services: initial }: Props) {
  const [services, setServices] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [editingSvc, setEditingSvc] = useState<any>(null);
  const [form, setForm] = useState(emptyService);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const refreshServices = useCallback(async () => {
    const res = await fetch("/api/services");
    setServices(await res.json());
  }, []);

  const openAdd = () => {
    setEditingSvc(null);
    setForm(emptyService);
    setShowForm(true);
  };

  const openEdit = (svc: any) => {
    setEditingSvc(svc);
    setForm({
      name: svc.name,
      description: svc.description,
      deliverableType: svc.deliverableType,
      scope: svc.scope,
      turnaroundHours: String(svc.turnaroundHours),
      price: String(svc.price),
      costEstimate: String(svc.costEstimate),
      category: svc.category,
      templatePrompt: svc.templatePrompt || "",
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingSvc) {
        await fetch("/api/services", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingSvc.id, ...form }),
        });
      } else {
        await fetch("/api/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }
      await refreshServices();
      setShowForm(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/services?id=${id}`, { method: "DELETE" });
    await refreshServices();
    setDeleteConfirm(null);
  };

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-8 space-y-8">
      <PageHeader
        title="Service Products"
        description="Productized service offerings with AI-powered delivery pipelines"
        actions={
          <button
            onClick={openAdd}
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700"
          >
            New Service
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {services.map((svc) => {
          const Icon = categoryIcons[svc.category] || Package;
          const margin = svc.price > 0 ? ((svc.price - svc.costEstimate) / svc.price) * 100 : 0;

          return (
            <div
              key={svc.id}
              className="group rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-primary-200 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                      categoryColors[svc.category] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{svc.name}</h3>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        categoryColors[svc.category] || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {svc.category}
                    </span>
                  </div>
                </div>
              </div>

              <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                {svc.description}
              </p>

              <div className="mt-4 rounded-lg bg-gray-50 p-3">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Scope
                </p>
                <p className="mt-1 text-sm text-gray-700">{svc.scope}</p>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="rounded-lg border border-gray-100 p-3 text-center">
                  <DollarSign className="mx-auto h-4 w-4 text-gray-400" />
                  <p className="mt-1 text-lg font-bold text-gray-900">
                    {formatCurrency(svc.price)}
                  </p>
                  <p className="text-xs text-gray-500">Price</p>
                </div>
                <div className="rounded-lg border border-gray-100 p-3 text-center">
                  <Clock className="mx-auto h-4 w-4 text-gray-400" />
                  <p className="mt-1 text-lg font-bold text-gray-900">
                    {svc.turnaroundHours}h
                  </p>
                  <p className="text-xs text-gray-500">Turnaround</p>
                </div>
                <div className="rounded-lg border border-gray-100 p-3 text-center">
                  <TrendingUp className="mx-auto h-4 w-4 text-gray-400" />
                  <p className="mt-1 text-lg font-bold text-emerald-600">
                    {formatPercent(margin)}
                  </p>
                  <p className="text-xs text-gray-500">Unit Margin</p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>{svc._count?.engagements || 0} engagements</span>
                  <span>{svc.completedCount || 0} completed</span>
                </div>
                {svc.totalRevenue > 0 && (
                  <span className="text-xs font-medium text-emerald-600">
                    {formatCurrency(svc.totalRevenue)} earned
                  </span>
                )}
              </div>

              <div className="mt-3 rounded-lg bg-primary-50 p-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-primary-700">
                    AI Production Cost
                  </span>
                  <span className="font-bold text-primary-700">
                    {formatCurrency(svc.costEstimate)}
                  </span>
                </div>
                <div className="mt-2 h-1.5 w-full rounded-full bg-primary-200">
                  <div
                    className="h-1.5 rounded-full bg-primary-600"
                    style={{
                      width: `${Math.min(100, (svc.costEstimate / svc.price) * 100)}%`,
                    }}
                  />
                </div>
                <p className="mt-1 text-right text-xs text-primary-500">
                  {((svc.costEstimate / svc.price) * 100).toFixed(1)}% of price
                </p>
              </div>

              <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-4">
                <button
                  onClick={() => openEdit(svc)}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
                >
                  <Pencil className="h-3 w-3" />
                  Edit
                </button>
                <button
                  onClick={() => setDeleteConfirm(svc.id)}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3" />
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <Modal
        open={showForm}
        onClose={() => setShowForm(false)}
        title={editingSvc ? "Edit Service" : "New Service"}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                value={form.category}
                onChange={(e) => updateField("category", e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option>Marketing</option>
                <option>Branding</option>
                <option>Content</option>
                <option>Strategy</option>
                <option>Legal</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              rows={2}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Deliverable Type</label>
              <input
                type="text"
                value={form.deliverableType}
                onChange={(e) => updateField("deliverableType", e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="e.g., PDF, website, document"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Turnaround (hours)</label>
              <input
                type="number"
                value={form.turnaroundHours}
                onChange={(e) => updateField("turnaroundHours", e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Scope</label>
            <input
              type="text"
              value={form.scope}
              onChange={(e) => updateField("scope", e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              placeholder="What's included..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Price ($)</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => updateField("price", e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">AI Cost Estimate ($)</label>
              <input
                type="number"
                value={form.costEstimate}
                onChange={(e) => updateField("costEstimate", e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">AI Template Prompt</label>
            <textarea
              value={form.templatePrompt}
              onChange={(e) => updateField("templatePrompt", e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              placeholder="Prompt template for AI generation..."
            />
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
              disabled={saving || !form.name || !form.price}
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : editingSvc ? "Update Service" : "Create Service"}
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Service"
        size="sm"
      >
        <p className="text-sm text-gray-600">
          Are you sure you want to delete this service? This cannot be undone.
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
