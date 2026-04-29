import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { 
  Menu, 
  Search, 
  Bell, 
  User, 
  ChevronRight,
  Maximize2
} from 'lucide-react';

const pageTitles: Record<string, string> = {
  '/': 'Tổng quan hệ thống',
  '/apps': 'Quản lý Ứng dụng',
  '/templates': 'Mẫu biểu báo cáo',
  '/logs': 'Nhật ký in ấn',
  '/settings': 'Cấu hình Hub'
};

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, login } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Close sidebar on mobile route change
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location.pathname]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-12 text-center max-w-md w-full rounded-[3rem] shadow-2xl border border-slate-100"
        >
          <div className="w-24 h-24 bg-indigo-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-indigo-200">
            <span className="text-white text-5xl font-black">P</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tighter">Print Hub</h1>
          <p className="text-slate-500 mb-10 font-medium leading-relaxed">Nền tảng tự động hóa báo cáo chuyên nghiệp cho AppSheet.</p>
          <button 
            onClick={login} 
            className="w-full flex items-center justify-center gap-4 bg-slate-900 hover:bg-black text-white font-black py-5 px-6 rounded-3xl transition-all"
          >
            <img src="https://www.google.com/favicon.ico" width="20" height="20" alt="google" />
            TIẾP TỤC VỚI GOOGLE
          </button>
        </motion.div>
      </div>
    );
  }

  // Routing directly to report (no layout needed)
  if (location.pathname === '/report') {
    return <>{children}</>;
  }

  const mainPadding = isSidebarOpen ? 'lg:pl-72' : 'lg:pl-20';

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block shrink-0">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      </div>

      {/* Mobile Sidebar */}
      <Sidebar 
        isOpen={isMobileSidebarOpen} 
        setIsOpen={setIsMobileSidebarOpen} 
        isMobile 
        onCloseMobile={() => setIsMobileSidebarOpen(false)} 
      />

      <main className={`flex-1 transition-all duration-300 min-h-screen relative ${mainPadding}`}>
        {/* Top Navbar */}
        <header className="sticky top-0 z-40 bg-white/40 backdrop-blur-md border-b border-slate-100 h-20 px-4 md:px-8 flex justify-between items-center transition-all duration-300">
            <div className="flex items-center gap-4">
               <button 
                 onClick={() => setIsMobileSidebarOpen(true)}
                 className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
               >
                 <Menu size={20} />
               </button>
               
               <div className="flex items-center gap-3">
                  <div className="w-1 h-6 bg-indigo-600 rounded-full" />
                  <h1 className="text-lg font-black text-slate-900 tracking-tight whitespace-nowrap">
                    {pageTitles[location.pathname] || 'Trang chủ'}
                  </h1>
               </div>

               {/* Desktop Breadcrumbs (Simple) */}
               <div className="hidden md:flex items-center gap-2 ml-4">
                 <ChevronRight size={14} className="text-slate-300" />
                 <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Workspace</span>
               </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
               {/* Search (UI only) */}
               <div className="hidden sm:flex items-center bg-slate-100 border border-slate-200 rounded-full px-4 h-10 w-48 md:w-64 group focus-within:w-80 focus-within:bg-white focus-within:border-indigo-200 transition-all">
                  <Search size={16} className="text-slate-400 group-focus-within:text-indigo-500" />
                  <input 
                    type="text" 
                    placeholder="Tìm kiếm nhanh..." 
                    className="bg-transparent border-none focus:ring-0 text-sm font-medium ml-2 w-full text-slate-900 placeholder:text-slate-400"
                  />
               </div>

               <div className="flex items-center gap-1">
                 <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all relative">
                   <Bell size={20} />
                   <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
                 </button>
                 <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all hidden sm:flex">
                   <Maximize2 size={20} />
                 </button>
               </div>

               <div className="w-px h-6 bg-slate-200 mx-1 md:mx-2" />

               <div className="flex items-center gap-3 pl-1">
                  <div className="hidden lg:flex flex-col items-end">
                    <div className="text-[11px] font-black text-slate-900 leading-none">{user.name}</div>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Cloud Sync</span>
                    </div>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white overflow-hidden border border-slate-800 shadow-lg">
                    {user?.picture ? (
                      <img src={user.picture} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User size={18} />
                    )}
                  </div>
               </div>
            </div>
        </header>

        {/* Action Bar / Subheader */}
        <div className="bg-white border-b border-slate-100 py-3 px-8 flex items-center justify-between overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full" />
              <span className="text-[10px] font-black text-slate-900 uppercase tracking-wider whitespace-nowrap">Hợp đồng</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider whitespace-nowrap">Hóa đơn</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider whitespace-nowrap">Báo giá</span>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] italic whitespace-nowrap">Last synced: Just now</span>
          </div>
        </div>

        <div className="relative z-10 max-w-[1600px] mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="p-4 md:p-8"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};
