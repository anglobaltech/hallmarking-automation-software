import { useState } from 'react';
import { Scissors, Plus, Search, Eye, Edit2, Trash2, Save, XCircle, Download, Loader2, Zap } from 'lucide-react';
import { laserApi } from '../api/laser.js';
import { toast } from '../components/Toast.jsx';
import { useModuleData } from '../hooks/useModuleData.js';

const articleTypes = ['Necklace', 'Ring', 'Bangle', 'Bracelet', 'Earring', 'Chain', 'Pendant', 'Anklet', 'Mangalsutra', 'Other'];
const materials = ['Gold 24K', 'Gold 22K', 'Gold 18K', 'Gold 14K', 'Silver 999', 'Silver 925', 'Platinum', 'Other'];

const EMPTY = {
  job_date: new Date().toISOString().split('T')[0],
  jeweller_name: '', jeweller_id: '', phone: '',
  article_type: 'Ring', material: 'Gold 22K',
  pieces: '', weight: '', huid: '', start_huid: '', end_huid: '',
  description: '', operator: '', charges: '', payment_mode: 'Cash',
  status: 'Pending', remarks: '',
};

function FormModal({ onClose, editData, onSaved }) {
  const [form, setForm] = useState(editData ? {
    ...EMPTY, ...editData,
    job_date: editData.job_date ? editData.job_date.split('T')[0] : EMPTY.job_date,
  } : EMPTY);
  const [saving, setSaving] = useState(false);
  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.jeweller_name || !form.article_type) { toast('Fill required fields', 'error'); return; }
    setSaving(true);
    try {
      if (editData?.id) { await laserApi.update(editData.id, form); toast('Job updated'); }
      else { await laserApi.create(form); toast('Job created'); }
      onSaved(); onClose();
    } catch (err) { toast(err.message, 'error'); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
      <form onSubmit={submit} className="bg-white border border-slate-200 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 flex items-center justify-center"><Scissors size={18} className="text-purple-400" /></div>
            <div><h3 className="text-slate-800 font-bold">{editData ? 'Edit Job' : 'New Laser Job'}</h3><p className="text-xs text-slate-500">HUID Laser Marking</p></div>
          </div>
          <button type="button" onClick={onClose} className="text-slate-500 hover:text-slate-800"><XCircle size={20} /></button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <div><label className="block text-xs text-slate-600 mb-1.5">Date *</label>
              <input type="date" name="job_date" value={form.job_date} onChange={handle} className="w-full input-dark rounded-xl px-3 py-2 text-sm" /></div>
            <div><label className="block text-xs text-slate-600 mb-1.5">Operator</label>
              <input name="operator" value={form.operator} onChange={handle} className="w-full input-dark rounded-xl px-3 py-2 text-sm" placeholder="Operator name" /></div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div><label className="block text-xs text-slate-600 mb-1.5">Jeweller Name *</label>
              <input name="jeweller_name" value={form.jeweller_name} onChange={handle} required className="w-full input-dark rounded-xl px-3 py-2 text-sm" placeholder="Shop name" /></div>
            <div><label className="block text-xs text-slate-600 mb-1.5">Phone</label>
              <input name="phone" value={form.phone} onChange={handle} className="w-full input-dark rounded-xl px-3 py-2 text-sm" placeholder="Mobile" /></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div><label className="block text-xs text-slate-600 mb-1.5">Article Type *</label>
              <select name="article_type" value={form.article_type} onChange={handle} className="w-full input-dark rounded-xl px-3 py-2 text-sm">
                {articleTypes.map(t => <option key={t}>{t}</option>)}</select></div>
            <div><label className="block text-xs text-slate-600 mb-1.5">Material *</label>
              <select name="material" value={form.material} onChange={handle} className="w-full input-dark rounded-xl px-3 py-2 text-sm">
                {materials.map(m => <option key={m}>{m}</option>)}</select></div>
            <div><label className="block text-xs text-slate-600 mb-1.5">Pieces *</label>
              <input type="number" name="pieces" value={form.pieces} onChange={handle} className="w-full input-dark rounded-xl px-3 py-2 text-sm" min={1} placeholder="Count" /></div>
            <div><label className="block text-xs text-slate-600 mb-1.5">Weight (g)</label>
              <input type="number" name="weight" value={form.weight} onChange={handle} step="0.001" className="w-full input-dark rounded-xl px-3 py-2 text-sm" placeholder="0.000" /></div>
            <div className="col-span-2"><label className="block text-xs text-slate-600 mb-1.5">Description</label>
              <input name="description" value={form.description} onChange={handle} className="w-full input-dark rounded-xl px-3 py-2 text-sm" placeholder="Item description" /></div>
          </div>

          <div className="glass-panel border border-purple-500/20 rounded-xl p-6">
            <h4 className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-3 flex items-center gap-2"><Zap size={12} /> HUID Details</h4>
            <div className="grid grid-cols-3 gap-6">
              <div><label className="block text-xs text-slate-600 mb-1.5">HUID</label>
                <input name="huid" value={form.huid} onChange={handle} className="w-full input-dark rounded-xl px-3 py-2 text-sm font-mono" placeholder="H202407XXXX" /></div>
              <div><label className="block text-xs text-slate-600 mb-1.5">Start HUID</label>
                <input name="start_huid" value={form.start_huid} onChange={handle} className="w-full input-dark rounded-xl px-3 py-2 text-sm font-mono" placeholder="Range start" /></div>
              <div><label className="block text-xs text-slate-600 mb-1.5">End HUID</label>
                <input name="end_huid" value={form.end_huid} onChange={handle} className="w-full input-dark rounded-xl px-3 py-2 text-sm font-mono" placeholder="Range end" /></div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div><label className="block text-xs text-slate-600 mb-1.5">Charges (₹) *</label>
              <input type="number" name="charges" value={form.charges} onChange={handle} className="w-full input-dark rounded-xl px-3 py-2 text-sm" placeholder="Amount" /></div>
            <div><label className="block text-xs text-slate-600 mb-1.5">Payment</label>
              <select name="payment_mode" value={form.payment_mode} onChange={handle} className="w-full input-dark rounded-xl px-3 py-2 text-sm">
                <option>Cash</option><option>UPI</option><option>Bank Transfer</option><option>Credit</option></select></div>
            <div><label className="block text-xs text-slate-600 mb-1.5">Status</label>
              <select name="status" value={form.status} onChange={handle} className="w-full input-dark rounded-xl px-3 py-2 text-sm">
                <option>Pending</option><option>Processing</option><option>Completed</option></select></div>
          </div>

          <div><label className="block text-xs text-slate-600 mb-1.5">Remarks</label>
            <textarea name="remarks" value={form.remarks} onChange={handle} rows={2} className="w-full input-dark rounded-xl px-3 py-2 text-sm resize-none" /></div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-4 flex gap-3 justify-end rounded-b-2xl">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 text-sm hover:text-slate-800 transition-all">Cancel</button>
          <button type="submit" disabled={saving}
            className="px-5 py-2 rounded-xl  from-purple-500 to-purple-600 text-slate-800 text-sm font-semibold flex items-center gap-2 disabled:opacity-50">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {editData ? 'Update' : 'Create Job'}
          </button>
        </div>
      </form>
    </div>
  );
}

