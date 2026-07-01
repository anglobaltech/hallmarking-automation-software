import { useState, useEffect, useCallback } from 'react';
import {
  BadgeCheck, Plus, Search, Eye, Edit2, Trash2,
  Building2, Phone, CreditCard, Save, XCircle, Download, Loader2
} from 'lucide-react';
import { jewellersApi } from '../api/jewellers.js';
import { toast } from '../components/Toast.jsx';

// ─── Modal Form ─────────────────────────────────────────────────────────────
const EMPTY_FORM = {
  name: '', owner_name: '', phone: '', email: '',
  address: '', city: '', state: 'Rajasthan', pincode: '',
  bis_license: '', license_expiry: '', category: 'Gold',
  gstin: '', pan_number: '', aadhar: '',
  bank_name: '', account_number: '', ifsc: '', notes: '', status: 'Active',
};

function FormModal({ onClose, editData, onSaved }) {
  const [form, setForm] = useState(() => {
    if (!editData) return EMPTY_FORM;
    return {
      ...EMPTY_FORM,
      ...editData,
      license_expiry: editData.license_expiry ? editData.license_expiry.split('T')[0] : '',
    };
  });
  const [saving, setSaving] = useState(false);

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.owner_name || !form.phone || !form.bis_license) {
      toast('Please fill all required fields', 'error'); return;
    }
    setSaving(true);
    try {
      if (editData?.id) {
        await jewellersApi.update(editData.id, form);
        toast('Jeweller updated successfully');
      } else {
        await jewellersApi.create(form);
        toast('Jeweller registered successfully');
      }
      onSaved();
      onClose();
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-100">
              <BadgeCheck size={20} className="text-amber-500" />
            </div>
            <div>
              <h3 className="text-slate-800 font-extrabold">{editData ? 'Edit Jeweller' : 'Register New Jeweller'}</h3>
              <p className="text-xs font-semibold text-slate-500">BIS HUID Registration</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-200">
            <XCircle size={20} />
          </button>
        </div>

        <div className="p-6 md:p-6 space-y-8">
          {/* Business Info */}
          <div>
            <h4 className="text-sm font-bold text-amber-600 mb-4 flex items-center gap-2">
              <Building2 size={16} /> Business Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Business / Shop Name *</label>
                <input name="name" value={form.name} onChange={handle} required
                  className="w-full input-dark rounded-xl px-4 py-2.5 text-sm font-medium" placeholder="e.g. Suresh Kumar Jewellers" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Owner / Proprietor Name *</label>
                <input name="owner_name" value={form.owner_name} onChange={handle} required
                  className="w-full input-dark rounded-xl px-4 py-2.5 text-sm font-medium" placeholder="Full name" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Category *</label>
                <select name="category" value={form.category} onChange={handle}
                  className="w-full input-dark rounded-xl px-4 py-2.5 text-sm font-medium">
                  <option>Gold</option><option>Silver</option><option>Platinum</option><option>Mixed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold text-amber-600 mb-4 flex items-center gap-2">
              <Phone size={16} /> Contact Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Mobile Number *</label>
                <input name="phone" value={form.phone} onChange={handle} required
                  className="w-full input-dark rounded-xl px-4 py-2.5 text-sm font-medium" placeholder="10-digit mobile" maxLength={10} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Email Address</label>
                <input name="email" value={form.email} onChange={handle} type="email"
                  className="w-full input-dark rounded-xl px-4 py-2.5 text-sm font-medium" placeholder="email@example.com" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Shop Address</label>
                <textarea name="address" value={form.address} onChange={handle} rows={2}
                  className="w-full input-dark rounded-xl px-4 py-2.5 text-sm font-medium resize-none" placeholder="Shop No., Street, Area" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">City</label>
                <input name="city" value={form.city} onChange={handle}
                  className="w-full input-dark rounded-xl px-4 py-2.5 text-sm font-medium" placeholder="City" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">PIN Code</label>
                <input name="pincode" value={form.pincode} onChange={handle}
                  className="w-full input-dark rounded-xl px-4 py-2.5 text-sm font-medium" placeholder="6-digit PIN" maxLength={6} />
              </div>
            </div>
          </div>

          {/* BIS License */}
          <div>
            <h4 className="text-sm font-bold text-amber-600 mb-4 flex items-center gap-2">
              <BadgeCheck size={16} /> BIS License Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">BIS License Number *</label>
                <input name="bis_license" value={form.bis_license} onChange={handle} required
                  className="w-full input-dark rounded-xl px-4 py-2.5 text-sm font-bold font-mono text-amber-700" placeholder="BIS/HM/XX/YYYY/NNN" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">License Expiry Date</label>
                <input name="license_expiry" value={form.license_expiry} onChange={handle} type="date"
                  className="w-full input-dark rounded-xl px-4 py-2.5 text-sm font-medium" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">GSTIN</label>
                <input name="gstin" value={form.gstin} onChange={handle}
                  className="w-full input-dark rounded-xl px-4 py-2.5 text-sm font-mono font-medium" placeholder="15-char GSTIN" maxLength={15} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">PAN Number</label>
                <input name="pan_number" value={form.pan_number} onChange={handle}
                  className="w-full input-dark rounded-xl px-4 py-2.5 text-sm font-mono font-medium uppercase" placeholder="AAAAA9999A" maxLength={10} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Aadhaar Number</label>
                <input name="aadhar" value={form.aadhar} onChange={handle}
                  className="w-full input-dark rounded-xl px-4 py-2.5 text-sm font-mono font-medium" placeholder="12-digit Aadhaar" maxLength={12} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Status</label>
                <select name="status" value={form.status} onChange={handle}
                  className="w-full input-dark rounded-xl px-4 py-2.5 text-sm font-bold">
                  <option>Active</option><option>Expiring</option><option>Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bank */}
          <div>
            <h4 className="text-sm font-bold text-amber-600 mb-4 flex items-center gap-2">
              <CreditCard size={16} /> Bank Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Bank Name</label>
                <input name="bank_name" value={form.bank_name} onChange={handle}
                  className="w-full input-dark rounded-xl px-4 py-2.5 text-sm font-medium" placeholder="Bank name" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Account Number</label>
                <input name="account_number" value={form.account_number} onChange={handle}
                  className="w-full input-dark rounded-xl px-4 py-2.5 text-sm font-mono font-medium" placeholder="Account number" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">IFSC Code</label>
                <input name="ifsc" value={form.ifsc} onChange={handle}
                  className="w-full input-dark rounded-xl px-4 py-2.5 text-sm font-mono font-medium uppercase" placeholder="IFSC code" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Additional Notes</label>
            <textarea name="notes" value={form.notes} onChange={handle} rows={2}
              className="w-full input-dark rounded-xl px-4 py-2.5 text-sm font-medium resize-none" placeholder="Any additional notes..." />
          </div>
        </div>

        <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4 flex gap-3 justify-end rounded-b-2xl z-10">
          <button type="button" onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-600 font-bold text-sm hover:bg-white hover:text-slate-900 transition-all shadow-sm">
            Cancel
          </button>
          <button type="submit" disabled={saving}
            className="px-6 py-2.5 rounded-xl  bg-gradient-to-tr from-amber-500 to-amber-400 shadow-sm shadow-amber-500/20 text-white text-white text-sm font-extrabold hover:from-amber-400 hover:to-amber-500 transition-all flex items-center gap-2 shadow-md shadow-amber-500/20 disabled:opacity-50">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {editData ? 'Update Jeweller' : 'Register Jeweller'}
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── Status Badge ────────────────────────────────────────────────────────────
const statusColor = { Active: 'badge-completed', Expiring: 'badge-pending', Inactive: 'badge-failed' };

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function BisHuid() {
  const [jewellers, setJewellers] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, expiring: 0, total_huid: 0 });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [total, setTotal] = useState(0);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [data, statsData] = await Promise.all([
        jewellersApi.getAll({ search, status: filterStatus }),
        jewellersApi.getStats(),
      ]);
      setJewellers(data.data || []);
      setTotal(data.total || 0);
      setStats(statsData);
    } catch (err) {
      toast(`Failed to load data: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  }, [search, filterStatus]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await jewellersApi.delete(id);
      toast('Jeweller deleted');
      loadData();
    } catch (err) {
      toast(err.message, 'error');
    }
  };

  const statsCards = [
    { label: 'Total Jewellers', value: stats.total || 0, color: 'text-slate-800', bg: 'bg-white', badge: 'bg-slate-100 text-slate-600 border-slate-200' },
    { label: 'Active Licenses', value: stats.active || 0, color: 'text-green-700', bg: 'bg-green-50/50', badge: 'bg-green-100 text-green-700 border-green-200' },
    { label: 'Expiring Soon', value: stats.expiring || 0, color: 'text-amber-700', bg: 'bg-amber-50/50', badge: 'bg-amber-100 text-amber-700 border-amber-200' },
    { label: 'Total HUID Issued', value: stats.total_huid || 0, color: 'text-amber-700', bg: 'bg-amber-50/50', badge: 'bg-amber-100 text-amber-700 border-amber-200' },
  ];

  return (
    <div className="page-enter space-y-6 pb-12">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((s, i) => (
          <div key={i} className={`${s.bg} border border-slate-200 rounded-xl p-6 card-glow shadow-sm relative overflow-hidden`}>
            <div className="relative z-10">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{s.label}</p>
              <p className={`text-2xl font-bold tracking-tight ${s.color}`}>{s.value}</p>
            </div>
            <div className={`absolute -right-4 -top-6 w-16 h-16 rounded-full border-4 opacity-50 ${s.badge}`} />
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-6 flex-1 w-full lg:w-auto">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 flex-1 max-w-sm focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-500/20 transition-all">
            <Search size={18} className="text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search jeweller, license..."
              className="bg-transparent text-sm font-semibold text-slate-800 placeholder-slate-400 outline-none w-full" />
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="input-dark rounded-xl px-4 py-2.5 text-sm font-bold min-w-[140px] cursor-pointer">
            <option>All Status</option><option>Active</option><option>Expiring</option><option>Inactive</option>
          </select>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 font-bold text-sm hover:bg-slate-50 shadow-sm transition-all">
            <Download size={16} /> Export
          </button>
          <button onClick={() => { setEditData(null); setShowForm(true); }}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl  bg-gradient-to-tr from-amber-500 to-amber-400 shadow-sm shadow-amber-500/20 text-white text-white text-sm font-extrabold shadow-md shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 transition-all">
            <Plus size={16} /> Add Jeweller
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="glass-panel overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-6">
            <Loader2 size={32} className="animate-spin text-amber-500" />
            <span className="text-slate-500 font-bold">Loading jewellers data...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-dark">
              <thead>
                <tr>
                  {['Jeweller Details', 'BIS License No.', 'Category', 'Expiry', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {jewellers.map((j) => (
                  <tr key={j.id}>
                    <td>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{j.name}</p>
                        <p className="text-xs font-semibold text-slate-500 mt-0.5">{j.owner_name} · {j.phone}</p>
                      </div>
                    </td>
                    <td>
                      <span className="text-xs font-bold font-mono text-amber-700 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-xl shadow-sm">
                        {j.bis_license}
                      </span>
                    </td>
                    <td>
                      <span className="text-sm font-semibold text-slate-600">{j.category}</span>
                    </td>
                    <td>
                      <span className="text-sm font-medium text-slate-600">
                        {j.license_expiry ? new Date(j.license_expiry).toLocaleDateString('en-IN', {day: 'numeric', month: 'short', year: 'numeric'}) : '—'}
                      </span>
                    </td>
                    <td>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-extrabold shadow-sm ${statusColor[j.status] || 'badge-pending'}`}>
                        {j.status}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <button onClick={() => { setEditData(j); setShowForm(true); }}
                          className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-amber-600 hover:bg-amber-50 hover:border-amber-100 transition-all shadow-sm bg-white">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(j.id, j.name)}
                          className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-100 transition-all shadow-sm bg-white">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {jewellers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center text-slate-500">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center">
                          <Building2 size={24} className="text-slate-400" />
                        </div>
                        <p className="font-bold text-slate-600">No jewellers found in directory.</p>
                        <button onClick={() => { setEditData(null); setShowForm(true); }} className="text-amber-500 hover:text-amber-600 font-extrabold text-sm">Add New Jeweller</button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        <div className="border-t border-slate-100 bg-slate-50 px-6 py-4 flex items-center justify-between">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Showing {jewellers.length} of {total} records</p>
        </div>
      </div>

      {showForm && <FormModal onClose={() => setShowForm(false)} editData={editData} onSaved={loadData} />}
    </div>
  );
}
