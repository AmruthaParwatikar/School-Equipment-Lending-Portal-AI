import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';
import Equipment from './src/models/Equipment.js';
import Loan from './src/models/Loan.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Equipment.deleteMany();
    await Loan.deleteMany();

    // Create users
    const hashedPassword = await bcrypt.hash('pass123', 10);

    const users = await User.insertMany([
      { name: 'Admin User', email: 'admin@school.edu', passwordHash: await bcrypt.hash('admin123',10), role: 'admin' },
      { name: 'Alice', email: 'alice@school.edu', passwordHash: hashedPassword, role: 'student' },
      { name: 'Bob', email: 'bob@school.edu', passwordHash: hashedPassword, role: 'staff' }
    ]);

    console.log('Users seeded');

    // Create equipment
    const equipment = await Equipment.insertMany([
      { name: 'Microscope', category: 'Lab', condition: 'Good', quantity: 5, available: 5 },
      { name: 'Camera', category: 'Photography', condition: 'Excellent', quantity: 3, available: 3 },
      { name: 'Guitar', category: 'Music', condition: 'Good', quantity: 2, available: 2 },
    ]);

    console.log('Equipment seeded');

    // Create loans
    const loans = await Loan.insertMany([
      { userId: users[1]._id, equipmentId: equipment[0]._id, quantity: 1, dueDate: new Date('2025-12-31'), status: 'approved' },
      { userId: users[2]._id, equipmentId: equipment[1]._id, quantity: 1, dueDate: new Date('2025-12-25'), status: 'approved' },
    ]);

    console.log('Loans seeded');

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

connectDB().then(seedData);
