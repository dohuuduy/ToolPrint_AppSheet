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
    <aside className="w-72 bg-white border-r border-slate-100 flex flex-col h-screen md:sticky top-0 transition-all">
      <div className="p-8 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 overflow-hidden group">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 flex-shrink-0 transition-transform group-hover:scale-110">
            <Zap size={22} />
          </div>
          <div className="flex flex-col min-w-0">
            <h1 className="text-xl font-black text-slate-900 tracking-tighter leading-none italic">Print<span className="text-indigo-600">Hub</span></h1>
            <p className="text-[8px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">Enterprise Solution</p>
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

      <nav className="flex-1 px-4 space-y-1 py-8">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.path} 
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group ${
                isActive 
                  ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600 transition-colors'} />
              <span className={`text-[11px] uppercase tracking-widest font-black ${isActive ? 'opacity-100' : 'opacity-80'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 mt-auto">
        <div className="bg-slate-50 border border-slate-100 rounded-3xl p-4 group transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-200/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
              {user?.picture ? (
                <img src={user.picture} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="bg-indigo-50 w-full h-full flex items-center justify-center font-black text-indigo-600 uppercase text-sm">
                  {user?.name?.[0]}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-black text-slate-900 truncate leading-tight">{user?.name || 'User'}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Active</p>
              </div>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full mt-3 py-2.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest border border-transparent hover:border-rose-100"
          >
            <LogOut size={12} />
            Đăng xuất
          </button>
        </div>
      </div>
    </aside>
  );
};
