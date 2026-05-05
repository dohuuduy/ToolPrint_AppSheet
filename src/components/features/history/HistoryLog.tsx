import React from 'react';
import { 
  Search, 
  FileText, 
  History, 
  ChevronUp, 
  ChevronDown, 
  Eye
} from 'lucide-react';
import { useAppStore } from '../../../store/use-app-store';
import { Pagination } from '../../ui/Pagination';
import { DetailModal } from '../../ui/DetailModal';
import { PrintLog } from '../../../types';
import { useAuth } from '../../../context/AuthContext';

export const HistoryLog: React.FC = () => {
  const { user } = useAuth();
  const { logs, loading, fetchLogs } = useAppStore();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize] = React.useState(10);
  const [sortConfig, setSortConfig] = React.useState({ key: 'ngay_tao', direction: 'desc' });
  const [viewingLog, setViewingLog] = React.useState<any | null>(null);

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

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-32 text-indigo-400 gap-4">
      <div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
      <p className="text-[10px] font-black uppercase tracking-[0.2em]">Đang nạp nhật ký hệ thống...</p>
    </div>
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20 px-4 sm:px-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 font-vietnam">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Nhật ký in ấn</h2>
          <p className="text-slate-500 font-medium text-sm mt-1">Lịch sử kết nối API AppSheet và Google Drive Engine.</p>
        </div>
        <div className="relative group">
          <input 
            type="text" 
            placeholder="Tìm theo Row ID, Mẫu biểu..." 
            className="pl-11 pr-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all w-full md:w-80 shadow-sm"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
          <Search size={18} className="absolute left-4 top-4 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden font-vietnam">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-left cursor-pointer group" onClick={() => handleSort('ngay_tao')}>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Thời gian thực</span>
                    {sortConfig.key === 'ngay_tao' && (
                      <span className="text-indigo-500">
                        {sortConfig.direction === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                      </span>
                    )}
                  </div>
                </th>
                <th className="px-8 py-5 text-left cursor-pointer group" onClick={() => handleSort('ten_mau')}>
                   <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Cấu trúc báo cáo</span>
                  </div>
                </th>
                <th className="px-8 py-5 text-left">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Row Identification</span>
                </th>
                <th className="px-8 py-5 text-right">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Trạng thái</span>
                </th>
                <th className="px-8 py-5 text-right">
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedLogs.map((log: any, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="font-bold text-slate-900 text-sm tracking-tight">{new Date(log.ngay_tao).toLocaleDateString('vi-VN')}</div>
                    <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">{new Date(log.ngay_tao).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100/30 shadow-sm"><FileText size={16} /></div>
                      <span className="font-black text-slate-700 text-sm">{log.ten_mau}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <code className="text-[10px] font-mono px-3 py-1 bg-slate-100 text-slate-500 rounded-full border border-slate-200/30 font-black">
                      {log.ma_id?.length > 15 ? `${log.ma_id.slice(0, 15)}...` : log.ma_id}
                    </code>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                      log.trang_thai === 'Thành công' 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100/50' 
                        : 'bg-amber-50 text-amber-600 border-amber-100/50'
                    }`}>
                      <div className={`w-1 h-1 rounded-full mr-1 ${log.trang_thai === 'Thành công' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      {log.trang_thai || 'Hoàn tất'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button 
                      onClick={() => setViewingLog(log)}
                      className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {paginatedLogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-32 text-center">
                    <div className="flex flex-col items-center gap-4">
                       <History size={48} className="text-slate-100" />
                       <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Lịch sử rỗng</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="bg-slate-50/50 px-8 py-4 border-t border-slate-100">
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={setCurrentPage} 
          />
        </div>
      </div>

      <DetailModal 
        isOpen={!!viewingLog}
        onClose={() => setViewingLog(null)}
        title="Chi tiết Nhật ký"
        subtitle={`Kích hoạt bởi: ${user?.name || 'Ẩn danh'}`}
        icon={<History size={24} />}
        fields={[
          { label: 'Thời điểm xuất', value: viewingLog ? new Date(viewingLog.ngay_tao).toLocaleString('vi-VN') : '' },
          { label: 'Mẫu báo cáo', value: viewingLog?.ten_mau },
          { label: 'Mã Dòng ID (RowID)', value: viewingLog?.ma_id, isMono: true },
          { label: 'Trạng thái hoạt động', value: viewingLog?.trang_thai },
          { label: 'Loại tệp trích xuất', value: 'PDF / Drive View' },
          { label: 'Máy chủ xử lý', value: 'Google Cloud Platform' }
        ]}
      />
    </div>
  );
};
