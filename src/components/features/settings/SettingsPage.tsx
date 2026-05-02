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
    <div className="space-y-10 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic">Cấu hình <span className="text-indigo-600">Hệ thống</span></h2>
           <p className="text-slate-500 text-sm font-medium mt-1">Thiết lập nền tảng kỹ thuật và các kết nối cơ sở dữ liệu quan trọng.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-2xl shadow-slate-200/40 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none" />
          
          <div className="relative z-10 space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 border border-indigo-100 flex-shrink-0">
                <Database size={28} />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-tighter leading-none italic">Google Sheets DB</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Cơ sở dữ liệu đám mây</p>
              </div>
            </div>
            
            <div className="p-6 bg-slate-50 rounded-[1.5rem] border border-slate-100 text-xs font-bold text-slate-500 leading-relaxed italic">
              "Kích hoạt các Sheets nội bộ cần thiết để lưu trữ ứng dụng, mẫu biểu, ánh xạ biến và nhật ký in ấn."
            </div>

            <div className="space-y-6">
              <button 
                onClick={initDb}
                disabled={loading}
                className="btn-primary w-full py-4 text-sm"
              >
                {loading ? <RefreshCw size={20} className="animate-spin" /> : <Zap size={20} />}
                <span className="font-black uppercase tracking-widest">{loading ? 'Đang thực thi cấu trúc...' : 'Khởi tạo cấu trúc Sheets'}</span>
              </button>
              
              <div className="flex items-center gap-3 px-2">
                 <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                   Hãy chắc chắn ID Spreadsheet trong tệp <code className="text-indigo-600">.env</code> là chính xác.
                 </p>
              </div>
            </div>
          </div>

          {status && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              className={`mt-10 p-6 rounded-[2rem] border flex items-center gap-5 ${status === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-rose-50 border-rose-100 text-rose-800'}`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${status === 'success' ? 'bg-emerald-600 text-white shadow-emerald-200' : 'bg-rose-600 text-white shadow-rose-200'}`}>
                {status === 'success' ? <Check size={24} /> : <X size={24} />}
              </div>
              <div>
                 <p className="text-[10px] font-black uppercase tracking-widest opacity-60 leading-none mb-1">{status === 'success' ? 'Hoàn tất' : 'Thất bại'}</p>
                 <p className="text-xs font-black italic">{message}</p>
              </div>
            </motion.div>
          )}
        </div>

        <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white overflow-hidden relative border-0 shadow-2xl shadow-indigo-900/20 flex flex-col justify-between">
           <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12 scale-[2] pointer-events-none">
              <Settings size={180} />
           </div>
           
           <div className="relative z-10 space-y-10">
              <div>
                 <h3 className="text-xl font-black italic tracking-tighter leading-none mb-2 uppercase">Bảo mật & Biến môi trường</h3>
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Environment Variables Verification</p>
              </div>

              <div className="space-y-4">
                 {[
                   { k: 'NEXTAUTH_SECRET', v: 'Security Token / API Auth', icon: '🔑' },
                   { k: 'GOOGLE_SHEET_ID', v: 'Database Root ID', icon: '📊' },
                   { k: 'GOOGLE_CLIENT_ID', v: 'Google OAuth Client', icon: '🛡️' }
                 ].map((item, i) => (
                   <div key={i} className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all group backdrop-blur-sm">
                      <div className="flex items-center gap-4">
                         <span className="text-lg">{item.icon}</span>
                         <div>
                            <code className="text-indigo-400 font-mono text-xs font-black block group-hover:text-indigo-300 transition-colors uppercase">{item.k}</code>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1 group-hover:text-slate-400 transition-colors">{item.v}</p>
                         </div>
                      </div>
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                   </div>
                 ))}
              </div>
           </div>

           <div className="relative z-10 mt-10 pt-10 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center font-black text-xs">AI</div>
                 <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] leading-tight">Secured by <br />AppSheet Print Engine</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
