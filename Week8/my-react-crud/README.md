# Ứng dụng Quản lý Người dùng - React CRUD

Ứng dụng quản lý người dùng đơn giản được xây dựng bằng React + Vite, thực hiện đầy đủ các chức năng CRUD (Create, Read, Update, Delete).

## Minh chứng evidence video
Link video: https://drive.google.com/file/d/1segz7BRilChPbeZXsZG9SCjiD7eACRWV/view?usp=sharing

## Tính năng

- ✅ **Tìm kiếm**: Tìm kiếm người dùng theo tên hoặc username
- ✅ **Thêm**: Thêm người dùng mới với đầy đủ thông tin
- ✅ **Sửa**: Chỉnh sửa thông tin người dùng
- ✅ **Xóa**: Xóa người dùng khỏi danh sách
- ✅ **Hiển thị**: Danh sách người dùng dạng bảng

## Cấu trúc Components

```
App (Component gốc)
├── SearchForm (Tìm kiếm)
├── AddUser (Thêm người dùng)
└── ResultTable (Hiển thị, Sửa, Xóa)
```

## Cài đặt và Chạy

### Bước 1: Cài đặt dependencies

```bash
npm install
```

### Bước 2: Chạy development server

```bash
npm run dev
```

Ứng dụng sẽ chạy tại: `http://localhost:5173`

### Bước 3: Build cho production

```bash
npm run build
```

## Công nghệ sử dụng

- **React 18**: Thư viện UI
- **Vite**: Build tool
- **JSONPlaceholder API**: API giả lập dữ liệu người dùng

## Cách sử dụng

1. **Tìm kiếm**: Nhập tên hoặc username vào ô tìm kiếm
2. **Thêm người dùng**: Click "Thêm người dùng", điền form và click "Lưu"
3. **Sửa người dùng**: Click "Sửa" ở hàng cần sửa, chỉnh sửa và click "Lưu"
4. **Xóa người dùng**: Click "Xóa" ở hàng cần xóa

## Kiến thức áp dụng

- State Management (useState)
- Side Effects (useEffect)
- Component Communication (Props)
- State Lifting
- Nested State Handling
- Array Methods (map, filter)
- Deep Copy Objects
- API Fetching
- Modal Forms

