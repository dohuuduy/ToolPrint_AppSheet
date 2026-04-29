import React from 'react';
import { useLocation, Settings } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { Settings as SettingsIcon } from 'lucide-react';

const pageTitles: Record<string, string> = {
  '/': 'DASHBOARD_HUB',
  '/apps': 'NODE_CONNECTOR',
  '/templates': 'SCHEMA_MODELS',
  '/logs': 'SECURITY_LOGS',
  '/settings': 'SYSTEM_SETUP'
};

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, login } = useAuth();
  const location = useLocation();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 p-6 overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#312e81,black)]" />
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-2xl p-12 text-center max-w-md w-full rounded-[3.5rem] shadow-[0_0_80px_rgba(0,0,0,0.5)] border border-white/10 relative z-10"
        >
          <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-2xl relative group">
            <div className="absolute inset-0 bg-indigo-600 rounded-[2.5rem] animate-ping opacity-20 group-hover:scale-110 transition-transform" />
            <Terminal size={48} className="text-slate-900 relative z-10" />
          </div>
          <h1 className="text-4xl font-black text-white mb-2 uppercase tracking-tighter italic">Print<span className="text-indigo-400">Hub</span></h1>
          <p className="text-slate-300 mb-10 font-medium text-sm leading-relaxed tracking-wide">Automated Enterprise Reporting for AppSheet.</p>
          <button 
            onClick={login} 
            className="w-full flex items-center justify-center gap-4 bg-white hover:bg-slate-100 text-slate-900 font-black py-5 px-6 rounded-3xl transition-all shadow-xl active:scale-95"
          >
            <img src="https://www.google.com/favicon.ico" width="20" height="20" alt="google" />
            INITIALIZE AUTH_V1
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
