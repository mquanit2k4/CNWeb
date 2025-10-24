// ===== QUẢN LÝ LOCALSTORAGE =====

const STORAGE_KEY = 'products';

/**
 * Lấy danh sách sản phẩm từ LocalStorage
 * @returns {Array} Mảng các sản phẩm
 */
function getProductsFromStorage() {
  try {
    const productsJson = localStorage.getItem(STORAGE_KEY);
    return productsJson ? JSON.parse(productsJson) : null;
  } catch (error) {
    console.error('Lỗi khi đọc LocalStorage:', error);
    return null;
  }
}

/**
 * Lưu danh sách sản phẩm vào LocalStorage
 * @param {Array} products - Mảng các sản phẩm
 */
function saveProductsToStorage(products) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch (error) {
    console.error('Lỗi khi lưu vào LocalStorage:', error);
  }
}

/**
 * Khởi tạo LocalStorage với sản phẩm mẫu từ HTML
 */
function initializeStorage() {
  // Lấy các sản phẩm mẫu từ HTML
  const productElements = document.querySelectorAll('.product-item');
  const defaultProducts = [];
  
  productElements.forEach(product => {
    const productData = extractProductData(product);
    if (productData) {
      defaultProducts.push(productData);
    }
  });
  
  // Lưu vào LocalStorage
  saveProductsToStorage(defaultProducts);
  
  console.log('✅ Đã khởi tạo LocalStorage với', defaultProducts.length, 'sản phẩm mẫu');
}

/**
 * Trích xuất dữ liệu sản phẩm từ phần tử HTML
 * @param {HTMLElement} productElement - Phần tử article sản phẩm
 * @returns {Object} Đối tượng sản phẩm
 */
function extractProductData(productElement) {
  try {
    const name = productElement.querySelector('.product-name')?.textContent.trim();
    const description = productElement.querySelector('header + p')?.textContent.trim();
    const duration = productElement.querySelector('section ul li:first-child')?.textContent.replace('Thời lượng: ', '').trim();
    const priceText = productElement.querySelector('section p strong')?.parentElement?.textContent;
    const price = priceText ? priceText.match(/[\d.]+/g)?.join('').replace(/\./g, '') : '0';
    const imageUrl = productElement.querySelector('img')?.src || '';
    
    if (!name) return null;
    
    return {
      id: Date.now() + Math.random(), // ID duy nhất
      name,
      description: description || '',
      duration: duration || '',
      price: price || '0',
      imageUrl: imageUrl || '',
      createdAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Lỗi khi trích xuất dữ liệu sản phẩm:', error);
    return null;
  }
}

/**
 * Render danh sách sản phẩm từ LocalStorage
 */
function renderProductsFromStorage() {
  const products = getProductsFromStorage();
  
  if (!products || products.length === 0) {
    console.log('📦 Không có dữ liệu trong LocalStorage, khởi tạo với sản phẩm mẫu');
    initializeStorage();
    return;
  }
  
  // Xóa danh sách hiện tại
  const productList = document.getElementById('product-list');
  productList.innerHTML = '';
  
  // Render từng sản phẩm
  products.forEach((productData, index) => {
    const productElement = createProductElement(
      productData.name,
      productData.description,
      productData.duration,
      productData.price,
      productData.imageUrl
    );
    
    productList.appendChild(productElement);
    
    // Thêm HR giữa các sản phẩm (không thêm sau sản phẩm cuối)
    if (index < products.length - 1) {
      const hr = document.createElement('hr');
      productList.appendChild(hr);
    }
  });
  
  console.log('✅ Đã render', products.length, 'sản phẩm từ LocalStorage');
}

/**
 * Thêm sản phẩm mới vào LocalStorage
 * @param {Object} productData - Dữ liệu sản phẩm mới
 */
function addProductToStorage(productData) {
  const products = getProductsFromStorage() || [];
  
  // Thêm sản phẩm mới vào đầu mảng
  products.unshift({
    id: Date.now() + Math.random(),
    ...productData,
    createdAt: new Date().toISOString()
  });
  
  // Lưu lại vào LocalStorage
  saveProductsToStorage(products);
  
  console.log('✅ Đã thêm sản phẩm vào LocalStorage:', productData.name);
}

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
    // Xóa thông báo lỗi cũ (nếu có)
    hideErrorMessage();
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
  
  // Xóa thông báo lỗi
  hideErrorMessage();
}

// ===== CHỨC NĂNG VALIDATION =====

/**
 * Hiển thị thông báo lỗi
 */
