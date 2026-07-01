import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, BadgeCheck, Scissors, FlaskConical, Flame,
  Repeat2, Wrench, ChevronLeft, ChevronRight,
  Settings, X, Gem, BarChart3, Users
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { label: 'BIS HUID', icon: BadgeCheck, path: '/bis-huid', desc: 'Jeweller & Licenses' },
  { label: 'Laser Cutting', icon: Scissors, path: '/laser-cutting', desc: 'Laser Marking Jobs' },
  { label: 'XRF Testing', icon: FlaskConical, path: '/xrf-testing', desc: 'Purity Analysis' },
  { label: 'Soldering', icon: Wrench, path: '/soldering', desc: 'Repairs & Soldering' },
  { label: 'Fire Assaying', icon: Flame, path: '/fire-assaying', desc: 'Cupellation Analysis' },
  { label: 'Gold Exchange', icon: Repeat2, path: '/gold-exchange', desc: 'Buy, Sell, Trade' },
  { label: 'Reports', icon: BarChart3, path: '/reports', desc: 'Analytics & Export' },
  { label: 'Customers', icon: Users, path: '/customers', desc: 'Client Directory' },
];

export default function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const location = useLocation();

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-slate-200/60 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      {/* Logo */}
      <div className={`flex items-center gap-3.5 px-6 py-8 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center shadow-sm shadow-amber-500/20 shrink-0">
          <Gem size={18} className="text-white drop-shadow-sm" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden transition-all duration-300">
            <h1 className="text-[17px] font-bold text-slate-800 tracking-tight leading-tight">Hallmark<span className="text-amber-500">Pro</span></h1>
            <p className="text-[9.5px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-0.5">Management</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
        <p className={`text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-3 ${collapsed ? 'text-center' : ''}`}>
          {collapsed ? '—' : 'Menu'}
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 group relative
                ${isActive
                  ? 'bg-amber-50/80 text-amber-700 shadow-sm border border-amber-100/50'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-transparent'
                }
                ${collapsed ? 'justify-center' : ''}
              `}
              title={collapsed ? item.label : ''}
            >
              {isActive && !collapsed && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-amber-500 rounded-r-full shadow-[0_0_8px_rgba(245,158,11,0.4)]" />
              )}
              <Icon size={18} className={`shrink-0 transition-all duration-300 ${isActive ? 'text-amber-600' : 'text-slate-400 group-hover:text-slate-500'}`} />
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <span className="block text-[14px] font-medium tracking-wide">{item.label}</span>
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Area */}
      <div className="p-4 border-t border-slate-100/60 space-y-2">
        <NavLink
          to="/settings"
          className={({ isActive }) => `flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-[14px] ${isActive ? 'bg-amber-50/80 text-amber-700 border border-amber-100/50' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-transparent'} ${collapsed ? 'justify-center' : ''}`}
        >
          <Settings size={18} className="shrink-0" />
          {!collapsed && <span>Settings</span>}
        </NavLink>

        <div className={`mt-2 p-3 rounded-xl bg-slate-50/50 border border-slate-100 ${collapsed ? 'text-center' : 'flex items-center gap-3'}`}>
          <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-700 flex items-center justify-center shrink-0 mx-auto shadow-sm">
            <span className="text-xs font-bold tracking-wider">HC</span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">Admin User</p>
              <p className="text-[10.5px] font-medium text-slate-500 truncate">admin@hallmark.com</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Desktop Sidebar */}
      <aside className={`hidden md:block h-full sidebar-transition relative shrink-0 z-30 ${collapsed ? 'w-24' : 'w-72'}`}>
        <SidebarContent />
        {/* Toggle Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3.5 top-10 w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all z-40 text-slate-500 hover:text-slate-800"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </aside>

      {/* Mobile Sidebar */}
      <aside className={`md:hidden fixed top-0 left-0 h-full z-50 w-72 sidebar-transition ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <button onClick={() => setMobileOpen(false)} className="absolute top-6 right-4 text-slate-400 hover:text-slate-800 z-50 p-2 bg-white rounded-full shadow-sm">
          <X size={20} />
        </button>
        <SidebarContent />
      </aside>
    </>
  );
}
