import { useState } from 'react';
import {
  BadgeCheck, Scissors, FlaskConical, Wrench, Flame, Repeat2,
  TrendingUp, ArrowRight, Activity, CheckCircle2, Clock, AlertTriangle, Gem
} from 'lucide-react';
import { Link } from 'react-router-dom';

const stats = [
  { label: "Today's HUID Jobs", value: '24', sub: '+3 from yesterday', icon: BadgeCheck, color: 'text-amber-500', bg: 'bg-amber-100', path: '/bis-huid' },
  { label: 'Laser Marking', value: '18', sub: '142 pieces cut', icon: Scissors, color: 'text-purple-500', bg: 'bg-purple-100', path: '/laser-cutting' },
  { label: 'XRF Tests', value: '9', sub: '1 failed test today', icon: FlaskConical, color: 'text-cyan-500', bg: 'bg-cyan-100', path: '/xrf-testing' },
  { label: 'Soldering Jobs', value: '6', sub: '2 currently active', icon: Wrench, color: 'text-orange-500', bg: 'bg-orange-100', path: '/soldering' },
  { label: 'Fire Assays', value: '4', sub: 'All assays passed', icon: Flame, color: 'text-red-500', bg: 'bg-red-100', path: '/fire-assaying' },
  { label: 'Gold Exchanges', value: '₹3.68L', sub: '5 transactions total', icon: Repeat2, color: 'text-emerald-500', bg: 'bg-emerald-100', path: '/gold-exchange' },
];

const recentActivities = [
  { id: 'LC-004', type: 'Laser Cutting', jeweller: 'Suresh Kumar Jewellers', detail: 'Ring · Gold 22K · 3 pcs', time: '10 min ago', status: 'Completed', badge: 'badge-completed' },
  { id: 'XR-004', type: 'XRF Test', jeweller: 'Anita Gold House', detail: 'Necklace · 91.8% purity', time: '25 min ago', status: 'Passed', badge: 'badge-completed' },
  { id: 'GX-004', type: 'Exchange', jeweller: 'Rajput Ornaments', detail: 'Buy · 30g · ₹1,89,000', time: '1 hr ago', status: 'Completed', badge: 'badge-completed' },
  { id: 'FA-003', type: 'Fire Assay', jeweller: 'New Customer', detail: 'Bangle · 87.5% fineness', time: '2 hrs ago', status: 'Failed', badge: 'badge-failed' },
  { id: 'SO-003', type: 'Soldering', jeweller: 'Suresh Kumar', detail: 'Bracelet repair', time: '3 hrs ago', status: 'Processing', badge: 'badge-processing' },
];

const pendingAlerts = [
  { msg: '3 BIS licenses expiring in 30 days', type: 'warning' },
  { msg: 'XRF Test #XR-002 failed - Manager approval needed', type: 'error' },
];

