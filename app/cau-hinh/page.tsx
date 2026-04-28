import Link from 'next/link';
import { Settings, Save, AlertCircle } from 'lucide-react';

export default function CauHinhPage() {
  return (
    <main className="container-fluid py-4">
      <h1 className="h3 mb-4">Cấu hình hệ thống</h1>

      <div className="row g-4">
        <div className="col-12 col-md-8">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0">Tham số kết nối Google</h5>
            </div>
            <div className="card-body">
              <form>
                <div className="mb-3">
                  <label className="form-label font-weight-bold small">Google Client ID</label>
                  <input type="text" className="form-control" defaultValue="8123...apps.googleusercontent.com" readOnly />
                </div>
                <div className="mb-3">
                  <label className="form-label font-weight-bold small">Google Client Secret</label>
                  <div className="input-group">
                    <input type="password" className="form-control" defaultValue="GOCSPX-..." readOnly />
                    <button className="btn btn-outline-secondary" type="button">Thay đổi</button>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label font-weight-bold small">Sheet ID Nhật ký (Logging)</label>
                  <input type="text" className="form-control" placeholder="Dán ID Google Sheet vào đây..." />
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label font-weight-bold small">Folder ID Mẫu biểu</label>
                    <input type="text" className="form-control" placeholder="Folder ID..." />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label font-weight-bold small">Folder ID Output (Lưu PDF)</label>
                    <input type="text" className="form-control" placeholder="Folder ID..." />
                  </div>
                </div>
                <hr className="my-4" />
                <div className="d-flex justify-content-end">
                  <button type="button" className="btn btn-primary d-flex align-items-center">
                    <Save size={18} className="me-2" /> Lưu cấu hình
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm bg-primary text-white mb-4">
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <AlertCircle size={24} className="me-2" />
                <h5 className="mb-0 text-white">Lưu ý bảo mật</h5>
              </div>
              <p className="small mb-0">
                Các mã API và Secret Key được lưu trữ mã hóa trong môi trường backend (Vercel ENV). 
                Không chia sẻ link cấu hình này cho người lạ.
              </p>
            </div>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Phiên bản</h5>
              <p className="text-muted small mb-2">Build: v1.0.0-stable</p>
              <p className="text-muted small mb-4">Khởi tạo: 28/04/2026</p>
              <button className="btn btn-outline-danger btn-sm w-100">Xóa toàn bộ dữ liệu cấu hình</button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 text-center">
        <Link href="/" className="btn btn-link p-0 text-decoration-none">← Quay lại Tổng quan</Link>
      </div>
    </main>
  );
}
