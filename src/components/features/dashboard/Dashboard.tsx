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
  TrendingUp,
  Clock,
  Activity,
  PlusCircle,
  Settings,
  ShieldCheck,
  ExternalLink,
  Copy,
  CheckCircle2
} from 'lucide-react';
import { useAppStore } from '../../../store/use-app-store';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

export const Dashboard: React.FC = () => {
  const { apps, templates, logs, loading, fetchAll } = useAppStore();
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 gap-4">
      <div className="relative">
        <div className="animate-spin rounded-2xl h-12 w-12 border-4 border-indigo-600 border-t-transparent shadow-xl"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-ping" />
        </div>
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Synching Data Engine</p>
    </div>
  );

  // Prepare chart data
  const chartData = React.useMemo(() => {
    if (!logs.length) return [];
    
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return format(d, 'dd/MM');
    }).reverse();

    return last7Days.map(date => {
      const count = logs.filter(log => format(new Date(log.ngay_tao), 'dd/MM') === date).length;
      return { name: date, count };
    });
  }, [logs]);

  if (!apps.length && !templates.length && !logs.length) {
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-8 text-center max-w-2xl mx-auto">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-indigo-50 rounded-[40px] flex items-center justify-center text-indigo-200 border-2 border-dashed border-indigo-200"
        >
          <Database size={48} />
        </motion.div>
        <div>
          <h3 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Hệ thống sẵn sàng</h3>
          <p className="text-slate-500 font-medium leading-relaxed">Chào mừng bạn đến với PrintHub. Để bắt đầu, hãy kết nối ứng dụng AppSheet đầu tiên của bạn và tải lên các mẫu báo cáo Word/Excel.</p>
        </div>
        <div className="grid grid-cols-2 gap-4 w-full">
          <Link to="/apps" className="flex flex-col items-center gap-3 p-6 bg-white border-2 border-slate-100 rounded-3xl hover:border-indigo-600 hover:shadow-2xl hover:shadow-indigo-200/50 transition-all group">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
              <PlusCircle size={24} />
            </div>
            <span className="font-black text-xs uppercase tracking-widest text-slate-900">Thêm AppSheet</span>
          </Link>
          <Link to="/templates" className="flex flex-col items-center gap-3 p-6 bg-white border-2 border-slate-100 rounded-3xl hover:border-slate-900 hover:shadow-2xl hover:shadow-slate-200 transition-all group">
            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg">
              <FileText size={24} />
            </div>
            <span className="font-black text-xs uppercase tracking-widest text-slate-900">Tạo mẫu biểu</span>
          </Link>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Apps Kết nối', value: apps.length, icon: Grid, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Mẫu báo cáo', value: templates.length, icon: FileText, color: 'text-slate-900', bg: 'bg-slate-100' },
    { label: 'Tổng lượt in', value: logs.length, icon: Printer, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  const formula = `CONCATENATE("${window.location.origin}/report?template=ID_MAU&id=", ENCODEURL([MA_ID]))`;

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      {/* Header Secion */}
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 bg-indigo-600 text-[9px] font-black text-white uppercase tracking-widest rounded-md">Architect v1.0</span>
            <span className="text-[10px] font-bold text-slate-400 font-mono">{format(new Date(), 'EEEE, dd MMMM yyyy', { locale: vi })}</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Bảng điều hướng</h1>
          <p className="text-slate-500 font-medium italic">Giải pháp in ấn tập trung cho Google Cloud Ecosystem.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Cloud Status</span>
            <span className="text-sm font-black text-emerald-600 italic">Operational</span>
          </div>
          <div className="w-10 h-10 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
            <ShieldCheck size={20} className="animate-pulse" />
          </div>
        </div>
      </section>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column: Stats & Chart */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white p-5 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-4 group hover:shadow-xl hover:shadow-slate-200/50 transition-all cursor-default"
                >
                  <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center shrink-0`}>
                    <Icon size={24} strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                    <p className="text-2xl font-black text-slate-900 leading-none">{stat.value.toLocaleString()}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Activity Chart Card */}
          <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-8 space-y-6 relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-1 w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                  <TrendingUp size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 tracking-tight">Xu hướng in ấn</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">7 ngày gần nhất</p>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-full text-[10px] font-black text-slate-600">Lượt in</div>
              </div>
            </div>

            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                  />
                  <YAxis 
                    hide 
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }}
                    cursor={{ stroke: '#4f46e5', strokeWidth: 2, strokeDasharray: '3 3' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#4f46e5" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorCount)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Actions List */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/report" className="flex flex-col items-center justify-center p-4 bg-slate-900 text-white rounded-3xl gap-2 hover:bg-black transition-colors shadow-lg">
              <Printer size={20} />
              <span className="text-[9px] font-bold uppercase tracking-widest">In nhanh</span>
            </Link>
            <Link to="/apps" className="flex flex-col items-center justify-center p-4 bg-white border border-slate-100 text-slate-600 rounded-3xl gap-2 hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm">
              <PlusCircle size={20} />
              <span className="text-[9px] font-bold uppercase tracking-widest text-center">Kết nối App</span>
            </Link>
            <Link to="/templates" className="flex flex-col items-center justify-center p-4 bg-white border border-slate-100 text-slate-600 rounded-3xl gap-2 hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm">
              <FileText size={20} />
              <span className="text-[9px] font-bold uppercase tracking-widest text-center">Mẫu biểu</span>
            </Link>
            <Link to="/settings" className="flex flex-col items-center justify-center p-4 bg-white border border-slate-100 text-slate-600 rounded-3xl gap-2 hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm">
              <Settings size={20} />
              <span className="text-[9px] font-bold uppercase tracking-widest shadow-sm">Thiết lập</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Alerts & Recent Logs */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Action Formula Card */}
          <div className="bg-indigo-600 rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-600/20 group">
             <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
             <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-2">
                  <Zap size={20} className="fill-indigo-300 text-indigo-300" />
                  <h3 className="text-lg font-black tracking-tighter">AppSheet Linker</h3>
                </div>
                <div className="bg-black/20 p-4 rounded-2xl border border-white/10 space-y-3">
                  <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest">Master Formula</p>
                  <code className="text-[10px] font-mono block break-all text-white/80 leading-relaxed leading-relaxed font-bold">
                    {formula}
                  </code>
                  <button 
                    onClick={() => handleCopy(formula)}
                    className="w-full flex items-center justify-center gap-2 py-2 bg-white text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 transition-colors shadow-lg"
                  >
                    {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                    {copied ? 'Đã sao chép' : 'Copy link công thức'}
                  </button>
                </div>
                <div className="flex items-start gap-3">
                   <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                      <HelpCircle size={16} />
                   </div>
                   <p className="text-[11px] font-medium leading-relaxed opacity-80">
                      Dán vào Behavior {'>'} Open a website trong AppSheet để kích hoạt tính năng in ấn.
                   </p>
                </div>
             </div>
          </div>

          {/* Recent History Card */}
          <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full min-h-[460px]">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
               <div>
                  <h3 className="text-sm font-black text-slate-900 tracking-tight">Nhật ký truy xuất</h3>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Hoạt động thời gian thực</p>
               </div>
               <Link to="/history" className="w-8 h-8 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all">
                  <ChevronRight size={18} />
               </Link>
            </div>
            <div className="flex-1 p-2 overflow-y-auto">
               <div className="space-y-1">
                 {logs.length > 0 ? logs.slice(0, 6).map((log, i) => (
                   <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={i} 
                    className="flex justify-between items-center p-4 hover:bg-slate-50 rounded-3xl transition-all group"
                   >
                     <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-all shadow-sm">
                         <Printer size={18} />
                       </div>
                       <div className="min-w-0">
                         <p className="text-xs font-black text-slate-900 truncate uppercase">{log.ten_mau}</p>
                         <p className="text-[9px] text-slate-400 font-bold truncate">Mã: {log.ma_id}</p>
                       </div>
                     </div>
                     <div className="text-right shrink-0">
                        <div className="flex items-center justify-end gap-1 mb-1">
                          <Activity size={10} className="text-emerald-500" />
                          <span className="text-[9px] font-black text-emerald-500 uppercase">Success</span>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400">{format(new Date(log.ngay_tao), 'HH:mm', { locale: vi })}</p>
                     </div>
                   </motion.div>
                 )) : (
                   <div className="flex flex-col items-center justify-center py-20 text-slate-300 italic opacity-50 space-y-4">
                      <Clock size={40} strokeWidth={1} />
                      <p className="text-xs font-bold uppercase tracking-widest">Không có dữ liệu</p>
                   </div>
                 )}
               </div>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100">
               <Link to="/history" className="flex items-center justify-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-indigo-600 transition-colors">
                  Xem tất cả hoạt động
                  <ExternalLink size={12} />
               </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
