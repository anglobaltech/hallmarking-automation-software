import { useState } from 'react';
import { Wrench, Plus, Search, Edit2, Trash2, Save, XCircle, Download, Loader2 } from 'lucide-react';
import { solderingApi } from '../api/soldering.js';
import { toast } from '../components/Toast.jsx';
import { useModuleData } from '../hooks/useModuleData.js';

const EMPTY = {
  job_date: new Date().toISOString().split('T')[0],
  jeweller_name: '', phone: '', article_type: 'Ring', material: 'Gold 22K',
  weight: '', huid: '', pieces: '1', issue: '', issue_desc: '',
  solder_type: 'Easy', solder_weight: '', estimated_time: '',
  operator: '', delivery_date: '', status: 'Pending', charges: '', payment_mode: 'Cash', remarks: '',
};

function FormModal({ onClose, editData, onSaved }) {
  const [form, setForm] = useState(editData ? {
    ...EMPTY, ...editData,
    job_date: editData.job_date ? editData.job_date.split('T')[0] : EMPTY.job_date,
    delivery_date: editData.delivery_date ? editData.delivery_date.split('T')[0] : '',
  } : EMPTY);
  const [saving, setSaving] = useState(false);
  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.jeweller_name || !form.article_type) { toast('Fill required fields', 'error'); return; }
    setSaving(true);
    try {
      if (editData?.id) { await solderingApi.update(editData.id, form); toast('Job updated'); }
      else { await solderingApi.create(form); toast('Job created'); }
      onSaved(); onClose();
    } catch (err) { toast(err.message, 'error'); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
      <form onSubmit={submit} className="bg-white border border-slate-200 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500/20 flex items-center justify-center"><Wrench size={18} className="text-orange-400" /></div>
            <div><h3 className="text-slate-800 font-bold">{editData ? 'Edit Job' : 'New Soldering Job'}</h3><p className="text-xs text-slate-500">Jewellery Repair</p></div>
          </div>
          <button type="button" onClick={onClose} className="text-slate-500 hover:text-slate-800"><XCircle size={20} /></button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <div><label className="block text-xs text-slate-600 mb-1.5">Date *</label>
              <input type="date" name="job_date" value={form.job_date} onChange={handle} className="w-full input-dark rounded-xl px-3 py-2 text-sm" /></div>
            <div><label className="block text-xs text-slate-600 mb-1.5">Delivery Date</label>
              <input type="date" name="delivery_date" value={form.delivery_date} onChange={handle} className="w-full input-dark rounded-xl px-3 py-2 text-sm" /></div>
            <div><label className="block text-xs text-slate-600 mb-1.5">Jeweller Name *</label>
              <input name="jeweller_name" value={form.jeweller_name} onChange={handle} required className="w-full input-dark rounded-xl px-3 py-2 text-sm" placeholder="Name / shop" /></div>
            <div><label className="block text-xs text-slate-600 mb-1.5">Phone</label>
              <input name="phone" value={form.phone} onChange={handle} className="w-full input-dark rounded-xl px-3 py-2 text-sm" /></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div><label className="block text-xs text-slate-600 mb-1.5">Article Type *</label>
              <select name="article_type" value={form.article_type} onChange={handle} className="w-full input-dark rounded-xl px-3 py-2 text-sm">
                {['Ring','Necklace','Bangle','Earring','Chain','Pendant','Anklet','Other'].map(t => <option key={t}>{t}</option>)}</select></div>
            <div><label className="block text-xs text-slate-600 mb-1.5">Material</label>
              <select name="material" value={form.material} onChange={handle} className="w-full input-dark rounded-xl px-3 py-2 text-sm">
                {['Gold 24K','Gold 22K','Gold 18K','Gold 14K','Silver 999','Silver 925','Platinum'].map(m => <option key={m}>{m}</option>)}</select></div>
            <div><label className="block text-xs text-slate-600 mb-1.5">Weight (g)</label>
              <input type="number" name="weight" value={form.weight} onChange={handle} step="0.001" className="w-full input-dark rounded-xl px-3 py-2 text-sm" placeholder="0.000" /></div>
            <div><label className="block text-xs text-slate-600 mb-1.5">HUID</label>
              <input name="huid" value={form.huid} onChange={handle} className="w-full input-dark rounded-xl px-3 py-2 text-sm font-mono" /></div>
            <div><label className="block text-xs text-slate-600 mb-1.5">Work Type</label>
              <select name="issue" value={form.issue} onChange={handle} className="w-full input-dark rounded-xl px-3 py-2 text-sm">
                <option value="">Select...</option>
                {['Broken clasp','Ring sizing','Chain repair','Prong re-tip','Stone setting','Polish','Rhodium plating','Custom soldering','Remodelling','Other'].map(i => <option key={i}>{i}</option>)}</select></div>
            <div><label className="block text-xs text-slate-600 mb-1.5">Solder Type</label>
              <select name="solder_type" value={form.solder_type} onChange={handle} className="w-full input-dark rounded-xl px-3 py-2 text-sm">
                <option>Easy</option><option>Medium</option><option>Hard</option><option>IT Solder</option></select></div>
            <div><label className="block text-xs text-slate-600 mb-1.5">Solder Added (g)</label>
              <input type="number" name="solder_weight" value={form.solder_weight} onChange={handle} step="0.001" className="w-full input-dark rounded-xl px-3 py-2 text-sm" placeholder="0.000" /></div>
            <div><label className="block text-xs text-slate-600 mb-1.5">Operator</label>
              <input name="operator" value={form.operator} onChange={handle} className="w-full input-dark rounded-xl px-3 py-2 text-sm" /></div>
            <div><label className="block text-xs text-slate-600 mb-1.5">Status</label>
              <select name="status" value={form.status} onChange={handle} className="w-full input-dark rounded-xl px-3 py-2 text-sm">
                <option>Pending</option><option>In Progress</option><option>Completed</option><option>Delivered</option></select></div>
          </div>

          <div><label className="block text-xs text-slate-600 mb-1.5">Work Description</label>
            <textarea name="issue_desc" value={form.issue_desc} onChange={handle} rows={2} className="w-full input-dark rounded-xl px-3 py-2 text-sm resize-none" placeholder="Describe work needed..." /></div>

          <div className="grid grid-cols-2 gap-6">
            <div><label className="block text-xs text-slate-600 mb-1.5">Charges (₹) *</label>
              <input type="number" name="charges" value={form.charges} onChange={handle} className="w-full input-dark rounded-xl px-3 py-2 text-sm" /></div>
            <div><label className="block text-xs text-slate-600 mb-1.5">Payment</label>
              <select name="payment_mode" value={form.payment_mode} onChange={handle} className="w-full input-dark rounded-xl px-3 py-2 text-sm">
                <option>Cash</option><option>UPI</option><option>Bank Transfer</option><option>Credit</option></select></div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-4 flex gap-3 justify-end rounded-b-2xl">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 text-sm hover:text-slate-800 transition-all">Cancel</button>
          <button type="submit" disabled={saving}
            className="px-5 py-2 rounded-xl  from-orange-500 to-orange-600 text-slate-800 text-sm font-semibold flex items-center gap-2 disabled:opacity-50">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {editData ? 'Update' : 'Create Job'}
          </button>
        </div>
      </form>
    </div>
  );
}

