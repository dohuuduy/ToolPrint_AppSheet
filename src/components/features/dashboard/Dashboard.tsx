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
  Info
} from 'lucide-react';
import { useAppStore } from '../../../store/use-app-store';

export const Dashboard: React.FC = () => {
  const { apps, templates, logs, loading, fetchAll } = useAppStore();

  React.useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 gap-4">
      <div className="animate-spin rounded-2xl h-10 w-10 border-4 border-indigo-600 border-t-transparent shadow-lg"></div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Đang đồng bộ dữ liệu...</p>
    </div>
  );

  if (!apps.length && !templates.length && !logs.length) {
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-6 text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-300">
          <Database size={40} />
        </div>
        <div className="max-w-md">
          <h3 className="text-xl font-black text-slate-900 mb-2">Hệ thống chưa có dữ liệu</h3>
          <p className="text-sm text-slate-500 font-medium mb-6">Bạn cần cấu hình ứng dụng và mẫu báo cáo đầu tiên. Nếu đây là lần đầu chạy, hãy vào phần Cấu hình hệ thống.</p>
          <div className="flex justify-center gap-3">
             <Link to="/apps" className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors">Kết nối AppSheet</Link>
             <Link to="/settings" className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors">Cài đặt Hub</Link>
          </div>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Ứng dụng kết nối', value: apps.length, icon: Grid, color: 'bg-indigo-600', trend: 'Active' },
    { label: 'Mẫu báo cáo', value: templates.length, icon: FileText, color: 'bg-slate-900', trend: 'Ready' },
    { label: 'Lượt in hiện tại', value: logs.length, icon: Printer, color: 'bg-emerald-600', trend: 'Monthly' },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Tổng quan hệ thống</h2>
          <p className="text-slate-500 font-medium text-sm">Xin chào! Hệ thống in ấn AppSheet đang hoạt động ổn định.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 italic">
           <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
           <span className="text-[10px] font-black uppercase tracking-widest leading-none">Cloud Sync Enabled</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl shadow-slate-200/20 group hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center text-white shadow-lg shadow-black/5`}>
                  <Icon size={20} />
                </div>
                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{stat.trend}</div>
              </div>
              <div className="text-3xl font-black text-slate-900 mb-1">{stat.value}</div>
              <div className="text-[12px] font-bold text-slate-500 uppercase tracking-tight">{stat.label}</div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-12 gap-6 pb-20">
        <div className="col-span-12 lg:col-span-12 space-y-6">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Logs Table Style List */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/20 overflow-hidden">
                <div className="p-5 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nhật ký in gần đây</h3>
                  <Link to="/logs" className="p-1 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-100"><ChevronRight size={16} className="text-slate-400" /></Link>
                </div>
                <div className="p-2">
                  <div className="divide-y divide-slate-50">
                    {logs.length > 0 ? logs.slice(0, 5).map((log: any, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-all group">
                        <div className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors shadow-sm">
                          <FileText size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-800 truncate">{log.ten_mau}</p>
                          <div className="flex items-center gap-2">
                            <code className="text-[9px] font-mono font-bold text-slate-400">ID: {log.ma_id?.slice(0, 8)}...</code>
                            <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                            <span className="text-[9px] font-black text-emerald-500 uppercase">Success</span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-[11px] font-black text-slate-900">{new Date(log.ngay_tao).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{new Date(log.ngay_tao).toLocaleDateString('vi-VN')}</p>
                        </div>
                      </div>
                    )) : (
                      <div className="py-16 text-center text-slate-300 italic border-2 border-dashed border-slate-50 rounded-2xl mx-2 my-2">Lịch sử trống</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Config */}
              <div className="space-y-6">
                <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl shadow-slate-900/20">
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                    <Zap size={100} className="fill-white" />
                  </div>
                  <h3 className="text-lg font-black mb-6 relative z-10 tracking-tight flex items-center gap-2">
                    <Zap size={18} className="text-indigo-400 fill-indigo-400" />
                    Thiết lập AppSheet Action
                  </h3>
                  <div className="space-y-6 relative z-10">
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-indigo-500/50 transition-colors">
                      <p className="text-[9px] text-indigo-400 font-black uppercase tracking-widest mb-2 italic">Copy Formula:</p>
                      <code className="text-[10px] font-mono leading-relaxed break-all select-all block text-slate-400 bg-black/30 p-3 rounded-lg border border-white/5">
                        {`CONCATENATE("${window.location.origin}/report?template=ID_MAU&id=", ENCODEURL([MA_ID]))`}
                      </code>
                    </div>
                    <div className="flex gap-3 items-start">
                      <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center shrink-0 border border-indigo-500/30">
                        <Info size={16} className="text-indigo-400" />
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                        Sử dụng công thức này trong <span className="text-white font-bold italic">Behavior {'>'} Open a website</span> để tự động mở báo cáo từ AppSheet.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl shadow-slate-200/20">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Trạng thái hạ tầng</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                      <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Database</p>
                      <div className="flex items-center gap-2 font-bold text-emerald-600 text-sm italic">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-sm" /> Connected
                      </div>
                    </div>
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                      <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Storage</p>
                      <div className="flex items-center gap-2 font-bold text-indigo-600 text-sm italic">
                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full shadow-sm" /> Cloud Ready
                      </div>
                    </div>
                  </div>
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
