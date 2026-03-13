const now = Date.now();
const hr = 3600000;

const randBetween = (min: number, max: number) => +(min + Math.random() * (max - min)).toFixed(2);

function genForecast(hours: number) {
  const rows = [];
  for (let i = 0; i < hours; i++) {
    const t = new Date(now + i * hr);
    const dayPhase = Math.sin((i % 24) / 24 * Math.PI * 2);
    const trend = Math.sin(i / 48 * Math.PI * 2);
    rows.push({
      forecast_time: t.toISOString(),
      wave_height_m: +(1.0 + trend * 0.8 + Math.random() * 0.4).toFixed(2),
      wave_period_s: randBetween(5, 9),
      wave_direction_deg: randBetween(180, 270),
      wind_speed_10m_ms: +(8 + trend * 5 + dayPhase * 2 + Math.random() * 3).toFixed(1),
      wind_speed_80m_ms: +(10 + trend * 6 + dayPhase * 2.5 + Math.random() * 3).toFixed(1),
      wind_speed_120m_ms: +(11 + trend * 7 + dayPhase * 3 + Math.random() * 3).toFixed(1),
      wind_direction_deg: randBetween(200, 280),
      wind_gusts_ms: +(12 + trend * 7 + Math.random() * 4).toFixed(1),
      visibility_m: +(15000 + trend * 5000 + Math.random() * 5000).toFixed(0),
      precipitation_mm: Math.random() > 0.7 ? randBetween(0, 2) : 0,
      temperature_c: randBetween(8, 14),
      cloud_cover_pct: randBetween(30, 90),
      pressure_hpa: randBetween(1005, 1025),
      current_speed_ms: randBetween(0.2, 1.2),
      current_direction_deg: randBetween(0, 360),
    });
  }
  return rows;
}

const OPS: Record<string, { label: string; color: string; limits: Record<string, number | null> }> = {
  ctv_transfer: { label: "CTV Crew Transfer", color: "#22c55e", limits: { wave_height_m: 1.5, wind_speed_10m_ms: 15, wind_gusts_ms: 20, visibility_m: 1000 } },
  sov_transfer: { label: "SOV Gangway Transfer", color: "#3b82f6", limits: { wave_height_m: 2.5, wind_speed_10m_ms: 20, wind_gusts_ms: 25, visibility_m: 500 } },
  rope_access: { label: "Blade Repair (Rope Access)", color: "#f59e0b", limits: { wave_height_m: 1.5, wind_speed_10m_ms: 12, wind_gusts_ms: 15, visibility_m: 1000 } },
  crane_ops: { label: "Crane Operations", color: "#ef4444", limits: { wave_height_m: 1.2, wind_speed_10m_ms: 10, wind_gusts_ms: 12, visibility_m: 2000 } },
  internal_work: { label: "Internal Nacelle/Tower Work", color: "#8b5cf6", limits: { wave_height_m: 1.5, wind_speed_10m_ms: 15, wind_gusts_ms: 20, visibility_m: 1000 } },
  drone_inspection: { label: "Blade Inspection (Drone)", color: "#06b6d4", limits: { wave_height_m: 2.0, wind_speed_10m_ms: 8, wind_gusts_ms: 10, visibility_m: 3000 } },
};

const INVERTED = new Set(["visibility_m"]);

function evalHour(opType: string, row: any) {
  const op = OPS[opType];
  if (!op) return { decision: "NO_GO", confidence_pct: 0, limiting_factors: [], checks: [] };
  const checks: any[] = [];
  let worst = "GO";
  const limiters: string[] = [];
  for (const [param, limit] of Object.entries(op.limits)) {
    if (limit == null) continue;
    const val = row[param];
    if (val == null) continue;
    let status = "GO";
    if (INVERTED.has(param)) {
      if (val < limit) { status = "NO_GO"; limiters.push(param); }
      else if (val < limit * 1.15) status = "MARGINAL";
    } else {
      if (val > limit) { status = "NO_GO"; limiters.push(param); }
      else if (val > limit * 0.85) status = "MARGINAL";
    }
    checks.push({ parameter: param, value: val, limit, status, is_limiting: status === "NO_GO" });
    if (status === "NO_GO") worst = "NO_GO";
    else if (status === "MARGINAL" && worst !== "NO_GO") worst = "MARGINAL";
  }
  const conf = worst === "GO" ? randBetween(82, 98) : worst === "MARGINAL" ? randBetween(55, 79) : randBetween(15, 45);
  return { decision: worst, confidence_pct: +conf.toFixed(1), limiting_factors: limiters, checks };
}

