import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  Grid, 
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
  Layers
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
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-xl border-2 border-indigo-600/20" />
        <div className="absolute inset-0 rounded-xl border-t-2 border-indigo-600 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
            <Terminal size={20} className="text-indigo-600 animate-pulse" />
        </div>
      </div>
      <div className="text-center space-y-1">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Initializing Core</p>
        <p className="text-[9px] font-mono text-slate-300">Synchronizing database indices...</p>
      </div>
    </div>
  );

  if (!apps.length && !templates.length && !logs.length) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center space-y-8">
        <div className="inline-flex p-6 bg-slate-50 rounded-3xl border border-slate-100 relative">
          <Database size={48} className="text-slate-300" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full border-4 border-white animate-ping" />
        </div>
        <div className="space-y-3">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Hệ thống chưa được cấu hình</h2>
          <p className="text-slate-500 text-sm leading-relaxed">Vui lòng kết nối với AppSheet ID và khởi tạo các mẫu báo cáo đầu tiên để bắt đầu vận hành hệ thống in ấn.</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Link to="/apps" className="flex items-center justify-center gap-3 p-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
            <PlusCircle size={18} />
            <span className="text-sm">Kết nối App</span>
          </Link>
          <Link to="/templates" className="flex items-center justify-center gap-3 p-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold hover:border-slate-400 transition-all">
            <FileText size={18} />
            <span className="text-sm">Tạo mẫu biểu</span>
          </Link>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Cloud Units', value: apps.length, icon: Layers, color: 'text-indigo-600', trend: 'Nodes Active' },
    { label: 'Prototypes', value: templates.length, icon: FileText, color: 'text-slate-900', trend: 'Compiled' },
    { label: 'Total Queries', value: logs.length, icon: Activity, color: 'text-emerald-600', trend: 'Real-time' },
  ];

  const formula = `CONCATENATE("${window.location.origin}/report?template=ID_MAU&id=", ENCODEURL([MA_ID]))`;

  return (
    <div className="space-y-6 pb-20 max-w-[1400px] mx-auto overflow-hidden">
      {/* Header System Bar */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-6 gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white">
              <Terminal size={18} />
            </div>
            CONTROL CENTER
          </h1>
          <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400">
            <span className="flex items-center gap-1"><ShieldCheck size={12} className="text-emerald-500" /> SECURE_SSL_ACTIVE</span>
            <span className="w-1 h-1 bg-slate-200 rounded-full" />
            <span>LAST_SYNC: {format(new Date(), 'HH:mm:ss')}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
          <div className="px-3 py-1 bg-white rounded-lg shadow-sm">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block leading-none mb-0.5">Instance Date</span>
            <span className="text-xs font-bold text-slate-900">{format(new Date(), 'dd.MM.yyyy')}</span>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div className="flex items-center gap-2 pr-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="text-[10px] font-black text-emerald-600 uppercase">System Ready</span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-12 gap-6">
        {/* Main Analytics Area */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm relative group overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full -mr-12 -mt-12 group-hover:bg-indigo-50 transition-colors" />
                  <div className="relative flex items-start justify-between">
                    <div className={`w-10 h-10 ${stat.color} flex items-center justify-center`}>
                      <Icon size={24} strokeWidth={2} />
                    </div>
                    <span className="text-[9px] font-mono font-bold text-slate-300 uppercase tracking-tighter">{stat.trend}</span>
                  </div>
                  <div className="mt-4 relative">
                    <div className="text-3xl font-mono font-black text-slate-900 tracking-tighter">{stat.value.toString().padStart(2, '0')}</div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mt-1">{stat.label}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Core Analytics Graph */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 overflow-hidden">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                  <TrendingUp size={18} />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Network Request Load</h3>
                  <p className="text-[10px] font-mono text-slate-400 italic">Temporal analysis of output generation</p>
                </div>
              </div>
              <div className="flex bg-slate-50 rounded-lg p-1">
                <button className="px-3 py-1 bg-white text-[9px] font-black text-indigo-600 rounded-md shadow-sm uppercase">Weekly</button>
                <button className="px-3 py-1 text-[9px] font-black text-slate-400 opacity-50 uppercase">Monthly</button>
              </div>
            </div>

            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="gridGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontFamily: 'monospace', fontWeight: 700, fill: '#94a3b8' }}
                  />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: '1px solid #f1f5f9', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '10px', fontFamily: 'monospace' }}
                  />
                  <Area 
                    type="stepAfter" 
                    dataKey="count" 
                    stroke="#6366f1" 
                    strokeWidth={2}
                    fill="url(#gridGradient)"
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {[
               { to: '/report', label: 'Manual Print', icon: Printer, variant: 'dark' },
               { to: '/apps', label: 'Node Config', icon: PlusCircle, variant: 'light' },
               { to: '/templates', label: 'Schema Design', icon: FileText, variant: 'light' },
               { to: '/settings', label: 'Global Setup', icon: Settings, variant: 'light' }
             ].map((action, i) => (
               <Link 
                key={i} 
                to={action.to}
                className={`flex flex-col items-center justify-center p-5 rounded-2xl gap-3 transition-all ${
                  action.variant === 'dark' 
                    ? 'bg-slate-900 text-white hover:bg-black shadow-lg shadow-slate-200' 
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-indigo-600 hover:text-indigo-600 shadow-sm'
                }`}
               >
                 <action.icon size={20} />
                 <span className="text-[9px] font-black uppercase tracking-[0.2em]">{action.label}</span>
               </Link>
             ))}
          </div>
        </div>

        {/* Sidebar Status & History */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Technical Integration Ref */}
          <div className="bg-indigo-600 rounded-3xl p-6 text-white relative overflow-hidden shadow-xl shadow-indigo-100">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <Terminal size={120} strokeWidth={1} />
             </div>
             <div className="relative z-10 space-y-5">
                <div className="flex items-center gap-2">
                  <Zap size={18} className="text-amber-400 fill-amber-400" />
                  <h3 className="text-sm font-black tracking-widest uppercase">Integration Endpoint</h3>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-black/20 rounded-xl border border-white/10 group">
                    <label className="text-[9px] font-black text-indigo-200 uppercase tracking-widest block mb-1.5 italic">API_ENDPOINT_FORMULA</label>
                    <div className="flex items-center justify-between gap-2 overflow-hidden">
                       <code className="text-[10px] font-mono text-white/90 truncate flex-1">
                          {formula.slice(0, 32)}...
                       </code>
                       <button 
                        onClick={() => handleCopy(formula)}
                        className="p-1.5 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 shrink-0 transition-transform active:scale-90"
                       >
                         {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                       </button>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                     <HelpCircle size={14} className="shrink-0 mt-0.5 text-indigo-200" />
                     <p className="text-[10px] font-medium leading-relaxed opacity-70">
                        Map this string to <span className="font-bold underline italic text-white">AppSheet Behavior</span> to enable automated export triggers.
                     </p>
                  </div>
                </div>
             </div>
          </div>

          {/* Activity Log - Technical Table Style */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[480px]">
            <div className="px-6 py-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
               <div className="space-y-0.5">
                  <h3 className="text-xs font-black text-slate-900 tracking-widest uppercase">System Log</h3>
                  <p className="text-[9px] font-mono text-slate-400">0.05s Execution Latency</p>
               </div>
               <Link to="/history" className="p-1.5 hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-100 text-slate-400 hover:text-indigo-600">
                  <ChevronRight size={18} />
               </Link>
            </div>
            
            <div className="flex-1 overflow-y-auto thin-scrollbar">
               {logs.length > 0 ? (
                 <div className="divide-y divide-slate-50">
                   {logs.slice(0, 10).map((log, i) => (
                     <div key={i} className="flex items-center p-4 hover:bg-slate-50 transition-colors group cursor-default">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-all shrink-0">
                           <Printer size={14} />
                        </div>
                        <div className="ml-4 flex-1 min-w-0">
                           <div className="flex items-center justify-between mb-0.5">
                              <span className="text-[10px] font-black text-slate-900 truncate uppercase tracking-tighter">{log.ten_mau}</span>
                              <span className="text-[9px] font-mono font-bold text-slate-400">{format(new Date(log.ngay_tao), 'HH:mm')}</span>
                           </div>
                           <div className="flex items-center gap-2">
                              <span className="text-[8px] font-mono text-slate-300">ID# {log.ma_id?.slice(0, 8)}</span>
                              <div className="w-1 h-1 bg-slate-200 rounded-full" />
                              <div className="flex items-center gap-1 group/status">
                                 <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                                 <span className="text-[8px] font-black text-emerald-600 uppercase tracking-tighter">Verified</span>
                              </div>
                           </div>
                        </div>
                     </div>
                   ))}
                 </div>
               ) : (
                 <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-3 py-20 grayscale">
                    <Clock size={32} strokeWidth={1} />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em]">Buffer Empty</p>
                 </div>
               )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100">
               <Link to="/history" className="flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">
                  Full Analytics Explorer
                  <ExternalLink size={10} />
               </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
