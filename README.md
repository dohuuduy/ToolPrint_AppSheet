# AppSheet Print & Report Pro - Hướng dẫn chi tiết từ A-Z

Chào mừng bạn đến với giải pháp in ấn và báo cáo chuyên nghiệp cho AppSheet. Tài liệu này được thiết kế để giúp bạn triển khai hệ thống từ con số 0.

---

## 1. MỤC TIÊU HỆ THỐNG
Hệ thống cho phép bạn:
1. Từ AppSheet bấm nút mở link báo cáo.
2. Tự động lấy dữ liệu từ AppSheet API.
3. Trộn dữ liệu vào file mẫu Word (.docx) hoặc Excel (.xlsx) trên Google Drive.
4. Xem trực tiếp và in ra máy in hoặc lưu PDF.
5. Ghi nhật ký lịch sử in ấn vào Google Sheets.

---

## 2. HƯỚNG DẪN GITHUB (Lưu trữ mã nguồn)

### PHẦN A: Tạo GitHub Repo
1. Đăng nhập vào [github.com](https://github.com).
2. Nhấn nút **New** (Màu xanh) để tạo Repository mới.
3. Tên Repository: `appsheet-print`.
4. Chọn **Public** hoặc **Private** tùy nhu cầu của bạn.
5. Nhấn **Create repository**.

### PHẦN B: Đưa mã nguồn lên GitHub
Mở terminal/command prompt tại thư mục dự án và chạy các lệnh:
```bash
git init
git add .
git commit -m "Khởi tạo mã nguồn hệ thống in"
git branch -M main
git remote add origin https://github.com/TÊN_USER_CỦA_BẠN/appsheet-print.git
git push -u origin main
```

---

## 3. HƯỚNG DẪN GOOGLE CLOUD (Lấy Client ID & API)

### Bước 1: Tạo dự án
1. Vào [Google Cloud Console](https://console.cloud.google.com/).
2. Chọn **Select a project** > **New Project**.
3. Đặt tên dự án và nhấn **Create**.

### Bước 2: Bật API
Vào mục **Enabled APIs & Services**, lần lượt tìm và nhấn **Enable** cho 2 API:
* Google Drive API
* Google Sheets API

### Bước 3: Cấu hình OAuth Consent Screen
1. Vào mục **OAuth consent screen**.
2. Chọn **External** > **Create**.
3. Nhập App Name, User support email và Developer contact info.
4. Lưu và tiếp tục đến hết.

### Bước 4: Tạo Client ID
1. Vào mục **Credentials** > **Create Credentials** > **OAuth client ID**.
2. Loại ứng dụng: **Web application**.
3. **Authorized redirect URIs**:
   - Local: `http://localhost:3000/api/auth/callback/google`
   - Vercel: `https://ten-app-cua-ban.vercel.app/api/auth/callback/google`
4. Lưu lại và copy: **Client ID** và **Client Secret**.

---

## 4. HƯỚNG DẪN VERCEL (Deploy ứng dụng)

1. Truy cập [vercel.com](https://vercel.com) và đăng nhập bằng GitHub.
2. Chọn **Add New** > **Project**.
3. Tìm repo `appsheet-print` và nhấn **Import**.
4. Tại mục **Environment Variables**, thêm đầy đủ các biến từ file `.env.example`:
   - `NEXTAUTH_URL`: Link ứng dụng Vercel của bạn.
   - `NEXTAUTH_SECRET`: Một chuỗi ngẫu nhiên bất kỳ.
   - `GOOGLE_CLIENT_ID`: (Vừa lấy ở bước 3).
   - `GOOGLE_CLIENT_SECRET`: (Vừa lấy ở bước 3).
   - `GOOGLE_SHEET_ID`: ID của file Google Sheet quản lý.
   - Các ID Folder Drive...
5. Nhấn **Deploy**.

---

## 5. HƯỚNG DẪN APPSHEET ACTION

Tạo một Action trong AppSheet (loại: *External: go to a website*):
**Target URL:**
```excel
CONCATENATE(
  "https://ten-app-cua-ban.vercel.app/report?id=",
  ENCODEURL([ma_id]),
  "&template=MÃ_MẪU_BIỂU"
)
```

---

## 6. CÁCH LẤY FILE/FOLDER ID
* **ID File Google Docs:** Nhìn trên URL file mẫu: `https://docs.google.com/document/d/1A2B3C.../edit` -> ID là `1A2B3C...`.
* **ID Google Sheet:** Nhìn trên URL file Sheet: `https://docs.google.com/spreadsheets/d/XXXXXXXXX/edit` -> ID là `XXXXXXXXX`.

---

## 7. CHECKLIST LỖI THƯỜNG GẶP
* **redirect_uri_mismatch**: Kiểm tra xem URI trên Google Cloud đã khớp 100% với URL trên Vercel chưa (phải có `/api/auth/callback/google`).
* **403 Forbidden / Unauthorized**: Kiểm tra xem file Sheet/Folder Drive đã được SHARE quyền "Người chỉnh sửa" (Editor) cho email của bạn chưa.
* **AppSheet API Error**: Kiểm tra App ID và API Key trong phần Manage > Integrations > API Access.

---

Chúc bạn triển khai thành công!
