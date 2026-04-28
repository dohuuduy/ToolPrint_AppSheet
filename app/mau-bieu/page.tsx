'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, Plus, Upload, FileType, Edit2, Trash2, FolderOpen, ExternalLink } from 'lucide-react';

export default function MauBieuPage() {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [templates, setTemplates] = useState<any[]>([
    { ma_id: 'MB01', ten_mau: 'Hợp đồng lao động', ma_ung_dung: 'APP01', file_id_drive: '1A2B...', thu_muc_luu: '3C4D...' },
    { ma_id: 'MB02', ten_mau: 'Phiếu xuất kho', ma_ung_dung: 'APP01', file_id_drive: 'X1Y2...', thu_muc_luu: 'Z3W4...' },
  ]);

  const [formData, setFormData] = useState({
    ten_mau: '',
    ma_ung_dung: '',
    file_id_drive: '',
    thu_muc_luu: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTpl = {
      ma_id: 'MB' + Math.floor(Math.random() * 1000),
      ...formData
    };
    setTemplates([...templates, newTpl]);
    setShowModal(false);
    setFormData({ ten_mau: '', ma_ung_dung: '', file_id_drive: '', thu_muc_luu: '' });
  };

  return (
    <main className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-0 font-weight-bold text-primary">Mẫu biểu (Templates)</h1>
          <p className="text-muted mb-0 small">Quản lý các file Word/Excel mẫu trên Google Drive</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary d-flex align-items-center px-4">
          <Plus size={18} className="me-2" /> Thêm mẫu mới
        </button>
      </div>

      <div className="row g-4">
        {templates.map((tpl) => (
          <div key={tpl.ma_id} className="col-12 col-md-6 col-lg-4">
            <div className="card h-100 border-0 shadow-sm transition hover-shadow-md">
              <div className="card-body">
                <div className="d-flex align-items-center border-bottom pb-3 mb-3">
                  <div className="p-3 bg-white border rounded me-3 text-primary shadow-sm">
                    <FileText size={24} />
                  </div>
                  <div className="overflow-hidden">
                    <h6 className="mb-0 font-weight-bold text-truncate" title={tpl.ten_mau}>{tpl.ten_mau}</h6>
                    <small className="text-muted d-block font-monospace">ID: {tpl.ma_id}</small>
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

                <div className="d-flex gap-2 justify-content-end pt-2">
                  <Link href={`https://drive.google.com/open?id=${tpl.file_id_drive}`} target="_blank" className="btn btn-sm btn-outline-secondary">
                    <ExternalLink size={14} />
                  </Link>
                  <button className="btn btn-sm btn-outline-primary">Mapping</button>
                  <button className="btn btn-sm btn-outline-danger">Xóa</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Thêm Mẫu */}
      {showModal && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title font-weight-bold">Cấu hình mẫu biểu mới</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label font-weight-bold small">Chọn ứng dụng</label>
                    <select 
                      className="form-select" 
                      value={formData.ma_ung_dung} 
                      onChange={e => setFormData({...formData, ma_ung_dung: e.target.value})}
                      required
                    >
                      <option value="">-- Chọn ứng dụng AppSheet --</option>
                      <option value="APP01">Quản lý Nhân sự</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label font-weight-bold small">Tên mẫu báo cáo</label>
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
                    <label className="form-label font-weight-bold small">Google Drive File ID (Template)</label>
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
                    <label className="form-label font-weight-bold small">Google Drive Folder ID (Output)</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={formData.thu_muc_luu}
                      onChange={e => setFormData({...formData, thu_muc_luu: e.target.value})}
                      placeholder="ID thư mục để lưu file sau khi trộn" 
                      required 
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Hủy</button>
                  <button type="submit" className="btn btn-primary px-4">Lưu cấu hình</button>
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
