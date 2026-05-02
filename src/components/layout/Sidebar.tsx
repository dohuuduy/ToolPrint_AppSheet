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
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen md:sticky top-0 transition-all">
      <div className="p-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-sm">
            <Zap size={20} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-none uppercase">Print<span className="text-indigo-600">Hub</span></h1>
            <p className="text-[10px] text-slate-400 font-medium uppercase mt-1">Enterprise Solution</p>
          </div>
        </Link>
        
        {onClose && (
          <button 
            onClick={onClose}
            className="md:hidden p-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="flex-1 px-3 space-y-1 py-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.path} 
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${
                isActive 
                  ? 'bg-indigo-50 text-indigo-700 font-semibold' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-indigo-600' : 'text-slate-400'} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50/50">
          <div className="w-8 h-8 bg-white border border-slate-200 rounded-full overflow-hidden flex-shrink-0">
            {user?.picture ? (
              <img src={user.picture} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="bg-indigo-50 w-full h-full flex items-center justify-center font-bold text-indigo-600 uppercase text-xs">
                {user?.name?.[0]}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-900 truncate">{user?.name || 'User'}</p>
            <p className="text-[10px] text-slate-400 truncate">Online</p>
          </div>
        </div>
        <button 
          onClick={logout}
          className="w-full mt-2 py-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all flex items-center justify-center gap-2 text-xs font-medium"
        >
          <LogOut size={14} />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
};
