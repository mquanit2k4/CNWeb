import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Input, Button, InputNumber, message, Card, Modal, Space } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined, SearchOutlined, SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons';

const { confirm } = Modal;
const { Search } = Input;

function HomePage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortAsc, setSortAsc] = useState(true);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // Fetch danh sách học sinh
  const fetchStudents = () => {
    axios.get('http://localhost:5000/api/students')
      .then(response => {
        setStudents(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Lỗi khi fetch danh sách:", error);
        setError(error.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Xử lý thêm học sinh
  const handleAddStudent = (values) => {
    axios.post('http://localhost:5000/api/students', values)
      .then(response => {
        message.success('Thêm học sinh thành công!');
        setStudents([...students, response.data]);
        form.resetFields();
      })
      .catch(error => {
        console.error("Lỗi khi thêm học sinh:", error);
        message.error('Lỗi khi thêm học sinh: ' + error.message);
      });
  };

  // Chuyển đến trang Edit
  const handleEdit = (id) => {
    navigate(`/edit/${id}`);
  };

  // Xử lý xóa học sinh
  const handleDelete = (id, name) => {
    confirm({
      title: 'Xác nhận xóa',
      icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc muốn xóa học sinh "${name}"?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk() {
        axios.delete(`http://localhost:5000/api/students/${id}`)
          .then(res => {
            message.success(res.data.message || 'Xóa học sinh thành công!');
            setStudents(prevList => prevList.filter(s => s._id !== id));
          })
          .catch(err => {
            console.error("Lỗi khi xóa:", err);
            message.error('Lỗi khi xóa học sinh: ' + err.message);
          });
      }
    });
  };

  // Lọc danh sách học sinh theo tên
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sắp xếp danh sách đã lọc theo tên (chữ cuối)
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    // Lấy tên (chữ cuối cùng trong họ tên)
    const getFirstName = (fullName) => {
      const parts = fullName.trim().split(' ');
      return parts[parts.length - 1].toLowerCase();
    };
    
    const nameA = getFirstName(a.name);
    const nameB = getFirstName(b.name);
    
    if (nameA < nameB) return sortAsc ? -1 : 1;
    if (nameA > nameB) return sortAsc ? 1 : -1;
    return 0;
  });

  if (loading) return <div className="App"><h2>Đang tải...</h2></div>;
  if (error) return <div className="App"><h2>Lỗi: {error}</h2></div>;

  return (
    <div className="App">
      <header className="App-header">
        <h1>Quản Lý Học Sinh</h1>
      </header>
      
      {/* Form thêm học sinh */}
      <div className="add-student-form">
        <Card title="Thêm Học Sinh Mới" style={{ maxWidth: 600, margin: '20px auto' }}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleAddStudent}
          >
            <Form.Item
              label="Họ Tên"
              name="name"
              rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
            >
              <Input placeholder="Nhập họ tên" />
            </Form.Item>

            <Form.Item
              label="Tuổi"
              name="age"
              rules={[
                { required: true, message: 'Vui lòng nhập tuổi!' },
                { type: 'number', min: 1, max: 100, message: 'Tuổi phải từ 1-100!' }
              ]}
            >
              <InputNumber placeholder="Nhập tuổi" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              label="Lớp"
              name="class"
              rules={[{ required: true, message: 'Vui lòng nhập lớp!' }]}
            >
              <Input placeholder="Nhập lớp (VD: 10A1)" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Thêm Học Sinh
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>

      {/* Danh sách học sinh */}
      <div className="student-list">
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0 }}>Danh Sách Học Sinh</h2>
          <Space size="middle">
            <Button 
              icon={sortAsc ? <SortAscendingOutlined /> : <SortDescendingOutlined />}
              onClick={() => setSortAsc(prev => !prev)}
              type="default"
              size="large"
            >
              Sắp xếp: {sortAsc ? 'A → Z' : 'Z → A'}
            </Button>
            <Search
              placeholder="Tìm kiếm theo tên..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              style={{ width: 400 }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Space>
        </div>
        
        {sortedStudents.length === 0 ? (
          <p>{searchTerm ? 'Không tìm thấy học sinh nào.' : 'Chưa có học sinh nào trong danh sách.'}</p>
        ) : (
          <>
            <p style={{ color: '#666', marginBottom: '10px' }}>
              {searchTerm && `Tìm thấy ${sortedStudents.length} kết quả cho "${searchTerm}"`}
              {!searchTerm && `Tổng số: ${students.length} học sinh`}
            </p>
            <table>
            <thead>
              <tr>
                <th>STT</th>
                <th>Họ Tên</th>
                <th>Tuổi</th>
                <th>Lớp</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {sortedStudents.map((student, index) => (
                <tr key={student._id}>
                  <td>{index + 1}</td>
                  <td>{student.name}</td>
                  <td>{student.age}</td>
                  <td>{student.class}</td>
                  <td>
                    <Space>
                      <Button 
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(student._id)}
                        size="small"
                      >
                        Sửa
                      </Button>
                      <Button 
                        type="primary"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(student._id, student.name)}
                        size="small"
                      >
                        Xóa
                      </Button>
                    </Space>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </>
        )}
      </div>
    </div>
  );
}

export default HomePage;
