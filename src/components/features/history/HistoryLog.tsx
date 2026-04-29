import React from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  FileText, 
  History, 
  ChevronUp, 
  ChevronDown, 
  CheckCircle2,
  Clock,
  Calendar,
  Filter,
  Download,
  AlertCircle,
  RefreshCcw,
  ChevronLeft,
  ChevronRight,
  Database
} from 'lucide-react';
import { useAppStore } from '../../../store/use-app-store';
import { PrintLog } from '../../../types';

export const HistoryLog: React.FC = () => {
  const { logs, loading, fetchLogs } = useAppStore();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize] = React.useState(10);
  const [sortConfig, setSortConfig] = React.useState({ key: 'ngay_tao', direction: 'desc' });

  React.useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleSort = (key: string) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const filteredLogs = React.useMemo(() => {
    let result = logs.filter((log: PrintLog) => 
      (log.ten_mau || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.ma_id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.trang_thai || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (sortConfig.key) {
      result.sort((a: any, b: any) => {
        const valA = (a[sortConfig.key as keyof any] || '').toString().toLowerCase();
        const valB = (b[sortConfig.key as keyof any] || '').toString().toLowerCase();
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [logs, searchTerm, sortConfig]);

  const paginatedLogs = React.useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredLogs.slice(startIndex, startIndex + pageSize);
  }, [filteredLogs, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredLogs.length / pageSize);

  // Stats
  const successCount = filteredLogs.filter(l => l.trang_thai === 'Thành công').length;
  const errorCount = filteredLogs.length - successCount;

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600/20 border-t-indigo-600"></div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Truy xuất lịch sử hệ thống...</p>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header section with Stats Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-1 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between">
           <div>
              <div className="flex items-center gap-2 mb-2">
                 <div className="w-8 h-8 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                   <History size={16} />
                 </div>
                 <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Logging System</span>
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Nhật ký in ấn</h2>
              <p className="text-slate-500 font-medium text-sm mt-1">Lịch sử xuất báo cáo thời gian thực của toàn hệ thống.</p>
           </div>
           
           <div className="flex items-center gap-3 mt-8">
              <button 
                onClick={() => fetchLogs()}
                className="p-3 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-2xl border border-slate-100 transition-all active:scale-95"
                title="Làm mới"
              >
                <RefreshCcw size={18} />
              </button>
              <div className="relative flex-1">
                 <Search size={16} className="absolute left-4 top-3.5 text-slate-400" />
                 <input 
                   type="text" 
                   placeholder="Tìm theo mẫu, ID..." 
                   className="w-full pl-11 pr-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-black text-slate-900 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-200 outline-none transition-all placeholder:text-slate-300"
                   value={searchTerm}
                   onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                 />
              </div>
           </div>
         </div>

         <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-100 flex flex-col justify-between overflow-hidden relative group">
               <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all" />
               <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center mb-4">
                 <Download size={20} />
               </div>
               <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Tổng lượt in</p>
                  <p className="text-4xl font-black">{filteredLogs.length}</p>
               </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col justify-between overflow-hidden relative group">
               <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4">
                 <CheckCircle2 size={20} />
               </div>
               <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Thành công</p>
                  <div className="flex items-end gap-2">
                    <p className="text-4xl font-black text-slate-900">{successCount}</p>
                    <span className="text-[11px] font-black text-emerald-500 pb-1.5 whitespace-nowrap">
                       {Math.round((successCount / (filteredLogs.length || 1)) * 100)}%
                    </span>
                  </div>
               </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col justify-between overflow-hidden relative group">
               <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-4">
                 <AlertCircle size={20} />
               </div>
               <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Gặp sự cố</p>
                  <div className="flex items-end gap-2">
                    <p className="text-4xl font-black text-slate-900">{errorCount}</p>
                    <span className="text-[11px] font-black text-amber-500 pb-1.5">
                       {filteredLogs.length > 0 ? filteredLogs.length - successCount : 0}
                    </span>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* Main Content Area: Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
           <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <Database size={16} className="text-indigo-600" />
                Dữ liệu vận hành
              </h3>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight mt-1">Lịch sử được sắp xếp theo thời gian mới nhất</p>
           </div>
           <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-4 mr-4">
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                    <span className="text-[10px] font-black text-slate-400 uppercase">Success</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full" />
                    <span className="text-[10px] font-black text-slate-400 uppercase">Pending/Error</span>
                 </div>
              </div>
              <button className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-slate-900 shadow-sm transition-all active:scale-95">
                <Filter size={16} />
              </button>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-50 uppercase text-[10px] font-black text-slate-400 tracking-[0.15em]">
                <th className="px-8 py-5 group cursor-pointer hover:text-slate-900" onClick={() => handleSort('ngay_tao')}>
                   <div className="flex items-center gap-2">
                     <Clock size={12} />
                     THỜI GIAN
                     {sortConfig.key === 'ngay_tao' && (
                       sortConfig.direction === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                     )}
                   </div>
                </th>
                <th className="px-8 py-5 group cursor-pointer hover:text-slate-900" onClick={() => handleSort('ten_mau')}>
                   <div className="flex items-center gap-2">
                     MẪU BIỂU VẬN HÀNH
                     {sortConfig.key === 'ten_mau' && (
                       sortConfig.direction === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                     )}
                   </div>
                </th>
                <th className="px-8 py-5 hidden md:table-cell">RECORD IDENTIFIER</th>
                <th className="px-8 py-5 text-right">PHẢN HỒI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedLogs.map((log: any, i) => (
                <tr key={i} className="group transition-all hover:bg-slate-50/50">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:shadow-md transition-all">
                         <Calendar size={18} />
                       </div>
                       <div>
                          <p className="text-sm font-black text-slate-900 tracking-tight">
                            {new Date(log.ngay_tao).toLocaleDateString('vi-VN')}
                          </p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                            {new Date(log.ngay_tao).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100/30">
                        <FileText size={14} />
                      </div>
                      <div>
                        <span className="font-black text-slate-700 text-sm tracking-tight">{log.ten_mau}</span>
                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Report Service</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 hidden md:table-cell">
                    <code className="text-[10px] font-mono px-3 py-1 bg-slate-100 text-slate-500 rounded-lg border border-slate-200/40 font-bold group-hover:bg-slate-900 group-hover:text-white transition-all">
                      {log.ma_id}
                    </code>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all duration-300 ${
                      log.trang_thai === 'Thành công' 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-600 hover:text-white' 
                        : 'bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-600 hover:text-white'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${log.trang_thai === 'Thành công' ? 'bg-emerald-500' : 'bg-amber-500'} group-hover:bg-white`} />
                      {log.trang_thai || 'SUCCESS'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Custom Pagination */}
        {totalPages > 1 && (
          <div className="p-8 bg-slate-50/50 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
             <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
               Hiển thị {paginatedLogs.length} trên tổng {filteredLogs.length} nhật ký
             </div>
             <div className="flex gap-2">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                  className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-900 disabled:opacity-30 transition-all shadow-sm"
                >
                  <ChevronLeft size={16} />
                </button>
                <div className="flex items-center px-6 bg-white border border-slate-100 rounded-xl text-xs font-black text-slate-900 shadow-sm">
                   {currentPage} / {totalPages}
                </div>
                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                  className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-900 disabled:opacity-30 transition-all shadow-sm"
                >
                  <ChevronRight size={16} />
                </button>
             </div>
          </div>
        )}
      </div>

      {/* Empty State */}
      {filteredLogs.length === 0 && !loading && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          className="bg-white p-24 rounded-[3rem] border border-dashed border-slate-200 text-center flex flex-col items-center gap-6"
        >
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 border-2 border-dashed border-slate-100">
            <History size={40} />
          </div>
          <div className="max-w-xs mx-auto">
            <p className="text-xl font-black text-slate-900 tracking-tight mb-2 uppercase">Lịch sử sạch</p>
            <p className="text-slate-400 font-medium text-sm leading-relaxed">Chưa có hoạt động in ấn nào được ghi nhận trong khoảng thời gian này.</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};