function showErrorMessage(message) {
  const errorMsg = document.getElementById('errorMsg');
  errorMsg.innerHTML = message; // Đổi từ textContent sang innerHTML
  errorMsg.classList.remove('hidden');
}

/**
 * Ẩn thông báo lỗi
 */
function hideErrorMessage() {
  const errorMsg = document.getElementById('errorMsg');
  errorMsg.textContent = '';
  errorMsg.classList.add('hidden');
}

/**
 * Validate dữ liệu form
 * @returns {Object} { isValid: boolean, errors: string[] }
 */
function validateProductForm() {
  const errors = [];
  
  // Lấy giá trị từ form
  const name = document.getElementById('product-name').value.trim();
  const description = document.getElementById('product-description').value.trim();
  const duration = document.getElementById('product-duration').value.trim();
  const price = document.getElementById('product-price').value.trim();
  const imageUrl = document.getElementById('product-image').value.trim();
  
  // Kiểm tra tên sản phẩm
  if (name === '') {
    errors.push('Tên khóa học không được để trống');
  } else if (name.length < 5) {
    errors.push('Tên khóa học phải có ít nhất 5 ký tự');
  }
  
  // Kiểm tra mô tả
  if (description === '') {
    errors.push('Mô tả không được để trống');
  } else if (description.length < 10) {
    errors.push('Mô tả phải có ít nhất 10 ký tự');
  }
  
  // Kiểm tra thời lượng
  if (duration === '') {
    errors.push('Thời lượng không được để trống');
  }
  
  // Kiểm tra giá
  if (price === '') {
    errors.push('Giá không được để trống');
  } else {
    const priceNumber = Number(price);
    if (isNaN(priceNumber)) {
      errors.push('Giá phải là một số hợp lệ');
    } else if (priceNumber <= 0) {
      errors.push('Giá phải lớn hơn 0');
    }
  }
  
  // Kiểm tra URL hình ảnh (nếu có nhập)
  if (imageUrl !== '' && !isValidUrl(imageUrl)) {
    errors.push('URL hình ảnh không hợp lệ');
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors,
    data: {
      name,
      description,
      duration,
      price,
      imageUrl
    }
  };
}

/**
 * Kiểm tra URL có hợp lệ không
 */
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

// ===== CHỨC NĂNG THÊM SẢN PHẨM MỚI =====

/**
 * Hàm xử lý khi submit form thêm sản phẩm
 */
function handleAddProduct(event) {
  // Ngăn chặn hành vi mặc định của form (reload trang)
  event.preventDefault();
  
  // Xóa thông báo lỗi cũ
  hideErrorMessage();
  
  // Validate dữ liệu
  const validation = validateProductForm();
  
  if (!validation.isValid) {
    // Hiển thị lỗi với mỗi lỗi trên 1 dòng riêng
    const errorList = validation.errors.map(error => `• ${error}`).join('<br>');
    const errorMessage = `❌ <strong>Lỗi:</strong><br>${errorList}`;
    showErrorMessage(errorMessage);
    return;
  }
  
  // Dữ liệu hợp lệ, tạo sản phẩm mới
  const { name, description, duration, price, imageUrl } = validation.data;
  
  // LƯU VÀO LOCALSTORAGE TRƯỚC
  addProductToStorage({ name, description, duration, price, imageUrl });
  
  // Tạo phần tử sản phẩm mới
  const newProduct = createProductElement(name, description, duration, price, imageUrl);
  
  // Thêm sản phẩm vào đầu danh sách
  const productList = document.getElementById('product-list');
  
  // Thêm HR trước sản phẩm mới nếu đã có sản phẩm
  const existingProducts = productList.querySelectorAll('.product-item');
  if (existingProducts.length > 0) {
    const hr = document.createElement('hr');
    productList.insertBefore(hr, productList.firstChild);
  }
  
  // Thêm sản phẩm vào đầu danh sách (prepend)
  productList.insertBefore(newProduct, productList.firstChild);
  
  // Hiển thị thông báo thành công
  showSuccessNotification('✅ Đã thêm khóa học mới và lưu vào LocalStorage!');
  
  // Ẩn form và reset
  hideAddProductForm();
  
  // Scroll đến sản phẩm mới
  newProduct.scrollIntoView({ behavior: 'smooth', block: 'center' });
  
  // Thêm hiệu ứng highlight cho sản phẩm mới
  newProduct.style.animation = 'highlight 2s ease';
}

/**
 * Tạo phần tử HTML cho sản phẩm mới
 */
