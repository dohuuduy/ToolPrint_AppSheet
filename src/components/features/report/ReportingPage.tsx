import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Printer } from 'lucide-react';
import { api } from '../../../services/api.service';
import { ReportTemplate, AppSheetConfig } from '../../../types';

export const ReportingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = React.useState('Đang khởi tạo kết nối...');
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const rowId = searchParams.get('id');
  const templateMaId = searchParams.get('template');

  const startGenerate = async () => {
    if (!rowId || !templateMaId) return;
    setIsGenerating(true);
    
    const interval = setInterval(() => {
      setProgress(prev => (prev < 90 ? prev + Math.random() * 15 : prev));
    }, 800);

    try {
      setStatus('Kiểm tra cấu hình...');
      const [templates, apps] = await Promise.all([
        api.getTemplates(),
        api.getApps()
      ]);

      const target = templateMaId.toLowerCase();
      const template = templates.find((t: ReportTemplate) => 
        (t.ma_id?.toLowerCase() === target) || 
        (t.ma_mau?.toLowerCase() === target) || 
        (t.ten_mau?.toLowerCase() === target)
      );

      if (!template) throw new Error(`Không tìm thấy mẫu báo cáo "${templateMaId}".`);

      const app = apps.find((a: AppSheetConfig) => a.ma_id === template.ma_ung_dung);
      if (!app) throw new Error('Không tìm thấy ứng dụng AppSheet tương ứng.');

      setStatus(`Đang lấy dữ liệu từ AppSheet [${rowId}]...`);
      setProgress(40);

      const result = await api.generateReport({
        appId: app.app_id,
        apiKey: app.khoa_api || app.api_key,
        tableName: template.bang_chinh,
        rowId: rowId,
        templateId: template.file_id_drive,
        folderOutputId: app.folder_xuat_id,
        keyCol: template.key_col,
        childTable: template.child_table,
        foreignKey: template.foreign_key,
        childName: template.child_name || 'items'
      });

      setProgress(100);
      setStatus('Hoàn tất! Đang mở tài liệu...');
      setTimeout(() => {
        window.location.href = result.viewLink || `https://drive.google.com/file/d/${result.fileId}/view`;
      }, 1200);
    } catch (err: any) {
      setStatus(err.message);
      setIsGenerating(false);
      clearInterval(interval);
    }
  };

  React.useEffect(() => {
    if (rowId && templateMaId) {
      startGenerate();
    }
  }, [rowId, templateMaId]);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[40px] p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-indigo-600/5 animate-pulse" />
          
          <div className="relative z-10">
            <div className={`w-28 h-28 mx-auto mb-10 rounded-[35px] flex items-center justify-center ${isGenerating ? 'bg-indigo-600 shadow-2xl shadow-indigo-500/50 animate-bounce' : 'bg-rose-500/20'}`}>
              <Printer className={isGenerating ? 'text-white' : 'text-rose-500'} size={48} />
            </div>

            <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-6">
              {isGenerating ? 'Đang xuất báo cáo' : 'Lỗi hệ thống'}
            </h2>
            
            <div className="bg-black/40 rounded-2xl p-6 border border-white/5 mb-10">
              <p className="text-sm font-bold text-slate-300 italic">"{status}"</p>
            </div>

            {isGenerating && (
              <div className="space-y-4 mb-10">
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 transition-all duration-700" style={{ width: `${progress}%` }} />
                </div>
                <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <span>Processing</span>
                  <span>{Math.round(progress)}%</span>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-4">
              <Link to="/" className="px-10 py-4 bg-white/5 hover:bg-white/10 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all border border-white/5">Hủy lệnh & Quay lại</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
