import React from 'react';
import { 
  Search, 
  FileText, 
  History, 
  ChevronUp, 
  ChevronDown, 
  ArrowUpDown,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight
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
        const valA = (a[sortConfig.key] || '').toString().toLowerCase();
        const valB = (b[sortConfig.key] || '').toString().toLowerCase();
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

  if (loading) return <div className="py-20 text-center animate-pulse">Đang nạp nhật ký...</div>;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Nhật ký in ấn</h2>
          <p className="text-slate-500">Theo dõi lịch sử xuất báo cáo thời gian thực.</p>
        </div>
        <div className="relative group">
          <input 
            type="text" 
            placeholder="Tìm kiếm..." 
            className="pl-11 pr-5 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all w-full md:w-72 shadow-sm"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
          <Search size={18} className="absolute left-4 top-3.5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                <th className="px-8 py-5 text-left cursor-pointer" onClick={() => handleSort('ngay_tao')}>Thời điểm</th>
                <th className="px-8 py-5 text-left cursor-pointer" onClick={() => handleSort('ten_mau')}>Mẫu biểu</th>
                <th className="px-8 py-5 text-left">Dòng ID</th>
                <th className="px-8 py-5 text-right">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedLogs.map((log: any, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-all">
                  <td className="px-8 py-6">
                    <div className="font-black text-slate-800">{new Date(log.ngay_tao).toLocaleDateString('vi-VN')}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{new Date(log.ngay_tao).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600"><FileText size={16} /></div>
                      <span className="font-bold text-slate-700">{log.ten_mau}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <code className="text-[10px] font-mono px-2 py-1 bg-slate-100 text-slate-500 rounded border border-slate-200">{log.ma_id?.slice(0, 20)}...</code>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${log.trang_thai === 'Thành công' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                      {log.trang_thai || 'Hoàn tất'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
