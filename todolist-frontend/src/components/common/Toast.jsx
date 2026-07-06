import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AlertCircle, Check } from 'lucide-react';
import { clearToast } from '../../store/taskSlice';

export default function Toast() {
  const dispatch = useDispatch();
  const toast = useSelector(state => state.tasks.toast);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        dispatch(clearToast());
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toast, dispatch]);

  if (!toast) return null;

  return (
    <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg border animate-bounce ${
      toast.type === 'error' 
        ? 'bg-red-50 text-red-700 border-red-200' 
        : 'bg-emerald-50 text-emerald-800 border-emerald-200'
    }`}>
      <div className={`p-1 rounded-full ${toast.type === 'error' ? 'bg-red-100' : 'bg-emerald-100'}`}>
        {toast.type === 'error' ? <AlertCircle size={16} /> : <Check size={16} />}
      </div>
      <span className="text-sm font-medium">{toast.message}</span>
    </div>
  );
}
