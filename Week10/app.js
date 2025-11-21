// API Configuration
const API_URL = 'https://jsonplaceholder.typicode.com/users';
const STORAGE_KEY = 'userManagementData';

// Global State
let users = [];
let filteredUsers = [];
let currentPage = 1;
const usersPerPage = 5;
let userToDelete = null;

// LocalStorage Functions
function saveToLocalStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

function loadFromLocalStorage() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
}

function clearLocalStorage() {
    localStorage.removeItem(STORAGE_KEY);
    console.log('LocalStorage cleared');
}

// Initialize App
document.addEventListener('DOMContentLoaded', async () => {
    await loadUsers();
});

// Load Users from API or LocalStorage
async function loadUsers() {
    try {
        showLoading();
        
        // Check if data exists in localStorage
        const localData = loadFromLocalStorage();
        
        if (localData && localData.length > 0) {
            // Use localStorage data
            users = localData;
            console.log('Loaded from localStorage:', users.length, 'users');
        } else {
            // Fetch from API if no localStorage data
            const response = await fetch(API_URL);
            
            if (!response.ok) {
                throw new Error('Không thể tải dữ liệu người dùng');
            }
            
            users = await response.json();
            console.log('Loaded from API:', users.length, 'users');
            // Save initial data to localStorage
            saveToLocalStorage();
        }
        
        filteredUsers = [...users];
        currentPage = 1;
        renderTable();
        renderPagination();
        hideLoading();
    } catch (error) {
        hideLoading();
        showError('Lỗi khi tải dữ liệu: ' + error.message);
        console.error('Error loading users:', error);
    }
}

// Render User Table
function renderTable() {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';
    
    const startIndex = (currentPage - 1) * usersPerPage;
    const endIndex = startIndex + usersPerPage;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
    
    if (paginatedUsers.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Không tìm thấy người dùng nào</td></tr>';
        return;
    }
    
    paginatedUsers.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td>
                <button class="action-btn btn-edit" onclick="editUser(${user.id})">Sửa</button>
                <button class="action-btn btn-delete" onclick="deleteUser(${user.id})">Xóa</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Render Pagination
function renderPagination() {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';
    
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
    
    if (totalPages <= 1) return;
    
    // Previous Button
    const prevBtn = document.createElement('button');
    prevBtn.textContent = '« Trước';
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
            renderPagination();
        }
    };
    pagination.appendChild(prevBtn);
    
    // Page Numbers
    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.textContent = i;
        pageBtn.className = currentPage === i ? 'active' : '';
        pageBtn.onclick = () => {
            currentPage = i;
            renderTable();
            renderPagination();
        };
        pagination.appendChild(pageBtn);
    }
    
    // Next Button
    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Tiếp »';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderTable();
            renderPagination();
        }
    };
    pagination.appendChild(nextBtn);
}

// Search Users
function searchUsers() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    
    if (searchTerm === '') {
        filteredUsers = [...users];
    } else {
        filteredUsers = users.filter(user => 
            user.name.toLowerCase().includes(searchTerm)
        );
    }
    
    currentPage = 1;
    renderTable();
    renderPagination();
}

// Reset Search
function resetSearch() {
    document.getElementById('searchInput').value = '';
    filteredUsers = [...users];
    currentPage = 1;
    renderTable();
    renderPagination();
}

// Reset Data - Clear localStorage and reload from API
async function resetData() {
    if (confirm('Bạn có chắc chắn muốn xóa tất cả dữ liệu và tải lại từ API?')) {
        clearLocalStorage();
        await loadUsers();
        showSuccess('Đã reset dữ liệu thành công!');
    }
}

// Open Add User Form
function openAddForm() {
    document.getElementById('modalTitle').textContent = 'Thêm người dùng mới';
    document.getElementById('userForm').reset();
    document.getElementById('userId').value = '';
    document.getElementById('userModal').style.display = 'block';
}

// Edit User
function editUser(id) {
    const user = users.find(u => u.id === id);
    if (!user) {
        console.error('User not found with id:', id);
        console.log('Available users:', users);
        showError('Không tìm thấy người dùng!');
        return;
    }
    console.log('Editing user:', user);
    
    document.getElementById('modalTitle').textContent = 'Chỉnh sửa người dùng';
    document.getElementById('userId').value = user.id;
    document.getElementById('userName').value = user.name;
    document.getElementById('userUsername').value = user.username;
    document.getElementById('userEmail').value = user.email;
    document.getElementById('userPhone').value = user.phone;
    document.getElementById('userWebsite').value = user.website || '';
    document.getElementById('userCity').value = user.address?.city || '';
    document.getElementById('userCompany').value = user.company?.name || '';
    
    document.getElementById('userModal').style.display = 'block';
}

// Delete User
function deleteUser(id) {
    userToDelete = id;
    document.getElementById('deleteModal').style.display = 'block';
}

