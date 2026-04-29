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
  Zap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const menuItems = [
  { path: '/', label: 'Tổng quan', icon: LayoutDashboard },
  { path: '/apps', label: 'Kết nối AppSheet', icon: Grid },
  { path: '/templates', label: 'Mẫu báo cáo', icon: FileText },
  { path: '/logs', label: 'Nhật ký in', icon: History },
  { path: '/settings', label: 'Cài đặt hệ thống', icon: SettingsIcon },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <aside className="w-72 bg-white border-r border-slate-100 flex flex-col h-screen fixed left-0 top-0 z-40">
      <div className="p-8">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100 group-hover:scale-105 transition-transform duration-500">
            <Zap size={22} strokeWidth={3} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-black text-slate-900 tracking-tighter leading-none">PRINT<span className="text-indigo-600">HUB</span></h1>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Automated Reporting</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1 py-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.path} 
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                isActive 
                  ? 'bg-indigo-50 text-indigo-600' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-900 transition-colors'} />
              <span className={`text-[13px] font-bold tracking-tight ${isActive ? 'font-black' : ''}`}>{item.label}</span>
              {isActive && (
                <motion.div 
                  layoutId="sidebar-active-indicator"
                  className="absolute left-0 w-1 h-5 bg-indigo-600 rounded-r-full"
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-6">
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center overflow-hidden border border-slate-200 shadow-sm">
              {user?.picture ? (
                <img src={user.picture} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="bg-indigo-100 w-full h-full flex items-center justify-center font-black text-indigo-600 uppercase text-lg">
                  {user?.name?.[0]}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-black text-slate-900 truncate">{user?.name || 'Thành viên'}</p>
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 bg-emerald-500 rounded-full" />
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Online</p>
              </div>
            </div>
            <button 
              onClick={logout}
              className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
              title="Đăng xuất"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
