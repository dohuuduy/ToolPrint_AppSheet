import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Grid, 
  Search, 
  Plus, 
  X, 
  Zap, 
  HelpCircle, 
  Edit, 
  Eye, 
  Trash2, 
  ChevronUp,
  ChevronDown,
  Database,
  ArrowRight,
  ExternalLink,
  Lock,
  FolderOpen,
  ArrowLeft,
  ArrowRight as ArrowRightIcon
} from 'lucide-react';
import { useAppStore } from '../../../store/use-app-store';
import { api } from '../../../services/api.service';
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
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize] = React.useState(10);
  const [sortConfig, setSortConfig] = React.useState({ key: 'ten_ung_dung', direction: 'asc' });

  React.useEffect(() => {
    fetchApps();
  }, [fetchApps]);

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
    let result = apps.filter((app: AppSheetConfig) => 
      (app.ten_ung_dung || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.app_id || '').toLowerCase().includes(searchTerm.toLowerCase())
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
  }, [apps, searchTerm, sortConfig]);

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
    <div className="flex flex-col items-center justify-center p-20 gap-4">
      <div className="relative">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600/20 border-t-indigo-600"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Database size={16} className="text-indigo-600 animate-pulse" />
        </div>
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Truy xuất cơ sở dữ liệu...</p>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header section with Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-2">
             <div className="w-8 h-8 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 border border-indigo-100">
               <Grid size={16} />
             </div>
             <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Cổng kết nối API</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Quản lý Ứng dụng</h2>
          <p className="text-slate-500 font-medium text-sm mt-1 max-w-md">Thiết lập và đồng bộ hóa các ứng dụng AppSheet của bạn với nền tảng in ấn Hub.</p>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="px-5 py-3 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-1 leading-none">Tổng cộng</span>
              <span className="text-xl font-black text-slate-900 leading-none">{apps.length}</span>
           </div>
           <button 
             onClick={() => { setShowForm(true); setEditingApp(null); }} 
             className="px-6 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-black transition-all flex items-center gap-3 shadow-xl shadow-slate-200"
           >
             <Plus size={20} />
             KẾT NỐI MỚI
           </button>
        </div>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
          >
            <motion.div className="bg-white rounded-[3rem] w-full max-w-4xl shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                    <Zap size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">
                      {editingApp ? 'Cập nhật kết nối' : 'Cấu hình kết nối mới'}
                    </h3>
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-0.5">AppSheet API Protocol</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowForm(false)}
                  className="p-3 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-2xl border border-slate-100 transition-all active:scale-95"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-auto p-8 md:p-12 space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                       <div className="w-2 h-2 bg-indigo-600 rounded-full" />
                       <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Định danh AppSheet</h4>
                    </div>
                    
                    <div className="group space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 ml-1 group-focus-within:text-indigo-600 transition-colors">
                        Tên định danh ứng dụng
                      </label>
                      <input 
                        required 
                        value={newApp.ten_ung_dung} 
                        onChange={e => setNewApp({...newApp, ten_ung_dung: e.target.value})} 
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300" 
                        placeholder="Ví dụ: CRM Bán hàng" 
                      />
                    </div>

                    <div className="group space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 ml-1 group-focus-within:text-indigo-600 transition-colors">
                        Table Name (Tên bảng chính)
                      </label>
                      <input 
                        required 
                        value={newApp.bang_chinh} 
                        onChange={e => setNewApp({...newApp, bang_chinh: e.target.value})} 
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300" 
                        placeholder="Tên bảng trên AppSheet" 
                      />
                    </div>

                    <div className="group space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 ml-1 group-focus-within:text-indigo-600 transition-colors">
                        App ID
                      </label>
                      <div className="relative">
                         <Database size={16} className="absolute left-6 top-5 text-slate-300" />
                         <input 
                          required 
                          value={newApp.app_id} 
                          onChange={e => setNewApp({...newApp, app_id: e.target.value})} 
                          className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-mono text-indigo-600 font-bold" 
                          placeholder="xxxxxxxx-xxxx-xxxx-xxxx" 
                        />
                      </div>
                    </div>

                    <div className="group space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 ml-1 group-focus-within:text-indigo-600 transition-colors">
                        Access Key
                      </label>
                      <div className="relative">
                         <Lock size={16} className="absolute left-6 top-5 text-slate-300" />
                         <input 
                          required 
                          type="password"
                          value={newApp.khoa_api} 
                          onChange={e => setNewApp({...newApp, khoa_api: e.target.value})} 
                          className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-mono font-bold" 
                          placeholder="Application Access Key" 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                       <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                       <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Cấu hình Lưu trữ Hub</h4>
                    </div>

                    <div className="p-6 bg-indigo-50/50 rounded-[2rem] border border-indigo-100 flex gap-4 mb-6">
                      <Info size={20} className="text-indigo-600 shrink-0 mt-1" />
                      <p className="text-[11px] text-indigo-900 leading-relaxed font-bold italic">
                        Hub sử dụng Folder ID của Google Drive để quản lý mẫu và tệp xuất. Bạn có thể lấy ID này từ URL thư mục trên trình duyệt.
                      </p>
                    </div>

                    <div className="group space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 ml-1 group-focus-within:text-emerald-600 transition-colors">
                        Folder Mẫu (Template)
                      </label>
                      <div className="relative">
                         <FolderOpen size={16} className="absolute left-6 top-5 text-slate-300" />
                         <input 
                          required 
                          value={newApp.folder_mau_id} 
                          onChange={e => setNewApp({...newApp, folder_mau_id: e.target.value})} 
                          className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-mono text-xs font-bold" 
                          placeholder="Folder ID thư mục Word/Excel" 
                        />
                      </div>
                    </div>

                    <div className="group space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 ml-1 group-focus-within:text-emerald-600 transition-colors">
                        Folder Xuất (Output)
                      </label>
                      <div className="relative">
                         <ExternalLink size={16} className="absolute left-6 top-5 text-slate-300" />
                         <input 
                          required 
                          value={newApp.folder_xuat_id} 
                          onChange={e => setNewApp({...newApp, folder_xuat_id: e.target.value})} 
                          className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-mono text-xs font-bold" 
                          placeholder="Folder ID thư mục lưu PDF" 
                        />
                      </div>
                    </div>

                    <div className="bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden mt-8 shadow-xl shadow-slate-200">
                       <HelpCircle size={40} className="absolute -bottom-2 -right-2 text-white/5" />
                       <div className="relative z-10">
                          <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Hướng dẫn nhanh</p>
                          <p className="text-[12px] text-white/80 font-medium leading-relaxed">
                            Cơ chế in ấn dựa trên việc đọc dữ liệu từ bảng <span className="font-black text-indigo-300 italic">{newApp.bang_chinh || '...'}</span>. Hãy chắc chắn bảng này chứa Header tương ứng với các biến trong template.
                          </p>
                       </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-center gap-4">
                  <button 
                    type="button" 
                    onClick={testConnection} 
                    disabled={testingConnection} 
                    className="w-full md:w-auto px-8 py-4 bg-white text-slate-900 font-black rounded-2xl border border-slate-200 hover:bg-slate-100 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                  >
                    {testingConnection ? 
                       <div className="w-5 h-5 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" /> : 
                       <Zap size={18} className="text-indigo-600" />
                    }
                    TEST API CONNECTION
                  </button>
                  <div className="flex w-full md:w-auto gap-4">
                    <button 
                      onClick={() => setShowForm(false)}
                      className="flex-1 md:flex-none px-8 py-4 text-slate-400 font-black text-sm uppercase tracking-widest hover:text-slate-600"
                    >
                      HỦY
                    </button>
                    <button 
                      onClick={handleSubmit}
                      className="flex-1 md:flex-none px-12 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 active:scale-95"
                    >
                      {editingApp ? 'LƯU CẬP NHẬT' : 'PHÁT HÀNH KẾT NỐI'}
                    </button>
                  </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area: Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
           <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <Database size={16} className="text-indigo-600" />
                Danh sách kết nối
              </h3>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight mt-1">Đã đồng bộ {apps.length} ứng dụng</p>
           </div>
           
           <div className="relative">
             <Search size={16} className="absolute left-4 top-3.5 text-slate-400" />
             <input 
               type="text" 
               placeholder="Gõ tên ứng dụng..." 
               className="pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-xs font-black text-slate-900 w-full sm:w-64 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-200 outline-none transition-all placeholder:text-slate-300"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-50 uppercase text-[10px] font-black text-slate-400 tracking-[0.1em]">
                <th className="px-8 py-5 group cursor-pointer hover:text-slate-900" onClick={() => handleSort('ten_ung_dung')}>
                   <div className="flex items-center gap-2">
                     THÔNG TIN ỨNG DỤNG
                     {sortConfig.key === 'ten_ung_dung' && (
                       sortConfig.direction === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                     )}
                   </div>
                </th>
                <th className="px-8 py-5 hidden lg:table-cell">APPLICATION PROTOCOL</th>
                <th className="px-8 py-5 hidden md:table-cell">LƯU TRỮ DRIVE</th>
                <th className="px-8 py-5">TRẠNG THÁI</th>
                <th className="px-8 py-5 text-right">QUẢN TRỊ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedApps.map((app: any, i) => (
                <tr key={i} className="group transition-all hover:bg-slate-50/50">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-lg shadow-black/10">
                         {app.ten_ung_dung?.charAt(0).toUpperCase() || 'A'}
                       </div>
                       <div className="min-w-0">
                          <p className="text-base font-black text-slate-900 tracking-tight truncate group-hover:text-indigo-600 transition-colors">
                            {app.ten_ung_dung || app.ten_app}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                             <Grid size={10} className="text-slate-400" />
                             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{app.bang_chinh}</span>
                          </div>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 hidden lg:table-cell">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-slate-900 uppercase">App ID</span>
                        <code className="text-[10px] font-mono text-indigo-500 font-bold bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100/50">{app.app_id?.slice(0, 12)}...</code>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase">Auth</span>
                        <span className="text-[10px] font-bold text-slate-500">••••••••••••••</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 hidden md:table-cell">
                     <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Mau ID</span>
                           <code className="text-[9px] font-mono font-bold text-slate-600">{app.folder_mau_id?.slice(0, 8)}...</code>
                        </div>
                        <div className="w-px h-6 bg-slate-100" />
                        <div className="flex flex-col">
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Xuat ID</span>
                           <code className="text-[9px] font-mono font-bold text-slate-600">{app.folder_xuat_id?.slice(0, 8)}...</code>
                        </div>
                     </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1.5">
                       <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-xl border border-emerald-100/50 w-fit">
                         <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                         LIVE
                       </span>
                       <span className="text-[9px] font-bold text-slate-400 uppercase whitespace-nowrap">Last sync: Just now</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                     <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => setEditingApp(app)}
                          className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50 transition-all"
                          title="Cấu hình"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(app.ma_id, app.ten_ung_dung)}
                          className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-rose-600 hover:border-rose-100 hover:bg-rose-50 transition-all"
                          title="Ngắt kết nối"
                        >
                          <Trash2 size={16} />
                        </button>
                        <div className="hidden sm:block">
                           <button className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-300 hover:text-slate-900 hover:bg-slate-50 transition-all opacity-0 group-hover:opacity-100">
                             <ArrowRight size={18} />
                           </button>
                        </div>
                     </div>
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
               Hiển thị {paginatedApps.length} trên {filteredApps.length} kết nối
             </div>
             <div className="flex gap-2">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                  className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-900 disabled:opacity-30 transition-all active:scale-95 shadow-sm"
                >
                  <ArrowLeft size={16} />
                </button>
                <div className="flex items-center px-4 bg-white border border-slate-100 rounded-xl text-xs font-black text-slate-900 shadow-sm">
                   Trang {currentPage} / {totalPages}
                </div>
                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                  className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-900 disabled:opacity-30 transition-all active:scale-95 shadow-sm"
                >
                  <ArrowRightIcon size={16} />
                </button>
             </div>
          </div>
        )}
      </div>

      {/* Empty State */}
      {filteredApps.length === 0 && !loading && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          className="bg-white p-20 rounded-[3rem] border border-dashed border-slate-200 text-center flex flex-col items-center gap-6"
        >
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 border-2 border-dashed border-slate-100">
            <Search size={32} />
          </div>
          <div className="max-w-xs mx-auto">
            <p className="text-lg font-black text-slate-900 tracking-tight mb-2 uppercase tracking-widest">Không tìm thấy kết nối</p>
            <p className="text-slate-400 font-medium text-sm">Vui lòng kiểm tra lại từ khóa tìm kiếm hoặc tạo một kết nối mới.</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};
