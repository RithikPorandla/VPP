import { useState } from "react";
import { Plus, Trash2, MapPin } from "lucide-react";
import { api } from "../api";
import { useSite } from "../App";

const EMPTY = { name: "", latitude: 0, longitude: 0, country: "", num_turbines: 0, water_depth_m: 30, distance_from_port_km: 0, port_name: "" };

const PRESETS = [
  { name: "Hornsea 2", latitude: 53.93, longitude: 1.79, country: "UK", num_turbines: 165, water_depth_m: 30, distance_from_port_km: 89, port_name: "Grimsby" },
  { name: "Dogger Bank A", latitude: 54.75, longitude: 2.05, country: "UK", num_turbines: 95, water_depth_m: 25, distance_from_port_km: 130, port_name: "Port of Tyne" },
  { name: "Borssele 1&2", latitude: 51.72, longitude: 3.03, country: "NL", num_turbines: 94, water_depth_m: 28, distance_from_port_km: 23, port_name: "Vlissingen" },
  { name: "Hollandse Kust Zuid", latitude: 52.31, longitude: 4.08, country: "NL", num_turbines: 140, water_depth_m: 20, distance_from_port_km: 22, port_name: "IJmuiden" },
  { name: "East Anglia ONE", latitude: 52.22, longitude: 2.50, country: "UK", num_turbines: 102, water_depth_m: 37, distance_from_port_km: 43, port_name: "Lowestoft" },
];

export default function SiteSetup() {
  const { sites, reload, setSite } = useSite();
  const [form, setForm] = useState(EMPTY);
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!form.name || !form.latitude) return;
    setSaving(true);
    try {
      const s = await api.sites.create(form);
      setSite(s);
      reload();
      setForm(EMPTY);
      setAdding(false);
    } catch {}
    setSaving(false);
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this site?")) return;
    await api.sites.delete(id);
    reload();
  };

  const usePreset = (p: typeof PRESETS[0]) => { setForm({ ...p }); setAdding(true); };

  return (
    <div>
      <div className="flex-between mb-6">
        <h2>Wind Farm Sites</h2>
        <button className="btn flex" onClick={() => setAdding(!adding)}><Plus size={14} />{adding ? "Cancel" : "Add Site"}</button>
      </div>

      {/* Quick-add presets */}
      {adding && (
        <>
          <div className="card mb-4">
            <h3 className="text-sm text-muted mb-4">Quick Add — Real Wind Farms</h3>
            <div className="flex" style={{ flexWrap: "wrap", gap: 8 }}>
              {PRESETS.map(p => (
                <button key={p.name} className="btn-outline btn-sm flex" onClick={() => usePreset(p)}>
                  <MapPin size={12} />{p.name}
                </button>
              ))}
            </div>
          </div>

          <div className="card mb-6">
            <h3 className="text-sm text-muted mb-4">Site Details</h3>
            <div className="grid-2 mb-4">
              {([
                ["name", "Site Name", "text"],
                ["latitude", "Latitude", "number"],
                ["longitude", "Longitude", "number"],
                ["country", "Country", "text"],
                ["num_turbines", "Number of Turbines", "number"],
                ["water_depth_m", "Water Depth (m)", "number"],
                ["distance_from_port_km", "Distance from Port (km)", "number"],
                ["port_name", "Port Name", "text"],
              ] as const).map(([key, label, type]) => (
                <div key={key}>
                  <label className="text-xs text-muted">{label}</label>
                  <input type={type} value={(form as any)[key]} style={{ display: "block", width: "100%", marginTop: 4 }}
                    onChange={e => setForm({ ...form, [key]: type === "number" ? +e.target.value : e.target.value })} />
                </div>
              ))}
            </div>
            <button className="btn" onClick={save} disabled={saving || !form.name}>
              {saving ? "Saving..." : "Create Site & Fetch Weather"}
            </button>
          </div>
        </>
      )}

      {/* Existing sites */}
      {sites.length === 0 && !adding && <div className="card text-muted">No sites configured. Add your first wind farm above.</div>}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {sites.map(s => (
          <div className="card flex-between" key={s.id}>
            <div>
              <strong>{s.name}</strong>
              <div className="text-sm text-muted">{s.latitude.toFixed(2)}°N, {s.longitude.toFixed(2)}°E · {s.country}</div>
              <div className="text-xs text-muted mt-2">
                {s.num_turbines} turbines · {s.water_depth_m}m depth · {s.distance_from_port_km}km from {s.port_name || "port"}
              </div>
            </div>
            <button className="btn-outline btn-sm" onClick={() => remove(s.id)} style={{ color: "var(--red)" }}><Trash2 size={14} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
