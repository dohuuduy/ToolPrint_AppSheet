import React from 'react';
import { motion } from 'motion/react';
import { 
  Database, 
  Settings, 
  Zap, 
  Check, 
  X,
  Shield,
  Key,
  Globe,
  FileSpreadsheet,
  AlertCircle,
  ExternalLink,
  ChevronRight
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
    <div className="space-y-8 pb-20">
      {/* Header section */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <div className="flex items-center gap-2 mb-2">
             <div className="w-8 h-8 bg-slate-950 rounded-xl flex items-center justify-center text-white">
               <Settings size={16} />
             </div>
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Platform Engine</span>
           </div>
           <h2 className="text-3xl font-black text-slate-900 tracking-tight">Cấu hình Hệ thống</h2>
           <p className="text-slate-500 font-medium text-sm mt-1">Thiết lập nền tảng kỹ thuật và các tham số vận hành Hub.</p>
        </div>
        
        <div className="flex items-center gap-2 px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100">
           <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Server: Online</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
           {/* Sheets Init Section */}
           <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm space-y-10 group overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-indigo-100 transition-all duration-700" />
              
              <div className="flex items-start justify-between relative z-10">
                 <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-indigo-600 shadow-xl shadow-slate-100 group-hover:scale-110 transition-transform">
                      <FileSpreadsheet size={32} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900">Khởi tạo Google Sheets DB</h3>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">Core Database Provisioning</p>
                    </div>
                 </div>
              </div>
              
              <p className="text-sm font-bold text-slate-500 leading-relaxed max-w-2xl relative z-10">
                Hệ thống tự động phát hiện và sinh các bảng (Sheets) cần thiết cho vận hành như: <code className="text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded italic">ung_dung</code>, <code className="text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded italic">mau_bieu</code>, <code className="text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded italic">nhat_ky_in</code>...
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
                <button 
                  onClick={initDb}
                  disabled={loading}
                  className="w-full sm:w-auto px-10 py-5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100 active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {loading ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" /> : <Zap size={22} />}
                  <span>{loading ? 'ĐANG KHỞI TẠO...' : 'KÍCH HOẠT CẤU TRÚC'}</span>
                </button>
                <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100 flex-1">
                   <AlertCircle size={18} className="text-amber-500 shrink-0 mt-0.5" />
                   <div className="space-y-1">
                      <p className="text-[11px] font-black text-amber-900 leading-tight uppercase italic tracking-tight">Lưu ý quan trọng</p>
                      <p className="text-[10px] text-amber-700 font-medium">Bạn cần đảm bảo biến <code className="font-black">GOOGLE_SHEET_ID</code> đã được cấu hình trong Environment Variables của Vercel.</p>
                   </div>
                </div>
              </div>

              {status && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`p-6 rounded-3xl border flex items-center gap-4 ${status === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-rose-50 border-rose-100 text-rose-800'}`}>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${status === 'success' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'bg-rose-600 text-white shadow-lg shadow-rose-200'}`}>
                    {status === 'success' ? <Check size={24} /> : <X size={24} />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-black tracking-tight">{message}</p>
                    <p className="text-[10px] font-bold uppercase opacity-60 mt-1">{status === 'success' ? 'Operation Completed' : 'Operation Failed'}</p>
                  </div>
                </motion.div>
              )}
           </div>

           {/* Security / Env Section */}
           <div className="bg-slate-950 rounded-[2.5rem] p-10 text-white overflow-hidden relative border-0 shadow-2xl">
              <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12 scale-150">
                <Shield size={160} />
              </div>
              
              <div className="relative z-10 space-y-10">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/5">
                      <Key size={24} className="text-indigo-400" />
                    </div>
                    <div>
                       <h3 className="text-2xl font-black tracking-tight">Tham số Bảo mật</h3>
                       <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mt-1 italic">Vercel Environment Keys Control</p>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { k: 'NEXTAUTH_URL', d: 'App redirect base URI', s: 'Active' },
                      { k: 'NEXTAUTH_SECRET', d: 'Auth encryption hash', s: 'Encrypted' },
                      { k: 'GOOGLE_SHEET_ID', d: 'Database pointer ID', s: 'Active' },
                      { k: 'GOOGLE_CLIENT_ID', d: 'Google OAuth key', s: 'Verified' },
                    ].map((item, i) => (
                      <div key={i} className="group p-6 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-all hover:border-indigo-500/30">
                        <div className="flex justify-between items-start mb-3">
                           <code className="text-indigo-400 font-mono text-xs font-black group-hover:text-indigo-300 transition-colors uppercase">{item.k}</code>
                           <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                        </div>
                        <p className="text-[10px] font-bold text-slate-500 tracking-tight uppercase mb-1">{item.d}</p>
                        <div className="flex items-center gap-2">
                           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.s}</span>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
           <div className="bg-indigo-50/50 p-8 rounded-[2.5rem] border border-indigo-100/50 space-y-6">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100">
                <Globe size={24} />
              </div>
              <h4 className="text-lg font-black text-slate-900 tracking-tight leading-tight">Hướng dẫn cấu hình trên Vercel</h4>
              <p className="text-[13px] font-medium text-slate-500 leading-relaxed">
                Để ứng dụng hoạt động chính xác sau khi deploy, hãy chắc chắn bạn đã điền đầy đủ các thông tin bí mật tại tab <span className="font-black text-slate-900 uppercase text-[11px]">Settings &gt; Environment Variables</span>.
              </p>
              <div className="space-y-3 pt-2">
                 <a href="https://vercel.com/docs" target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 bg-white rounded-2xl text-xs font-black text-slate-900 hover:shadow-lg hover:shadow-slate-200/50 transition-all group">
                   HƯỚNG DẪN VERCEL
                   <ChevronRight size={16} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                 </a>
                 <a href="https://console.cloud.google.com" target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 bg-white rounded-2xl text-xs font-black text-slate-900 hover:shadow-lg hover:shadow-slate-200/50 transition-all group">
                   GOOGLE CLOUD CONSOLE
                   <ChevronRight size={16} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                 </a>
              </div>
           </div>

           <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 items-center justify-center flex flex-col text-center">
              <Shield size={40} className="text-slate-200 mb-4" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-loose">
                Bảo vệ bởi mã hóa RSA-256 <br /> Hub v2.4.0 Stable
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};
