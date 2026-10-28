import React, { useEffect } from 'react';
import { ToastMessage } from '../types';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3800);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const bgStyles = {
    success: 'bg-emerald-600 text-white shadow-emerald-600/30',
    error: 'bg-rose-600 text-white shadow-rose-600/30',
    info: 'bg-blue-600 text-white shadow-blue-600/30',
  }[toast.type];

  const Icon = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info,
  }[toast.type];

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md pointer-events-auto transition-all animate-in fade-in slide-in-from-top-4 duration-200">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl ${bgStyles} backdrop-blur-md`}
        role="alert"
      >
        <Icon className="w-5 h-5 shrink-0" />
        <p className="text-xs sm:text-sm font-semibold flex-1 leading-snug">
          {toast.message}
        </p>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-white/20 active:scale-90 transition-all text-white/80 hover:text-white"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
