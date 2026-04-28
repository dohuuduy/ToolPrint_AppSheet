import Link from 'next/link';
import { 
  FileText, 
  Settings, 
  Layout, 
  Database, 
  History, 
  Printer,
  ChevronRight
} from 'lucide-react';

export default function Home() {
  return (
    <main className="container-fluid py-4">
      <header className="bg-white p-4 rounded shadow-sm mb-4 d-flex justify-content-between align-items-center">
        <div>
          <h1 className="h3 mb-0 text-primary font-weight-bold">AppSheet Print & Report Pro</h1>
          <p className="text-muted mb-0">Hệ thống trộn dữ liệu và in báo cáo chuyên nghiệp</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-primary btn-sm">Đăng xuất</button>
        </div>
      </header>

      <div className="row g-4">
        <div className="col-12 col-md-3">
          <div className="list-group shadow-sm">
            <Link href="/" className="list-group-item list-group-item-action active">
              <Layout size={18} className="me-2" /> Tổng quan
            </Link>
            <Link href="/ung-dung" className="list-group-item list-group-item-action">
              <Database size={18} className="me-2" /> Ứng dụng AppSheet
            </Link>
            <Link href="/mau-bieu" className="list-group-item list-group-item-action">
              <FileText size={18} className="me-2" /> Mẫu biểu (Templates)
            </Link>
            <Link href="/anh-xa" className="list-group-item list-group-item-action">
              <Settings size={18} className="me-2" /> Ánh xạ biến
            </Link>
            <Link href="/nhat-ky" className="list-group-item list-group-item-action">
              <History size={18} className="me-2" /> Nhật ký in
            </Link>
            <Link href="/cau-hinh" className="list-group-item list-group-item-action">
              <Settings size={18} className="me-2" /> Cấu hình hệ thống
            </Link>
          </div>
        </div>

        <div className="col-12 col-md-9">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title mb-4">Trạng thái hệ thống</h5>
              <div className="row text-center">
                <div className="col-md-3">
                  <div className="p-3 border rounded">
                    <h2 className="text-primary font-weight-bold">12</h2>
                    <p className="text-muted small mb-0">Ứng dụng</p>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="p-3 border rounded">
                    <h2 className="text-success font-weight-bold">45</h2>
                    <p className="text-muted small mb-0">Mẫu biểu</p>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="p-3 border rounded">
                    <h2 className="text-info font-weight-bold">1,234</h2>
                    <p className="text-muted small mb-0">Lượt in báo cáo</p>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="p-3 border rounded">
                    <h2 className="text-warning font-weight-bold">OK</h2>
                    <p className="text-muted small mb-0">Kết nối API</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent border-0 pt-4 px-4">
              <h5 className="mb-0">Hoạt động gần đây</h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="px-4">Thời gian</th>
                      <th>Người thực hiện</th>
                      <th>Mẫu biểu</th>
                      <th>Bản ghi ID</th>
                      <th className="text-end px-4">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <tr key={i}>
                        <td className="px-4 small">28/04/2026 08:30</td>
                        <td>Nguyễn Văn A</td>
                        <td>Hợp đồng Lao động</td>
                        <td><code>HD-2026-00{i}</code></td>
                        <td className="text-end px-4">
                          <button className="btn btn-sm btn-link text-primary p-0">
                            <Printer size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
