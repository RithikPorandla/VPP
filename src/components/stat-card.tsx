import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  accent?: boolean;
}

export function StatCard({
  label,
  value,
  change,
  changeLabel,
  icon,
  accent,
}: StatCardProps) {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;

  return (
    <div
      className={cn(
        "rounded-xl border p-5 transition-shadow hover:shadow-sm",
        accent
          ? "border-primary-200 bg-gradient-to-br from-primary-50 to-white"
          : "border-gray-200 bg-white"
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
      <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
        {value}
      </p>
      {change !== undefined && (
        <div className="mt-2 flex items-center gap-1.5">
          {isPositive && (
            <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
          )}
          {isNegative && (
            <TrendingDown className="h-3.5 w-3.5 text-red-500" />
          )}
          {!isPositive && !isNegative && (
            <Minus className="h-3.5 w-3.5 text-gray-400" />
          )}
          <span
            className={cn(
              "text-xs font-medium",
              isPositive && "text-emerald-600",
              isNegative && "text-red-600",
              !isPositive && !isNegative && "text-gray-500"
            )}
          >
            {isPositive ? "+" : ""}
            {change?.toFixed(1)}%
          </span>
          {changeLabel && (
            <span className="text-xs text-gray-400">{changeLabel}</span>
          )}
        </div>
      )}
    </div>
  );
}
