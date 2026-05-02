import React from 'react';
import { motion } from 'motion/react';
import { 
  Database, 
  Settings, 
  Zap, 
  Check, 
  X
} from 'lucide-react';
import { api } from '../../../services/api.service';

export const SettingsPage: React.FC = () => {
  const [loading, setLoading] = React.useState(false);
  const [status, setStatus] = React.useState<null | 'success' | 'error'>(null);
  const [message, setMessage] = React.useState('');

  const initDb = async () => {
    setLoading(true);
    setStatus(null);
    try {
      const data = await api.initDb();
      setStatus('success');
      setMessage(data.message || 'Hệ thống đã được khởi tạo thành công.');
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || 'Lỗi kết nối máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight truncate">Cấu hình Hệ thống</h2>
          <p className="text-slate-500 text-sm truncate">Quản lý nền tảng kỹ thuật cho Hub của bạn.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 border border-indigo-100 flex-shrink-0">
              <Database size={24} />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-slate-900 uppercase">Khởi tạo Google Sheets DB</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">First-time Setup</p>
            </div>
          </div>
          
          <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-100 text-xs font-medium text-slate-600 leading-relaxed text-center">
            Hệ thống sẽ tạo các bảng (Sheets) cần thiết trong tệp Google Spreadsheet của bạn nếu chúng chưa tồn tại.
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button 
              onClick={initDb}
              disabled={loading}
              className="btn-primary w-full sm:w-auto px-8"
            >
              {loading ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" /> : <Zap size={18} />}
              <span className="truncate">{loading ? 'Đang kích hoạt...' : 'Kích tạo cấu trúc Sheets'}</span>
            </button>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider text-center sm:text-left flex-1">
              Đảm bảo biến <code className="text-indigo-500">GOOGLE_SHEET_ID</code> đã chính xác.
            </p>
          </div>

          {status && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`p-6 rounded-2xl border flex items-center gap-4 ${status === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-rose-50 border-rose-100 text-rose-800'}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${status === 'success' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}`}>
                {status === 'success' ? <Check size={20} /> : <X size={20} />}
              </div>
              <p className="text-sm font-black">{message}</p>
            </motion.div>
          )}
        </div>

        <div className="bg-slate-900 rounded-xl p-6 md:p-8 text-white overflow-hidden relative border-0 shadow-lg shadow-slate-900/20">
           <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12 scale-150">
              <Settings size={120} className="fill-white" />
           </div>
           <div className="relative z-10 space-y-6">
              <h3 className="text-lg font-bold tracking-tight">Kỹ thuật & Bảo mật 🔑</h3>
              <div className="space-y-3">
                 {[
                   { k: 'NEXTAUTH_SECRET', v: 'Authentication Encryption' },
                   { k: 'GOOGLE_SHEET_ID', v: 'Central Spreadsheet Database' },
                   { k: 'GOOGLE_CLIENT_ID', v: 'Google OAuth Credentials' }
                 ].map((item, i) => (
                   <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors group">
                      <code className="text-indigo-400 font-mono text-xs font-bold group-hover:text-indigo-300">{item.k}</code>
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest hidden sm:block">{item.v}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
