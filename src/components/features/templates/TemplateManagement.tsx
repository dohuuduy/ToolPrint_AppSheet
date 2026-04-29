import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  Search, 
  Plus, 
  X, 
  Zap, 
  HelpCircle, 
  Edit, 
  Trash2, 
  ChevronUp, 
  ChevronDown,
  Database,
  ArrowRight,
  FileCode,
  Layers,
  Link as LinkIcon,
  HardDrive,
  CheckCircle2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAppStore } from '../../../store/use-app-store';
import { api } from '../../../services/api.service';
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
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize] = React.useState(10);
  const [sortConfig, setSortConfig] = React.useState({ key: 'ten_mau', direction: 'asc' });

  React.useEffect(() => {
    fetchTemplates();
    fetchApps();
  }, [fetchTemplates, fetchApps]);

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
    let result = templates.filter((tpl: ReportTemplate) => 
      (tpl.ten_mau || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tpl.ma_mau || '').toLowerCase().includes(searchTerm.toLowerCase())
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
  }, [templates, searchTerm, sortConfig]);

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
    <div className="flex flex-col items-center justify-center p-20 gap-4">
      <div className="relative">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600/20 border-t-indigo-600"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <FileText size={16} className="text-indigo-600 animate-pulse" />
        </div>
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Truy xuất thư viện mẫu...</p>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header section with Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-2">
             <div className="w-8 h-8 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 border border-indigo-100">
               <FileText size={16} />
             </div>
             <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Library Manager</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Mẫu báo cáo</h2>
          <p className="text-slate-500 font-medium text-sm mt-1 max-w-md">Quản lý các tài liệu mẫu Word/Excel tích hợp với Google Drive.</p>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="px-5 py-3 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-1 leading-none">Mẫu biểu</span>
              <span className="text-xl font-black text-slate-900 leading-none">{templates.length}</span>
           </div>
           <button 
             onClick={() => { setShowForm(true); setEditingTemplate(null); }} 
             className="px-6 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-black transition-all flex items-center gap-3 shadow-xl shadow-slate-200"
           >
             <Plus size={20} />
             THÊM MẪU MỚI
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
                    <FileCode size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">
                      {editingTemplate ? 'Hiệu chỉnh mẫu biểu' : 'Khai báo mẫu mới'}
                    </h3>
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Template Configuration Portal</p>
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
                       <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Thông tin cơ bản</h4>
                    </div>
                    
                    <div className="group space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 ml-1 group-focus-within:text-indigo-600 transition-colors">
                        Tên mẫu báo cáo
                      </label>
                      <input 
                        required 
                        value={newTemplate.ten_mau} 
                        onChange={handleTenMauChange} 
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300" 
                        placeholder="Ví dụ: Hợp đồng mua bán" 
                      />
                    </div>

                    <div className="group space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 ml-1 group-focus-within:text-indigo-600 transition-colors">
                        Token (Mã sử dụng API)
                      </label>
                      <div className="relative">
                         <Zap size={16} className="absolute left-6 top-5 text-indigo-400" />
                         <input 
                          readOnly 
                          value={newTemplate.ma_mau} 
                          className="w-full pl-14 pr-6 py-4 bg-slate-100 border border-slate-200 rounded-2xl font-mono text-indigo-600 font-bold outline-none cursor-not-allowed" 
                          placeholder="AUTO_GENERATED_TOKEN" 
                        />
                      </div>
                    </div>

                    <div className="group space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 ml-1 group-focus-within:text-indigo-600 transition-colors">
                        Google Drive File ID
                      </label>
                      <div className="relative">
                         <HardDrive size={16} className="absolute left-6 top-5 text-slate-300" />
                         <input 
                          required 
                          value={newTemplate.file_id_drive} 
                          onChange={(e) => setNewTemplate({ ...newTemplate, file_id_drive: e.target.value })}
                          className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-mono text-xs font-bold" 
                          placeholder="Dán ID tệp tài liệu mẫu..." 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Loại tệp</label>
                          <select 
                            value={newTemplate.loai_file} 
                            onChange={(e) => setNewTemplate({ ...newTemplate, loai_file: e.target.value as any })}
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 outline-none focus:border-indigo-500 transition-all cursor-pointer"
                          >
                            <option value="DOCX">Microsoft Word</option>
                            <option value="XLSX">Microsoft Excel</option>
                          </select>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ứng dụng nguồn</label>
                          <select 
                            required 
                            value={newTemplate.ma_ung_dung} 
                            onChange={(e) => setNewTemplate({ ...newTemplate, ma_ung_dung: e.target.value })}
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 outline-none focus:border-indigo-500 transition-all cursor-pointer"
                          >
                            <option value="">Chọn app...</option>
                            {apps.map(app => (
                              <option key={app.ma_id} value={app.ma_id}>{app.ten_ung_dung}</option>
                            ))}
                          </select>
                       </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                       <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                       <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Ràng buộc dữ liệu (Schema)</h4>
                    </div>

                    <div className="group space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 ml-1 group-focus-within:text-emerald-600 transition-colors">
                        Table Name (Bảng Header)
                      </label>
                      <input 
                        required 
                        value={newTemplate.bang_chinh} 
                        onChange={(e) => setNewTemplate({ ...newTemplate, bang_chinh: e.target.value })}
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold text-slate-700" 
                        placeholder="VD: Invoices / Orders" 
                      />
                    </div>

                    <div className="p-6 bg-slate-900 rounded-[2rem] text-white space-y-4 mb-4">
                       <div className="flex items-center gap-2">
                         <Layers size={16} className="text-indigo-400" />
                         <span className="text-[11px] font-black uppercase tracking-widest">Cấu trúc Master-Detail</span>
                       </div>
                       <div className="space-y-4 pt-2">
                          <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-1">
                                <label className="text-[9px] font-black text-slate-500 uppercase">Bảng con (Lines)</label>
                                <input 
                                  value={newTemplate.child_table} 
                                  onChange={(e) => setNewTemplate({ ...newTemplate, child_table: e.target.value })}
                                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-white outline-none focus:border-indigo-500" 
                                  placeholder="ChiTietDonHang" 
                                />
                             </div>
                             <div className="space-y-1">
                                <label className="text-[9px] font-black text-slate-500 uppercase">Khóa ngoại</label>
                                <input 
                                  value={newTemplate.foreign_key} 
                                  onChange={(e) => setNewTemplate({ ...newTemplate, foreign_key: e.target.value })}
                                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-white outline-none focus:border-indigo-500" 
                                  placeholder="order_id" 
                                />
                             </div>
                          </div>
                          <div className="space-y-1">
                             <label className="text-[9px] font-black text-slate-500 uppercase">Biến trỏ (Template variable)</label>
                             <div className="relative">
                               <LinkIcon size={12} className="absolute left-4 top-3.5 text-indigo-400" />
                               <input 
                                  value={newTemplate.child_name} 
                                  onChange={(e) => setNewTemplate({ ...newTemplate, child_name: e.target.value })}
                                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-white outline-none focus:border-indigo-500" 
                                  placeholder="Mặc định: items" 
                                />
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="flex gap-4 items-start p-4 bg-amber-50/50 rounded-2xl border border-amber-100">
                      <HelpCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                      <p className="text-[11px] text-amber-900 leading-relaxed font-bold italic">
                        Trong Word/Excel, dùng biến {`{field_name}`} cho bảng chính và {`{items.field_name}`} trong vòng lặp cho bảng con.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-end items-center gap-4">
                  <button 
                    onClick={() => setShowForm(false)}
                    className="w-full md:w-auto px-8 py-4 text-slate-400 font-black text-sm uppercase tracking-widest hover:text-slate-600"
                  >
                    ĐÓNG
                  </button>
                  <button 
                    onClick={handleSubmit}
                    className="w-full md:w-auto px-12 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 active:scale-95"
                  >
                    {editingTemplate ? 'LƯU THAY ĐỔI' : 'PHÁT HÀNH MẪU'}
                  </button>
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
                <Layers size={16} className="text-indigo-600" />
                Danh mục thiết kế
              </h3>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight mt-1">Đã cấu hình {templates.length} mẫu báo cáo</p>
           </div>
           
           <div className="relative">
             <Search size={16} className="absolute left-4 top-3.5 text-slate-400" />
             <input 
               type="text" 
               placeholder="Tìm theo tên hoặc mã..." 
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
                <th className="px-8 py-5 group cursor-pointer hover:text-slate-900" onClick={() => handleSort('ten_mau')}>
                   <div className="flex items-center gap-2">
                     THIẾT KẾ & PHÂN LOẠI
                     {sortConfig.key === 'ten_mau' && (
                       sortConfig.direction === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                     )}
                   </div>
                </th>
                <th className="px-8 py-5 hidden md:table-cell">APPLICATION SOURCE</th>
                <th className="px-8 py-5 hidden lg:table-cell">LƯU TRỮ DRIVE</th>
                <th className="px-8 py-5">ĐỊNH DẠNG</th>
                <th className="px-8 py-5 text-right">HÀNH ĐỘNG</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedTemplates.map((tpl: ReportTemplate, i) => {
                const app = apps.find(a => a.ma_id === tpl.ma_ung_dung);
                return (
                  <tr key={i} className="group transition-all hover:bg-slate-50/50">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                         <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-black/10 ${
                           tpl.loai_file === 'DOCX' ? 'bg-indigo-600' : 'bg-emerald-600'
                         }`}>
                           {tpl.loai_file === 'DOCX' ? <FileText size={20} /> : <Database size={20} />}
                         </div>
                         <div className="min-w-0">
                            <p className="text-base font-black text-slate-900 tracking-tight truncate group-hover:text-indigo-600 transition-colors">
                              {tpl.ten_mau}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                               <Zap size={10} className="text-indigo-400" />
                               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{tpl.ma_mau}</span>
                            </div>
                         </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 hidden md:table-cell">
                      <div className="space-y-1">
                        <p className="text-[11px] font-black text-slate-900 uppercase">{app?.ten_ung_dung || 'N/A'}</p>
                        <div className="flex items-center gap-1.5 grayscale opacity-50">
                           <Database size={10} />
                           <span className="text-[10px] font-bold uppercase tracking-tighter">{tpl.bang_chinh}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 hidden lg:table-cell">
                       <div className="flex flex-col">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Reference ID</span>
                          <code className="text-[9px] font-mono font-bold text-slate-500 break-all max-w-[120px] truncate">{tpl.file_id_drive}</code>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-xl border w-fit ${
                         tpl.loai_file === 'DOCX' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                       }`}>
                         {tpl.loai_file}
                       </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => setEditingTemplate(tpl)}
                            className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50 transition-all"
                            title="Hiệu chỉnh"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(tpl.ma_id, tpl.ten_mau)}
                            className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-rose-600 hover:border-rose-100 hover:bg-rose-50 transition-all"
                            title="Gỡ bỏ"
                          >
                            <Trash2 size={16} />
                          </button>
                          <div className="hidden sm:block">
                             <div className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-emerald-500 opacity-0 group-hover:opacity-100 transition-all">
                               <CheckCircle2 size={18} />
                             </div>
                          </div>
                       </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Custom Pagination */}
        {totalPages > 1 && (
          <div className="p-8 bg-slate-50/50 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
             <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
               Hiển thị {paginatedTemplates.length} trên {filteredTemplates.length} thiết kế
             </div>
             <div className="flex gap-2">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                  className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-900 disabled:opacity-30 transition-all"
                >
                  <ChevronLeft size={16} />
                </button>
                <div className="flex items-center px-4 bg-white border border-slate-100 rounded-xl text-xs font-black text-slate-900">
                   {currentPage} / {totalPages}
                </div>
                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                  className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-900 disabled:opacity-30 transition-all"
                >
                  <ChevronRight size={16} />
                </button>
             </div>
          </div>
        )}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && !loading && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          className="bg-white p-20 rounded-[3rem] border border-dashed border-slate-200 text-center flex flex-col items-center gap-6"
        >
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 border-2 border-dashed border-slate-100">
            <FileText size={32} />
          </div>
          <div className="max-w-xs mx-auto">
            <p className="text-lg font-black text-slate-900 tracking-tight mb-2 uppercase tracking-widest"> Thư viện trống</p>
            <p className="text-slate-400 font-medium text-sm">Vui lòng tải lên tài liệu mẫu word/excel đầu tiên để bắt đầu hệ thống.</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};
