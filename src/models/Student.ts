import mongoose, { Document, Schema } from 'mongoose'

export interface IStudent extends Document {
  userId: mongoose.Types.ObjectId
  personalInfo: {
    firstName: string
    lastName: string
    email: string
    phone?: string
    dateOfBirth?: Date
    gender?: 'Male' | 'Female' | 'Other'
  }
  academicInfo: {
    course: string
    specialization?: string
    year: number
    cgpa?: number
    university: string
    graduationYear: number
  }
  skills: string[]
  experience?: {
    company: string
    position: string
    duration: string
    description?: string
  }[]
  resume?: {
    filename: string
    url: string
    uploadedAt: Date
  }
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const StudentSchema = new Schema<IStudent>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  personalInfo: {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: [50, 'First name cannot be more than 50 characters']
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxlength: [50, 'Last name cannot be more than 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    dateOfBirth: {
      type: Date
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other']
    }
  },
  academicInfo: {
    course: {
      type: String,
      required: [true, 'Course is required'],
      trim: true
    },
    specialization: {
      type: String,
      trim: true
    },
    year: {
      type: Number,
      required: [true, 'Academic year is required'],
      min: 1,
      max: 6
    },
    cgpa: {
      type: Number,
      min: 0,
      max: 10
    },
    university: {
      type: String,
      required: [true, 'University is required'],
      trim: true
    },
    graduationYear: {
      type: Number,
      required: [true, 'Graduation year is required']
    }
  },
  skills: [{
    type: String,
    trim: true
  }],
  experience: [{
    company: {
      type: String,
      required: true,
      trim: true
    },
    position: {
      type: String,
      required: true,
      trim: true
    },
    duration: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    }
  }],
  resume: {
    filename: String,
    url: String,
    uploadedAt: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

// Create indexes
StudentSchema.index({ 'personalInfo.email': 1 })
StudentSchema.index({ 'academicInfo.course': 1 })
StudentSchema.index({ 'academicInfo.graduationYear': 1 })
StudentSchema.index({ skills: 1 })

export default mongoose.models.Student || mongoose.model<IStudent>('Student', StudentSchema)