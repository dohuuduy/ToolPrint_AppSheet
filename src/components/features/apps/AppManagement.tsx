import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Grid, 
  Search, 
  Plus, 
  X, 
  Zap, 
  Info, 
  HelpCircle, 
  History, 
  Edit, 
  Eye, 
  Trash2, 
  ChevronsLeft, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsRight,
  ChevronUp,
  ChevronDown,
  Check,
  Filter
} from 'lucide-react';
import { useAppStore } from '../../../store/use-app-store';
import { api } from '../../../services/api.service';
import { Pagination } from '../../ui/Pagination';
import { AppSheetConfig } from '../../../types';

export const AppManagement: React.FC = () => {
  const { apps, loading, fetchApps } = useAppStore();
  const [showForm, setShowForm] = React.useState(false);
  const [editingApp, setEditingApp] = React.useState<AppSheetConfig | null>(null);
  const [newApp, setNewApp] = React.useState({ 
    ten_ung_dung: '', 
    app_id: '', 
    khoa_api: '',
    folder_mau_id: '',
    folder_xuat_id: '',
    bang_chinh: 'KhachHang'
  });
  const [testingConnection, setTestingConnection] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize] = React.useState(10);
  const [sortConfig, setSortConfig] = React.useState({ key: 'ten_ung_dung', direction: 'asc' });
  const [viewingApp, setViewingApp] = React.useState<AppSheetConfig | null>(null);

  React.useEffect(() => {
    fetchApps();
  }, [fetchApps]);

  // Đồng bộ form khi chọn Sửa
  React.useEffect(() => {
    if (editingApp) {
      setNewApp({
        ten_ung_dung: editingApp.ten_ung_dung,
        app_id: editingApp.app_id,
        khoa_api: editingApp.khoa_api,
        folder_mau_id: editingApp.folder_mau_id,
        folder_xuat_id: editingApp.folder_xuat_id,
        bang_chinh: editingApp.bang_chinh
      });
      setShowForm(true);
    } else {
      setNewApp({ 
        ten_ung_dung: '', 
        app_id: '', 
        khoa_api: '',
        folder_mau_id: '',
        folder_xuat_id: '',
        bang_chinh: 'KhachHang'
      });
    }
  }, [editingApp]);

  const testConnection = async () => {
    if (!newApp.app_id || !newApp.khoa_api || !newApp.bang_chinh) {
      alert('Vui lòng nhập App ID, API Key và Tên bảng chính để test.');
      return;
    }
    setTestingConnection(true);
    try {
      const cols = await api.testAppSheetConnection({
        appId: newApp.app_id,
        apiKey: newApp.khoa_api,
        tableName: newApp.bang_chinh
      });
      
      if (cols && cols.length > 0) {
        alert(`Kết nối thành công! Tìm thấy bảng ${newApp.bang_chinh} với ${cols.length} cột.`);
      } else {
        alert(`Kết nối thành công nhưng bảng ${newApp.bang_chinh} không có dữ liệu để xác định cột.`);
      }
    } catch (err: any) {
      alert(`Kết nối thất bại: ${err.message || 'Lỗi không xác định'}`);
    } finally {
      setTestingConnection(false);
    }
  };

  const handleSort = (key: string) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredApps = React.useMemo(() => {
    let result = apps.filter((app: AppSheetConfig) => {
      const matchesSearch = (app.ten_ung_dung || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (app.app_id || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || 
                            (statusFilter === 'active' && app.trang_thai === 'Hoạt động') ||
                            (statusFilter === 'inactive' && app.trang_thai === 'Ngừng hoạt động');
      
      return matchesSearch && matchesStatus;
    });

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
  }, [apps, searchTerm, statusFilter, sortConfig]);

  const paginatedApps = React.useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredApps.slice(startIndex, startIndex + pageSize);
  }, [filteredApps, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredApps.length / pageSize);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa cấu hình ứng dụng "${name}"?`)) return;
    try {
      await api.deleteApp(id);
      fetchApps();
    } catch (err) {
      alert('Lỗi kết nối khi xóa');
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (editingApp) {
        await api.updateApp(editingApp.ma_id, newApp);
      } else {
        await api.createApp({ ...newApp, ma_id: `APP_${Date.now()}`, trang_thai: 'Hoạt động' });
      }
      setShowForm(false);
      setEditingApp(null);
      fetchApps();
    } catch (err) {
      alert('Lỗi lưu cấu hình ứng dụng');
    }
  };

  const toggleForm = () => {
    if (showForm) {
      setEditingApp(null);
      setShowForm(false);
    } else {
      setShowForm(true);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-32 text-slate-400 gap-4">
      <div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin shadow-lg shadow-indigo-100"></div>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">Phân tích hệ thống ứng dụng...</p>
    </div>
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Cấu hình Ứng dụng</h2>
          <p className="text-slate-500 font-medium text-sm">Kết nối và quản lý các cổng API AppSheet của bạn.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white border border-slate-100 rounded-2xl p-1 shadow-sm sm:flex hidden">
             <button 
              onClick={() => { setStatusFilter('all'); setCurrentPage(1); }}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${statusFilter === 'all' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-400 hover:text-slate-600'}`}
             >Tất cả</button>
             <button 
              onClick={() => { setStatusFilter('active'); setCurrentPage(1); }}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${statusFilter === 'active' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' : 'text-slate-400 hover:text-slate-600'}`}
             >Hoạt động</button>
          </div>
          <button onClick={toggleForm} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-200">
            {showForm ? <X size={20} /> : <Plus size={20} />} 
            <span>{showForm ? 'Hủy bỏ' : 'Kết nối mới'}</span>
          </button>
        </div>
      </div>

      <div className="relative group">
        <input 
          type="text" 
          placeholder="Tìm tên ứng dụng hoặc App ID..." 
          className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-[2rem] text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium shadow-sm"
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
        />
        <Search size={22} className="absolute left-5 top-4 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-2xl shadow-slate-200/40">
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="space-y-8">
                     <div className="flex items-center gap-3 mb-2">
                       <div className="w-1.5 h-6 bg-indigo-600 rounded-full" />
                       <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Định danh kết nối</h4>
                     </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tên ứng dụng</label>
                      <input required value={newApp.ten_ung_dung} onChange={e => setNewApp({...newApp, ten_ung_dung: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700" placeholder="Ví dụ: CRM Bất Động Sản" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tên bảng chính</label>
                      <input required value={newApp.bang_chinh} onChange={e => setNewApp({...newApp, bang_chinh: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700" placeholder="Tên bảng trên AppSheet (VD: KhachHang)" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mã ID Ứng dụng (App ID)</label>
                      <input required value={newApp.app_id} onChange={e => setNewApp({...newApp, app_id: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-mono text-indigo-600 font-bold" placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mã Khóa API (Access Key)</label>
                      <input required type="password" value={newApp.khoa_api} onChange={e => setNewApp({...newApp, khoa_api: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-mono font-bold" placeholder="Nhập khóa API bảo mật..." />
                    </div>
                  </div>
                  
                  <div className="space-y-8">
                    <div className="flex items-center gap-3 mb-2">
                       <div className="w-1.5 h-6 bg-emerald-600 rounded-full" />
                       <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Lưu trữ Google Drive</h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Thư mục nguồn (Mẫu)</label>
                        <input required value={newApp.folder_mau_id} onChange={e => setNewApp({...newApp, folder_mau_id: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-mono font-bold" placeholder="Folder ID..." />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Thư mục đích (Xuất)</label>
                        <input required value={newApp.folder_xuat_id} onChange={e => setNewApp({...newApp, folder_xuat_id: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-mono font-bold" placeholder="Folder ID..." />
                      </div>
                    </div>
                    <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 flex gap-4">
                      <HelpCircle size={20} className="text-amber-600 shrink-0" />
                      <div className="text-xs text-amber-700 leading-relaxed font-bold">
                        <span className="font-black">Lưu ý bảo mật:</span> Đảm bảo bạn đã bật "Enable API" trong AppSheet Editor của bạn.
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end pt-4 gap-4">
                  <button type="button" onClick={testConnection} disabled={testingConnection} className="px-8 py-4 bg-slate-100 text-slate-700 font-bold rounded-2xl hover:bg-slate-200 transition-all flex items-center gap-2">
                    {testingConnection ? "..." : <Zap size={20} className="text-indigo-600" />}
                    <span>Kiểm tra kết nối</span>
                  </button>
                  <button type="submit" className="px-12 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
                    {editingApp ? 'Cập nhật' : 'Thiết lập ngay'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th 
                  className="px-6 py-4 text-left cursor-pointer group select-none transition-colors hover:bg-slate-100/50" 
                  onClick={() => handleSort('ten_ung_dung')}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider group-hover:text-indigo-600 transition-colors">Ứng dụng</span>
                    {sortConfig.key === 'ten_ung_dung' && (
                      <span className="text-indigo-500">
                        {sortConfig.direction === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-4 text-left hidden lg:table-cell cursor-pointer group select-none transition-colors hover:bg-slate-100/50"
                  onClick={() => handleSort('app_id')}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider group-hover:text-indigo-600 transition-colors">Mã App ID</span>
                    {sortConfig.key === 'app_id' && (
                      <span className="text-indigo-500">
                        {sortConfig.direction === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                      </span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-4 text-left">
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Trạng thái</span>
                </th>
                <th className="px-6 py-4 text-right">
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Thao tác</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedApps.map((app: any, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900 text-sm tracking-tight">{app.ten_ung_dung || app.ten_app}</div>
                    <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{app.bang_chinh}</div>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                     <code className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded-md border border-slate-200/30">{app.app_id}</code>
                  </td>
                  <td className="px-6 py-4">
                     <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                       app.trang_thai === 'Hoạt động' 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100/50' 
                        : 'bg-slate-100 text-slate-500 border-slate-200/50'
                     }`}>
                      <div className={`w-1 h-1 rounded-full ${app.trang_thai === 'Hoạt động' ? 'bg-emerald-500' : 'bg-slate-400'}`} /> 
                      {app.trang_thai || 'Online'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                       <button 
                        onClick={() => setEditingApp(app)} 
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        title="Chỉnh sửa"
                       >
                        <Edit size={14} />
                       </button>
                       <button 
                        onClick={() => setViewingApp(app)} 
                        className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
                        title="Chi tiết"
                       >
                        <Eye size={14} />
                       </button>
                       <button 
                        onClick={() => handleDelete(app.ma_id, app.ten_ung_dung)} 
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        title="Xóa"
                       >
                        <Trash2 size={14} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedApps.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
                    Không tìm thấy ứng dụng nào phù hợp
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
