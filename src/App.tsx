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
    <div className="flex flex-col items-center justify-center p-20 gap-4 min-h-[60vh]">
      <div className="animate-spin rounded-2xl h-12 w-12 border-4 border-ocean-600 border-t-transparent shadow-xl"></div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Đang tối ưu dữ liệu...</p>
    </div>
  );

  if (!data.apps.length && !data.templates.length && !data.logs.length) {
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-6 text-center min-h-[60vh]">
        <div className="w-24 h-24 bg-ocean-50 rounded-[2.5rem] flex items-center justify-center text-ocean-300 shadow-inner">
          <Database size={48} />
        </div>
        <div className="max-w-md">
          <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Trung tâm bản in đang trống</h3>
          <p className="text-sm text-slate-500 font-medium mb-8 leading-relaxed">Khởi tạo ứng dụng AppSheet đầu tiên và thiết lập mẫu báo cáo để bắt đầu hành trình tự động hóa của bạn.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
             <Link to="/apps" className="btn-primary-modern px-8">Kết nối AppSheet</Link>
             <Link to="/settings" className="btn-secondary-modern px-8 text-ocean-600">Cài đặt hệ thống</Link>
          </div>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Hệ thống AppSheet', value: data.apps.length, icon: Grid, color: 'bg-ocean-600', trend: 'Hoạt động Ổn định' },
    { label: 'Thư viện Mẫu biểu', value: data.templates.length, icon: FileText, color: 'bg-indigo-600', trend: 'Đã tối ưu hóa' },
    { label: 'Lượt in hệ thống', value: data.logs.length, icon: Printer, color: 'bg-slate-900', trend: 'Tất cả thời gian' },
  ];

  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-20">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Bảng điều khiển</h2>
          <p className="text-slate-500 font-medium text-lg">Hệ thống đồng bộ hóa dữ liệu AppSheet Hub.</p>
        </div>
        <div className="flex items-center gap-4 px-6 py-3 bg-white rounded-2xl border border-slate-200 shadow-sm self-start">
           <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/20" />
           <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Database: Online</span>
        </div>
      </div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="card-modern p-8 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Icon size={80} />
              </div>
              <div className="flex justify-between items-start mb-6">
                <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center text-white shadow-xl shadow-opacity-30 group-hover:rotate-6 transition-transform duration-500`}>
                  <Icon size={28} />
                </div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-100">{stat.trend}</div>
              </div>
              <div className="text-5xl font-black text-slate-900 mb-2 tracking-tighter">{stat.value}</div>
              <div className="text-blue-500 font-bold text-sm uppercase tracking-widest">{stat.label}</div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Recent Activity */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <div className="card-modern overflow-hidden bg-white/50">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <History className="text-ocean-600" size={24} />
                <h3 className="text-lg font-black text-slate-900 tracking-tight">Hoạt động gần đây</h3>
              </div>
              <Link to="/logs" className="text-sm font-bold text-ocean-600 hover:underline">Tất cả lịch sử</Link>
            </div>
            <div className="p-4">
              <div className="space-y-2">
                {data.logs.length > 0 ? data.logs.slice(0, 6).map((log: any, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={i} 
                    className="flex items-center gap-5 p-5 hover:bg-white rounded-2xl transition-all border border-transparent hover:border-slate-100 shadow-sm shadow-transparent hover:shadow-slate-100"
                  >
                    <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center transition-colors group-hover:bg-ocean-50 group-hover:text-ocean-600">
                      <Printer size={22} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-bold text-slate-800 truncate leading-snug">{log.ten_mau}</p>
                      <p className="text-xs font-medium text-slate-400">ID hàng: {log.ma_id?.substring(0, 15)}...</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-ocean-600">{new Date(log.ngay_tao).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(log.ngay_tao).toLocaleDateString('vi-VN')}</p>
                    </div>
                  </motion.div>
                )) : (
                  <div className="py-24 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-200">
                      <History size={32} />
                    </div>
                    <p className="text-slate-400 font-medium italic">Chưa có nhật ký in nào được ghi lại</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Technical Guide */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
           <div className="card-modern bg-ocean-950 border-0 p-8 text-white relative overflow-hidden group">
              <div className="absolute -top-4 -right-4 p-8 opacity-20 group-hover:scale-125 transition-transform duration-1000 rotate-12">
                <Zap size={180} className="fill-ocean-400 text-ocean-400" />
              </div>
              <div className="relative z-10 space-y-8">
                <div>
                  <h3 className="text-2xl font-black tracking-tight mb-2">Endpoint Action ⚡️</h3>
                  <p className="text-ocean-300 text-sm font-medium">Dùng công thức này trong AppSheet để gọi lệnh in.</p>
                </div>
                
                <div className="space-y-4">
                  <div className="p-5 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-sm group/code cursor-pointer active:scale-95 transition-all">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] text-ocean-400 font-black uppercase tracking-widest">Full Action URL:</span>
                      <Copy size={14} className="text-white/40 group-hover/code:text-white transition-colors" />
                    </div>
                    <code className="text-xs font-mono leading-relaxed break-all block text-white/90">
                      {`CONCATENATE("${window.location.origin}/report?template=ID_MAU&id=", ENCODEURL([MA_ID]))`}
                    </code>
                  </div>
                  
                  <div className="flex gap-4 items-start p-4 bg-white/5 rounded-2xl">
                    <Info size={18} className="text-ocean-400 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-white/60 font-medium leading-relaxed">
                      Hướng dẫn: Thay <span className="text-white">ID_MAU</span> bằng mã mẫu báo cáo và <span className="text-white">[MA_ID]</span> bằng cột Key của bảng chính.
                    </p>
                  </div>
                </div>
              </div>
           </div>

           <div className="card-modern p-8 bg-slate-50/50 border-dashed border-2 border-slate-200">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Trạng thái hạ tầng</h3>
              <div className="space-y-4">
                {[
                  { name: 'AppSheet Integration', status: 'Online', color: 'bg-emerald-500' },
                  { name: 'Google Cloud Storage', status: 'Active', color: 'bg-ocean-500' },
                  { name: 'Print Engine V2', status: 'Ready', color: 'bg-slate-900' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 ${item.color} rounded-full`} />
                      <span className="text-xs font-black text-slate-700 uppercase tracking-tighter">{item.name}</span>
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.status}</span>
                  </div>
                ))}
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
            folder_xuat_id: '',
            bang_chinh: 'KhachHang'
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
            folder_xuat_id: '',
            bang_chinh: 'KhachHang'
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
      folder_xuat_id: app.folder_xuat_id || '',
      bang_chinh: app.bang_chinh || 'KhachHang'
    });
    setShowForm(true);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-24 text-slate-400 gap-4">
      <div className="w-16 h-16 border-4 border-ocean-600/20 border-t-ocean-600 rounded-full animate-spin"></div>
      <p className="text-xs font-black uppercase tracking-[0.2em] animate-pulse">Đang nạp danh sách ứng dụng...</p>
    </div>
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-6 bg-ocean-600 rounded-full" />
            <span className="text-[10px] font-black text-ocean-600 uppercase tracking-widest">Resource Management</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Quản lý Ứng dụng</h2>
          <p className="text-slate-500 font-medium text-sm">Cấu hình kết nối API cho các dự án AppSheet của bạn.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group hidden sm:block">
            <input 
              type="text" 
              placeholder="Tìm tên ứng dụng..." 
              className="pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-[1.25rem] text-sm focus:ring-4 focus:ring-ocean-500/10 focus:border-ocean-500 transition-all w-64 outline-none font-medium"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
            <Search size={18} className="absolute left-4 top-3.5 text-slate-400" />
          </div>
          <button 
            onClick={() => {
              setShowForm(!showForm);
              if (!showForm) setEditingApp(null);
            }} 
            className="btn-primary-modern !py-3 !rounded-[1.25rem]"
          >
            {showForm ? <X size={20} /> : <Plus size={20} />} 
            <span>{showForm ? 'Hủy bỏ' : 'Kết nối mới'}</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="card-modern p-1 sm:p-2 border-ocean-100 bg-ocean-50/30"
          >
            <div className="bg-white rounded-[1.25rem] p-6 lg:p-10 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  {/* Left Column: API Info */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-2 px-1">
                      <div className="w-8 h-8 rounded-lg bg-ocean-100 flex items-center justify-center text-ocean-600">
                        <Zap size={18} className="fill-ocean-600" />
                      </div>
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">Xác thực AppSheet API</h4>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tên ứng dụng nội bộ</label>
                        <input required value={newApp.ten_ung_dung} onChange={e => setNewApp({...newApp, ten_ung_dung: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-4 focus:ring-ocean-500/10 focus:border-ocean-500 transition-all outline-none" placeholder="VD: Quản lý Kho Hà Nội" />
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Bảng chính AppSheet</label>
                          <input required value={newApp.bang_chinh} onChange={e => setNewApp({...newApp, bang_chinh: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-4 focus:ring-ocean-500/10 focus:border-ocean-500 transition-all outline-none" placeholder="VD: Orders" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Application ID</label>
                          <input required value={newApp.app_id} onChange={e => setNewApp({...newApp, app_id: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono focus:bg-white focus:ring-4 focus:ring-ocean-500/10 focus:border-ocean-500 transition-all outline-none" placeholder="xxxxxxxx-xxxx-..." />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">API Key (Access Key)</label>
                        <div className="relative">
                          <input type="password" required value={newApp.khoa_api} onChange={e => setNewApp({...newApp, khoa_api: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pl-12 text-sm font-mono focus:bg-white focus:ring-4 focus:ring-ocean-500/10 focus:border-ocean-500 transition-all outline-none" placeholder="Nhập khóa bí mật..." />
                          <Key size={18} className="absolute left-4 top-3.5 text-slate-400" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Google Drive Info */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-2 px-1">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                        <Cloud size={18} className="fill-emerald-600" />
                      </div>
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">Hệ thống lưu trữ Drive</h4>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Folder ID: Thư mục Mẫu (DOCX/XLSX)</label>
                        <input required value={newApp.folder_mau_id} onChange={e => setNewApp({...newApp, folder_mau_id: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono focus:bg-white focus:ring-4 focus:ring-ocean-500/10 focus:border-ocean-500 transition-all outline-none" placeholder="ID thư mục chứa template..." />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Folder ID: Thư mục Xuất (PDF/WORD)</label>
                        <input required value={newApp.folder_xuat_id} onChange={e => setNewApp({...newApp, folder_xuat_id: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono focus:bg-white focus:ring-4 focus:ring-ocean-500/10 focus:border-ocean-500 transition-all outline-none" placeholder="ID thư mục chứa file kết quả..." />
                      </div>

                      <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 flex gap-4">
                        <Info size={20} className="text-amber-600 shrink-0 mt-0.5" />
                        <p className="text-[11px] text-amber-800 font-medium leading-relaxed">
                          Đảm bảo bạn đã cấp quyền cho tài khoản Google kết nối được phép đọc/ghi vào các thư mục này. <b>Application ID</b> có thể tìm thấy trong URL của AppSheet Editor.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-slate-100">
                  <button 
                    type="button" 
                    onClick={testConnection} 
                    disabled={testingConnection}
                    className="btn-secondary-modern !rounded-xl order-2 sm:order-1"
                  >
                    {testingConnection ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} />}
                    <span>Kiểm tra kết nối API</span>
                  </button>
                  <button type="submit" className="btn-primary-modern !py-3.5 !rounded-xl order-1 sm:order-2 px-12">
                    {editingApp ? 'Cập nhật cấu hình' : 'Thiết lập kết nối Hub'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Table Container */}
      <div className="card-modern overflow-hidden bg-white">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 cursor-pointer group" onClick={() => handleSort('ten_ung_dung')}>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-ocean-600 transition-colors">Tên ứng dụng</span>
                    {sortConfig.key === 'ten_ung_dung' && (sortConfig.direction === 'asc' ? <ChevronUp size={12} className="text-ocean-600" /> : <ChevronDown size={12} className="text-ocean-600" />)}
                  </div>
                </th>
                <th className="px-8 py-5 hidden md:table-cell">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dữ liệu nguồn</span>
                </th>
                <th className="px-8 py-5 hidden lg:table-cell">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Application ID</span>
                </th>
                <th className="px-8 py-5">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-right block">Hành động</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedApps.length > 0 ? paginatedApps.map((app: any) => (
                <tr key={app.ma_id} className="hover:bg-ocean-50/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="font-bold text-slate-800 text-lg group-hover:text-ocean-700 transition-colors">{app.ten_ung_dung || app.ten_app}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active System</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 hidden md:table-cell">
                    <div className="flex flex-col gap-1">
                       <span className="text-xs font-bold text-slate-700">{app.bang_chinh || 'Main Table'}</span>
                       <span className="text-[10px] font-medium text-slate-400 italic">Database Entry Point</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 hidden lg:table-cell">
                    <code className="text-[11px] font-mono bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg border border-slate-200">
                      {app.app_id?.substring(0, 16)}...
                    </code>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-end items-center gap-2">
                       <button onClick={() => setManagingFilesForApp(app)} className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-ocean-600 hover:border-ocean-300 hover:shadow-xl transition-all" title="Lịch sử xuất file"><History size={18} /></button>
                       <button onClick={() => setViewingApp(app)} className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-ocean-600 hover:border-ocean-300 hover:shadow-xl transition-all" title="Chi tiết kết nối"><Eye size={18} /></button>
                       <button onClick={() => startEdit(app)} className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-ocean-600 hover:border-ocean-300 hover:shadow-xl transition-all" title="Chỉnh sửa"><Edit size={18} /></button>
                       <button onClick={() => handleDelete(app.ma_id, app.ten_ung_dung || app.ten_app)} className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-300 hover:shadow-xl transition-all" title="Xóa bỏ"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-30 grayscale saturate-0">
                       <Layout size={64} className="text-slate-300" />
                       <p className="text-sm font-black uppercase tracking-[0.3em] text-slate-400">Chưa có ứng dụng được kết nối</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-8 py-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/30">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hiển thị {paginatedApps.length} / {filteredApps.length} bản ghi</p>
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => setCurrentPage(1)} 
                disabled={currentPage === 1}
                className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-ocean-600 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-sm"
              >
                <ChevronsLeft size={16} />
              </button>
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} 
                disabled={currentPage === 1}
                className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-ocean-600 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-sm"
              >
                <ChevronLeft size={16} />
              </button>
              <div className="flex items-center px-4 h-10 rounded-xl bg-ocean-600 text-white font-black text-xs shadow-lg shadow-ocean-600/20">
                 {currentPage} / {totalPages}
              </div>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} 
                disabled={currentPage === totalPages}
                className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-ocean-600 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-sm"
              >
                <ChevronRight size={16} />
              </button>
              <button 
                onClick={() => setCurrentPage(totalPages)} 
                disabled={currentPage === totalPages}
                className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-ocean-600 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-sm"
              >
                <ChevronsRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {viewingApp && (
         <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl border border-white"
            >
               <div className="bg-ocean-950 p-8 text-white relative">
                  <Zap size={100} className="absolute -right-5 -top-5 text-white/5 rotate-12" />
                  <div className="flex justify-between items-start relative z-10">
                    <div>
                      <h3 className="text-2xl font-black tracking-tight">{viewingApp.ten_ung_dung || viewingApp.ten_app}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                        <span className="text-[10px] font-black text-ocean-400 uppercase tracking-widest">Protocol: JSON REST API</span>
                      </div>
                    </div>
                    <button onClick={() => setViewingApp(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={24} /></button>
                  </div>
               </div>
               <div className="p-8 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Dữ liệu nguồn</p>
                      <p className="text-sm font-bold text-slate-800">{viewingApp.bang_chinh}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Trạng thái Hub</p>
                      <p className="text-sm font-bold text-emerald-600">Connected</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Application ID</p>
                        <div className="bg-ocean-50 text-ocean-700 font-mono text-xs px-4 py-3 rounded-xl border border-ocean-100 break-all">
                           {viewingApp.app_id}
                        </div>
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Google Drive Storage</p>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs p-3 bg-white border border-slate-200 rounded-xl">
                            <span className="text-slate-500">Mẫu:</span>
                            <span className="font-mono text-[11px] text-slate-800">{viewingApp.folder_mau_id}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs p-3 bg-white border border-slate-200 rounded-xl">
                            <span className="text-slate-500">Xuất:</span>
                            <span className="font-mono text-[11px] text-slate-800">{viewingApp.folder_xuat_id}</span>
                          </div>
                        </div>
                     </div>
                  </div>
                  <button onClick={() => setViewingApp(null)} className="btn-primary-modern w-full !py-4 !rounded-2xl">Đóng thông tin</button>
               </div>
            </motion.div>
         </div>
      )}

      {managingFilesForApp && (
        <FileManagerModal 
          app={managingFilesForApp} 
          onClose={() => setManagingFilesForApp(null)} 
        />
      )}
    </div>
  );
};

const TemplateManagement = () => {
  const [templates, setTemplates] = React.useState([]);
  const [apps, setApps] = React.useState([]);
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
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '_')
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
            ten_mau: '', ma_mau: '', file_id_drive: '', loai_file: 'DOCX', 
            thu_muc_luu: '', ma_ung_dung: '', bang_chinh: '', key_col: '', 
            child_table: '', foreign_key: '', child_name: 'items'
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
            ten_mau: '', ma_mau: '', file_id_drive: '', loai_file: 'DOCX', 
            thu_muc_luu: '', ma_ung_dung: '', bang_chinh: '', key_col: '', 
            child_table: '', foreign_key: '', child_name: 'items'
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

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-24 text-slate-400 gap-4">
      <div className="w-16 h-16 border-4 border-ocean-600/20 border-t-ocean-600 rounded-full animate-spin"></div>
      <p className="text-xs font-black uppercase tracking-[0.2em] animate-pulse">Đang nạp danh sách mẫu biểu...</p>
    </div>
  );

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-6 bg-ocean-600 rounded-full" />
            <span className="text-[10px] font-black text-ocean-600 uppercase tracking-widest">Generator Engine</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Quản lý Mẫu biểu</h2>
          <p className="text-slate-500 font-medium text-sm">Thiết lập tham số trộn dữ liệu và quan hệ Master-Detail cho báo cáo.</p>
        </div>
        
        <button 
          onClick={() => { setShowForm(true); setEditingTemplate(null); resetForm(); }}
          className="btn-primary-modern flex items-center gap-3 px-8 py-4"
        >
          <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center"><Plus size={16} /></div>
          <span>THIẾT LẬP MẪU MỚI</span>
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            className="card-modern overflow-hidden border-ocean-100 shadow-2xl mb-10"
          >
            <div className="bg-ocean-950 p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                   <Settings2 size={24} className="text-ocean-400" />
                </div>
                <div>
                   <h3 className="font-black text-lg tracking-tight">{editingTemplate ? 'Chỉnh sửa Cấu hình' : 'Thiết lập Mẫu biểu mới'}</h3>
                   <p className="text-ocean-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">Configuration Engine v2.0</p>
                </div>
              </div>
              <button type="button" onClick={() => setShowForm(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 lg:p-12 bg-white space-y-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-4 space-y-8">
                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                       <Database size={14} /> Thông tin cơ bản
                    </h4>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Tên mẫu báo cáo</label>
                      <input required value={newTemplate.ten_mau} onChange={handleTenMauChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-ocean-500/10 outline-none transition-all" placeholder="VD: Hợp đồng mua bán" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Mã định danh (Slug)</label>
                      <input readOnly value={newTemplate.ma_mau} className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-mono text-ocean-600 outline-none cursor-not-allowed uppercase" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Loại file</label>
                          <select value={newTemplate.loai_file} onChange={e => setNewTemplate({...newTemplate, loai_file: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-ocean-500/10 transition-all">
                            <option value="DOCX">Word</option>
                            <option value="XLSX">Excel</option>
                          </select>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Hub AppSheet</label>
                          <select required value={newTemplate.ma_ung_dung} onChange={e => {
                            const val = e.target.value;
                            setNewTemplate({...newTemplate, ma_ung_dung: val});
                            const app: any = apps.find((a: any) => a.ma_id === val);
                            if (app) setNewTemplate(prev => ({...prev, bang_chinh: app.bang_chinh}));
                          }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-ocean-500/10 transition-all">
                            <option value="">-- Chọn App --</option>
                            {apps.map((app: any) => <option key={app.ma_id} value={app.ma_id}>{app.ten_ung_dung || app.ten_app}</option>)}
                          </select>
                       </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-8 space-y-10">
                   <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-200/60 relative overflow-hidden">
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                         <Layers size={14} /> Cấu trúc bảng & Quan hệ
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                           <span className="text-[10px] font-black text-ocean-600 uppercase tracking-widest block mb-2 px-1">Master Table</span>
                           <div className="space-y-4">
                              <input required value={newTemplate.bang_chinh} onChange={e => setNewTemplate({...newTemplate, bang_chinh: e.target.value})} onBlur={() => fetchAppSheetCols(newTemplate.bang_chinh)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm" placeholder="Tên bảng chính..." />
                              <div className="flex gap-2">
                                <select value={newTemplate.key_col} onChange={e => setNewTemplate({...newTemplate, key_col: e.target.value})} className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm">
                                  <option value="">-- Cột Khóa --</option>
                                  {mainCols.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                                <button type="button" onClick={() => fetchAppSheetCols(newTemplate.bang_chinh)} className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50">
                                   <RefreshCw size={16} className={isFetchingCols ? "animate-spin" : ""} />
                                </button>
                              </div>
                           </div>
                        </div>
                        <div className="space-y-4">
                           <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest block mb-2 px-1">Detail Table</span>
                           <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-3">
                                <input value={newTemplate.child_table} onChange={e => setNewTemplate({...newTemplate, child_table: e.target.value})} onBlur={() => fetchAppSheetCols(newTemplate.child_table, true)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm" placeholder="Bảng con..." />
                                <select value={newTemplate.foreign_key} onChange={e => setNewTemplate({...newTemplate, foreign_key: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm">
                                  <option value="">-- Khóa ngoại --</option>
                                  {childCols.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                              </div>
                              <input value={newTemplate.child_name} onChange={e => setNewTemplate({...newTemplate, child_name: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono" placeholder="Biến danh sách (VD: items)" />
                           </div>
                        </div>
                      </div>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Google Drive File ID (Template)</label>
                        <input required value={newTemplate.file_id_drive} onChange={e => setNewTemplate({...newTemplate, file_id_drive: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-mono" placeholder="ID file mẫu..." />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Folder ID (Save to...)</label>
                        <input value={newTemplate.thu_muc_luu} onChange={e => setNewTemplate({...newTemplate, thu_muc_luu: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-mono" placeholder="Folder ID output..." />
                     </div>
                   </div>
                </div>
              </div>

              <div className="p-8 bg-ocean-950 rounded-[2.5rem] text-white">
                 <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-ocean-400">Live Action Preview</span>
                    <button type="button" onClick={() => copyToClipboard(previewActionLink(), 'Đã sao chép!')} className="text-[10px] font-black text-ocean-400 uppercase tracking-widest hover:text-white flex items-center gap-2">
                       <Copy size={12} /> Sao chép công thức
                    </button>
                 </div>
                 <div className="p-5 bg-white/5 rounded-2xl border border-white/10 font-mono text-xs text-ocean-100 overflow-x-auto whitespace-nowrap scrollbar-hide">
                    {previewActionLink()}
                 </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-slate-100">
                <button type="submit" className="btn-primary-modern !py-4 !px-16 !rounded-2xl shadow-xl shadow-ocean-600/20">
                  {editingTemplate ? 'Cập nhật tài liệu' : 'Kích hoạt mẫu biểu'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {paginatedTemplates.length > 0 ? paginatedTemplates.map((tpl: any) => (
           <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={tpl.ma_id} className="card-modern group hover:border-ocean-300 transition-all bg-white flex flex-col h-full overflow-hidden">
              <div className="p-6 space-y-5 flex-1">
                 <div className="flex justify-between items-start">
                    <div className="w-12 h-12 rounded-2xl bg-ocean-50 flex items-center justify-center text-ocean-600 group-hover:bg-ocean-600 group-hover:text-white transition-all duration-500">
                       {tpl.loai_file === 'DOCX' ? <FileText size={24} /> : <Grid size={24} />}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${tpl.loai_file === 'DOCX' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {tpl.loai_file}
                    </span>
                 </div>
                 <div>
                    <h4 className="text-xl font-black text-slate-800 tracking-tight group-hover:text-ocean-700 transition-colors uppercase">{tpl.ten_mau}</h4>
                    <p className="text-[10px] font-mono text-slate-400 mt-1 uppercase tracking-widest">SLUG: {tpl.ma_mau}</p>
                 </div>
                 <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100/50">
                       <Layout size={14} className="text-slate-400" />
                       <span className="text-xs font-bold text-slate-700 truncate">{apps.find((a: any) => a.ma_id === tpl.ma_ung_dung)?.ten_ung_dung || 'Platform Hub'}</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100/50">
                       <Database size={14} className="text-slate-400" />
                       <span className="text-xs font-bold text-slate-700 truncate">{tpl.bang_chinh}</span>
                    </div>
                 </div>
              </div>
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                 <button onClick={() => setViewingTpl(tpl)} className="text-[10px] font-black text-ocean-600 uppercase tracking-widest hover:text-ocean-800 transition-all flex items-center gap-2">
                    <Copy size={12} /> AppSheet Action
                 </button>
                 <div className="flex items-center gap-1">
                    <button onClick={() => startEdit(tpl)} className="w-8 h-8 rounded-lg hover:bg-white hover:text-ocean-600 flex items-center justify-center text-slate-400 transition-all"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(tpl.ma_id, tpl.ten_mau)} className="w-8 h-8 rounded-lg hover:bg-white hover:text-red-500 flex items-center justify-center text-slate-400 transition-all"><Trash2 size={16} /></button>
                 </div>
              </div>
           </motion.div>
         )) : (
            <div className="col-span-full py-24 flex flex-col items-center gap-4 opacity-30 grayscale">
               <FilePlus size={64} className="text-slate-300" />
               <p className="text-sm font-black uppercase tracking-[0.3em] text-slate-400">Chưa có mẫu biểu cấu hình</p>
            </div>
         )}
      </div>

      {viewingTpl && (
         <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-2xl border border-white">
               <div className="bg-ocean-950 p-10 text-white relative">
                  <div className="flex items-center gap-4 relative z-10">
                     <div className="w-14 h-14 rounded-2xl bg-ocean-400/20 flex items-center justify-center"><Zap size={28} className="text-ocean-400" /></div>
                     <div><h3 className="text-2xl font-black tracking-tight uppercase">{viewingTpl.ten_mau}</h3><p className="text-ocean-500 text-xs font-black uppercase tracking-widest">AppSheet Action Formula</p></div>
                  </div>
                  <button onClick={() => setViewingTpl(null)} className="absolute top-8 right-8 p-3 hover:bg-white/10 rounded-full transition-colors text-white font-bold text-2xl">×</button>
               </div>
               <div className="p-10 space-y-8">
                  <div className="space-y-4">
                     <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Sao chép công thức vào AppSheet Action</p>
                     <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-200 flex flex-col gap-4">
                        <pre className="text-xs font-mono text-slate-700 whitespace-pre-wrap break-all leading-relaxed">
                           {generateActionLink(viewingTpl)}
                        </pre>
                        <button onClick={() => copyToClipboard(generateActionLink(viewingTpl), 'Đã chép!')} className="btn-primary-modern !py-3 !rounded-xl !text-[10px] w-full">SAO CHÉP CÔNG THỨC</button>
                     </div>
                  </div>
                  <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex gap-4">
                    <Info size={20} className="text-blue-600 shrink-0" />
                    <p className="text-[11px] text-blue-800 font-medium leading-relaxed italic">
                      <b>Hướng dẫn:</b> Trong AppSheet, hãy tạo một Action mới loại "External: open a website", dán công thức trên vào phần <b>Target</b>.
                    </p>
                  </div>
                  <button onClick={() => setViewingTpl(null)} className="btn-secondary-modern w-full !py-4 font-black">HOÀN TẤT</button>
               </div>
            </motion.div>
         </div>
      )}
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
    <div className="space-y-6 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-6 bg-ocean-600 rounded-full" />
            <span className="text-[10px] font-black text-ocean-600 uppercase tracking-widest">Auditing & Compliance</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Nhật ký Hệ thống</h2>
          <p className="text-slate-500 font-medium text-sm">Theo dõi toàn bộ lịch sử in ấn, xuất báo cáo và trạng thái giao dịch.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group">
            <input 
              type="text" 
              placeholder="Tìm theo ID, tên mẫu..." 
              className="pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-[1.25rem] text-sm focus:ring-4 focus:ring-ocean-500/10 focus:border-ocean-500 transition-all w-72 outline-none font-medium"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
            <Search size={18} className="absolute left-4 top-3.5 text-slate-400" />
          </div>
          <button onClick={fetchLogs} className="p-3 bg-white border border-slate-200 rounded-[1.25rem] hover:bg-slate-50 text-slate-400 hover:text-ocean-600 transition-all">
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      <div className="card-modern overflow-hidden bg-white border-slate-200/60 shadow-xl shadow-slate-200/20">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-ocean-950 text-white">
                <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-ocean-400">Thời gian</th>
                <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-ocean-400">Nội dung / Mẫu biểu</th>
                <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-ocean-400">Định danh Record</th>
                <th className="px-6 py-5 text-center text-[10px] font-black uppercase tracking-widest text-ocean-400">Trạng thái</th>
                <th className="px-6 py-5 text-right text-[10px] font-black uppercase tracking-widest text-ocean-400">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedLogs.length > 0 ? paginatedLogs.map((log: any, i) => (
                <tr key={i} className="hover:bg-ocean-50/30 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-ocean-600 transition-all">
                          <Clock size={18} />
                       </div>
                       <div className="flex flex-col">
                          <span className="text-xs font-black text-slate-800">{new Date(log.ngay_tao).toLocaleDateString('vi-VN')}</span>
                          <span className="text-[10px] font-medium text-slate-400">{new Date(log.ngay_tao).toLocaleTimeString('vi-VN')}</span>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                       <span className="text-sm font-bold text-slate-800 tracking-tight">{log.ten_mau}</span>
                       <span className="text-[10px] font-mono text-slate-400 uppercase tracking-tighter">APP_REF: {log.ma_ung_dung?.slice(0, 8)}...</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-ocean-600" />
                       <span className="text-xs font-mono font-bold text-ocean-600">{log.ma_id?.length > 15 ? log.ma_id.slice(0, 15) + '...' : log.ma_id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex justify-center text-[9px] font-black uppercase tracking-widest">
                       <span className={`px-3 py-1 rounded-full flex items-center gap-1.5 ${
                         log.trang_thai === 'Thành công' || log.trang_thai === 'Hoàn tất' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                       }`}>
                          <div className={`w-1 h-1 rounded-full ${log.trang_thai === 'Thành công' || log.trang_thai === 'Hoàn tất' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          {log.trang_thai || 'Hoàn tất'}
                       </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="p-2.5 bg-slate-100 text-slate-400 rounded-xl hover:bg-ocean-600 hover:text-white transition-all">
                       <ExternalLink size={16} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="py-32 text-center grayscale opacity-30">
                     <History size={48} className="text-slate-300 mx-auto mb-4" />
                     <p className="text-sm font-black uppercase tracking-[0.3em] text-slate-400">Không có dữ liệu nhật ký</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {totalPages > 1 && (
          <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trang {currentPage} / {totalPages}</span>
            <div className="flex gap-2">
               <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center disabled:opacity-50"><ChevronLeft size={16} /></button>
               <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center disabled:opacity-50"><ChevronRight size={16} /></button>
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Bảng điều khiển' },
    { path: '/apps', icon: Grid, label: 'Ứng dụng' },
    { path: '/templates', icon: FileText, label: 'Mẫu biểu' },
    { path: '/logs', icon: History, label: 'Nhật ký in' },
    { path: '/settings', icon: Settings, label: 'Cấu hình' },
  ];

  // Auto-collapse sidebar on smaller screens
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-ocean-50 p-6 relative overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-ocean-500/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-500/10 blur-[150px] rounded-full" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/80 backdrop-blur-xl p-12 text-center max-w-lg w-full rounded-[3.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-white relative z-10 overflow-hidden"
        >
          <div className="w-28 h-28 bg-ocean-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-ocean-600/40 relative group cursor-default" id="login-logo">
            <Zap size={56} className="text-white fill-white group-hover:scale-110 transition-transform duration-500" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 mb-3 leading-none">AS PRINT HUB</h1>
          <div className="inline-block px-4 py-1.5 bg-ocean-100 text-ocean-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-10">Professional Printing Engine</div>
          
          <button 
            onClick={login} 
            className="w-full h-16 flex items-center justify-center gap-4 bg-slate-900 hover:bg-black text-white font-black rounded-[1.5rem] transition-all shadow-xl active:scale-[0.97] group text-lg"
            id="login-button"
          >
            <img src="https://www.google.com/favicon.ico" width="24" height="24" alt="google" className="group-hover:rotate-12 transition-transform" />
            TIẾP TỤC VỚI GOOGLE
          </button>
          
          <div className="mt-12 text-slate-400 font-medium text-xs flex items-center justify-center gap-4">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
             <span>Hệ thống sẵn sàng tại: <b>Production</b></span>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden no-scrollbar">
      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Rail / Desktop & Mobile Drawer */}
      <motion.aside 
        initial={false}
        animate={{ 
          width: isSidebarOpen ? 280 : (isMobileMenuOpen ? 280 : 96),
          x: (isMobileMenuOpen || window.innerWidth >= 1024) ? 0 : -300
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`bg-ocean-950 text-white flex flex-col shrink-0 fixed inset-y-0 left-0 lg:relative z-[110] shadow-2xl transition-all ${isSidebarOpen ? 'lg:w-[280px]' : 'lg:w-[96px]'}`}
      >
        <div className="h-28 px-6 flex items-center gap-4 shrink-0 overflow-hidden">
          <div className="w-12 h-12 bg-ocean-600 rounded-2xl flex items-center justify-center shadow-ocean-600/30 shadow-lg shrink-0">
            <Zap size={24} className="fill-white" />
          </div>
          <AnimatePresence>
            {(isSidebarOpen || isMobileMenuOpen) && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex flex-col"
              >
                <span className="font-extrabold text-xl tracking-tighter leading-none">AS PRINT <span className="text-ocean-400 underline decoration-ocean-500/50 decoration-4 underline-offset-4">HUB</span></span>
                <span className="text-[10px] font-black text-ocean-400/50 tracking-[0.2em] mt-1.5 uppercase">v2.5 Deep Cloud</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto no-scrollbar">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            const expanded = isSidebarOpen || isMobileMenuOpen;
            return (
              <Link 
                key={item.path}
                id={`nav-${item.path.replace('/', '') || 'home'}`}
                to={item.path} 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`nav-item group ${isActive ? 'nav-item-active' : 'nav-item-inactive'}`}
              >
                <Icon size={22} className={isActive ? 'text-white' : 'group-hover:scale-110 transition-transform group-hover:text-ocean-400'} />
                <AnimatePresence>
                  {expanded && (
                    <motion.span 
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-sm font-bold truncate"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {!expanded && (
                  <div className="absolute left-full ml-4 px-3 py-2 bg-slate-800 text-white text-[10px] font-black rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all uppercase tracking-widest z-[150] shadow-xl whitespace-nowrap">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 shrink-0 space-y-4">
           {(isSidebarOpen || isMobileMenuOpen) && (
             <div className="p-5 bg-ocean-900/50 rounded-3xl border border-white/5 space-y-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-ocean-400">
                    {user.picture ? <img src={user.picture} alt="ava" className="w-full h-full object-cover rounded-xl" /> : <UserIcon size={20} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black truncate text-white uppercase tracking-tight">{user.name}</p>
                    <p className="text-[10px] text-ocean-400 font-bold truncate">{user.email}</p>
                  </div>
                </div>
                <button onClick={logout} className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[10px] font-black rounded-xl transition-all uppercase tracking-widest flex items-center justify-center gap-2">
                  <LogOut size={14} />
                  <span>Đăng xuất</span>
                </button>
             </div>
           )}
           
           {!isSidebarOpen && !isMobileMenuOpen && (
              <div className="flex flex-col gap-3 items-center">
                 <button onClick={logout} id="logout-button-collapsed" className="w-12 h-12 rounded-2xl bg-white/5 text-red-400 flex items-center justify-center hover:bg-red-500/10 transition-colors shadow-inner" title="Đăng xuất">
                    <LogOut size={20} />
                 </button>
                 <div className="w-10 h-10 rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                    <img src={user.picture} alt="ava" className="w-full h-full object-cover" />
                 </div>
              </div>
           )}

           <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            id="sidebar-toggle-desktop"
            className="hidden lg:flex items-center justify-center w-full h-12 rounded-2xl bg-white/5 text-ocean-400 hover:text-white transition-all border border-white/5 shadow-inner"
          >
            {isSidebarOpen ? <ChevronsLeft size={20} /> : <ChevronsRight size={20} />}
          </button>
        </div>
      </motion.aside>

      {/* Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden bg-white">
        {/* Navbar */}
        <header className="glass-header h-20 md:h-24 px-6 md:px-10 flex justify-between items-center transition-all">
            <div className="flex items-center gap-6">
               <button 
                onClick={() => setIsMobileMenuOpen(true)}
                id="mobile-menu-toggle"
                className="lg:hidden p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-100"
               >
                 <Grid size={22} />
               </button>
               <div className="hidden sm:flex items-center gap-4">
                  <div className="w-1.5 h-10 bg-ocean-600 rounded-full shadow-lg shadow-ocean-600/40" />
                  <div>
                    <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tighter uppercase leading-none">
                      {menuItems.find(i => i.path === location.pathname)?.label || 'Báo cáo'}
                    </h1>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Hệ thống Print HUB PRO</p>
                  </div>
               </div>
            </div>
            
            <div className="flex items-center gap-3">
               <div className="hidden md:flex items-center gap-3 px-5 py-2.5 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-sm" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Dữ liệu an toàn</span>
               </div>
               <button className="w-12 md:w-14 h-12 md:h-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 hover:text-ocean-600 hover:border-ocean-600/30 hover:shadow-xl transition-all active:scale-95">
                  <Settings size={22} />
               </button>
            </div>
        </header>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="p-6 md:p-10 lg:p-16 w-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
          
          {/* Global Footer Accent */}
          <footer className="mt-auto py-10 px-10 text-center opacity-30 pointer-events-none">
             <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">DESIGNED FOR DEEP AUTOMATION • 2026</p>
          </footer>
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
