import { BarChart3, Download, Calendar, TrendingUp, TrendingDown } from 'lucide-react';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
const revenueData = [28000, 35000, 42000, 38000, 55000, 61000, 47000];
const maxRev = Math.max(...revenueData);

export default function Reports() {
  return (
    <div className="page-enter space-y-6 pb-12">
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
        <div className="flex gap-2">
          <select className="input-dark rounded-xl px-3 py-2 text-sm">
            <option>This Month</option><option>Last Month</option><option>This Year</option><option>Custom</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 text-sm hover:bg-amber-500/30 transition-all">
            <Download size={14} /> Export PDF
          </button>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="glass-panel border border-slate-200 rounded-xl p-6">
        <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
          <TrendingUp size={16} className="text-amber-400" /> Monthly Revenue (₹)
        </h3>
        <div className="flex items-end gap-3 h-40">
          {revenueData.map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[10px] text-slate-500">{(v / 1000).toFixed(0)}k</span>
              <div
                className="w-full bg-gradient-to-t from-amber-500 to-amber-400/70 rounded-t-lg transition-all hover:from-amber-400 hover:to-amber-300/70 cursor-pointer"
                style={{ height: `${(v / maxRev) * 100}%`, minHeight: '8px' }}
              />
              <span className="text-[10px] text-slate-500">{months[i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total HUID Issued', value: '1,248', change: '+12%', up: true },
          { label: 'Tests Conducted', value: '342', change: '+8%', up: true },
          { label: 'Failed Tests', value: '18', change: '-3%', up: false },
        ].map((s, i) => (
          <div key={i} className="glass-panel border border-slate-200 rounded-xl p-6">
            <p className="text-xs text-slate-500 mb-1">{s.label}</p>
            <div className="flex items-end justify-between">
              <p className="text-2xl font-bold tracking-tight text-slate-800">{s.value}</p>
              <span className={`text-xs flex items-center gap-1 ${s.up ? 'text-green-400' : 'text-red-400'}`}>
                {s.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {s.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-panel border border-slate-200 rounded-xl p-6">
        <h3 className="text-sm font-bold text-slate-800 mb-4">Module-wise Activity (This Month)</h3>
        <div className="space-y-4">
          {[
            { label: 'BIS HUID', value: 203, max: 250, color: 'bg-amber-400' },
            { label: 'Laser Cutting', value: 178, max: 250, color: 'bg-purple-400' },
            { label: 'XRF Testing', value: 89, max: 150, color: 'bg-cyan-400' },
            { label: 'Soldering', value: 45, max: 100, color: 'bg-orange-400' },
            { label: 'Fire Assaying', value: 32, max: 60, color: 'bg-red-400' },
            { label: 'Gold Exchange', value: 21, max: 40, color: 'bg-emerald-400' },
          ].map((item, i) => (
            <div key={i}>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-700">{item.label}</span>
                <span className="text-slate-600">{item.value} jobs</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div className={`h-2 ${item.color} rounded-full transition-all duration-700`}
                  style={{ width: `${(item.value / item.max) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
