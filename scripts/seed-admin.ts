import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

// User interface and schema definition (matching the existing User model)
interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'company' | 'student';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  role: {
    type: String,
    enum: ['admin', 'company', 'student'],
    default: 'student'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

async function createAdminUser(): Promise<void> {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/job-board';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'jobadmin@taiyari24.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists. Updating password...');
      
      // Hash the new password
      const hashedPassword = await bcrypt.hash('job1234', 12);
      
      // Update the existing admin user
      await User.findByIdAndUpdate(existingAdmin._id, {
        password: hashedPassword,
        role: 'admin',
        isActive: true
      });
      
      console.log('Admin user password updated successfully!');
    } else {
      console.log('Creating new admin user...');
      
      // Hash the password
      const hashedPassword = await bcrypt.hash('job1234', 12);
      
      // Create new admin user
      const adminUser = new User({
        name: 'Job Admin',
        email: 'jobadmin@taiyari24.com',
        password: hashedPassword,
        role: 'admin',
        isActive: true
      });
      
      await adminUser.save();
      console.log('Admin user created successfully!');
    }

    console.log('\n=== Admin User Details ===');
    console.log('Email: jobadmin@taiyari24.com');
    console.log('Password: job1234');
    console.log('Role: admin');
    console.log('Status: Active');
    console.log('==========================\n');
    
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the script
createAdminUser();