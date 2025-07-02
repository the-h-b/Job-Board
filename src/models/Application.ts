import mongoose, { Document, Schema } from 'mongoose'

export interface IApplication extends Document {
  job: mongoose.Types.ObjectId
  student: mongoose.Types.ObjectId
  status: 'Applied' | 'Under Review' | 'Shortlisted' | 'Interviewed' | 'Offered' | 'Rejected' | 'Withdrawn'
  coverLetter?: string
  appliedAt: Date
  statusUpdatedAt: Date
  notes?: string
  createdAt: Date
  updatedAt: Date
}

const ApplicationSchema = new Schema<IApplication>({
  job: {
    type: Schema.Types.ObjectId,
    ref: 'Job',
    required: [true, 'Job is required']
  },
  student: {
    type: Schema.Types.ObjectId,
    ref: 'Student',
    required: [true, 'Student is required']
  },
  status: {
    type: String,
    enum: ['Applied', 'Under Review', 'Shortlisted', 'Interviewed', 'Offered', 'Rejected', 'Withdrawn'],
    default: 'Applied'
  },
  coverLetter: {
    type: String,
    maxlength: [2000, 'Cover letter cannot be more than 2000 characters']
  },
  appliedAt: {
    type: Date,
    default: Date.now
  },
  statusUpdatedAt: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot be more than 1000 characters']
  }
}, {
  timestamps: true
})

// Compound index to ensure one application per student per job
ApplicationSchema.index({ job: 1, student: 1 }, { unique: true })

// Other indexes
ApplicationSchema.index({ status: 1 })
ApplicationSchema.index({ appliedAt: -1 })
ApplicationSchema.index({ student: 1 })
ApplicationSchema.index({ job: 1 })

export default mongoose.models.Application || mongoose.model<IApplication>('Application', ApplicationSchema)