const statusColor = { Completed: 'badge-completed', Pending: 'badge-pending', Processing: 'badge-processing' };

export default function LaserCutting() {
  const { items, stats, loading, total, params, updateParam, deleteItem, reload } = useModuleData(laserApi);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);

  const statsCards = [
    { label: "Today's Jobs", value: stats?.today_jobs || 0, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'Total Pieces', value: stats?.today_pieces || 0, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Pending', value: stats?.pending || 0, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { label: "Today's Revenue", value: `₹${parseFloat(stats?.today_revenue || 0).toLocaleString('en-IN')}`, color: 'text-green-400', bg: 'bg-green-500/10' },
  ];

  return (
    <div className="page-enter space-y-6 pb-12">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((s, i) => (
          <div key={i} className={`${s.bg} border border-slate-200 rounded-xl p-6 card-glow`}>
            <p className="text-xs text-slate-500 mb-1">{s.label}</p>
            <p className={`text-2xl font-bold tracking-tight ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 flex-1 max-w-xs">
          <Search size={14} className="text-slate-600" />
          <input value={params.search} onChange={e => updateParam('search', e.target.value)}
            placeholder="Search job, jeweller..."
            className="bg-transparent text-sm text-slate-800 placeholder-slate-500 outline-none w-full" />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-300 text-slate-600 text-sm hover:text-slate-800 transition-all"><Download size={14} /> Export</button>
          <button onClick={() => { setEditData(null); setShowForm(true); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl  from-purple-500 to-purple-600 text-slate-800 text-sm font-semibold shadow-lg shadow-purple-500/20">
            <Plus size={14} /> New Job
          </button>
        </div>
      </div>

      <div className="glass-panel border border-slate-200 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 gap-3">
            <Loader2 size={20} className="animate-spin text-purple-400" />
            <span className="text-slate-600 text-sm">Loading jobs...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-dark">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-100">
                  {['Job ID', 'Date', 'Jeweller', 'Article', 'Pieces', 'Weight', 'HUID', 'Charges', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-600 px-5 py-3.5 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map(j => (
                  <tr key={j.id} className="hover:bg-purple-500/5 transition-colors">
                    <td className="px-5 py-3.5 text-xs font-mono text-purple-400">{j.id}</td>
                    <td className="px-5 py-3.5 text-xs text-slate-600">{j.job_date ? new Date(j.job_date).toLocaleDateString('en-IN') : '—'}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-800">{j.jeweller_name}</td>
                    <td className="px-5 py-3.5 text-xs text-slate-700">{j.article_type} · {j.material}</td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-slate-800">{j.pieces}</td>
                    <td className="px-5 py-3.5 text-xs text-slate-600">{j.weight ? `${j.weight}g` : '—'}</td>
                    <td className="px-5 py-3.5 text-xs font-mono text-amber-400">{j.huid || '—'}</td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-green-400">₹{parseFloat(j.charges || 0).toLocaleString('en-IN')}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor[j.status] || 'badge-pending'}`}>{j.status}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        <button onClick={() => { setEditData(j); setShowForm(true); }} className="p-1.5 rounded-xl text-slate-600 hover:text-amber-400 hover:bg-amber-500/10 transition-all"><Edit2 size={13} /></button>
                        <button onClick={() => deleteItem(j.id, j.jeweller_name)} className="p-1.5 rounded-xl text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr><td colSpan={10} className="px-4 py-12 text-center text-slate-500">
                    No jobs found. <button onClick={() => { setEditData(null); setShowForm(true); }} className="text-purple-400 hover:underline">Create one</button>
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        <div className="border-t border-slate-200 px-5 py-3.5">
          <p className="text-xs text-slate-500">Showing {items.length} of {total} records</p>
        </div>
      </div>

      {showForm && <FormModal onClose={() => setShowForm(false)} editData={editData} onSaved={reload} />}
    </div>
  );
}
