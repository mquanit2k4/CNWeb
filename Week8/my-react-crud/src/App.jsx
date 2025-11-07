import { useState } from 'react'
import './App.css'
import SearchForm from './components/SearchForm'
import AddUser from './components/AddUser'
import ResultTable from './components/ResultTable'

// BƯỚC 2: TỔ CHỨC COMPONENT VÀ STATE TẬP TRUNG
// Component App - Quản lý toàn bộ state và truyền props xuống con
function App() {
  // State tập trung: Từ khóa tìm kiếm và Người dùng mới
  const [kw, setKeyword] = useState("");
  const [newUser, setNewUser] = useState(null);

  return (
    <div className="app-container">
      <h1>Quản lý người dùng</h1>
      {/* BƯỚC 3: Truyền hàm setKeyword xuống SearchForm để cập nhật từ khóa tìm kiếm */}
      <SearchForm onChangeValue={setKeyword} />
      
      {/* BƯỚC 5: Truyền hàm setNewUser xuống AddUser để nhận người dùng mới */}
      <AddUser onAdd={setNewUser} />
      
      {/* BƯỚC 4, 6, 7: Truyền keyword và newUser xuống ResultTable để hiển thị, lọc, sửa, xóa */}
      <ResultTable keyword={kw} user={newUser} onAdded={() => setNewUser(null)} />
    </div>
  )
}

export default App
