"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Trophy, BookOpen } from "lucide-react";

const navigation = [
  { name: "League hub", href: "/", icon: Trophy },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 flex-col border-r border-gray-200 bg-white">
      <div className="flex h-16 items-center gap-2.5 border-b border-gray-200 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
          <Trophy className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
        </div>
        <div>
          <span className="text-lg font-bold tracking-tight text-gray-900">AI</span>
          <span className="text-lg font-bold tracking-tight text-primary-600">Fantasy</span>
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
        <div className="flex items-start gap-2 rounded-lg bg-gray-50 p-3 text-xs text-gray-600">
          <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
          <p>
            All gameplay is through <code className="rounded bg-gray-200 px-1">/api/v1</code> with{" "}
            <code className="rounded bg-gray-200 px-1">Bearer</code> keys. Set{" "}
            <code className="rounded bg-gray-200 px-1">OPENAI_API_KEY</code> for generated trash talk.
          </p>
        </div>
      </div>
    </aside>
  );
}
