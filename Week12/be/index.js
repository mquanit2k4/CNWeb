const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const Student = require('./Student');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); // Cho phép frontend truy cập API
app.use(express.json()); // Parse JSON request bodies
app.use(bodyParser.json()); // Alternative JSON parser
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Student Management API' });
});

// Bai 2
// API Routes
// GET - Lấy danh sách tất cả học sinh
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET - Lấy thông tin một học sinh theo ID
app.get('/api/students/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST - Thêm học sinh mới
app.post('/api/students', async (req, res) => {
  try {
    console.log('Received data:', req.body); // Debug log
    const newStudent = await Student.create(req.body);
    console.log('Created student:', newStudent); // Debug log
    res.status(201).json(newStudent);
  } catch (e) {
    console.error('Error creating student:', e); // Debug log
    res.status(400).json({ error: e.message });
  }
});

// PUT - Cập nhật thông tin học sinh
app.put('/api/students/:id', async (req, res) => {
  try {
    console.log('Updating student:', req.params.id, 'with data:', req.body);
    const updatedStu = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Trả về document sau khi update
    );
    if (!updatedStu) {
      return res.status(404).json({ error: "Student not found" });
    }
    console.log('Updated student:', updatedStu);
    res.json(updatedStu);
  } catch (err) {
    console.error('Error updating student:', err);
    res.status(400).json({ error: err.message });
  }
});

// DELETE - Xóa học sinh
app.delete('/api/students/:id', async (req, res) => {
  try {
    const id = req.params.id;
    console.log('Deleting student:', id);
    const deleted = await Student.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: "Student not found" });
    }
    console.log('Deleted student:', deleted);
    res.json({ message: "Đã xóa học sinh", id: deleted._id });
  } catch (err) {
    console.error('Error deleting student:', err);
    res.status(500).json({ error: err.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// MongoDB connection
const MONGODB_URI = 'mongodb://localhost:27017/student-management';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully');
    console.log('Database:', mongoose.connection.name);
    // Start server after database connection
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log(`API endpoints:`);
      console.log(`  GET    http://localhost:${PORT}/api/students`);
      console.log(`  GET    http://localhost:${PORT}/api/students/:id`);
      console.log(`  POST   http://localhost:${PORT}/api/students`);
      console.log(`  PUT    http://localhost:${PORT}/api/students/:id`);
      console.log(`  DELETE http://localhost:${PORT}/api/students/:id`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });
