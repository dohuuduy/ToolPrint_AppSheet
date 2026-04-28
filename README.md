# 🚀 AS PRINT HUB - GIẢI PHÁP IN ẤN CHUYÊN NGHIỆP CHO APPSHEET

Chào mừng bạn đến với **AS PRINT HUB**! Đây là ứng dụng web hoàn chỉnh, giúp bạn bứt phá giới hạn in ấn của AppSheet bằng cách trộn dữ liệu vào Word/Excel giữ nguyên định dạng, xuất PDF và quản lý lịch sử tập trung.

---

## 🛠 1. CHUẨN BỊ BAN ĐẦU (GOOGLE SIDE)

### Bước 1: Tạo Google Cloud Project
1. Truy cập [Google Cloud Console](https://console.cloud.google.com/).
2. Tạo mới một Project (ví dụ: `AppSheet-Print-System`).
3. **Enable APIs:** Tìm và Bật 2 API sau:
   - `Google Sheets API`
   - `Google Drive API`

### Bước 2: Cấu hình OAuth Consent Screen
1. Chọn **OAuth consent screen** > Chọn **External** > **Create**.
2. Điền thông tin cơ bản: Tên app, Email hỗ trợ.
3. **Scopes:** Thêm `.../auth/spreadsheets` và `.../auth/drive`.
4. **Publish App:** Bấm "PUBLISH APP" để chuyển sang trạng thái Production (để tránh hết hạn Token sau 7 ngày).

### Bước 3: Tạo OAuth Client ID
1. Vào **Credentials** > **Create Credentials** > **OAuth client ID**.
2. Loại ứng dụng: **Web application**.
3. **Authorized Redirect URIs:**
   - Local: `http://localhost:3000/auth/callback`
   - Vercel: `https://ten-app-cua-ban.vercel.app/auth/callback`
4. Lưu lại **Client ID** và **Client Secret**.

---

## 📊 2. THIẾT LẬP DỮ LIỆU (GOOGLE SHEET)

Hãy tạo một file Google Sheet mới và lấy **Sheet ID** từ URL. Tạo 4 Sheet (Tab) với các tiêu đề cột sau (Dòng 1):

1. **ung_dung**: `ma_id`, `ten_ung_dung`, `app_id`, `khoa_api`, `folder_mau_id`, `folder_xuat_id`, `trang_thai`
2. **mau_bieu**: `ma_id`, `ten_mau`, `ma_mau`, `file_id_drive`, `loai_file`, `ma_ung_dung`, `bang_chinh`, `key_col`, `child_table`, `foreign_key`, `child_name`, `trang_thai`
3. **nhat_ky_in**: `ngay_tao`, `ma_id`, `nguoi_dung`, `ten_mau`, `trang_thai`, `file_id_drive`
4. **cau_hinh**: `khoa`, `gia_tri`

---

## 📤 3. HƯỚNG DẪN DEPLOY LÊN VERCEL

### PHẦN A: Đưa code lên GitHub
1. Tạo một repository mới trên GitHub.
2. Tại Visual Studio Code / Terminal, chạy lệnh:
   ```bash
   git init
   git add .
   git commit -m "🚀 Khởi tạo hệ thống Print Hub"
   git branch -M main
   git remote add origin https://github.com/USER/RENAME_REPO.git
   git push -u origin main
   ```

### PHẦN B: Deploy lên Vercel
1. Truy cập [Vercel](https://vercel.com/) và Đăng nhập bằng GitHub.
2. Chọn **Add New Project** > **Import** repo vừa tạo.
3. **Environment Variables:** Thêm đầy đủ các biến đã chuẩn bị vào Vercel (Xem `.env.example`).
   - `APP_URL`: Link Vercel của bạn (Vd: `https://my-app.vercel.app`)
4. Bấm **Deploy**.

---

## 🔗 4. KẾT NỐI VỚI APPSHEET

### Lấy thông tin AppSheet
1. **App ID:** Lấy từ URL của AppSheet Editor (sau đoạn `?appId=`).
2. **API Key:** Vào `Manage` > `Integrations` > `In` > `Enable API` > Đảm bảo có API Key.

### Tạo Action In trong AppSheet
1. Tạo một Action mới: **Go to a website**.
2. **Target:** Sử dụng công thức do Hub sinh ra tại trang "Mẫu biểu". Ví dụ:
   ```appsheet
   CONCATENATE("https://ten-app.vercel.app/report?template=HOA_DON&id=", ENCODEURL([ma_id]))
   ```

---

## ⚠️ 5. CHECKLIST LỖI THƯỜNG GẶP

1. **Error 400: redirect_uri_mismatch**: Kiểm tra xem URL trong Google Cloud Console đã khớp chính xác với URL thực tế chưa (có hay không có `/` ở cuối).
2. **404 Not Found (Template)**: Đảm bảo bạn đã SHARE quyền chỉnh sửa file mẫu Drive cho email đang sử dụng.
3. **AppSheet Unauthorized**: Kiểm tra lại API Key và đảm bảo đã bật "Enable API" trong AppSheet.
4. **Vercel Build Failed**: Thường do thiếu biến môi trường hoặc sai phiên bản Node.js.

---

## 👨‍💻 CHẠY LOCAL
```bash
npm install
npm run dev
```

**Chúc bạn thành công!** Nếu có thắc mắc, vui lòng kiểm tra tài liệu `HUONG_DAN_TEMPLATES.md` trong hệ thống.
