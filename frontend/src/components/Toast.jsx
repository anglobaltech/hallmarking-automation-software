import { useState, useEffect, useCallback } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';

let addToastFn = null;

export function toast(message, type = 'success') {
  if (addToastFn) addToastFn({ message, type, id: Date.now() });
}

const icons = {
  success: <CheckCircle2 size={16} className="text-green-400 flex-shrink-0" />,
  error: <XCircle size={16} className="text-red-400 flex-shrink-0" />,
  warning: <AlertTriangle size={16} className="text-yellow-400 flex-shrink-0" />,
  info: <Info size={16} className="text-blue-400 flex-shrink-0" />,
};

const bgMap = {
  success: 'bg-green-500/10 border-green-500/30',
  error: 'bg-red-500/10 border-red-500/30',
  warning: 'bg-yellow-500/10 border-yellow-500/30',
  info: 'bg-blue-500/10 border-blue-500/30',
};

function ToastItem({ toast: t, onRemove }) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(t.id), 3500);
    return () => clearTimeout(timer);
  }, [t.id, onRemove]);

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${bgMap[t.type]} shadow-2xl backdrop-blur-md min-w-[260px] max-w-sm animate-enter`}>
      {icons[t.type]}
      <p className="text-sm text-white flex-1">{t.message}</p>
      <button onClick={() => onRemove(t.id)} className="text-slate-500 hover:text-white transition-colors ml-2">
        <X size={14} />
      </button>
    </div>
  );
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  const add = useCallback((t) => {
    setToasts(prev => [...prev.slice(-3), t]);
  }, []);

  useEffect(() => {
    addToastFn = add;
    return () => { addToastFn = null; };
  }, [add]);

  const remove = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} onRemove={remove} />
      ))}
    </div>
  );
}
