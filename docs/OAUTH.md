# HƯỚNG DẪN GOOGLE OAUTH SIÊU CHI TIẾT

## Bước 1: Truy cập Google Cloud Console
- Vào [console.cloud.google.com](https://console.cloud.google.com).
- Tạo một Project mới (ví dụ: `AppSheet Printing Service`).

## Bước 2: Bật các thư viện API (Enable APIs)
Tìm và nhấn **Enable** cho các API sau:
1. **Google Drive API**
2. **Google Sheets API**

## Bước 3: Cấu hình Màn hình Consent (OAuth Consent Screen)
1. Chọn **OAuth consent screen** ở menu trái.
2. Chọn **User Type:** External (cho phép các tài khoản cá nhân).
3. Điền thông tin cơ bản: Tên app, Email hỗ trợ, Developer contact.
4. **Scopes:** Thêm các scope:
   - `.../auth/drive.readonly`: Để tải file template.
   - `.../auth/spreadsheets`: Để ghi log và đọc cấu hình.

## Bước 4: Tạo Credentials
1. Chọn **Credentials** -> **Create Credentials** -> **OAuth client ID**.
2. **Application type:** Web application.
3. **Name:** `AppSheet Print Web`.
4. **Authorized JavaScript origins:**
   - `http://localhost:3000`
   - `https://your-app.vercel.app`
5. **Authorized redirect URIs:**
   - `http://localhost:3000/api/auth/callback/google`
   - `https://your-app.vercel.app/api/auth/callback/google`

## Bước 5: Lấy thông tin
- Sau khi nhấn Create, bạn sẽ nhận được **Client ID** và **Client Secret**.
- Hãy copy và dán vào file `.env.local` của bạn.
