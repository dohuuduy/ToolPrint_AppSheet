import Link from 'next/link';
import { Settings, Plus, Info, RefreshCw } from 'lucide-react';

export default function AnhXaPage() {
  const mappings = [
    { id: 1, app_col: 'ho_ten_khach', template_key: 'ho_ten', type: 'Chuỗi' },
    { id: 2, app_col: 'ngay_dat_hang', template_key: 'ngay_mua', type: 'Ngày' },
    { id: 3, app_col: 'tong_tien_sau_thue', template_key: 'tong_tien', type: 'Số' },
  ];

  return (
    <main className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Ánh xạ biến (Mapping)</h1>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary d-flex align-items-center">
            <RefreshCw size={18} className="me-2" /> Làm mới cột
          </button>
          <button className="btn btn-primary d-flex align-items-center">
            <Plus size={18} className="me-2" /> Thêm ánh xạ
          </button>
        </div>
      </div>

      <div className="alert alert-warning d-flex align-items-center border-0 shadow-sm mb-4">
        <Info size={20} className="me-3" />
        <div>
          <strong>Gợi ý:</strong> Tên biến trong Word/Excel nên đặt trùng với tên cột trong AppSheet để hệ thống tự động nhận diện mà không cần cấu hình bằng tay nhiều.
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="px-4">ID</th>
                  <th>Cột AppSheet (Source)</th>
                  <th>Từ khóa Template (Target)</th>
                  <th>Kiểu dữ liệu</th>
                  <th className="text-end px-4">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {mappings.map((m) => (
                  <tr key={m.id}>
                    <td className="px-4 text-muted">{m.id}</td>
                    <td><span className="badge bg-secondary-subtle text-secondary font-monospace">{m.app_col}</span></td>
                    <td><span className="badge bg-primary-subtle text-primary font-monospace">{`{${m.template_key}}`}</span></td>
                    <td>{m.type}</td>
                    <td className="text-end px-4">
                      <button className="btn btn-sm btn-link text-primary me-2 p-0">Sửa</button>
                      <button className="btn btn-sm btn-link text-danger p-0">Xóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card-footer bg-white py-3 px-4 border-0">
          <p className="mb-0 text-muted small">Hiển thị {mappings.length} quy tắc ánh xạ</p>
        </div>
      </div>

      <div className="mt-4">
        <Link href="/" className="btn btn-link p-0 text-decoration-none">← Quay lại Tổng quan</Link>
      </div>
    </main>
  );
}
