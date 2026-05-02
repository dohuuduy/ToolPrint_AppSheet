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
      <RefreshCcw className="animate-spin text-indigo-600" size={32} />
      <p className="text-sm font-medium">Đang nạp mẫu biểu báo cáo...</p>
    </div>
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Mẫu báo cáo</h2>
          <p className="text-slate-500 text-sm">Quản lý các tệp Word/Excel để trộn dữ liệu.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? <X size={18} /> : <Plus size={18} />} 
          <span>{showForm ? 'Hủy bỏ' : 'Thêm mẫu mới'}</span>
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700">Tên mẫu báo cáo</label>
                    <input required value={newTemplate.ten_mau} onChange={handleTenMauChange} className="input-modern" placeholder="Ví dụ: Hợp đồng mua bán" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700">Mã Token (Tự động)</label>
                    <input required value={newTemplate.ma_mau} readOnly className="input-modern bg-slate-50 cursor-not-allowed font-mono text-indigo-600" placeholder="MA_MAU" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700">Ứng dụng AppSheet</label>
                    <select 
                      required 
                      value={newTemplate.ma_ung_dung} 
                      onChange={(e) => setNewTemplate({ ...newTemplate, ma_ung_dung: e.target.value })}
                      className="input-modern"
                    >
                      <option value="">Chọn ứng dụng...</option>
                      {apps.map(app => (
                        <option key={app.ma_id} value={app.ma_id}>{app.ten_ung_dung}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700">Tên bảng chính</label>
                    <input required value={newTemplate.bang_chinh} onChange={(e) => setNewTemplate({ ...newTemplate, bang_chinh: e.target.value })} className="input-modern" placeholder="Ví dụ: KhachHang" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700">Cột khóa chính (Key Column)</label>
                    <input required value={newTemplate.key_col} onChange={(e) => setNewTemplate({ ...newTemplate, key_col: e.target.value })} className="input-modern" placeholder="Mặc định: ma_id" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700">ID Google Drive ID</label>
                    <input required value={newTemplate.file_id_drive} onChange={(e) => setNewTemplate({ ...newTemplate, file_id_drive: e.target.value })} className="input-modern font-mono" placeholder="ID tệp mẫu" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700">Loại tệp</label>
                    <select 
                      value={newTemplate.loai_file} 
                      onChange={(e) => setNewTemplate({ ...newTemplate, loai_file: e.target.value as any })}
                      className="input-modern"
                    >
                      <option value="DOCX">Microsoft Word (DOCX)</option>
                      <option value="XLSX">Microsoft Excel (XLSX)</option>
                    </select>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-6">
                  <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Database size={16} className="text-indigo-600" />
                    Bảng con (Dành cho Danh sách/Chi tiết)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5 text-xs">
                      <label className="font-semibold text-slate-700">Tên bảng con</label>
                      <input value={newTemplate.child_table} onChange={(e) => setNewTemplate({ ...newTemplate, child_table: e.target.value })} className="input-modern" placeholder="ChiTietDonHang" />
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <label className="font-semibold text-slate-700">Khóa ngoại</label>
                      <input value={newTemplate.foreign_key} onChange={(e) => setNewTemplate({ ...newTemplate, foreign_key: e.target.value })} className="input-modern" placeholder="ma_id_cha" />
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <label className="font-semibold text-slate-700">Tên biến Template</label>
                      <input value={newTemplate.child_name} onChange={(e) => setNewTemplate({ ...newTemplate, child_name: e.target.value })} className="input-modern" placeholder="items" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <button type="submit" className="btn-primary px-10">
                    {editingTemplate ? 'Cập nhật mẫu' : 'Lưu mẫu biểu'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <input 
              type="text" 
              placeholder="Tìm tên mẫu..." 
              className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-indigo-500/20"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
          </div>
          <select 
            value={appFilter}
            onChange={(e) => { setAppFilter(e.target.value); setCurrentPage(1); }}
            className="text-xs bg-white border border-slate-300 rounded-lg px-3 py-1.5 outline-none"
          >
            <option value="all">Tất cả ứng dụng</option>
            {apps.map(app => (
              <option key={app.ma_id} value={app.ma_id}>{app.ten_ung_dung}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto text-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest cursor-pointer" onClick={() => handleSort('ten_mau')}>Tên mẫu</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest">Token</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest">Định dạng</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-widest">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedTemplates.map((tpl: ReportTemplate, i) => {
                const app = apps.find(a => a.ma_id === tpl.ma_ung_dung);
                return (
                  <tr key={i} className="hover:bg-slate-50 transition-all">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{tpl.ten_mau}</div>
                      <div className="text-[10px] text-indigo-600 font-medium mt-0.5">{app?.ten_ung_dung || 'N/A'} • {tpl.bang_chinh}</div>
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">{tpl.ma_mau}</code>
                    </td>
                    <td className="px-6 py-4 text-slate-600 capitalize">
                      <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-500">
                        {tpl.loai_file}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => setEditingTemplate(tpl)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="Sửa">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(tpl.ma_id, tpl.ten_mau)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all" title="Xóa">
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
        
        {paginatedTemplates.length === 0 && (
          <div className="py-20 text-center text-slate-400">
            <p>Không có mẫu báo cáo nào.</p>
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
