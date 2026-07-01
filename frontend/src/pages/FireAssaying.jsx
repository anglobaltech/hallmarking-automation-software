import { useState } from 'react';
import { Flame, Plus, Search, Edit2, Trash2, Save, XCircle, Download, Loader2, Activity } from 'lucide-react';
import { fireApi } from '../api/fire.js';
import { toast } from '../components/Toast.jsx';
import { useModuleData } from '../hooks/useModuleData.js';

const EMPTY = {
  assay_date: new Date().toISOString().split('T')[0],
  sample_id: '', jeweller_name: '', phone: '', bis_license: '',
  article_type: 'Ring', material: 'Gold', article_weight: '', huid: '', pieces: '1',
  cupel_no: '', crucible_no: '', sample_weight: '0.250', lead_weight: '',
  silver_used: '', ash_weight: '', bead_weight: '', parcel_weight: '',
  purity: '', fineness: '', hallmark_grade: '916', result: 'Pass',
  furnace_temp: '900', operator: '', charges: '', payment_mode: 'Cash', remarks: '',
};

function FormModal({ onClose, editData, onSaved }) {
  const [form, setForm] = useState(editData ? {
    ...EMPTY, ...editData,
    assay_date: editData.assay_date ? editData.assay_date.split('T')[0] : EMPTY.assay_date,
  } : EMPTY);
  const [saving, setSaving] = useState(false);
  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const calcFineness = () => {
    const bead = parseFloat(form.bead_weight) || 0;
    const sample = parseFloat(form.sample_weight) || 0;
    if (sample > 0) {
      const fin = Math.round((bead / sample) * 1000);
      const pur = ((bead / sample) * 100).toFixed(2);
      setForm(f => ({ ...f, fineness: fin.toString(), purity: pur }));
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.jeweller_name || !form.article_type) { toast('Fill required fields', 'error'); return; }
    setSaving(true);
    try {
      if (editData?.id) { await fireApi.update(editData.id, form); toast('Assay updated'); }
      else { await fireApi.create(form); toast('Assay saved'); }
      onSaved(); onClose();
    } catch (err) { toast(err.message, 'error'); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
      <form onSubmit={submit} className="bg-white border border-slate-200 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-500/20 flex items-center justify-center"><Flame size={18} className="text-red-400" /></div>
            <div><h3 className="text-slate-800 font-bold">Fire Assay Entry</h3><p className="text-xs text-slate-500">Cupellation Analysis</p></div>
          </div>
          <button type="button" onClick={onClose} className="text-slate-500 hover:text-slate-800"><XCircle size={20} /></button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <div><label className="block text-xs text-slate-600 mb-1.5">Date *</label>
              <input type="date" name="assay_date" value={form.assay_date} onChange={handle} className="w-full input-dark rounded-xl px-3 py-2 text-sm" /></div>
            <div><label className="block text-xs text-slate-600 mb-1.5">Sample ID *</label>
              <input name="sample_id" value={form.sample_id} onChange={handle} className="w-full input-dark rounded-xl px-3 py-2 text-sm font-mono" placeholder="FA-SMP001" /></div>
            <div><label className="block text-xs text-slate-600 mb-1.5">Jeweller Name *</label>
              <input name="jeweller_name" value={form.jeweller_name} onChange={handle} required className="w-full input-dark rounded-xl px-3 py-2 text-sm" placeholder="Shop name" /></div>
            <div><label className="block text-xs text-slate-600 mb-1.5">Phone</label>
              <input name="phone" value={form.phone} onChange={handle} className="w-full input-dark rounded-xl px-3 py-2 text-sm" /></div>
            <div><label className="block text-xs text-slate-600 mb-1.5">Article Type *</label>
              <select name="article_type" value={form.article_type} onChange={handle} className="w-full input-dark rounded-xl px-3 py-2 text-sm">
                {['Ring','Necklace','Bangle','Earring','Chain','Bar','Coin','Other'].map(t => <option key={t}>{t}</option>)}</select></div>
            <div><label className="block text-xs text-slate-600 mb-1.5">Material</label>
              <select name="material" value={form.material} onChange={handle} className="w-full input-dark rounded-xl px-3 py-2 text-sm">
                <option>Gold</option><option>Silver</option><option>Platinum</option></select></div>
            <div><label className="block text-xs text-slate-600 mb-1.5">Article Weight (g)</label>
              <input type="number" name="article_weight" value={form.article_weight} onChange={handle} step="0.001" className="w-full input-dark rounded-xl px-3 py-2 text-sm" /></div>
            <div><label className="block text-xs text-slate-600 mb-1.5">Furnace Temp (°C)</label>
              <input type="number" name="furnace_temp" value={form.furnace_temp} onChange={handle} className="w-full input-dark rounded-xl px-3 py-2 text-sm" /></div>
          </div>

          <div className="glass-panel border border-red-500/20 rounded-xl p-6">
            <h4 className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-3 flex items-center gap-2"><Activity size={12} /> Cupellation Data</h4>
            <div className="grid grid-cols-3 gap-3">
              <div><label className="block text-xs text-slate-600 mb-1.5">Cupel No.</label>
                <input name="cupel_no" value={form.cupel_no} onChange={handle} className="w-full input-dark rounded-xl px-3 py-2 text-sm" /></div>
              <div><label className="block text-xs text-slate-600 mb-1.5">Sample Wt (g) *</label>
                <input type="number" name="sample_weight" value={form.sample_weight} onChange={handle} step="0.0001" className="w-full input-dark rounded-xl px-3 py-2 text-sm" /></div>
              <div><label className="block text-xs text-slate-600 mb-1.5">Lead Added (g)</label>
                <input type="number" name="lead_weight" value={form.lead_weight} onChange={handle} step="0.0001" className="w-full input-dark rounded-xl px-3 py-2 text-sm" /></div>
              <div><label className="block text-xs text-slate-600 mb-1.5">Silver Added (g)</label>
                <input type="number" name="silver_used" value={form.silver_used} onChange={handle} step="0.0001" className="w-full input-dark rounded-xl px-3 py-2 text-sm" /></div>
              <div><label className="block text-xs text-slate-600 mb-1.5">Ash Wt (g)</label>
                <input type="number" name="ash_weight" value={form.ash_weight} onChange={handle} step="0.0001" className="w-full input-dark rounded-xl px-3 py-2 text-sm" /></div>
              <div><label className="block text-xs text-slate-600 mb-1.5">Bead Wt (g) *</label>
                <input type="number" name="bead_weight" value={form.bead_weight} onChange={handle} step="0.0001" className="w-full input-dark rounded-xl px-3 py-2 text-sm font-bold" /></div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-3 items-end">
              <div><label className="block text-xs text-slate-600 mb-1.5">Purity (%)</label>
                <input type="number" name="purity" value={form.purity} onChange={handle} step="0.01" className="w-full input-dark rounded-xl px-3 py-2 text-sm font-bold" /></div>
              <div><label className="block text-xs text-slate-600 mb-1.5">Fineness (ppt)</label>
                <input type="number" name="fineness" value={form.fineness} onChange={handle} className="w-full input-dark rounded-xl px-3 py-2 text-sm font-bold" /></div>
              <button onClick={calcFineness} type="button"
                className="px-3 py-2 bg-red-500/20 text-red-400 rounded-xl text-xs hover:bg-red-500/30 transition-all h-10">Calculate →</button>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div><label className="block text-xs text-slate-600 mb-1.5">Hallmark Grade</label>
                <select name="hallmark_grade" value={form.hallmark_grade} onChange={handle} className="w-full input-dark rounded-xl px-3 py-2 text-sm">
                  {['999','995','990','958','916','875','750','585'].map(g => <option key={g}>{g}</option>)}</select></div>
              <div><label className="block text-xs text-slate-600 mb-1.5">Result *</label>
                <select name="result" value={form.result} onChange={handle} className="w-full input-dark rounded-xl px-3 py-2 text-sm">
                  <option>Pass</option><option>Fail</option><option>Borderline</option></select></div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div><label className="block text-xs text-slate-600 mb-1.5">Operator</label>
              <input name="operator" value={form.operator} onChange={handle} className="w-full input-dark rounded-xl px-3 py-2 text-sm" /></div>
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
            className="px-5 py-2 rounded-xl  from-red-500 to-red-600 text-slate-800 text-sm font-semibold flex items-center gap-2 disabled:opacity-50">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {editData ? 'Update' : 'Save Assay'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function FireAssaying() {
  const { items, stats, loading, total, params, updateParam, deleteItem, reload } = useModuleData(fireApi);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);

  const statsCards = [
    { label: "Today's Assays", value: stats?.today_assays || 0, color: 'text-red-400', bg: 'bg-red-500/10' },
    { label: 'Pass Rate', value: stats?.total > 0 ? `${Math.round((stats.pass_count / stats.total) * 100)}%` : '—', color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: 'Avg Purity', value: stats?.avg_purity ? `${stats.avg_purity}%` : '—', color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Revenue', value: `₹${parseFloat(stats?.today_revenue || 0).toLocaleString('en-IN')}`, color: 'text-purple-400', bg: 'bg-purple-500/10' },
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
            placeholder="Search sample, jeweller..." className="bg-transparent text-sm text-slate-800 placeholder-slate-500 outline-none w-full" />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-300 text-slate-600 text-sm hover:text-slate-800 transition-all"><Download size={14} /> Export</button>
          <button onClick={() => { setEditData(null); setShowForm(true); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl  from-red-500 to-red-600 text-slate-800 text-sm font-semibold shadow-lg shadow-red-500/20">
            <Plus size={14} /> New Assay
          </button>
        </div>
      </div>

      <div className="glass-panel border border-slate-200 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 gap-3">
            <Loader2 size={20} className="animate-spin text-red-400" />
            <span className="text-slate-600 text-sm">Loading assays...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-dark">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-100">
                  {['Assay ID', 'Date', 'Sample ID', 'Jeweller', 'Article', 'Sample Wt', 'Bead Wt', 'Purity%', 'Grade', 'Result', 'Charges', 'Actions'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-600 px-5 py-3.5 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map(a => (
                  <tr key={a.id} className="hover:bg-red-500/5 transition-colors">
                    <td className="px-5 py-3.5 text-xs font-mono text-red-400">{a.id}</td>
                    <td className="px-5 py-3.5 text-xs text-slate-600">{a.assay_date ? new Date(a.assay_date).toLocaleDateString('en-IN') : '—'}</td>
                    <td className="px-5 py-3.5 text-xs font-mono text-slate-700">{a.sample_id || '—'}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-800">{a.jeweller_name}</td>
                    <td className="px-5 py-3.5 text-xs text-slate-700">{a.article_type}</td>
                    <td className="px-5 py-3.5 text-xs text-slate-600">{a.sample_weight ? `${a.sample_weight}g` : '—'}</td>
                    <td className="px-5 py-3.5 text-xs font-semibold text-slate-800">{a.bead_weight ? `${a.bead_weight}g` : '—'}</td>
                    <td className="px-5 py-3.5 text-xs font-bold text-amber-400">{a.purity ? `${a.purity}%` : '—'}</td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-mono bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded">{a.hallmark_grade}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${a.result === 'Pass' ? 'badge-completed' : 'badge-failed'}`}>{a.result}</span>
                    </td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-green-400">₹{parseFloat(a.charges || 0).toLocaleString('en-IN')}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        <button onClick={() => { setEditData(a); setShowForm(true); }} className="p-1.5 rounded-xl text-slate-600 hover:text-amber-400 hover:bg-amber-500/10 transition-all"><Edit2 size={13} /></button>
                        <button onClick={() => deleteItem(a.id, a.jeweller_name)} className="p-1.5 rounded-xl text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr><td colSpan={12} className="px-4 py-12 text-center text-slate-500">No assays found.</td></tr>
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
