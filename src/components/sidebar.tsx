"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Package,
  Briefcase,
  Cpu,
  ListChecks,
  MessageSquare,
  TrendingUp,
  Settings,
  Zap,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Clients", href: "/clients", icon: Users },
  { name: "Services", href: "/services", icon: Package },
  { name: "Engagements", href: "/engagements", icon: Briefcase },
  { name: "Production", href: "/production", icon: Cpu },
  { name: "Tasks", href: "/tasks", icon: ListChecks },
  { name: "Messages", href: "/messages", icon: MessageSquare },
  { name: "Improvements", href: "/improvements", icon: TrendingUp },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 flex-col border-r border-gray-200 bg-white">
      <div className="flex h-16 items-center gap-2.5 border-b border-gray-200 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
          <Zap className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
        </div>
        <div>
          <span className="text-lg font-bold tracking-tight text-gray-900">
            Agent
          </span>
          <span className="text-lg font-bold tracking-tight text-primary-600">
            OS
          </span>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 px-3 py-4">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary-50 text-primary-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon
                className={cn(
                  "h-[18px] w-[18px]",
                  isActive ? "text-primary-600" : "text-gray-400"
                )}
                strokeWidth={isActive ? 2 : 1.75}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-200 p-4">
        <div className="rounded-lg bg-gradient-to-br from-primary-50 to-primary-100 p-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
              JD
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-900">
                Jordan Davis
              </p>
              <p className="text-xs text-primary-600">Founder &amp; Operator</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
