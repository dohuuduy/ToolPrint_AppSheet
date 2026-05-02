import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Copy, Check } from 'lucide-react';

interface DetailField {
  label: string;
  value: string | number | undefined;
  isMono?: boolean;
  isSecret?: boolean;
}

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  fields: DetailField[];
  icon?: React.ReactNode;
}

export const DetailModal: React.FC<DetailModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  subtitle, 
  fields,
  icon 
}) => {
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-all"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl z-[60] overflow-hidden"
          >
            <div className="relative p-10">
              <button 
                onClick={onClose}
                className="absolute right-8 top-8 p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-5 mb-10">
                {icon && (
                  <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
                    {icon}
                  </div>
                )}
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h3>
                  {subtitle && <p className="text-sm font-medium text-slate-500">{subtitle}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                {fields.map((field, idx) => (
                  <div key={idx} className="space-y-2.5 group">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
                      {field.label}
                    </label>
                    <div className="relative">
                      <div className={`w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl transition-all group-hover:border-indigo-100 group-hover:bg-slate-50/50 ${
                        field.isMono ? 'font-mono text-xs' : 'font-bold text-slate-700 text-sm'
                      }`}>
                        {field.isSecret ? '••••••••••••••••' : (field.value || 'N/A')}
                      </div>
                      {!field.isSecret && field.value && (
                        <button
                          onClick={() => handleCopy(String(field.value), idx)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-300 hover:text-indigo-600 transition-all opacity-0 group-hover:opacity-100"
                          title="Sao chép"
                        >
                          {copiedIndex === idx ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 flex justify-end">
                <button 
                  onClick={onClose}
                  className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                >
                  Đóng cửa sổ
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
