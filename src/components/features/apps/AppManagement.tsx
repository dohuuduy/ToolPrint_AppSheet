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
  Edit, 
  Eye, 
  Trash2, 
  ChevronUp,
  ChevronDown,
  Check
} from 'lucide-react';
import { useAppStore } from '../../../store/use-app-store';
import { api } from '../../../services/api.service';
import { Pagination } from '../../ui/Pagination';
import { DetailModal } from '../../ui/DetailModal';
import { AppSheetConfig } from '../../../types';

export const AppManagement: React.FC = () => {
  const { apps, loading, fetchApps } = useAppStore();
  const [showForm, setShowForm] = React.useState(false);
  const [editingApp, setEditingApp] = React.useState<AppSheetConfig | null>(null);
  const [viewingApp, setViewingApp] = React.useState<AppSheetConfig | null>(null);
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
        const valA = (String(a[sortConfig.key as keyof AppSheetConfig] || '')).toLowerCase();
        const valB = (String(b[sortConfig.key as keyof AppSheetConfig] || '')).toLowerCase();
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
    <div className="space-y-8 max-w-7xl mx-auto pb-20 px-4 sm:px-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Cấu hình Ứng dụng</h2>
          <p className="text-slate-500 font-medium text-sm mt-1">Kết nối và quản lý các cổng API AppSheet của bạn.</p>
        </div>
        <div className="flex items-center shadow-indigo-100/50 shadow-lg rounded-xl overflow-hidden p-1 bg-white border border-indigo-50">
          <button 
            onClick={() => { setStatusFilter('all'); setCurrentPage(1); }}
            className={`px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${statusFilter === 'all' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-indigo-600'}`}
          >Tất cả</button>
          <button 
            onClick={() => { setStatusFilter('active'); setCurrentPage(1); }}
            className={`px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${statusFilter === 'active' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-emerald-600'}`}
          >Hoạt động</button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 group">
          <input 
            type="text" 
            placeholder="Tìm tên ứng dụng hoặc App ID..." 
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium shadow-sm"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
          <Search size={20} className="absolute left-5 top-4 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
        </div>
        <button onClick={toggleForm} className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-200">
          {showForm ? <X size={18} /> : <Plus size={18} />} 
          <span>{showForm ? 'Hủy bỏ' : 'Kết nối mới'}</span>
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-2xl shadow-slate-200/40 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50" />
              
              <form onSubmit={handleSubmit} className="relative space-y-12">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                      {editingApp ? 'Cập nhật cấu hình' : 'Kết nối Ứng dụng mới'}
                    </h3>
                    <p className="text-slate-500 font-medium text-sm mt-1">Cung cấp thông tin API để liên kết với cơ sở dữ liệu AppSheet.</p>
                  </div>
                  <div className="hidden sm:block">
                     <div className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                       Vercel + AppSheet System
                     </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 text-vietnam">
                  <div className="lg:col-span-7 space-y-10">
                     <div className="space-y-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-black text-xs">1</div>
                          <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Thông tin cơ bản</h4>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tên ứng dụng</label>
                            <input required value={newApp.ten_ung_dung} onChange={e => setNewApp({...newApp, ten_ung_dung: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700 shadow-sm" placeholder="VD: Quản lý Bán hàng" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Bảng chính</label>
                            <input required value={newApp.bang_chinh} onChange={e => setNewApp({...newApp, bang_chinh: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700 shadow-sm" placeholder="VD: KhachHang" />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center justify-between">
                              <span>AppSheet ID (Legacy/Unique)</span>
                              <HelpCircle size={12} className="text-slate-300" />
                            </label>
                            <input required value={newApp.app_id} onChange={e => setNewApp({...newApp, app_id: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-mono text-indigo-600 font-bold tracking-tight shadow-sm" placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mã Khóa API (Access Key)</label>
                            <input required type="password" value={newApp.khoa_api} onChange={e => setNewApp({...newApp, khoa_api: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-mono font-bold shadow-sm" placeholder="Nhập mã khóa bảo mật..." />
                          </div>
                        </div>
                     </div>
                  </div>
                  
                  <div className="lg:col-span-5 space-y-10">
                     <div className="space-y-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-emerald-600 text-white rounded-lg flex items-center justify-center font-black text-xs">2</div>
                          <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Lưu trữ Drive</h4>
                        </div>
                        
                        <div className="space-y-5">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ID Thư mục Mẫu</label>
                            <input required value={newApp.folder_mau_id} onChange={e => setNewApp({...newApp, folder_mau_id: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-mono text-xs font-bold shadow-sm" placeholder="Mã thư mục chứa File Word..." />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ID Thư mục Xuất</label>
                            <input required value={newApp.folder_xuat_id} onChange={e => setNewApp({...newApp, folder_xuat_id: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-mono text-xs font-bold shadow-sm" placeholder="Mã thư mục lưu PDF báo cáo..." />
                          </div>
                        </div>
                     </div>

                     <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-start gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
                          <Info size={18} className="text-slate-400" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-[11px] font-black text-slate-900 uppercase tracking-wider">Hỗ trợ</p>
                          <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                            Mở thư mục trên Google Drive và copy ID từ thanh địa chỉ trình duyệt.
                          </p>
                        </div>
                     </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-8 border-t border-slate-100">
                  <div className="flex items-center gap-4 text-slate-400">
                     <p className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                       <History size={14} /> Tự động ghi nhật ký vào Google Sheets
                     </p>
                  </div>
                  
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <button type="button" onClick={testConnection} disabled={testingConnection} className="flex-1 sm:flex-none px-8 py-4 bg-slate-100 text-slate-700 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2">
                      {testingConnection ? "Đang xử lý..." : (
                        <>
                          <Zap size={16} className="text-indigo-600" />
                          Test Kết nối
                        </>
                      )}
                    </button>
                    <button type="submit" className="flex-1 sm:flex-none px-12 py-4 bg-indigo-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 scale-100 active:scale-95">
                      {editingApp ? 'Lưu thay đổi' : 'Thiết lập ngay'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th 
                  className="px-8 py-5 text-left cursor-pointer group select-none transition-colors hover:bg-slate-100/50" 
                  onClick={() => handleSort('ten_ung_dung')}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider group-hover:text-indigo-600 transition-colors">Ứng dụng</span>
                    {sortConfig.key === 'ten_ung_dung' && (
                      <span className="text-indigo-500">
                        {sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-8 py-5 text-left hidden lg:table-cell cursor-pointer group select-none transition-colors hover:bg-slate-100/50"
                  onClick={() => handleSort('app_id')}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider group-hover:text-indigo-600 transition-colors">ID Duy nhất</span>
                    {sortConfig.key === 'app_id' && (
                      <span className="text-indigo-500">
                        {sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </span>
                    )}
                  </div>
                </th>
                <th className="px-8 py-5 text-left">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Trạng thái</span>
                </th>
                <th className="px-8 py-5 text-right">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Hành động</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedApps.map((app: AppSheetConfig, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="font-black text-slate-900 text-sm tracking-tight">{app.ten_ung_dung}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.1em] mt-1 flex items-center gap-2">
                      <Grid size={12} className="text-indigo-300" />
                      {app.bang_chinh}
                    </div>
                  </td>
                  <td className="px-8 py-6 hidden lg:table-cell">
                     <code className="text-[10px] font-mono px-3 py-1 bg-slate-100 text-slate-500 rounded-full border border-slate-200/30">{app.app_id}</code>
                  </td>
                  <td className="px-8 py-6">
                     <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.15em] border ${
                       app.trang_thai === 'Hoạt động' 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100/50' 
                        : 'bg-slate-100 text-slate-500 border-slate-200/50'
                     }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${app.trang_thai === 'Hoạt động' ? 'bg-emerald-500' : 'bg-slate-400'}`} /> 
                      {app.trang_thai}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-3">
                       <button 
                        onClick={() => setViewingApp(app)} 
                        className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
                        title="Xem chi tiết"
                       >
                        <Eye size={18} />
                       </button>
                       <button 
                        onClick={() => setEditingApp(app)} 
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                        title="Chỉnh sửa"
                       >
                        <Edit size={18} />
                       </button>
                       <button 
                        onClick={() => handleDelete(app.ma_id, app.ten_ung_dung)} 
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                        title="Xóa cấu hình"
                       >
                        <Trash2 size={18} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedApps.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-8 py-32 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200">
                        <Grid size={32} />
                      </div>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em]">Dữ liệu trống</p>
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
        isOpen={!!viewingApp}
        onClose={() => setViewingApp(null)}
        title="Chi tiết Ứng dụng"
        subtitle={viewingApp?.ten_ung_dung}
        icon={<Grid size={24} />}
        fields={[
          { label: 'Tên hiển thị', value: viewingApp?.ten_ung_dung },
          { label: 'Bảng dữ liệu chính', value: viewingApp?.bang_chinh },
          { label: 'App ID', value: viewingApp?.app_id, isMono: true },
          { label: 'API Key', value: 'Bảo mật (Cấp cao)', isSecret: true },
          { label: 'Folder Mẫu (Template) ID', value: viewingApp?.folder_mau_id, isMono: true },
          { label: 'Folder Xuất (PDF) ID', value: viewingApp?.folder_xuat_id, isMono: true },
          { label: 'Ngày tạo cấu hình', value: 'Mới nhất' },
          { label: 'Trạng thái hệ thống', value: viewingApp?.trang_thai }
        ]}
      />
    </div>
  );
};
