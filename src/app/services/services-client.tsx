"use client";

import { PageHeader } from "@/components/page-header";
import { formatCurrency, formatPercent } from "@/lib/utils";
import {
  Clock,
  DollarSign,
  Package,
  TrendingUp,
  Layers,
  Zap,
} from "lucide-react";

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

export function ServicesClient({ services }: Props) {
  return (
    <div className="p-8 space-y-8">
      <PageHeader
        title="Service Products"
        description="Productized service offerings with AI-powered delivery pipelines"
        actions={
          <button className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700">
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
                  <span>{svc._count.engagements} engagements</span>
                  <span>{svc.completedCount} completed</span>
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
