'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, Plus, Upload, FileType, Edit2, Trash2, FolderOpen, ExternalLink, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function MauBieuPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [templates, setTemplates] = useState<any[]>([]);
  const [apps, setApps] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    ma_id: '',
    ten_mau: '',
    ma_ung_dung: '',
    file_id_drive: '',
    thu_muc_luu: ''
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [tplRes, appsRes] = await Promise.all([
        fetch('/api/config?table=mau_bieu'),
        fetch('/api/config?table=ung_dung')
      ]);
      const tpls = await tplRes.json();
      const apls = await appsRes.json();
      
      if (tplRes.ok && Array.isArray(tpls)) {
        setTemplates(tpls.filter(t => t.ma_id && !t.ma_id.startsWith('DELETED_')));
      } else if (!tplRes.ok) {
        setError(tpls.error || 'Lỗi tải danh sách mẫu biểu');
      }

      if (appsRes.ok && Array.isArray(apls)) {
        setApps(apls.filter(a => a.ma_id && !a.ma_id.startsWith('DELETED_')));
      }
    } catch (err) {
      setError('Lỗi kết nối Server');
    } finally {
      setLoading(false);
    }
  };

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session) fetchData();
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = isEditing ? 
        { table: 'mau_bieu', id: formData.ma_id, data: formData } : 
        { table: 'mau_bieu', data: { ...formData, ma_id: 'MB' + Date.now() } };

      const method = isEditing ? 'PUT' : 'POST';
      const res = await fetch('/api/config', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setShowModal(false);
        setIsEditing(false);
        setFormData({ ma_id: '', ten_mau: '', ma_ung_dung: '', file_id_drive: '', thu_muc_luu: '' });
        fetchData();
      }
    } catch (err) {
      alert('Lỗi lưu mẫu biểu');
    }
  };

  const deleteTemplate = async (id: string) => {
    if (!confirm('Xóa mẫu biểu này?')) return;
    try {
      await fetch(`/api/config?table=mau_bieu&id=${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err) {
      alert('Lỗi xóa');
    }
  };

  const openEdit = (tpl: any) => {
    setFormData(tpl);
    setIsEditing(true);
    setShowModal(true);
  };

  return (
    <main className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-0 font-weight-bold text-primary">Mẫu biểu (Templates)</h1>
          <p className="text-muted mb-0 small">Quản lý các file Word/Excel mẫu trên Google Drive</p>
        </div>
        <button onClick={() => { setIsEditing(false); setFormData({ ma_id: '', ten_mau: '', ma_ung_dung: '', file_id_drive: '', thu_muc_luu: '' }); setShowModal(true); }} className="btn btn-primary d-flex align-items-center px-4 shadow-sm">
          <Plus size={18} className="me-2" /> Thêm mẫu mới
        </button>
      </div>

      <div className="row g-4">
        {loading ? (
          <div className="col-12 text-center py-5">
            <Loader2 size={32} className="animate-spin text-primary d-inline-block" />
            <p className="mt-3 text-muted">Đang tải danh sách mẫu biểu...</p>
          </div>
        ) : error ? (
          <div className="col-12 text-center py-5">
            <div className="alert alert-danger border-0 shadow-sm d-inline-block px-5">
              <h5 className="font-weight-bold mb-2">Lỗi tải dữ liệu</h5>
              <p className="mb-0">{error}</p>
              <small className="text-muted d-block mt-2">Vui lòng kiểm tra GOOGLE_SHEET_ID và các Sheet trong file.</small>
            </div>
          </div>
        ) : templates.length === 0 ? (
          <div className="col-12 text-center py-5 text-muted">Chưa có mẫu biểu nào.</div>
        ) : (
          templates.map((tpl) => (
            <div key={tpl.ma_id} className="col-12 col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm transition hover-shadow-md">
                <div className="card-body">
                  <div className="d-flex align-items-center border-bottom pb-3 mb-3">
                    <div className="p-3 bg-white border rounded me-3 text-primary shadow-sm">
                      <FileText size={24} />
                    </div>
                    <div className="overflow-hidden">
                      <h6 className="mb-0 font-weight-bold text-truncate" title={tpl.ten_mau}>{tpl.ten_mau}</h6>
                      <small className="text-muted d-block font-monospace small">ID: {tpl.ma_id}</small>
                    </div>
                  </div>
                  
                  <div className="small mb-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Ứng dụng:</span>
                      <span className="badge bg-light text-dark">{tpl.ma_ung_dung}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">File ID:</span>
                      <span className="text-primary cursor-pointer text-truncate" style={{maxWidth: '150px'}} title={tpl.file_id_drive}>
                        {tpl.file_id_drive}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Thư mục lưu:</span>
                      <span className="text-success text-truncate" style={{maxWidth: '150px'}} title={tpl.thu_muc_luu}>
                        <FolderOpen size={14} className="me-1" /> {tpl.thu_muc_luu}
                      </span>
                    </div>
                  </div>

                  <div className="d-flex gap-2 justify-content-end pt-2 border-top">
                    <Link href={`https://drive.google.com/open?id=${tpl.file_id_drive}`} target="_blank" className="btn btn-sm btn-outline-secondary border-0 px-2" title="Mở file mẫu">
                      <ExternalLink size={16} />
                    </Link>
                    <Link href={`/anh-xa?template=${tpl.ma_id}`} className="btn btn-sm btn-outline-primary border-0" title="Cấu hình biến">Mapping</Link>
                    <button onClick={() => openEdit(tpl)} className="btn btn-sm btn-outline-primary border-0" title="Sửa cấu hình">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => deleteTemplate(tpl.ma_id)} className="btn btn-sm btn-outline-danger border-0" title="Xóa">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Thêm Mẫu */}
      {showModal && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header border-0">
                <h5 className="modal-title font-weight-bold">{isEditing ? 'Cập nhật mẫu biểu' : 'Cấu hình mẫu biểu mới'}</h5>
                <button type="button" className="btn-close shadow-none" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label font-weight-bold small text-muted">Chọn ứng dụng</label>
                    <select 
                      className="form-select" 
                      value={formData.ma_ung_dung} 
                      onChange={e => setFormData({...formData, ma_ung_dung: e.target.value})}
                      required
                    >
                      <option value="">-- Chọn ứng dụng liên kết --</option>
                      {apps.map(app => (
                        <option key={app.ma_id} value={app.ma_id}>{app.ten_ung_dung}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label font-weight-bold small text-muted">Tên mẫu báo cáo</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={formData.ten_mau}
                      onChange={e => setFormData({...formData, ten_mau: e.target.value})}
                      placeholder="VD: Hợp đồng lao động chính thức" 
                      required 
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label font-weight-bold small text-muted">Google Docs/File ID (Template)</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={formData.file_id_drive}
                      onChange={e => setFormData({...formData, file_id_drive: e.target.value})}
                      placeholder="ID file lẩy từ link Drive..." 
                      required 
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label font-weight-bold small text-muted">Output Folder ID (Drive)</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={formData.thu_muc_luu}
                      onChange={e => setFormData({...formData, thu_muc_luu: e.target.value})}
                      placeholder="ID thư mục để lưu file PDF/Word" 
                      required 
                    />
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-light px-4" onClick={() => setShowModal(false)}>Hủy</button>
                  <button type="submit" className="btn btn-primary px-4 shadow-sm">Lưu cấu hình</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="mt-5 bg-white p-4 rounded shadow-sm border">
        <h5 className="mb-3 font-weight-bold">Cách lấy ID File/Folder từ Google Drive</h5>
        <div className="alert alert-info small mb-0 d-flex align-items-start">
          <Upload size={24} className="me-3 mt-1" />
          <p className="mb-0">
            Truy cập Google Drive, nhấp chuột phải vào file/thư mục chọn <strong>Chia sẻ (Share)</strong>. 
            URL sẽ có dạng <code>https://drive.google.com/drive/folders/<strong>ID_CẦN_LẤY</strong></code> hoặc 
            <code>https://docs.google.com/document/d/<strong>ID_CẦN_LẤY</strong>/edit</code>. 
            Hãy copy phần ID bôi đậm đó dán vào khung cấu hình.
          </p>
        </div>
      </div>

      <div className="mt-4 text-center">
        <Link href="/" className="btn btn-link p-0 text-decoration-none">← Quay lại Tổng quan</Link>
      </div>
    </main>
  );
}
