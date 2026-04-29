# Cấu trúc Dữ liệu Hệ thống (Google Sheet DB)

Hệ thống sử dụng một file Google Spreadsheet làm database trung tâm. Dưới đây là cấu trúc chi tiết của các bảng (Sheets):

---

## 1. Bảng `ung_dung` (Quản lý kết nối AppSheet)
Lưu trữ thông tin cấu hình để ứng dụng có thể gọi API vào AppSheet của bạn.

| Cột | Kiểu dữ liệu | Mô tả |
| :--- | :--- | :--- |
| `ma_id` | String (Internal ID) | ID tự sinh của hệ thống PrintHub |
| `ten_ung_dung` | String | Tên gợi nhớ của ứng dụng |
| `app_id` | String | ID của AppSheet (lấy từ Editor > Manage > Integrations) |
| `khoa_api` | String | API Key của AppSheet |
| `folder_mau_id` | String | ID thư mục Google Drive chứa các file Template |
| `folder_xuat_id` | String | ID thư mục Google Drive để lưu file sau khi trộn |

---

## 2. Bảng `mau_bieu` (Danh mục Template)
Định nghĩa các mẫu báo cáo và quy tắc trộn dữ liệu.

| Cột | Kiểu dữ liệu | Mô tả |
| :--- | :--- | :--- |
| `ma_id` | String | ID tự sinh |
| `ten_mau` | String | Tên hiển thị của báo cáo |
| `ma_mau` | String | **Token quan trọng** dùng trong URL AppSheet Action |
| `ma_ung_dung` | String | Link tới `ma_id` của bảng `ung_dung` |
| `file_id_drive` | String | ID của file Word/Excel mẫu trên Google Drive |
| `loai_file` | Enum (DOCX, XLSX) | Định dạng của tệp mẫu |
| `bang_chinh` | String | Tên bảng trong AppSheet muốn lấy dữ liệu |
| `key_col` | String | Tên cột khóa chính (thường là `ma_id` hoặc `_RowNumber`) |
| `child_table` | String (Optional) | Tên bảng con nếu báo cáo có phần detail (VD: Danh sách hàng) |
| `foreign_key` | String (Optional) | Cột khóa ngoại ở bảng con trỏ về bảng chính |
| `child_name` | String | Tên biến dùng trong Template để lặp bảng con (Mặc định: `items`) |

---

## 3. Bảng `nhat_ky_in` (Lịch sử vận hành)
Ghi lại mọi hoạt động xuất báo cáo để hậu kiểm.

| Cột | Kiểu dữ liệu | Mô tả |
| :--- | :--- | :--- |
| `ma_id` | String | ID dòng dữ liệu được in |
| `ten_mau` | String | Tên mẫu báo cáo đã dùng |
| `ngay_tao` | DateTime | Thời điểm thực hiện lệnh in |
| `nguoi_thuc_hien` | Email | Email của người dùng Google đã ấn in |
| `trang_thai` | String | Kết quả (Thành công / Lỗi) |
| `link_file` | URL | Link xem lại file đã được xuất (nếu có) |

---

## 4. Bảng `anh_xa_bien` (Cấu hình nâng cao - Nếu có)
*Dùng để đổi tên biến hoặc format dữ liệu trước khi đưa vào template.*

| Cột | Kiểu dữ liệu | Mô tả |
| :--- | :--- | :--- |
| `ma_mau` | String | Liên kết tới mẫu biểu |
| `bien_mau` | String | Tên biến trong Word (VD: `tong_tien_chu`) |
| `cot_appsheet` | String | Tên cột hoặc công thức xử lý |
| `kieu_du_lieu` | Enum | Text, Number, Date, Currency... |
