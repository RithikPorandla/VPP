import { useState, useEffect } from "react";
import { Search, Clock, AlertTriangle, CheckCircle } from "lucide-react";
import { api } from "../api";
import { useSite } from "../App";

const RC: Record<string, string> = { Low: "var(--green)", Medium: "var(--amber)", High: "var(--red)" };
const RI: Record<string, any> = { Low: <CheckCircle size={14}/>, Medium: <AlertTriangle size={14}/>, High: <AlertTriangle size={14}/> };

export default function WindowFinder() {
  const { site } = useSite();
  const [profiles, setProfiles] = useState<Record<string, any>>({});
  const [op, setOp] = useState("ctv_transfer");
  const [minH, setMinH] = useState(4);
  const [res, setRes] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { api.operationProfiles().then(setProfiles); }, []);

  const search = () => { if (!site) return; setLoading(true); api.windows(site.id, op, minH).then(setRes).finally(() => setLoading(false)); };

  if (!site) return <div className="empty"><Search size={48}/><h3>Select a site</h3></div>;

  const fmt = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }) + " " + d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div>
      <div className="page-header">
        <h2><Search size={20} /> Weather Window Finder</h2>
      </div>

      <div className="card mb6">
        <div className="flex" style={{ flexWrap: "wrap", gap: 16 }}>
          <div style={{ flex: "1 1 200px" }}>
            <label className="txs tmuted">Operation Type</label>
            <select value={op} onChange={e => setOp(e.target.value)} style={{ display: "block", width: "100%", marginTop: 4 }}>
              {Object.entries(profiles).map(([k, v]: [string, any]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
          <div style={{ flex: "0 0 100px" }}>
            <label className="txs tmuted">Min Hours</label>
            <input type="number" value={minH} onChange={e => setMinH(+e.target.value)} min={1} max={72} style={{ display: "block", width: "100%", marginTop: 4 }} />
          </div>
          <div style={{ alignSelf: "flex-end" }}>
            <button className="btn" onClick={search} disabled={loading}><Search size={14}/>{loading ? "Searching..." : "Find Windows"}</button>
          </div>
        </div>
      </div>

      {res && (
        <>
          <div className="tsm tmuted mb4">Found <strong style={{ color: "var(--text)" }}>{res.windows_found}</strong> windows for <strong style={{ color: "var(--text)" }}>{res.operation_label}</strong> (min {res.min_duration_hours}h) across 14-day forecast</div>

          {res.windows.length === 0 && <div className="card tmuted">No suitable windows in the forecast period. Try reducing the minimum duration or selecting a less restrictive operation.</div>}

          {res.windows.map((w: any, i: number) => (
            <div className="card wcard mb3" key={i}>
              <div>
                <div className="flex mb2">
                  <span className="tag" style={{ background: `${RC[w.risk_level]}18`, color: RC[w.risk_level] }}>{RI[w.risk_level]} {w.risk_level} Risk</span>
                  <strong>{w.duration_hours}h window</strong>
                  <span className="txs tmuted"><Clock size={11}/> {fmt(w.start)}</span>
                </div>
                <div className="tsm">{fmt(w.start)} → {fmt(w.end)}</div>
                <div className="txs tmuted mt2">{w.go_hours}h GO · {w.marginal_hours}h Marginal</div>
              </div>
              <div className="wcard-score">
                <div className="val" style={{ color: RC[w.risk_level] }}>{w.avg_confidence.toFixed(0)}%</div>
                <div className="txs tmuted">confidence</div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
