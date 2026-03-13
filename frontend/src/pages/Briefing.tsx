import { useState, useEffect } from "react";
import { Calendar, RefreshCw } from "lucide-react";
import { api } from "../api";
import { useSite } from "../App";

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  GO: { bg: "#16a34a22", color: "var(--green)", label: "GO" },
  PARTIAL_GO: { bg: "#16a34a15", color: "var(--green)", label: "PARTIAL GO" },
  MARGINAL: { bg: "#d9770622", color: "var(--amber)", label: "MARGINAL" },
  NO_GO: { bg: "#dc262622", color: "var(--red)", label: "NO GO" },
  NO_DATA: { bg: "#47556922", color: "var(--text2)", label: "NO DATA" },
};

const DAY_RATING: Record<string, string> = { good: "var(--green)", mixed: "var(--amber)", poor: "var(--red)", no_data: "var(--text2)" };

export default function Briefing() {
  const { site } = useSite();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const load = () => {
    if (!site) return;
    setLoading(true);
    api.briefing(site.id).then(setData).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(load, [site?.id]);

  if (!site) return <div className="card text-muted">Add a site first.</div>;
  if (loading) return <div className="card text-muted">Loading briefing...</div>;
  if (!data) return <div className="card text-muted">No data. Refresh weather from Dashboard first.</div>;

  const cur = data.current_conditions;

  return (
    <div>
      <div className="flex-between mb-6">
        <h2>Daily Briefing — {data.site_name}</h2>
        <div className="flex">
          <span className="text-xs text-muted">Generated {new Date(data.generated_at).toLocaleTimeString("en-GB")}</span>
          <button className="btn-outline btn-sm flex" onClick={load}><RefreshCw size={12} />Refresh</button>
        </div>
      </div>

      {/* Current Conditions */}
      {cur && (
        <div className="card mb-6">
          <h3 className="text-sm text-muted mb-2">Current Conditions</h3>
          <div className="grid-6">
            {[
              { l: "Hs", v: cur.wave_height_m, u: "m" },
              { l: "Wind 10m", v: cur.wind_speed_10m_ms, u: "m/s" },
              { l: "Wind 80m", v: cur.wind_speed_80m_ms, u: "m/s" },
              { l: "Gusts", v: cur.wind_gusts_ms, u: "m/s" },
              { l: "Vis", v: cur.visibility_m ? (cur.visibility_m / 1000).toFixed(1) : "—", u: "km" },
              { l: "Temp", v: cur.temperature_c, u: "°C" },
            ].map(x => (
              <div key={x.l} style={{ textAlign: "center" }}>
                <div className="text-xs text-muted">{x.l}</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>{x.v ?? "—"}</div>
                <div className="text-xs text-muted">{x.u}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Today's Operations */}
      <h3 className="mb-2" style={{ fontSize: 16 }}>Today's Operations</h3>
      <div className="grid-3 mb-6">
        {Object.entries(data.today || {}).map(([key, op]: [string, any]) => {
          const s = STATUS_STYLE[op.overall] || STATUS_STYLE.NO_DATA;
          return (
            <div className="card" key={key}>
              <div className="flex-between mb-2">
                <strong className="text-sm">{op.label}</strong>
                <span className="tag" style={{ background: s.bg, color: s.color }}>{s.label}</span>
              </div>
              <div className="text-sm">{op.go_hours}h GO · {op.marginal_hours}h Marginal · {op.no_go_hours}h No-Go</div>
              {op.window_start && (
                <div className="text-xs text-muted mt-2">
                  Window: {new Date(op.window_start).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })} — {new Date(op.window_end).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                </div>
              )}
              {op.limiting_factor && <div className="text-xs text-red mt-2">Limit: {op.limiting_factor}</div>}
              <div className="text-xs text-muted mt-2">Confidence: {op.avg_confidence}%</div>
            </div>
          );
        })}
      </div>

      {/* Tomorrow's Outlook */}
      <h3 className="mb-2" style={{ fontSize: 16 }}>Tomorrow's Outlook</h3>
      <div className="grid-3 mb-6">
        {Object.entries(data.tomorrow || {}).map(([key, op]: [string, any]) => (
          <div className="card" key={key} style={{ padding: 14 }}>
            <div className="flex-between">
              <span className="text-sm">{op.label}</span>
              <span className="text-sm" style={{ color: op.outlook === "Good" ? "var(--green)" : op.outlook === "Mixed" ? "var(--amber)" : "var(--red)", fontWeight: 600 }}>
                {op.outlook}
              </span>
            </div>
            <div className="text-xs text-muted mt-2">{op.go_hours}/{op.total_hours}h workable · {op.avg_confidence}% conf</div>
          </div>
        ))}
      </div>

      {/* 7-Day Summary */}
      <h3 className="mb-2" style={{ fontSize: 16 }}>7-Day Summary</h3>
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Day</th>
              <th>Hs (avg)</th>
              <th>Wind (avg)</th>
              {data.daily_summary?.[0] && Object.keys(data.daily_summary[0].operations || {}).map(op => (
                <th key={op}>{op.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()).slice(0, 12)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(data.daily_summary || []).map((d: any) => (
              <tr key={d.date}>
                <td><strong>{d.day_name.slice(0, 3)}</strong> <span className="text-muted text-xs">{d.date.slice(5)}</span></td>
                <td>{d.avg_wave_height_m ?? "—"}m</td>
                <td>{d.avg_wind_speed_ms ?? "—"}m/s</td>
                {Object.values(d.operations || {}).map((op: any, i: number) => (
                  <td key={i}>
                    <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: DAY_RATING[op.rating] || "var(--text2)", marginRight: 4 }} />
                    <span className="text-xs">{op.go_hours}/{op.total_hours}h</span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
