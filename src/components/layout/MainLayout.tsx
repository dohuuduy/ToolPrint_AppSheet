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
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 p-6 overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#312e81,black)]" />
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-3xl p-8 md:p-12 text-center max-w-md w-full rounded-[3rem] shadow-[0_0_80px_rgba(0,0,0,0.5)] border border-white/5 relative z-10"
        >
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl relative group">
            <div className="absolute inset-0 bg-indigo-600 rounded-3xl animate-ping opacity-10 group-hover:scale-110 transition-transform" />
            <Terminal size={40} className="text-slate-950 relative z-10" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2 uppercase tracking-tighter italic">Print<span className="text-indigo-400">Hub</span></h1>
          <p className="text-slate-400 mb-10 font-medium text-sm leading-relaxed tracking-wide px-4">Hệ thống báo cáo tự động chuyên nghiệp cho người dùng AppSheet.</p>
          <button 
            onClick={login} 
            className="w-full flex items-center justify-center gap-4 bg-white hover:bg-slate-50 text-slate-900 font-bold py-4.5 px-6 rounded-2xl transition-all shadow-xl active:scale-95 text-sm"
          >
            <img src="https://www.google.com/favicon.ico" width="18" height="18" alt="google" />
            ĐẬNG NHẬP GOOGLE
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
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 h-16 md:h-20 px-4 md:px-8 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-xl md:hidden transition-colors"
              >
                <div className="space-y-1.5 w-5">
                   <div className="h-0.5 bg-slate-600 rounded-full w-full" />
                   <div className="h-0.5 bg-slate-600 rounded-full w-3/4" />
                </div>
              </button>
              <div className="flex items-center gap-2.5">
                 <div className="w-1 h-6 md:h-7 bg-indigo-600 rounded-full hidden xs:block" />
                 <h1 className="text-sm md:text-lg font-black text-slate-900 tracking-tight uppercase">
                   {pageTitles[location.pathname] || 'Trang chủ'}
                 </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
               {/* Activity Indicator (Desktop) */}
               <div className="hidden lg:flex flex-col items-end mr-4">
                  <div className="text-[10px] md:text-[11px] font-bold text-slate-900 leading-none">{user.email}</div>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Ready</span>
                  </div>
               </div>
               
               {/* Small User Info / Avatar (Mobile Friendly) */}
               <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl border border-slate-200 p-0.5 bg-white shadow-sm overflow-hidden flex-shrink-0">
                  {user.picture ? (
                    <img src={user.picture} alt="Profile" className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <div className="w-full h-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-black rounded-lg text-xs">
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
