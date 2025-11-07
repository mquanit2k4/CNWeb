// ===== CHỨC NĂNG TÌM KIẾM SẢN PHẨM =====

/**
 * Hàm tìm kiếm và lọc sản phẩm theo từ khóa
 */
function searchProducts() {
  // Lấy giá trị từ ô input tìm kiếm
  const searchInput = document.getElementById('searchInput');
  const searchTerm = searchInput.value.toLowerCase().trim();
  
  // Lấy tất cả các sản phẩm
  const products = document.querySelectorAll('.product-item');
  
  // Duyệt qua từng sản phẩm
  products.forEach(function(product) {
    // Lấy tên sản phẩm từ thẻ h3 có class "product-name"
    const productNameElement = product.querySelector('.product-name');
    
    if (productNameElement) {
      const productName = productNameElement.textContent.toLowerCase();
      
      // Kiểm tra xem tên sản phẩm có chứa từ khóa tìm kiếm không
      if (productName.includes(searchTerm)) {
        // Hiển thị sản phẩm
        product.style.display = '';
      } else {
        // Ẩn sản phẩm
        product.style.display = 'none';
      }
    }
  });
  
  // Hiển thị thông báo nếu không tìm thấy sản phẩm nào
  const visibleProducts = document.querySelectorAll('.product-item[style=""]');
  const allHidden = Array.from(products).every(p => p.style.display === 'none');
  
  if (allHidden && searchTerm !== '') {
    showNoResultsMessage();
  } else {
    hideNoResultsMessage();
  }
}

/**
 * Hiển thị thông báo không tìm thấy kết quả
 */
function showNoResultsMessage() {
  // Xóa thông báo cũ nếu có
  hideNoResultsMessage();
  
  const productList = document.getElementById('product-list');
  const noResultsDiv = document.createElement('div');
  noResultsDiv.id = 'no-results-message';
  noResultsDiv.style.cssText = `
    padding: 40px;
    text-align: center;
    background: #fef2f2;
    border: 2px dashed #ef4444;
    border-radius: 8px;
    color: #dc2626;
    font-size: 1.1rem;
    margin: 20px 0;
  `;
  noResultsDiv.innerHTML = '❌ Không tìm thấy khóa học nào phù hợp với từ khóa của bạn.';
  
  productList.appendChild(noResultsDiv);
}

/**
 * Ẩn thông báo không tìm thấy kết quả
 */
function hideNoResultsMessage() {
  const noResultsMsg = document.getElementById('no-results-message');
  if (noResultsMsg) {
    noResultsMsg.remove();
  }
}

// ===== CHỨC NĂNG ẨN/HIỆN FORM THÊM SẢN PHẨM =====

/**
 * Hàm toggle (ẩn/hiện) form thêm sản phẩm
 */
function toggleAddProductForm() {
  const addProductForm = document.getElementById('addProductForm');
  
  // Sử dụng classList.toggle để chuyển đổi class "hidden"
  addProductForm.classList.toggle('hidden');
  
  // Scroll đến form nếu form đang được hiển thị
  if (!addProductForm.classList.contains('hidden')) {
    addProductForm.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

/**
 * Hàm ẩn form thêm sản phẩm
 */
function hideAddProductForm() {
  const addProductForm = document.getElementById('addProductForm');
  addProductForm.classList.add('hidden');
  
  // Reset form khi đóng
  document.getElementById('productForm').reset();
}

// ===== CHỨC NĂNG THÊM SẢN PHẨM MỚI =====
// (Chức năng này sẽ được phát triển trong các bài tập tiếp theo)

// ===== KHỞI TẠO CÁC SỰ KIỆN =====

/**
 * Hàm khởi tạo tất cả các sự kiện khi trang đã load xong
 */
function initializeApp() {
  // === Sự kiện TÌM KIẾM ===
  
  // Lấy các phần tử
  const searchBtn = document.getElementById('searchBtn');
  const searchInput = document.getElementById('searchInput');
  
  // Gắn sự kiện click cho nút tìm kiếm
  searchBtn.addEventListener('click', searchProducts);
  
  // Gắn sự kiện keyup cho ô input (tìm kiếm khi gõ)
  searchInput.addEventListener('keyup', function(event) {
    // Tìm kiếm ngay khi gõ
    searchProducts();
    
    // Nếu nhấn Enter, cũng tìm kiếm
    if (event.key === 'Enter') {
      searchProducts();
    }
  });
  
  // === Sự kiện ẨN/HIỆN FORM THÊM SẢN PHẨM ===
  
  // Lấy các phần tử
  const addProductBtn = document.getElementById('addProductBtn');
  const cancelBtn = document.getElementById('cancelBtn');
  
  // Gắn sự kiện click cho nút "Thêm khóa học" - Toggle form
  addProductBtn.addEventListener('click', toggleAddProductForm);
  
  // Gắn sự kiện click cho nút "Hủy" - Đóng form
  cancelBtn.addEventListener('click', hideAddProductForm);
  
  // === Thông báo đã load xong ===
  console.log('✅ JavaScript đã được khởi tạo thành công!');
  console.log('📦 Các tính năng sẵn có:');
  console.log('   - Tìm kiếm sản phẩm (gõ vào ô tìm kiếm)');
  console.log('   - Ẩn/hiện form thêm sản phẩm (click nút "Thêm khóa học")');
}



// ===== KHỞI ĐỘNG ỨNG DỤNG KHI TRANG ĐÃ LOAD XONG =====

// Chờ DOM load xong rồi mới chạy
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  // DOM đã load xong, chạy ngay
  initializeApp();
}
