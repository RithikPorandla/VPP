const now = Date.now(), hr = 3600000;
const r = (a: number, b: number) => +(a + Math.random() * (b - a)).toFixed(2);

function genForecast(hours: number) {
  const rows = [];
  for (let i = 0; i < hours; i++) {
    const t = new Date(now + i * hr);
    const phase = Math.sin(i / 24 * Math.PI * 2);
    const trend = Math.sin(i / 60 * Math.PI * 2);
    const storm = i > 36 && i < 54 ? 1.5 : i > 100 && i < 120 ? 1.8 : 0;
    rows.push({
      forecast_time: t.toISOString(),
      wave_height_m: +(0.9 + trend * 0.6 + storm * 0.7 + Math.random() * 0.3).toFixed(2),
      wave_period_s: r(5, 10), wave_direction_deg: r(200, 280),
      wind_speed_10m_ms: +(7 + trend * 4 + phase * 1.5 + storm * 5 + Math.random() * 2).toFixed(1),
      wind_speed_80m_ms: +(9 + trend * 5 + phase * 2 + storm * 6 + Math.random() * 2).toFixed(1),
      wind_speed_120m_ms: +(10 + trend * 6 + phase * 2.5 + storm * 7 + Math.random() * 2).toFixed(1),
      wind_direction_deg: r(200, 280),
      wind_gusts_ms: +(11 + trend * 6 + storm * 8 + Math.random() * 3).toFixed(1),
      visibility_m: +(20000 - storm * 12000 + Math.random() * 5000).toFixed(0),
      precipitation_mm: storm > 0 ? r(0.5, 4) : Math.random() > 0.8 ? r(0, 1) : 0,
      temperature_c: r(6, 13), cloud_cover_pct: r(20, 85),
      pressure_hpa: r(1005, 1025), current_speed_ms: r(0.2, 1.0), current_direction_deg: r(0, 360),
    });
  }
  return rows;
}

const OPS: Record<string, { label: string; color: string; limits: Record<string, number> }> = {
  ctv_transfer: { label: "CTV Transfer", color: "#10b981", limits: { wave_height_m: 1.5, wind_speed_10m_ms: 15, wind_gusts_ms: 20, visibility_m: 1000 } },
  sov_transfer: { label: "SOV Gangway", color: "#3b82f6", limits: { wave_height_m: 2.5, wind_speed_10m_ms: 20, wind_gusts_ms: 25, visibility_m: 500 } },
  rope_access: { label: "Rope Access", color: "#f59e0b", limits: { wave_height_m: 1.5, wind_speed_10m_ms: 12, wind_gusts_ms: 15, visibility_m: 1000 } },
  crane_ops: { label: "Crane Ops", color: "#ef4444", limits: { wave_height_m: 1.2, wind_speed_10m_ms: 10, wind_gusts_ms: 12, visibility_m: 2000 } },
  internal_work: { label: "Internal Work", color: "#8b5cf6", limits: { wave_height_m: 1.5, wind_speed_10m_ms: 15, wind_gusts_ms: 20, visibility_m: 1000 } },
  drone_inspection: { label: "Drone Inspection", color: "#06b6d4", limits: { wave_height_m: 2.0, wind_speed_10m_ms: 8, wind_gusts_ms: 10, visibility_m: 3000 } },
};
const INV = new Set(["visibility_m"]);

function evalHour(op: string, row: any) {
  const o = OPS[op]; if (!o) return { decision: "NO_GO", confidence_pct: 0, limiting_factors: [] as string[], checks: [] as any[] };
  let worst = "GO"; const lim: string[] = [], checks: any[] = [];
  for (const [p, limit] of Object.entries(o.limits)) {
    const v = row[p]; if (v == null) continue;
    let s = "GO";
    if (INV.has(p)) { if (v < limit) { s = "NO_GO"; lim.push(p); } else if (v < limit * 1.2) s = "MARGINAL"; }
    else { if (v > limit) { s = "NO_GO"; lim.push(p); } else if (v > limit * 0.82) s = "MARGINAL"; }
    checks.push({ parameter: p, value: v, limit, status: s, is_limiting: s === "NO_GO" });
    if (s === "NO_GO") worst = "NO_GO"; else if (s === "MARGINAL" && worst !== "NO_GO") worst = "MARGINAL";
  }
  const conf = worst === "GO" ? r(82, 97) : worst === "MARGINAL" ? r(52, 78) : r(10, 40);
  return { decision: worst, confidence_pct: +conf.toFixed(1), limiting_factors: lim, checks };
}

