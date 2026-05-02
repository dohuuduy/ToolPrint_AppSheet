import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
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
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  Database,
  Filter
} from 'lucide-react';
import { useAppStore } from '../../../store/use-app-store';
import { api } from '../../../services/api.service';
import { Pagination } from '../../ui/Pagination';
import { ReportTemplate } from '../../../types';

export const TemplateManagement: React.FC = () => {
  const { apps, templates, loading, fetchTemplates, fetchApps } = useAppStore();
  const [showForm, setShowForm] = React.useState(false);
  const [editingTemplate, setEditingTemplate] = React.useState<ReportTemplate | null>(null);
  const [newTemplate, setNewTemplate] = React.useState({ 
    ten_mau: '', 
    ma_mau: '', 
    file_id_drive: '', 
    loai_file: 'DOCX' as const, 
    ma_ung_dung: '',
    bang_chinh: '',
    key_col: 'ma_id',
    child_table: '',
    foreign_key: '',
    child_name: 'items'
  });
  const [searchTerm, setSearchTerm] = React.useState('');
  const [appFilter, setAppFilter] = React.useState('all');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize] = React.useState(10);
  const [sortConfig, setSortConfig] = React.useState({ key: 'ten_mau', direction: 'asc' });

  React.useEffect(() => {
    fetchTemplates();
    fetchApps();
  }, [fetchTemplates, fetchApps]);

  // Đồng bộ form khi chọn Sửa mẫu
  React.useEffect(() => {
    if (editingTemplate) {
      setNewTemplate({
        ten_mau: editingTemplate.ten_mau,
        ma_mau: editingTemplate.ma_mau,
        file_id_drive: editingTemplate.file_id_drive,
        loai_file: editingTemplate.loai_file,
        ma_ung_dung: editingTemplate.ma_ung_dung,
        bang_chinh: editingTemplate.bang_chinh,
        key_col: editingTemplate.key_col,
        child_table: editingTemplate.child_table || '',
        foreign_key: editingTemplate.foreign_key || '',
        child_name: editingTemplate.child_name || 'items'
      });
      setShowForm(true);
    } else {
      setNewTemplate({ 
        ten_mau: '', 
        ma_mau: '', 
        file_id_drive: '', 
        loai_file: 'DOCX', 
        ma_ung_dung: apps[0]?.ma_id || '',
        bang_chinh: '',
        key_col: 'ma_id',
        child_table: '',
        foreign_key: '',
        child_name: 'items'
      });
    }
  }, [editingTemplate, apps]);

  const slugify = (text: string) => {
    return text.toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()
      .replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '_').toUpperCase();
  };

  const handleTenMauChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setNewTemplate(prev => ({
      ...prev,
      ten_mau: name,
      ma_mau: editingTemplate ? prev.ma_mau : slugify(name)
    }));
  };

  const handleSort = (key: string) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const filteredTemplates = React.useMemo(() => {
    let result = templates.filter((tpl: ReportTemplate) => {
      const matchesSearch = (tpl.ten_mau || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (tpl.ma_mau || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesApp = appFilter === 'all' || tpl.ma_ung_dung === appFilter;
      
      return matchesSearch && matchesApp;
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
  }, [templates, searchTerm, appFilter, sortConfig]);

  const paginatedTemplates = React.useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredTemplates.slice(startIndex, startIndex + pageSize);
  }, [filteredTemplates, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredTemplates.length / pageSize);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Xóa mẫu biểu "${name}"?`)) return;
    try {
      await api.deleteTemplate(id);
      fetchTemplates();
    } catch (err) {
      alert('Lỗi khi xóa');
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (editingTemplate) {
        await api.updateTemplate(editingTemplate.ma_id, newTemplate);
      } else {
        await api.createTemplate({ ...newTemplate, ma_id: `TPL_${Date.now()}` });
      }
      setShowForm(false);
      setEditingTemplate(null);
      fetchTemplates();
    } catch (err) {
      alert('Lỗi lưu mẫu biểu');
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-32 text-slate-400 gap-4">
      <div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin shadow-lg shadow-indigo-100"></div>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">Đang nạp mẫu biểu báo cáo...</p>
    </div>
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Mẫu báo cáo</h2>
          <p className="text-slate-500 font-medium text-sm">Quản lý và thiết lập các tệp Word/Excel để trộn dữ liệu.</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={appFilter}
            onChange={(e) => { setAppFilter(e.target.value); setCurrentPage(1); }}
            className="pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm outline-none appearance-none cursor-pointer"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem' }}
          >
            <option value="all">Tất cả ứng dụng</option>
            {apps.map(app => (
              <option key={app.ma_id} value={app.ma_id}>{app.ten_ung_dung}</option>
            ))}
          </select>
          <button onClick={() => setShowForm(!showForm)} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-200">
            {showForm ? <X size={20} /> : <Plus size={20} />} 
            <span>{showForm ? 'Hủy bỏ' : 'Thêm mẫu mới'}</span>
          </button>
        </div>
      </div>

      <div className="relative group">
        <input 
          type="text" 
          placeholder="Tìm tên mẫu biểu hoặc token..." 
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
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block ml-1">Tên mẫu báo cáo</label>
                    <input required value={newTemplate.ten_mau} onChange={handleTenMauChange} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all" placeholder="Ví dụ: Hợp đồng mua bán" />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block ml-1">Mã Token (Tự động)</label>
                    <input required value={newTemplate.ma_mau} readOnly className="w-full px-5 py-4 bg-slate-100 border border-slate-200 rounded-2xl font-mono text-indigo-600 font-bold outline-none" placeholder="MA_MAU_TU_DONG" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block ml-1">Ứng dụng AppSheet</label>
                    <select 
                      required 
                      value={newTemplate.ma_ung_dung} 
                      onChange={(e) => setNewTemplate({ ...newTemplate, ma_ung_dung: e.target.value })}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all"
                    >
                      <option value="">Chọn ứng dụng...</option>
                      {apps.map(app => (
                        <option key={app.ma_id} value={app.ma_id}>{app.ten_ung_dung}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block ml-1">Tên bảng chính</label>
                    <input required value={newTemplate.bang_chinh} onChange={(e) => setNewTemplate({ ...newTemplate, bang_chinh: e.target.value })} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all" placeholder="Ví dụ: KhachHang" />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block ml-1">Cột khóa chính (Key Column)</label>
                    <input required value={newTemplate.key_col} onChange={(e) => setNewTemplate({ ...newTemplate, key_col: e.target.value })} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all" placeholder="Mặc định: ma_id" />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block ml-1">Mã ID Tệp mẫu (Google Drive ID)</label>
                    <input required value={newTemplate.file_id_drive} onChange={(e) => setNewTemplate({ ...newTemplate, file_id_drive: e.target.value })} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all" placeholder="ID tệp từ URL Google Drive" />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block ml-1">Loại tệp</label>
                    <select 
                      value={newTemplate.loai_file} 
                      onChange={(e) => setNewTemplate({ ...newTemplate, loai_file: e.target.value as any })}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all"
                    >
                      <option value="DOCX">Microsoft Word (DOCX)</option>
                      <option value="XLSX">Microsoft Excel (XLSX)</option>
                    </select>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-8 mt-8">
                  <h3 className="text-sm font-black text-slate-900 mb-6 flex items-center gap-2">
                    <Database size={16} className="text-indigo-600" />
                    Cấu hình Bảng con (Chi tiết)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block ml-1">Tên bảng con</label>
                      <input value={newTemplate.child_table} onChange={(e) => setNewTemplate({ ...newTemplate, child_table: e.target.value })} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-indigo-500 transition-all" placeholder="Ví dụ: ChiTietDonHang" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block ml-1">Khóa ngoại (Foreign Key)</label>
                      <input value={newTemplate.foreign_key} onChange={(e) => setNewTemplate({ ...newTemplate, foreign_key: e.target.value })} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-indigo-500 transition-all" placeholder="Ví dụ: ma_id_cha" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block ml-1">Tên biến trong Template</label>
                      <input value={newTemplate.child_name} onChange={(e) => setNewTemplate({ ...newTemplate, child_name: e.target.value })} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-indigo-500 transition-all" placeholder="Mặc định: items" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button type="submit" className="px-12 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
                    {editingTemplate ? 'Cập nhật mẫu biểu' : 'Lưu mẫu biểu'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Templates List */}
      <div className="bg-white rounded-[2rem] border border-slate-200/60 shadow-xl shadow-slate-200/20 overflow-hidden">
        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th 
                  className="px-8 py-6 text-left cursor-pointer group select-none transition-colors hover:bg-slate-100/50"
                  onClick={() => handleSort('ten_mau')}
                >
                   <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest group-hover:text-indigo-600 transition-colors">Mẫu & Ứng dụng</span>
                    {sortConfig.key === 'ten_mau' && (
                      <span className="text-indigo-500">
                        {sortConfig.direction === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-8 py-6 text-left cursor-pointer group select-none transition-colors hover:bg-slate-100/50"
                  onClick={() => handleSort('ma_mau')}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest group-hover:text-indigo-600 transition-colors">Token</span>
                    {sortConfig.key === 'ma_mau' && (
                      <span className="text-indigo-500">
                        {sortConfig.direction === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                      </span>
                    )}
                  </div>
                </th>
                <th className="px-8 py-6 text-left">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Loại tệp</span>
                </th>
                <th className="px-8 py-6 text-right">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Thao tác</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedTemplates.map((tpl: ReportTemplate, i) => {
                const app = apps.find(a => a.ma_id === tpl.ma_ung_dung);
                return (
                  <tr key={i} className="hover:bg-slate-50/50 transition-all group">
                    <td className="px-8 py-6">
                      <div className="font-bold text-slate-900 text-sm tracking-tight group-hover:text-indigo-600 transition-colors">{tpl.ten_mau}</div>
                      <div className="flex items-center gap-2 mt-1.5 overflow-hidden">
                        <span className="text-[9px] text-indigo-500 font-black uppercase tracking-widest truncate max-w-[120px]">{app?.ten_ung_dung || 'N/A'}</span>
                        <span className="w-1 h-1 bg-slate-200 rounded-full shrink-0"></span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate">{tpl.bang_chinh}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <code className="text-[10px] font-mono px-2 py-1 bg-slate-100/80 text-slate-500 rounded-lg border border-slate-200/30 font-bold uppercase tracking-tight">{tpl.ma_mau}</code>
                    </td>
                    <td className="px-8 py-6">
                      <span className="inline-flex items-center px-3 py-1 bg-indigo-50 text-indigo-600 text-[9px] font-black rounded-full uppercase tracking-widest border border-indigo-100/50">
                        {tpl.loai_file}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2 translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                        <button 
                          onClick={() => setEditingTemplate(tpl)} 
                          className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl border border-transparent hover:border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all"
                          title="Chỉnh sửa"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(tpl.ma_id, tpl.ten_mau)} 
                          className="p-3 text-slate-400 hover:text-rose-600 hover:bg-white rounded-xl border border-transparent hover:border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all"
                          title="Xóa"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden divide-y divide-slate-100">
           {paginatedTemplates.map((tpl: ReportTemplate, i) => {
             const app = apps.find(a => a.ma_id === tpl.ma_ung_dung);
             return (
               <div key={i} className="p-5 hover:bg-slate-50/50 transition-colors space-y-4">
                  <div className="flex justify-between items-start">
                     <div className="space-y-1">
                        <div className="font-bold text-slate-900 text-sm tracking-tight">{tpl.ten_mau}</div>
                        <div className="flex items-center gap-2">
                           <span className="text-[9px] text-indigo-500 font-black uppercase tracking-widest">{app?.ten_ung_dung || 'N/A'}</span>
                           <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                           <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{tpl.bang_chinh}</span>
                        </div>
                     </div>
                     <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 text-[8px] font-black rounded-full uppercase tracking-widest border border-indigo-100/50">
                        {tpl.loai_file}
                     </span>
                  </div>
                  
                  <div className="bg-slate-50/50 rounded-xl p-3 border border-slate-200/40">
                     <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Token Code</p>
                     <code className="text-[10px] font-mono text-indigo-600 font-bold uppercase tracking-widest">{tpl.ma_mau}</code>
                  </div>

                  <div className="flex gap-2">
                     <button 
                      onClick={() => setEditingTemplate(tpl)}
                      className="flex-1 py-3.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] text-slate-600 flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm"
                     >
                       <Edit size={14} /> Chỉnh sửa
                     </button>
                     <button 
                      onClick={() => handleDelete(tpl.ma_id, tpl.ten_mau)}
                      className="p-3.5 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl shadow-sm"
                     >
                       <Trash2 size={16} />
                     </button>
                  </div>
               </div>
             );
           })}
        </div>

        {paginatedTemplates.length === 0 && (
          <div className="px-6 py-24 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-4 text-slate-200">
               <Filter size={32} />
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
              Hệ thống chưa có mẫu báo cáo nào
            </p>
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
