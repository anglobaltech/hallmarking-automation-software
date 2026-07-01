import { Menu, Bell } from 'lucide-react';

export default function TopBar({ setMobileOpen, collapsed, setCollapsed }) {
  return (
    <header className="bg-white/80 backdrop-blur-md h-16 md:h-20 flex items-center justify-between px-6 md:px-8 shrink-0 relative z-20 border-b border-slate-200/60 shadow-[0_4px_24px_rgba(0,0,0,0.01)]">
      <div className="flex items-center gap-4">
        <button
          onClick={() => {
            if (window.innerWidth < 768) {
              setMobileOpen(true);
            } else {
              setCollapsed(!collapsed);
            }
          }}
          className="p-2 -ml-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100/50 rounded-lg transition-all"
        >
          <Menu size={20} />
        </button>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100/50 rounded-lg transition-all">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

        <div className="flex items-center gap-3.5 cursor-pointer group">
          <div className="hidden sm:block text-right">
            <p className="text-[13px] font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">Admin User</p>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Center Head</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-white shadow-sm shadow-amber-500/20 group-hover:shadow-amber-500/30 transition-all border border-white">
            <span className="text-[13px] font-bold">A</span>
          </div>
        </div>
      </div>
    </header>
  );
}