let f72 = genForecast(72), f336 = genForecast(336);

const SITES = [
  { id: "vineyard-1", name: "Vineyard Wind 1", latitude: 41.025, longitude: -70.521, country: "US", num_turbines: 62, water_depth_m: 42, distance_from_port_km: 24, port_name: "New Bedford", is_active: true, created_at: new Date().toISOString() },
  { id: "hornsea-2", name: "Hornsea 2", latitude: 53.91, longitude: 1.55, country: "UK", num_turbines: 165, water_depth_m: 30, distance_from_port_km: 89, port_name: "Grimsby", is_active: true, created_at: new Date().toISOString() },
  { id: "dogger-a", name: "Dogger Bank A", latitude: 54.75, longitude: 2.05, country: "UK", num_turbines: 95, water_depth_m: 25, distance_from_port_km: 130, port_name: "Port of Tyne", is_active: true, created_at: new Date().toISOString() },
];

export const mock = {
  sites: {
    list: async () => SITES,
    get: async (id: string) => SITES.find(s => s.id === id) || SITES[0],
    create: async (d: any) => { const s = { ...d, id: "s-" + Date.now(), is_active: true, created_at: new Date().toISOString() }; SITES.push(s); return s; },
    update: async (id: string, d: any) => { const s = SITES.find(x => x.id === id); if (s) Object.assign(s, d); return s; },
    delete: async (id: string) => { const i = SITES.findIndex(x => x.id === id); if (i >= 0) SITES.splice(i, 1); return { status: "deleted" }; },
  },
  weather: {
    get: async (_: string, h = 168) => f336.slice(0, h),
    refresh: async () => { f72 = genForecast(72); f336 = genForecast(336); return { status: "ok", records_ingested: 336 }; },
    refreshAll: async () => ({ status: "ok" }),
  },
  goNoGo: async (_: string, hours = 48) => {
    const rows = f72.slice(0, hours), res: Record<string, any[]> = {};
    for (const [k, o] of Object.entries(OPS))
      res[k] = rows.map(row => ({ operation_type: k, operation_label: o.label, color: o.color, forecast_time: row.forecast_time, ...evalHour(k, row) }));
    return res;
  },
  windows: async (_: string, op: string, minH = 4) => {
    const results = f336.map(row => ({ ...row, ...evalHour(op, row) }));
    const wins: any[] = []; let st: string | null = null, cs: number[] = [], g = 0, m = 0;
    for (const row of results) {
      if (row.decision !== "NO_GO") {
        if (!st) { st = row.forecast_time; cs = []; g = 0; m = 0; }
        cs.push(row.confidence_pct); row.decision === "GO" ? g++ : m++;
      } else if (st) {
        const dur = (new Date(row.forecast_time).getTime() - new Date(st).getTime()) / hr;
        if (dur >= minH) { const avg = cs.reduce((a, b) => a + b, 0) / cs.length; wins.push({ start: st, end: row.forecast_time, duration_hours: +dur.toFixed(1), avg_confidence: +avg.toFixed(1), min_confidence: +Math.min(...cs).toFixed(1), has_marginal_periods: m > 0, marginal_hours: m, go_hours: g, risk_level: avg >= 80 && !m ? "Low" : avg >= 60 ? "Medium" : "High" }); }
        st = null;
      }
    }
    wins.sort((a, b) => b.avg_confidence - a.avg_confidence);
    return { operation_type: op, operation_label: OPS[op]?.label || op, min_duration_hours: minH, windows_found: wins.length, windows: wins };
  },
  campaign: async (_: string, op: string, days = 3) => ({ operation_type: op, required_days: days, windows: [] }),
  briefing: async (_: string) => {
    const rows = f336, td = new Date(); td.setHours(0, 0, 0, 0);
    const opKeys = Object.keys(OPS);
    const inR = (row: any, s: Date, e: Date) => { const t = new Date(row.forecast_time); return t >= s && t < e; };
    const isWork = (row: any) => { const h = new Date(row.forecast_time).getHours(); return h >= 6 && h < 18; };
    const tmrw = new Date(td.getTime() + 86400000), tmrwE = new Date(tmrw.getTime() + 86400000);
    const tRows = rows.filter(row => inR(row, td, tmrw) && isWork(row));
    const mRows = rows.filter(row => inR(row, tmrw, tmrwE) && isWork(row));

    const todayOps: any = {}, tmrwOps: any = {};
    for (const op of opKeys) {
      const res = tRows.map(row => evalHour(op, row));
      const g = res.filter(x => x.decision === "GO").length, m = res.filter(x => x.decision === "MARGINAL").length, n = res.filter(x => x.decision === "NO_GO").length, tot = res.length || 1;
      const avg = res.reduce((a, x) => a + x.confidence_pct, 0) / tot;
      const overall = g === tot ? "GO" : n === tot ? "NO_GO" : g > n ? "PARTIAL_GO" : m > 0 && n === 0 ? "MARGINAL" : "NO_GO";
      const lims = res.flatMap(x => x.limiting_factors);
      todayOps[op] = { label: OPS[op].label, color: OPS[op].color, overall, go_hours: g, marginal_hours: m, no_go_hours: n, total_hours: tot, avg_confidence: +avg.toFixed(1), window_start: tRows[0]?.forecast_time, window_end: tRows[Math.min(g, tRows.length - 1)]?.forecast_time, limiting_factor: lims.length ? lims[0].replace(/_/g, " ") : null };
      const res2 = mRows.map(row => evalHour(op, row)); const g2 = res2.filter(x => x.decision === "GO").length, t2 = res2.length || 1;
      tmrwOps[op] = { label: OPS[op].label, go_hours: g2, total_hours: t2, avg_confidence: +(res2.reduce((a, x) => a + x.confidence_pct, 0) / t2).toFixed(1), outlook: g2 >= t2 * 0.8 ? "Good" : g2 > 0 ? "Mixed" : "Poor" };
    }

    const daily = [];
    for (let d = 0; d < 7; d++) {
      const ds = new Date(td.getTime() + d * 86400000), de = new Date(ds.getTime() + 86400000);
      const dr = rows.filter(row => inR(row, ds, de)), wr = dr.filter(isWork);
      const ops: any = {};
      for (const op of opKeys) { const res = wr.map(row => evalHour(op, row)); const g = res.filter(x => x.decision === "GO").length; ops[op] = { go_hours: g, total_hours: wr.length, rating: g >= wr.length * 0.8 ? "good" : g > 0 ? "mixed" : "poor" }; }
      const hs = dr.map(x => x.wave_height_m).filter(Boolean) as number[], ws = dr.map(x => x.wind_speed_10m_ms).filter(Boolean) as number[];
      daily.push({ date: ds.toISOString().slice(0, 10), day_name: ds.toLocaleDateString("en-GB", { weekday: "long" }), avg_wave_height_m: hs.length ? +(hs.reduce((a, b) => a + b, 0) / hs.length).toFixed(1) : null, avg_wind_speed_ms: ws.length ? +(ws.reduce((a, b) => a + b, 0) / ws.length).toFixed(1) : null, operations: ops });
    }

    const c = rows[0] || {} as any;
    return { site_name: "Vineyard Wind 1", generated_at: new Date().toISOString(), target_date: new Date().toISOString(), current_conditions: { time: c.forecast_time, wave_height_m: c.wave_height_m, wave_period_s: c.wave_period_s, wind_speed_10m_ms: c.wind_speed_10m_ms, wind_speed_80m_ms: c.wind_speed_80m_ms, wind_gusts_ms: c.wind_gusts_ms, visibility_m: c.visibility_m, precipitation_mm: c.precipitation_mm, temperature_c: c.temperature_c }, today: todayOps, tomorrow: tmrwOps, windows_next_7_days: {}, daily_summary: daily };
  },
  operationProfiles: async () => Object.fromEntries(Object.entries(OPS).map(([k, v]) => [k, { ...v, min_window_hours: 4, typical_duration_hours: 8 }])),
};
