"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend,
} from "recharts";
import {
  NEIGHBORHOOD_DATA, PROGRAM_ENROLLMENT_DATA, LANGUAGE_DATA,
  CHANNEL_EFFECTIVENESS, MONTHLY_ENROLLMENTS, UPCOMING_OUTREACH,
} from "@/lib/mock-data";

const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
const fmtK = (n: number) => n >= 1000 ? `$${(n / 1000).toFixed(0)}K` : `$${n}`;
const fmtNum = (n: number) => new Intl.NumberFormat("en-US").format(n);

const totalGapDollars = NEIGHBORHOOD_DATA.reduce((s, n) => s + n.gapDollars, 0);
const totalGapHouseholds = NEIGHBORHOOD_DATA.reduce((s, n) => s + n.gap, 0);
const totalEnrolled = NEIGHBORHOOD_DATA.reduce((s, n) => s + n.enrolled, 0);
const totalEligible = NEIGHBORHOOD_DATA.reduce((s, n) => s + n.estimatedEligible, 0);
const enrollmentRate = Math.round((totalEnrolled / totalEligible) * 100);

const latestMonth = MONTHLY_ENROLLMENTS[MONTHLY_ENROLLMENTS.length - 1];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "neighborhoods" | "outreach">("overview");
  const sortedNeighborhoods = [...NEIGHBORHOOD_DATA].sort((a, b) => b.gapDollars - a.gapDollars);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center text-sm font-bold">NB</div>
            <div>
              <div className="font-semibold text-sm">NB Connect</div>
              <div className="text-xs text-slate-400">City Intelligence Dashboard</div>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <div className="text-xs text-slate-400 hidden md:block">Data as of March 2026 (demo)</div>
            <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-xs">CM</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 flex gap-1">
          {[
            { key: "overview", label: "Overview" },
            { key: "neighborhoods", label: "Neighborhoods" },
            { key: "outreach", label: "Outreach & Channels" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`px-5 py-3.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? "border-indigo-600 text-indigo-700"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <KPICard label="Unclaimed Benefits (Annual)" value={fmt(totalGapDollars)} sub="Federal & state dollars not reaching residents" color="red" />
              <KPICard label="Enrollment Gap" value={fmtNum(totalGapHouseholds)} sub={`${fmtNum(totalEnrolled)} enrolled of ${fmtNum(totalEligible)} eligible (${enrollmentRate}%)`} color="amber" />
              <KPICard label="YTD Enrollments (Projected)" value={fmtNum(latestMonth.enrollments)} sub={`${fmt(latestMonth.value)} in benefits recovered`} color="emerald" />
              <KPICard label="Cost to City" value="$96K/yr" sub={`ROI: ${Math.round(totalGapDollars / 96000)}:1 — every $1 recovers $${Math.round(totalGapDollars / 96000)}`} color="indigo" />
            </div>

            {/* Charts Row */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Enrollment Gap by Program */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="font-semibold mb-1">Enrollment Gap by Program</h3>
                <p className="text-sm text-slate-400 mb-6">Eligible vs. enrolled residents across benefit programs</p>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={PROGRAM_ENROLLMENT_DATA} layout="vertical" margin={{ left: 20 }}>
                    <XAxis type="number" tickFormatter={fmtNum} fontSize={12} />
                    <YAxis type="category" dataKey="program" width={80} fontSize={12} />
                    <Tooltip formatter={(v) => fmtNum(Number(v))} />
                    <Bar dataKey="enrolled" stackId="a" fill="#818cf8" name="Enrolled" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="gap" stackId="a" fill="#fca5a5" name="Gap (not enrolled)" radius={[0, 4, 4, 0]} />
                    <Legend />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Benefits Recovery Trajectory */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="font-semibold mb-1">Benefits Recovery Trajectory</h3>
                <p className="text-sm text-slate-400 mb-6">Projected cumulative enrollment and dollar value recovered</p>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={MONTHLY_ENROLLMENTS}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" fontSize={12} />
                    <YAxis yAxisId="left" fontSize={12} />
                    <YAxis yAxisId="right" orientation="right" tickFormatter={fmtK} fontSize={12} />
                    <Tooltip formatter={(v, name) => name === "Cumulative Value ($)" ? fmt(Number(v)) : fmtNum(Number(v))} />
                    <Line yAxisId="left" type="monotone" dataKey="enrollments" stroke="#4f46e5" strokeWidth={2} dot={false} name="Cumulative Enrollments" />
                    <Line yAxisId="right" type="monotone" dataKey="value" stroke="#16a34a" strokeWidth={2} dot={false} name="Cumulative Value ($)" />
                    <Legend />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Language + Top Gaps */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Language Distribution */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="font-semibold mb-1">Primary Language</h3>
                <p className="text-sm text-slate-400 mb-6">Household language distribution</p>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={LANGUAGE_DATA} dataKey="percentage" nameKey="language" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3}>
                      {LANGUAGE_DATA.map((d, i) => (
                        <Cell key={i} fill={d.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => `${v}%`} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-2">
                  {LANGUAGE_DATA.map((d) => (
                    <div key={d.language} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                        <span>{d.language}</span>
                      </div>
                      <span className="text-slate-400">{d.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Gap Neighborhoods */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="font-semibold mb-1">Highest Enrollment Gaps by Neighborhood</h3>
                <p className="text-sm text-slate-400 mb-6">Where the most unclaimed dollars are concentrated</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="text-left py-2 pr-4 font-medium text-slate-500">Neighborhood</th>
                        <th className="text-right py-2 px-4 font-medium text-slate-500">Gap (households)</th>
                        <th className="text-right py-2 px-4 font-medium text-slate-500">Unclaimed $</th>
                        <th className="text-left py-2 px-4 font-medium text-slate-500">Primary Language</th>
                        <th className="text-left py-2 pl-4 font-medium text-slate-500">Top Unclaimed</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedNeighborhoods.slice(0, 8).map((n) => (
                        <tr key={n.name} className="border-b border-slate-50 hover:bg-slate-50">
                          <td className="py-3 pr-4 font-medium">{n.name}</td>
                          <td className="py-3 px-4 text-right">{fmtNum(n.gap)}</td>
                          <td className="py-3 px-4 text-right font-medium text-red-600">{fmt(n.gapDollars)}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                              n.primaryLanguage === "Portuguese" ? "bg-green-100 text-green-700" :
                              n.primaryLanguage === "Spanish" ? "bg-orange-100 text-orange-700" :
                              n.primaryLanguage === "Cape Verdean Creole" ? "bg-cyan-100 text-cyan-700" :
                              "bg-slate-100 text-slate-600"
                            }`}>
                              {n.primaryLanguage}
                            </span>
                          </td>
                          <td className="py-3 pl-4">{n.topUnclaimedProgram}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* The Pitch */}
            <div className="bg-gradient-to-r from-indigo-700 to-indigo-800 rounded-2xl p-8 md:p-10 text-white">
              <div className="max-w-3xl">
                <h3 className="text-2xl font-bold mb-4">The Bottom Line</h3>
                <p className="text-indigo-100 text-lg leading-relaxed mb-6">
                  New Bedford residents are leaving an estimated <strong className="text-white">{fmt(totalGapDollars)}</strong> in federal and state benefits on the table every year.
                  Every dollar enrolled flows directly into the local economy — groceries, rent, heating oil, childcare — spent at New Bedford businesses.
                </p>
                <div className="flex flex-wrap gap-6">
                  <div>
                    <div className="text-3xl font-bold text-amber-300">{fmt(totalGapDollars)}</div>
                    <div className="text-indigo-200 text-sm">Annual unclaimed benefits</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-amber-300">{fmtNum(totalGapHouseholds)}</div>
                    <div className="text-indigo-200 text-sm">Households not receiving benefits they qualify for</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-amber-300">$96K</div>
                    <div className="text-indigo-200 text-sm">Annual platform cost to the city</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* NEIGHBORHOODS TAB */}
        {activeTab === "neighborhoods" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-1">Neighborhood Analysis</h2>
              <p className="text-slate-500">Enrollment gaps and unclaimed benefits by New Bedford neighborhood</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <ResponsiveContainer width="100%" height={500}>
                <BarChart data={sortedNeighborhoods} layout="vertical" margin={{ left: 30 }}>
                  <XAxis type="number" tickFormatter={fmtK} fontSize={12} />
                  <YAxis type="category" dataKey="name" width={130} fontSize={12} />
                    <Tooltip formatter={(v) => fmt(Number(v))} />
                  <Bar dataKey="gapDollars" fill="#ef4444" name="Unclaimed Benefits ($)" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-slate-500">Neighborhood</th>
                      <th className="text-right py-3 px-4 font-medium text-slate-500">Population</th>
                      <th className="text-right py-3 px-4 font-medium text-slate-500">Eligible</th>
                      <th className="text-right py-3 px-4 font-medium text-slate-500">Enrolled</th>
                      <th className="text-right py-3 px-4 font-medium text-slate-500">Gap</th>
                      <th className="text-right py-3 px-4 font-medium text-slate-500">Unclaimed $</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-500">Language</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-500">Top Gap Program</th>
                      <th className="text-right py-3 px-4 font-medium text-slate-500">Enrollment Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedNeighborhoods.map((n) => {
                      const rate = Math.round((n.enrolled / n.estimatedEligible) * 100);
                      return (
                        <tr key={n.name} className="border-t border-slate-100 hover:bg-slate-50">
                          <td className="py-3 px-4 font-medium">{n.name}</td>
                          <td className="py-3 px-4 text-right">{fmtNum(n.population)}</td>
                          <td className="py-3 px-4 text-right">{fmtNum(n.estimatedEligible)}</td>
                          <td className="py-3 px-4 text-right">{fmtNum(n.enrolled)}</td>
                          <td className="py-3 px-4 text-right font-medium text-red-600">{fmtNum(n.gap)}</td>
                          <td className="py-3 px-4 text-right font-medium text-red-600">{fmt(n.gapDollars)}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                              n.primaryLanguage === "Portuguese" ? "bg-green-100 text-green-700" :
                              n.primaryLanguage === "Spanish" ? "bg-orange-100 text-orange-700" :
                              n.primaryLanguage === "Cape Verdean Creole" ? "bg-cyan-100 text-cyan-700" :
                              "bg-slate-100 text-slate-600"
                            }`}>
                              {n.primaryLanguage}
                            </span>
                          </td>
                          <td className="py-3 px-4">{n.topUnclaimedProgram}</td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${rate >= 70 ? "bg-emerald-500" : rate >= 50 ? "bg-amber-400" : "bg-red-400"}`}
                                  style={{ width: `${rate}%` }}
                                />
                              </div>
                              <span className="text-xs w-8 text-right">{rate}%</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* OUTREACH TAB */}
        {activeTab === "outreach" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-1">Outreach & Channel Effectiveness</h2>
              <p className="text-slate-500">Which channels work best for reaching New Bedford residents</p>
            </div>

            {/* Channel Comparison */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="font-semibold mb-6">Channel Performance Comparison</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left py-3 pr-4 font-medium text-slate-500">Channel</th>
                      <th className="text-right py-3 px-4 font-medium text-slate-500">Response Rate</th>
                      <th className="text-right py-3 px-4 font-medium text-slate-500">Enrollment Rate</th>
                      <th className="text-right py-3 px-4 font-medium text-slate-500">Cost per Enrollment</th>
                      <th className="text-left py-3 pl-4 font-medium text-slate-500">Effectiveness</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CHANNEL_EFFECTIVENESS.map((ch) => (
                      <tr key={ch.channel} className="border-b border-slate-50 hover:bg-slate-50">
                        <td className="py-4 pr-4 font-medium">{ch.channel}</td>
                        <td className="py-4 px-4 text-right">
                          <span className="font-medium">{ch.responseRate}%</span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span className="font-medium">{ch.enrollmentRate}%</span>
                        </td>
                        <td className="py-4 px-4 text-right">${ch.costPerEnrollment}</td>
                        <td className="py-4 pl-4">
                          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden max-w-[200px]">
                            <div
                              className="h-full bg-indigo-500 rounded-full"
                              style={{ width: `${ch.enrollmentRate}%` }}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Key Insights */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-cyan-50 border border-cyan-200 rounded-2xl p-6">
                <div className="text-2xl mb-3">📱</div>
                <div className="font-semibold text-cyan-900 mb-2">WhatsApp Dominates Portuguese Outreach</div>
                <div className="text-sm text-cyan-700">61% response rate among Portuguese-speaking households vs. 34% for SMS. WhatsApp is the preferred channel in immigrant communities.</div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                <div className="text-2xl mb-3">🏛️</div>
                <div className="font-semibold text-amber-900 mb-2">Kiosks: Lowest Cost, High Impact</div>
                <div className="text-sm text-amber-700">Community kiosks at libraries and health centers have the lowest cost per enrollment ($8) with 52% enrollment rate. Walk-up access removes digital barriers.</div>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
                <div className="text-2xl mb-3">🤝</div>
                <div className="font-semibold text-emerald-900 mb-2">CHW Visits: Highest Conversion</div>
                <div className="text-sm text-emerald-700">Community health worker home visits achieve 68% enrollment — the highest of any channel. Trust-based, in-language, face-to-face interaction drives results.</div>
              </div>
            </div>

            {/* Upcoming Campaigns */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="font-semibold mb-1">Proactive Outreach Calendar</h3>
              <p className="text-sm text-slate-400 mb-6">Upcoming automated campaigns triggered by program deadlines and seasonal events</p>
              <div className="space-y-4">
                {UPCOMING_OUTREACH.map((o, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="bg-indigo-100 text-indigo-700 font-bold text-sm px-3 py-1.5 rounded-lg shrink-0 w-16 text-center">
                      {o.date}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium mb-1">{o.campaign}</div>
                      <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                        <span>Target: {o.target}</span>
                        <span>Channels: {o.channels}</span>
                        <span>Languages: {o.language}</span>
                      </div>
                    </div>
                    <div className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium shrink-0">
                      Scheduled
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Compliance */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="font-semibold mb-4">MA Language Access Compliance (Executive Order 615)</h3>
              <div className="grid md:grid-cols-4 gap-4">
                {[
                  { lang: "English", status: "Compliant", color: "emerald" },
                  { lang: "Portuguese", status: "Compliant", color: "emerald" },
                  { lang: "Spanish", status: "Compliant", color: "emerald" },
                  { lang: "Cape Verdean Creole", status: "In Progress", color: "amber" },
                ].map((l) => (
                  <div key={l.lang} className={`p-4 rounded-xl border ${
                    l.color === "emerald" ? "bg-emerald-50 border-emerald-200" : "bg-amber-50 border-amber-200"
                  }`}>
                    <div className="font-medium text-sm mb-1">{l.lang}</div>
                    <div className={`text-xs font-medium ${l.color === "emerald" ? "text-emerald-600" : "text-amber-600"}`}>
                      {l.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 mt-8">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between text-sm text-slate-400">
          <span>NB Connect — City Intelligence Dashboard (MVP Demo)</span>
          <Link href="/" className="text-indigo-600 hover:text-indigo-800 font-medium">Back to NB Connect</Link>
        </div>
      </footer>
    </div>
  );
}

function KPICard({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  const colors: Record<string, string> = {
    red: "border-l-red-500",
    amber: "border-l-amber-500",
    emerald: "border-l-emerald-500",
    indigo: "border-l-indigo-500",
  };

  return (
    <div className={`bg-white rounded-2xl border border-slate-200 p-6 border-l-4 ${colors[color]}`}>
      <div className="text-sm text-slate-500 mb-2">{label}</div>
      <div className="text-2xl md:text-3xl font-bold mb-1">{value}</div>
      <div className="text-xs text-slate-400">{sub}</div>
    </div>
  );
}
