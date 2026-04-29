import React from 'react';
import { useLocation, Settings } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { Settings as SettingsIcon } from 'lucide-react';

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

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#fbfcfd]">
      <Sidebar />
      <main className="flex-1 md:ml-72 min-h-screen relative">
        <header className="sticky top-0 z-30 bg-white/40 backdrop-blur-md border-b border-slate-100 h-20 px-8 flex justify-between items-center">
            <div className="flex items-center gap-3">
               <div className="w-1 h-6 bg-indigo-600 rounded-full" />
               <h1 className="text-lg font-black text-slate-900 tracking-tight">
                 {pageTitles[location.pathname] || 'Trang chủ'}
               </h1>
            </div>
            <div className="flex items-center gap-6">
               <div className="hidden lg:flex flex-col items-end">
                  <div className="text-[11px] font-black text-slate-900 leading-none">{user.email}</div>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Hệ thống sẵn sàng</span>
                  </div>
               </div>
            </div>
        </header>

        <div className="relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="p-8"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};
