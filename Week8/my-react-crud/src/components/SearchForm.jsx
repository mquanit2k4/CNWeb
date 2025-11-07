// BƯỚC 3: CHỨC NĂNG TÌM KIẾM (SEARCHFORM)
// Mục tiêu: Truyền dữ liệu tìm kiếm từ con → cha → bảng kết quả
function SearchForm({ onChangeValue }) {
  return (
    <div className="search-container">
      {/* Sử dụng sự kiện onChange để kích hoạt hàm callback, cập nhật kw ở App */}
      <input
        type="text"
        placeholder="Tìm theo name, username"
        onChange={(e) => onChangeValue(e.target.value)}
        className="search-input"
      />
    </div>
  );
}

export default SearchForm;