let forecast72 = genForecast(72);
let forecast336 = genForecast(336);

const DEMO_SITES = [
  { id: "demo-1", name: "Hornsea 2", latitude: 53.93, longitude: 1.79, country: "UK", num_turbines: 165, water_depth_m: 30, distance_from_port_km: 89, port_name: "Grimsby", is_active: true, created_at: new Date().toISOString() },
];

export const mock = {
  sites: {
    list: async () => DEMO_SITES,
    get: async (id: string) => DEMO_SITES.find(s => s.id === id) || DEMO_SITES[0],
    create: async (d: any) => { const s = { ...d, id: "demo-" + Date.now(), is_active: true, created_at: new Date().toISOString() }; DEMO_SITES.push(s); return s; },
    update: async (id: string, d: any) => { const s = DEMO_SITES.find(x => x.id === id); if (s) Object.assign(s, d); return s; },
    delete: async (id: string) => { const i = DEMO_SITES.findIndex(x => x.id === id); if (i >= 0) DEMO_SITES.splice(i, 1); return { status: "deleted" }; },
  },
  weather: {
    get: async (_id: string, hours = 168) => forecast336.slice(0, hours),
    refresh: async () => { forecast72 = genForecast(72); forecast336 = genForecast(336); return { status: "ok", records_ingested: 336 }; },
    refreshAll: async () => ({ status: "ok" }),
  },
  goNoGo: async (_siteId: string, hours = 48) => {
    const rows = forecast72.slice(0, hours);
    const result: Record<string, any[]> = {};
    for (const [opType, op] of Object.entries(OPS)) {
      result[opType] = rows.map(r => ({
        operation_type: opType, operation_label: op.label, color: op.color,
        forecast_time: r.forecast_time, ...evalHour(opType, r),
      }));
    }
    return result;
  },
  windows: async (_siteId: string, opType: string, minHours = 4) => {
    const rows = forecast336;
    const results = rows.map(r => ({ ...r, ...evalHour(opType, r) }));
    const windows: any[] = [];
    let start: string | null = null, confs: number[] = [], go = 0, marg = 0;
    for (const r of results) {
      if (r.decision !== "NO_GO") {
        if (!start) { start = r.forecast_time; confs = []; go = 0; marg = 0; }
        confs.push(r.confidence_pct);
        r.decision === "GO" ? go++ : marg++;
      } else if (start) {
        const dur = (new Date(r.forecast_time).getTime() - new Date(start).getTime()) / hr;
        if (dur >= minHours) {
          const avg = confs.reduce((a, b) => a + b, 0) / confs.length;
          windows.push({ start, end: r.forecast_time, duration_hours: +dur.toFixed(1), avg_confidence: +avg.toFixed(1), min_confidence: +Math.min(...confs).toFixed(1), has_marginal_periods: marg > 0, marginal_hours: marg, go_hours: go, risk_level: avg >= 80 && !marg ? "Low" : avg >= 60 ? "Medium" : "High" });
        }
        start = null;
      }
    }
    windows.sort((a, b) => b.avg_confidence - a.avg_confidence);
    return { operation_type: opType, operation_label: OPS[opType]?.label || opType, min_duration_hours: minHours, windows_found: windows.length, windows };
  },
  campaign: async (_siteId: string, op: string, days = 3) => ({ operation_type: op, required_days: days, windows: [] }),
  briefing: async (_siteId: string) => {
    const rows = forecast336;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const opTypes = Object.keys(OPS);

    const inRange = (r: any, s: Date, e: Date) => { const t = new Date(r.forecast_time); return t >= s && t < e; };
    const inWork = (r: any) => { const h = new Date(r.forecast_time).getHours(); return h >= 6 && h < 18; };
    const tmrw = new Date(today.getTime() + 86400000);

    const todayRows = rows.filter(r => inRange(r, today, tmrw) && inWork(r));
    const tmrwEnd = new Date(tmrw.getTime() + 86400000);
    const tmrwRows = rows.filter(r => inRange(r, tmrw, tmrwEnd) && inWork(r));

    const todayOps: any = {}, tmrwOps: any = {};
    for (const op of opTypes) {
      const res = todayRows.map(r => evalHour(op, r));
      const g = res.filter(r => r.decision === "GO").length;
      const m = res.filter(r => r.decision === "MARGINAL").length;
      const n = res.filter(r => r.decision === "NO_GO").length;
      const total = res.length || 1;
      const avg = res.reduce((a, r) => a + r.confidence_pct, 0) / total;
      const overall = g === total ? "GO" : n === total ? "NO_GO" : g > n ? "PARTIAL_GO" : m > 0 && n === 0 ? "MARGINAL" : "NO_GO";
      const allLim = res.flatMap(r => r.limiting_factors);
      todayOps[op] = { label: OPS[op].label, color: OPS[op].color, overall, go_hours: g, marginal_hours: m, no_go_hours: n, total_hours: total, avg_confidence: +avg.toFixed(1), window_start: todayRows[0]?.forecast_time, window_end: todayRows[Math.min(g, todayRows.length - 1)]?.forecast_time, limiting_factor: allLim.length ? allLim[0].replace(/_/g, " ") : null };

      const res2 = tmrwRows.map(r => evalHour(op, r));
      const g2 = res2.filter(r => r.decision === "GO").length;
      const t2 = res2.length || 1;
      tmrwOps[op] = { label: OPS[op].label, go_hours: g2, total_hours: t2, avg_confidence: +(res2.reduce((a, r) => a + r.confidence_pct, 0) / t2).toFixed(1), outlook: g2 >= t2 * 0.8 ? "Good" : g2 > 0 ? "Mixed" : "Poor" };
    }

    const daily = [];
    for (let d = 0; d < 7; d++) {
      const ds = new Date(today.getTime() + d * 86400000);
      const de = new Date(ds.getTime() + 86400000);
      const dr = rows.filter(r => inRange(r, ds, de));
      const wr = dr.filter(inWork);
      const ops: any = {};
      for (const op of opTypes) {
        const res = wr.map(r => evalHour(op, r));
        const g = res.filter(r => r.decision === "GO").length;
        ops[op] = { go_hours: g, total_hours: wr.length, rating: g >= wr.length * 0.8 ? "good" : g > 0 ? "mixed" : "poor" };
      }
      const hsVals = dr.map(r => r.wave_height_m).filter(Boolean);
      const wsVals = dr.map(r => r.wind_speed_10m_ms).filter(Boolean);
      daily.push({ date: ds.toISOString().slice(0, 10), day_name: ds.toLocaleDateString("en-GB", { weekday: "long" }), avg_wave_height_m: hsVals.length ? +(hsVals.reduce((a: number, b: number) => a + b, 0) / hsVals.length).toFixed(1) : null, avg_wind_speed_ms: wsVals.length ? +(wsVals.reduce((a: number, b: number) => a + b, 0) / wsVals.length).toFixed(1) : null, operations: ops });
    }

    const cur = rows[0] || {};
    return {
      site_name: "Hornsea 2", generated_at: new Date().toISOString(), target_date: new Date().toISOString(),
      current_conditions: { time: cur.forecast_time, wave_height_m: cur.wave_height_m, wave_period_s: cur.wave_period_s, wind_speed_10m_ms: cur.wind_speed_10m_ms, wind_speed_80m_ms: cur.wind_speed_80m_ms, wind_gusts_ms: cur.wind_gusts_ms, visibility_m: cur.visibility_m, precipitation_mm: cur.precipitation_mm, temperature_c: cur.temperature_c },
      today: todayOps, tomorrow: tmrwOps, windows_next_7_days: {}, daily_summary: daily,
    };
  },
  operationProfiles: async () => Object.fromEntries(Object.entries(OPS).map(([k, v]) => [k, { ...v, min_window_hours: 4, typical_duration_hours: 8 }])),
};
