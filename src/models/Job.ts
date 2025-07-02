import mongoose, { Document, Schema } from 'mongoose'

export interface IJob extends Document {
  title: string
  company: mongoose.Types.ObjectId
  description: string
  requirements: string[]
  location: string
  jobType: 'Full-time' | 'Part-time' | 'Contract' | 'Internship'
  experienceLevel: 'Entry Level' | 'Mid Level' | 'Senior Level' | 'Executive'
  salary?: {
    min: number
    max: number
    currency: string
    period: 'Hourly' | 'Monthly' | 'Yearly'
  }
  skills: string[]
  benefits?: string[]
  applicationDeadline?: Date
  isActive: boolean
  applicationsCount: number
  createdBy: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const JobSchema = new Schema<IJob>({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
    maxlength: [200, 'Job title cannot be more than 200 characters']
  },
  company: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: [true, 'Company is required']
  },
  description: {
    type: String,
    required: [true, 'Job description is required'],
    maxlength: [5000, 'Description cannot be more than 5000 characters']
  },
  requirements: [{
    type: String,
    trim: true
  }],
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  jobType: {
    type: String,
    required: [true, 'Job type is required'],
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship']
  },
  experienceLevel: {
    type: String,
    required: [true, 'Experience level is required'],
    enum: ['Entry Level', 'Mid Level', 'Senior Level', 'Executive']
  },
  salary: {
    min: {
      type: Number,
      min: 0
    },
    max: {
      type: Number,
      min: 0
    },
    currency: {
      type: String,
      default: 'INR'
    },
    period: {
      type: String,
      enum: ['Hourly', 'Monthly', 'Yearly'],
      default: 'Yearly'
    }
  },
  skills: [{
    type: String,
    trim: true
  }],
  benefits: [{
    type: String,
    trim: true
  }],
  applicationDeadline: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  applicationsCount: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

// Create indexes
JobSchema.index({ title: 1 })
JobSchema.index({ company: 1 })
JobSchema.index({ location: 1 })
JobSchema.index({ jobType: 1 })
JobSchema.index({ experienceLevel: 1 })
JobSchema.index({ skills: 1 })
JobSchema.index({ isActive: 1 })
JobSchema.index({ createdAt: -1 })

export default mongoose.models.Job || mongoose.model<IJob>('Job', JobSchema)