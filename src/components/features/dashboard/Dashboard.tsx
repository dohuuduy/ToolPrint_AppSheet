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
  RefreshCcw
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
    <div className="space-y-8 pb-24 max-w-[1500px] mx-auto">
      {/* Top System Navigation Bar */}
      <section className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-200">
                <Terminal size={20} />
             </div>
             <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">SYSTEM_DASHBOARD</h1>
                <p className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest">Core Status: Stable_Operational</p>
             </div>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="px-5 py-2 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Net_Region</span>
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mt-1">
                <Globe size={12} className="text-indigo-600" />
                Global_Cloud
              </span>
            </div>
            <div className="w-px h-8 bg-slate-100" />
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Build_Ver</span>
              <span className="text-xs font-mono font-bold text-slate-900 mt-1 italic">v1.4.2-PRO</span>
            </div>
          </div>
          <button 
            onClick={() => fetchAll()}
            className="p-3 bg-slate-900 text-white rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-200"
          >
            <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </section>

      {/* Main Grid: Data & Status */}
      <div className="grid grid-cols-12 gap-8">
        
        {/* Left Column: Analytics */}
        <div className="col-span-12 xl:col-span-8 space-y-8">
          
          {/* Key Intelligence Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Active Clusters', value: apps.length, icon: Layers, color: 'text-indigo-600', meta: 'Connected' },
              { label: 'Document Models', value: templates.length, icon: FileText, color: 'text-slate-900', meta: 'Compiled' },
              { label: 'Total Executions', value: logs.length, icon: Activity, color: 'text-emerald-600', meta: 'Success' },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm group hover:shadow-2xl hover:shadow-slate-200/50 transition-all"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-12 h-12 bg-slate-50 ${stat.color} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                    <stat.icon size={24} strokeWidth={2.5} />
                  </div>
                  <div className="px-2 py-1 bg-slate-50 rounded-lg text-[9px] font-black text-slate-400 uppercase tracking-widest">{stat.meta}</div>
                </div>
                <div className="text-4xl font-mono font-black text-slate-900 tracking-tighter mb-1">{stat.value.toString().padStart(2, '0')}</div>
                <div className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Activity Visualizer */}
          <div className="bg-white rounded-[48px] border border-slate-100 shadow-sm p-10 relative overflow-hidden h-[460px] flex flex-col">
            <div className="flex items-center justify-between mb-10 shrink-0">
               <div className="space-y-1">
                  <h3 className="text-xs font-black text-slate-900 tracking-[0.3em] uppercase">Operations_Timeline</h3>
                  <p className="text-[10px] font-mono text-slate-400 italic">Sequential load distribution across nodes</p>
               </div>
               <div className="flex gap-2">
                  <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full animate-pulse" />
                  <span className="text-[10px] font-mono font-bold text-slate-400">LIVE_FEED</span>
               </div>
            </div>

            <div className="flex-1 min-h-0 w-full">
              <ResponsiveContainer width="100%" height="100%" debounce={50}>
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="loadCurve" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontFamily: 'monospace', fontWeight: 700, fill: '#cbd5e1' }}
                    dy={10}
                  />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{ stroke: '#4f46e5', strokeWidth: 1 }}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontSize: '10px', fontWeight: 'bold', fontFamily: 'monospace' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#4f46e5" 
                    strokeWidth={4}
                    fill="url(#loadCurve)" 
                    animationDuration={2500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Infrastructure Quick Access */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
             {[
               { to: '/report', label: 'EXECUTE_PRINT', icon: Printer, dark: true },
               { to: '/apps', label: 'CONFIG_APPS', icon: PlusCircle, dark: false },
               { to: '/templates', label: 'MANAGE_MODELS', icon: FileText, dark: false },
               { to: '/settings', label: 'GLOBAL_VARS', icon: Settings, dark: false }
             ].map((action, i) => (
               <Link 
                key={i} 
                to={action.to}
                className={`flex flex-col items-center justify-center p-6 rounded-[32px] gap-4 transition-all hover:scale-105 ${
                  action.dark 
                    ? 'bg-slate-900 text-white hover:bg-black shadow-2xl shadow-indigo-100' 
                    : 'bg-white border border-slate-100 text-slate-700 hover:border-indigo-600 hover:text-indigo-600 shadow-sm'
                }`}
               >
                 <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${action.dark ? 'bg-white/10' : 'bg-slate-50'}`}>
                    <action.icon size={20} strokeWidth={2.5} />
                 </div>
                 <span className="text-[9px] font-black uppercase tracking-[0.25em]">{action.label}</span>
               </Link>
             ))}
          </div>
        </div>

        {/* Right Column: Status Logs */}
        <div className="col-span-12 xl:col-span-4 space-y-8">
          
          {/* Integration Formula - Pro Version */}
          <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm relative overflow-hidden group">
             <div className="absolute top-0 left-0 w-2 h-full bg-indigo-600" />
             <div className="space-y-6">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <Zap size={18} className="text-indigo-600 fill-indigo-600" />
                      <h3 className="text-xs font-black tracking-widest uppercase">Integration_Node</h3>
                   </div>
                   <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                </div>
                
                <div className="space-y-4">
                   <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 relative group/box">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 italic">Output_Schema_Link:</p>
                      <div className="flex flex-col gap-3">
                         <div className="bg-white p-3 rounded-xl border border-slate-100 text-[10px] font-mono text-slate-600 leading-relaxed break-all select-all">
                            {formula}
                         </div>
                         <button 
                          onClick={() => handleCopy(formula)}
                          className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
                         >
                            {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                            {copied ? 'Copied_Successful' : 'Copy_API_String'}
                         </button>
                      </div>
                   </div>
                   
                   <div className="flex items-start gap-4 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
                      <HelpCircle size={18} className="text-indigo-600 shrink-0 mt-0.5" />
                      <p className="text-[10px] font-medium text-indigo-900 leading-relaxed italic">
                        Inject this string into <span className="font-black">AppSheet Behavior {'>>'} External Site</span> to trigger automatic reporting.
                      </p>
                   </div>
                </div>
             </div>
          </div>

          {/* Real-time System Logs */}
          <div className="bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[520px]">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
               <div>
                  <h3 className="text-xs font-black text-slate-900 tracking-widest uppercase">Security_Logs</h3>
                  <p className="text-[9px] font-mono text-slate-400 mt-1">Ready for trace analysis</p>
               </div>
               <Link to="/history" className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm">
                  <ChevronRight size={20} />
               </Link>
            </div>
            
            <div className="flex-1 overflow-y-auto thin-scrollbar p-2">
               {logs.length > 0 ? (
                 <div className="space-y-1">
                   {logs.slice(0, 10).map((log, i) => (
                     <motion.div 
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        key={i} 
                        className="flex items-center p-4 hover:bg-slate-50 rounded-3xl transition-all group border border-transparent hover:border-slate-100 cursor-default"
                     >
                        <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-indigo-600 transition-all shrink-0">
                           <Printer size={16} />
                        </div>
                        <div className="ml-4 flex-1 min-w-0">
                           <div className="flex items-center justify-between gap-2">
                              <span className="text-[11px] font-black text-slate-900 uppercase truncate">{log.ten_mau}</span>
                              <span className="text-[9px] font-mono font-bold text-slate-400 shrink-0">{format(new Date(log.ngay_tao), 'HH:mm')}</span>
                           </div>
                           <div className="flex items-center gap-2 mt-1">
                              <span className="px-1.5 py-0.5 bg-slate-100 rounded-md text-[8px] font-mono font-bold text-slate-500">ID# {log.ma_id?.slice(0, 6)}</span>
                              <div className="w-1 h-1 bg-emerald-500 rounded-full" />
                              <span className="text-[8px] font-black text-emerald-600 uppercase">Process_Ok</span>
                           </div>
                        </div>
                     </motion.div>
                   ))}
                 </div>
               ) : (
                 <div className="h-full flex flex-col items-center justify-center text-slate-200 grayscale opacity-40">
                    <Clock size={48} strokeWidth={1} />
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] mt-4">Buffer_Null</p>
                 </div>
               )}
            </div>

            <div className="p-6 bg-slate-50/50 border-t border-slate-100 text-center">
               <Link to="/history" className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors flex items-center justify-center gap-2 group">
                  EXPLORE_FULL_HISTORY
                  <ExternalLink size={12} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
               </Link>
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-[32px] text-white flex items-center justify-between overflow-hidden relative">
             <div className="absolute -right-4 -bottom-4 opacity-5 animate-pulse">
                <ShieldCheck size={120} />
             </div>
             <div className="relative z-10 flex items-center gap-4">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center ring-4 ring-white/5">
                   <ShieldCheck size={20} className="text-emerald-400" />
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Server_Armor</p>
                   <p className="text-xs font-bold font-mono">End-to-End Encryption</p>
                </div>
             </div>
             <div className="relative z-10 p-2 bg-emerald-500 rounded-lg shadow-lg">
                <div className="w-2 h-2 bg-white rounded-full animate-ping" />
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};
