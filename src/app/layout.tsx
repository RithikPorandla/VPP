import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { SessionProvider } from "@/components/session-provider";

export const metadata: Metadata = {
  title: "AgentOS — AI Service Operating System",
  description:
    "Infrastructure for AI-native service companies with software-like margins",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <SessionProvider>
          <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto scrollbar-thin">
              {children}
            </main>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
