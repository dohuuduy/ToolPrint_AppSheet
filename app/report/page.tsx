'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Printer, Download, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

function ReportContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const templateCode = searchParams.get('template');

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Thiếu tham số ID bản ghi.");
      setLoading(false);
      return;
    }

    // Giả lập gọi API lấy dữ liệu từ AppSheet
    // Trong thực tế, bạn sẽ gọi một API route của Next.js (vì AppSheet API cần Server Secret)
    const fetchData = async () => {
      try {
        // fetch(`/api/report/data?id=${id}`)
        // Demo: Giả lập dữ liệu thành công
        setTimeout(() => {
          setData({
            ma_id: id,
            ho_ten: "Nguyễn Văn Khách Hàng",
            ngay_sinh: "01/01/1990",
            dia_chi: "123 Đường ABC, Quận 1, TP. HCM",
            so_dien_thoai: "0901234567",
            email: "khachhang@example.com",
            ten_mau: templateCode || "Mẫu Mặc Định",
            ngay_tao: new Date().toLocaleDateString('vi-VN'),
            noi_dung: "Nội dung chi tiết của báo cáo sẽ được hiển thị ở đây dựa trên dữ liệu thật từ AppSheet.",
            tong_tien: "5,000,000 VNĐ"
          });
          setLoading(false);
        }, 1500);
      } catch (err) {
        setError("Không thể tải dữ liệu từ AppSheet.");
        setLoading(false);
      }
    };

    fetchData();
  }, [id, templateCode]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center min-vh-100">
        <Loader2 className="animate-spin text-primary mb-3" size={48} />
        <p className="text-muted">Đang tải dữ liệu và chuẩn bị báo cáo...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger d-inline-block">
          {error}
        </div>
        <div className="mt-3">
          <Link href="/" className="btn btn-primary d-inline-flex align-items-center">
            <ArrowLeft size={18} className="me-2" /> Quay lại trang chủ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100 py-4">
      {/* Toolbar */}
      <div className="container-fluid d-print-none mb-4">
        <div className="bg-white p-3 rounded shadow-sm d-flex justify-content-between align-items-center">
          <Link href="/" className="btn btn-link text-decoration-none text-dark d-flex align-items-center">
            <ArrowLeft size={18} className="me-2" /> Trở về
          </Link>
          <div className="d-flex gap-2">
            <button onClick={handlePrint} className="btn btn-primary d-flex align-items-center">
              <Printer size={18} className="me-2" /> In báo cáo (PDF)
            </button>
            <button className="btn btn-outline-success d-flex align-items-center">
              <Download size={18} className="me-2" /> Tải Excel
            </button>
          </div>
        </div>
      </div>

      {/* Preview Area */}
      <div className="report-preview">
        <div className="row mb-5 border-bottom pb-4 align-items-center">
          <div className="col-8">
            <h1 className="h2 text-primary mb-1">CÔNG TY TNHH GIẢI PHÁP APPSHEET</h1>
            <p className="mb-0 text-muted small">Địa chỉ: Khu Công nghệ cao, Quận 9, TP. Thủ Đức</p>
            <p className="mb-0 text-muted small">Điện thoại: 028.1234.5678 | Email: info@appsheetpro.vn</p>
          </div>
          <div className="col-4 text-end">
            <div className="border p-2 d-inline-block">
              <p className="mb-0 small text-muted">Mã số báo cáo</p>
              <h5 className="mb-0 font-weight-bold">{data.ma_id}</h5>
            </div>
          </div>
        </div>

        <div className="text-center mb-5">
          <h2 className="font-weight-bold text-uppercase" style={{ letterSpacing: '2px' }}>
            {data.ten_mau === 'HD01' ? 'Hợp Đồng Lao Động' : 'Phiếu Thông Tin Báo Cáo'}
          </h2>
          <p className="text-muted italic">Ngày tạo: {data.ngay_tao}</p>
        </div>

        <div className="row mb-4">
          <div className="col-12">
            <h5 className="border-bottom pb-2 mb-3 font-weight-bold text-dark">I. THÔNG TIN ĐỐI TƯỢNG</h5>
            <table className="table table-borderless">
              <tbody>
                <tr>
                  <td style={{ width: '200px' }}>Họ và tên:</td>
                  <td className="font-weight-bold">{data.ho_ten}</td>
                </tr>
                <tr>
                  <td>Ngày sinh:</td>
                  <td>{data.ngay_birth || data.ngay_sinh}</td>
                </tr>
                <tr>
                  <td>Số điện thoại:</td>
                  <td>{data.so_dien_thoai}</td>
                </tr>
                <tr>
                  <td>Email:</td>
                  <td>{data.email}</td>
                </tr>
                <tr>
                  <td>Địa chỉ:</td>
                  <td>{data.dia_chi}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="row mb-5">
          <div className="col-12">
            <h5 className="border-bottom pb-2 mb-3 font-weight-bold text-dark">II. NỘI DUNG CHI TIẾT</h5>
            <p className="lh-lg">
              {data.noi_dung} 
              Mọi thông tin trong báo cáo này được trích xuất trực tiếp từ cơ sở dữ liệu AppSheet và có giá trị tham khảo nội bộ.
              Dữ liệu được cập nhật tự động vào lúc {new Date().toLocaleTimeString('vi-VN')}.
            </p>
            <div className="p-4 bg-light rounded mt-3 text-end">
              <h4 className="mb-0">TỔNG GIÁ TRỊ: <span className="text-danger font-weight-bold">{data.tong_tien}</span></h4>
            </div>
          </div>
        </div>

        <div className="row mt-5 pt-5">
          <div className="col-6 text-center">
            <p className="font-weight-bold mb-5 pb-5">Người lập biểu</p>
            <p className="mt-5">{data.nguoi_lap || 'Hệ thống tự động'}</p>
          </div>
          <div className="col-6 text-center">
            <p className="font-weight-bold mb-5 pb-5">Giám đốc xác nhận</p>
            <p className="mt-5">(Ký và đóng dấu)</p>
          </div>
        </div>

        <footer className="mt-5 pt-5 text-center text-muted small border-top d-none d-print-block">
          Trang 1/1 - In từ hệ thống AppSheet Print Pro - {new Date().toLocaleString('vi-VN')}
        </footer>
      </div>
    </div>
  );
}

export default function ReportPage() {
  return (
    <Suspense fallback={<div>Đang tải...</div>}>
      <ReportContent />
    </Suspense>
  );
}
