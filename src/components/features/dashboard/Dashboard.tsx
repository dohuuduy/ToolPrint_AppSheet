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
  ChevronRight 
} from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';

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
    { label: 'Tổng ứng dụng', value: apps.length, icon: Grid, color: 'bg-indigo-500', trend: 'Hoạt động' },
    { label: 'Mẫu báo cáo', value: templates.length, icon: FileText, color: 'bg-emerald-500', trend: 'Sẵn sàng' },
    { label: 'Lượt in tháng', value: logs.length, icon: Printer, color: 'bg-amber-500', trend: '+12% so với tháng trước' },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Chào buổi sáng! 👋</h2>
          <p className="text-slate-500 font-medium">Đây là những gì đang diễn ra với hệ thống in ấn của bạn.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl border border-slate-200 shadow-sm">
           <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
           <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Hệ thống: Online</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/40 group cursor-default transition-all hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                  <Icon size={24} />
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.trend}</div>
              </div>
              <div className="text-4xl font-black text-slate-900 mb-1">{stat.value}</div>
              <div className="text-sm font-bold text-slate-500 tracking-tight">{stat.label}</div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-12 gap-6 pb-20">
        <div className="col-span-12 lg:col-span-7 space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center group">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] group-hover:text-indigo-600 transition-colors">Nhật ký in gần đây</h3>
              <Link to="/logs" className="p-2 hover:bg-slate-50 rounded-xl transition-colors"><ChevronRight size={18} className="text-slate-400" /></Link>
            </div>
            <div className="p-2">
              <div className="space-y-1">
                {logs.length > 0 ? logs.slice(0, 5).map((log: any, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-all group">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-indigo-600 transition-colors shadow-sm">
                      <FileText size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate">{log.ten_mau}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: {log.ma_id}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-black text-indigo-600">{new Date(log.ngay_tao).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(log.ngay_tao).toLocaleDateString('vi-VN')}</p>
                    </div>
                  </div>
                )) : (
                  <div className="py-20 text-center text-slate-300 italic border-2 border-dashed border-slate-100 rounded-[2rem] mx-4 my-2">Lịch sử trống</div>
                )}
              </div>
            </div>
            {logs.length > 5 && (
              <div className="p-4 bg-slate-50 text-center">
                 <Link to="/logs" className="text-[10px] font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-[0.2em]">Xem tất cả hoạt động</Link>
              </div>
            )}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-5 space-y-6">
           <div className="bg-slate-900 rounded-[2.5rem] border-0 p-8 text-white relative overflow-hidden group shadow-2xl shadow-slate-900/20">
              <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
                <Zap size={140} className="fill-white" />
              </div>
              <h3 className="text-xl font-black mb-6 relative z-10 tracking-tight">Thiết lập Action 🚀</h3>
              <div className="space-y-6 relative z-10">
                <div className="p-5 bg-white/5 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-colors">
                  <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mb-3">Formula AppSheet:</p>
                  <code className="text-[11px] font-mono leading-relaxed break-all select-all block text-slate-300">
                    {`CONCATENATE("${window.location.origin}/report?template=ID_MAU&id=", ENCODEURL([MA_ID]))`}
                  </code>
                </div>
                <div className="flex gap-4 items-center">
                  <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">
                    <HelpCircle size={20} />
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-bold">
                    Dán URL này vào phần <span className="text-white">Behavior {'>'} Actions</span> trong AppSheet Editor của bạn.
                  </p>
                </div>
              </div>
           </div>

           <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/40">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Trạng thái kết nối</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors cursor-default">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-sm font-bold text-slate-700">Google Sheets DB</span>
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Đã kết nối</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors cursor-default">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                    <span className="text-sm font-bold text-slate-700">Google Drive API</span>
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sẵn sàng</span>
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