function createProductElement(name, description, duration, price, imageUrl) {
  const article = document.createElement('article');
  article.className = 'product-item';
  
  // Tạo ID duy nhất cho sản phẩm
  const productId = 'product-' + Date.now();
  article.setAttribute('aria-labelledby', productId);
  
  // Format giá (thêm dấu chấm phân cách)
  const formattedPrice = Number(price).toLocaleString('vi-VN');
  
  // Tạo nội dung HTML
  article.innerHTML = `
    <header>
      <h3 class="product-name" id="${productId}">${escapeHtml(name)}</h3>
    </header>

    <p>${escapeHtml(description)}</p>

    ${imageUrl ? `<img src="${escapeHtml(imageUrl)}" alt="Hình ảnh ${escapeHtml(name)}" onerror="this.style.display='none'" />` : ''}

    <section aria-label="Thông tin nhanh">
      <h4>Thông tin chính</h4>
      <ul>
        <li>Thời lượng: ${escapeHtml(duration)}</li>
        <li>Tài liệu: Đầy đủ và cập nhật</li>
        <li>Hỗ trợ: Hỏi–đáp trực tuyến</li>
      </ul>
      <p><strong>Giá:</strong> ${formattedPrice}&nbsp;VND</p>
    </section>

    <p><a href="#form-dang-ky">Đăng ký ngay</a></p>
  `;
  
  return article;
}

/**
 * Escape HTML để tránh XSS
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Hiển thị thông báo thành công (toast notification)
 */
function showSuccessNotification(message) {
  // Xóa thông báo cũ nếu có
  const oldNotification = document.getElementById('success-notification');
  if (oldNotification) {
    oldNotification.remove();
  }
  
  // Tạo phần tử thông báo
  const notification = document.createElement('div');
  notification.id = 'success-notification';
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    padding: 15px 25px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    z-index: 10000;
    font-weight: 600;
    animation: slideInRight 0.3s ease;
  `;
  notification.textContent = message;
  
  // Thêm vào body
  document.body.appendChild(notification);
  
  // Tự động xóa sau 3 giây
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

// ===== KHỞI TẠO CÁC SỰ KIỆN =====

/**
 * Hàm khởi tạo tất cả các sự kiện khi trang đã load xong
 */
function initializeApp() {
  // === LOAD DỮ LIỆU TỪ LOCALSTORAGE ===
  console.log('🔄 Đang tải dữ liệu từ LocalStorage...');
  renderProductsFromStorage();
  
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
  
  const addProductBtn = document.getElementById('addProductBtn');
  const cancelBtn = document.getElementById('cancelBtn');
  
  // Gắn sự kiện click cho nút "Thêm khóa học" - Toggle form
  addProductBtn.addEventListener('click', toggleAddProductForm);
  
  // Gắn sự kiện click cho nút "Hủy" - Đóng form
  cancelBtn.addEventListener('click', hideAddProductForm);
  
  // === Sự kiện SUBMIT FORM THÊM SẢN PHẨM ===
  
  const productForm = document.getElementById('productForm');
  
  // Gắn sự kiện submit cho form
  productForm.addEventListener('submit', handleAddProduct);
  
  // === Thông báo đã load xong ===
  console.log('✅ JavaScript đã được khởi tạo thành công!');
  console.log('📦 Các tính năng sẵn có:');
  console.log('   - Tìm kiếm sản phẩm (gõ vào ô tìm kiếm)');
  console.log('   - Ẩn/hiện form thêm sản phẩm (click nút "Thêm khóa học")');
  console.log('   - Thêm sản phẩm mới với validation đầy đủ');
  console.log('   - Sản phẩm mới tự động tương tác với chức năng tìm kiếm');
  console.log('   - 💾 Lưu trữ dữ liệu với LocalStorage (dữ liệu không mất khi tải lại trang)');
}

// ===== THÊM CSS ANIMATION VÀO TRANG =====
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
  
  @keyframes highlight {
    0% {
      background-color: #fef3c7;
      transform: scale(1.02);
    }
    50% {
      background-color: #fef3c7;
      transform: scale(1.02);
    }
    100% {
      background-color: #fafafa;
      transform: scale(1);
    }
  }
`;
document.head.appendChild(style);

// ===== KHỞI ĐỘNG ỨNG DỤNG KHI TRANG ĐÃ LOAD XONG =====

// Chờ DOM load xong rồi mới chạy
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  // DOM đã load xong, chạy ngay
  initializeApp();
}
