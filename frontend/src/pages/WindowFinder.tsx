import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { api } from "../api";
import { useSite } from "../App";

const RISK_COLOR: Record<string, string> = { Low: "var(--green)", Medium: "var(--amber)", High: "var(--red)" };

export default function WindowFinder() {
  const { site } = useSite();
  const [profiles, setProfiles] = useState<Record<string, any>>({});
  const [op, setOp] = useState("ctv_transfer");
  const [minHrs, setMinHrs] = useState(4);
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { api.operationProfiles().then(setProfiles).catch(() => {}); }, []);

  const search = () => {
    if (!site) return;
    setLoading(true);
    api.windows(site.id, op, minHrs).then(setResults).catch(() => {}).finally(() => setLoading(false));
  };

  if (!site) return <div className="card text-muted">Add a site first.</div>;

  const fmt = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }) + " " + d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div>
      <h2>Weather Window Finder</h2>
      <div className="card mb-6">
        <div className="flex gap-4" style={{ flexWrap: "wrap" }}>
          <div>
            <label className="text-xs text-muted">Operation</label>
            <select value={op} onChange={e => setOp(e.target.value)} style={{ display: "block", marginTop: 4, minWidth: 200 }}>
              {Object.entries(profiles).map(([k, v]: [string, any]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted">Min Duration (hrs)</label>
            <input type="number" value={minHrs} onChange={e => setMinHrs(+e.target.value)} min={1} max={72}
              style={{ display: "block", marginTop: 4, width: 80 }} />
          </div>
          <div style={{ alignSelf: "flex-end" }}>
            <button className="btn flex" onClick={search} disabled={loading}>
              <Search size={14} />{loading ? "Searching..." : "Find Windows"}
            </button>
          </div>
        </div>
      </div>

      {results && (
        <div>
          <p className="text-sm text-muted mb-4">
            Found <strong>{results.windows_found}</strong> windows for {results.operation_label} (min {results.min_duration_hours}h)
          </p>
          {results.windows.length === 0 && <div className="card text-muted">No suitable windows found in the forecast period.</div>}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {results.windows.map((w: any, i: number) => (
              <div className="card flex-between" key={i}>
                <div>
                  <div className="flex mb-2">
                    <span className="tag" style={{ background: `${RISK_COLOR[w.risk_level]}22`, color: RISK_COLOR[w.risk_level] }}>
                      {w.risk_level} Risk
                    </span>
                    <strong>{w.duration_hours}h window</strong>
                  </div>
                  <div className="text-sm">{fmt(w.start)} — {fmt(w.end)}</div>
                  <div className="text-xs text-muted mt-2">
                    {w.go_hours}h GO · {w.marginal_hours}h Marginal
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 28, fontWeight: 700, color: RISK_COLOR[w.risk_level] }}>{w.avg_confidence.toFixed(0)}%</div>
                  <div className="text-xs text-muted">confidence</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
