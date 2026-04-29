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
        <header className="sticky top-0 z-40 bg-white/60 backdrop-blur-xl border-b border-slate-100 h-24 px-4 md:px-10 flex justify-between items-center transition-all duration-300">
            <div className="flex items-center gap-6 flex-1">
               <button 
                 onClick={() => setIsMobileSidebarOpen(true)}
                 className="lg:hidden p-3 bg-slate-50 text-slate-500 hover:bg-slate-100 rounded-2xl transition-all"
               >
                 <Menu size={22} />
               </button>
               
               {/* Global Search Bar */}
               <div className="hidden sm:flex items-center bg-slate-50 border border-slate-100 rounded-2xl px-5 h-12 w-full max-w-lg group focus-within:bg-white focus-within:border-indigo-200 focus-within:shadow-xl focus-within:shadow-indigo-100/20 transition-all duration-500">
                  <Search size={18} className="text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Tìm kiếm tài nguyên hệ thống..." 
                    className="bg-transparent border-none focus:ring-0 text-sm font-bold ml-3 w-full text-slate-900 placeholder:text-slate-300"
                  />
               </div>
            </div>

            <div className="flex items-center gap-4 md:gap-6">
               <div className="hidden md:flex items-center gap-2">
                 <button className="px-5 py-2.5 text-slate-500 font-black text-[11px] uppercase tracking-widest hover:bg-slate-50 rounded-xl transition-all">Xuất báo cáo</button>
                 <button className="px-6 py-2.5 bg-indigo-600 text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-indigo-100 hover:bg-slate-900 hover:shadow-none transition-all active:scale-95">Chạy thử nghiệm</button>
               </div>

               <div className="w-px h-8 bg-slate-100 mx-2 hidden sm:block" />

               <div className="flex items-center gap-2">
                 <button className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all relative">
                   <Bell size={20} />
                   <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-white shadow-sm" />
                 </button>
                 <button className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all hidden sm:flex">
                   <Maximize2 size={20} />
                 </button>
               </div>

               <div className="flex items-center gap-3 pl-2">
                  <div className="w-10 h-10 rounded-[1rem] bg-slate-900 flex items-center justify-center text-white overflow-hidden border border-white shadow-lg group">
                    {user?.picture ? (
                      <img src={user.picture} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <User size={20} />
                    )}
                  </div>
               </div>
            </div>
        </header>

        {/* Action Bar / Subheader Navigation */}
        <div className="bg-white/40 sticky top-24 z-30 border-b border-slate-50 py-4 px-10 flex items-center justify-between overflow-x-auto scrollbar-hide backdrop-blur-md">
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-indigo-600 rounded-full shadow-[0_0_8px_rgba(79,70,229,0.5)]" />
              <span className="text-[11px] font-black text-slate-900 uppercase tracking-[0.15em] whitespace-nowrap">Tổng quan kết nối</span>
            </div>
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="w-2 h-2 bg-emerald-500 rounded-full transition-transform group-hover:scale-125" />
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] whitespace-nowrap group-hover:text-slate-900 transition-colors">Vận hành mẫu biểu</span>
            </div>
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="w-2 h-2 bg-amber-500 rounded-full transition-transform group-hover:scale-125" />
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] whitespace-nowrap group-hover:text-slate-900 transition-colors">Cấu hình bảo mật</span>
            </div>
          </div>
          <div className="flex items-center gap-4 shrink-0">
             <div className="w-8 h-8 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
               <Zap size={14} className="animate-pulse" />
             </div>
             <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Status: Ready to print</span>
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
