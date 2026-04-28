'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Settings, Plus, Info, RefreshCw, Loader2, Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function AnhXaPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [mappings, setMappings] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    ma_id: '',
    ma_mau: '',
    ten_bien: '',
    ten_cot_du_lieu: ''
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [mapRes, tplRes] = await Promise.all([
        fetch('/api/config?table=anh_xa_bien'),
        fetch('/api/config?table=mau_bieu')
      ]);
      const maps = await mapRes.json();
      const tpls = await tplRes.json();
      
      if (Array.isArray(maps)) setMappings(maps.filter((m: any) => !m.ma_id?.startsWith('DELETED_')));
      if (Array.isArray(tpls)) setTemplates(tpls.filter((t: any) => !t.ma_id?.startsWith('DELETED_')));
    } catch (err) {
      console.error('Lỗi tải mapping:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) fetchData();
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table: 'anh_xa_bien',
          data: { ...formData, ma_id: 'AX' + Date.now() }
        })
      });

      if (res.ok) {
        setShowModal(false);
        setFormData({ ma_id: '', ma_mau: '', ten_bien: '', ten_cot_du_lieu: '' });
        fetchData();
      }
    } catch (err) {
      alert('Lỗi lưu ánh xạ');
    }
  };

  const deleteMapping = async (id: string) => {
    if (!confirm('Xóa quy tắc Mapping này?')) return;
    try {
      await fetch(`/api/config?table=anh_xa_bien&id=${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err) {
      alert('Lỗi xóa');
    }
  };

  return (
    <main className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-0 font-weight-bold text-primary">Ánh xạ biến (Mapping)</h1>
          <p className="text-muted mb-0 small">Quy định dữ liệu AppSheet sẽ đi vào biến nào trong file mẫu</p>
        </div>
        <div className="d-flex gap-2">
          <button onClick={() => setShowModal(true)} className="btn btn-primary d-flex align-items-center px-4 shadow-sm">
            <Plus size={18} className="me-2" /> Thêm ánh xạ
          </button>
        </div>
      </div>

      <div className="alert alert-warning border-0 shadow-sm mb-4 d-flex align-items-center">
        <Info size={20} className="me-3 text-warning" />
        <div className="small">
          <strong>Lưu ý quan trọng:</strong> Tên biến trong file Word phải nằm trong cặp ngoặc thích hợp (VD: <code>{`{ten_bien}`}</code> hoặc <code>{`<<ten_bien>>`}</code>) tùy theo cách bạn đặt trong file mẫu. Tên cột AppSheet phải nằm trong ngoặc vuông <code>[Tên Cột]</code>.
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-lg overflow-hidden">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="px-4">ID</th>
                  <th>Mã Mẫu</th>
                  <th>Tên biến (Trong file)</th>
                  <th>Tên cột (AppSheet)</th>
                  <th className="text-end px-4"> Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-5">
                      <Loader2 size={24} className="animate-spin text-primary d-inline-block" />
                      <p className="mt-2 text-muted">Đang tải quy tắc mapping...</p>
                    </td>
                  </tr>
                ) : mappings.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-5 text-muted">Chưa có ánh xạ nào được cấu hình.</td></tr>
                ) : (
                  mappings.map((m) => (
                    <tr key={m.ma_id}>
                      <td className="px-4 text-muted small">{m.ma_id}</td>
                      <td><span className="badge bg-primary-subtle text-primary border-0">{m.ma_mau}</span></td>
                      <td><code className="text-danger font-weight-bold">{m.ten_bien}</code></td>
                      <td><code className="text-success font-weight-bold">{m.ten_cot_du_lieu}</code></td>
                      <td className="text-end px-4">
                        <button onClick={() => deleteMapping(m.ma_id)} className="btn btn-sm btn-outline-danger border-0 shadow-none">
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

      {/* Modal Thêm Ánh Xạ */}
      {showModal && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header border-0">
                <h5 className="modal-title font-weight-bold">Thêm quy tắc ánh xạ</h5>
                <button type="button" className="btn-close shadow-none" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label font-weight-bold small text-muted">Chọn mẫu biểu</label>
                    <select 
                      className="form-select" 
                      value={formData.ma_mau} 
                      onChange={e => setFormData({...formData, ma_mau: e.target.value})}
                      required
                    >
                      <option value="">-- Chọn mẫu biểu cần mapping --</option>
                      {templates.map(tpl => (
                        <option key={tpl.ma_id} value={tpl.ma_id}>{tpl.ten_mau} ({tpl.ma_id})</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label font-weight-bold small text-muted">Tên biến trong file (VD: {`{ho_ten}`})</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={formData.ten_bien}
                      onChange={e => setFormData({...formData, ten_bien: e.target.value})}
                      placeholder="Nhập chính xác ký tự trong file mẫu" 
                      required 
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label font-weight-bold small text-muted">Tên cột trong AppSheet (VD: [FullName])</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={formData.ten_cot_du_lieu}
                      onChange={e => setFormData({...formData, ten_cot_du_lieu: e.target.value})}
                      placeholder="VD: [FullName]" 
                      required 
                    />
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-light px-4" onClick={() => setShowModal(false)}>Hủy</button>
                  <button type="submit" className="btn btn-primary px-4 shadow-sm">Lưu ánh xạ</button>
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
