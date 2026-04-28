# HƯỚNG DẪN GITHUB CHI TIẾT

## PHẦN A: Tạo GitHub Repository
1. Truy cập [github.com](https://github.com) và đăng nhập.
2. Nhấn nút **New** (màu xanh) ở góc trái hoặc dấu **+** ở góc phải chọn **New repository**.
3. Nhập tên Repository: `appsheet-print`.
4. Chọn **Public** hoặc **Private** tùy nhu cầu.
5. Nhấn **Create repository**.

## PHẦN B: Đưa mã nguồn lên GitHub
Mở terminal tại thư mục dự án và chạy các lệnh sau:

```bash
# Khởi tạo git
git init

# Thêm tất cả file
git add .

# Commit lần đầu
git commit -m "Khởi tạo dự án AppSheet Print & Report"

# Đổi tên nhánh chính thành main
git branch -M main

# Kết nối với repo trên GitHub (Thay USER bằng username của bạn)
git remote add origin https://github.com/USER/appsheet-print.git

# Đẩy code lên
git push -u origin main
```

## PHẦN C: Cấu hình .gitignore
File `.gitignore` đã có sẵn trong source code để đảm bảo không đẩy các file nhạy cảm lên:
- `node_modules`: Các thư viện cài đặt.
- `.env.local`: Các biến môi trường chứa API Key bí mật.
- `.next`: Các file build của Next.js.
