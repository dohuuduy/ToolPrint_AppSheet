# PrintHub: Hệ thống In ấn & Báo cáo Tự động cho AppSheet

**PrintHub** là giải pháp trung gian mạnh mẽ giúp người dùng AppSheet vượt qua các giới hạn in ấn mặc định, cho phép tạo ra các báo cáo Word/Excel chuyên nghiệp từ dữ liệu AppSheet chỉ với một lần nhấn nút.

---

## 1. Luồng quy trình xử lý (Process Flow)

Quy trình hoạt động của ứng dụng diễn ra theo 7 bước tự động hóa hoàn toàn:

1.  **Kích hoạt (Trigger):** Người dùng nhấn nút (Action) trên AppSheet. Action này mở một liên kết URL được định dạng sẵn (VD: `.../report?template=HD01&id=123`).
2.  **Tiếp nhận & Xác thực:** Ứng dụng Next.js nhận yêu cầu, kiểm tra đăng nhập Google OAuth của người dùng và xác định mẫu báo cáo (`template`) cùng mã dữ liệu (`id`) cần in.
3.  **Truy xuất cấu hình:** Hệ thống tra cứu bảng `mau_bieu` để lấy ID file mẫu Drive, và bảng `ung_dung` để lấy API Key của AppSheet tương ứng.
4.  **Lấy dữ liệu AppSheet:** Ứng dụng gọi **AppSheet REST API** để lấy nội dung chi tiết của dòng (`id`) đó. Nếu mẫu có bảng con, hệ thống sẽ tự động truy vấn thêm các dòng liên quan.
5.  **Tải Template:** Hệ thống sử dụng **Google Drive API** để tải file Word (.docx) hoặc Excel (.xlsx) mẫu về bộ nhớ đệm.
6.  **Trộn dữ liệu (Mail Merge):** Toàn bộ dữ liệu từ AppSheet được ánh xạ vào các biến trong file mẫu (VD: `{ten_khach_hang}`). Giữ nguyên hoàn toàn định dạng, font chữ, bảng biểu của file gốc.
7.  **Hiển thị & Ghi log:**
    *   **Người dùng:** Thấy màn hình Preview, có thể tải về PDF, Docx hoặc in trực tiếp.
    *   **Hệ thống:** Tự động ghi lại một dòng vào bảng `nhat_ky_in` trên Google Sheet để theo dõi.

---

## 2. Cấu trúc dữ liệu (Data Schema)

Xem chi tiết tại: [schema.md](./schema.md)

---

## 3. Hướng dẫn thiết lập AppSheet Action

Để gọi ứng dụng từ AppSheet, bạn tạo một Action loại **"External: go to a website"** với công thức:

```appsheet
CONCATENATE(
  "https://ten-app-cua-ban.vercel.app/report?id=", 
  ENCODEURL([ma_id_cua_dong]), 
  "&template=", 
  "MA_MAU_TRONG_HETHONG"
)
```

---

## 4. Biến môi trường (.env) cần thiết

Ứng dụng yêu cầu các biến sau để hoạt động:

```env
# NextAuth & Security
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your_secret_string

# Google OAuth (Credential từ Google Cloud Console)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# Google Sheets Database (ID của file Spreadsheet lưu cấu hình)
GOOGLE_SHEET_ID=...

# AppSheet API Default (Dùng nếu không cấu hình trong bảng ung_dung)
APPSHEET_APP_ID=...
APPSHEET_API_KEY=...
```

---

## 5. Các công nghệ sử dụng

*   **Framework:** Next.js 14+ (App Router)
*   **Dữ liệu:** Google Sheets API, AppSheet REST API
*   **Lưu trữ:** Google Drive API
*   **Xử lý tệp:** docxtemplater / exceljs
*   **Giao diện:** Tailwind CSS, Lucide Icons, Framer Motion
*   **Xác thực:** NextAuth.js (Google Provider)

---

## 6. Checklist kiểm tra lỗi

*   **Lỗi 403 / Unauthorized:** Kiểm tra lại API Key trong bảng `ung_dung` và đảm bảo quyền truy cập file mẫu trên Drive cho email đang chạy app.
*   **Biến không hiển thị:** Đảm bảo tên biến trong file Word `{ten_bien}` trùng khớp hoàn toàn với tên cột trong AppSheet.
*   **Lỗi Vercel Build:** Kiểm tra lại việc cấu hình các biến môi trường trong Vercel Dashboard.

---
*Tài liệu được cập nhật bởi kiến trúc sư hệ thống PrintHub.*