// Confirm Delete
async function confirmDelete() {
    if (!userToDelete) return;
    
    try {
        showLoading();
        
        // Check if this is a newly created user (not from API)
        const isLocalUser = userToDelete > 10;
        
        if (!isLocalUser) {
            // DELETE request to API only for original users
            const response = await fetch(`${API_URL}/${userToDelete}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                throw new Error('Không thể xóa người dùng');
            }
        }
        
        // Update UI manually after successful DELETE or for local users
        users = users.filter(u => u.id !== userToDelete);
        filteredUsers = filteredUsers.filter(u => u.id !== userToDelete);
        
        // Save to localStorage
        saveToLocalStorage();
        
        // Adjust current page if needed
        const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
        if (currentPage > totalPages && totalPages > 0) {
            currentPage = totalPages;
        }
        
        renderTable();
        renderPagination();
        
        closeDeleteModal();
        hideLoading();
        showSuccess('Xóa người dùng thành công!');
    } catch (error) {
        hideLoading();
        showError('Lỗi khi xóa người dùng: ' + error.message);
        console.error('Error deleting user:', error);
    }
}

// Close Delete Modal
function closeDeleteModal() {
    document.getElementById('deleteModal').style.display = 'none';
    userToDelete = null;
}

// Handle Form Submit
document.getElementById('userForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const userId = document.getElementById('userId').value;
    const userData = {
        name: document.getElementById('userName').value,
        username: document.getElementById('userUsername').value,
        email: document.getElementById('userEmail').value,
        phone: document.getElementById('userPhone').value,
        website: document.getElementById('userWebsite').value,
        address: {
            city: document.getElementById('userCity').value
        },
        company: {
            name: document.getElementById('userCompany').value
        }
    };
    
    if (userId) {
        await updateUser(parseInt(userId), userData);
    } else {
        await createUser(userData);
    }
});

// Create User
async function createUser(userData) {
    try {
        showLoading();
        
        // POST request to API
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        
        if (!response.ok) {
            throw new Error('Không thể thêm người dùng');
        }
        
        const newUser = await response.json();
        
        // Update UI manually after successful POST
        // JSONPlaceholder returns id 11, but we'll use a unique id
        const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
        const completeUser = {
            id: newId,
            name: userData.name,
            username: userData.username,
            email: userData.email,
            phone: userData.phone,
            website: userData.website || '',
            address: {
                street: '',
                suite: '',
                city: userData.address?.city || '',
                zipcode: '',
                geo: { lat: '', lng: '' }
            },
            company: {
                name: userData.company?.name || '',
                catchPhrase: '',
                bs: ''
            }
        };
        users.unshift(completeUser);
        filteredUsers = [...users];
        
        console.log('New user created:', completeUser);
        console.log('All users after creation:', users);
        
        // Save to localStorage
        saveToLocalStorage();
        console.log('Saved to localStorage');
        
        currentPage = 1;
        renderTable();
        renderPagination();
        
        closeModal();
        hideLoading();
        showSuccess('Thêm người dùng thành công!');
    } catch (error) {
        hideLoading();
        showError('Lỗi khi thêm người dùng: ' + error.message);
        console.error('Error creating user:', error);
    }
}

// Update User
async function updateUser(id, userData) {
    try {
        showLoading();
        
        // Check if this is a newly created user (not from API)
        const isLocalUser = id > 10;
        
        if (!isLocalUser) {
            // PUT request to API only for original users
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            
            if (!response.ok) {
                throw new Error('Không thể cập nhật người dùng');
            }
        }
        
        // Update UI manually after successful PUT or for local users
        const index = users.findIndex(u => u.id === id);
        if (index !== -1) {
            users[index] = { 
                ...users[index],
                name: userData.name,
                username: userData.username,
                email: userData.email,
                phone: userData.phone,
                website: userData.website || '',
                address: {
                    ...users[index].address,
                    city: userData.address?.city || ''
                },
                company: {
                    ...users[index].company,
                    name: userData.company?.name || ''
                },
                id
            };
            filteredUsers = [...users];
            
            // Save to localStorage
            saveToLocalStorage();
        }
        
        renderTable();
        
        closeModal();
        hideLoading();
        showSuccess('Cập nhật người dùng thành công!');
    } catch (error) {
        hideLoading();
        showError('Lỗi khi cập nhật người dùng: ' + error.message);
        console.error('Error updating user:', error);
    }
}

// Close Modal
function closeModal() {
    document.getElementById('userModal').style.display = 'none';
}

// Show Loading
function showLoading() {
    document.getElementById('loading').style.display = 'flex';
}

// Hide Loading
function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

// Show Error Message
function showError(message) {
    const errorElement = document.getElementById('errorMessage');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    errorElement.classList.remove('success-message');
    
    setTimeout(() => {
        errorElement.style.display = 'none';
    }, 3000);
}

// Show Success Message
function showSuccess(message) {
    const errorElement = document.getElementById('errorMessage');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    errorElement.classList.add('success-message');
    
    setTimeout(() => {
        errorElement.style.display = 'none';
        errorElement.classList.remove('success-message');
    }, 3000);
}

// Close modals when clicking outside
window.onclick = function(event) {
    const userModal = document.getElementById('userModal');
    const deleteModal = document.getElementById('deleteModal');
    
    if (event.target === userModal) {
        closeModal();
    }
    if (event.target === deleteModal) {
        closeDeleteModal();
    }
}

// Handle Enter key in search input
document.getElementById('searchInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchUsers();
    }
});
