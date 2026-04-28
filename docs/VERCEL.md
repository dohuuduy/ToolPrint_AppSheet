# HƯỚNG DẪN VERCEL CHI TIẾT

## PHẦN A: Tạo tài khoản & Kết nối
1. Truy cập [vercel.com](https://vercel.com).
2. Chọn **Sign Up** và đăng nhập bằng tài khoản **GitHub**.

## PHẦN B: Import dự án
1. Chọn **Add New...** -> **Project**.
2. Tìm repository `appsheet-print` và nhấn **Import**.

## PHẦN C: Cấu hình Dự án
- **Framework Preset:** Next.js (Mặc định sẽ tự nhận).
- **Root Directory:** `./`

## PHẦN D: Cấu hình Biến môi trường (Environment Variables)
Đây là bước QUAN TRỌNG NHẤT. Nhấn vào phần **Environment Variables** và thêm lần lượt các biến sau (lấy từ file `.env.example`):

1. `NEXTAUTH_URL`: Link ứng dụng của bạn (ví dụ: `https://appsheet-print.vercel.app`).
2. `NEXTAUTH_SECRET`: Một chuỗi ký tự bất kỳ.
3. `GOOGLE_CLIENT_ID`: ID từ Google Cloud Console.
4. `GOOGLE_CLIENT_SECRET`: Secret từ Google Cloud Console.
5. `GOOGLE_SHEET_ID`: ID của file Google Sheet cấu hình.
6. `GOOGLE_DRIVE_FOLDER_TEMPLATE`: ID thư mục chứa mẫu.
7. `GOOGLE_DRIVE_FOLDER_OUTPUT`: ID thư mục lưu kết quả.
8. `APPSHEET_APP_ID`: ID ứng dụng AppSheet.
9. `APPSHEET_API_KEY`: API Key AppSheet.

## PHẦN E: Triển khai (Deploy)
1. Nhấn nút **Deploy**.
2. Đợi khoảng 1-2 phút để Vercel build ứng dụng.
3. Sau khi thành công, bạn sẽ nhận được link ứng dụng chính thức.
