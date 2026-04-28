'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Settings, Plus, Info, RefreshCw, Loader2, Trash2 } from 'lucide-react';

export default function AnhXaPage() {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [mappings, setMappings] = useState<any[]>([
    { ma_id: 'AX01', ma_mau: 'MB01', ten_bien: '<<HoTen>>', ten_cot_du_lieu: '[Full Name]' },
    { ma_id: 'AX02', ma_mau: 'MB01', ten_bien: '<<NgaySinh>>', ten_cot_du_lieu: '[Birthday]' },
  ]);

  const [formData, setFormData] = useState({
    ma_mau: '',
    ten_bien: '',
    ten_cot_du_lieu: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newMapping = {
      ma_id: 'AX' + Math.floor(Math.random() * 1000),
      ...formData
    };
    setMappings([...mappings, newMapping]);
    setShowModal(false);
    setFormData({ ma_mau: '', ten_bien: '', ten_cot_du_lieu: '' });
  };

  return (
    <main className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-0 font-weight-bold text-primary">Ánh xạ biến (Mapping)</h1>
          <p className="text-muted mb-0 small">Quy định dữ liệu AppSheet sẽ đi vào biến nào trong file mẫu</p>
        </div>
        <div className="d-flex gap-2">
          <button onClick={() => setShowModal(true)} className="btn btn-primary d-flex align-items-center px-4">
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
                  <th className="text-end px-4">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {mappings.map((m) => (
                  <tr key={m.ma_id}>
                    <td className="px-4 text-muted small">{m.ma_id}</td>
                    <td><span className="badge bg-primary-subtle text-primary">{m.ma_mau}</span></td>
                    <td><code className="text-danger font-weight-bold">{m.ten_bien}</code></td>
                    <td><code className="text-success font-weight-bold">{m.ten_cot_du_lieu}</code></td>
                    <td className="text-end px-4">
                      <button className="btn btn-sm btn-outline-danger border-0">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Thêm Ánh Xạ */}
      {showModal && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title font-weight-bold">Thêm quy tắc ánh xạ</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label font-weight-bold small">Chọn mẫu biểu</label>
                    <select 
                      className="form-select" 
                      value={formData.ma_mau} 
                      onChange={e => setFormData({...formData, ma_mau: e.target.value})}
                      required
                    >
                      <option value="">-- Chọn mẫu biểu cần mapping --</option>
                      <option value="MB01">Hợp đồng lao động</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label font-weight-bold small">Tên biến trong file (VD: {`{ho_ten}`})</label>
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
                    <label className="form-label font-weight-bold small">Tên cột trong AppSheet (VD: [Họ và tên])</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={formData.ten_cot_du_lieu}
                      onChange={e => setFormData({...formData, ten_cot_du_lieu: e.target.value})}
                      placeholder="Nhập tên cột của bảng AppSheet" 
                      required 
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Hủy</button>
                  <button type="submit" className="btn btn-primary px-4">Lưu ánh xạ</button>
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
