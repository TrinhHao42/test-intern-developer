# Hướng Dẫn Chạy Dự Án Todo List (Local Setup)

Dự án gồm hai phần: **Spring Boot Backend** và **React Frontend**. Dưới đây là hướng dẫn cài đặt và khởi chạy nhanh chóng trên máy local.

---

## ☕ 1. Khởi chạy Backend (Sử dụng IntelliJ IDEA)

### Yêu cầu
* **JDK**: Phiên bản 21 trở lên.
* **Database**: Dự án đang kết nối trực tiếp đến PostgreSQL database online (Render). Bạn không cần cài đặt database local khi chạy thử.

### Các bước chạy trên IntelliJ IDEA:
1. Mở IntelliJ IDEA, chọn **Open** và dẫn tới thư mục `todolist-backend`.
2. Đợi IntelliJ tự động nhận diện và tải các dependency từ file `pom.xml` (Maven).
3. Mở file [TodolistBackendApplication.java](file:///e:/Project/test-intern-developer/todolist-backend/src/main/java/iuh/fit/se/todolistbackend/TodolistBackendApplication.java) (trong thư mục `src/main/java/iuh/fit/se/todolistbackend/`).
4. Click chuột phải vào file hoặc click vào biểu tượng nút **Run (Play màu xanh)** ở góc trên để khởi chạy dự án.
5. Backend sẽ chạy ở cổng `8080`.
   - Xem tài liệu API (Swagger UI): [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)

---

## ⚛ 2. Khởi chạy Frontend (Chạy bình thường)

### Yêu cầu
* **Node.js**: Phiên bản 18 trở lên.

### Các bước khởi chạy:
1. Mở Terminal tại thư mục `todolist-frontend`.
2. Cài đặt các thư viện phụ thuộc:
   ```bash
   npm install
   ```
3. Khởi chạy dự án ở chế độ phát triển (development):
   ```bash
   npm run dev
   ```
4. Truy cập giao diện tại: [http://localhost:5173](http://localhost:5173)

---

## 💡 Cấu hình hệ thống & Timezone
* **Timezone**: Hệ thống đã được cấu hình mặc định múi giờ **`Asia/Ho_Chi_Minh`** trực tiếp tại class khởi chạy của Backend và định dạng JSON của Jackson.
* **Cấu hình tích hợp**: Dự án sử dụng Vite proxy, các request từ frontend đến `/auth/*` và `/Todolist/*` sẽ tự động chuyển tiếp về Backend ở `localhost:8080` cùng với thông tin Session Cookie.
