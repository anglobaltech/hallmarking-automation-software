import { useState } from 'react';
import { Users, Plus, Search, Eye, Edit2, Phone, Mail, MapPin } from 'lucide-react';

const customers = [
  { id: 'C001', name: 'Suresh Kumar', shop: 'Suresh Kumar Jewellers', phone: '9876543210', email: 'suresh@skjewels.com', city: 'Jaipur', totalJobs: 45, lastVisit: '2026-06-30' },
  { id: 'C002', name: 'Anita Sharma', shop: 'Anita Gold House', phone: '9812345678', email: 'anita@anitagold.com', city: 'Ajmer', totalJobs: 28, lastVisit: '2026-06-28' },
  { id: 'C003', name: 'Vikram Rajput', shop: 'Rajput Ornaments', phone: '9988776655', email: 'vikram@rajputornaments.com', city: 'Jodhpur', totalJobs: 63, lastVisit: '2026-07-01' },
];

export default function Customers() {
  const [search, setSearch] = useState('');
  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.shop.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-enter space-y-6 pb-12">
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 flex-1 max-w-xs">
          <Search size={14} className="text-slate-600" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search customer..." className="bg-transparent text-sm text-slate-800 placeholder-slate-500 outline-none w-full" />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl  bg-gradient-to-tr from-amber-500 to-amber-400 shadow-sm shadow-amber-500/20 text-white text-slate-800 text-sm font-semibold shadow-lg shadow-amber-500/20">
          <Plus size={14} /> Add Customer
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(c => (
          <div key={c.id} className="glass-panel border border-slate-200 rounded-xl p-6 card-glow hover:border-amber-500/20 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-slate-800 text-sm font-bold">{c.name[0]}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{c.name}</p>
                  <p className="text-xs text-slate-500">{c.shop}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button className="p-1.5 rounded-xl text-slate-600 hover:text-amber-400 hover:bg-amber-500/10 transition-all"><Eye size={13} /></button>
                <button className="p-1.5 rounded-xl text-slate-600 hover:text-amber-400 hover:bg-amber-500/10 transition-all"><Edit2 size={13} /></button>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Phone size={11} /> {c.phone}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Mail size={11} /> {c.email}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <MapPin size={11} /> {c.city}
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-200 flex justify-between items-center">
              <div>
                <p className="text-xs text-slate-500">Total Jobs</p>
                <p className="text-lg font-bold text-amber-400">{c.totalJobs}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">Last Visit</p>
                <p className="text-xs text-slate-800">{new Date(c.lastVisit).toLocaleDateString('en-IN')}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
