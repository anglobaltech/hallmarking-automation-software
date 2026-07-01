import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import ToastContainer from './components/Toast';
import Dashboard from './pages/Dashboard';
import BisHuid from './pages/BisHuid';
import LaserCutting from './pages/LaserCutting';
import XRFTesting from './pages/XRFTesting';
import Soldering from './pages/Soldering';
import FireAssaying from './pages/FireAssaying';
import GoldExchange from './pages/GoldExchange';
import Reports from './pages/Reports';
import Customers from './pages/Customers';
import SettingsPage from './pages/SettingsPage';

const pageMeta = {
  '/': { title: 'Dashboard', desc: 'Overview of all hallmarking operations' },
  '/bis-huid': { title: 'BIS HUID Management', desc: 'Jeweller registration & BIS license tracking' },
  '/laser-cutting': { title: 'Laser Cutting & Marking', desc: 'HUID laser marking job management' },
  '/xrf-testing': { title: 'XRF Testing', desc: 'X-Ray Fluorescence purity analysis' },
  '/soldering': { title: 'Soldering', desc: 'Jewellery repair & soldering jobs' },
  '/fire-assaying': { title: 'Fire Assaying', desc: 'Cupellation & fire assay analysis' },
  '/gold-exchange': { title: 'Gold Exchange', desc: 'Buy, sell & exchange transactions' },
  '/reports': { title: 'Reports & Analytics', desc: 'Daily, weekly & monthly reports' },
  '/customers': { title: 'Customer Management', desc: 'Jeweller & customer records' },
  '/settings': { title: 'Settings', desc: 'Centre configuration & preferences' },
};

export default function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const meta = pageMeta[location.pathname] || { title: 'Hallmarking Centre', desc: '' };

  return (
    <div className="flex h-screen bg-transparent overflow-hidden">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative w-full">
        <TopBar
          collapsed={collapsed}
          setMobileOpen={setMobileOpen}
          pageTitle={meta.title}
          pageDesc={meta.desc}
        />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 w-full">
          <div className="max-w-[1600px] mx-auto w-full">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/bis-huid" element={<BisHuid />} />
              <Route path="/laser-cutting" element={<LaserCutting />} />
              <Route path="/xrf-testing" element={<XRFTesting />} />
              <Route path="/soldering" element={<Soldering />} />
              <Route path="/fire-assaying" element={<FireAssaying />} />
              <Route path="/gold-exchange" element={<GoldExchange />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </div>
        </main>
      </div>
      <ToastContainer />
    </div>
  );
}
