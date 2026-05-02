import React from 'react';
import { 
  Search, 
  FileText, 
  ChevronUp, 
  ChevronDown, 
  RefreshCw,
  History
} from 'lucide-react';
import { useAppStore } from '../../../store/use-app-store';
import { Pagination } from '../../ui/Pagination';
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
        const valA = (a[sortConfig.key as keyof PrintLog] || '').toString().toLowerCase();
        const valB = (b[sortConfig.key as keyof PrintLog] || '').toString().toLowerCase();
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

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-4">
      <RefreshCw className="animate-spin text-indigo-600" size={32} />
      <p className="text-sm font-medium">Đang nạp nhật ký...</p>
    </div>
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic">Nhật ký <span className="text-indigo-600">Hệ thống</span></h2>
           <p className="text-slate-500 text-sm font-medium mt-1">Lịch sử kết xuất báo cáo và các hoạt động in ấn thời gian thực.</p>
        </div>
        <div className="relative group">
          <input 
            type="text" 
            placeholder="Tìm theo mẫu biểu, ID..." 
            className="w-full md:w-80 pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs outline-none focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-bold placeholder:text-slate-300 shadow-sm"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
          <Search size={18} className="absolute left-4 top-3.5 text-slate-400" />
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer group" onClick={() => handleSort('ngay_tao')}>
                  <div className="flex items-center gap-2 group-hover:text-indigo-600 transition-colors">
                    Thời điểm
                    {sortConfig.key === 'ngay_tao' && (
                        <span className="text-indigo-600">
                          {sortConfig.direction === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        </span>
                    )}
                  </div>
                </th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Mẫu báo cáo</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Mã Row ID (AppSheet)</th>
                <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Trình trạng</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedLogs.map((log: any, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-8 py-6">
                    <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{new Date(log.ngay_tao).toLocaleDateString('vi-VN')}</div>
                    <div className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-widest leading-none">
                       {new Date(log.ngay_tao).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-indigo-50 rounded-xl">
                        <FileText size={16} className="text-indigo-600" />
                      </div>
                      <span className="font-bold text-slate-700 tracking-tight text-sm">{log.ten_mau}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <code className="text-[10px] font-mono bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200/50 text-slate-500 font-bold">
                      {log.ma_id || 'SYSTEM_EVENT'}
                    </code>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <span className={`badge-status ms-auto ${
                      log.trang_thai === 'Thành công' 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                        : 'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${log.trang_thai === 'Thành công' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                      {log.trang_thai || 'Đã in'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {paginatedLogs.length === 0 && (
          <div className="py-24 text-center text-slate-300">
            <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
               <History size={32} className="opacity-20" />
            </div>
            <p className="text-xs font-black uppercase tracking-widest">Nhật ký đang trống</p>
          </div>
        )}

        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={setCurrentPage} 
        />
      </div>
    </div>
  );
};
