import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Grid, 
  FileText, 
  History, 
  Settings as SettingsIcon,
  LogOut,
  Zap,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const menuItems = [
  { path: '/', label: 'Tổng quan', icon: LayoutDashboard },
  { path: '/apps', label: 'Kết nối AppSheet', icon: Grid },
  { path: '/templates', label: 'Mẫu báo cáo', icon: FileText },
  { path: '/logs', label: 'Nhật ký in', icon: History },
  { path: '/settings', label: 'Cài đặt hệ thống', icon: SettingsIcon },
];

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, isMobile, onCloseMobile }) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const sidebarWidth = isOpen ? 'w-72' : 'w-20';

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCloseMobile}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside 
        className={`${isMobile ? (isOpen ? 'translate-x-0' : '-translate-x-full') : sidebarWidth} 
          bg-white border-r border-slate-100 flex flex-col h-screen fixed left-0 top-0 z-[60] transition-all duration-300 ease-in-out`}
      >
        {/* Toggle Button for Desktop */}
        {!isMobile && (
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="absolute -right-3 top-24 w-6 h-6 bg-white border border-slate-100 rounded-full flex items-center justify-center shadow-md hover:bg-slate-50 transition-colors z-[70] group"
          >
            {isOpen ? (
              <ChevronLeft size={14} className="text-slate-400 group-hover:text-indigo-600" />
            ) : (
              <ChevronRight size={14} className="text-slate-400 group-hover:text-indigo-600" />
            )}
          </button>
        )}

        {/* Header */}
        <div className={`p-6 flex items-center h-20 ${!isOpen && !isMobile ? 'justify-center' : 'justify-between'}`}>
          <Link to="/" className="flex items-center gap-3 group overflow-hidden shrink-0">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100 shrink-0 group-hover:rotate-6 transition-transform duration-500">
              <Zap size={22} strokeWidth={3} />
            </div>
            {(isOpen || isMobile) && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col whitespace-nowrap"
              >
                <h1 className="text-xl font-black text-slate-900 tracking-tighter leading-none">PRINT<span className="text-indigo-600">HUB</span></h1>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Automated Reporting</p>
              </motion.div>
            )}
          </Link>

          {isMobile && (
            <button onClick={onCloseMobile} className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
              <X size={20} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto overflow-x-hidden">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path} 
                to={item.path}
                onClick={isMobile ? onCloseMobile : undefined}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                  isActive 
                    ? 'bg-indigo-50 text-indigo-600' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon size={18} className={`shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-900 transition-colors'}`} />
                {(isOpen || isMobile) && (
                  <motion.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`text-[13px] font-bold tracking-tight whitespace-nowrap ${isActive ? 'font-black' : ''}`}
                  >
                    {item.label}
                  </motion.span>
                )}
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

        {/* Footer / Profile */}
        <div className="p-4 mt-auto">
          <div className={`bg-slate-50 border border-slate-100 rounded-2xl p-3 transition-all ${isOpen || isMobile ? 'hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 group' : 'flex justify-center'}`}>
            <div className="flex items-center gap-3 w-full">
              <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center overflow-hidden border border-slate-200 shadow-sm shrink-0">
                {user?.picture ? (
                  <img src={user.picture} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="bg-indigo-100 w-full h-full flex items-center justify-center font-black text-indigo-600 uppercase text-sm">
                    {user?.name?.[0]}
                  </div>
                )}
              </div>
              {(isOpen || isMobile) && (
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-black text-slate-900 truncate tracking-tight">{user?.name || 'Thành viên'}</p>
                  <div className="flex items-center gap-1">
                    <div className="w-1 h-1 bg-emerald-500 rounded-full" />
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Active</p>
                  </div>
                </div>
              )}
              {(isOpen || isMobile) && (
                <button 
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                  title="Đăng xuất"
                >
                  <LogOut size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
