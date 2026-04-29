# Cấu trúc Dữ liệu Hệ thống (Database Schema)

Hệ thống sử dụng các Sheets trong Google Spreadsheet làm cơ sở dữ liệu chính.

## 1. Bảng `ung_dung` (Quản lý kết nối AppSheet)
Lưu trữ thông tin cấu hình API để kết nối với các ứng dụng AppSheet khác nhau.

| Cột | Kiểu dữ liệu | Mô tả |
|:---|:---|:---|
| `ma_id` | String | Khóa chính (VD: APP_01) |
| `ten_ung_dung` | String | Tên hiển thị gợi nhớ |
| `app_id` | String | ID của ứng dụng trong AppSheet |
| `khoa_api` | String | API Key lấy từ AppSheet Manage > Integration |
| `folder_mau_id` | String | ID thư mục Google Drive chứa các file mẫu (Template) |
| `folder_xuat_id` | String | ID thư mục Google Drive để lưu trữ file kết quả (.pdf/.docx) |
| `bang_chinh` | String | Tên bảng mặc định trong AppSheet để truy vấn dữ liệu |
| `trang_thai` | String | Hoạt động / Tạm dừng |

## 2. Bảng `mau_bieu` (Quản lý mẫu báo cáo)
Định nghĩa cách trộn dữ liệu vào các file Word/Excel mẫu.

| Cột | Kiểu dữ liệu | Mô tả |
|:---|:---|:---|
| `ma_id` | String | Khóa chính |
| `ten_mau` | String | Tên mẫu báo cáo (VD: Hợp đồng lao động) |
| `ma_mau` | String | Mã định danh mẫu để gọi từ URL (VD: HDLD_V1) |
| `file_id_drive` | String | ID của file Word (.docx) hoặc Excel (.xlsx) mẫu trên Drive |
| `loai_file` | String | DOCX / XLSX |
| `ma_ung_dung` | String | Liên kết với `ma_id` của bảng `ung_dung` |
| `bang_chinh` | String | Tên bảng chứa dòng dữ liệu cần in |
| `key_col` | String | Tên cột khóa chính của bảng trong AppSheet (thường là ma_id) |
| `child_table` | String | (Tùy chọn) Tên bảng chi tiết/con (VD: ChiTietDonHang) |
| `foreign_key` | String | (Tùy chọn) Cột khóa ngoại ở bảng con nối với bảng chính |
| `child_name` | String | Tên biến đại diện cho danh sách con trong Template (VD: items) |

## 3. Bảng `nhat_ky_in` (Lịch sử hệ thống)
Theo dõi mọi thao tác in ấn để quản lý và kiểm soát.

| Cột | Kiểu dữ liệu | Mô tả |
|:---|:---|:---|
| `ngay_tao` | DateTime | Thời điểm thực hiện lệnh in |
| `ma_id` | String | ID của dòng dữ liệu được in |
| `nguoi_dung` | String | Email người thực hiện (từ Google Auth) |
| `ten_mau` | String | Tên mẫu biểu đã sử dụng |
| `trang_thai` | String | Thành công / Thất bại |
| `file_id_drive` | String | Link hoặc ID file đã xuất ra (nếu có lưu trữ) |

## 4. Bảng `cau_hinh` (Cấu hình hệ thống)
Lưu trữ các tham số vận hành chung.

| Cột | Kiểu dữ liệu | Mô tả |
|:---|:---|:---|
| `khoa` | String | Tên tham số (VD: phien_ban) |
| `gia_tri` | String | Giá trị tương ứng |
