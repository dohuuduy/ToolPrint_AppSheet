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
  Filter,
  RefreshCw
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
        const valA = (a[sortConfig.key as keyof any] || '').toString().toLowerCase();
        const valB = (b[sortConfig.key as keyof any] || '').toString().toLowerCase();
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

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-4">
      <RefreshCw className="animate-spin text-indigo-600" size={32} />
      <p className="text-sm font-medium">Đang tải danh sách ứng dụng...</p>
    </div>
  );

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic">Kết nối <span className="text-indigo-600">AppSheet</span></h2>
          <p className="text-slate-500 text-sm font-medium mt-1">Quản lý các nguồn dữ liệu API từ AppSheet của bạn.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? <X size={20} /> : <Plus size={20} />} 
          <span>{showForm ? 'Đóng Form' : 'Kết nối mới'}</span>
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ opacity: 0, y: -20, height: 0 }} 
            animate={{ opacity: 1, y: 0, height: 'auto' }} 
            exit={{ opacity: 0, y: -20, height: 0 }} 
            className="overflow-hidden"
          >
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/40 p-6 md:p-10 mb-10 relative overflow-hidden">
               {/* Decorative background element */}
               <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none" />
               
              <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                         <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                         Tên ứng dụng
                      </label>
                      <HelpCircle size={14} className="text-slate-300" />
                    </div>
                    <input required value={newApp.ten_ung_dung} onChange={e => setNewApp({...newApp, ten_ung_dung: e.target.value})} className="input-modern" placeholder="Ví dụ: CRM Bán Hàng" />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <div className="w-1.5 h-1.5 bg-violet-500 rounded-full" />
                       Bảng chính AppSheet
                    </label>
                    <input required value={newApp.bang_chinh} onChange={e => setNewApp({...newApp, bang_chinh: e.target.value})} className="input-modern" placeholder="Thường là Tên Sheet" />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                       App ID
                    </label>
                    <input required value={newApp.app_id} onChange={e => setNewApp({...newApp, app_id: e.target.value})} className="input-modern font-mono text-xs" placeholder="xxxxxxxx-xxxx-..." />
                  </div>

                  <div className="space-y-3 lg:col-span-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                       API Access Key
                    </label>
                    <input required type="password" value={newApp.khoa_api} onChange={e => setNewApp({...newApp, khoa_api: e.target.value})} className="input-modern font-mono" placeholder="••••••••••••••••" />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                       Thư mục Mẫu (Folder ID)
                    </label>
                    <input required value={newApp.folder_mau_id} onChange={e => setNewApp({...newApp, folder_mau_id: e.target.value})} className="input-modern font-mono text-xs" placeholder="Lấy từ link Google Drive" />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <div className="w-1.5 h-1.5 bg-rose-400 rounded-full" />
                       Thư mục Xuất (Folder ID)
                    </label>
                    <input required value={newApp.folder_xuat_id} onChange={e => setNewApp({...newApp, folder_xuat_id: e.target.value})} className="input-modern font-mono text-xs" placeholder="Nơi lưu file kết quả" />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row justify-end gap-4 pt-10 border-t border-slate-50">
                  <button type="button" onClick={testConnection} disabled={testingConnection} className="btn-secondary group min-w-[200px]">
                    <motion.div animate={testingConnection ? { rotate: 360 } : {}} transition={{ repeat: Infinity, duration: 1 }}>
                        <Zap size={18} className={testingConnection ? 'text-indigo-400' : 'text-amber-500'} />
                    </motion.div>
                    <span className="font-black">{testingConnection ? "Đang kiểm tra..." : "Test kết nối API"}</span>
                  </button>
                  <button type="submit" className="btn-primary min-w-[240px]">
                    <Check size={18} />
                    <span className="font-black">{editingApp ? 'Cập nhật cấu hình' : 'Thiết lập hệ thống'}</span>
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

            <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1">
                  <input 
                    type="text" 
                    placeholder="Tìm kiếm ứng dụng..." 
                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold"
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  />
                  <Search size={18} className="absolute left-4 top-3 text-slate-400" />
                </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bộ lọc:</span>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold appearance-none cursor-pointer pr-10"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem' }}
            >
              <option value="all">Tất cả</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Tạm dừng</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-white">
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer group" onClick={() => handleSort('ten_ung_dung')}>
                   <div className="flex items-center gap-2 group-hover:text-indigo-600 transition-colors">
                     Ứng dụng
                   </div>
                </th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Bảng chính</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Trạng thái</th>
                <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedApps.map((app: any, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-8 py-6">
                    <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{app.ten_ung_dung}</div>
                    <div className="text-[10px] font-mono text-slate-400 mt-1">{app.app_id.slice(0, 8)}...</div>
                  </td>
                  <td className="px-8 py-6 text-slate-600 font-bold text-sm tracking-tight">{app.bang_chinh}</td>
                  <td className="px-8 py-6">
                    <span className={`badge-status ${
                       app.trang_thai === 'Hoạt động' 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${app.trang_thai === 'Hoạt động' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                      {app.trang_thai}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2 translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                      <button onClick={() => setEditingApp(app)} className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-2xl border border-transparent hover:border-slate-100 hover:shadow-xl transition-all" title="Sửa">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDelete(app.ma_id, app.ten_ung_dung)} className="p-3 text-slate-400 hover:text-rose-600 hover:bg-white rounded-2xl border border-transparent hover:border-slate-100 hover:shadow-xl transition-all" title="Xóa">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {paginatedApps.length === 0 && (
          <div className="py-24 text-center text-slate-300">
            <Filter size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-xs font-black uppercase tracking-widest">Không tìm thấy ứng dụng nào</p>
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
