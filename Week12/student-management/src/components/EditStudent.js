import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Input, Button, InputNumber, message, Card, Spin } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

function EditStudent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);

  // Fetch thông tin học sinh hiện tại
  useEffect(() => {
    axios.get(`http://localhost:5000/api/students/${id}`)
      .then(res => {
        form.setFieldsValue({
          name: res.data.name,
          age: res.data.age,
          class: res.data.class
        });
        setLoading(false);
      })
      .catch(err => {
        console.error("Lỗi khi fetch thông tin học sinh:", err);
        message.error('Không thể tải thông tin học sinh!');
        setLoading(false);
      });
  }, [id, form]);

  // Xử lý cập nhật học sinh
  const handleUpdateStudent = (values) => {
    axios.put(`http://localhost:5000/api/students/${id}`, values)
      .then(response => {
        message.success('Cập nhật học sinh thành công!');
        navigate('/'); // Quay về trang chủ
      })
      .catch(error => {
        console.error("Lỗi khi cập nhật học sinh:", error);
        message.error('Lỗi khi cập nhật học sinh: ' + error.message);
      });
  };

  if (loading) {
    return (
      <div className="App" style={{ padding: '50px' }}>
        <Spin size="large" tip="Đang tải thông tin học sinh..." />
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Chỉnh Sửa Thông Tin Học Sinh</h1>
      </header>
      
      <div className="edit-student-form">
        <Card 
          title="Cập Nhật Thông Tin" 
          style={{ maxWidth: 600, margin: '20px auto' }}
          extra={
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={() => navigate('/')}
            >
              Quay lại
            </Button>
          }
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleUpdateStudent}
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
                Cập Nhật
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
}

export default EditStudent;
