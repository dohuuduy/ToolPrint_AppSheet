'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Database, Plus, Search, Loader2, Edit2, Trash2, X } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function UngDungPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [apps, setApps] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  
  // Form add new app
  const [formData, setFormData] = useState({
    ten_ung_dung: '',
    app_id: '',
    khoa_api: '',
    trang_thai: 'Hoạt động'
  });

  useEffect(() => {
    // Trong thực tế sẽ fetch từ API route gọi Google Sheets
    setLoading(false);
    // Mock dữ liệu theo schema mới
    setApps([
      { ma_id: 'APP01', ten_ung_dung: 'Quản lý Nhân sự', app_id: 'b291...1120', trang_thai: 'Hoạt động' }
    ]);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newApp = {
      ma_id: 'APP' + Math.floor(Math.random() * 1000),
      ...formData
    };
    setApps([...apps, newApp]);
    setShowModal(false);
    setFormData({ ten_ung_dung: '', app_id: '', khoa_api: '', trang_thai: 'Hoạt động' });
  };

  return (
    <main className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-0 font-weight-bold text-primary">Ứng dụng AppSheet</h1>
          <p className="text-muted mb-0 small">Quản lý các tài khoản kết nối AppSheet API</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary d-flex align-items-center px-4">
          <Plus size={18} className="me-2" /> Thêm ứng dụng
        </button>
      </div>

      <div className="card border-0 shadow-sm rounded-lg overflow-hidden">
        <div className="card-body p-0">
          <div className="p-3 border-bottom bg-light">
            <div className="input-group" style={{ maxWidth: '400px' }}>
              <span className="input-group-text bg-white border-end-0">
                <Search size={18} className="text-muted" />
              </span>
              <input type="text" className="form-control border-start-0" placeholder="Tìm kiếm ứng dụng..." />
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr className="bg-light">
                  <th className="px-4">Tên ứng dụng</th>
                  <th>App ID</th>
                  <th>Trạng thái</th>
                  <th className="text-end px-4">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="text-center py-5">
                      <Loader2 size={24} className="animate-spin text-primary" />
                    </td>
                  </tr>
                ) : apps.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-5 text-muted">Chưa có ứng dụng nào được kết nối.</td>
                  </tr>
                ) : (
                  apps.map((app) => (
                    <tr key={app.ma_id}>
                      <td className="px-4">
                        <div className="d-flex align-items-center">
                          <div className="p-2 bg-primary-subtle rounded me-3 text-primary">
                            <Database size={20} />
                          </div>
                          <div>
                            <span className="font-weight-bold d-block">{app.ten_ung_dung}</span>
                            <small className="text-muted">Mã: {app.ma_id}</small>
                          </div>
                        </div>
                      </td>
                      <td><code className="bg-light px-2 py-1 rounded small">{app.app_id}</code></td>
                      <td>
                        <span className={`badge rounded-pill ${app.trang_thai === 'Hoạt động' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'}`}>
                          {app.trang_thai}
                        </span>
                      </td>
                      <td className="text-end px-4">
                        <button className="btn btn-sm btn-outline-primary border-0 me-2">
                          <Edit2 size={16} />
                        </button>
                        <button className="btn btn-sm btn-outline-danger border-0">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Modal Thêm Mới */}
      {showModal && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title font-weight-bold">Thêm ứng dụng mới</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label font-weight-bold small">Tên ứng dụng nội bộ</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={formData.ten_ung_dung}
                      onChange={e => setFormData({...formData, ten_ung_dung: e.target.value})}
                      placeholder="VD: Quản lý Nhân sự" 
                      required 
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label font-weight-bold small">App ID (từ AppSheet Editor)</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={formData.app_id}
                      onChange={e => setFormData({...formData, app_id: e.target.value})}
                      placeholder="vd: a6485086-63e8-4223..." 
                      required 
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label font-weight-bold small">Access Key (API Key)</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      value={formData.khoa_api}
                      onChange={e => setFormData({...formData, khoa_api: e.target.value})}
                      placeholder="Nhập khóa API từ AppSheet" 
                      required 
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Hủy</button>
                  <button type="submit" className="btn btn-primary px-4">Lưu lại</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4">
        <Link href="/" className="btn btn-link p-0 text-decoration-none">← Quay lại Tổng quan</Link>
      </div>
    </main>
  );
}
