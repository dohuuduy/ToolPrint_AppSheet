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
  Filter,
  RefreshCw,
  Check
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
        const valA = (a[sortConfig.key as keyof any] || '').toString().toLowerCase();
        const valB = (b[sortConfig.key as keyof any] || '').toString().toLowerCase();
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
    <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-4">
      <RefreshCw className="animate-spin text-indigo-600" size={32} />
      <p className="text-sm font-medium">Đang nạp mẫu biểu báo cáo...</p>
    </div>
  );

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic">Mẫu <span className="text-indigo-600">Báo cáo</span></h2>
          <p className="text-slate-500 text-sm font-medium mt-1">Quản lý các tệp Word/Excel mẫu để thực hiện trộn dữ liệu.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? <X size={20} /> : <Plus size={20} />} 
          <span>{showForm ? 'Đóng Form' : 'Thêm mẫu mới'}</span>
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
               <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-50/50 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />
               
              <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                       Tên mẫu báo cáo
                    </label>
                    <input required value={newTemplate.ten_mau} onChange={handleTenMauChange} className="input-modern" placeholder="Ví dụ: Phiếu Thu - Chi" />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <div className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                       Mã Token (Slug)
                    </label>
                    <input required value={newTemplate.ma_mau} readOnly className="input-modern bg-slate-50 cursor-not-allowed font-mono text-indigo-600 hover:shadow-none" />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <div className="w-1.5 h-1.5 bg-violet-500 rounded-full" />
                       Ứng dụng AppSheet
                    </label>
                    <select 
                      required 
                      value={newTemplate.ma_ung_dung} 
                      onChange={(e) => setNewTemplate({ ...newTemplate, ma_ung_dung: e.target.value })}
                      className="input-modern appearance-none"
                    >
                      <option value="">Chọn ứng dụng kết nối...</option>
                      {apps.map(app => (
                        <option key={app.ma_id} value={app.ma_id}>{app.ten_ung_dung}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                       Tên bảng chính
                    </label>
                    <input required value={newTemplate.bang_chinh} onChange={(e) => setNewTemplate({ ...newTemplate, bang_chinh: e.target.value })} className="input-modern" placeholder="Ví dụ: KhachHang" />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                       Cột khóa chính (ID)
                    </label>
                    <input required value={newTemplate.key_col} onChange={(e) => setNewTemplate({ ...newTemplate, key_col: e.target.value })} className="input-modern" placeholder="Mặc định: ma_id" />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <div className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
                       Loại tệp mẫu
                    </label>
                    <select 
                      value={newTemplate.loai_file} 
                      onChange={(e) => setNewTemplate({ ...newTemplate, loai_file: e.target.value as any })}
                      className="input-modern appearance-none"
                    >
                      <option value="DOCX">Microsoft Word (DOCX)</option>
                      <option value="XLSX">Microsoft Excel (XLSX)</option>
                    </select>
                  </div>

                  <div className="space-y-3 lg:col-span-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                       Google Drive File ID
                    </label>
                    <input required value={newTemplate.file_id_drive} onChange={(e) => setNewTemplate({ ...newTemplate, file_id_drive: e.target.value })} className="input-modern font-mono text-xs" placeholder="Copy ID từ link Drive của tệp mẫu" />
                  </div>
                </div>

                <div className="bg-slate-50/50 p-6 md:p-10 rounded-[2rem] border border-slate-100">
                  <div className="flex items-center gap-3 mb-8">
                     <div className="p-2.5 bg-white border border-slate-200 rounded-xl shadow-sm">
                        <Database size={18} className="text-indigo-600" />
                     </div>
                     <div>
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-tighter italic leading-none">Dữ liệu quan hệ</h3>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Cấu hình bảng con (Nested List)</p>
                     </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tên bảng con</label>
                      <input value={newTemplate.child_table} onChange={(e) => setNewTemplate({ ...newTemplate, child_table: e.target.value })} className="input-modern border-white bg-white" placeholder="Ví dụ: ChiTietDonHang" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tên cột khóa ngoại</label>
                      <input value={newTemplate.foreign_key} onChange={(e) => setNewTemplate({ ...newTemplate, foreign_key: e.target.value })} className="input-modern border-white bg-white" placeholder="foreign_id" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ký hiệu biến mẫu</label>
                      <input value={newTemplate.child_name} onChange={(e) => setNewTemplate({ ...newTemplate, child_name: e.target.value })} className="input-modern border-white bg-white font-mono" placeholder="Biến lặp: items" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-10 border-t border-slate-50">
                  <button type="submit" className="btn-primary min-w-[280px]">
                    <Zap size={18} />
                    <span className="font-black uppercase tracking-widest leading-none">{editingTemplate ? 'Cập nhật mẫu biểu' : 'Kích hoạt mẫu báo cáo'}</span>
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="relative flex-1">
              <input 
                type="text" 
                placeholder="Tìm mẫu báo cáo hồ sơ..." 
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              />
              <Search size={18} className="absolute left-4 top-3 text-slate-400" />
            </div>
            <div className="flex items-center gap-3">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bộ lọc:</span>
               <select 
                 value={appFilter}
                 onChange={(e) => { setAppFilter(e.target.value); setCurrentPage(1); }}
                 className="text-xs bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold appearance-none cursor-pointer pr-10"
                 style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem' }}
               >
                 <option value="all">Tất cả ứng dụng</option>
                 {apps.map(app => (
                   <option key={app.ma_id} value={app.ma_id}>{app.ten_ung_dung}</option>
                 ))}
               </select>
            </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-white">
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer group" onClick={() => handleSort('ten_mau')}>
                   <span className="group-hover:text-indigo-600 transition-colors">Tên mẫu báo cáo</span>
                </th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Token Code</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Định dạng</th>
                <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedTemplates.map((tpl: ReportTemplate, i) => {
                const app = apps.find(a => a.ma_id === tpl.ma_ung_dung);
                return (
                  <tr key={i} className="hover:bg-slate-50/50 transition-all group">
                    <td className="px-8 py-6">
                      <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{tpl.ten_mau}</div>
                      <div className="text-[10px] text-indigo-500 font-black uppercase tracking-widest mt-1.5">{app?.ten_ung_dung || 'N/A'} • {tpl.bang_chinh}</div>
                    </td>
                    <td className="px-8 py-6">
                      <code className="text-[10px] font-mono bg-slate-100 px-2.5 py-1 rounded-lg text-slate-600 font-black border border-slate-200/50">{tpl.ma_mau}</code>
                    </td>
                    <td className="px-8 py-6">
                      <span className="badge-status bg-indigo-50 text-indigo-700 border-indigo-100">
                        {tpl.loai_file}
                      </span>
                    </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2 translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                      <button onClick={() => setEditingTemplate(tpl)} className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-2xl border border-transparent hover:border-slate-100 hover:shadow-xl transition-all" title="Sửa">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDelete(tpl.ma_id, tpl.ten_mau)} className="p-3 text-slate-400 hover:text-rose-600 hover:bg-white rounded-2xl border border-transparent hover:border-slate-100 hover:shadow-xl transition-all" title="Xóa">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {paginatedTemplates.length === 0 && (
          <div className="py-24 text-center text-slate-300">
            <Filter size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-xs font-black uppercase tracking-widest">Chưa có mẫu báo cáo nào</p>
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
