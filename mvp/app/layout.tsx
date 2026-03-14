import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NB Connect — New Bedford Civic Intelligence Platform",
  description: "Proactively connecting New Bedford residents to every benefit, service, and program they qualify for.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-50 text-slate-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
