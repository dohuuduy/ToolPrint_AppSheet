import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  Grid, 
  FileText, 
  History, 
  Settings as SettingsIcon,
  LogOut,
  Zap,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const menuItems = [
  { path: '/', label: 'Tổng quan', icon: LayoutDashboard },
  { path: '/apps', label: 'Kết nối AppSheet', icon: Grid },
  { path: '/templates', label: 'Mẫu báo cáo', icon: FileText },
  { path: '/logs', label: 'Nhật ký in', icon: History },
  { path: '/settings', label: 'Cấu hình hệ thống', icon: SettingsIcon },
];

export const Sidebar: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <aside className="w-72 bg-white border-r border-slate-200/60 flex flex-col h-screen md:sticky top-0 shadow-2xl shadow-slate-200/20 md:shadow-none">
      <div className="p-6 md:p-8 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform duration-500">
            <Zap size={22} strokeWidth={3} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-black text-slate-900 tracking-tighter leading-none">PRINT<span className="text-indigo-600">HUB</span></h1>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1 italic">Automated Reports</p>
          </div>
        </Link>
        
        {/* Close Button Mobile */}
        <button 
          onClick={onClose}
          className="md:hidden p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-1.5 py-4 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.path} 
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative ${
                isActive 
                  ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200 -translate-x-1' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon size={18} strokeWidth={2.5} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-900 transition-colors'} />
              <span className={`text-sm font-bold tracking-tight ${isActive ? 'font-black' : ''}`}>{item.label}</span>
              {isActive && (
                <motion.div 
                  layoutId="sidebar-active-indicator"
                  className="absolute left-0 w-1.5 h-6 bg-white/20 rounded-r-full hidden md:block"
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 mt-auto">
        <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-5 transition-all hover:bg-white hover:shadow-2xl hover:shadow-slate-200/60 group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center overflow-hidden border border-slate-200 shadow-sm transition-transform group-hover:scale-110">
              {user?.picture ? (
                <img src={user.picture} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="bg-indigo-50 w-full h-full flex items-center justify-center font-black text-indigo-600 uppercase text-lg">
                  {user?.name?.[0]}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-slate-900 truncate leading-tight">{user?.name || 'Thành viên'}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hoạt động</p>
              </div>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full mt-4 py-3 bg-white border border-slate-200 text-slate-500 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-100 rounded-xl transition-all flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest"
          >
            <LogOut size={14} strokeWidth={3} />
            Đăng xuất
          </button>
        </div>
      </div>
    </aside>
  );
};