const statusColor = { Completed: 'badge-completed', 'In Progress': 'badge-processing', Pending: 'badge-pending', Delivered: 'badge-completed' };

export default function Soldering() {
  const { items, stats, loading, total, params, updateParam, deleteItem, reload } = useModuleData(solderingApi);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);

  const statsCards = [
    { label: 'Active Jobs', value: stats?.active || 0, color: 'text-orange-400', bg: 'bg-orange-500/10' },
    { label: 'Pending', value: stats?.pending || 0, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { label: 'Completed Today', value: stats?.completed_today || 0, color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: 'Revenue', value: `₹${parseFloat(stats?.today_revenue || 0).toLocaleString('en-IN')}`, color: 'text-amber-400', bg: 'bg-amber-500/10' },
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
            placeholder="Search job..." className="bg-transparent text-sm text-slate-800 placeholder-slate-500 outline-none w-full" />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-300 text-slate-600 text-sm hover:text-slate-800 transition-all"><Download size={14} /> Export</button>
          <button onClick={() => { setEditData(null); setShowForm(true); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl  from-orange-500 to-orange-600 text-slate-800 text-sm font-semibold shadow-lg shadow-orange-500/20">
            <Plus size={14} /> New Job
          </button>
        </div>
      </div>

      <div className="glass-panel border border-slate-200 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 gap-3">
            <Loader2 size={20} className="animate-spin text-orange-400" />
            <span className="text-slate-600 text-sm">Loading jobs...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-dark">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-100">
                  {['Job ID', 'Date', 'Jeweller', 'Article', 'Issue', 'Material', 'Operator', 'Delivery', 'Status', 'Charges', 'Actions'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-600 px-5 py-3.5 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map(j => (
                  <tr key={j.id} className="hover:bg-orange-500/5 transition-colors">
                    <td className="px-5 py-3.5 text-xs font-mono text-orange-400">{j.id}</td>
                    <td className="px-5 py-3.5 text-xs text-slate-600">{j.job_date ? new Date(j.job_date).toLocaleDateString('en-IN') : '—'}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-800">{j.jeweller_name}</td>
                    <td className="px-5 py-3.5 text-xs text-slate-700">{j.article_type}</td>
                    <td className="px-5 py-3.5 text-xs text-slate-600">{j.issue || '—'}</td>
                    <td className="px-5 py-3.5 text-xs text-slate-700">{j.material || '—'}</td>
                    <td className="px-5 py-3.5 text-xs text-slate-700">{j.operator || '—'}</td>
                    <td className="px-5 py-3.5 text-xs text-slate-600">{j.delivery_date ? new Date(j.delivery_date).toLocaleDateString('en-IN') : '—'}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor[j.status] || 'badge-pending'}`}>{j.status}</span>
                    </td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-green-400">₹{parseFloat(j.charges || 0).toLocaleString('en-IN')}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        <button onClick={() => { setEditData(j); setShowForm(true); }} className="p-1.5 rounded-xl text-slate-600 hover:text-amber-400 hover:bg-amber-500/10 transition-all"><Edit2 size={13} /></button>
                        <button onClick={() => deleteItem(j.id, j.jeweller_name)} className="p-1.5 rounded-xl text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr><td colSpan={11} className="px-4 py-12 text-center text-slate-500">No jobs found.</td></tr>
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
