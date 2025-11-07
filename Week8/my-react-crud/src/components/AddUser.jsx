import { useState } from 'react';

// BƯỚC 5: THÊM NGƯỜI DÙNG (ADDUSER)
// Mục tiêu: Tạo form thêm người dùng mới và gửi dữ liệu lên App
function AddUser({ onAdd }) {
  // State để kiểm soát hiển thị form
  const [adding, setAdding] = useState(false);
  
  // State Form: Quản lý các trường nhập liệu (chỉ 4 trường cơ bản)
  const [user, setUser] = useState({
    name: "",
    username: "",
    email: "",
    city: ""
  });

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { id, value } = e.target;
    setUser({ ...user, [id]: value });
  };

  // Thao tác Thêm: Gọi onAdd(user) để truyền dữ liệu lên App
  const handleAdd = () => {
    // Validate dữ liệu
    if (user.name === "" || user.username === "") {
      alert("Vui lòng nhập Name và Username!");
      return;
    }
    // Truyền dữ liệu lên component cha
    onAdd(user);
    // Reset form về trạng thái ban đầu
    setUser({
      name: "",
      username: "",
      email: "",
      city: ""
    });
    setAdding(false);
  };

  return (
    <div className="add-user-container">
      <button className="btn-add" onClick={() => setAdding(true)}>
        Thêm người dùng
      </button>

      {/* BƯỚC 8: Modal Form với CSS */}
      {adding && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4>Thêm người dùng</h4>
            {/* Form chỉ gồm 4 trường: Name, Username, Email, City */}
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                id="name"
                type="text"
                value={user.name}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="username">Username:</label>
              <input
                id="username"
                type="text"
                value={user.username}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                id="email"
                type="text"
                value={user.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="city">City:</label>
              <input
                id="city"
                type="text"
                value={user.city}
                onChange={handleChange}
              />
            </div>
            <div className="modal-actions">
              <button className="btn-save" onClick={handleAdd}>
                Lưu
              </button>
              <button className="btn-cancel" onClick={() => setAdding(false)}>
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddUser;
