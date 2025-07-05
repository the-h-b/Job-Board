import mongoose, { Document, Schema } from 'mongoose'

export interface IUser extends Document {
  name: string
  email: string
  password: string
  role: 'admin' | 'company' | 'student'
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>({
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
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
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
})

// Create index for email
UserSchema.index({ email: 1 })

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)