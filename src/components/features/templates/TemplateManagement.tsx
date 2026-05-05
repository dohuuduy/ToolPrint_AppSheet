import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  Search, 
  Plus, 
  X, 
  Info, 
  HelpCircle, 
  Edit, 
  Eye, 
  Trash2, 
  ChevronUp, 
  ChevronDown,
  Database,
  ArrowRight,
  Grid
} from 'lucide-react';
import { useAppStore } from '../../../store/use-app-store';
import { api } from '../../../services/api.service';
import { Pagination } from '../../ui/Pagination';
import { DetailModal } from '../../ui/DetailModal';
import { ReportTemplate } from '../../../types';

export const TemplateManagement: React.FC = () => {
  const { apps, templates, loading, fetchTemplates, fetchApps } = useAppStore();
  const [showForm, setShowForm] = React.useState(false);
  const [editingTemplate, setEditingTemplate] = React.useState<ReportTemplate | null>(null);
  const [viewingTemplate, setViewingTemplate] = React.useState<ReportTemplate | null>(null);
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
        const valA = (String(a[sortConfig.key as keyof ReportTemplate] || '')).toLowerCase();
        const valB = (String(b[sortConfig.key as keyof ReportTemplate] || '')).toLowerCase();
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
      <p className="text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">Đang nạp dữ liệu mẫu biểu...</p>
    </div>
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20 px-4 sm:px-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 font-vietnam">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Mẫu báo cáo</h2>
          <p className="text-slate-500 font-medium text-sm mt-1">Thiết lập cấu trúc trộn dữ liệu từ AppSheet vào tệp Word/Excel.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="relative">
            <select 
              value={appFilter}
              onChange={(e) => { setAppFilter(e.target.value); setCurrentPage(1); }}
              className="w-full pl-4 pr-12 py-3.5 bg-white border border-indigo-50 rounded-2xl text-[10px] font-black uppercase tracking-widest focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-lg shadow-indigo-100/30 outline-none appearance-none cursor-pointer text-indigo-600"
            >
              <option value="all">🌐 Tất cả ứng dụng</option>
              {apps.map(app => (
                <option key={app.ma_id} value={app.ma_id}>{app.ten_ung_dung}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none" />
          </div>
          <button onClick={() => { setShowForm(!showForm); setEditingTemplate(null); }} className="px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-200">
            {showForm ? <X size={18} /> : <Plus size={18} />} 
            <span>{showForm ? 'Đóng Form' : 'Tạo Template'}</span>
          </button>
        </div>
      </div>

      <div className="relative group">
        <input 
          type="text" 
          placeholder="Tìm tên mẫu biểu hoặc token liên kết..." 
          className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium shadow-sm"
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
        />
        <Search size={22} className="absolute left-5 top-4 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-2xl shadow-slate-200/40 font-vietnam relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600" />
               <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50 pointer-events-none" />

              <form onSubmit={handleSubmit} className="relative space-y-12">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                      {editingTemplate ? 'Hiệu chỉnh Template' : 'Thiết lập Template mới'}
                    </h3>
                    <p className="text-slate-500 font-medium text-sm mt-1">Cấu hình các tham số ánh xạ để hệ thống trộn dữ liệu chính xác.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                  <div className="lg:col-span-12 space-y-8">
                    <div className="flex items-center gap-3">
                       <div className="w-1.5 h-6 bg-indigo-600 rounded-full" />
                       <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">A. Thông tin định danh</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block ml-1">Ứng dụng mục tiêu</label>
                        <select 
                          required 
                          value={newTemplate.ma_ung_dung} 
                          onChange={(e) => setNewTemplate({ ...newTemplate, ma_ung_dung: e.target.value })}
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all shadow-sm"
                        >
                          <option value="">-- Chọn App --</option>
                          {apps.map(app => (
                            <option key={app.ma_id} value={app.ma_id}>{app.ten_ung_dung}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block ml-1">Tên mẫu báo cáo</label>
                        <input required value={newTemplate.ten_mau} onChange={handleTenMauChange} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all shadow-sm" placeholder="VD: Hợp đồng đại lý" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block ml-1">Mã Token liên kết</label>
                        <input required value={newTemplate.ma_mau} readOnly className="w-full px-6 py-4 bg-slate-100 border border-slate-200 rounded-2xl font-mono text-indigo-600 font-bold outline-none cursor-default shadow-inner" placeholder="TỰ_ĐỘNG" />
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-8 space-y-8">
                    <div className="flex items-center gap-3">
                       <div className="w-1.5 h-6 bg-emerald-600 rounded-full" />
                       <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">B. Ánh xạ dữ liệu & File</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block ml-1">Tên bảng chính (AppSheet)</label>
                        <input required value={newTemplate.bang_chinh} onChange={(e) => setNewTemplate({ ...newTemplate, bang_chinh: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 outline-none focus:border-indigo-500 transition-all shadow-sm" placeholder="VD: Khach_Hang" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block ml-1">Cột khóa (External ID)</label>
                        <input required value={newTemplate.key_col} onChange={(e) => setNewTemplate({ ...newTemplate, key_col: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 outline-none focus:border-indigo-500 transition-all shadow-sm" placeholder="Mặc định: ma_id" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block ml-1">Google Drive File ID</label>
                        <input required value={newTemplate.file_id_drive} onChange={(e) => setNewTemplate({ ...newTemplate, file_id_drive: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-xs font-bold text-slate-700 outline-none focus:border-indigo-500 transition-all shadow-sm" placeholder="ID từ URL Google Drive..." />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block ml-1">Định dạng File mẫu</label>
                        <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1 border border-slate-200">
                           <button type="button" onClick={() => setNewTemplate({...newTemplate, loai_file: 'DOCX'})} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${newTemplate.loai_file === 'DOCX' ? 'bg-white text-indigo-600 shadow-sm border border-indigo-100' : 'text-slate-400 hover:text-slate-600'}`}>Word (DOCX)</button>
                           <button type="button" onClick={() => setNewTemplate({...newTemplate, loai_file: 'XLSX'})} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${newTemplate.loai_file === 'XLSX' ? 'bg-white text-emerald-600 shadow-sm border border-emerald-100' : 'text-slate-400 hover:text-slate-600'}`}>Excel (XLSX)</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-4 space-y-8">
                    <div className="flex items-center gap-3">
                       <div className="w-1.5 h-6 bg-amber-600 rounded-full" />
                       <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">C. Cấu hình bảng con</h4>
                    </div>
                    <div className="space-y-4">
                       <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-6">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.1em] block">Tên bảng con (Optional)</label>
                            <input value={newTemplate.child_table} onChange={(e) => setNewTemplate({ ...newTemplate, child_table: e.target.value })} className="w-full px-5 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-indigo-500 transition-all shadow-sm" placeholder="VD: Order_Lines" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.1em] block">Khóa ngoại (Join Key)</label>
                            <input value={newTemplate.foreign_key} onChange={(e) => setNewTemplate({ ...newTemplate, foreign_key: e.target.value })} className="w-full px-5 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-indigo-500 transition-all shadow-sm" placeholder="VD: parent_id" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.1em] block">Biến lặp (Mặc định: items)</label>
                            <input value={newTemplate.child_name} onChange={(e) => setNewTemplate({ ...newTemplate, child_name: e.target.value })} className="w-full px-5 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-indigo-500 transition-all shadow-sm" placeholder="Sử dụng trong Template" />
                          </div>
                       </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-10 border-t border-slate-100">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                        <HelpCircle size={20} />
                     </div>
                     <div className="space-y-0.5">
                       <p className="text-[11px] font-black text-slate-900 uppercase tracking-wider">Hướng dẫn template</p>
                       <p className="text-[10px] text-slate-500 font-medium leading-relaxed">Hãy nhớ dùng `&#123;&#123;ten_cot&#125;&#125;` trong file mẫu của bạn.</p>
                     </div>
                  </div>
                  
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <button type="button" onClick={() => setShowForm(false)} className="px-8 py-4 bg-slate-100 text-slate-600 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-all shadow-sm">
                      Đóng lại
                    </button>
                    <button type="submit" className="flex-1 sm:flex-none px-12 py-4 bg-indigo-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 scale-100 active:scale-95 flex items-center justify-center gap-2">
                      Lưu thông tin Template <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden font-vietnam">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th 
                  className="px-8 py-5 text-left cursor-pointer group select-none transition-colors hover:bg-slate-100/50"
                  onClick={() => handleSort('ten_mau')}
                >
                   <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider group-hover:text-indigo-600 transition-colors">Tên mẫu báo cáo</span>
                    {sortConfig.key === 'ten_mau' && (
                      <span className="text-indigo-500">
                        {sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-8 py-5 text-left cursor-pointer group select-none transition-colors hover:bg-slate-100/50"
                  onClick={() => handleSort('ma_mau')}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider group-hover:text-indigo-600 transition-colors">Mã Token liên kết</span>
                    {sortConfig.key === 'ma_mau' && (
                      <span className="text-indigo-500">
                        {sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </span>
                    )}
                  </div>
                </th>
                <th className="px-8 py-5 text-left">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Loại File & Bảng</span>
                </th>
                <th className="px-8 py-5 text-right">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Tác vụ</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedTemplates.map((tpl: ReportTemplate, i) => {
                const app = apps.find(a => a.ma_id === tpl.ma_ung_dung);
                return (
                  <tr key={i} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="font-black text-slate-900 text-sm tracking-tight group-hover:text-indigo-600 transition-colors underline decoration-transparent group-hover:decoration-indigo-200 underline-offset-4">{tpl.ten_mau}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1.5 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                        {app?.ten_ung_dung || 'N/A'}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <code className="text-[10px] font-mono px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100/50 font-black uppercase tracking-tight">{tpl.ma_mau}</code>
                    </td>
                    <td className="px-8 py-6 text-xs">
                      <div className="flex flex-col gap-1.5">
                        <span className={`inline-flex items-center w-fit px-2 py-0.5 rounded-md text-[9px] font-black tracking-widest uppercase border ${
                          tpl.loai_file === 'DOCX' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                        }`}>
                          {tpl.loai_file}
                        </span>
                        <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px] uppercase">
                          <Grid size={12} className="text-slate-300" /> {tpl.bang_chinh}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
                         <button 
                          onClick={() => setViewingTemplate(tpl)} 
                          className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
                          title="Chi tiết ánh xạ"
                         >
                          <Eye size={18} />
                         </button>
                         <button 
                          onClick={() => setEditingTemplate(tpl)} 
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                          title="Chỉnh sửa cấu hình"
                         >
                          <Edit size={18} />
                         </button>
                         <button 
                          onClick={() => handleDelete(tpl.ma_id, tpl.ten_mau)} 
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                          title="Xóa mẫu báo cáo"
                         >
                          <Trash2 size={18} />
                         </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {paginatedTemplates.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-8 py-32 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200">
                        <FileText size={32} />
                      </div>
                      <p className="text-xs text-slate-400 font-black uppercase tracking-[0.2em]">Danh sách trống</p>
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
        isOpen={!!viewingTemplate}
        onClose={() => setViewingTemplate(null)}
        title="Cấu hình Template"
        subtitle={viewingTemplate?.ten_mau}
        icon={<FileText size={24} />}
        fields={[
          { label: 'Tên mẫu báo cáo', value: viewingTemplate?.ten_mau },
          { label: 'Token liên kết', value: viewingTemplate?.ma_mau, isMono: true },
          { label: 'Ứng dụng liên kết', value: apps.find(a => a.ma_id === viewingTemplate?.ma_ung_dung)?.ten_ung_dung },
          { label: 'Bảng dữ liệu chính', value: viewingTemplate?.bang_chinh },
          { label: 'Cột khóa chính', value: viewingTemplate?.key_col },
          { label: 'File ID (Drive)', value: viewingTemplate?.file_id_drive, isMono: true },
          { label: 'Loại tệp', value: viewingTemplate?.loai_file },
          { label: 'Bảng phụ (Sub-table)', value: viewingTemplate?.child_table || 'Không có' },
          { label: 'Khóa ngoại (Join ID)', value: viewingTemplate?.foreign_key || 'N/A' },
          { label: 'Biến lặp (Loop)', value: viewingTemplate?.child_name || 'items' }
        ]}
      />
    </div>
  );
};
