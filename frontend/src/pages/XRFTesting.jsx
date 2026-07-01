import { useState } from 'react';
import { FlaskConical, Plus, Search, Edit2, Trash2, Save, XCircle, Download, Loader2, Zap } from 'lucide-react';
import { xrfApi } from '../api/xrf.js';
import { toast } from '../components/Toast.jsx';
import { useModuleData } from '../hooks/useModuleData.js';

const EMPTY = {
  test_date: new Date().toISOString().split('T')[0],
  sample_id: '', jeweller_name: '', jeweller_id: '', phone: '', bis_license: '',
  article_type: 'Ring', huid: '', pieces: '1', weight: '', declared_purity: '',
  machine: 'XRF Analyzer',
  gold_pct: '', silver_pct: '', copper_pct: '', zinc_pct: '', other_pct: '',
  tested_purity: '', result: 'Pass', operator: '', charges: '', payment_mode: 'Cash', remarks: '',
};

function FormModal({ onClose, editData, onSaved }) {
  const [form, setForm] = useState(editData ? {
    ...EMPTY, ...editData,
    test_date: editData.test_date ? editData.test_date.split('T')[0] : EMPTY.test_date,
  } : EMPTY);
  const [saving, setSaving] = useState(false);
  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const calcPurity = () => setForm(f => ({ ...f, tested_purity: parseFloat(f.gold_pct || 0).toFixed(2) }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.jeweller_name || !form.article_type) { toast('Fill required fields', 'error'); return; }
    setSaving(true);
    try {
      if (editData?.id) { await xrfApi.update(editData.id, form); toast('Test updated'); }
      else { await xrfApi.create(form); toast('Test saved'); }
      onSaved(); onClose();
    } catch (err) { toast(err.message, 'error'); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
      <form onSubmit={submit} className="bg-white border border-slate-200 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 flex items-center justify-center"><FlaskConical size={18} className="text-cyan-400" /></div>
            <div><h3 className="text-slate-800 font-bold">XRF Test Entry</h3><p className="text-xs text-slate-500">X-Ray Fluorescence Analysis</p></div>
          </div>
          <button type="button" onClick={onClose} className="text-slate-500 hover:text-slate-800"><XCircle size={20} /></button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <div><label className="block text-xs text-slate-600 mb-1.5">Test Date *</label>
              <input type="date" name="test_date" value={form.test_date} onChange={handle} className="w-full input-dark rounded-xl px-3 py-2 text-sm" /></div>
            <div><label className="block text-xs text-slate-600 mb-1.5">Sample ID *</label>
              <input name="sample_id" value={form.sample_id} onChange={handle} className="w-full input-dark rounded-xl px-3 py-2 text-sm font-mono" placeholder="SMP001" /></div>
            <div><label className="block text-xs text-slate-600 mb-1.5">Jeweller Name *</label>
              <input name="jeweller_name" value={form.jeweller_name} onChange={handle} required className="w-full input-dark rounded-xl px-3 py-2 text-sm" placeholder="Shop name" /></div>
            <div><label className="block text-xs text-slate-600 mb-1.5">Phone</label>
              <input name="phone" value={form.phone} onChange={handle} className="w-full input-dark rounded-xl px-3 py-2 text-sm" placeholder="Mobile" /></div>
            <div><label className="block text-xs text-slate-600 mb-1.5">Article Type *</label>
              <select name="article_type" value={form.article_type} onChange={handle} className="w-full input-dark rounded-xl px-3 py-2 text-sm">
                {['Ring','Necklace','Bangle','Bracelet','Earring','Chain','Other'].map(t => <option key={t}>{t}</option>)}</select></div>
            <div><label className="block text-xs text-slate-600 mb-1.5">HUID No.</label>
              <input name="huid" value={form.huid} onChange={handle} className="w-full input-dark rounded-xl px-3 py-2 text-sm font-mono" placeholder="HUID" /></div>
            <div><label className="block text-xs text-slate-600 mb-1.5">Weight (g)</label>
              <input type="number" name="weight" value={form.weight} onChange={handle} step="0.001" className="w-full input-dark rounded-xl px-3 py-2 text-sm" placeholder="0.000" /></div>
            <div><label className="block text-xs text-slate-600 mb-1.5">Declared Purity (%)</label>
              <input type="number" name="declared_purity" value={form.declared_purity} onChange={handle} step="0.01" className="w-full input-dark rounded-xl px-3 py-2 text-sm" placeholder="91.6" /></div>
          </div>

          <div className="glass-panel border border-cyan-500/20 rounded-xl p-6">
            <h4 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-3 flex items-center gap-2"><Zap size={12} /> XRF Composition (%)</h4>
            <div className="grid grid-cols-5 gap-3">
              {['gold_pct','silver_pct','copper_pct','zinc_pct','other_pct'].map(k => (
                <div key={k}>
                  <label className="block text-xs text-slate-600 mb-1.5 capitalize">{k.replace('_pct','')}</label>
                  <input type="number" name={k} value={form[k]} onChange={handle} step="0.01"
                    className="w-full input-dark rounded-xl px-3 py-2 text-sm" placeholder="0.00" />
                </div>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-600 mb-1.5">Tested Purity (%) *</label>
                <div className="flex gap-2">
                  <input type="number" name="tested_purity" value={form.tested_purity} onChange={handle} step="0.01"
                    className="flex-1 input-dark rounded-xl px-3 py-2 text-sm font-bold" placeholder="0.00" />
                  <button onClick={calcPurity} type="button" className="px-3 py-2 bg-cyan-500/20 text-cyan-400 rounded-xl text-xs hover:bg-cyan-500/30">= Au%</button>
                </div>
              </div>
              <div><label className="block text-xs text-slate-600 mb-1.5">Result *</label>
                <select name="result" value={form.result} onChange={handle} className="w-full input-dark rounded-xl px-3 py-2 text-sm">
                  <option>Pass</option><option>Fail</option><option>Borderline</option></select></div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div><label className="block text-xs text-slate-600 mb-1.5">Operator</label>
              <input name="operator" value={form.operator} onChange={handle} className="w-full input-dark rounded-xl px-3 py-2 text-sm" /></div>
            <div><label className="block text-xs text-slate-600 mb-1.5">Charges (₹) *</label>
              <input type="number" name="charges" value={form.charges} onChange={handle} className="w-full input-dark rounded-xl px-3 py-2 text-sm" placeholder="Amount" /></div>
            <div><label className="block text-xs text-slate-600 mb-1.5">Payment</label>
              <select name="payment_mode" value={form.payment_mode} onChange={handle} className="w-full input-dark rounded-xl px-3 py-2 text-sm">
                <option>Cash</option><option>UPI</option><option>Bank Transfer</option><option>Credit</option></select></div>
          </div>

          <div><label className="block text-xs text-slate-600 mb-1.5">Remarks</label>
            <textarea name="remarks" value={form.remarks} onChange={handle} rows={2} className="w-full input-dark rounded-xl px-3 py-2 text-sm resize-none" /></div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-4 flex gap-3 justify-end rounded-b-2xl">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 text-sm hover:text-slate-800 transition-all">Cancel</button>
          <button type="submit" disabled={saving}
            className="px-5 py-2 rounded-xl  from-cyan-500 to-cyan-600 text-slate-800 text-sm font-semibold flex items-center gap-2 disabled:opacity-50">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {editData ? 'Update' : 'Save Test'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function XRFTesting() {
  const { items, stats, loading, total, params, updateParam, deleteItem, reload } = useModuleData(xrfApi);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);

  const passRate = stats?.total > 0 ? Math.round((stats.pass_count / stats.total) * 100) : 0;
  const statsCards = [
    { label: "Today's Tests", value: stats?.today_tests || 0, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { label: 'Pass Rate', value: `${passRate}%`, color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: 'Failed', value: stats?.fail_count || 0, color: 'text-red-400', bg: 'bg-red-500/10' },
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
            placeholder="Search sample, jeweller..." className="bg-transparent text-sm text-slate-800 placeholder-slate-500 outline-none w-full" />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-300 text-slate-600 text-sm hover:text-slate-800 transition-all"><Download size={14} /> Export</button>
          <button onClick={() => { setEditData(null); setShowForm(true); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl  from-cyan-500 to-cyan-600 text-slate-800 text-sm font-semibold shadow-lg shadow-cyan-500/20">
            <Plus size={14} /> New Test
          </button>
        </div>
      </div>

      <div className="glass-panel border border-slate-200 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 gap-3">
            <Loader2 size={20} className="animate-spin text-cyan-400" />
            <span className="text-slate-600 text-sm">Loading tests...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-dark">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-100">
                  {['Test ID', 'Date', 'Sample', 'Jeweller', 'Article', 'Declared', 'Tested', 'Au%', 'Result', 'Charges', 'Actions'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-600 px-5 py-3.5 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map(t => (
                  <tr key={t.id} className="hover:bg-cyan-500/5 transition-colors">
                    <td className="px-5 py-3.5 text-xs font-mono text-cyan-400">{t.id}</td>
                    <td className="px-5 py-3.5 text-xs text-slate-600">{t.test_date ? new Date(t.test_date).toLocaleDateString('en-IN') : '—'}</td>
                    <td className="px-5 py-3.5 text-xs font-mono text-slate-700">{t.sample_id || '—'}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-800">{t.jeweller_name}</td>
                    <td className="px-5 py-3.5 text-xs text-slate-700">{t.article_type}</td>
                    <td className="px-5 py-3.5 text-xs text-slate-600">{t.declared_purity ? `${t.declared_purity}%` : '—'}</td>
                    <td className="px-5 py-3.5 text-xs font-bold text-slate-800">{t.tested_purity ? `${t.tested_purity}%` : '—'}</td>
                    <td className="px-5 py-3.5">
                      {t.gold_pct ? (
                        <div className="flex items-center gap-1">
                          <div className="w-14 bg-slate-700 rounded-full h-1.5">
                            <div className="bg-amber-400 h-1.5 rounded-full" style={{ width: `${Math.min(t.gold_pct, 100)}%` }} />
                          </div>
                          <span className="text-xs text-amber-400">{t.gold_pct}%</span>
                        </div>
                      ) : '—'}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${t.result === 'Pass' ? 'badge-completed' : 'badge-failed'}`}>{t.result}</span>
                    </td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-green-400">₹{parseFloat(t.charges || 0).toLocaleString('en-IN')}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        <button onClick={() => { setEditData(t); setShowForm(true); }} className="p-1.5 rounded-xl text-slate-600 hover:text-amber-400 hover:bg-amber-500/10 transition-all"><Edit2 size={13} /></button>
                        <button onClick={() => deleteItem(t.id, t.jeweller_name)} className="p-1.5 rounded-xl text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr><td colSpan={11} className="px-4 py-12 text-center text-slate-500">No tests found.</td></tr>
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
