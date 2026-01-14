import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/user.ts'; // Ensure this matches your filename case
import dotenv from 'dotenv';

dotenv.config();

const seedAdmin = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) throw new Error("MONGO_URI is missing in .env");

    await mongoose.connect(mongoUri);
    console.log('⏳ Connecting to DB to create Admin...');

    // 1. Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@luxeai.com' });
    if (adminExists) {
      console.log('⚠️ Admin already exists in the database.');
      process.exit();
    }

    // 2. Hash the password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // 3. Create the Admin User
    await User.create({
      name: 'System Admin',
      email: 'admin@luxeai.com',
      password: hashedPassword,
      role: 'admin' // This is the key that unlocks the Spike buttons
    });

    console.log('✅ Success: Admin created!');
    console.log('📧 Email: admin@luxeai.com');
    console.log('🔑 Password: admin123');
    
    process.exit();
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
};

seedAdmin();