import Link from 'next/link';
import { Database, Plus, Search } from 'lucide-react';

export default function UngDungPage() {
  return (
    <main className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Ứng dụng AppSheet</h1>
        <button className="btn btn-primary d-flex align-items-center">
          <Plus size={18} className="me-2" /> Thêm ứng dụng
        </button>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="input-group mb-3" style={{ maxWidth: '400px' }}>
            <span className="input-group-text bg-transparent border-end-0">
              <Search size={18} className="text-muted" />
            </span>
            <input type="text" className="form-control border-start-0" placeholder="Tìm kiếm ứng dụng..." />
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr className="table-light">
                  <th>Tên ứng dụng</th>
                  <th>App ID</th>
                  <th>Trạng thái</th>
                  <th>Ngày kết nối</th>
                  <th className="text-end">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-weight-bold">Quản lý Kho</td>
                  <td><code>a648...9336</code></td>
                  <td><span className="badge bg-success">Đang chạy</span></td>
                  <td>20/04/2026</td>
                  <td className="text-end">
                    <button className="btn btn-sm btn-outline-secondary me-2">Sửa</button>
                    <button className="btn btn-sm btn-outline-danger">Gỡ</button>
                  </td>
                </tr>
                <tr>
                  <td className="font-weight-bold">Quản lý Nhân sự</td>
                  <td><code>b291...1120</code></td>
                  <td><span className="badge bg-success">Đang chạy</span></td>
                  <td>25/04/2026</td>
                  <td className="text-end">
                    <button className="btn btn-sm btn-outline-secondary me-2">Sửa</button>
                    <button className="btn btn-sm btn-outline-danger">Gỡ</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <Link href="/" className="btn btn-link p-0 text-decoration-none">← Quay lại Tổng quan</Link>
      </div>
    </main>
  );
}
