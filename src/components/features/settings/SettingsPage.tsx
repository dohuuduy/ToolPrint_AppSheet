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
    <div className="space-y-8 max-w-4xl mx-auto pb-20">
      <div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Cấu hình Hệ thống</h2>
        <p className="text-slate-500">Quản lý nền tảng kỹ thuật cho Hub của bạn.</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/40 space-y-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100">
              <Database size={32} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">Khởi tạo Google Sheets DB</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">First-time Setup</p>
            </div>
          </div>
          
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-sm font-medium text-slate-600 leading-relaxed italic">
            Hệ thống sẽ tạo các bảng (Sheets) cần thiết trong tệp Google Spreadsheet của bạn nếu chúng chưa tồn tại.
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <button 
              onClick={initDb}
              disabled={loading}
              className="px-10 py-5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100 active:scale-95 flex items-center gap-3"
            >
              {loading ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" /> : <Zap size={22} />}
              <span>{loading ? 'Đang kích hoạt...' : 'Kích hoạt Cấu trúc Sheets'}</span>
            </button>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-loose max-w-[250px] text-center sm:text-left">
              Đảm bảo biến môi trường GOOGLE_SHEET_ID đã được điền chính xác.
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

        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white overflow-hidden relative border-0 shadow-2xl shadow-slate-900/30">
           <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12 scale-150">
              <Settings size={140} className="fill-white" />
           </div>
           <div className="relative z-10 space-y-8">
              <h3 className="text-2xl font-black tracking-tight">Kỹ thuật & Bảo mật 🔑</h3>
              <div className="space-y-4">
                 {[
                   { k: 'NEXTAUTH_SECRET', v: 'Authentication Encryption' },
                   { k: 'GOOGLE_SHEET_ID', v: 'Central Spreadsheet Database' },
                   { k: 'GOOGLE_CLIENT_ID', v: 'Google OAuth Credentials' }
                 ].map((item, i) => (
                   <div key={i} className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors group">
                      <code className="text-indigo-400 font-mono text-sm font-bold group-hover:text-indigo-300">{item.k}</code>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] hidden sm:block">{item.v}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
