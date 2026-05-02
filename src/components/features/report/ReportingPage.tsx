import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Printer, RefreshCw, AlertTriangle, ArrowLeft } from 'lucide-react';
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

      setStatus(`Đang lấy dữ liệu từ AppSheet...`);
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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-10 text-center">
          <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center ${isGenerating ? 'bg-indigo-50 text-indigo-600' : 'bg-rose-50 text-rose-500'}`}>
            {isGenerating ? <RefreshCw className="animate-spin" size={40} /> : <AlertTriangle size={40} />}
          </div>

          <h2 className="text-xl font-bold text-slate-900 mb-2">
            {isGenerating ? 'Đang xuất báo cáo' : 'Lỗi xuất báo cáo'}
          </h2>
          
          <p className="text-slate-500 text-sm mb-8">{status}</p>

          {isGenerating && (
            <div className="space-y-3 mb-8">
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 transition-all duration-700" style={{ width: `${progress}%` }} />
              </div>
              <div className="flex justify-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {Math.round(progress)}%
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Link to="/" className="btn-secondary w-full py-4 text-sm">
              <ArrowLeft size={16} className="shrink-0" />
              <span>Quay lại Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
