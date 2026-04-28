import Link from 'next/link';
import { History, Download, Filter, Search } from 'lucide-react';

export default function NhatKyPage() {
  const logs = [
    { id: 1, time: '28/04/2026 09:15', user: 'Admin', template: 'Hợp đồng v1', row: 'HD-001', status: 'Thành công' },
    { id: 2, time: '28/04/2026 08:30', user: 'User 02', template: 'Phiếu xuất kho', row: 'PX-202', status: 'Thành công' },
    { id: 3, time: '27/04/2026 16:45', user: 'Admin', template: 'Báo cáo tháng', row: 'BC-04', status: 'Thất bại' },
  ];

  return (
    <main className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Nhật ký in & báo cáo</h1>
        <button className="btn btn-outline-success d-flex align-items-center">
          <Download size={18} className="me-2" /> Xuất Nhật ký (.xlsx)
        </button>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3 border-0">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-transparent"><Search size={18} /></span>
                <input type="text" className="form-control" placeholder="Tìm kiếm theo ID, người dùng..." />
              </div>
            </div>
            <div className="col-md-6 d-flex justify-content-md-end gap-2">
              <button className="btn btn-outline-secondary d-flex align-items-center">
                <Filter size={18} className="me-2" /> Lọc theo ngày
              </button>
            </div>
          </div>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="px-4">Thời gian</th>
                  <th>Người dùng</th>
                  <th>Mẫu biểu</th>
                  <th>ID Bản ghi</th>
                  <th>Trạng thái</th>
                  <th className="text-end px-4">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td className="px-4 small">{log.time}</td>
                    <td>{log.user}</td>
                    <td>{log.template}</td>
                    <td><code>{log.row}</code></td>
                    <td>
                      <span className={`badge ${log.status === 'Thành công' ? 'bg-success' : 'bg-danger'}`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="text-end px-4">
                      <button className="btn btn-sm btn-link text-primary p-0">Xem chi tiết</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card-footer bg-white text-center py-3">
          <nav aria-label="Page navigation">
            <ul className="pagination pagination-sm justify-content-center mb-0">
              <li className="page-item disabled"><a className="page-link" href="#">Trước</a></li>
              <li className="page-item active"><a className="page-link" href="#">1</a></li>
              <li className="page-item"><a className="page-link" href="#">2</a></li>
              <li className="page-item"><a className="page-link" href="#">Tiếp</a></li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="mt-4">
        <Link href="/" className="btn btn-link p-0 text-decoration-none">← Quay lại Tổng quan</Link>
      </div>
    </main>
  );
}
