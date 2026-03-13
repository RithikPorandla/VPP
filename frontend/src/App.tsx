import { BrowserRouter, Routes, Route, NavLink, Navigate } from "react-router-dom";
import { useState, useEffect, createContext, useContext } from "react";
import { Wind, LayoutDashboard, Calendar, Search, Settings, Zap } from "lucide-react";
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
  const reload = () => api.sites.list().then((s: Site[]) => { setSites(s); if (!site && s.length) setSite(s[0]); else if (site) { const found = s.find(x => x.id === site.id); if (found) setSite(found); } }).catch(() => {});
  useEffect(() => { reload(); }, []);

  return (
    <AppCtx.Provider value={{ site, sites, setSite, reload }}>
      <BrowserRouter>
        <div className="shell">
          <nav className="nav">
            <div className="nav-brand"><Zap size={20} />WeatherEdge</div>
            <div className="nav-sub">Offshore Weather Intelligence</div>

            {sites.length > 0 && (
              <select className="site-select" value={site?.id || ""} onChange={e => { const s = sites.find(x => x.id === e.target.value); if (s) setSite(s); }}>
                {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            )}

            <div className="nav-section">Operations</div>
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? "active" : ""}><LayoutDashboard size={16}/>Dashboard</NavLink>
            <NavLink to="/briefing" className={({ isActive }) => isActive ? "active" : ""}><Calendar size={16}/>Daily Briefing</NavLink>
            <NavLink to="/windows" className={({ isActive }) => isActive ? "active" : ""}><Search size={16}/>Window Finder</NavLink>

            <div className="nav-section">Configuration</div>
            <NavLink to="/sites" className={({ isActive }) => isActive ? "active" : ""}><Settings size={16}/>Wind Farm Sites</NavLink>

            <div className="nav-footer">
              <div className="txs tmuted" style={{ padding: "0 12px" }}>
                {site && <><Wind size={12} style={{ verticalAlign: "middle", marginRight: 4 }} />{site.num_turbines} turbines · {site.distance_from_port_km}km from {site.port_name}</>}
              </div>
            </div>
          </nav>
          <main className="content">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/briefing" element={<Briefing />} />
              <Route path="/windows" element={<WindowFinder />} />
              <Route path="/sites" element={<SiteSetup />} />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AppCtx.Provider>
  );
}
