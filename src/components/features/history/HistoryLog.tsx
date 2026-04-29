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

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-3 text-left cursor-pointer group" onClick={() => handleSort('ngay_tao')}>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Thời điểm</span>
                    {sortConfig.key === 'ngay_tao' && (
                      <span className="text-indigo-500">
                        {sortConfig.direction === 'asc' ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                      </span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left cursor-pointer group" onClick={() => handleSort('ten_mau')}>
                   <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Mẫu biểu</span>
                  </div>
                </th>
                <th className="px-6 py-3 text-left">
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Dòng ID</span>
                </th>
                <th className="px-6 py-3 text-right">
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Trạng thái</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedLogs.map((log: any, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-3">
                    <div className="font-bold text-slate-900 text-[13px] tracking-tight">{new Date(log.ngay_tao).toLocaleDateString('vi-VN')}</div>
                    <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{new Date(log.ngay_tao).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</div>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100/30"><FileText size={12} /></div>
                      <span className="font-bold text-slate-700 text-[13px]">{log.ten_mau}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <code className="text-[9px] font-mono px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded border border-slate-200/20">
                      {log.ma_id?.length > 12 ? `${log.ma_id.slice(0, 12)}...` : log.ma_id}
                    </code>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                      log.trang_thai === 'Thành công' 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100/50' 
                        : 'bg-amber-50 text-amber-600 border-amber-100/50'
                    }`}>
                      {log.trang_thai || 'Success'}
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
