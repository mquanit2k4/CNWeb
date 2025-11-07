import { useState, useEffect } from 'react';

// BƯỚC 4: HIỂN THỊ DANH SÁCH (RESULTTABLE)
// Mục tiêu: Tải dữ liệu từ API, lưu trong state, và render ra bảng
// + BƯỚC 6: SỬA NGƯỜI DÙNG (EDIT)
// + BƯỚC 7: XÓA NGƯỜI DÙNG (DELETE)
function ResultTable({ keyword, user, onAdded }) {
  // State lưu trữ danh sách người dùng
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  // BƯỚC 4: Tải dữ liệu
  // Dùng useEffect với dependency array [] để gọi API một lần khi component được mount
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      });
  }, []);

  // BƯỚC 5: Cập nhật danh sách
  // Dùng useEffect([user]) để lắng nghe người dùng mới và thêm vào danh sách users
  useEffect(() => {
    if (user) {
      // Tìm ID lớn nhất hiện có để tạo ID mới (tự động tăng)
      const maxId = users.length > 0 ? Math.max(...users.map(u => u.id)) : 0;
      // Tạo user mới với address object để tương thích với API data
      const newUser = {
        ...user,
        id: maxId + 1,
        address: { city: user.city || "" }
      };
      setUsers((prev) => [...prev, newUser]);
      onAdded();
    }
  }, [user]);

  // BƯỚC 4: Lọc dữ liệu
  // Dùng Array.filter() để lọc danh sách users theo keyword nhận được từ props
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(keyword.toLowerCase()) ||
      u.username.toLowerCase().includes(keyword.toLowerCase())
  );

  // BƯỚC 6: SỬA NGƯỜI DÙNG
  // Kích hoạt form Sửa: Khi nhấn Sửa, lưu dữ liệu người dùng đó vào state editing
  // Kỹ thuật quan trọng: Sao chép dữ liệu để tránh tham chiếu
  function editUser(user) {
    setEditing({ 
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      city: user.address?.city || ""
    });
  }

  // Xử lý thay đổi khi sửa
  function handleEditChange(field, value) {
    setEditing({ ...editing, [field]: value });
  }

  // Lưu Dữ liệu: Dùng Array.map() để tìm id tương ứng và thay thế
  function saveUser() {
    if (editing.name === "" || editing.username === "") {
      alert("Vui lòng nhập Name và Username!");
      return;
    }
    setUsers(prev => prev.map(u => {
      if (u.id === editing.id) {
        return {
          ...u,
          name: editing.name,
          username: editing.username,
          email: editing.email,
          address: { ...u.address, city: editing.city }
        };
      }
      return u;
    }));
    setEditing(null);
  }

  // BƯỚC 7: XÓA NGƯỜI DÙNG
  // Xóa người dùng trực tiếp khỏi danh sách
  // Sử dụng filter() để tạo ra một mảng mới mà không chứa phần tử có id trùng
  function removeUser(id) {
    // Giữ lại tất cả người dùng có id khác với id cần xóa
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }

  if (loading) {
    return <div className="loading">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="table-container">
      {/* BƯỚC 4: Hiển thị dữ liệu bằng map */}
      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>City</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* Map qua filteredUsers để render từng dòng */}
          {filteredUsers.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.address.city}</td>
              <td>
                {/* BƯỚC 6: Nút Sửa */}
                <button className="btn-edit" onClick={() => editUser(u)}>
                  Sửa
                </button>
                {/* BƯỚC 7: Nút Xóa */}
                <button className="btn-delete" onClick={() => removeUser(u.id)}>
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* BƯỚC 6 + BƯỚC 8: Modal Form Sửa người dùng */}
      {editing && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4>Sửa người dùng</h4>
            {/* Hiển thị ID (không cho sửa) */}
            <div className="form-group">
              <label htmlFor="edit-id">ID:</label>
              <input
                id="edit-id"
                type="text"
                value={editing.id}
                disabled
                style={{ backgroundColor: '#f0f0f0', cursor: 'not-allowed' }}
              />
            </div>
            <div className="form-group">
              <label htmlFor="edit-name">Name:</label>
              <input
                id="edit-name"
                type="text"
                value={editing.name}
                onChange={(e) => handleEditChange("name", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="edit-username">Username:</label>
              <input
                id="edit-username"
                type="text"
                value={editing.username}
                onChange={(e) => handleEditChange("username", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="edit-email">Email:</label>
              <input
                id="edit-email"
                type="text"
                value={editing.email}
                onChange={(e) => handleEditChange("email", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="edit-city">City:</label>
              <input
                id="edit-city"
                type="text"
                value={editing.city}
                onChange={(e) => handleEditChange("city", e.target.value)}
              />
            </div>
            <div className="modal-actions">
              <button className="btn-save" onClick={saveUser}>
                Lưu
              </button>
              <button className="btn-cancel" onClick={() => setEditing(null)}>
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResultTable;
