import { useState, useEffect } from 'react';
import { RefreshCcw, Plus, Search, Edit2, Trash2, Save, XCircle, Download, Loader2, TrendingUp, TrendingDown, ArrowLeftRight } from 'lucide-react';
import { exchangeApi } from '../api/exchange.js';
import { toast } from '../components/Toast.jsx';
import { useModuleData } from '../hooks/useModuleData.js';

const EMPTY = {
  txn_date: new Date().toISOString().split('T')[0],
  txn_type: 'Buy', jeweller_name: '', phone: '', address: '', bis_license: '', gstin: '',
  gold_type: 'Old Jewellery', purity: '', fineness: '', huid: '', pieces: '1',
  gross_weight: '', stone_weight: '0', other_deduct_wt: '0', net_weight: '',
  rate_per_gram: '', gross_amount: '', making_deduct: '0', other_deduct: '0',
  total_deductions: '0', final_amount: '',
  payment_mode: 'Cash', cheque_no: '', upi_ref: '', status: 'Completed', remarks: '',
};

function FormModal({ onClose, editData, onSaved }) {
  const [form, setForm] = useState(editData ? {
    ...EMPTY, ...editData,
    txn_date: editData.txn_date ? editData.txn_date.split('T')[0] : EMPTY.txn_date,
  } : EMPTY);
  const [saving, setSaving] = useState(false);

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  useEffect(() => {
    // Auto-calculate net weight and amounts
    const gross = parseFloat(form.gross_weight) || 0;
    const stone = parseFloat(form.stone_weight) || 0;
    const otherWt = parseFloat(form.other_deduct_wt) || 0;
    const net = Math.max(gross - stone - otherWt, 0);
    const rate = parseFloat(form.rate_per_gram) || 0;
    const grossAmt = net * rate;
    const making = parseFloat(form.making_deduct) || 0;
    const other = parseFloat(form.other_deduct) || 0;
    const totalDed = making + other;
    const final = Math.max(grossAmt - totalDed, 0);
    setForm(f => ({
      ...f,
      net_weight: net.toFixed(3),
      gross_amount: grossAmt.toFixed(2),
      total_deductions: totalDed.toFixed(2),
      final_amount: final.toFixed(2),
    }));
  }, [form.gross_weight, form.stone_weight, form.other_deduct_wt, form.rate_per_gram, form.making_deduct, form.other_deduct]);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.jeweller_name || !form.txn_type) { toast('Fill required fields', 'error'); return; }
    setSaving(true);
    try {
      if (editData?.id) { await exchangeApi.update(editData.id, form); toast('Transaction updated'); }
      else { await exchangeApi.create(form); toast('Transaction saved'); }
      onSaved(); onClose();
    } catch (err) { toast(err.message, 'error'); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
      <form onSubmit={submit} className="bg-white border border-slate-200 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center"><RefreshCcw size={18} className="text-emerald-400" /></div>
            <div><h3 className="text-slate-800 font-bold">{editData ? 'Edit Transaction' : 'New Gold Exchange'}</h3><p className="text-xs text-slate-500">Buy / Sell / Exchange</p></div>
          </div>
          <button type="button" onClick={onClose} className="text-slate-500 hover:text-slate-800"><XCircle size={20} /></button>
        </div>

        <div className="p-6 space-y-4">
          {/* Type selector */}
          <div className="flex gap-2 p-1 bg-slate-50 rounded-xl">
            {['Buy','Sell','Exchange'].map(t => (
              <button key={t} type="button" onClick={() => setForm(f => ({ ...f, txn_type: t }))}
                className={`flex-1 py-2 text-sm font-semibold rounded-xl transition-all ${
                  form.txn_type === t ? 'bg-emerald-500 text-slate-800 shadow' : 'text-slate-600 hover:text-slate-800'
                }`}>{t}</button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div><label className="block text-xs text-slate-600 mb-1.5">Date *</label>
              <input type="date" name="txn_date" value={form.txn_date} onChange={handle} className="w-full input-dark rounded-xl px-3 py-2 text-sm" /></div>
            <div><label className="block text-xs text-slate-600 mb-1.5">Status</label>
              <select name="status" value={form.status} onChange={handle} className="w-full input-dark rounded-xl px-3 py-2 text-sm">
                <option>Completed</option><option>Pending</option></select></div>
            <div><label className="block text-xs text-slate-600 mb-1.5">Party Name *</label>
              <input name="jeweller_name" value={form.jeweller_name} onChange={handle} required className="w-full input-dark rounded-xl px-3 py-2 text-sm" placeholder="Name / Shop name" /></div>
            <div><label className="block text-xs text-slate-600 mb-1.5">Phone</label>
              <input name="phone" value={form.phone} onChange={handle} className="w-full input-dark rounded-xl px-3 py-2 text-sm" /></div>
            <div><label className="block text-xs text-slate-600 mb-1.5">BIS License</label>
              <input name="bis_license" value={form.bis_license} onChange={handle} className="w-full input-dark rounded-xl px-3 py-2 text-sm font-mono" /></div>
            <div><label className="block text-xs text-slate-600 mb-1.5">GSTIN</label>
              <input name="gstin" value={form.gstin} onChange={handle} className="w-full input-dark rounded-xl px-3 py-2 text-sm font-mono" /></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div><label className="block text-xs text-slate-600 mb-1.5">Gold Type</label>
              <select name="gold_type" value={form.gold_type} onChange={handle} className="w-full input-dark rounded-xl px-3 py-2 text-sm">
                {['Old Jewellery','New Jewellery','Gold Bar','Gold Coin','Scrap Gold','Silver'].map(t => <option key={t}>{t}</option>)}</select></div>
            <div><label className="block text-xs text-slate-600 mb-1.5">Purity (%)</label>
              <input type="number" name="purity" value={form.purity} onChange={handle} step="0.01" className="w-full input-dark rounded-xl px-3 py-2 text-sm" placeholder="91.6" /></div>
            <div><label className="block text-xs text-slate-600 mb-1.5">Pieces</label>
              <input type="number" name="pieces" value={form.pieces} onChange={handle} className="w-full input-dark rounded-xl px-3 py-2 text-sm" /></div>
          </div>

          {/* Weight calculation */}
          <div className="glass-panel border border-emerald-500/20 rounded-xl p-6">
            <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-3">Weight Calculation</h4>
            <div className="grid grid-cols-3 gap-3">
              <div><label className="block text-xs text-slate-600 mb-1.5">Gross Weight (g) *</label>
                <input type="number" name="gross_weight" value={form.gross_weight} onChange={handle} step="0.001" className="w-full input-dark rounded-xl px-3 py-2 text-sm" /></div>
              <div><label className="block text-xs text-slate-600 mb-1.5">Stone Wt (g)</label>
                <input type="number" name="stone_weight" value={form.stone_weight} onChange={handle} step="0.001" className="w-full input-dark rounded-xl px-3 py-2 text-sm" /></div>
              <div><label className="block text-xs text-slate-600 mb-1.5">Other Deduct Wt</label>
                <input type="number" name="other_deduct_wt" value={form.other_deduct_wt} onChange={handle} step="0.001" className="w-full input-dark rounded-xl px-3 py-2 text-sm" /></div>
              <div><label className="block text-xs text-slate-600 mb-1.5">Net Weight (g)</label>
                <input readOnly value={form.net_weight} className="w-full input-dark rounded-xl px-3 py-2 text-sm font-bold text-amber-400 cursor-not-allowed" /></div>
              <div><label className="block text-xs text-slate-600 mb-1.5">Rate / Gram (₹)</label>
                <input type="number" name="rate_per_gram" value={form.rate_per_gram} onChange={handle} step="0.01" className="w-full input-dark rounded-xl px-3 py-2 text-sm" /></div>
              <div><label className="block text-xs text-slate-600 mb-1.5">Gross Amount (₹)</label>
                <input readOnly value={form.gross_amount} className="w-full input-dark rounded-xl px-3 py-2 text-sm font-bold text-slate-800 cursor-not-allowed" /></div>
            </div>
          </div>

          {/* Deductions */}
          <div className="glass-panel border border-slate-200/30 rounded-xl p-6">
            <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">Deductions</h4>
            <div className="grid grid-cols-3 gap-3">
              <div><label className="block text-xs text-slate-600 mb-1.5">Making Charges (₹)</label>
                <input type="number" name="making_deduct" value={form.making_deduct} onChange={handle} step="0.01" className="w-full input-dark rounded-xl px-3 py-2 text-sm" /></div>
              <div><label className="block text-xs text-slate-600 mb-1.5">Other Deductions (₹)</label>
                <input type="number" name="other_deduct" value={form.other_deduct} onChange={handle} step="0.01" className="w-full input-dark rounded-xl px-3 py-2 text-sm" /></div>
              <div><label className="block text-xs text-slate-600 mb-1.5">Total Deductions (₹)</label>
                <input readOnly value={form.total_deductions} className="w-full input-dark rounded-xl px-3 py-2 text-sm font-bold text-red-400 cursor-not-allowed" /></div>
            </div>
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-700">Final Amount Payable</span>
            <span className="text-2xl font-bold tracking-tight text-emerald-400">₹ {parseFloat(form.final_amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div><label className="block text-xs text-slate-600 mb-1.5">Payment Mode</label>
              <select name="payment_mode" value={form.payment_mode} onChange={handle} className="w-full input-dark rounded-xl px-3 py-2 text-sm">
                <option>Cash</option><option>Cheque</option><option>UPI</option><option>Bank Transfer</option><option>Credit</option></select></div>
            <div><label className="block text-xs text-slate-600 mb-1.5">Cheque / DD No.</label>
              <input name="cheque_no" value={form.cheque_no} onChange={handle} className="w-full input-dark rounded-xl px-3 py-2 text-sm" /></div>
            <div><label className="block text-xs text-slate-600 mb-1.5">UPI Ref.</label>
              <input name="upi_ref" value={form.upi_ref} onChange={handle} className="w-full input-dark rounded-xl px-3 py-2 text-sm" /></div>
          </div>

          <div><label className="block text-xs text-slate-600 mb-1.5">Remarks</label>
            <textarea name="remarks" value={form.remarks} onChange={handle} rows={2} className="w-full input-dark rounded-xl px-3 py-2 text-sm resize-none" /></div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-4 flex gap-3 justify-end rounded-b-2xl">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 text-sm hover:text-slate-800 transition-all">Cancel</button>
          <button type="submit" disabled={saving}
            className="px-5 py-2 rounded-xl  from-emerald-500 to-emerald-600 text-slate-800 text-sm font-semibold flex items-center gap-2 disabled:opacity-50">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {editData ? 'Update' : 'Save Transaction'}
          </button>
        </div>
      </form>
    </div>
  );
}

const typeIcon = { Buy: <TrendingDown size={12} className="text-green-400" />, Sell: <TrendingUp size={12} className="text-red-400" />, Exchange: <ArrowLeftRight size={12} className="text-amber-400" /> };
const typeBg = { Buy: 'text-green-400 bg-green-500/10', Sell: 'text-red-400 bg-red-500/10', Exchange: 'text-amber-400 bg-amber-500/10' };

export default function GoldExchange() {
  const { items, stats, loading, total, params, updateParam, deleteItem, reload } = useModuleData(exchangeApi);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);

  const statsCards = [
    { label: "Today's Transactions", value: stats?.today_txns || 0, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: "Today's Buy", value: `₹${parseFloat(stats?.today_buy || 0).toLocaleString('en-IN')}`, color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: "Today's Sell", value: `₹${parseFloat(stats?.today_sell || 0).toLocaleString('en-IN')}`, color: 'text-red-400', bg: 'bg-red-500/10' },
    { label: 'Pending', value: stats?.pending || 0, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
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
            placeholder="Search party, ID..." className="bg-transparent text-sm text-slate-800 placeholder-slate-500 outline-none w-full" />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-300 text-slate-600 text-sm hover:text-slate-800 transition-all"><Download size={14} /> Export</button>
          <button onClick={() => { setEditData(null); setShowForm(true); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl  from-emerald-500 to-emerald-600 text-slate-800 text-sm font-semibold shadow-lg shadow-emerald-500/20">
            <Plus size={14} /> New Transaction
          </button>
        </div>
      </div>

      <div className="glass-panel border border-slate-200 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 gap-3">
            <Loader2 size={20} className="animate-spin text-emerald-400" />
            <span className="text-slate-600 text-sm">Loading transactions...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-dark">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-100">
                  {['Txn ID', 'Date', 'Type', 'Party', 'Gold Type', 'Purity', 'Gross Wt', 'Net Wt', 'Rate/g', 'Final Amt', 'Payment', 'Actions'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-600 px-5 py-3.5 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map(t => (
                  <tr key={t.id} className="hover:bg-emerald-500/5 transition-colors">
                    <td className="px-5 py-3.5 text-xs font-mono text-emerald-400">{t.id}</td>
                    <td className="px-5 py-3.5 text-xs text-slate-600">{t.txn_date ? new Date(t.txn_date).toLocaleDateString('en-IN') : '—'}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-semibold ${typeBg[t.txn_type]}`}>
                        {typeIcon[t.txn_type]} {t.txn_type}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-800">{t.jeweller_name}</td>
                    <td className="px-5 py-3.5 text-xs text-slate-700">{t.gold_type || '—'}</td>
                    <td className="px-5 py-3.5 text-xs text-slate-600">{t.purity ? `${t.purity}%` : '—'}</td>
                    <td className="px-5 py-3.5 text-xs text-slate-700">{t.gross_weight ? `${t.gross_weight}g` : '—'}</td>
                    <td className="px-5 py-3.5 text-xs font-semibold text-slate-800">{t.net_weight ? `${t.net_weight}g` : '—'}</td>
                    <td className="px-5 py-3.5 text-xs text-slate-600">{t.rate_per_gram ? `₹${parseFloat(t.rate_per_gram).toLocaleString('en-IN')}` : '—'}</td>
                    <td className="px-5 py-3.5 text-sm font-bold text-emerald-400">{t.final_amount ? `₹${parseFloat(t.final_amount).toLocaleString('en-IN')}` : '—'}</td>
                    <td className="px-5 py-3.5 text-xs text-slate-600">{t.payment_mode}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        <button onClick={() => { setEditData(t); setShowForm(true); }} className="p-1.5 rounded-xl text-slate-600 hover:text-amber-400 hover:bg-amber-500/10 transition-all"><Edit2 size={13} /></button>
                        <button onClick={() => deleteItem(t.id, t.jeweller_name)} className="p-1.5 rounded-xl text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr><td colSpan={12} className="px-4 py-12 text-center text-slate-500">No transactions found.</td></tr>
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
