import { useState, useEffect } from "react";
import { RefreshCw, Sunrise } from "lucide-react";
import { api } from "../api";
import { useSite } from "../App";

const S: Record<string, { bg: string; fg: string; label: string }> = {
  GO: { bg: "rgba(16,185,129,.1)", fg: "var(--green)", label: "GO" },
  PARTIAL_GO: { bg: "rgba(59,130,246,.1)", fg: "var(--blue)", label: "PARTIAL" },
  MARGINAL: { bg: "rgba(245,158,11,.1)", fg: "var(--amber)", label: "MARGINAL" },
  NO_GO: { bg: "rgba(239,68,68,.1)", fg: "var(--red)", label: "NO GO" },
  NO_DATA: { bg: "rgba(90,104,128,.1)", fg: "var(--t3)", label: "—" },
};
const DR: Record<string, string> = { good: "var(--green)", mixed: "var(--amber)", poor: "var(--red)", no_data: "var(--t3)" };

export default function Briefing() {
  const { site } = useSite();
  const [d, setD] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const load = () => { if (!site) return; setLoading(true); api.briefing(site.id).then(setD).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(load, [site?.id]);

  if (!site) return <div className="empty"><Sunrise size={48}/><h3>Select a site</h3></div>;
  if (loading) return <div className="card tmuted">Loading briefing...</div>;
  if (!d) return <div className="card tmuted">No data available.</div>;

  const cur = d.current_conditions;
  const time = (iso: string) => new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

  return (
    <div>
      <div className="page-header">
        <h2><Sunrise size={20} /> Daily Briefing <span className="sub">— {d.site_name}</span></h2>
        <div className="flex">
          <span className="txs tmuted">Updated {time(d.generated_at)}</span>
          <button className="btn-ghost btn-sm" onClick={load}><RefreshCw size={12} /></button>
        </div>
      </div>

      {/* Current Conditions */}
      {cur && (
        <div className="card mb6" style={{ borderLeft: "3px solid var(--cyan)" }}>
          <div className="txs tmuted mb3" style={{ textTransform: "uppercase", letterSpacing: 1 }}>Current Conditions</div>
          <div className="g g6">
            {[
              ["Hs", cur.wave_height_m, "m"], ["Wind 10m", cur.wind_speed_10m_ms, "m/s"], ["Wind 80m", cur.wind_speed_80m_ms, "m/s"],
              ["Gusts", cur.wind_gusts_ms, "m/s"], ["Visibility", cur.visibility_m ? (cur.visibility_m / 1000).toFixed(1) : "—", "km"], ["Temp", cur.temperature_c, "°C"],
            ].map(([l, v, u]) => (
              <div key={l as string} style={{ textAlign: "center" }}>
                <div className="txs tmuted">{l}</div>
                <div style={{ fontSize: 22, fontWeight: 700 }}>{v ?? "—"}<span className="stat-unit"> {u}</span></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Today */}
      <div className="txs tmuted mb2" style={{ textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>Today's Operations</div>
      <div className="g g3 mb6">
        {Object.entries(d.today || {}).map(([k, op]: [string, any]) => {
          const s = S[op.overall] || S.NO_DATA;
          return (
            <div className="card" key={k} style={{ borderTop: `2px solid ${op.color}` }}>
              <div className="flex between mb2">
                <strong className="tsm">{op.label}</strong>
                <span className="tag" style={{ background: s.bg, color: s.fg }}>{s.label}</span>
              </div>
              <div className="txs tmuted">{op.go_hours}h GO · {op.marginal_hours}h Marginal · {op.no_go_hours}h No-Go</div>
              {op.window_start && <div className="txs tmuted mt2">Window: {time(op.window_start)} — {time(op.window_end)}</div>}
              {op.limiting_factor && <div className="txs tred mt2">Limiting: {op.limiting_factor}</div>}
              <div style={{ marginTop: 8, background: "var(--s2)", borderRadius: 4, height: 6, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(op.go_hours / (op.total_hours || 1)) * 100}%`, background: op.color, borderRadius: 4 }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Tomorrow */}
      <div className="txs tmuted mb2" style={{ textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>Tomorrow's Outlook</div>
      <div className="g g3 mb6">
        {Object.entries(d.tomorrow || {}).map(([k, op]: [string, any]) => (
          <div className="card" key={k} style={{ padding: 14 }}>
            <div className="flex between">
              <span className="tsm">{op.label}</span>
              <span className="tsm" style={{ color: op.outlook === "Good" ? "var(--green)" : op.outlook === "Mixed" ? "var(--amber)" : "var(--red)", fontWeight: 600 }}>{op.outlook}</span>
            </div>
            <div className="txs tmuted mt2">{op.go_hours}/{op.total_hours}h workable · {op.avg_confidence}% conf</div>
          </div>
        ))}
      </div>

      {/* 7-Day */}
      <div className="txs tmuted mb2" style={{ textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>7-Day Forecast</div>
      <div className="card-flush">
        <table>
          <thead>
            <tr>
              <th>Day</th><th>Hs</th><th>Wind</th>
              {d.daily_summary?.[0] && Object.keys(d.daily_summary[0].operations).map(op => <th key={op} style={{ maxWidth: 80 }}>{op.split("_").map((w: string) => w[0].toUpperCase()).join("")}</th>)}
            </tr>
          </thead>
          <tbody>
            {(d.daily_summary || []).map((day: any, i: number) => (
              <tr key={i}>
                <td><strong>{day.day_name.slice(0, 3)}</strong> <span className="tmuted txs">{day.date.slice(5)}</span></td>
                <td>{day.avg_wave_height_m ?? "—"}m</td>
                <td>{day.avg_wind_speed_ms ?? "—"}m/s</td>
                {Object.values(day.operations).map((op: any, j: number) => (
                  <td key={j}><span className="dot" style={{ background: DR[op.rating], marginRight: 4 }} /><span className="txs">{op.go_hours}/{op.total_hours}</span></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
