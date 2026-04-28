# CHECKLIST LỖI THƯỜNG GẶP

### 1. Lỗi `redirect_uri_mismatch`
- **Nguyên nhân:** URL redirect trong Google Cloud Console không khớp với URL ứng dụng.
- **Cách sửa:** Kiểm tra lại mục **Authorized redirect URIs** trên Google Cloud, đảm bảo có cả bản Localhost và bản Vercel theo đúng định dạng `/api/auth/callback/google`.

### 2. Thiếu biến môi trường (Environment Variables)
- **Nguyên nhân:** Quên cấu hình trên Vercel.
- **Cách sửa:** Vào Vercel -> Settings -> Environment Variables. Sau khi thêm biến, phải **Redeploy** lại mới có tác dụng.

### 3. Lỗi AppSheet Unauthorized
- **Nguyên nhân:** Application Token (API Key) sai hoặc chưa bật API trong AppSheet.
- **Cách sửa:** Vào AppSheet Manage -> Integrations -> IN, kiểm tra xem "Enable" đã được gạt sang xanh chưa.

### 4. Vercel Build Failed
- **Nguyên nhân:** Thường do lỗi code TypeScript hoặc sai phiên bản Node.js.
- **Cách sửa:** Chạy `npm run build` ở local trước khi đẩy lên GitHub để kiểm tra lỗi.

### 5. Không tải được Template từ Google Drive
- **Nguyên nhân:** Folder ID hoặc File ID sai, hoặc tài khoản đăng nhập không có quyền xem.
- **Cách sửa:** Kiểm tra quyền chia sẻ của folder trên Drive (ít nhất là "Viewer" cho tài khoản đang dùng).
