import React from 'react';
import { 
  Search, 
  FileText, 
  ChevronUp, 
  ChevronDown, 
  RefreshCcw
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
      <RefreshCcw className="animate-spin text-indigo-600" size={32} />
      <p className="text-sm font-medium">Đang nạp nhật ký...</p>
    </div>
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Nhật ký in ấn</h2>
          <p className="text-slate-500 text-sm">Theo dõi lịch sử xuất báo cáo và in ấn.</p>
        </div>
        <div className="relative group">
          <input 
            type="text" 
            placeholder="Tìm kiếm..." 
            className="pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-indigo-500/20 w-64 shadow-sm"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
          <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto text-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest cursor-pointer" onClick={() => handleSort('ngay_tao')}>
                  <div className="flex items-center gap-1.5">
                    Thời điểm
                    {sortConfig.key === 'ngay_tao' && (
                      <span className="text-indigo-500">
                        {sortConfig.direction === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                      </span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest cursor-pointer" onClick={() => handleSort('ten_mau')}>Mẫu biểu</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest">Dòng ID</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-widest">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedLogs.map((log: any, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-all">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">{new Date(log.ngay_tao).toLocaleDateString('vi-VN')}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{new Date(log.ngay_tao).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FileText size={14} className="text-indigo-500" />
                      <span className="font-medium text-slate-700">{log.ten_mau}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                      {log.ma_id?.length > 15 ? `${log.ma_id.slice(0, 15)}...` : log.ma_id}
                    </code>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`badge-status ${
                      log.trang_thai === 'Thành công' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                        : 'bg-amber-50 text-amber-700 border-amber-100'
                    }`}>
                      {log.trang_thai || 'Thành công'}
                    </span>
                  </td>
                </tr>
              ))}
              {paginatedLogs.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-20 text-center text-slate-400">
                    Chưa có hoạt động in ấn nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={setCurrentPage} 
        />
      </div>
    </div>
  );
};
