# AppsSheet Print & Report Pro

Hướng dẫn triển khai và sử dụng hệ thống in ấn báo cáo cho AppSheet.

## 1. Cấu hình ban đầu
- Sao chép `.env.example` thành `.env.local`.
- Lấy thông tin Google Client ID và Secret từ Google Cloud Console.
- Lấy thông tin App ID và API Key từ AppSheet.

## 2. Cấu hình Google Sheets
Tạo một Google Sheet với các sheet sau:
- `ung_dung`: Cấu hình các ứng dụng AppSheet.
- `mau_bieu`: Danh sách các mẫu Word/Excel.
- `anh_xa_bien`: Quy tắc mapping dữ liệu giữa AppSheet và Template.
- `nhat_ky_in`: Lưu lịch sử in ấn.

## 3. Tạo Action trong AppSheet
Sử dụng công thức sau để mở báo cáo:
```
CONCATENATE(
  "https://YOUR_APP_URL/report?id=",
  ENCODEURL([ma_id]),
  "&template=",
  [ten_mau]
)
```

## 4. Chạy ứng dụng
```bash
npm install
npm run dev
```
