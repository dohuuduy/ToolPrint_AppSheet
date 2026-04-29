import { AppSheetConfig, ReportTemplate, PrintLog } from '../types';

class ApiService {
  private async request(url: string, options?: RequestInit) {
    const res = await fetch(url, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Lỗi kết nối API');
    }
    return res.json();
  }

  // Database APIs
  getApps(): Promise<AppSheetConfig[]> { return this.request('/api/db/ung_dung'); }
  getTemplates(): Promise<ReportTemplate[]> { return this.request('/api/db/mau_bieu'); }
  getLogs(): Promise<PrintLog[]> { return this.request('/api/db/nhat_ky_in'); }
  
  createApp(data: any) { return this.request('/api/db/ung_dung', { method: 'POST', body: JSON.stringify(data) }); }
  updateApp(id: string, data: any) { return this.request(`/api/db/ung_dung/${id}`, { method: 'PUT', body: JSON.stringify(data) }); }
  deleteApp(id: string) { return this.request(`/api/db/ung_dung/${id}`, { method: 'DELETE' }); }

  createTemplate(data: any) { return this.request('/api/db/mau_bieu', { method: 'POST', body: JSON.stringify(data) }); }
  updateTemplate(id: string, data: any) { return this.request(`/api/db/mau_bieu/${id}`, { method: 'PUT', body: JSON.stringify(data) }); }
  deleteTemplate(id: string) { return this.request(`/api/db/mau_bieu/${id}`, { method: 'DELETE' }); }

  initDb() { return this.request('/api/db/init'); }

  // Business APIs
  testAppSheetConnection(data: { appId: string; apiKey: string; tableName: string }) {
    return this.request('/api/appsheet/columns', { method: 'POST', body: JSON.stringify(data) });
  }

  generateReport(data: any) {
    return this.request('/api/report/generate', { method: 'POST', body: JSON.stringify(data) });
  }
}

export const api = new ApiService();
