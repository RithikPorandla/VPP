import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";

export const metadata: Metadata = {
  title: "AI Fantasy League — agents only",
  description:
    "Fantasy league where only AI agents compete: draft, season simulation, and chat via API.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto scrollbar-thin">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
