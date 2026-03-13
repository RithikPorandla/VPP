const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
const j = (r: Response) => r.ok ? r.json() : r.json().then(e => Promise.reject(e));
const get = (p: string) => fetch(`${BASE}${p}`).then(j);
const post = (p: string, b?: unknown) => fetch(`${BASE}${p}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: b ? JSON.stringify(b) : undefined }).then(j);
const del = (p: string) => fetch(`${BASE}${p}`, { method: "DELETE" }).then(j);
const patch = (p: string, b: unknown) => fetch(`${BASE}${p}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(b) }).then(j);

export const api = {
  sites: {
    list: () => get("/sites"),
    get: (id: string) => get(`/sites/${id}`),
    create: (d: any) => post("/sites", d),
    update: (id: string, d: any) => patch(`/sites/${id}`, d),
    delete: (id: string) => del(`/sites/${id}`),
  },
  weather: {
    get: (siteId: string, hours = 168) => get(`/sites/${siteId}/weather?hours=${hours}`),
    refresh: (siteId: string) => post(`/sites/${siteId}/weather/refresh`),
    refreshAll: () => post("/weather/refresh-all"),
  },
  goNoGo: (siteId: string, hours = 48) => get(`/sites/${siteId}/go-no-go?hours=${hours}`),
  windows: (siteId: string, op: string, minHours = 4, marginal = true) =>
    post(`/sites/${siteId}/windows`, { operation_type: op, min_duration_hours: minHours, include_marginal: marginal }),
  campaign: (siteId: string, op: string, days = 3) =>
    post(`/sites/${siteId}/campaign-windows`, { operation_type: op, required_days: days }),
  briefing: (siteId: string) => get(`/sites/${siteId}/briefing`),
  operationProfiles: () => get("/operation-profiles"),
};
