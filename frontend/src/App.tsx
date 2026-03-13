import { BrowserRouter, Routes, Route, NavLink, Navigate } from "react-router-dom";
import { useState, useEffect, createContext, useContext } from "react";
import { Wind, BarChart3, Calendar, Search, Settings, RefreshCw } from "lucide-react";
import { api } from "./api";
import Dashboard from "./pages/Dashboard";
import WindowFinder from "./pages/WindowFinder";
import Briefing from "./pages/Briefing";
import SiteSetup from "./pages/SiteSetup";

type Site = { id: string; name: string; latitude: number; longitude: number; [k: string]: any };
type Ctx = { site: Site | null; sites: Site[]; setSite: (s: Site) => void; reload: () => void };
export const AppCtx = createContext<Ctx>({ site: null, sites: [], setSite: () => {}, reload: () => {} });
export const useSite = () => useContext(AppCtx);

export default function App() {
  const [sites, setSites] = useState<Site[]>([]);
  const [site, setSite] = useState<Site | null>(null);
  const reload = () => api.sites.list().then((s: Site[]) => { setSites(s); if (!site && s.length) setSite(s[0]); }).catch(() => {});

  useEffect(() => { reload(); }, []);

  const nav = [
    { to: "/dashboard", icon: <BarChart3 size={16} />, label: "Dashboard" },
    { to: "/windows", icon: <Search size={16} />, label: "Window Finder" },
    { to: "/briefing", icon: <Calendar size={16} />, label: "Daily Briefing" },
    { to: "/sites", icon: <Settings size={16} />, label: "Sites" },
  ];

  return (
    <AppCtx.Provider value={{ site, sites, setSite, reload }}>
      <BrowserRouter>
        <div className="layout">
          <nav className="sidebar">
            <h1><Wind size={20} style={{ verticalAlign: "middle", marginRight: 6 }} />WeatherEdge</h1>
            {site && (
              <select value={site.id} onChange={e => { const s = sites.find(x => x.id === e.target.value); if (s) setSite(s); }}
                style={{ marginBottom: 16, width: "100%" }}>
                {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            )}
            {nav.map(n => <NavLink key={n.to} to={n.to} className={({ isActive }) => isActive ? "active" : ""}>{n.icon}{n.label}</NavLink>)}
          </nav>
          <main className="main">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/windows" element={<WindowFinder />} />
              <Route path="/briefing" element={<Briefing />} />
              <Route path="/sites" element={<SiteSetup />} />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AppCtx.Provider>
  );
}
