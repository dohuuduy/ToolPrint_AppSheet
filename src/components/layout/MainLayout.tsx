import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { Settings as SettingsIcon, Terminal } from 'lucide-react';

const pageTitles: Record<string, string> = {
  '/': 'BẢNG ĐIỀU KHIỂN',
  '/apps': 'KẾT NỐI APPSHEET',
  '/templates': 'MẪU BIỂU BÁO CÁO',
  '/logs': 'NHẬT KÝ HỆ THỐNG',
  '/settings': 'CẤU HÌNH API'
};

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, login } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  // Close sidebar on route change for mobile
  React.useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6 overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#EEF2FF,transparent)]" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 md:p-10 text-center max-w-sm w-full rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 relative z-10"
        >
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-indigo-200">
            <Terminal size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2 uppercase tracking-tight">Print<span className="text-indigo-600">Hub</span></h1>
          <p className="text-slate-500 mb-10 text-sm leading-relaxed">Hệ thống báo cáo chuyên nghiệp cho AppSheet.</p>
          <button 
            onClick={login} 
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-700 font-semibold border border-slate-200 py-3.5 px-6 rounded-xl transition-all shadow-sm active:scale-95 text-sm"
          >
            <img src="https://www.google.com/favicon.ico" width="18" height="18" alt="google" />
            Đăng nhập với Google
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
    <div className="flex flex-col md:flex-row min-h-screen bg-[#F8FAFC]">
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[45] md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Wrapper */}
      <div className={`fixed inset-y-0 left-0 z-50 md:sticky md:block transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      <main className="flex-1 min-h-screen relative flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 h-16 md:h-20 px-6 md:px-10 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-xl md:hidden transition-colors"
                title="Mở Menu"
              >
                <div className="space-y-1.5 w-5">
                   <div className="h-0.5 bg-slate-500 rounded-full w-full" />
                   <div className="h-0.5 bg-slate-500 rounded-full w-full" />
                </div>
              </button>
              {/* Removed redundant text title here to let page content handle it */}
            </div>

            <div className="flex items-center gap-5">
               {/* User info moved to sidebar or simplified here */}
               <div className="hidden md:flex flex-col items-end">
                  <div className="text-[10px] font-black text-slate-900 leading-none uppercase tracking-widest">{user.name}</div>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none">System Ready</span>
                  </div>
               </div>
               
               <div className="w-10 h-10 rounded-2xl border border-slate-200 p-0.5 bg-white shadow-sm flex-shrink-0">
                  {user.picture ? (
                    <img src={user.picture} alt="Profile" className="w-full h-full object-cover rounded-[14px]" />
                  ) : (
                    <div className="w-full h-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-black rounded-[14px] text-xs">
                      {user.name?.[0]}
                    </div>
                  )}
               </div>
            </div>
        </header>

        {/* Content Area */}
        <div className="relative z-10 flex-1 overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
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
