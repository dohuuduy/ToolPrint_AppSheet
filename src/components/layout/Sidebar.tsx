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
        <div className={`p-8 flex items-center h-24 ${!isOpen && !isMobile ? 'justify-center border-b border-slate-50' : 'justify-between'}`}>
          <Link to="/" className="flex items-center gap-3 group overflow-hidden shrink-0">
            <div className="w-11 h-11 bg-indigo-600 rounded-[1.2rem] flex items-center justify-center text-white shadow-xl shadow-indigo-200 shrink-0 group-hover:rotate-12 transition-all duration-700">
              <Zap size={24} strokeWidth={3} />
            </div>
            {(isOpen || isMobile) && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col whitespace-nowrap"
              >
                <h1 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">Print<span className="text-indigo-600">Hub</span></h1>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-0.5">Automation Engine</p>
              </motion.div>
            )}
          </Link>

          {isMobile && (
            <button onClick={onCloseMobile} className="p-3 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-2xl transition-all active:scale-95">
              <X size={20} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1 mt-6 overflow-y-auto overflow-x-hidden">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path} 
                to={item.path}
                onClick={isMobile ? onCloseMobile : undefined}
                className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group relative ${
                  isActive 
                    ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'
                }`}
              >
                <Icon size={19} className={`shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-indigo-600 transition-colors'}`} />
                {(isOpen || isMobile) && (
                  <motion.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`text-sm tracking-tight whitespace-nowrap ${isActive ? 'font-black' : 'font-bold'}`}
                  >
                    {item.label}
                  </motion.span>
                )}
                {isActive && (
                  <motion.div 
                    layoutId="sidebar-active-indicator"
                    className="absolute right-0 w-1.5 h-6 bg-indigo-500 rounded-l-full"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer actions like Support / API Docs */}
        {(isOpen || isMobile) && (
          <div className="px-6 py-4 space-y-1 border-t border-slate-50 mt-4">
             <Link to="/support" className="flex items-center gap-3 py-2 text-[11px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">
               <span>Hỗ trợ ky thuật</span>
             </Link>
             <Link to="/docs" className="flex items-center gap-3 py-2 text-[11px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">
               <span>Tài liệu API</span>
             </Link>
          </div>
        )}

        {/* User Profile Section */}
        <div className="p-6">
          <div className={`bg-slate-50 border border-slate-100/50 rounded-[2rem] p-3 transition-all ${isOpen || isMobile ? 'hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50 group' : 'flex justify-center'}`}>
            <div className="flex items-center gap-4 w-full">
              <div className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center overflow-hidden border border-slate-100 shadow-sm shrink-0 group-hover:scale-110 transition-transform duration-500">
                {user?.picture ? (
                  <img src={user.picture} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 w-full h-full flex items-center justify-center font-black text-white uppercase text-sm">
                    {user?.name?.[0]}
                  </div>
                )}
              </div>
              {(isOpen || isMobile) && (
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-black text-slate-900 truncate tracking-tight">{user?.name || 'Thành viên'}</p>
                  <p className="text-[10px] font-bold text-slate-400 truncate opacity-60">Professional Plan</p>
                </div>
              )}
              {(isOpen || isMobile) && (
                <button 
                  onClick={logout}
                  className="p-2.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                >
                  <LogOut size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
