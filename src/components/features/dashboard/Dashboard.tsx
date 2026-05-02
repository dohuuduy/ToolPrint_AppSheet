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
  RefreshCcw
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
      <RefreshCcw className="text-indigo-600 animate-spin" size={32} />
      <p className="text-sm font-medium text-slate-500">Đang tải dữ liệu hệ thống...</p>
    </div>
  );

  const formula = `CONCATENATE("${window.location.origin}/report?template=ID_MAU&id=", ENCODEURL([MA_ID]))`;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Ứng dụng AppSheet', value: apps.length, icon: Layers, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Mẫu báo cáo', value: templates.length, icon: FileText, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Lượt in/xuất', value: logs.length, icon: Printer, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card-premium p-6 flex items-center gap-5"
          >
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center`}>
              <stat.icon size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
              <div className="text-xs font-medium text-slate-500 uppercase tracking-tight">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 space-y-8">
            <div className="card-premium p-6 md:p-8 h-[400px] flex flex-col rounded-3xl">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Lưu lượng truy xuất</h3>
                  <p className="text-xs text-slate-400 mt-1">7 ngày gần nhất</p>
                </div>
                <button 
                  onClick={() => fetchAll()}
                  className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                  title="Làm mới"
                >
                  <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
                </button>
              </div>
              
              <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 11, fill: '#94a3b8' }}
                    />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="count" 
                      stroke="#4f46e5" 
                      strokeWidth={3}
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
                { to: '/report', label: 'Tạo báo cáo', icon: Printer, bg: 'bg-indigo-600', text: 'text-white' },
                { to: '/apps', label: 'AppSheet', icon: Database, bg: 'bg-white', text: 'text-slate-700' },
                { to: '/templates', label: 'Quản lý mẫu', icon: FileText, bg: 'bg-white', text: 'text-slate-700' },
                { to: '/settings', label: 'Cấu hình', icon: Settings, bg: 'bg-white', text: 'text-slate-700' },
              ].map((action, i) => (
                <Link 
                  key={i} 
                  to={action.to}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl gap-2 transition-all hover:shadow-md border border-slate-200 ${action.bg} ${action.text} overflow-hidden`}
                >
                  <action.icon size={20} className="shrink-0" />
                  <span className="text-[10px] font-semibold text-center truncate w-full">{action.label}</span>
                </Link>
              ))}
            </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          {/* Formula Tool */}
          <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <Cpu size={80} />
             </div>
             <div className="relative z-10">
               <div className="flex items-center gap-2 mb-6">
                  <Zap size={18} className="text-amber-400 fill-amber-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider">Tích hợp AppSheet</h3>
               </div>
               
               <div className="space-y-4">
                  <p className="text-[11px] text-slate-400 text-center leading-relaxed">Dán công thức này vào mục <br/><b>Behavior {'>>'} External Site</b> trong AppSheet:</p>
                  <div className="bg-white/10 border border-white/10 rounded-xl p-4 text-[10px] font-mono text-slate-300 break-all select-all text-center">
                     {formula}
                  </div>
                  <button 
                    onClick={() => handleCopy(formula)}
                    className="w-full py-4 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs uppercase tracking-tight transition-all flex items-center justify-center gap-2 overflow-hidden shadow-lg shadow-indigo-900/40"
                  >
                     <span className="shrink-0">{copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}</span>
                     <span className="truncate">{copied ? 'Đã sao chép công thức' : 'Sao chép công thức'}</span>
                  </button>
               </div>
             </div>
          </div>

          {/* Recent Logs List */}
          <div className="card-premium flex flex-col h-[400px] overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
               <h3 className="text-xs font-bold text-slate-900 uppercase">Nhật ký mới nhất</h3>
               <Link to="/logs" className="text-[10px] font-bold text-indigo-600 hover:underline">
                  Xem tất cả
               </Link>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
               {logs.length > 0 ? (
                 logs.slice(0, 8).map((log, i) => (
                   <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 flex-shrink-0">
                         <Printer size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                         <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-800 truncate">{log.ten_mau}</span>
                            <span className="text-[9px] text-slate-400">{format(new Date(log.ngay_tao), 'HH:mm')}</span>
                         </div>
                         <div className="text-[10px] text-slate-500 mt-0.5 truncate">ID: {log.ma_id}</div>
                      </div>
                   </div>
                 ))
               ) : (
                 <div className="h-full flex flex-col items-center justify-center text-slate-300">
                    <Clock size={32} strokeWidth={1.5} />
                    <p className="text-[10px] font-medium mt-2">Chưa có hoạt động</p>
                 </div>
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
