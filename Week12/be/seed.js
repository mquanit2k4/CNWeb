const mongoose = require('mongoose');
const Student = require('./Student');

const MONGODB_URI = 'mongodb://localhost:27017/student-management';

// Dữ liệu mẫu
const sampleStudents = [
  { name: 'Nguyễn Văn An', age: 18, class: '12A1' },
  { name: 'Trần Thị Bình', age: 17, class: '11B2' },
  { name: 'Lê Văn Cường', age: 19, class: '12A3' },
  { name: 'Phạm Thị Dung', age: 16, class: '10C1' },
  { name: 'Hoàng Văn Em', age: 18, class: '12B1' },
  { name: 'Đỗ Thị Lan', age: 17, class: '11A2' },
  { name: 'Vũ Văn Giang', age: 19, class: '12C3' },
  { name: 'Bùi Thị Hà', age: 16, class: '10A1' },
  { name: 'Đinh Văn Khoa', age: 18, class: '12B2' },
  { name: 'Lý Thị Mai', age: 17, class: '11C1' },
  { name: 'Phan Văn Nam', age: 19, class: '12A2' },
  { name: 'Trương Thị Oanh', age: 16, class: '10B3' },
  { name: 'Ngô Văn Phúc', age: 18, class: '12C1' },
  { name: 'Đặng Thị Quỳnh', age: 17, class: '11A3' },
  { name: 'Võ Văn Rồng', age: 19, class: '12B3' },
  { name: 'Dương Thị Sen', age: 16, class: '10C2' },
  { name: 'Tô Văn Tài', age: 18, class: '12A1' },
  { name: 'Lâm Thị Uyên', age: 17, class: '11B1' },
  { name: 'Hồ Văn Vinh', age: 19, class: '12C2' },
  { name: 'Mai Thị Xuân', age: 16, class: '10A2' }
];

async function seedDatabase() {
  try {
    // Kết nối MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully');

    // Xóa dữ liệu cũ (tùy chọn)
    const count = await Student.countDocuments();
    console.log(`Current students in database: ${count}`);
    
    if (count > 0) {
      const readline = require('readline');
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      rl.question('Database already has data. Delete all and reseed? (y/n): ', async (answer) => {
        if (answer.toLowerCase() === 'y') {
          await Student.deleteMany({});
          console.log('Deleted all existing students');
          await insertSampleData();
        } else {
          await insertSampleData();
        }
        rl.close();
      });
    } else {
      await insertSampleData();
    }

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

async function insertSampleData() {
  try {
    // Thêm dữ liệu mẫu
    const result = await Student.insertMany(sampleStudents);
    console.log(`Successfully inserted ${result.length} students`);
    
    // Hiển thị danh sách
    console.log('\nSample students added:');
    result.forEach((student, index) => {
      console.log(`${index + 1}. ${student.name} - ${student.age} tuổi - Lớp ${student.class}`);
    });

    mongoose.connection.close();
    console.log('\nDatabase connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error inserting data:', error);
    process.exit(1);
  }
}

// Chạy seed
seedDatabase();
