import mongoose, { Document, Schema } from 'mongoose'

export interface ICompany extends Document {
  name: string
  email: string
  website?: string
  description?: string
  industry: string
  location: string
  logoUrl?: string
  contactPerson: {
    name: string
    email: string
    phone?: string
  }
  isActive: boolean
  createdBy: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const CompanySchema = new Schema<ICompany>({
  name: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    maxlength: [200, 'Company name cannot be more than 200 characters']
  },
  email: {
    type: String,
    required: [true, 'Company email is required'],
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  website: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  industry: {
    type: String,
    required: [true, 'Industry is required'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  logoUrl: {
    type: String,
    trim: true
  },
  contactPerson: {
    name: {
      type: String,
      required: [true, 'Contact person name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Contact person email is required'],
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    }
  },
  isActive: {
    type: Boolean,
    default: true
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
CompanySchema.index({ name: 1 })
CompanySchema.index({ email: 1 })
CompanySchema.index({ industry: 1 })
CompanySchema.index({ location: 1 })

export default mongoose.models.Company || mongoose.model<ICompany>('Company', CompanySchema)