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
    <aside className="w-80 bg-white border-r border-slate-100 flex flex-col h-screen fixed left-0 top-0 z-40">
      <div className="p-10">
        <Link to="/" className="flex items-center gap-4 group">
          <div className="w-14 h-14 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl shadow-indigo-200 group-hover:scale-105 transition-transform duration-500">
            <Zap size={32} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">PRINT<span className="text-indigo-600">HUB</span></h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">AppSheet Edition</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-6 space-y-2 py-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.path} 
              to={item.path}
              className={`flex items-center gap-4 px-6 py-4.5 rounded-2xl transition-all duration-300 group ${
                isActive 
                  ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-white' : 'group-hover:text-indigo-600 transition-colors'} />
              <span className="text-sm font-black tracking-tight">{item.label}</span>
              {isActive && (
                <motion.div 
                  layoutId="sidebar-active"
                  className="ml-auto w-1.5 h-1.5 bg-white rounded-full"
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-8">
        <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden group shadow-2xl shadow-slate-900/20">
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center overflow-hidden border border-white/10">
              {user?.picture ? (
                <img src={user.picture} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="bg-indigo-500 w-full h-full flex items-center justify-center font-black text-white uppercase text-xl">
                  {user?.name?.[0]}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black truncate">{user?.name || 'Thành viên'}</p>
              <p className="text-[10px] font-bold text-slate-500 truncate uppercase tracking-widest">Quản trị viên</p>
            </div>
            <button 
              onClick={logout}
              className="p-3 bg-white/5 hover:bg-rose-500 hover:text-white rounded-xl transition-all duration-300 text-slate-400"
              title="Đăng xuất"
            >
              <LogOut size={18} />
            </button>
          </div>
          <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-125 transition-transform duration-1000 rotate-12">
             {user?.picture ? <img src={user.picture} alt="" className="w-40 grayscale" /> : <Zap size={140} />}
          </div>
        </div>
      </div>
    </aside>
  );
};
