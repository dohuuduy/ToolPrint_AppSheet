import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Printer, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Zap,
  HardDrive,
  Cpu,
  Loader2,
  FileSearch,
  ExternalLink
} from 'lucide-react';
import { api } from '../../../services/api.service';
import { ReportTemplate, AppSheetConfig } from '../../../types';

export const ReportingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = React.useState('Đang khởi tạo kết nối...');
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [viewLink, setViewLink] = React.useState('');
  
  const rowId = searchParams.get('id');
  const templateMaId = searchParams.get('template');

  const startGenerate = async () => {
    if (!rowId || !templateMaId) return;
    setIsGenerating(true);
    setIsError(false);
    setIsSuccess(false);
    
    const interval = setInterval(() => {
      setProgress(prev => (prev < 90 ? prev + Math.random() * 5 : prev));
    }, 400);

    try {
      setStatus('Xác thực cấu hình hệ thống...');
      const [templates, apps] = await Promise.all([
        api.getTemplates(),
        api.getApps()
      ]);

      const target = templateMaId.toLowerCase();
      const template = templates.find((t: ReportTemplate) => 
        (t.ma_id?.toLowerCase() === target) || 
        (t.ma_mau?.toLowerCase() === target) || 
        (t.ten_mau?.toLowerCase() === target)
      );

      if (!template) throw new Error(`Không tìm thấy mẫu báo cáo "${templateMaId}". Vui lòng kiểm tra lại ID.`);

      const app = apps.find((a: AppSheetConfig) => a.ma_id === template.ma_ung_dung);
      if (!app) throw new Error('Không tìm thấy ứng dụng AppSheet tương ứng trong danh mục.');

      setStatus(`Truy vấn AppSheet API [Record: ${rowId}]...`);
      setProgress(40);

      const result = await api.generateReport({
        appId: app.app_id,
        apiKey: app.khoa_api || app.api_key,
        tableName: template.bang_chinh,
        rowId: rowId,
        templateId: template.file_id_drive,
        folderOutputId: app.folder_xuat_id,
        keyCol: template.key_col,
        childTable: template.child_table,
        foreignKey: template.foreign_key,
        childName: template.child_name || 'items'
      });

      clearInterval(interval);
      setProgress(100);
      setStatus('Hợp nhất thành công. Đang tối ưu đường dẫn...');
      setIsSuccess(true);
      
      const link = result.viewLink || `https://drive.google.com/file/d/${result.fileId}/view`;
      setViewLink(link);

      // Auto redirect after success display
      setTimeout(() => {
        window.location.href = link;
      }, 2500);

    } catch (err: any) {
      setStatus(err.message || 'Lỗi xử lý không xác định.');
      setIsError(true);
      setIsGenerating(false);
      clearInterval(interval);
    }
  };

  React.useEffect(() => {
    if (rowId && templateMaId) {
      startGenerate();
    }
  }, [rowId, templateMaId]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background decor elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
         <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
         <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-emerald-600/10 blur-[120px] rounded-full" />
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent shadow-[0_0_20px_white]" />
      </div>

      <div className="max-w-2xl w-full relative z-10 text-center space-y-12">
        <div className="flex flex-col items-center gap-4">
           <motion.div 
             initial={{ scale: 0.8, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-indigo-400 border border-white/10 mb-2"
           >
             <ShieldCheck size={20} />
           </motion.div>
           <h1 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em]">Report Operation Center</h1>
        </div>

        <div className="relative">
           {/* Main Status Badge */}
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 md:p-16 relative overflow-hidden"
           >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />
              
              <div className="flex flex-col items-center">
                 <div className="relative mb-10">
                    <div className={`w-32 h-32 rounded-[2.5rem] flex items-center justify-center transition-all duration-700 relative z-10 shadow-2xl ${
                      isSuccess ? 'bg-emerald-600 shadow-emerald-500/20' : 
                      isError ? 'bg-rose-600 shadow-rose-500/20' : 
                      'bg-indigo-600 shadow-indigo-500/20'
                    }`}>
                      {isSuccess ? <CheckCircle2 size={56} className="text-white" /> : 
                       isError ? <AlertTriangle size={56} className="text-white" /> : 
                       <Printer size={56} className="text-white animate-pulse" />}
                    </div>
                    {isGenerating && !isSuccess && (
                       <div className="absolute inset-x-[-20px] inset-y-[-20px] rounded-[3rem] border border-indigo-500/30 animate-ping opacity-20" />
                    )}
                 </div>

                 <div className="space-y-4 max-w-sm mx-auto mb-12">
                    <h2 className="text-2xl font-black text-white tracking-tight leading-tight">
                       {isSuccess ? 'Báo cáo đã sẵn sàng' : 
                        isError ? 'Giao thức thất bại' : 
                        'Thủ tục xuất báo cáo'}
                    </h2>
                    <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                       <p className={`text-[13px] font-bold italic tracking-wide transition-colors ${
                         isError ? 'text-rose-400' : isSuccess ? 'text-emerald-400' : 'text-slate-400'
                       }`}>
                         "{status}"
                       </p>
                    </div>
                 </div>

                 {isGenerating && !isSuccess && !isError && (
                    <div className="w-full space-y-6">
                       <div className="relative h-2 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]" 
                            style={{ width: `${progress}%` }} 
                            transition={{ ease: "linear", duration: 0.5 }}
                          />
                       </div>
                       <div className="grid grid-cols-3 gap-4">
                          {[
                            { icon: Cpu, label: 'CPU Load', value: 'Minimal' },
                            { icon: Zap, label: 'Latency', value: '<250ms' },
                            { icon: HardDrive, label: 'Cloud Sync', value: isGenerating ? 'Active' : 'Standby' }
                          ].map((item, i) => (
                            <div key={i} className="flex flex-col items-center gap-1 opacity-40">
                               <item.icon size={12} className="text-indigo-400" />
                               <span className="text-[8px] font-black uppercase text-slate-500">{item.label}</span>
                               <span className="text-[9px] font-bold text-white uppercase">{item.value}</span>
                            </div>
                          ))}
                       </div>
                    </div>
                 )}

                 {isSuccess && (
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="pt-4"
                    >
                       <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest animate-pulse mb-8 italic">
                          Chuyển hướng tự động sau 3 giây...
                       </p>
                       <a 
                        href={viewLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-3 px-10 py-5 bg-emerald-600 text-white font-black text-sm uppercase tracking-widest rounded-[1.5rem] hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-900/40 border border-emerald-500 group"
                       >
                         MỞ TÀI LIỆU NGAY
                         <ExternalLink size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                       </a>
                    </motion.div>
                 )}

                 {isError && (
                    <motion.button 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={startGenerate}
                      className="inline-flex items-center gap-3 px-10 py-5 bg-rose-600 text-white font-black text-sm uppercase tracking-widest rounded-[1.5rem] hover:bg-rose-700 transition-all shadow-xl shadow-rose-900/40 border border-rose-500 group"
                    >
                      <RotateCcw size={20} className="group-hover:rotate-180 transition-transform duration-700" />
                      THỬ LẠI QUY TRÌNH
                    </motion.button>
                 )}
              </div>
           </motion.div>

           {/* Floating Info Boxes (Desktop) */}
           <div className="hidden lg:block">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className="absolute -left-32 top-10 w-52 p-4 bg-white/5 backdrop-blur-xl border border-white/5 rounded-2xl text-left gap-3 flex flex-col"
              >
                  <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400">
                    <FileSearch size={18} />
                  </div>
                  <p className="text-[10px] font-black text-white uppercase tracking-tighter">Metadata Index</p>
                  <div className="space-y-1">
                    <p className="text-[9px] font-bold text-slate-500 uppercase">TPL_HASH: <span className="text-slate-300">{templateMaId?.slice(0, 8)}</span></p>
                    <p className="text-[9px] font-bold text-slate-500 uppercase">ROW_REF: <span className="text-slate-300">{rowId?.slice(0, 8)}</span></p>
                  </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                className="absolute -right-32 bottom-10 w-52 p-4 bg-white/5 backdrop-blur-xl border border-white/5 rounded-2xl text-left gap-3 flex flex-col"
              >
                  <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400">
                    <Zap size={18} />
                  </div>
                  <p className="text-[10px] font-black text-white uppercase tracking-tighter">Engine Status</p>
                  <div className="flex flex-col gap-1.5 mt-1">
                     <div className="flex justify-between items-center">
                        <span className="text-[8px] font-bold text-slate-500 tracking-widest uppercase">Response</span>
                        <div className="h-1 w-20 bg-emerald-500 animate-pulse rounded-full" />
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-[8px] font-bold text-slate-500 tracking-widest uppercase">Encryption</span>
                        <div className="h-1 w-16 bg-emerald-500 rounded-full" />
                     </div>
                  </div>
              </motion.div>
           </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
           <Link 
            to="/" 
            className="text-[11px] font-black text-slate-600 hover:text-white uppercase tracking-[0.2em] transition-colors flex items-center gap-2 group"
           >
             Hủy thao tác
             <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
           </Link>
           {isError && (
             <Link 
              to="/settings" 
              className="text-[11px] font-black text-slate-600 hover:text-rose-500 uppercase tracking-[0.2em] transition-colors border-l border-white/10 pl-6"
             >
               Kiểm tra cấu hình
             </Link>
           )}
        </div>
      </div>

      {/* Loader for first boot */}
      {!rowId && (
        <div className="absolute inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center gap-6">
           <Loader2 className="animate-spin text-indigo-500" size={48} />
           <p className="text-xs font-black text-slate-600 uppercase tracking-widest italic">Missing Operation Parameters</p>
           <Link to="/" className="px-8 py-3 bg-white/5 text-white rounded-xl text-[10px] font-black hover:bg-white/10 transition-all uppercase tracking-widest border border-white/10">Quay lại Tổng quan</Link>
        </div>
      )}
    </div>
  );
};
