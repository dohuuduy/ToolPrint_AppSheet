import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Printer, 
  Zap, 
  HelpCircle, 
  Database, 
  ChevronRight,
  TrendingUp,
  Clock,
  Activity,
  PlusCircle,
  Settings,
  ShieldCheck,
  ExternalLink,
  Copy,
  CheckCircle2,
  Terminal,
  Layers,
  Cpu,
  Globe,
  RefreshCcw,
  LayoutGrid
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
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    fetchAll();
    setIsMounted(true);
  }, [fetchAll]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const chartData = React.useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return format(d, 'dd/MM');
    }).reverse();

    return days.map(date => ({
      name: date,
      count: logs.filter(log => format(new Date(log.ngay_tao), 'dd/MM') === date).length
    }));
  }, [logs]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-8">
      <div className="relative">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="w-24 h-24 rounded-[32px] border-2 border-indigo-600/10 border-t-indigo-600 shadow-[0_0_40px_rgba(79,70,229,0.1)]" 
        />
        <div className="absolute inset-0 flex items-center justify-center">
            <Cpu size={32} className="text-indigo-600 animate-pulse" />
        </div>
      </div>
      <div className="text-center space-y-2">
        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">System Initializing</h2>
        <div className="flex items-center gap-2 justify-center">
          <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  );

  if (isMounted && !apps.length && !templates.length && !logs.length) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto py-24 text-center space-y-10"
      >
        <div className="inline-flex flex-col items-center gap-4">
          <div className="p-8 bg-white rounded-[48px] border border-slate-100 shadow-2xl relative">
            <Database size={64} className="text-indigo-100" />
            <motion.div 
              animate={{ opacity: [1, 0.4, 1] }} 
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-2 -right-2 bg-amber-500 p-2 rounded-full border-4 border-white shadow-lg text-white"
            >
              <Zap size={16} />
            </motion.div>
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">CHỜ CẤU HÌNH NODE</h2>
          <p className="text-slate-500 font-medium max-w-md mx-auto leading-relaxed">
            Hệ thống Cloud Engine đã sẵn sàng. Vui lòng kết nối với AppSheet ID và khởi tạo Schema báo cáo để kích hoạt tính năng.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/apps" className="w-full sm:w-auto px-10 py-5 bg-slate-900 text-white rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all hover:scale-105 shadow-2xl">
            Kết nối AppSheet
          </Link>
          <Link to="/settings" className="w-full sm:w-auto px-10 py-5 bg-white border-2 border-slate-100 text-slate-900 rounded-3xl font-black text-xs uppercase tracking-widest hover:border-indigo-600 transition-all">
            Cấu hình API
          </Link>
        </div>
      </motion.div>
    );
  }

  const formula = `CONCATENATE("${window.location.origin}/report?template=ID_MAU&id=", ENCODEURL([MA_ID]))`;

  return (
    <div className="space-y-8 pb-24 max-w-[1600px] mx-auto overflow-x-hidden p-4 md:p-0">
      {/* Top Header Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-indigo-200">
                <Terminal size={24} />
             </div>
             <div>
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-none uppercase">BẢNG ĐIỀU KHIỂN</h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1.5 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  Hệ thống: Online
                </p>
             </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-4 px-6 py-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Trạng thái</span>
              <span className="text-xs font-bold text-slate-900 mt-1 italic">Stable</span>
            </div>
            <div className="w-px h-8 bg-slate-100" />
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Phiên bản</span>
              <span className="text-xs font-mono font-bold text-slate-900 mt-1 uppercase">v2.0-Ultimate</span>
            </div>
          </div>
          <button 
            onClick={() => fetchAll()}
            disabled={loading}
            className="p-4 bg-slate-950 text-white rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-200/50 flex-shrink-0"
          >
            <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </section>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-12 gap-6 md:gap-8">
        
        {/* Stats Column - Bento Cards */}
        <div className="col-span-1 md:col-span-2 xl:col-span-3 space-y-6 md:space-y-8">
           {[
              { label: 'Ứng dụng AppSheet', value: apps.length, icon: Layers, color: 'text-indigo-600', trend: '+12%' },
              { label: 'Mẫu biểu báo cáo', value: templates.length, icon: FileText, color: 'text-violet-600', trend: 'Ready' },
              { label: 'Tổng lượt in/xuất', value: logs.length, icon: Printer, color: 'text-emerald-600', trend: 'Active' },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-[2.5rem] border border-slate-200/60 shadow-sm transition-all hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1 group"
              >
                <div className="flex justify-between items-start mb-8">
                  <div className={`w-14 h-14 bg-slate-50 ${stat.color} rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 group-hover:bg-white group-hover:shadow-lg group-hover:shadow-slate-100`}>
                    <stat.icon size={28} strokeWidth={2.5} />
                  </div>
                  <div className="px-2.5 py-1 bg-slate-50 rounded-lg text-[9px] font-black text-slate-400 uppercase tracking-widest">{stat.trend}</div>
                </div>
                <div className="text-5xl font-black text-slate-950 tracking-tighter mb-1 select-none">{stat.value.toString().padStart(2, '0')}</div>
                <div className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase">{stat.label}</div>
              </motion.div>
            ))}
        </div>

        {/* Center Activity Plot */}
        <div className="col-span-1 md:col-span-2 lg:col-span-4 xl:col-span-6 space-y-8">
           <div className="bg-white rounded-[3.5rem] border border-slate-200/60 shadow-sm p-8 md:p-10 h-[500px] md:h-[600px] flex flex-col relative overflow-hidden group">
              {/* Background Accent */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-50 rounded-full blur-[100px] opacity-50 group-hover:opacity-80 transition-opacity" />
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4 relative z-10">
                 <div className="space-y-1">
                    <h3 className="text-xs font-black text-slate-900 tracking-[0.4em] uppercase">Hoạt động trích xuất</h3>
                    <p className="text-[10px] font-bold text-slate-400 italic">Thống kê lưu lượng 7 ngày gần nhất</p>
                 </div>
                 <div className="px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center gap-2">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black text-indigo-700 uppercase tracking-widest">Dữ liệu thời gian thực</span>
                 </div>
              </div>

              <div className="flex-1 min-h-0 w-full relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }}
                      dy={10}
                    />
                    <YAxis hide />
                    <Tooltip 
                      cursor={{ stroke: '#4f46e5', strokeWidth: 2, strokeDasharray: '4 4' }}
                      contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', padding: '16px' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="count" 
                      stroke="#4f46e5" 
                      strokeWidth={5}
                      fill="url(#chartGradient)" 
                      animationDuration={2000}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
           </div>

           {/* Quick Action Grid */}
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[
                { to: '/report', label: 'XUẤT BÁO CÁO', icon: Printer, primary: true },
                { to: '/apps', label: 'CẤU HÌNH APP', icon: Database },
                { to: '/templates', label: 'QUẢN LÝ MẪU', icon: FileText },
                { to: '/settings', label: 'HỆ THỐNG', icon: Settings }
              ].map((btn, i) => (
                <Link 
                  key={i} 
                  to={btn.to}
                  className={`flex flex-col items-center justify-center p-6 rounded-[2.5rem] gap-4 transition-all hover:scale-105 active:scale-95 ${
                    btn.primary 
                      ? 'bg-slate-950 text-white shadow-2xl shadow-slate-300 transform md:-translate-y-2' 
                      : 'bg-white border border-slate-200/60 text-slate-600 hover:border-indigo-600 hover:text-indigo-600 hover:shadow-xl hover:shadow-indigo-50/50'
                  }`}
                >
                   <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${btn.primary ? 'bg-white/10' : 'bg-slate-50 group-hover:bg-indigo-50'}`}>
                      <btn.icon size={24} strokeWidth={2.5} />
                   </div>
                   <span className="text-[9px] font-black uppercase tracking-[0.2em] text-center">{btn.label}</span>
                </Link>
              ))}
           </div>
        </div>

        {/* Right Info Column */}
        <div className="col-span-1 md:col-span-2 lg:col-span-4 xl:col-span-3 space-y-8">
           
           {/* Formula Card */}
           <div className="bg-slate-950 rounded-[3rem] p-8 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600 rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity" />
              
              <div className="relative z-10 space-y-8">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <Zap size={20} className="text-indigo-400 fill-indigo-400" />
                       <h3 className="text-xs font-black tracking-widest uppercase italic">Logic Cửa Ngõ</h3>
                    </div>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]" />
                 </div>
                 
                 <div className="space-y-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Công thức AppSheet:</p>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-[10px] font-mono text-slate-300 break-all leading-relaxed bg-white/[0.02] backdrop-blur-sm">
                       {formula}
                    </div>
                    <button 
                      onClick={() => handleCopy(formula)}
                      className="w-full py-4.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all shadow-xl shadow-indigo-900/40 active:scale-[0.98] flex items-center justify-center gap-3"
                    >
                       {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                       {copied ? 'Đã sao chép' : 'SAO CHÉP CÔNG THỨC'}
                    </button>
                 </div>
              </div>
           </div>

           {/* Logs Feed */}
           <div className="bg-white rounded-[3rem] border border-slate-200/60 shadow-sm flex flex-col h-[640px] overflow-hidden group/logs">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                 <div>
                    <h3 className="text-xs font-black text-slate-950 tracking-[0.3em] uppercase">Nhật ký truy xuất</h3>
                    <p className="text-[9px] font-bold text-slate-400 mt-1 italic uppercase tracking-widest">Phân tích đồng bộ</p>
                 </div>
                 <Link to="/logs" className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm">
                    <ChevronRight size={24} />
                 </Link>
              </div>
              
              <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
                 {logs.length > 0 ? (
                   logs.slice(0, 15).map((log, i) => (
                     <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        key={i} 
                        className="flex items-center p-4 hover:bg-slate-50 rounded-3xl transition-all border border-transparent hover:border-slate-100"
                     >
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover/logs:text-indigo-600 transition-colors">
                           <Printer size={18} />
                        </div>
                        <div className="ml-4 flex-1 min-w-0">
                           <div className="flex items-center justify-between gap-2">
                              <span className="text-[11px] font-black text-slate-900 uppercase truncate tracking-tight">{log.ten_mau}</span>
                              <span className="text-[9px] font-mono font-bold text-slate-400">{format(new Date(log.ngay_tao), 'HH:mm')}</span>
                           </div>
                           <div className="flex items-center gap-2 mt-1">
                              <span className="text-[9px] font-mono font-bold text-slate-500">ID# {log.ma_id?.slice(0, 6)}</span>
                              <div className="w-1 h-1 bg-emerald-500 rounded-full" />
                              <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Thành công</span>
                           </div>
                        </div>
                     </motion.div>
                   ))
                 ) : (
                   <div className="h-full flex flex-col items-center justify-center text-slate-200 grayscale opacity-40 py-20">
                      <Clock size={64} strokeWidth={1} />
                      <p className="text-[10px] font-black uppercase tracking-[0.5em] mt-6">Không có dữ liệu</p>
                   </div>
                 )}
              </div>

              <div className="p-8 bg-slate-50/50 border-t border-slate-100 text-center">
                 <Link to="/logs" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-indigo-600 transition-colors flex items-center justify-center gap-3 group">
                    Xem toàn bộ nhật ký
                    <ExternalLink size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                 </Link>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
