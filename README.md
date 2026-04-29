# 🚀 PrintHub: Hệ thống In báo cáo AppSheet Chuyên nghiệp

**PrintHub** là giải pháp Admin Dashboard hiện đại, giúp kết nối AppSheet với Google Drive để xuất báo cáo Word/Excel tùy chỉnh với độ chính xác tuyệt đối về định dạng.

---

## 1. HƯỚNG DẪN GITHUB (Cho người mới)

### Bước A: Tạo Repository
1. Truy cập [github.com](https://github.com) và đăng nhập.
2. Nhấn nút **"New"** để tạo Repo mới.
3. Tên Repo: `appsheet-print-hub`.
4. Chọn **Public** hoặc **Private** tùy nhu cầu.
5. Nhấn **"Create repository"**.

### Bước B: Đưa code lên GitHub (Dùng terminal tại AI Studio)
```bash
git init
git add .
git commit -m "Initial refactored modern dashboard"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/appsheet-print-hub.git
git push -u origin main
```
*(Thay YOUR_USERNAME bằng tên người dùng thật của bạn)*

---

## 2. HƯỚNG DẪN GOOGLE OAUTH SIÊU CHI TIẾT

Ứng dụng cần quyền truy cập Google Drive và Google Sheets của bạn.

### Bước 1: Tạo Project
1. Truy cập [Google Cloud Console](https://console.cloud.google.com/).
2. Nhấn **Select a project > New Project** và đặt tên là `PrintHub`.

### Bước 2: Kích hoạt API
Vào mục **Library**, tìm và Enable 2 API này:
*   **Google Drive API**
*   **Google Sheets API**

### Bước 3: Màn hình đồng thuận (OAuth Consent Screen)
1. Chọn **External**.
2. Điền App Name, User Support Email, Developer Info.
3. **Scopes:** Thêm `.../auth/drive.file` và `.../auth/spreadsheets`.

### Bước 4: Tạo Client ID
1. Vào **Credentials > Create Credentials > OAuth Client ID**.
2. Application type: **Web Application**.
3. **Authorized Redirect URIs:**
   *   Local: `http://localhost:3000/api/auth/callback/google`
   *   Vercel: `https://ten-app-cua-ban.vercel.app/api/auth/callback/google`
4. Coppy **Client ID** và **Client Secret** vào file `.env`.

---

## 3. HƯỚNG DẪN TRIỂN KHAI TRÊN VERCEL

1. Truy cập [Vercel](https://vercel.com) và đăng nhập bằng GitHub.
2. Nhấn **"Add New" > "Project"**.
3. Import Repo `appsheet-print-hub` vừa tạo.
4. Tại mục **Environment Variables**, điền đầy đủ các biến sau:

| Biến | Giá trị ví dụ |
| :--- | :--- |
| `NEXTAUTH_URL` | `https://ten-app.vercel.app` |
| `NEXTAUTH_SECRET` | `Tu_sinh_mot_chuoi_bat_ky` |
| `GOOGLE_CLIENT_ID` | `Lay_tu_buoc_o_tren` |
| `GOOGLE_CLIENT_SECRET` | `Lay_tu_buoc_o_tren` |
| `GOOGLE_SHEET_ID` | `ID_tu_URL_file_Google_Sheet_DB` |

5. Nhấn **Deploy** và đợi 2 phút.

---

## 4. QUY TRÌNH VẬN HÀNH THỰC TẾ

1.  **Khởi tạo:** Sau khi deploy thành công, vào trang **Cài đặt hệ thống** và nhấn **"Kích hoạt Cấu trúc Sheets"**.
2.  **Kết nối App:** Sang menu **Kết nối AppSheet**, thêm App mới với App ID và API Key lấy từ AppSheet Editor.
3.  **Tạo mẫu:** Sang menu **Mẫu báo cáo**, tải file Word mẫu lên Google Drive, lấy ID file và khai báo.
4.  **Action:** Trên AppSheet, tạo Action mở URL trỏ về `/report?id=[ID]&template=TOKEN_MAU`.
5.  **In ấn:** Bấm nút trên AppSheet -> Website hiện màn hình Processing -> File báo cáo tự động hiện ra.

---

## 5. CẤU TRÚC DỮ LIỆU & LOGIC
*   Chi tiết kỹ thuật: [schema.md](./schema.md)
*   Logic xử lý: Sử dụng App Router của Next.js kết hợp Server Actions để đảm bảo bảo mật API Key.

---

## 6. CHECKLIST LỖI THƯỜNG GẶP (Troubleshooting)

*   **`redirect_uri_mismatch`**: Do URI trong Google Cloud không khớp với Domain trên Vercel. Hãy kiểm tra lại Bước 4 mục OAuth.
*   **`403 Forbidden`**: Email của bạn chưa có quyền truy cập vào File Template. Hãy Share quyền "Editor" cho email service-account hoặc đảm bảo email login app là email sở hữu file.
*   **AppSheet Unauthorized**: API Key hoặc App ID bị sai. Lấy lại tại `Manage > Integrations > API Access`.
*   **Vercel Build Failed**: Thường do thiếu biến môi trường hoặc sai cú pháp `package.json`. Hãy kiểm tra Logs tại Vercel.

---
*Phát triển bởi Đội ngũ Kiến trúc sư Fullstack - 2024*