export default function Dashboard() {
  return (
    <div className="page-enter space-y-6 pb-12">
      {/* Welcome Banner */}
      <div className="glass-panel p-6 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden group">
        <div className="absolute inset-0  from-amber-50 to-transparent opacity-80 pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight mb-2">
            Good afternoon, Admin
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            Here's what's happening at your hallmarking centre today.
          </p>
        </div>
        <div className="relative z-10 flex items-center gap-6 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br bg-gradient-to-tr from-amber-400 to-amber-300 shadow-sm shadow-amber-500/20 text-white flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0">
            <TrendingUp size={28} className="text-white" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Today's Revenue</p>
            <p className="text-2xl font-bold tracking-tight text-slate-800">₹4,12,580</p>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {pendingAlerts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {pendingAlerts.map((a, i) => (
            <div key={i} className={`flex items-center gap-6 p-6 rounded-xl border bg-white text-sm font-bold shadow-sm
              ${a.type === 'error'
                ? 'border-red-200 text-red-700'
                : 'border-amber-200 text-amber-700'}`}>
              <AlertTriangle size={18} className={a.type === 'error' ? 'text-red-500' : 'text-amber-500'} shrink-0 />
              {a.msg}
            </div>
          ))}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <Link key={i} to={s.path} className="glass-panel p-6 card-glow flex flex-col relative overflow-hidden group block">
              <div className="flex items-start justify-between mb-6">
                <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>
                  <Icon size={24} className={s.color} />
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-amber-500 group-hover:border-amber-500 transition-colors">
                  <ArrowRight size={14} className="text-slate-400 group-hover:text-white transition-colors" />
                </div>
              </div>
              <div className="mt-auto">
                <p className="text-2xl font-bold tracking-tight text-slate-800 mb-1 tracking-tight">{s.value}</p>
                <p className="text-sm font-bold text-slate-600 mb-1">{s.label}</p>
                <p className="text-xs font-medium text-slate-400">{s.sub}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Lower Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Recent Activity Table */}
        <div className="xl:col-span-2 glass-panel overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shadow-inner">
                <Activity size={18} className="text-amber-600" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-800 tracking-tight">Live Activity Feed</h3>
            </div>
            <button className="text-sm font-bold text-amber-500 hover:text-amber-600 transition-colors">View All</button>
          </div>
          
          <div className="flex-1 overflow-x-auto">
            <table className="table-dark w-full">
              <thead>
                <tr>
                  <th className="text-left">Job ID</th>
                  <th className="text-left">Details</th>
                  <th className="text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentActivities.map((a) => (
                  <tr key={a.id}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-6">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                          <span className="text-[10px] font-bold text-slate-500 tracking-wider">{a.id.split('-')[0]}</span>
                        </div>
                        <div>
                          <p className="text-sm font-extrabold text-slate-800 font-mono tracking-tight">{a.id}</p>
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{a.type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-bold text-slate-700">{a.jeweller}</p>
                      <p className="text-xs font-medium text-slate-500 mt-1">{a.detail}</p>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span className={`inline-flex px-3 py-1.5 text-xs font-bold rounded-xl shadow-sm ${a.badge}`}>
                        {a.status}
                      </span>
                      <p className="text-[10px] text-slate-400 font-bold mt-2">{a.time}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Sidebar Widgets */}
        <div className="flex flex-col gap-6">
          
          {/* Progress Widget */}
          <div className="glass-panel p-6">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle2 size={20} className="text-emerald-500" />
              <h3 className="text-base font-extrabold text-slate-800 tracking-tight">Today's Progress</h3>
            </div>
            <div className="space-y-6">
              {[
                { label: 'HUID Tags Issued', val: 24, max: 30, color: 'bg-amber-400' },
                { label: 'Purity Tests Passed', val: 8, max: 9, color: 'bg-emerald-500' },
                { label: 'Repairs Completed', val: 12, max: 16, color: 'bg-purple-500' },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between items-end mb-2.5">
                    <span className="text-sm font-bold text-slate-600">{item.label}</span>
                    <span className="text-sm font-extrabold text-slate-800">{item.val} <span className="text-slate-400 text-xs">/ {item.max}</span></span>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full border border-slate-200 overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-1000 ease-out shadow-sm`}
                      style={{ width: `${(item.val / item.max) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Action Widget */}
          <div className="glass-panel p-6">
            <div className="flex items-center gap-3 mb-6">
              <Clock size={20} className="text-amber-500" />
              <h3 className="text-base font-extrabold text-slate-800 tracking-tight">Pending Actions</h3>
            </div>
            <div className="space-y-3">
              {[
                { type: 'XRF Testing Required', count: 3, color: 'text-cyan-600', bg: 'bg-cyan-100' },
                { type: 'Pending Soldering', count: 2, color: 'text-orange-600', bg: 'bg-orange-100' },
                { type: 'Gold Exchange Approvals', count: 1, color: 'text-emerald-600', bg: 'bg-emerald-100' },
              ].map((j, i) => (
                <div key={i} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all cursor-pointer">
                  <span className={`text-sm font-bold ${j.color}`}>{j.type}</span>
                  <span className={`text-xs font-extrabold px-2.5 py-1 rounded-xl shadow-sm ${j.bg} ${j.color}`}>{j.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Gold Rate Widget */}
          <div className="glass-panel p-6 bg-gradient-to-br from-amber-50 to-transparent relative overflow-hidden border-amber-100">
            <Gem size={140} className="absolute -bottom-10 -right-10 text-amber-500/5 rotate-12 pointer-events-none" />
            <div className="relative z-10">
              <h3 className="text-xs font-extrabold text-amber-600 uppercase tracking-widest mb-5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.6)]" /> Live Gold Rate
              </h3>
              <div className="space-y-4">
                {[
                  { k: '24K (999)', r: '₹6,850' },
                  { k: '22K (916)', r: '₹6,279' },
                  { k: '18K (750)', r: '₹5,138' },
                ].map((g, i) => (
                  <div key={i} className="flex justify-between items-center pb-3 border-b border-amber-500/10 last:border-0 last:pb-0">
                    <span className="text-sm font-bold text-slate-600">{g.k}</span>
                    <span className="text-base font-extrabold text-slate-800">{g.r}<span className="text-xs text-slate-400 font-bold ml-1">/g</span></span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
