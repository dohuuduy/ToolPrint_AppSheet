import { create } from 'zustand';
import { api } from '../services/api.service';
import { AppSheetConfig, ReportTemplate, PrintLog } from '../types';

interface AppState {
  apps: AppSheetConfig[];
  templates: ReportTemplate[];
  logs: PrintLog[];
  loading: boolean;
  error: string | null;
  
  fetchApps: () => Promise<void>;
  fetchTemplates: () => Promise<void>;
  fetchLogs: () => Promise<void>;
  fetchAll: () => Promise<void>;
  
  setApps: (apps: AppSheetConfig[]) => void;
  setTemplates: (templates: ReportTemplate[]) => void;
  setLogs: (logs: PrintLog[]) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  apps: [],
  templates: [],
  logs: [],
  loading: false,
  error: null,

  setApps: (apps) => set({ apps }),
  setTemplates: (templates) => set({ templates }),
  setLogs: (logs) => set({ logs }),

  fetchApps: async () => {
    try {
      const data = await api.getApps();
      const normalizedApps = data.map((app: any) => ({
        ...app,
        ten_ung_dung: app.ten_ung_dung || app.ten_app,
        khoa_api: app.khoa_api || app.api_key,
        bang_chinh: app.bang_chinh || 'Khach'
      }));
      set({ apps: normalizedApps });
    } catch (err) {
      console.error('Fetch Apps Error:', err);
    }
  },

  fetchTemplates: async () => {
    try {
      const data = await api.getTemplates();
      set({ templates: data });
    } catch (err) {
      console.error('Fetch Templates Error:', err);
    }
  },

  fetchLogs: async () => {
    try {
      const data = await api.getLogs();
      set({ logs: data });
    } catch (err) {
      console.error('Fetch Logs Error:', err);
    }
  },

  fetchAll: async () => {
    set({ loading: true });
    try {
      await Promise.all([
        get().fetchApps(),
        get().fetchTemplates(),
        get().fetchLogs()
      ]);
    } finally {
      set({ loading: false });
    }
  }
}));
