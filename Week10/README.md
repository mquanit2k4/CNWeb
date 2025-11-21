# User Management CRUD Application

Ứng dụng web quản lý người dùng với đầy đủ chức năng CRUD (Create, Read, Update, Delete).

## Tính năng

✅ **Read**: Hiển thị bảng danh sách người dùng với thông tin tên, email, số điện thoại  
✅ **Create**: Form thêm người dùng mới  
✅ **Update/Edit**: Form chỉnh sửa thông tin người dùng (popup modal)  
✅ **Delete**: Xóa người dùng khỏi danh sách  
✅ **Search**: Tìm kiếm người dùng theo tên  
✅ **Pagination**: Phân trang (5 người dùng/trang)  

## Đặc điểm kỹ thuật

- Sử dụng **Fetch API** với **async/await** (không dùng .then())
- Kết nối với API: `https://jsonplaceholder.typicode.com/users`
- Cập nhật UI thủ công sau mỗi thao tác POST/PUT/DELETE
- Xử lý lỗi đầy đủ với thông báo người dùng
- Responsive design
- Loading spinner
- Toast notifications

## Cách sử dụng

1. Mở file `index.html` trong trình duyệt web
2. Ứng dụng sẽ tự động tải danh sách người dùng từ API

### Chức năng

- **Tìm kiếm**: Nhập tên vào ô tìm kiếm và nhấn "Tìm kiếm" hoặc Enter
- **Thêm người dùng**: Nhấn nút "+ Thêm người dùng mới"
- **Chỉnh sửa**: Nhấn nút "Sửa" trên hàng người dùng
- **Xóa**: Nhấn nút "Xóa" và xác nhận
- **Phân trang**: Sử dụng các nút số trang ở cuối bảng

## Cấu trúc dự án

```
Week10/
├── index.html      # Cấu trúc HTML chính
├── style.css       # Styling và responsive
├── app.js          # Logic CRUD với Fetch API
├── users.json      # Dữ liệu JSON mẫu
└── README.md       # Tài liệu hướng dẫn
```

## Công nghệ sử dụng

- HTML5
- CSS3 (Flexbox, Grid, Animations)
- JavaScript (ES6+)
- Fetch API
- Async/Await

## Ghi chú

- API JSONPlaceholder chỉ mô phỏng các thao tác, không lưu trữ thực tế
- UI được cập nhật thủ công sau mỗi thao tác để phản ánh thay đổi
- Tất cả các request đều được xử lý lỗi với thông báo rõ ràng
