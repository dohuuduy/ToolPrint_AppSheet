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

  const [reportUrl, setReportUrl] = React.useState<string | null>(null);

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
      const url = result.viewLink || `https://drive.google.com/file/d/${result.fileId}/view`;
      setReportUrl(url);
      setIsGenerating(false);
      clearInterval(interval);
    } catch (err: any) {
      setStatus(err.message);
      setIsGenerating(false);
      clearInterval(interval);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  React.useEffect(() => {
    if (rowId && templateMaId) {
      startGenerate();
    }
  }, [rowId, templateMaId]);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center py-10 px-4 md:px-8">
      {/* Header for report page */}
      <div className="w-full max-w-5xl flex items-center justify-between mb-8 no-print">
        <div className="flex items-center gap-3">
          <Link to="/" className="p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl transition-all shadow-sm">
            <ArrowLeft size={20} className="text-slate-600" />
          </Link>
          <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase italic">Xem trước <span className="text-indigo-600">Báo cáo</span></h1>
        </div>
        
        {reportUrl && (
          <div className="flex items-center gap-3">
             <a href={reportUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary py-3 px-6 text-[9px] font-black tracking-widest flex items-center gap-2">
                Mở Google Drive
             </a>
             <button onClick={handlePrint} className="btn-primary py-3 px-6 text-[9px] font-black tracking-widest flex items-center gap-2">
                <Printer size={16} />
                In báo cáo
             </button>
          </div>
        )}
      </div>

      <div className="w-full h-full flex items-center justify-center">
        {isGenerating ? (
          <div className="max-w-md w-full bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl p-10 text-center">
            <div className="w-20 h-20 bg-indigo-50 text-indigo-600 mx-auto mb-6 rounded-3xl flex items-center justify-center">
              <RefreshCw className="animate-spin" size={40} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase italic tracking-tighter">Đang xử lý dữ liệu</h2>
            <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed px-4">{status}</p>
            <div className="space-y-3 px-4">
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-indigo-600" 
                />
              </div>
              <div className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">
                {Math.round(progress)}% Hoàn thành
              </div>
            </div>
          </div>
        ) : reportUrl ? (
          <div className="w-full flex flex-col items-center">
            <div className="a4-preview bg-white shadow-2xl rounded-sm">
               <iframe 
                 src={reportUrl.replace('/view', '/preview')} 
                 className="w-full h-full border-none"
                 title="Report Preview"
               />
               
               {/* Overlay for printing if needed, though iframe print is usually separate */}
               <div className="print-only p-10">
                 <h1 className="text-3xl font-bold mb-4">Tài liệu đã được tạo</h1>
                 <p>Vui lòng xem tài liệu tại: {reportUrl}</p>
               </div>
            </div>
            
            <p className="mt-8 text-slate-400 text-[10px] font-black uppercase tracking-widest no-print">
               Trang hiển thị ở chế độ xem trước • 210mm x 297mm (A4)
            </p>
          </div>
        ) : (
          <div className="max-w-md w-full bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl p-10 text-center">
             <div className="w-20 h-20 bg-rose-50 text-rose-500 mx-auto mb-6 rounded-3xl flex items-center justify-center">
                <AlertTriangle size={40} />
             </div>
             <h2 className="text-2xl font-black text-rose-600 mb-2 uppercase italic tracking-tighter">Lỗi hệ thống</h2>
             <p className="text-slate-500 text-sm font-medium mb-8 px-4">{status}</p>
             <Link to="/" className="btn-secondary w-full text-[10px] font-black tracking-widest uppercase">
                Quay lại bảng điều khiển
             </Link>
          </div>
        )}
      </div>
    </div>
  );
};
