# HƯỚNG DẪN CẤU HÌNH BIỂU MẪU (WORD & EXCEL)

Tài liệu này hướng dẫn bạn cách thiết kế file mẫu Word và Excel để trộn dữ liệu từ AppSheet, sử dụng các tham số thực tế.

---

## 1. NGUYÊN TẮC CHUNG
- Các biến được đặt trong dấu ngoặc nhọn `{ }`.
- Tên biến phải khớp chính xác với **Tên Cột** trong AppSheet.
- Ví dụ: `{ten_nhan_vien}`, `{ngay_sinh}`, `{so_dien_thoai}`.

---

## 2. BIỂU MẪU WORD (.docx)

### A. Thông tin chung (Bảng chính)
Sử dụng các biến đơn lẻ:
- `Họ và tên: {ho_va_ten}`
- `Ngày đào tạo: {ngay_dao_tao}`

### B. Danh sách lặp (Bảng con - Master Detail)
Sử dụng cặp thẻ mở `{#}` và đóng `{/}`.
- **Cấu trúc:**
```text
{#items}
  - {ma_nhan_vien}: {ten_nhan_vien} - Kết quả: {ket_qua}
{/items}
```
*(Trong đó `items` là tên biến bạn đặt cho danh sách con)*

---

## 3. BIỂU MẪU EXCEL (.xlsx)

### A. Thông tin chung
Nhập trực tiếp vào ô: `Khóa học: {ten_khoa_hoc}`

### B. Hàng lặp tự động
Chỉ cần nhập tên biến theo cú pháp `{tên_biến_con.Tên_Cột}` vào một hàng. Excel sẽ tự động lặp lại hàng đó cho từng dòng dữ liệu con.
- **Ví dụ:** Ô A6 nhập `{items.stt}`, ô B6 nhập `{items.ten_nhan_vien}`.

---

## 4. VÍ DỤ THỰC TẾ (DAO_TAO & NHAN_VIEN)

Nếu bạn cấu hình:
- Tên biến con: `ds_nhan_vien`

| STT | Mã NV | Họ Tên | Ghi chú |
|-----|-------|--------|---------|
| {ds_nhan_vien.stt} | {ds_nhan_vien.ma_nv} | {ds_nhan_vien.ho_ten} | {ds_nhan_vien.ghi_chu} |

---

## 5. CÁC BIẾN HỆ THỐNG MẶC ĐỊNH
Bạn luôn có thể sử dụng các biến sau (tự động có sẵn không cần khai báo):

### Cho danh sách con (Bảng con):
- `{stt}` hoặc `{index}`: Số thứ tự dòng (1, 2, 3...). 
  *   Cách dùng trong Word: `{#ds_con}{stt} - {ten}{/ds_con}`
  *   Cách dùng trong Excel: `{ds_con.stt}`

### Cho toàn bộ văn bản (Ngày tháng):
- `{ngay_in}`: Ngày hiện tại (ví dụ: 27)
- `{thang_in}`: Tháng hiện tại (ví dụ: 04)
- `{nam_in}`: Năm hiện tại (ví dụ: 2024)
- `{ngay_thang_nam}`: Chuỗi hoàn chỉnh: "Ngày 27 tháng 04 năm 2024"
- `{ngay_hien_tai}`: Định dạng ngắn DD/MM/YYYY
