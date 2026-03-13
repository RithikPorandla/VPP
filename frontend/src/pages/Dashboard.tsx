import { useState, useEffect } from "react";
import { RefreshCw, Waves, Wind, Eye, Thermometer, CloudRain, Gauge } from "lucide-react";
import { api } from "../api";
import { useSite } from "../App";

const DC: Record<string, string> = { GO: "#10b981", MARGINAL: "#f59e0b", NO_GO: "#ef4444" };
const ICONS: Record<string, any> = { wave_height_m: "Hs", wind_speed_10m_ms: "Ws", wind_gusts_ms: "Gust", visibility_m: "Vis" };

export default function Dashboard() {
  const { site } = useSite();
  const [data, setData] = useState<Record<string, any[]>>({});
  const [wx, setWx] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const load = () => { if (!site) return; setLoading(true); Promise.all([api.goNoGo(site.id, 72), api.weather.get(site.id, 72)]).then(([g, w]) => { setData(g); setWx(w); }).finally(() => setLoading(false)); };
  useEffect(load, [site?.id]);

  const refresh = () => { if (!site) return; setLoading(true); api.weather.refresh(site.id).then(load); };

  if (!site) return <div className="empty"><Wind size={48}/><h3>No site selected</h3><p>Add a wind farm in Settings to get started.</p></div>;

  const c = wx[0];
  const ops = Object.entries(data);
  const fmt = (d: string) => { const t = new Date(d); return t.toLocaleDateString("en-GB", { weekday: "short" }) + " " + t.getHours() + ":00"; };

  return (
    <div>
      <div className="page-header">
        <h2>{site.name} <span className="sub">Live Conditions</span></h2>
        <button className="btn" onClick={refresh} disabled={loading}><RefreshCw size={14}/>{loading ? "Updating..." : "Refresh Weather"}</button>
      </div>

      {/* Current conditions strip */}
      {c && (
        <div className="g g6 mb6">
          {[
            { icon: <Waves size={16} className="tcyan"/>, l: "Wave Height", v: c.wave_height_m, u: "m", warn: c.wave_height_m > 1.5 },
            { icon: <Wind size={16} className="tcyan"/>, l: "Wind (10m)", v: c.wind_speed_10m_ms, u: "m/s", warn: c.wind_speed_10m_ms > 12 },
            { icon: <Gauge size={16} className="tcyan"/>, l: "Gusts", v: c.wind_gusts_ms, u: "m/s", warn: c.wind_gusts_ms > 15 },
            { icon: <Eye size={16} className="tcyan"/>, l: "Visibility", v: c.visibility_m ? (c.visibility_m / 1000).toFixed(1) : "—", u: "km", warn: c.visibility_m < 3000 },
            { icon: <Thermometer size={16} className="tcyan"/>, l: "Temperature", v: c.temperature_c, u: "°C", warn: false },
            { icon: <CloudRain size={16} className="tcyan"/>, l: "Precipitation", v: c.precipitation_mm, u: "mm/h", warn: c.precipitation_mm > 1 },
          ].map(({ icon, l, v, u, warn }) => (
            <div className="card stat" key={l}>
              <div className="mb1">{icon}</div>
              <div className="stat-val" style={{ color: warn ? "var(--amber)" : "var(--text)" }}>{v ?? "—"} <span className="stat-unit">{u}</span></div>
              <div className="stat-label">{l}</div>
            </div>
          ))}
        </div>
      )}

      {/* Operation heatmaps */}
      {ops.map(([opType, hours]) => {
        const g = hours.filter(h => h.decision === "GO").length;
        const m = hours.filter(h => h.decision === "MARGINAL").length;
        const n = hours.filter(h => h.decision === "NO_GO").length;

        return (
          <div className="card mb4" key={opType}>
            <div className="flex between mb3">
              <div className="flex">
                <span className="dot" style={{ background: hours[0]?.color }} />
                <strong className="tsm">{hours[0]?.operation_label}</strong>
                {g > hours.length * 0.7 && <span className="tag tag-go">GO</span>}
                {n > hours.length * 0.7 && <span className="tag tag-no-go">NO GO</span>}
                {g <= hours.length * 0.7 && n <= hours.length * 0.7 && <span className="tag tag-marginal">MIXED</span>}
              </div>
              <span className="txs tmuted">{g}h GO · {m}h Marginal · {n}h No-Go</span>
            </div>

            <div className="heatmap">
              {hours.map((h, i) => (
                <div key={i} className="hcell" style={{ background: DC[h.decision], opacity: h.decision === "NO_GO" ? 0.3 : h.decision === "MARGINAL" ? 0.7 : 1 }}>
                  <div className="tip">
                    <strong>{fmt(h.forecast_time)}</strong><br/>
                    {h.decision.replace("_", " ")} · {h.confidence_pct}%
                    {h.limiting_factors?.length > 0 && <><br/><span style={{color:"var(--red)"}}>Limit: {h.limiting_factors.map((f: string) => ICONS[f] || f).join(", ")}</span></>}
                  </div>
                </div>
              ))}
            </div>
            <div className="haxis">
              {hours.map((h, i) => {
                const hr = new Date(h.forecast_time).getHours();
                return <span key={i}>{hr === 0 ? new Date(h.forecast_time).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : hr % 6 === 0 ? hr + "h" : ""}</span>;
              })}
            </div>
          </div>
        );
      })}

      {ops.length === 0 && !loading && <div className="card tmuted">No forecast data loaded. Click "Refresh Weather" to fetch from Open-Meteo.</div>}
    </div>
  );
}
