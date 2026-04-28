# HƯỚNG DẪN APPSHEET API

## 1. Lấy App ID
- Mở ứng dụng của bạn trong trình duyệt (AppSheet Editor).
- App ID là đoạn mã nằm phía sau `?appId=` trong URL.
- Ví dụ: `a6485086-63e8-4223-9366-673e84223936`.

## 2. Lấy API Access Key
- Trong AppSheet Editor, vào **Manage** -> **Integrations** -> **IN**.
- Bật **Enable** nếu chưa bật.
- Nhấn **App Password** (hoặc Application Access Key) để xem và copy mã.

## 3. Cấu hình bảng AppSheet
- Đảm bảo bảng dữ liệu của bạn có cột định danh duy nhất (ví dụ: `ma_id`).
- Hệ thống này sẽ dùng `ma_id` để tìm kiếm dữ liệu.

## 4. Công thức Action trong AppSheet
Tạo một Action loại **"Go to a website"** với Target:
```
CONCATENATE(
  "https://ten-app-cua-ban.vercel.app/report?id=",
  ENCODEURL([ma_id]),
  "&template=MAU_01"
)
```
- `id`: Là ID của dòng hiện tại.
- `template`: Là mã mẫu (mapping trong Google Sheet).
