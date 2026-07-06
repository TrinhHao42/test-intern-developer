# Hướng Dẫn Khởi Chạy Ứng Dụng Todo List (Local Setup)

Tài liệu này hướng dẫn cách cài đặt và chạy thử dự án Todo List (bao gồm Spring Boot Backend và React Frontend) trên máy tính cá nhân (local).

---

## 🛠 Yêu Cầu Hệ Thống (Prerequisites)
Trước khi bắt đầu, hãy đảm bảo máy tính của bạn đã cài đặt các công cụ sau:
* **Java Development Kit (JDK)**: Phiên bản 17 trở lên.
* **Node.js**: Phiên bản 18 trở lên (kèm theo `npm`).
* **Docker & Docker Compose**: (Tùy chọn) Để khởi tạo nhanh cơ sở dữ liệu PostgreSQL. Nếu không dùng Docker, bạn cần tự cài đặt PostgreSQL trên máy.

---

## 💾 Bước 1: Khởi Tạo Cơ Sở Dữ Liệu (PostgreSQL)

### Cách A: Sử dụng Docker Compose (Khuyên dùng)
Nếu máy bạn có cài đặt Docker, bạn chỉ cần mở terminal tại thư mục gốc của dự án và chạy các lệnh sau:
```bash
cd todolist-backend/docker
docker compose up -d
```
*Lệnh này sẽ khởi tạo một container chứa PostgreSQL 17 chạy ở cổng `5432` với cấu hình cơ sở dữ liệu tên là `todolistDB`, tài khoản đăng nhập là `user` và mật khẩu là `sapassword`.*

### Cách B: Cài đặt trực tiếp trên hệ điều hành
Nếu cài đặt thủ công PostgreSQL trên máy, hãy tạo một database mới bằng công cụ quản trị (như pgAdmin) với thông số:
* **Database Name**: `todolistDB`
* **Port**: `5432`
* **Username**: `user`
* **Password**: `sapassword`
*(Nếu bạn sử dụng tài khoản khác, hãy chỉnh sửa lại thông tin tương ứng trong file `todolist-backend/src/main/resources/application.yaml`).*

---

## ☕ Bước 2: Chạy Spring Boot Backend

1. Di chuyển vào thư mục backend:
   ```bash
   cd todolist-backend
   ```
2. Chạy ứng dụng bằng Maven Wrapper:
   - **Trên Windows (cmd/powershell)**:
     ```powershell
     .\mvnw.cmd spring-boot:run
     ```
   - **Trên macOS / Linux**:
     ```bash
     chmod +x mvnw
     ./mvnw spring-boot:run
     ```
3. Ứng dụng Backend sẽ khởi chạy tại: `http://localhost:8080`
   - Bạn có thể xem tài liệu API (Swagger UI) tại: `http://localhost:8080/swagger-ui/index.html`

---

## ⚛ Bước 3: Chạy React Frontend

1. Mở một cửa sổ terminal mới và di chuyển vào thư mục frontend:
   ```bash
   cd todolist-frontend
   ```
2. Cài đặt các thư viện phụ thuộc (dependencies):
   ```bash
   npm install
   ```
3. Khởi chạy dev server của React:
   ```bash
   npm run dev
   ```
4. Giao diện Frontend sẽ khởi chạy tại: `http://localhost:5173`
   - Hãy truy cập liên kết trên bằng trình duyệt để sử dụng ứng dụng.

---

## 💡 Lưu Ý Quan Trọng Về Đồng Bộ & Tích Hợp
* **Bảo mật và CORS**: Backend được cấu hình cho phép các yêu cầu gửi kèm credentials (Session Cookie) từ domain local.
* **Cấu hình Proxy**: Dev server của Vite (cấu hình ở `vite.config.js`) tự động chuyển hướng (proxy) các request `/auth` và `/Todolist` đến `http://localhost:8080` để phòng tránh lỗi CORS và đồng bộ session cookie tự động. Bạn không cần đổi URL thủ công khi chạy local.
* **Validate dữ liệu**: Cả hai phía Frontend và Backend đều được đồng bộ chặt chẽ về các ràng buộc dữ liệu đầu vào (Ví dụ: kiểm tra tính bắt buộc của tiêu đề công việc, độ dài mật khẩu đăng ký từ 8 ký tự kèm ký tự đặc biệt, tên hiển thị, v.v.).
