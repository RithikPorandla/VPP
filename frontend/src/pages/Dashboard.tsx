import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { api } from "../api";
import { useSite } from "../App";

const D_COLORS: Record<string, string> = { GO: "var(--green)", MARGINAL: "var(--amber)", NO_GO: "var(--red)" };
const D_BG: Record<string, string> = { GO: "#22c55e", MARGINAL: "#f59e0b", NO_GO: "#ef4444" };

export default function Dashboard() {
  const { site } = useSite();
  const [data, setData] = useState<Record<string, any[]>>({});
  const [weather, setWeather] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hover, setHover] = useState<{ op: string; idx: number } | null>(null);

  const load = () => {
    if (!site) return;
    setLoading(true);
    Promise.all([api.goNoGo(site.id, 72), api.weather.get(site.id, 72)])
      .then(([g, w]) => { setData(g); setWeather(w); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(load, [site?.id]);

  const refresh = () => {
    if (!site) return;
    setLoading(true);
    api.weather.refresh(site.id).then(load).catch(() => setLoading(false));
  };

  if (!site) return <div className="card"><p className="text-muted">Add a site first in Settings.</p></div>;

  const ops = Object.entries(data);
  const now = new Date();

  // Current conditions from first weather row
  const cur = weather[0];

  return (
    <div>
      <div className="flex-between mb-6">
        <h2>Dashboard — {site.name}</h2>
        <button className="btn flex" onClick={refresh} disabled={loading}>
          <RefreshCw size={14} className={loading ? "spin" : ""} />{loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {cur && (
        <div className="grid-6 mb-6">
          {[
            { l: "Wave Height", v: cur.wave_height_m, u: "m" },
            { l: "Wind (10m)", v: cur.wind_speed_10m_ms, u: "m/s" },
            { l: "Gusts", v: cur.wind_gusts_ms, u: "m/s" },
            { l: "Visibility", v: cur.visibility_m ? (cur.visibility_m / 1000).toFixed(1) : "—", u: "km" },
            { l: "Temp", v: cur.temperature_c, u: "°C" },
            { l: "Precip", v: cur.precipitation_mm, u: "mm" },
          ].map(({ l, v, u }) => (
            <div className="card" key={l} style={{ textAlign: "center", padding: 12 }}>
              <div className="text-xs text-muted">{l}</div>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{v ?? "—"}</div>
              <div className="text-xs text-muted">{u}</div>
            </div>
          ))}
        </div>
      )}

      {ops.map(([opType, hours]) => {
        const goCount = hours.filter(h => h.decision === "GO").length;
        const margCount = hours.filter(h => h.decision === "MARGINAL").length;
        const nogoCount = hours.filter(h => h.decision === "NO_GO").length;
        const overall = goCount > hours.length * 0.7 ? "GO" : nogoCount > hours.length * 0.7 ? "NO_GO" : "MARGINAL";

        return (
          <div className="card mb-4" key={opType}>
            <div className="flex-between mb-2">
              <div className="flex">
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: hours[0]?.color }} />
                <strong>{hours[0]?.operation_label}</strong>
                <span className={`tag tag-${overall.toLowerCase().replace("_", "-")}`}>{overall.replace("_", " ")}</span>
              </div>
              <span className="text-sm text-muted">{goCount}h GO · {margCount}h Marginal · {nogoCount}h No-Go</span>
            </div>
            <div className="timeline-row" style={{ position: "relative" }}>
              {hours.map((h, i) => {
                const isHovered = hover?.op === opType && hover?.idx === i;
                const t = new Date(h.forecast_time);
                return (
                  <div key={i} className="timeline-cell"
                    style={{ background: D_BG[h.decision] || "#475569", opacity: h.decision === "NO_GO" ? 0.4 : 1 }}
                    onMouseEnter={() => setHover({ op: opType, idx: i })}
                    onMouseLeave={() => setHover(null)}>
                    {isHovered && (
                      <div className="tooltip">
                        <strong>{t.toLocaleDateString("en-GB", { weekday: "short" })} {t.getHours()}:00</strong><br />
                        {h.decision} ({h.confidence_pct}%)<br />
                        {h.limiting_factors?.length ? `Limit: ${h.limiting_factors.join(", ")}` : "All clear"}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex mt-2 text-xs text-muted" style={{ justifyContent: "space-between" }}>
              <span>Now</span><span>+24h</span><span>+48h</span><span>+72h</span>
            </div>
          </div>
        );
      })}

      {ops.length === 0 && !loading && <div className="card text-muted">No forecast data. Click Refresh to fetch weather.</div>}
    </div>
  );
}
