import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Printer, 
  Zap, 
  Database, 
  ChevronRight,
  Clock,
  Settings,
  ExternalLink,
  Copy,
  CheckCircle2,
  Layers,
  Cpu,
  RefreshCw,
  History
} from 'lucide-react';
import { useAppStore } from '../../../store/use-app-store';
import { format } from 'date-fns';
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

  if (loading && apps.length === 0) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
      <RefreshCw className="text-indigo-600 animate-spin" size={32} />
      <p className="text-sm font-medium text-slate-500">Đang tải dữ liệu hệ thống...</p>
    </div>
  );

  const formula = `CONCATENATE("${window.location.origin}/report?template=ID_MAU&id=", ENCODEURL([MA_ID]))`;

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic">Tổng quan <span className="text-indigo-600">Hệ thống</span></h2>
           <p className="text-slate-500 text-sm font-medium mt-1">Theo dõi tương tác, dữ liệu và hiệu suất kết nối thời gian thực.</p>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {[
          { label: 'Ứng dụng AppSheet', value: apps.length, icon: Layers, color: 'text-indigo-600', bg: 'bg-indigo-50/50', border: 'border-indigo-100', accent: 'bg-indigo-500' },
          { label: 'Mẫu báo cáo (Word/Excel)', value: templates.length, icon: FileText, color: 'text-violet-600', bg: 'bg-violet-50/50', border: 'border-violet-100', accent: 'bg-violet-500' },
          { label: 'Sản lượng in ấn PDF', value: logs.length, icon: Printer, color: 'text-emerald-600', bg: 'bg-emerald-50/50', border: 'border-emerald-100', accent: 'bg-emerald-500' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card-premium p-8 flex items-center gap-7 relative overflow-hidden group"
          >
            <div className={`absolute top-0 right-0 w-2 h-full ${stat.accent} opacity-0 group-hover:opacity-100 transition-opacity`} />
            <div className={`w-16 h-16 ${stat.bg} ${stat.color} rounded-[1.5rem] flex items-center justify-center border ${stat.border} shadow-sm group-hover:scale-110 transition-transform`}>
              <stat.icon size={28} />
            </div>
            <div>
              <div className="text-3xl font-black text-slate-900 leading-none">{stat.value}</div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
        {/* Main Chart */}
        <div className="lg:col-span-2 space-y-8">
            <div className="card-premium p-8 md:p-10 h-[450px] flex flex-col rounded-[2.5rem]">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                   <div className="w-1.5 h-6 bg-indigo-600 rounded-full" />
                   <div>
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-tighter leading-none italic">Lưu lượng truy xuất</h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Phân tích 7 ngày gần nhất</p>
                   </div>
                </div>
                  <button 
                    onClick={() => fetchAll()}
                    className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 border border-transparent hover:border-slate-100 rounded-2xl transition-all shadow-sm active:scale-95"
                    title="Làm mới"
                  >
                    <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                  </button>
              </div>
              
              <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={300}>
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 900 }}
                      dy={15}
                    />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', padding: '16px', fontWeight: 900 }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="count" 
                      stroke="#4f46e5" 
                      strokeWidth={5}
                      fill="url(#chartGradient)" 
                      animationDuration={1500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { to: '/report', label: 'Báo cáo', icon: Printer, bg: 'bg-indigo-600', text: 'text-white', border: 'border-indigo-500' },
                { to: '/apps', label: 'Kết nối App', icon: Database, bg: 'bg-white', text: 'text-slate-900', border: 'border-slate-100' },
                { to: '/templates', label: 'Thiết kế mẫu', icon: FileText, bg: 'bg-white', text: 'text-slate-900', border: 'border-slate-100' },
                { to: '/settings', label: 'Cấu hình', icon: Settings, bg: 'bg-white', text: 'text-slate-900', border: 'border-slate-100' },
              ].map((action, i) => (
                <Link 
                  key={i} 
                  to={action.to}
                  className={`flex flex-col items-center justify-center p-6 rounded-[2rem] gap-3 transition-all hover:-translate-y-1 hover:shadow-xl border ${action.border} ${action.bg} ${action.text} overflow-hidden group`}
                >
                  <action.icon size={24} className="shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-center truncate w-full">{action.label}</span>
                </Link>
              ))}
            </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          {/* Formula Tool */}
          <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-10 text-white shadow-2xl shadow-indigo-900/20 relative overflow-hidden flex flex-col justify-between min-h-[450px]">
             <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12 scale-[3] pointer-events-none">
                <Cpu size={100} />
             </div>
             <div className="relative z-10 flex-1 flex flex-col">
               <div className="flex items-center gap-3 mb-8">
                  <div className="p-2.5 bg-white/10 rounded-xl">
                    <Zap size={20} className="text-amber-400 fill-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black italic tracking-tighter uppercase leading-none italic">Cầu nối AppSheet</h3>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Smart Integration Utility</p>
                  </div>
               </div>
               
               <div className="space-y-6 flex-1 flex flex-col justify-center">
                  <div className="text-center">
                    <p className="text-[10px] text-slate-400 leading-relaxed font-black uppercase tracking-wider">
                       Dán công thức logic này vào thuộc tính <br />
                       <span className="text-indigo-400">Behavior {'>>'} External Site</span>
                    </p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-[11px] font-mono text-indigo-300 break-all select-all text-center leading-loose backdrop-blur-md shadow-inner">
                     {formula}
                  </div>
                  <button 
                    onClick={() => handleCopy(formula)}
                    className="w-full py-5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 overflow-hidden shadow-2xl shadow-indigo-900/60 active:scale-95 border border-indigo-500 group"
                  >
                     <span className="shrink-0 group-hover:rotate-12 transition-transform">{copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}</span>
                     <span className="truncate">{copied ? 'Đã lưu vào Clipboard' : 'Sao chép Công thức'}</span>
                  </button>
               </div>
             </div>
          </div>

          {/* Recent Logs List */}
          <div className="card-premium flex flex-col h-[400px] overflow-hidden rounded-[2.5rem]">
            <div className="p-7 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
               <div className="flex items-center gap-2">
                  <Clock size={16} className="text-indigo-600" />
                  <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Hoạt động mới nhất</h3>
               </div>
               <Link to="/logs" className="text-[10px] font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-widest bg-white px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm transition-all hover:shadow-md">
                  Tất cả
               </Link>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
               {logs.length > 0 ? (
                 logs.slice(0, 8).map((log, i) => (
                   <div key={i} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group shadow-sm hover:shadow-md">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 flex-shrink-0 group-hover:text-indigo-600 transition-colors shadow-sm">
                         <Printer size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                         <div className="flex items-center justify-between gap-4">
                            <span className="text-xs font-black text-slate-800 truncate uppercase italic">{log.ten_mau}</span>
                            <span className="text-[9px] font-black text-slate-400 shrink-0">{format(new Date(log.ngay_tao), 'HH:mm')}</span>
                         </div>
                         <div className="text-[9px] font-bold text-slate-400 mt-1 truncate tracking-wider uppercase flex items-center gap-1.5">
                            <div className="w-1 h-1 bg-emerald-500 rounded-full" />
                            Row ID: {log.ma_id}
                         </div>
                      </div>
                   </div>
                 ))
               ) : (
                 <div className="h-full flex flex-col items-center justify-center text-slate-300">
                    <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center mb-4">
                       <Clock size={28} strokeWidth={1.5} className="opacity-20" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest">Hệ thống đang sẵn sàng</p>
                 </div>
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
