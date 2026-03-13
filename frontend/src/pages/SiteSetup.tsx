import { useState } from "react";
import { Plus, Trash2, MapPin, Wind } from "lucide-react";
import { api } from "../api";
import { useSite } from "../App";

const EMPTY = { name: "", latitude: 0, longitude: 0, country: "", num_turbines: 0, water_depth_m: 30, distance_from_port_km: 0, port_name: "" };
const PRESETS = [
  { name: "Vineyard Wind 1", latitude: 41.025, longitude: -70.521, country: "US", num_turbines: 62, water_depth_m: 42, distance_from_port_km: 24, port_name: "New Bedford" },
  { name: "South Fork Wind", latitude: 41.09, longitude: -71.31, country: "US", num_turbines: 12, water_depth_m: 35, distance_from_port_km: 56, port_name: "Montauk" },
  { name: "Hornsea 2", latitude: 53.91, longitude: 1.55, country: "UK", num_turbines: 165, water_depth_m: 30, distance_from_port_km: 89, port_name: "Grimsby" },
  { name: "Dogger Bank A", latitude: 54.75, longitude: 2.05, country: "UK", num_turbines: 95, water_depth_m: 25, distance_from_port_km: 130, port_name: "Port of Tyne" },
  { name: "Borssele 1&2", latitude: 51.72, longitude: 3.03, country: "NL", num_turbines: 94, water_depth_m: 28, distance_from_port_km: 23, port_name: "Vlissingen" },
  { name: "Seagreen", latitude: 56.59, longitude: -1.74, country: "UK", num_turbines: 114, water_depth_m: 41, distance_from_port_km: 27, port_name: "Montrose" },
];

export default function SiteSetup() {
  const { sites, reload, setSite } = useSite();
  const [form, setForm] = useState(EMPTY);
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!form.name) return; setSaving(true);
    try { const s = await api.sites.create(form); setSite(s); reload(); setForm(EMPTY); setAdding(false); } catch {}
    setSaving(false);
  };
  const remove = async (id: string) => { if (!confirm("Delete this site?")) return; await api.sites.delete(id); reload(); };
  const pick = (p: typeof PRESETS[0]) => { setForm({ ...p }); setAdding(true); };

  return (
    <div>
      <div className="page-header">
        <h2><Settings size={20} /> Wind Farm Sites</h2>
        <button className="btn" onClick={() => setAdding(!adding)}><Plus size={14}/>{adding ? "Cancel" : "Add Site"}</button>
      </div>

      {adding && (
        <>
          <div className="card mb4">
            <div className="txs tmuted mb3" style={{ textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>Quick Add — Real Wind Farms</div>
            <div className="flex" style={{ flexWrap: "wrap", gap: 8 }}>
              {PRESETS.map(p => (
                <button key={p.name} className="btn-ghost btn-sm" onClick={() => pick(p)}><MapPin size={12}/>{p.name}</button>
              ))}
            </div>
          </div>
          <div className="card mb6">
            <div className="txs tmuted mb4" style={{ textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>Site Details</div>
            <div className="g g2 mb4">
              {([["name","Site Name","text"],["latitude","Latitude","number"],["longitude","Longitude","number"],["country","Country","text"],["num_turbines","Turbines","number"],["water_depth_m","Depth (m)","number"],["distance_from_port_km","Distance (km)","number"],["port_name","Port","text"]] as const).map(([k,l,t]) => (
                <div key={k}>
                  <label className="txs tmuted">{l}</label>
                  <input type={t} value={(form as any)[k]} style={{ display: "block", width: "100%", marginTop: 4 }}
                    onChange={e => setForm({ ...form, [k]: t === "number" ? +e.target.value : e.target.value })} />
                </div>
              ))}
            </div>
            <button className="btn" onClick={save} disabled={saving || !form.name}>{saving ? "Creating..." : "Create Site & Fetch Weather"}</button>
          </div>
        </>
      )}

      {sites.length === 0 && !adding && (
        <div className="empty"><Wind size={48}/><h3>No sites configured</h3><p className="tmuted">Add your first wind farm to start tracking weather windows.</p></div>
      )}

      {sites.map(s => (
        <div className="card mb3 flex between" key={s.id}>
          <div>
            <div className="flex mb1"><MapPin size={14} className="tcyan"/><strong>{s.name}</strong><span className="tag" style={{ background: "rgba(6,182,212,.1)", color: "var(--cyan)", fontSize: 10 }}>{s.country}</span></div>
            <div className="txs tmuted">{s.latitude.toFixed(2)}°N, {s.longitude.toFixed(2)}°E · {s.num_turbines} turbines · {s.water_depth_m}m depth · {s.distance_from_port_km}km from {s.port_name}</div>
          </div>
          <button className="btn-ghost btn-sm" onClick={() => remove(s.id)} style={{ color: "var(--red)" }}><Trash2 size={14}/></button>
        </div>
      ))}
    </div>
  );
}

function Settings({ size }: { size: number }) { return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>; }
