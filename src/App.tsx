import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useSearchParams, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Settings, 
  FileText, 
  History, 
  Grid, 
  Printer,
  LogOut,
  Zap,
  Copy,
  Trash2,
  Eye,
  Edit,
  ExternalLink,
  User as UserIcon,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  Search,
  Plus,
  X,
  Check,
  Info,
  HelpCircle,
  Database
} from 'lucide-react';

import { 
  generateSampleExcel,
  generateSampleWord
} from './utils/sampleTemplateGenerator';

// Pages
const Dashboard = () => {
  const [data, setData] = React.useState({ apps: [], templates: [], logs: [] });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [apps, templates, logs] = await Promise.all([
          fetch('/api/db/ung_dung', { credentials: 'include' }).then(res => res.json()),
          fetch('/api/db/mau_bieu', { credentials: 'include' }).then(res => res.json()),
          fetch('/api/db/nhat_ky_in', { credentials: 'include' }).then(res => res.json())
        ]);
        
        const normalizedApps = (Array.isArray(apps) ? apps : []).map((app: any) => ({
          ...app,
          ten_app: app.ten_ung_dung || app.ten_app,
          api_key: app.khoa_api || app.api_key,
          bang_chinh: app.bang_chinh || 'Khach'
        }));

        setData({ 
          apps: normalizedApps, 
          templates: Array.isArray(templates) ? templates : [], 
          logs: Array.isArray(logs) ? logs : [] 
        });
      } catch (err) {
        console.error('Fetch Dashboard Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 gap-4">
      <div className="animate-spin rounded-2xl h-10 w-10 border-4 border-indigo-600 border-t-transparent shadow-lg"></div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Đang đồng bộ dữ liệu...</p>
    </div>
  );

  if (!data.apps.length && !data.templates.length && !data.logs.length) {
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-6 text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-300">
          <Database size={40} />
        </div>
        <div className="max-w-md">
          <h3 className="text-xl font-black text-slate-900 mb-2">Hệ thống chưa có dữ liệu</h3>
          <p className="text-sm text-slate-500 font-medium mb-6">Bạn cần cấu hình ứng dụng và mẫu báo cáo đầu tiên. Nếu đây là lần đầu chạy, hãy vào phần Cấu hình hệ thống.</p>
          <div className="flex justify-center gap-3">
             <Link to="/apps" className="btn-primary">Kết nối AppSheet</Link>
             <Link to="/settings" className="btn-secondary">Cài đặt Hub</Link>
          </div>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Tổng ứng dụng', value: data.apps.length, icon: Grid, color: 'bg-indigo-500', trend: 'Hoạt động' },
    { label: 'Mẫu báo cáo', value: data.templates.length, icon: FileText, color: 'bg-emerald-500', trend: 'Sẵn sàng' },
    { label: 'Lượt in tháng', value: data.logs.length, icon: Printer, color: 'bg-amber-500', trend: '+12% so với tháng trước' },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Chào buổi sáng! 👋</h2>
          <p className="text-slate-500 font-medium">Đây là những gì đang diễn ra với hệ thống in ấn của bạn.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl border border-slate-200 shadow-sm">
           <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
           <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Hệ thống: Online</span>
        </div>
      </div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card-premium p-6 group cursor-default"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                  <Icon size={24} />
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.trend}</div>
              </div>
              <div className="text-4xl font-black text-slate-900 mb-1">{stat.value}</div>
              <div className="text-sm font-bold text-slate-500 tracking-tight">{stat.label}</div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-12 gap-6 pb-20">
        {/* Recent Activity */}
        <div className="col-span-12 lg:col-span-7 space-y-6">
          <div className="card-premium overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center group">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] group-hover:text-indigo-600 transition-colors">Nhật ký in gần đây</h3>
              <Link to="/logs" className="p-2 hover:bg-slate-50 rounded-xl transition-colors"><ChevronRight size={18} className="text-slate-400" /></Link>
            </div>
            <div className="p-2">
              <div className="space-y-1">
                {data.logs.length > 0 ? data.logs.slice(0, 5).map((log: any, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-all group">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-indigo-600 transition-colors shadow-sm">
                      <FileText size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate">{log.ten_mau}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: {log.ma_id}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-black text-indigo-600">{new Date(log.ngay_tao).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(log.ngay_tao).toLocaleDateString('vi-VN')}</p>
                    </div>
                  </div>
                )) : (
                  <div className="py-20 text-center text-slate-300 italic border-2 border-dashed border-slate-100 rounded-2xl mx-4 my-2">Lịch sử trống</div>
                )}
              </div>
            </div>
            {data.logs.length > 5 && (
              <div className="p-4 bg-slate-50 text-center">
                 <Link to="/logs" className="text-[10px] font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-[0.2em]">Xem tất cả hoạt động</Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Links / Guide */}
        <div className="col-span-12 lg:col-span-5 space-y-6">
           <div className="card-premium bg-slate-900 border-0 p-8 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
                <Zap size={140} className="fill-white" />
              </div>
              <h3 className="text-xl font-black mb-6 relative z-10 tracking-tight">Thiết lập Action 🚀</h3>
              <div className="space-y-6 relative z-10">
                <div className="p-5 bg-white/5 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-colors">
                  <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mb-3">Formula AppSheet:</p>
                  <code className="text-[11px] font-mono leading-relaxed break-all select-all block text-slate-300">
                    {`CONCATENATE("${window.location.origin}/report?template=ID_MAU&id=", ENCODEURL([MA_ID]))`}
                  </code>
                </div>
                <div className="flex gap-4 items-center">
                  <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">
                    <HelpCircle size={20} />
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-bold">
                    Dán URL này vào phần <span className="text-white">Behavior {'>'} Actions</span> trong AppSheet Editor của bạn.
                  </p>
                </div>
              </div>
           </div>

           <div className="card-premium p-6">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Trạng thái kết nối</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors cursor-default">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-sm font-bold text-slate-700">Google Sheets DB</span>
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Đã kết nối</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors cursor-default">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                    <span className="text-sm font-bold text-slate-700">Google Drive API</span>
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sẵn sàng</span>
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const AppManagement = () => {
  const [apps, setApps] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [showForm, setShowForm] = React.useState(false);
  const [editingApp, setEditingApp] = React.useState<any>(null);
  const [newApp, setNewApp] = React.useState({ 
    ten_ung_dung: '', 
    app_id: '', 
    khoa_api: '',
    folder_mau_id: '',
    folder_xuat_id: '',
    bang_chinh: 'KhachHang'
  });
  const [testingConnection, setTestingConnection] = React.useState(false);

  const testConnection = async () => {
    if (!newApp.app_id || !newApp.khoa_api || !newApp.bang_chinh) {
      alert('Vui lòng nhập App ID, API Key và Tên bảng chính để test.');
      return;
    }
    setTestingConnection(true);
    try {
      const res = await fetch('/api/appsheet/columns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appId: newApp.app_id,
          apiKey: newApp.khoa_api,
          tableName: newApp.bang_chinh
        }),
        credentials: 'include'
      });
      if (res.ok) {
        const cols = await res.json();
        if (cols && cols.length > 0) {
          alert(`Kết nối thành công! Tìm thấy bảng ${newApp.bang_chinh} với ${cols.length} cột.`);
        } else {
          alert(`Kết nối thành công nhưng bảng ${newApp.bang_chinh} không có dữ liệu để xác định cột.`);
        }
      } else {
        const err = await res.json();
        alert(`Kết nối thất bại: ${err.error || 'Lỗi không xác định'}`);
      }
    } catch (err) {
      alert('Lỗi kết nối máy chủ khi test.');
    } finally {
      setTestingConnection(false);
    }
  };
  const [searchTerm, setSearchTerm] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize] = React.useState(10);
  const [sortConfig, setSortConfig] = React.useState({ key: 'ten_ung_dung', direction: 'asc' });

  const [viewingApp, setViewingApp] = React.useState<any>(null);
  const [managingFilesForApp, setManagingFilesForApp] = React.useState<any>(null);

  const fetchApps = async () => {
    try {
      const res = await fetch('/api/db/ung_dung', { credentials: 'include' });
      const data = await res.json();
      setApps(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => { fetchApps(); }, []);

  const handleSort = (key: string) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedApps = React.useMemo(() => {
    let sortableItems = [...apps];
    if (sortConfig.key) {
      sortableItems.sort((a: any, b: any) => {
        const valA = (a[sortConfig.key] || '').toString().toLowerCase();
        const valB = (b[sortConfig.key] || '').toString().toLowerCase();
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [apps, sortConfig]);

  const filteredApps = React.useMemo(() => {
    return sortedApps.filter((app: any) => 
      (app.ten_ung_dung || app.ten_app || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.app_id || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sortedApps, searchTerm]);

  const paginatedApps = React.useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredApps.slice(startIndex, startIndex + pageSize);
  }, [filteredApps, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredApps.length / pageSize);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa cấu hình ứng dụng "${name}"?`)) return;
    try {
      const res = await fetch(`/api/db/ung_dung/${id}`, { method: 'DELETE', credentials: 'include' });
      if (res.ok) {
        fetchApps();
      } else {
        const err = await res.json();
        alert(`Lỗi: ${err.error || 'Không thể xóa'}`);
      }
    } catch (err) {
      alert('Lỗi kết nối khi xóa');
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (editingApp) {
        const res = await fetch(`/api/db/ung_dung/${editingApp.ma_id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...newApp }),
          credentials: 'include'
        });
        if (res.ok) {
          setShowForm(false);
          setEditingApp(null);
          setNewApp({ 
            ten_ung_dung: '', 
            app_id: '', 
            khoa_api: '',
            folder_mau_id: '',
            folder_xuat_id: ''
          });
          fetchApps();
        }
      } else {
        const res = await fetch('/api/db/ung_dung', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...newApp, ma_id: `APP_${Date.now()}`, trang_thai: 'Hoạt động' }),
          credentials: 'include'
        });
        if (res.ok) {
          setShowForm(false);
          setNewApp({ 
            ten_ung_dung: '', 
            app_id: '', 
            khoa_api: '',
            folder_mau_id: '',
            folder_xuat_id: ''
          });
          fetchApps();
        }
      }
    } catch (err) {
      alert('Lỗi lưu cấu hình ứng dụng');
    }
  };

  const startEdit = (app: any) => {
    setEditingApp(app);
    setNewApp({
      ten_ung_dung: app.ten_ung_dung || app.ten_app || '',
      app_id: app.app_id || '',
      khoa_api: app.khoa_api || app.api_key || '',
      folder_mau_id: app.folder_mau_id || '',
      folder_xuat_id: app.folder_xuat_id || ''
    });
    setShowForm(true);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-32 text-slate-400 gap-4">
      <div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin shadow-lg shadow-indigo-100"></div>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">Phân tích hệ thống ứng dụng...</p>
    </div>
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Cấu hình Ứng dụng</h2>
          <p className="text-slate-500 font-medium">Kết nối và quản lý các cổng API AppSheet của bạn.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group hidden sm:block">
            <input 
              type="text" 
              placeholder="Lọc ứng dụng..." 
              className="pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all w-72 font-medium"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
            <Search size={18} className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
          </div>
          <button 
            onClick={() => {
              if (showForm) {
                setShowForm(false);
                setEditingApp(null);
                setNewApp({ ten_ung_dung: '', app_id: '', khoa_api: '', folder_mau_id: '', folder_xuat_id: '' });
              } else {
                setShowForm(true);
              }
            }} 
            className="btn-primary"
          >
            {showForm ? <X size={20} /> : <Plus size={20} />} 
            <span>{showForm ? 'Hủy bỏ' : 'Kết nối mới'}</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="card-premium p-8 bg-white border-indigo-100 shadow-premium">
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="space-y-8">
                     <div className="flex items-center gap-3 mb-2">
                       <div className="w-1.5 h-6 bg-indigo-600 rounded-full" />
                       <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Định danh kết nối</h4>
                     </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tên ứng dụng</label>
                      <input required value={newApp.ten_ung_dung} onChange={e => setNewApp({...newApp, ten_ung_dung: e.target.value})} className="input-field" placeholder="Ví dụ: CRM Bất Động Sản" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tên bảng chính</label>
                      <input required value={newApp.bang_chinh} onChange={e => setNewApp({...newApp, bang_chinh: e.target.value})} className="input-field" placeholder="Tên bảng trên AppSheet (VD: KhachHang)" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">AppSheet Application ID</label>
                      <input required value={newApp.app_id} onChange={e => setNewApp({...newApp, app_id: e.target.value})} className="input-field font-mono text-indigo-600" placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" />
                      <div className="flex items-center gap-2 px-1">
                        <Info size={12} className="text-amber-500" />
                        <p className="text-[10px] text-slate-400 font-bold italic">Copy từ URL của AppSheet Editor (phần sau ?appId=)</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Application Access Key</label>
                      <input required type="password" value={newApp.khoa_api} onChange={e => setNewApp({...newApp, khoa_api: e.target.value})} className="input-field font-mono" placeholder="Nhập khóa API bảo mật..." />
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
                        <input required value={newApp.folder_mau_id} onChange={e => setNewApp({...newApp, folder_mau_id: e.target.value})} className="input-field font-mono" placeholder="Folder ID..." />
                        <p className="text-[9px] text-slate-400 font-medium px-1">Nơi chứa các tệp .docx / .xlsx mẫu</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Thư mục đích (Xuất)</label>
                        <input required value={newApp.folder_xuat_id} onChange={e => setNewApp({...newApp, folder_xuat_id: e.target.value})} className="input-field font-mono" placeholder="Folder ID..." />
                        <p className="text-[9px] text-slate-400 font-medium px-1">Nơi lưu các bản in đã được sinh ra</p>
                      </div>
                    </div>
                    
                    <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 flex gap-4">
                      <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0 text-amber-600">
                        <HelpCircle size={20} />
                      </div>
                      <div className="text-xs text-amber-700 leading-relaxed font-medium">
                        <span className="font-black">Lưu ý bảo mật:</span> API Key được sử dụng để Hub có thể đọc dữ liệu từ AppSheet của bạn. Đảm bảo bạn đã bật "Enable API" trong phần <span className="underline decoration-amber-300">Manage {'>'} Integrations</span> của AppSheet.
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end pt-4 gap-4">
                  <button 
                    type="button" 
                    onClick={testConnection} 
                    disabled={testingConnection}
                    className="px-8 py-4 bg-slate-100 text-slate-700 font-bold rounded-2xl hover:bg-slate-200 transition-all flex items-center gap-2"
                  >
                    {testingConnection ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-indigo-600 border-t-transparent" /> : <Zap size={20} className="text-indigo-600" />}
                    <span>Kiểm tra kết nối</span>
                  </button>
                  <button type="submit" className="btn-primary px-12 py-4 text-base">
                    {editingApp ? 'Cập nhật cấu hình ngay' : 'Thiết lập kết nối Hub'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Viewing App Details Modal */}
      <AnimatePresence>
        {viewingApp && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-white/20"
            >
              <div className="bg-slate-950 p-10 text-white relative">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                   <Zap size={120} className="fill-white" />
                </div>
                <div className="flex justify-between items-start relative z-10">
                  <div>
                    <h3 className="text-2xl font-black tracking-tighter">{viewingApp.ten_ung_dung || viewingApp.ten_app}</h3>
                    <div className="flex items-center gap-2 mt-2">
                       <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                       <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">AppSheet API V2</span>
                    </div>
                  </div>
                  <button onClick={() => setViewingApp(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={24} /></button>
                </div>
              </div>
              <div className="p-10 space-y-8 bg-slate-50/50">
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm transition-transform hover:-translate-y-1">
                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Thư mục nguồn</div>
                    <div className="text-xs font-mono text-slate-600 truncate bg-slate-50 p-2 rounded-lg">{viewingApp.folder_mau_id || '—'}</div>
                  </div>
                  <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm transition-transform hover:-translate-y-1">
                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Thư mục xuất</div>
                    <div className="text-xs font-mono text-slate-600 truncate bg-slate-50 p-2 rounded-lg">{viewingApp.folder_xuat_id || '—'}</div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">App ID (Project ID)</div>
                    <div className="text-sm font-mono text-indigo-600 break-all select-all p-3 bg-indigo-50 rounded-xl border border-indigo-100/50 font-bold">{viewingApp.app_id}</div>
                  </div>
                  <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 flex items-center justify-between group">
                    <div>
                      <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">API Authentication</div>
                      <div className="text-sm font-black text-emerald-800">Cấu hình bảo mật cao</div>
                    </div>
                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                      <Check size={20} />
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setViewingApp(null)} 
                  className="w-full py-4.5 btn-secondary text-slate-900 border-2 border-slate-900"
                >
                  Đóng cửa sổ
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* File Manager Modal */}
      {managingFilesForApp && (
        <FileManagerModal 
          app={managingFilesForApp} 
          onClose={() => setManagingFilesForApp(null)} 
        />
      )}

      <div className="table-container animate-fade-in-scale">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-400 border-b border-slate-100">
                <th className="px-8 py-5 text-left cursor-pointer group" onClick={() => handleSort('ten_ung_dung')}>
                   <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] group-hover:text-indigo-600 transition-colors">Tên ứng dụng</span>
                    {sortConfig.key === 'ten_ung_dung' && (sortConfig.direction === 'asc' ? <ChevronUp size={12} className="text-indigo-600" /> : <ChevronDown size={12} className="text-indigo-600" />)}
                  </div>
                </th>
                <th className="px-8 py-5 text-left hidden lg:table-cell">
                   <span className="text-[10px] font-black uppercase tracking-[0.2em]">Application ID</span>
                </th>
                <th className="px-8 py-5 text-left">
                   <span className="text-[10px] font-black uppercase tracking-[0.2em]">Trạng thái</span>
                </th>
                <th className="px-8 py-5 text-right">
                   <span className="text-[10px] font-black uppercase tracking-[0.2em]">Thao tác</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedApps.length > 0 ? paginatedApps.map((app: any, i) => (
                <tr key={i} className="hover:bg-indigo-50/20 transition-all group">
                  <td className="px-8 py-6">
                    <div className="font-black text-slate-800 text-lg group-hover:text-indigo-700 transition-colors">{app.ten_ung_dung || app.ten_app}</div>
                    <div className="flex items-center gap-2 mt-1">
                       <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-black uppercase tracking-wider">{app.bang_chinh || 'Main'}</span>
                       <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{app.trang_thai || 'Cloud Edition'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 hidden lg:table-cell">
                    <code className="text-[11px] font-mono px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100/50 block w-fit shadow-xs">
                      {app.app_id ? `${app.app_id.substring(0, 8)}...${app.app_id.substring(app.app_id.length - 8)}` : '—'}
                    </code>
                  </td>
                  <td className="px-8 py-6">
                    {!(app.khoa_api || app.api_key) ? (
                      <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[10px] font-black bg-rose-50 text-rose-600 uppercase tracking-widest border border-rose-100">
                        <div className="w-1.5 h-1.5 bg-rose-500 rounded-full" /> Thiếu API Key
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-600 uppercase tracking-widest border border-emerald-100 shadow-sm">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Đang hoạt động
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
                       <button onClick={() => setManagingFilesForApp(app)} className="w-10 h-10 bg-white border border-slate-200 text-slate-400 hover:text-amber-600 hover:border-amber-100 hover:bg-amber-50 rounded-xl transition-all shadow-sm flex items-center justify-center" title="Quản lý file xuất"><History size={18} /></button>
                       <button onClick={() => startEdit(app)} className="w-10 h-10 bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50 rounded-xl transition-all shadow-sm flex items-center justify-center" title="Chỉnh sửa"><Edit size={18} /></button>
                       <button onClick={() => setViewingApp(app)} className="w-10 h-10 bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50 rounded-xl transition-all shadow-sm flex items-center justify-center" title="Xem chi tiết"><Eye size={18} /></button>
                       <button onClick={() => handleDelete(app.ma_id, app.ten_ung_dung || app.ten_app)} className="w-10 h-10 bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-100 hover:bg-rose-50 rounded-xl transition-all shadow-sm flex items-center justify-center" title="Xóa bỏ"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={4} className="text-center py-32">
                  <div className="flex flex-col items-center gap-4 grayscale opacity-20">
                     <Grid size={80} />
                     <p className="text-sm font-black uppercase tracking-[0.3em]">Hệ thống chưa có ứng dụng</p>
                  </div>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Improved Pagination */}
        {totalPages > 1 && (
          <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white px-3 py-1.5 rounded-lg border border-slate-200">Hiển thị {paginatedApps.length} / {filteredApps.length} mục</span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(1)} 
                disabled={currentPage === 1}
                className="w-10 h-10 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 disabled:opacity-40 transition-all flex items-center justify-center shadow-sm"
              >
                <ChevronsLeft size={18} />
              </button>
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} 
                disabled={currentPage === 1}
                className="w-10 h-10 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 disabled:opacity-40 transition-all flex items-center justify-center shadow-sm"
              >
                <ChevronLeft size={18} />
              </button>
              
              <div className="flex items-center px-4 h-10 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-600/20">
                <span className="text-xs font-black tracking-widest">{currentPage} / {totalPages}</span>
              </div>

              <button 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} 
                disabled={currentPage === totalPages}
                className="w-10 h-10 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 disabled:opacity-40 transition-all flex items-center justify-center shadow-sm"
              >
                <ChevronRight size={18} />
              </button>
              <button 
                onClick={() => setCurrentPage(totalPages)} 
                disabled={currentPage === totalPages}
                className="w-10 h-10 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 disabled:opacity-40 transition-all flex items-center justify-center shadow-sm"
              >
                <ChevronsRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const TemplateManagement = () => {
  const [templates, setTemplates] = React.useState([]);
  const [apps, setApps] = React.useState([]);
  // ... rest of state
  const [loading, setLoading] = React.useState(true);
  const [showForm, setShowForm] = React.useState(false);
  const [editingTemplate, setEditingTemplate] = React.useState<any>(null);
  const [viewingTpl, setViewingTpl] = React.useState<any>(null);
  const [newTemplate, setNewTemplate] = React.useState({ 
    ten_mau: '', 
    ma_mau: '', 
    file_id_drive: '', 
    loai_file: 'DOCX', 
    thu_muc_luu: '',
    ma_ung_dung: '',
    bang_chinh: '',
    key_col: '',
    child_table: '',
    foreign_key: '',
    child_name: 'items'
  });
  const [searchTerm, setSearchTerm] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize] = React.useState(10);
  const [sortConfig, setSortConfig] = React.useState({ key: 'ten_mau', direction: 'asc' });
  const [mainCols, setMainCols] = React.useState<string[]>([]);
  const [childCols, setChildCols] = React.useState<string[]>([]);
  const [isFetchingCols, setIsFetchingCols] = React.useState(false);

  const slugify = (text: string) => {
    return text
      .toString()
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .normalize('NFD') // Tách dấu
      .replace(/[\u0300-\u036f]/g, '') // Xóa dấu
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Xóa ký tự đặc biệt
      .replace(/[\s_-]+/g, '_') // Thay khoảng trắng bằng _
      .replace(/^-+|-+$/g, '')
      .toUpperCase();
  };

  const handleTenMauChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setNewTemplate(prev => ({
      ...prev,
      ten_mau: name,
      ma_mau: editingTemplate ? prev.ma_mau : slugify(name)
    }));
  };

  const fetchData = async () => {
    try {
      const [tplRes, appRes] = await Promise.all([
        fetch('/api/db/mau_bieu', { credentials: 'include' }).then(res => res.json()),
        fetch('/api/db/ung_dung', { credentials: 'include' }).then(res => res.json())
      ]);
      setTemplates(Array.isArray(tplRes) ? tplRes : []);
      setApps(Array.isArray(appRes) ? appRes : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => { fetchData(); }, []);

  const handleSort = (key: string) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedTemplates = React.useMemo(() => {
    let sortableItems = [...templates];
    if (sortConfig.key) {
      sortableItems.sort((a: any, b: any) => {
        const valA = (a[sortConfig.key] || '').toString().toLowerCase();
        const valB = (b[sortConfig.key] || '').toString().toLowerCase();
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [templates, sortConfig]);

  const filteredTemplates = React.useMemo(() => {
    return sortedTemplates.filter((tpl: any) => 
      (tpl.ten_mau || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tpl.ma_mau || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sortedTemplates, searchTerm]);

  const paginatedTemplates = React.useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredTemplates.slice(startIndex, startIndex + pageSize);
  }, [filteredTemplates, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredTemplates.length / pageSize);

  const generateActionLink = (tpl: any) => {
    const baseUrl = window.location.origin;
    const maMau = tpl.ma_id || tpl.ten_mau;
    const keyCol = tpl.key_col || 'ma_id';

    return `CONCATENATE("${baseUrl}/report?template=${maMau}&id=", ENCODEURL([${keyCol}]))`;
  };

  const previewActionLink = () => {
    return generateActionLink(newTemplate);
  };

  const fetchAppSheetCols = async (tableName: string, isChild: boolean = false) => {
    if (!newTemplate.ma_ung_dung || !tableName) return;
    const targetApp: any = apps.find((a: any) => a.ma_id === newTemplate.ma_ung_dung);
    if (!targetApp) return;

    setIsFetchingCols(true);
    try {
      const res = await fetch('/api/appsheet/columns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appId: targetApp.app_id,
          apiKey: targetApp.khoa_api || targetApp.api_key,
          tableName
        }),
        credentials: 'include'
      });
      if (res.ok) {
        const cols = await res.json();
        if (isChild) setChildCols(cols);
        else setMainCols(cols);
      }
    } catch (err) {
      console.error('Lỗi khi lấy danh sách cột:', err);
    } finally {
      setIsFetchingCols(false);
    }
  };

  const copyToClipboard = (text: string, msg: string) => {
    navigator.clipboard.writeText(text);
    alert(msg);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa mẫu biểu "${name}"?`)) return;
    try {
      const res = await fetch(`/api/db/mau_bieu/${id}`, { method: 'DELETE', credentials: 'include' });
      if (res.ok) {
        fetchData();
      } else {
        const err = await res.json();
        alert(`Lỗi: ${err.error || 'Không thể xóa'}`);
      }
    } catch (err) {
      alert('Lỗi kết nối khi xóa');
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (editingTemplate) {
        const res = await fetch(`/api/db/mau_bieu/${editingTemplate.ma_id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            ...newTemplate, 
            file_id_drive: newTemplate.file_id_drive.trim(),
            thu_muc_luu: newTemplate.thu_muc_luu?.trim() || ''
          }),
          credentials: 'include'
        });
        if (res.ok) {
          setShowForm(false);
          setEditingTemplate(null);
          setNewTemplate({ 
            ten_mau: '', 
            ma_mau: '', 
            file_id_drive: '', 
            loai_file: 'DOCX', 
            thu_muc_luu: '',
            ma_ung_dung: '',
            bang_chinh: '',
            key_col: '',
            child_table: '',
            foreign_key: '',
            child_name: 'items'
          });
          fetchData();
        }
      } else {
        const res = await fetch('/api/db/mau_bieu', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            ...newTemplate, 
            file_id_drive: newTemplate.file_id_drive.trim(),
            thu_muc_luu: newTemplate.thu_muc_luu?.trim() || '',
            ma_id: `TPL_${Date.now()}`,
            trang_thai: 'Hoạt động'
          }),
          credentials: 'include'
        });
        if (res.ok) {
          setShowForm(false);
          setNewTemplate({ 
            ten_mau: '', 
            ma_mau: '', 
            file_id_drive: '', 
            loai_file: 'DOCX', 
            thu_muc_luu: '',
            ma_ung_dung: '',
            bang_chinh: '',
            key_col: '',
            child_table: '',
            foreign_key: '',
            child_name: 'items'
          });
          fetchData();
        }
      }
    } catch (err) {
      alert('Lỗi lưu cấu hình mẫu biểu');
    }
  };

  const startEdit = (tpl: any) => {
    setEditingTemplate(tpl);
    setNewTemplate({
      ten_mau: tpl.ten_mau || '',
      ma_mau: tpl.ma_mau || '',
      file_id_drive: tpl.file_id_drive || '',
      loai_file: tpl.loai_file || 'DOCX',
      thu_muc_luu: tpl.thu_muc_luu || '',
      ma_ung_dung: tpl.ma_ung_dung || '',
      bang_chinh: tpl.bang_chinh || '',
      key_col: tpl.key_col || '',
      child_table: tpl.child_table || '',
      foreign_key: tpl.foreign_key || '',
      child_name: tpl.child_name || 'items'
    });
    setShowForm(true);
  };

  if (loading) return <div className="p-10 text-center text-slate-400 animate-pulse font-bold">ĐANG TẢI DỮ LIỆU...</div>;

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 uppercase tracking-tight mb-0">Quản lý Mẫu biểu</h2>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Hỗ trợ in Master-Detail (Bảng cha - Bảng con) chuyên sâu</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => window.open('/HUONG_DAN_TEMPLATES.md', '_blank')}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors"
          >
            <HelpCircle size={14} /> Hướng dẫn
          </button>
          <div className="relative hidden md:block">
            <input 
              type="text" 
              placeholder="Tìm mẫu biểu..." 
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 transition-all w-48"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
          </div>
          <button onClick={() => {
            if (showForm) {
              setShowForm(false);
              setEditingTemplate(null);
              setNewTemplate({ 
                ten_mau: '', 
                ma_mau: '', 
                file_id_drive: '', 
                loai_file: 'DOCX', 
                thu_muc_luu: '',
                ma_ung_dung: '',
                bang_chinh: '',
                key_col: '',
                child_table: '',
                foreign_key: '',
                child_name: 'items'
              });
            } else {
              setShowForm(true);
            }
          }} className="btn-primary">
            {showForm ? <X size={20} /> : <Plus size={20} />} {showForm ? 'HỦY BỎ' : 'THÊM MẪU MỚI'}
          </button>
        </div>
      </div>

      {/* Workflow Guide */}
      {!showForm && templates.length === 0 && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-8 mb-6">
          <div className="flex gap-4">
            <div className="p-3 bg-indigo-600 text-white rounded-full h-fit shadow-lg">
              <Zap size={24} />
            </div>
            <div>
              <h3 className="text-lg font-black text-indigo-900 uppercase tracking-tight mb-2">Quy trình triển khai 3 bước</h3>
              <div className="grid md:grid-cols-3 gap-6 mt-4">
                <div className="space-y-2">
                  <div className="text-xs font-black text-indigo-600 uppercase tracking-widest">BƯỚC 1</div>
                  <p className="text-sm text-indigo-800 font-bold">Khai báo Ứng dụng AppSheet</p>
                  <p className="text-xs text-indigo-600/70">Tại menu "Ứng dụng", nhập App ID và API Key để hệ thống có quyền truy xuất dữ liệu từ AppSheet.</p>
                </div>
                <div className="space-y-2">
                  <div className="text-xs font-black text-indigo-600 uppercase tracking-widest">BƯỚC 2</div>
                  <p className="text-sm text-indigo-800 font-bold">Cấu hình Mẫu biểu & Schema</p>
                  <p className="text-xs text-indigo-600/70">Chọn Ứng dụng → Nhập tên bảng → Hệ thống tự động liệt kê danh sách cột để bạn chọn Cột Khóa chính xác.</p>
                </div>
                <div className="space-y-2">
                  <div className="text-xs font-black text-indigo-600 uppercase tracking-widest">BƯỚC 3</div>
                  <p className="text-sm text-indigo-800 font-bold">Tạo Action trong AppSheet</p>
                  <p className="text-xs text-indigo-600/70">Sao chép Link Formula do hệ thống sinh ra và dán vào Action "Go to a website" trong AppSheet Editor.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="card-geometric mb-6 border-indigo-200 bg-indigo-50/20 animate-in fade-in slide-in-from-top-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cấu hình cơ bản */}
              <div className="space-y-4">
                <h4 className="text-[11px] font-black text-indigo-600 uppercase border-b border-indigo-100 pb-2 flex items-center gap-2">
                  <FileText size={14} /> Thông tin mẫu cơ bản
                </h4>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Liên kết Ứng dụng AppSheet</label>
                  <select 
                    required 
                    value={newTemplate.ma_ung_dung} 
                    onChange={e => {
                      const appId = e.target.value;
                      const targetApp: any = apps.find((a: any) => a.ma_id === appId);
                      setNewTemplate({
                        ...newTemplate, 
                        ma_ung_dung: appId,
                        bang_chinh: targetApp?.bang_chinh || newTemplate.bang_chinh,
                        key_col: targetApp?.key_col || newTemplate.key_col
                      });
                      if (targetApp?.bang_chinh) {
                        fetchAppSheetCols(targetApp.bang_chinh);
                      }
                    }} 
                    className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">-- Chọn ứng dụng --</option>
                    {apps.map((app: any) => (
                      <option key={app.ma_id} value={app.ma_id}>{app.ten_ung_dung || app.ten_app}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Tên hiển thị</label>
                    <input required value={newTemplate.ten_mau} onChange={handleTenMauChange} className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500" placeholder="VD: Hóa đơn bán hàng" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Mã mẫu (Action URL)</label>
                    <input required value={newTemplate.ma_mau} onChange={e => setNewTemplate({...newTemplate, ma_mau: e.target.value.toUpperCase().replace(/\s/g, '')})} className="w-full border border-slate-200 rounded px-3 py-2 text-sm font-bold text-indigo-600 focus:ring-2 focus:ring-indigo-500" placeholder="HOA_DON" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Google Drive File ID</label>
                  <input required value={newTemplate.file_id_drive} onChange={e => setNewTemplate({...newTemplate, file_id_drive: e.target.value})} className="w-full border border-slate-200 rounded px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-indigo-500" placeholder="ID file Word/Excel" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                      Bảng chính AppSheet <Info size={10} className="text-slate-400" />
                    </label>
                    <input 
                      required 
                      value={newTemplate.bang_chinh} 
                      onChange={e => setNewTemplate({...newTemplate, bang_chinh: e.target.value})} 
                      onBlur={() => fetchAppSheetCols(newTemplate.bang_chinh)}
                      className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500" 
                      placeholder="VD: DonHang" 
                    />
                    <p className="text-[9px] text-slate-400 italic">Bảng chứa record cần in</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                      Cột Khóa của bảng chính <Info size={10} className="text-slate-400" />
                    </label>
                    {mainCols.length > 0 ? (
                      <select 
                        required 
                        value={newTemplate.key_col} 
                        onChange={e => setNewTemplate({...newTemplate, key_col: e.target.value})} 
                        className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="">-- Chọn cột khóa --</option>
                        {mainCols.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    ) : (
                      <input 
                        required 
                        value={newTemplate.key_col} 
                        onChange={e => setNewTemplate({...newTemplate, key_col: e.target.value})} 
                        className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 font-mono" 
                        placeholder="ma_id" 
                      />
                    )}
                    <p className="text-[9px] text-slate-400 italic">ID để định danh record</p>
                  </div>
                </div>
              </div>

              {/* Cấu hình nâng cao (Master Detail) */}
              <div className="space-y-4">
                <h4 className="text-[11px] font-black text-amber-600 uppercase border-b border-amber-100 pb-2 flex items-center gap-2">
                  <Zap size={14} /> Cấu hình Master-Detail (In Danh sách dòng con)
                </h4>
                <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100/50 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-amber-700 uppercase flex items-center gap-1">
                        Tên Bảng Con <Info size={10} title="Tên bảng chứa dữ liệu chi tiết trong AppSheet" />
                      </label>
                      <input 
                        value={newTemplate.child_table} 
                        onChange={e => setNewTemplate({...newTemplate, child_table: e.target.value})} 
                        onBlur={() => fetchAppSheetCols(newTemplate.child_table, true)}
                        className="w-full border border-amber-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 bg-white" 
                        placeholder="VD: ChiTietDaoTao" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-amber-700 uppercase flex items-center gap-1">
                        Tên biến (Word/Excel) <Info size={10} title="Dùng trong template: {#items}...{/items} hoặc {items.Ten}" />
                      </label>
                      <input value={newTemplate.child_name} onChange={e => setNewTemplate({...newTemplate, child_name: e.target.value})} className="w-full border border-amber-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 bg-white font-mono" placeholder="items" />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-amber-700 uppercase">Cột tham chiếu (Foreign Key)</label>
                    {childCols.length > 0 ? (
                      <select 
                        value={newTemplate.foreign_key} 
                        onChange={e => setNewTemplate({...newTemplate, foreign_key: e.target.value})} 
                        className="w-full border border-amber-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 bg-white"
                      >
                        <option value="">-- Chọn cột tham chiếu --</option>
                        {childCols.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    ) : (
                      <input 
                        value={newTemplate.foreign_key} 
                        onChange={e => setNewTemplate({...newTemplate, foreign_key: e.target.value})} 
                        className="w-full border border-amber-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 bg-white" 
                        placeholder="VD: MaKhoaHoc" 
                      />
                    )}
                  </div>
                  
                  <div className="p-3 bg-white/60 rounded-xl border border-amber-100 text-[10px] text-amber-800 space-y-1">
                    <p className="font-bold">💡 Cách thiết lập Template:</p>
                    <ul className="list-disc pl-4 space-y-0.5">
                      <li><b>Word:</b> Bao quanh hàng/khối bằng <code className="bg-amber-100 px-1 rounded">{`{#${newTemplate.child_name || 'items'}}`}</code> và <code className="bg-amber-100 px-1 rounded">{`{/${newTemplate.child_name || 'items'}}`}</code></li>
                      <li><b>Excel:</b> Chỉ cần nhập token <code className="bg-amber-100 px-1 rounded">{`{${newTemplate.child_name || 'items'}.TenCot}`}</code> vào một hàng, hàng đó sẽ tự động lặp lại.</li>
                    </ul>
                    <div className="mt-3 flex gap-2">
                       <button 
                        type="button"
                        onClick={() => generateSampleWord({
                          ten_mau: newTemplate.ten_mau,
                          child_name: newTemplate.child_name,
                          main_cols: mainCols,
                          child_cols: childCols
                        })}
                        className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors flex items-center gap-1 shadow-sm"
                      >
                         <FileText size={12} /> Tải Word mẫu
                      </button>
                       <button 
                        type="button"
                        onClick={() => generateSampleExcel({
                          ten_mau: newTemplate.ten_mau,
                          child_name: newTemplate.child_name,
                          main_cols: mainCols,
                          child_cols: childCols
                        })}
                        className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition-colors flex items-center gap-1 shadow-sm"
                      >
                        <Grid size={12} /> Tải Excel mẫu
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Preview Section */}
            <div className="bg-slate-900 rounded-xl p-5 border border-slate-700 shadow-inner">
               <div className="flex justify-between items-center mb-3">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                   <Zap size={14} className="text-amber-400" /> LIVE PREVIEW: AppSheet Action Formula
                 </label>
                 <button 
                   type="button"
                   onClick={() => copyToClipboard(previewActionLink(), 'Đã sao chép công thức preview!')}
                   className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-widest flex items-center gap-1 transition-colors"
                 >
                   <Copy size={12} /> Sao chép nhanh
                 </button>
               </div>
               <div className="bg-slate-800/50 p-3 rounded border border-slate-700">
                 <pre className="text-[10px] font-mono text-slate-300 whitespace-pre-wrap break-all leading-relaxed">
                   {previewActionLink()}
                 </pre>
               </div>
               <p className="text-[9px] text-slate-500 mt-2 italic">* Công thức này tự động cập nhật khi bạn thay đổi các trường phía trên.</p>
            </div>

            <button type="submit" className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg uppercase text-xs tracking-widest hover:bg-slate-800 transition-all shadow-xl flex items-center justify-center gap-2">
              <Printer size={16} /> {editingTemplate ? 'CẬP NHẬT CẤU HÌNH MẪU BIỂU' : 'LƯU CẤU HÌNH VÀ TẠO MẪU'}
            </button>
          </form>
        </div>
      )}

      {/* Chi tiết mẫu biểu */}
      {viewingTpl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in slide-in-from-bottom-8">
            <div className="bg-indigo-600 p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight">{viewingTpl.ten_mau}</h3>
                <p className="text-[10px] text-indigo-100 uppercase tracking-widest font-bold mt-1">Cấu hình Action AppSheet chi tiết</p>
              </div>
              <button onClick={() => setViewingTpl(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors font-bold text-xl">×</button>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Zap size={14} className="text-indigo-600" /> Công thức Action dành cho AppSheet
                </label>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 relative group">
                  <pre className="text-[11px] font-mono whitespace-pre-wrap break-all text-slate-700 leading-relaxed italic">
                    {generateActionLink(viewingTpl)}
                  </pre>
                  <button 
                    onClick={() => copyToClipboard(generateActionLink(viewingTpl), 'Đã sao chép công thức!')}
                    className="absolute top-2 right-2 p-2 bg-indigo-600 text-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-indigo-700"
                    title="Sao chép"
                  >
                    <Copy size={16} />
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 italic font-medium">Lưu ý: Mở "Behavior" &gt; "Action" &gt; "Go to a website" và dán công thức trên vào ô URL.</p>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                <div className="space-y-1">
                   <div className="text-[9px] font-bold text-slate-400 uppercase">File Gốc (Drive)</div>
                   <div className="flex items-center gap-2">
                     <span className="text-xs font-mono truncate max-w-[150px] text-indigo-600">{viewingTpl.file_id_drive}</span>
                     <a href={`https://drive.google.com/file/d/${viewingTpl.file_id_drive}/view`} target="_blank" className="p-1 hover:bg-slate-100 rounded text-slate-400"><ExternalLink size={14} /></a>
                   </div>
                </div>
                <div className="space-y-1">
                   <div className="text-[9px] font-bold text-slate-400 uppercase">Mã Mẫu</div>
                   <div className="text-sm font-black text-slate-800">{viewingTpl.ma_mau}</div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button onClick={() => setViewingTpl(null)} className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold uppercase transition-all">ĐÓNG LẠI</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                <th 
                  className="px-6 py-4 text-left cursor-pointer group"
                  onClick={() => handleSort('ten_mau')}
                >
                   <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-indigo-600 transition-colors">Mẫu biểu</span>
                    {sortConfig.key === 'ten_mau' ? (sortConfig.direction === 'asc' ? <ChevronUp size={12} className="text-indigo-600" /> : <ChevronDown size={12} className="text-indigo-600" />) : <ArrowUpDown size={10} className="text-slate-300" />}
                  </div>
                </th>
                <th className="px-6 py-4 text-left">
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cấu hình In</span>
                </th>
                <th className="px-6 py-4 text-left">
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Thao tác nhanh</span>
                </th>
                <th className="px-6 py-4 text-right">
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedTemplates.length > 0 ? paginatedTemplates.map((tpl: any, i) => (
                <tr key={i} className="hover:bg-indigo-50/20 transition-colors">
                  <td className="px-6 py-5">
                    <div className="font-bold text-slate-800 flex items-center gap-2">
                      {tpl.loai_file === 'XLSX' ? <Grid size={16} className="text-emerald-600" /> : <FileText size={16} className="text-indigo-600" />}
                      {tpl.ten_mau}
                    </div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">ID: {tpl.file_id_drive?.slice(0, 15)}...</div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[9px] font-black uppercase tracking-wider border border-indigo-100 shadow-sm">Mã: {tpl.ma_mau}</span>
                      {tpl.child_table && <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[9px] font-black uppercase tracking-wider border border-amber-100 shadow-sm">Master Detail</span>}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex gap-2">
                       <button onClick={() => startEdit(tpl)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-all shadow-hover" title="Sửa"><Edit size={18} /></button>
                       <button onClick={() => setViewingTpl(tpl)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-all shadow-hover" title="Chi tiết công thức"><Eye size={18} /></button>
                       <button onClick={() => copyToClipboard(generateActionLink(tpl), `Đã sao chép công thức AppSheet!`)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-all shadow-hover" title="Sao chép nhanh"><Copy size={18} /></button>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button onClick={() => handleDelete(tpl.ma_id, tpl.ten_mau)} className="p-2 text-slate-300 hover:text-rose-600 transition-colors" title="Xóa mẫu biểu">
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={4} className="text-center py-20 text-slate-300 italic uppercase tracking-widest text-[10px] font-black opacity-40">Không tìm thấy mẫu biểu nào</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-5 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
               Trang <span className="text-indigo-600">{currentPage}</span> / {totalPages}
            </p>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setCurrentPage(1)} 
                disabled={currentPage === 1}
                className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 disabled:opacity-50 transition-all font-bold shadow-sm"
              >
                <ChevronsLeft size={16} />
              </button>
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} 
                disabled={currentPage === 1}
                className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 disabled:opacity-50 transition-all font-bold shadow-sm"
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} 
                disabled={currentPage === totalPages}
                className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 disabled:opacity-50 transition-all font-bold shadow-sm"
              >
                <ChevronRight size={16} />
              </button>
              <button 
                onClick={() => setCurrentPage(totalPages)} 
                disabled={currentPage === totalPages}
                className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 disabled:opacity-50 transition-all font-bold shadow-sm"
              >
                <ChevronsRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const HistoryLog = () => {
  const [logs, setLogs] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize] = React.useState(10);
  const [sortConfig, setSortConfig] = React.useState({ key: 'ngay_tao', direction: 'desc' });

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/db/nhat_ky_in', { credentials: 'include' });
      const data = await res.json();
      setLogs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => { fetchLogs(); }, []);

  const handleSort = (key: string) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedLogs = React.useMemo(() => {
    let sortableItems = [...logs];
    if (sortConfig.key) {
      sortableItems.sort((a: any, b: any) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [logs, sortConfig]);

  const filteredLogs = React.useMemo(() => {
    return sortedLogs.filter((log: any) => 
      (log.ten_mau || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.ma_id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.trang_thai || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sortedLogs, searchTerm]);

  const paginatedLogs = React.useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredLogs.slice(startIndex, startIndex + pageSize);
  }, [filteredLogs, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredLogs.length / pageSize);

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 text-slate-400 gap-4">
      <div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
      <p className="text-[10px] font-black uppercase tracking-widest animate-pulse transition-all">Đang tải lịch sử...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">Nhật ký in ấn</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Hệ thống ghi nhận thời gian thực từ AppSheet</p>
        </div>
        <div className="relative group">
          <input 
            type="text" 
            placeholder="Tìm kiếm theo mẫu, ID dòng..." 
            className="pl-11 pr-5 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all w-full md:w-72 shadow-sm group-hover:shadow-md"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
          <Search size={18} className="absolute left-4 top-3 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                <th className="px-6 py-4 text-left cursor-pointer group" onClick={() => handleSort('ngay_tao')}>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-indigo-600 transition-colors">Thời điểm</span>
                    {sortConfig.key === 'ngay_tao' ? (sortConfig.direction === 'asc' ? <ChevronUp size={12} className="text-indigo-600" /> : <ChevronDown size={12} className="text-indigo-600" />) : <ArrowUpDown size={10} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />}
                  </div>
                </th>
                <th className="px-6 py-4 text-left cursor-pointer group" onClick={() => handleSort('ten_mau')}>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-indigo-600 transition-colors">Tên Mẫu Biểu</span>
                    {sortConfig.key === 'ten_mau' ? (sortConfig.direction === 'asc' ? <ChevronUp size={12} className="text-indigo-600" /> : <ChevronDown size={12} className="text-indigo-600" />) : <ArrowUpDown size={10} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />}
                  </div>
                </th>
                <th className="px-6 py-4 text-left">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dòng ID AppSheet</span>
                </th>
                <th className="px-6 py-4 text-right">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trạng thái</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedLogs.length > 0 ? paginatedLogs.map((log: any, i) => (
                <tr key={i} className="hover:bg-indigo-50/20 transition-colors">
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-slate-800">{new Date(log.ngay_tao).toLocaleDateString('vi-VN')}</span>
                      <span className="text-[10px] font-bold text-slate-400 tabular-nums">{new Date(log.ngay_tao).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <FileText size={16} />
                      </div>
                      <span className="text-sm font-bold text-slate-700">{log.ten_mau}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded-md text-[10px] font-mono font-bold tracking-tight border border-slate-200/50">
                      ID: {log.ma_id?.length > 15 ? log.ma_id.slice(0, 15) + '...' : log.ma_id}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                        log.trang_thai === 'Thành công' || log.trang_thai === 'Hoàn tất' ? 'bg-emerald-50 text-emerald-600 shadow-sm shadow-emerald-100' : 
                        log.trang_thai === 'Đang xử lý' ? 'bg-amber-50 text-amber-600 animate-pulse' : 
                        'bg-rose-50 text-rose-600 shadow-sm shadow-rose-100'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          log.trang_thai === 'Thành công' || log.trang_thai === 'Hoàn tất' ? 'bg-emerald-500' : 
                          log.trang_thai === 'Đang xử lý' ? 'bg-amber-500' : 
                          'bg-rose-500'
                        }`}></div>
                        {log.trang_thai || 'Hoàn tất'}
                      </span>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-2 opacity-40">
                      <Search size={40} className="text-slate-300" />
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Không tìm thấy dữ liệu yêu cầu</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Professional Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-5 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
              Hiển thị <span className="text-indigo-600">{Math.min(filteredLogs.length, (currentPage - 1) * pageSize + 1)}</span> 
              {" "}-{" "} 
              <span className="text-indigo-600">{Math.min(filteredLogs.length, currentPage * pageSize)}</span> 
              {" "}từ <span className="text-indigo-600">{filteredLogs.length}</span> báo cáo
            </p>
            <div className="flex items-center gap-1">
              <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 disabled:opacity-50 transition-all font-bold shadow-sm">
                <ChevronsLeft size={16} />
              </button>
              <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 disabled:opacity-50 transition-all font-bold shadow-sm">
                <ChevronLeft size={16} />
              </button>
              
              <div className="flex items-center px-4 gap-2">
                <span className="text-[11px] font-black text-indigo-600 shadow-sm bg-white border border-slate-200 w-8 h-8 rounded-xl flex items-center justify-center">{currentPage}</span>
                <span className="text-[10px] font-black text-slate-300">/</span>
                <span className="text-[11px] font-black text-slate-400">{totalPages}</span>
              </div>

              <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 disabled:opacity-50 transition-all font-bold shadow-sm">
                <ChevronRight size={16} />
              </button>
              <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 disabled:opacity-50 transition-all font-bold shadow-sm">
                <ChevronsRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
const ReportingPage = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = React.useState('Đang khởi tạo kết nối...');
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const rowId = searchParams.get('id');
  const templateMaId = searchParams.get('template');

  const startGenerate = async () => {
    if (!rowId || !templateMaId) return;
    setIsGenerating(true);
    
    // Fake progress for UX
    const interval = setInterval(() => {
      setProgress(prev => (prev < 90 ? prev + Math.random() * 15 : prev));
    }, 800);

    try {
      setStatus('Kiểm tra quyền truy cập hệ thống...');
      const [templates, apps] = await Promise.all([
        fetch('/api/db/mau_bieu', { credentials: 'include' }).then(res => res.json()),
        fetch('/api/db/ung_dung', { credentials: 'include' }).then(res => res.json())
      ]);

      const target = templateMaId.toLowerCase();
      const template = Array.isArray(templates) ? templates.find((t: any) => 
        (t.ma_id?.toLowerCase() === target) || 
        (t.ma_mau?.toLowerCase() === target) || 
        (t.ten_mau?.toLowerCase() === target)
      ) : null;

      if (!template) throw new Error(`Không tìm thấy cấu hình mẫu "${templateMaId}". Vui lòng kiểm tra lại Dashboard.`);

      const app = Array.isArray(apps) ? apps.find((a: any) => a.ma_id === template.ma_ung_dung) : null;
      if (!app) throw new Error('Cấu hình ứng dụng AppSheet không hợp lệ hoặc đã bị gỡ bỏ.');

      setStatus(`Kết nối AppSheet: Đang lấy dữ liệu dòng [${rowId}]...`);
      setProgress(40);

      const res = await fetch('/api/report/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appId: app.app_id,
          apiKey: app.khoa_api || app.api_key,
          tableName: template.bang_chinh,
          rowId: rowId,
          templateId: template.file_id_drive,
          folderOutputId: app.folder_xuat_id,
          keyCol: template.key_col,
          childTable: template.child_table,
          foreignKey: template.foreign_key,
          childName: template.child_name || 'items'
        }),
        credentials: 'include'
      });

      const result = await res.json();
      if (res.ok) {
        setProgress(100);
        setStatus('Hoàn tất! Đang mở tài liệu của bạn...');
        setTimeout(() => {
          window.location.href = result.viewLink || `https://drive.google.com/file/d/${result.fileId}/view`;
        }, 1200);
      } else {
        throw new Error(result.error || 'Lỗi không xác định từ máy chủ Google.');
      }
    } catch (err: any) {
      setStatus(err.message);
      setIsGenerating(false);
      clearInterval(interval);
    }
  };

  React.useEffect(() => {
    if (rowId && templateMaId) {
      startGenerate();
    }
  }, [rowId, templateMaId]);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 selection:bg-indigo-500/30">
      <div className="max-w-md w-full animate-in zoom-in-95 duration-700">
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[40px] p-10 overflow-hidden relative">
          {/* Animated Background Pulse */}
          <div className="absolute inset-0 bg-indigo-600/5 animate-pulse"></div>
          
          <div className="relative z-10 text-center">
            <div className={`w-24 h-24 mx-auto mb-10 rounded-[32px] flex items-center justify-center relative ${isGenerating ? 'bg-indigo-600 shadow-[0_0_50px_-5px_rgba(79,70,229,0.5)] animate-bounce duration-[2000ms]' : 'bg-rose-500/20'}`}>
              <Printer className={isGenerating ? 'text-white' : 'text-rose-500'} size={44} />
              {isGenerating && (
                <div className="absolute -inset-1 border-2 border-indigo-600 rounded-[36px] animate-ping opacity-20"></div>
              )}
            </div>

            <h2 className="text-xl font-black text-white uppercase tracking-tighter mb-4">
              {isGenerating ? 'Đang xuất báo cáo' : 'Lỗi kỹ thuật'}
            </h2>
            
            <div className="bg-black/20 rounded-2xl p-6 border border-white/5 mb-10 min-h-[80px] flex items-center justify-center">
              <p className="text-sm font-medium text-slate-300 leading-relaxed italic">
                 "{status}"
              </p>
            </div>

            {isGenerating && (
              <div className="space-y-3 mb-10">
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 transition-all duration-700 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <span>Processing Content</span>
                  <span className="tabular-nums">{Math.round(progress)}%</span>
                </div>
              </div>
            )}

            {(!rowId || !templateMaId) && !isGenerating && (
              <div className="text-rose-400 text-[10px] font-black uppercase tracking-[0.2em] p-4 bg-rose-500/10 rounded-2xl border border-rose-500/20 mb-10">
                Dữ liệu truyền từ AppSheet không đủ.
              </div>
            )}

            <div className="flex flex-col gap-4">
              <Link 
                to="/" 
                className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl transition-all border border-white/5 active:scale-95"
              >
                Hủy lệnh & Quay lại
              </Link>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Powered by Automation Engine</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const FileManagerModal = ({ app, onClose }: { app: any, onClose: () => void }) => {
  const [files, setFiles] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [cleaningUp, setCleaningUp] = React.useState(false);
  const folderId = app.folder_xuat_id;

  const fetchFiles = async () => {
    if (!folderId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/drive/files/${folderId}`, { credentials: 'include' });
      const data = await res.json();
      setFiles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Fetch Files Error:', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchFiles();
  }, [folderId]);

  const handleDelete = async (fileId: string, fileName: string) => {
    if (!window.confirm(`Bạn có chắc muốn xóa tệp "${fileName}"?`)) return;
    try {
      const res = await fetch(`/api/drive/files/${fileId}`, { method: 'DELETE', credentials: 'include' });
      if (res.ok) {
        setFiles(prev => prev.filter(f => f.id !== fileId));
      } else {
        alert('Không thể xóa tệp');
      }
    } catch (err) {
      alert('Lỗi khi xóa tệp');
    }
  };

  const handleCleanup = async (days: number) => {
    if (!window.confirm(`Bạn có chắc muốn xóa tất cả tệp cũ hơn ${days} ngày trong thư mục này?`)) return;
    setCleaningUp(true);
    try {
      const res = await fetch('/api/drive/cleanup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folderId, days }),
        credentials: 'include'
      });
      if (res.ok) {
        const result = await res.json();
        alert(`Đã xóa thành công ${result.count} tệp cũ.`);
        fetchFiles();
      } else {
        alert('Lỗi trong quá trình dọn dẹp');
      }
    } catch (err) {
      alert('Lỗi kết nối dọn dẹp');
    } finally {
      setCleaningUp(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        <div className="bg-slate-900 p-6 text-white shrink-0">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                <History size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight">{app.ten_ung_dung || app.ten_app}</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Quản lý tệp xuất ({folderId || 'Chưa cấu hình'})</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={24} /></button>
          </div>
        </div>

        <div className="p-6 flex-1 overflow-y-auto bg-slate-50/50">
          {!folderId ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-white rounded-3xl border-2 border-dashed border-slate-200">
              <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-4">
                <X size={32} />
              </div>
              <h4 className="text-lg font-bold text-slate-800 mb-2">Chưa cấu hình Thư mục Xuất</h4>
              <p className="text-sm text-slate-500 max-w-xs">Vui lòng quay lại phần Cập nhật ứng dụng và điền Folder ID thư mục Drive để lưu file.</p>
            </div>
          ) : loading ? (
            <div className="h-full flex items-center justify-center py-20 bg-white rounded-3xl">
              <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Đang tải danh sách tệp...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center px-2">
                <div className="text-xs font-bold text-slate-500">Tìm thấy {files.length} tệp</div>
                <div className="flex gap-2">
                  <button 
                    disabled={cleaningUp || files.length === 0}
                    onClick={() => handleCleanup(30)}
                    className="px-4 py-2 bg-rose-50 text-rose-600 rounded-xl text-[10px] font-bold uppercase hover:bg-rose-100 disabled:opacity-50 transition-all border border-rose-100"
                  >
                    Dọn dẹp {'>'} 30 ngày
                  </button>
                  <button 
                    disabled={cleaningUp || files.length === 0}
                    onClick={() => handleCleanup(7)}
                    className="px-4 py-2 bg-amber-50 text-amber-600 rounded-xl text-[10px] font-bold uppercase hover:bg-amber-100 disabled:opacity-50 transition-all border border-amber-100"
                  >
                    Dọn dẹp {'>'} 7 ngày
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                      <th className="px-6 py-4">Tên tệp</th>
                      <th className="px-6 py-4">Ngày tạo</th>
                      <th className="px-6 py-4">Dung lượng</th>
                      <th className="px-6 py-4 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {files.map((file) => (
                      <tr key={file.id} className="hover:bg-indigo-50/20 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${file.mimeType?.includes('word') ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>
                              <FileText size={16} />
                            </div>
                            <span className="text-sm font-bold text-slate-800 truncate max-w-md">{file.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-500 font-medium">
                          {new Date(file.createdTime).toLocaleString('vi-VN')}
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-500 font-mono">
                          {file.size ? (Number(file.size) / 1024).toFixed(0) + ' KB' : '—'}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2 p-0">
                            <a 
                              href={`https://drive.google.com/file/d/${file.id}/view`} 
                              target="_blank" 
                              rel="noreferrer"
                              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all"
                              title="Xem tệp"
                            >
                              <ExternalLink size={16} />
                            </a>
                            <button 
                              onClick={() => handleDelete(file.id, file.name)}
                              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg transition-all"
                              title="Xóa tệp"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {files.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-20 text-center text-slate-400 italic text-sm">Thư mục trống</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0">
          <button 
            onClick={onClose} 
            className="px-6 py-3 bg-white border-2 border-slate-900 rounded-xl text-slate-900 text-xs font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm"
          >
            Đóng lại
          </button>
        </div>
      </div>
    </div>
  );
};

// Setting Component
const SettingsPage = () => {
  const [loading, setLoading] = React.useState(false);
  const [status, setStatus] = React.useState<null | 'success' | 'error'>(null);
  const [message, setMessage] = React.useState('');

  const initDb = async () => {
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch('/api/db/init', { credentials: 'include' });
      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setMessage(data.message || 'Hệ thống đã được khởi tạo thành công.');
      } else {
        setStatus('error');
        setMessage(data.error || 'Không thể khởi tạo database. Hãy kiểm tra Google Sheet ID trong .env');
      }
    } catch (err) {
      setStatus('error');
      setMessage('Lỗi kết nối máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Cấu hình Hệ thống</h2>
        <p className="text-slate-500 font-medium">Quản lý và thiết lập nền tảng kỹ thuật cho Hub của bạn.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="card-premium p-8 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
              <Database size={28} />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 leading-tight">Khởi tạo Google Sheets Database</h3>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Hành động một lần</p>
            </div>
          </div>
          
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 italic text-sm text-slate-600 leading-relaxed font-medium">
            Hệ thống sẽ tự động tạo các sheet cần thiết (<span className="text-indigo-600 font-bold">ung_dung, mau_bieu, nhat_ky_in, ...</span>) trong tệp Google Spreadsheet của bạn nếu chúng chưa tồn tại.
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button 
              onClick={initDb}
              disabled={loading}
              className={`btn-primary px-8 py-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" /> : <Zap size={20} />}
              <span>{loading ? 'Đang khởi tạo...' : 'Kích hoạt Cấu trúc Database'}</span>
            </button>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-tight max-w-[200px] text-center sm:text-left">
              Đảm bảo Sheet ID đã được khai báo chính xác trong biến môi trường.
            </div>
          </div>

          {status && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-5 rounded-2xl border flex items-center gap-4 ${status === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-rose-50 border-rose-100 text-rose-800'}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${status === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                {status === 'success' ? <Check size={20} /> : <X size={20} />}
              </div>
              <p className="text-sm font-bold">{message}</p>
            </motion.div>
          )}
        </div>

        <div className="card-premium p-8 bg-slate-900 border-0 text-white overflow-hidden relative">
           <div className="absolute top-0 right-0 p-10 opacity-10">
              <Settings size={140} className="fill-white" />
           </div>
           <div className="relative z-10 space-y-6">
              <h3 className="text-xl font-black tracking-tight">Hướng dẫn Biến môi trường 🔑</h3>
              <div className="space-y-4">
                 {[
                   { k: 'NEXTAUTH_SECRET', v: 'Khóa mã hóa phiên đăng nhập' },
                   { k: 'GOOGLE_SHEET_ID', v: 'ID của file Google Sheet làm DB' },
                   { k: 'GOOGLE_CLIENT_ID', v: 'Cấp từ Google Cloud Console' }
                 ].map((item, i) => (
                   <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                      <code className="text-indigo-400 font-mono text-xs">{item.k}</code>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.v}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, login, logout } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Bảng điều khiển' },
    { path: '/apps', icon: Grid, label: 'Ứng dụng' },
    { path: '/templates', icon: FileText, label: 'Mẫu biểu' },
    { path: '/logs', icon: History, label: 'Nhật ký in' },
    { path: '/settings', icon: Settings, label: 'Cấu hình' },
  ];

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 p-6 relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-violet-500/10 blur-[120px] rounded-full" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-10 text-center max-w-md w-full rounded-[2.5rem] shadow-2xl border border-slate-200 relative z-10 overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-500" />
          <div className="w-24 h-24 bg-indigo-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-indigo-500/40 relative group cursor-default">
            <Zap size={48} className="text-white fill-white group-hover:scale-110 transition-transform duration-500" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-slate-900 mb-2 uppercase">AS PRINT HUB</h1>
          <p className="text-sm font-bold text-indigo-600 mb-1 tracking-[0.2em] uppercase">Vercel Edition</p>
          <p className="text-sm text-slate-500 mb-10 leading-relaxed font-medium px-4">
            Nền tảng tự động hóa báo cáo và in ấn chuyên nghiệp cho AppSheet.
          </p>
          <button 
            onClick={login} 
            className="w-full flex items-center justify-center gap-4 bg-slate-900 hover:bg-black text-white font-black py-4.5 px-6 rounded-3xl transition-all shadow-xl active:scale-[0.98] group"
          >
            <img src="https://www.google.com/favicon.ico" width="22" height="22" alt="google" className="group-hover:rotate-12 transition-transform" />
            TIẾP TỤC VỚI GOOGLE
          </button>
          
          <div className="mt-8 pt-8 border-t border-slate-100">
             <div className="flex justify-center gap-4">
               <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
               <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-loose">
                 V2.0.4 • Smart Cloud Logic
               </p>
             </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden no-scrollbar">
      {/* Sidebar Rail */}
      <motion.aside 
        animate={{ width: isSidebarOpen ? 280 : 96 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="bg-slate-950 text-white flex flex-col shrink-0 relative z-50 shadow-2xl shadow-slate-950/40"
      >
        <div className="h-24 px-6 flex items-center gap-4 shrink-0 overflow-hidden">
          <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-indigo-600/30 shadow-lg shrink-0">
            <Zap size={22} className="fill-white" />
          </div>
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex flex-col"
              >
                <span className="font-black text-lg tracking-tighter leading-none">AS PRINT <span className="text-indigo-400">HUB</span></span>
                <span className="text-[9px] font-black text-slate-500 tracking-[0.2em] mt-1">V2.0 PRO</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-3 overflow-y-auto no-scrollbar">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link 
                key={item.path}
                to={item.path} 
                className={`flex items-center gap-4 px-4 h-14 rounded-2xl transition-all relative group ${isActive ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
              >
                <Icon size={22} className={isActive ? 'text-white' : 'group-hover:scale-110 transition-transform'} />
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.span 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm font-bold tracking-tight whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {!isSidebarOpen && (
                  <div className="absolute left-full ml-4 px-3 py-1.5 bg-slate-800 text-white text-[10px] font-black rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity uppercase tracking-widest z-[100]">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 shrink-0 space-y-4">
           {isSidebarOpen && (
             <button 
              onClick={() => window.open('/HUONG_DAN_TEMPLATES.md', '_blank')}
              className="flex items-center gap-3 w-full p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-400 hover:bg-indigo-500/20 transition-colors"
             >
               <HelpCircle size={18} />
               <span className="text-xs font-bold">Hướng dẫn sử dụng</span>
             </button>
           )}
           
           <div className={`p-4 bg-white/5 rounded-3xl flex items-center ${isSidebarOpen ? 'gap-3' : 'justify-center'} overflow-hidden`}>
              <div className="w-10 h-10 rounded-2xl bg-slate-800 border-2 border-white/10 shrink-0 overflow-hidden">
                {user.picture ? <img src={user.picture} alt="avatar" className="w-full h-full object-cover" /> : <UserIcon size={20} />}
              </div>
              {isSidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black truncate text-white">{user.name}</p>
                  <button onClick={logout} className="text-[10px] font-black text-rose-400/80 hover:text-rose-400 transition-colors uppercase tracking-[0.1em]">Đăng xuất</button>
                </div>
              )}
           </div>

           <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="flex items-center justify-center w-full h-10 rounded-xl bg-white/5 text-slate-500 hover:text-white transition-colors border border-white/5"
          >
            {isSidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>
      </motion.aside>

      {/* Content Area */}
      <main className="flex-1 overflow-y-auto bg-grid-slate relative no-scrollbar">
        <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 h-14 md:h-24 px-8 flex justify-between items-center transition-all">
            <div className="flex items-center gap-4">
               <div className="w-2 h-8 bg-indigo-600 rounded-full" />
               <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase">{menuItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}</h1>
            </div>
            <div className="flex items-center gap-4">
               <div className="hidden lg:flex flex-col items-end mr-4">
                  <div className="text-xs font-black text-slate-900">{user.email}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    <span className="text-[9px] font-black text-slate-400 tracking-widest uppercase">Verified Secure</span>
                  </div>
               </div>
               <button className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:border-indigo-100 hover:shadow-soft transition-all transition-transform active:scale-95">
                  <Settings size={20} />
               </button>
            </div>
        </header>

        <div className="relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="p-4 md:p-8 lg:p-12"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/apps" element={<AppManagement />} />
            <Route path="/templates" element={<TemplateManagement />} />
            <Route path="/logs" element={<HistoryLog />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/report" element={<ReportingPage />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}
