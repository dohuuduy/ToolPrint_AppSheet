import Link from 'next/link';
import { FileText, Plus, Upload, FileType } from 'lucide-react';

export default function MauBieuPage() {
  const templates = [
    { id: 1, name: 'Hợp đồng lao động v1', type: 'Word', code: 'HD_LD_01', date: '28/04/2026' },
    { id: 2, name: 'Phiếu xuất kho', type: 'Excel', code: 'PXK_02', date: '27/04/2026' },
    { id: 3, name: 'Báo cáo doanh thu tháng', type: 'Word', code: 'BCDT_01', date: '26/04/2026' },
  ];

  return (
    <main className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Mẫu biểu (Templates)</h1>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-primary d-flex align-items-center">
            <Upload size={18} className="me-2" /> Upload mới
          </button>
          <button className="btn btn-primary d-flex align-items-center">
            <Plus size={18} className="me-2" /> Lấy từ Drive
          </button>
        </div>
      </div>

      <div className="row g-4">
        {templates.map((tpl) => (
          <div key={tpl.id} className="col-12 col-md-4">
            <div className="card h-100 border-0 shadow-sm hover-shadow transition">
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <div className={`p-3 rounded-circle me-3 ${tpl.type === 'Word' ? 'bg-primary-subtle text-primary' : 'bg-success-subtle text-success'}`}>
                    <FileType size={24} />
                  </div>
                  <div>
                    <h6 className="mb-0 font-weight-bold">{tpl.name}</h6>
                    <code className="small text-muted">{tpl.code}</code>
                  </div>
                </div>
                <p className="text-muted small mb-3">Định dạng: <strong>{tpl.type}</strong></p>
                <div className="d-flex justify-content-between align-items-center border-top pt-3">
                  <span className="small text-muted">Cập nhật: {tpl.date}</span>
                  <div className="btn-group">
                    <button className="btn btn-sm btn-link text-primary p-0 me-3">Mapping</button>
                    <button className="btn btn-sm btn-link text-danger p-0">Xóa</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 bg-white p-4 rounded shadow-sm">
        <h5 className="mb-3">Hướng dẫn đặt biến trong mẫu</h5>
        <div className="alert alert-info small mb-0">
          <ul className="mb-0">
            <li><strong>Word:</strong> Sử dụng thẻ <code>{`{ten_bien}`}</code>. Ví dụ: <code>{`Họ tên: {ho_ten}`}</code></li>
            <li><strong>Excel:</strong> Sử dụng thẻ <code>{`{{ten_bien}}`}</code> hoặc đặt tên cho Cell.</li>
            <li>Lưu ý: Tên biến phải khớp với cột trong AppSheet hoặc quy tắc mapping.</li>
          </ul>
        </div>
      </div>

      <div className="mt-4 text-center">
        <Link href="/" className="btn btn-link p-0 text-decoration-none">← Quay lại Tổng quan</Link>
      </div>
    </main>
  );
}
