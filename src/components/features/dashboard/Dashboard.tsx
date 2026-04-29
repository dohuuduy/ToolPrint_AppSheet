import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Grid, 
  FileText, 
  Printer, 
  Zap, 
  HelpCircle, 
  Database, 
  ChevronRight,
  Info,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAppStore } from '../../../store/use-app-store';

export const Dashboard: React.FC = () => {
  const { apps, templates, logs, loading, fetchAll } = useAppStore();

  React.useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 gap-4">
      <div className="relative">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600/20 border-t-indigo-600"></div>
        <div className="absolute inset-0 flex items-center justify-center animate-pulse">
          <Database size={16} className="text-indigo-600" />
        </div>
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Đồng bộ dữ liệu...</p>
    </div>
  );

  if (!apps.length && !templates.length && !logs.length) {
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-8 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 border-2 border-dashed border-slate-100">
          <Database size={48} />
        </div>
        <div className="max-w-md">
          <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Trung tâm điều khiển chưa sẵn sàng</h3>
          <p className="text-slate-500 font-medium mb-8 leading-relaxed">Để bắt đầu, bạn cần kết nối với ứng dụng AppSheet và tải lên ít nhất một mẫu báo cáo (Word/Excel).</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
             <Link to="/apps" className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-2">
               <Grid size={18} />
               Kết nối AppSheet
             </Link>
             <Link to="/settings" className="px-8 py-4 bg-white text-slate-600 rounded-2xl font-black text-sm hover:bg-slate-50 border border-slate-200 transition-all flex items-center justify-center gap-2">
               <HelpCircle size={18} />
               Xem hướng dẫn
             </Link>
          </div>
        </div>
      </div>
    );
  }

  const stats = [
    { 
      label: 'Ứng dụng', 
      value: apps.length, 
      subValue: 'Đang kết nối',
      icon: Grid, 
      color: 'bg-indigo-600', 
      bgLight: 'bg-indigo-50',
      textColor: 'text-indigo-600'
    },
    { 
      label: 'Mẫu biểu', 
      value: templates.length, 
      subValue: 'Sẵn sàng in',
      icon: FileText, 
      color: 'bg-slate-900', 
      bgLight: 'bg-slate-100',
      textColor: 'text-slate-900'
    },
    { 
      label: 'Tổng lượt in', 
      value: logs.length, 
      subValue: 'Trong tháng này',
      icon: Printer, 
      color: 'bg-emerald-600', 
      bgLight: 'bg-emerald-50',
      textColor: 'text-emerald-600'
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded">Console v1.0</span>
             <span className="text-slate-300">•</span>
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Chào mừng quay lại!</h2>
          <p className="text-slate-500 font-medium text-sm mt-1">Hệ thống PrintHub của bạn đang vận hành ổn định trên đám mây.</p>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-100 shadow-sm">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[11px] font-black text-slate-600 uppercase tracking-wider">Hệ thống: Online</span>
           </div>
           <button 
             onClick={fetchAll}
             className="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-black transition-all flex items-center gap-2 shadow-lg shadow-black/10 active:scale-95"
           >
             <Zap size={14} className="fill-current" />
             Làm mới dữ liệu
           </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/40 group transition-all duration-500 relative overflow-hidden"
            >
              <div className="flex justify-between items-start relative z-10">
                <div className={`w-14 h-14 ${stat.bgLight} ${stat.textColor} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                  <Icon size={28} />
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <ArrowUpRight size={16} className="text-slate-400" />
                </div>
              </div>
              <div className="mt-8 relative z-10">
                <div className="text-4xl font-black text-slate-900 tracking-tighter mb-1">{stat.value}</div>
                <div className="flex items-center gap-2">
                   <span className="text-[12px] font-black text-slate-900 uppercase tracking-tight">{stat.label}</span>
                   <span className="text-slate-300">/</span>
                   <span className="text-[11px] font-bold text-slate-400 capitalize">{stat.subValue}</span>
                </div>
              </div>
              
              {/* Abstract decorative element */}
              <div className={`absolute -bottom-8 -right-8 w-32 h-32 ${stat.bgLight} rounded-full group-hover:scale-150 transition-transform duration-700 opacity-20`} />
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-12 gap-8 pb-10">
        {/* Recent Activity Section */}
        <div className="col-span-12 lg:col-span-7 xl:col-span-8 space-y-6">
           <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full">
              <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                    <Clock size={16} className="text-indigo-500" />
                    Lịch sử xử lý gần đây
                  </h3>
                  <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-tight">Thời gian thực (Real-time)</p>
                </div>
                <Link 
                  to="/logs" 
                  className="px-4 py-2 text-[11px] font-black text-indigo-600 hover:bg-indigo-50 border border-indigo-100 rounded-xl transition-all uppercase tracking-widest"
                >
                  Xem tất cả
                </Link>
              </div>
              
              <div className="flex-1 overflow-auto">
                {logs.length > 0 ? (
                  <div className="divide-y divide-slate-50">
                    {logs.slice(0, 6).map((log: any, i) => (
                      <div key={i} className="flex items-center gap-4 p-6 hover:bg-slate-50/80 transition-all group">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border transition-all duration-300 ${
                          log.trang_thai === 'Thành công' 
                            ? 'bg-emerald-50 border-emerald-100 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white' 
                            : 'bg-amber-50 border-amber-100 text-amber-600 group-hover:bg-amber-500 group-hover:text-white'
                        }`}>
                          {log.trang_thai === 'Thành công' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                             <p className="text-base font-black text-slate-900 truncate tracking-tight">{log.ten_mau}</p>
                             <span className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${
                               log.trang_thai === 'Thành công' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                             }`}>
                               {log.trang_thai === 'Thành công' ? 'Success' : 'Warning'}
                             </span>
                          </div>
                          <div className="flex items-center gap-3">
                             <div className="flex items-center gap-1.5 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200/50">
                               <Database size={10} className="text-slate-400" />
                               <code className="text-[10px] font-mono font-bold text-slate-500">{log.ma_id?.slice(0, 10)}</code>
                             </div>
                             <span className="text-slate-200">|</span>
                             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter shrink-0">{new Date(log.ngay_tao).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}</span>
                          </div>
                        </div>
                        <div className="hidden sm:block">
                           <button className="p-2 text-slate-300 hover:text-slate-900 transition-colors opacity-0 group-hover:opacity-100">
                             <ArrowUpRight size={20} />
                           </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center py-20 text-center px-10">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-4 border border-dashed border-slate-200">
                      <Clock size={32} />
                    </div>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest italic">Chưa có lịch sử in ấn</p>
                  </div>
                )}
              </div>
           </div>
        </div>

        {/* Guides & Setup Sidebar */}
        <div className="col-span-12 lg:col-span-5 xl:col-span-4 space-y-8">
           {/* Action Setup Box */}
           <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-slate-900/40 h-[450px]">
              <div className="absolute top-0 right-0 p-10 opacity-10 scale-150 rotate-12">
                <Zap size={100} className="fill-white" />
              </div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center border border-indigo-500/30 mb-8 shadow-inner shadow-white/5">
                   <Zap size={24} className="text-indigo-400 fill-indigo-400" />
                </div>
                
                <h3 className="text-2xl font-black mb-4 tracking-tight">Tích hợp AppSheet</h3>
                <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8">
                  Chỉ cần một công thức đơn giản để biến AppSheet thành cỗ máy xuất báo cáo mạnh mẽ.
                </p>
                
                <div className="space-y-6 mt-auto">
                  <div className="p-5 bg-black/40 rounded-3xl border border-white/5 group hover:border-indigo-500/40 transition-all">
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest italic">APP FORMULA</p>
                      <button 
                        onClick={() => {
                          const formula = `CONCATENATE("${window.location.origin}/report?template=ID_MAU&id=", ENCODEURL([MA_ID]))`;
                          navigator.clipboard.writeText(formula);
                        }}
                        className="text-[10px] font-black text-slate-500 hover:text-white transition-colors"
                      >
                        COPY
                      </button>
                    </div>
                    <code className="text-[11px] font-mono leading-relaxed break-all select-all block text-slate-300 py-1">
                      {`CONCATENATE("${window.location.origin}/report?template=MA_MAU&id=", ENCODEURL([MA_ID]))`}
                    </code>
                  </div>

                  <div className="flex gap-4 items-start p-4 bg-white/5 rounded-2xl">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0 border border-white/5">
                      <Info size={14} className="text-indigo-400" />
                    </div>
                    <p className="text-[12px] text-slate-400 leading-relaxed font-medium">
                      Dán vào phần <span className="text-white font-black italic underline decoration-indigo-500/50">Behavior {'>'} Open a website</span> của Action trong AppSheet.
                    </p>
                  </div>

                  <Link to="/templates" className="flex items-center justify-between w-full p-4 bg-indigo-600 hover:bg-indigo-700 rounded-2xl transition-all shadow-xl shadow-indigo-500/20 group">
                     <span className="text-xs font-black uppercase tracking-widest text-white">Quản lý mã mẫu</span>
                     <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
           </div>

           {/* Quick Stats Panel */}
           <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
             <div className="flex items-center gap-3 mb-8">
               <div className="w-2 h-6 bg-slate-900 rounded-full" />
               <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Hạ tầng kết nối</h3>
             </div>
             
             <div className="space-y-4">
               {[
                 { name: 'AppSheet API', status: 'Optimal', icon: Grid, color: 'text-emerald-500' },
                 { name: 'Google Drive', status: 'Stable', icon: Database, color: 'text-indigo-500' },
                 { name: 'Sheets DB', status: 'Verified', icon: FileText, color: 'text-amber-500' },
               ].map((item, id) => (
                 <div key={id} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-50">
                   <div className="flex items-center gap-3">
                     <div className={`w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-slate-100 shadow-sm ${item.color}`}>
                       <item.icon size={14} />
                     </div>
                     <span className="text-[11px] font-black text-slate-700 uppercase tracking-tight">{item.name}</span>
                   </div>
                   <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 italic">{item.status}</span>
                 </div>
               ))}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};
