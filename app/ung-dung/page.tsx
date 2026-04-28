'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Database, Plus, Search, Loader2, Edit2, Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function UngDungPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [apps, setApps] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    ma_id: '',
    ten_ung_dung: '',
    app_id: '',
    khoa_api: '',
    trang_thai: 'Hoạt động'
  });

  const fetchApps = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/config?table=ung_dung');
      const data = await res.json();
      if (Array.isArray(data)) {
        setApps(data.filter(app => !app.ma_id?.startsWith('DELETED_')));
      }
    } catch (err) {
      console.error('Lỗi tải ứng dụng:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) fetchApps();
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = isEditing ? 
        { table: 'ung_dung', id: formData.ma_id, data: formData } : 
        { table: 'ung_dung', data: { ...formData, ma_id: 'APP' + Date.now() } };

      const method = isEditing ? 'PUT' : 'POST';
      const res = await fetch('/api/config', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setShowModal(false);
        setIsEditing(false);
        setFormData({ ma_id: '', ten_ung_dung: '', app_id: '', khoa_api: '', trang_thai: 'Hoạt động' });
        fetchApps();
      }
    } catch (err) {
      alert('Lỗi lưu dữ liệu');
    }
  };

  const deleteApp = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa ứng dụng này?')) return;
    try {
      const res = await fetch(`/api/config?table=ung_dung&id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchApps();
    } catch (err) {
      alert('Lỗi xóa dữ liệu');
    }
  };

  const openEdit = (app: any) => {
    setFormData(app);
    setIsEditing(true);
    setShowModal(true);
  };

  return (
    <main className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-0 font-weight-bold text-primary">Ứng dụng AppSheet</h1>
          <p className="text-muted mb-0 small">Quản lý các tài khoản kết nối AppSheet API</p>
        </div>
        <button onClick={() => { setIsEditing(false); setFormData({ ma_id: '', ten_ung_dung: '', app_id: '', khoa_api: '', trang_thai: 'Hoạt động' }); setShowModal(true); }} className="btn btn-primary d-flex align-items-center px-4 shadow-sm">
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
                      <Loader2 size={24} className="animate-spin text-primary d-inline-block" />
                      <p className="mt-2 text-muted">Đang tải dữ liệu từ Google Sheets...</p>
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
                        <button onClick={() => openEdit(app)} className="btn btn-sm btn-outline-primary border-0 me-2 shadow-none">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => deleteApp(app.ma_id)} className="btn btn-sm btn-outline-danger border-0 shadow-none">
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
      
      {/* Modal Thêm/Sửa */}
      {showModal && (
        <div className="modal show d-block shadow" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-white border-0">
                <h5 className="modal-title font-weight-bold">{isEditing ? 'Cập nhật ứng dụng' : 'Thêm ứng dụng mới'}</h5>
                <button type="button" className="btn-close shadow-none" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label font-weight-bold small text-muted">Tên ứng dụng nội bộ</label>
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
                    <label className="form-label font-weight-bold small text-muted">App ID (từ AppSheet Editor)</label>
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
                    <label className="form-label font-weight-bold small text-muted">Access Key (API Key)</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      value={formData.khoa_api}
                      onChange={e => setFormData({...formData, khoa_api: e.target.value})}
                      placeholder="Nhập khóa API từ AppSheet" 
                      required 
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label font-weight-bold small text-muted">Trạng thái</label>
                    <select className="form-select" value={formData.trang_thai} onChange={e => setFormData({...formData, trang_thai: e.target.value})}>
                      <option value="Hoạt động">Hoạt động</option>
                      <option value="Tạm dừng">Tạm dừng</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-light px-4" onClick={() => setShowModal(false)}>Hủy</button>
                  <button type="submit" className="btn btn-primary px-4 shadow-sm">{isEditing ? 'Cập nhật' : 'Lưu lại'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4">
        <Link href="/" className="btn btn-link p-0 text-decoration-none text-muted small">← Quay lại Tổng quan</Link>
      </div>
    </main>
  );
}
