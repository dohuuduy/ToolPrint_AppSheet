import Link from 'next/link';
import { Settings, Save, Globe, Lock, ShieldCheck } from 'lucide-react';

export default function CauHinhPage() {
  return (
    <main className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Cấu hình hệ thống</h1>
        <button className="btn btn-primary d-flex align-items-center">
          <Save size={18} className="me-2" /> Lưu cấu hình
        </button>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-8">
          {/* Cấu hình Google API */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-transparent border-bottom py-3">
              <h5 className="mb-0 d-flex align-items-center">
                <Globe size={20} className="me-2 text-primary" /> Kết nối Google Cloud
              </h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label font-weight-bold">Google Client ID</label>
                  <input type="text" className="form-control" placeholder="...apps.googleusercontent.com" />
                </div>
                <div className="col-md-6">
                  <label className="form-label font-weight-bold">Google Client Secret</label>
                  <input type="password" className="form-control" placeholder="••••••••••••••••" />
                </div>
                <div className="col-md-12">
                  <label className="form-label font-weight-bold">Google Sheet ID (Logging)</label>
                  <input type="text" className="form-control" placeholder="ID của file Google Sheet lưu nhật ký" />
                  <div className="form-text">File này dùng để lưu lịch sử in ấn phục vụ báo cáo.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Cấu hình AppSheet API */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-transparent border-bottom py-3">
              <h5 className="mb-0 d-flex align-items-center">
                <Lock size={20} className="me-2 text-warning" /> AppSheet API Access
              </h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-12">
                  <label className="form-label font-weight-bold">AppSheet Application ID</label>
                  <input type="text" className="form-control" placeholder="Mã ID ứng dụng AppSheet" />
                </div>
                <div className="col-md-12">
                  <label className="form-label font-weight-bold">AppSheet API Key</label>
                  <input type="password" className="form-control" placeholder="Ghi nhận tại Manage > Integrations > IN" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm bg-primary text-white mb-4">
            <div className="card-body">
              <h5 className="card-title d-flex align-items-center">
                <ShieldCheck size={20} className="me-2" /> Hướng dẫn bảo mật
              </h5>
              <div className="small">
                <p>Các thông tin cấu hình này cực kỳ quan trọng:</p>
                <ul>
                  <li>Không chia sẻ API Key cho người khác.</li>
                  <li>Nếu bạn dùng trên Vercel, hãy sử dụng <strong>Environment Variables</strong>.</li>
                  <li>Đảm bảo tài khoản Google thực hiện in có quyền truy cập vào các thư mục Drive tương ứng.</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Phiên bản</h5>
              <p className="text-muted small">v1.0.0-PRO</p>
              <hr />
              <p className="mb-1 text-success">● Trạng thái hệ thống: Sẵn sàng</p>
              <p className="mb-0 text-muted small">Cập nhật lần cuối: 28/04/2026</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <Link href="/" className="btn btn-link p-0 text-decoration-none">← Quay lại Tổng quan</Link>
      </div>
    </main>
  );
}
