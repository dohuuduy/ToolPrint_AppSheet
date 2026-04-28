## 📘 CẤU TRÚC CÁC BẢNG TRONG APPSHEET

Để hệ thống vận hành hoàn hảo, bạn cần cấu hình các bảng sau trong Google Sheet (và khai báo vào AppSheet):

### A. CÁC BẢNG QUẢN LÝ (Import vào App Admin)
Bạn tạo các bảng này trong file Google Sheet có ID là `GOOGLE_SHEET_ID`.

1. **Bảng `ung_dung` (Quản lý các App muốn in)**
   - `ma_id` (Key): ID tự động.
   - `ten_ung_dung`: Tên gợi nhớ (vd: Quản lý Nhân sự).
   - `app_id`: App ID của ứng dụng nghiệp vụ.
   - `khoa_api`: API Access Key của ứng dụng đó.
   - `trang_thai`: (Hoạt động / Tạm dừng).

2. **Bảng `mau_bieu` (Quản lý file Word mẫu)**
   - `ma_id` (Key): ID tự động.
   - `ma_ung_dung`: Liên kết tới bảng `ung_dung`.
   - `ten_mau`: Tên mẫu (vd: Hợp đồng thử việc).
   - `file_id_drive`: ID của file Word mẫu trên Drive.
   - `thu_muc_luu`: ID thư mục lưu file PDF sau khi in.

3. **Bảng `anh_xa_bien` (Mapping dữ liệu)**
   - `ma_id` (Key): ID tự động.
   - `ma_mau`: Liên kết tới bảng `mau_bieu`.
   - `ten_bien`: Tên biến trong file Word (vd: `<<HoTen>>`).
   - `ten_cot_du_lieu`: Tên cột trong AppSheet (vd: `[Full Name]`).

4. **Bảng `nhat_ky_in` (Lưu lịch sử)**
   - `ma_id` (Key): ID tự động.
   - `thoi_gian`: Thời gian in.
   - `nguoi_in`: Email người thực hiện.
   - `ma_mau`: Liên kết tới bảng `mau_bieu`.
   - `ma_dong`: ID của dòng dữ liệu được in.

### B. CẤU HÌNH ACTION TRÊN APPSHEET NGHIỆP VỤ
Tại App nghiệp vụ của bạn, tạo Action:
- **Do this**: `External: go to a website`
- **Target**:
```excel
CONCATENATE(
  "https://toolprintappsheet.vercel.app/report?id=", ENCODEURL([ma_id]),
  "&tableName=Ten_Bang_Cua_Ban",
  "&templateId=[ID_FILE_TREN_DRIVE]"
)