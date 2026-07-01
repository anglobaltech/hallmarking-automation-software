import { Settings, Bell, Shield, Palette, Database, Printer } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="page-enter space-y-6 max-w-2xl">
      <div className="glass-panel border border-slate-200 rounded-xl p-6">
        <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Settings size={16} className="text-amber-400" /> Centre Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: 'Centre Name', placeholder: 'BIS Hallmarking Centre', value: 'Gold City Hallmarking Centre' },
            { label: 'BIS Recognition No.', placeholder: 'Recognition #', value: 'BIS/HM/RC/2024/001' },
            { label: 'Address', placeholder: 'Address', value: 'Johari Bazaar, Jaipur' },
            { label: 'Contact Phone', placeholder: 'Phone', value: '0141-2345678' },
            { label: 'Email', placeholder: 'Email', value: 'admin@goldcityhm.com' },
            { label: 'GSTIN', placeholder: 'GSTIN', value: '08AAAAA1234A1Z5' },
          ].map((f, i) => (
            <div key={i}>
              <label className="block text-xs text-slate-600 mb-1.5">{f.label}</label>
              <input defaultValue={f.value} placeholder={f.placeholder}
                className="w-full input-dark rounded-xl px-3 py-2 text-sm" />
            </div>
          ))}
        </div>
        <button className="mt-4 px-5 py-2 rounded-xl  bg-gradient-to-tr from-amber-500 to-amber-400 shadow-sm shadow-amber-500/20 text-white text-slate-800 text-sm font-semibold hover:from-amber-400 hover:to-amber-500 transition-all">
          Save Changes
        </button>
      </div>

      <div className="glass-panel border border-slate-200 rounded-xl p-6">
        <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Printer size={16} className="text-amber-400" /> Print & Certificate Settings
        </h3>
        <div className="space-y-3">
          {['Print Certificate Header', 'Include Centre Logo', 'Auto-print on completion', 'Show BIS Watermark'].map((opt, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-slate-200/30 last:border-0">
              <span className="text-sm text-slate-700">{opt}</span>
              <div className="w-10 h-5 bg-amber-500 rounded-full relative cursor-pointer">
                <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
