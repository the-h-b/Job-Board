'use client'

import DashboardLayout from '@/components/DashboardLayout'
import { useState, useRef } from 'react'
import { 
  FileUp, 
  Upload, 
  Download, 
  CheckCircle, 
  AlertCircle, 
  X,
  FileText,
  Users,
  Building2,
  Briefcase
} from 'lucide-react'
import toast from 'react-hot-toast'

interface UploadResult {
  id: number
  filename: string
  type: 'students' | 'companies' | 'jobs'
  status: 'success' | 'error' | 'processing'
  recordsProcessed: number
  recordsTotal: number
  errors: string[]
  uploadedAt: string
}

export default function BulkUploadPage() {
  const [uploadResults, setUploadResults] = useState<UploadResult[]>([
    {
      id: 1,
      filename: 'students_batch_1.csv',
      type: 'students',
      status: 'success',
      recordsProcessed: 156,
      recordsTotal: 156,
      errors: [],
      uploadedAt: '2024-01-20T10:30:00Z'
    },
    {
      id: 2,
      filename: 'companies_data.xlsx',
      type: 'companies',
      status: 'error',
      recordsProcessed: 23,
      recordsTotal: 45,
      errors: ['Row 12: Invalid email format', 'Row 25: Missing required field "industry"', 'Row 38: Duplicate company name'],
      uploadedAt: '2024-01-19T14:15:00Z'
    },
    {
      id: 3,
      filename: 'jobs_posting.csv',
      type: 'jobs',
      status: 'success',
      recordsProcessed: 89,
      recordsTotal: 89,
      errors: [],
      uploadedAt: '2024-01-18T09:45:00Z'
    }
  ])

  const [dragOver, setDragOver] = useState(false)
  const [selectedType, setSelectedType] = useState<'students' | 'companies' | 'jobs'>('students')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    handleFiles(files)
  }

  const handleFiles = (files: File[]) => {
    files.forEach(file => {
      // Validate file type
      const validTypes = ['.csv', '.xlsx', '.xls']
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
      
      if (!validTypes.includes(fileExtension)) {
        toast.error(`Invalid file type: ${file.name}. Please upload CSV or Excel files only.`)
        return
      }

      // Simulate upload process
      const newUpload: UploadResult = {
        id: Date.now() + Math.random(),
        filename: file.name,
        type: selectedType,
        status: 'processing',
        recordsProcessed: 0,
        recordsTotal: Math.floor(Math.random() * 200) + 50,
        errors: [],
        uploadedAt: new Date().toISOString()
      }

      setUploadResults(prev => [newUpload, ...prev])

      // Simulate processing
      setTimeout(() => {
        const success = Math.random() > 0.3 // 70% success rate
        
        setUploadResults(prev => prev.map(result => 
          result.id === newUpload.id 
            ? {
                ...result,
                status: success ? 'success' : 'error',
                recordsProcessed: success ? result.recordsTotal : Math.floor(result.recordsTotal * 0.6),
                errors: success ? [] : [
                  'Row 5: Invalid email format',
                  'Row 12: Missing required field',
                  'Row 18: Duplicate entry detected'
                ]
              }
            : result
        ))

        toast[success ? 'success' : 'error'](
          success 
            ? `File ${file.name} uploaded successfully!`
            : `File ${file.name} uploaded with errors. Check details below.`
        )
      }, 2000)
    })
  }

  const downloadTemplate = (type: string) => {
    toast.success(`Downloading ${type} template...`)
    // Here you would implement the actual template download
  }

  const deleteUpload = (id: number) => {
    setUploadResults(prev => prev.filter(result => result.id !== id))
    toast.success('Upload record deleted')
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'students': return <Users className="h-5 w-5 text-blue-600" />
      case 'companies': return <Building2 className="h-5 w-5 text-green-600" />
      case 'jobs': return <Briefcase className="h-5 w-5 text-purple-600" />
      default: return <FileText className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800'
      case 'error': return 'bg-red-100 text-red-800'
      case 'processing': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <FileUp className="mr-3 h-8 w-8" />
            Bulk Upload
          </h1>
          <p className="text-gray-600">Upload CSV or Excel files to import data in bulk</p>
        </div>

        {/* Upload Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Upload New File</h2>
          
          {/* Data Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Data Type</label>
            <div className="flex space-x-4">
              {[
                { value: 'students', label: 'Students', icon: Users },
                { value: 'companies', label: 'Companies', icon: Building2 },
                { value: 'jobs', label: 'Jobs', icon: Briefcase }
              ].map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setSelectedType(value as any)}
                  className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${
                    selectedType === value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* File Drop Zone */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragOver 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Drop files here or click to browse
            </h3>
            <p className="text-gray-600 mb-4">
              Supported formats: CSV, Excel (.xlsx, .xls)
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Select Files
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".csv,.xlsx,.xls"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Template Downloads */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Download Templates</h4>
            <div className="flex space-x-3">
              <button
                onClick={() => downloadTemplate('students')}
                className="flex items-center px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Download className="mr-2 h-4 w-4" />
                Students Template
              </button>
              <button
                onClick={() => downloadTemplate('companies')}
                className="flex items-center px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Download className="mr-2 h-4 w-4" />
                Companies Template
              </button>
              <button
                onClick={() => downloadTemplate('jobs')}
                className="flex items-center px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Download className="mr-2 h-4 w-4" />
                Jobs Template
              </button>
            </div>
          </div>
        </div>

        {/* Upload History */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Upload History</h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {uploadResults.map((result) => (
              <div key={result.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="flex-shrink-0 pt-1">
                      {getTypeIcon(result.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="text-sm font-medium text-gray-900">{result.filename}</h4>
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(result.status)}`}>
                          {result.status === 'processing' ? (
                            <>
                              <div className="animate-spin rounded-full h-3 w-3 border-b border-current mr-1"></div>
                              Processing
                            </>
                          ) : (
                            <>
                              {result.status === 'success' ? (
                                <CheckCircle className="mr-1 h-3 w-3" />
                              ) : (
                                <AlertCircle className="mr-1 h-3 w-3" />
                              )}
                              {result.status}
                            </>
                          )}
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                          {result.type}
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-2">
                        {result.recordsProcessed} of {result.recordsTotal} records processed
                      </div>
                      
                      {result.status !== 'processing' && (
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                          <div 
                            className={`h-2 rounded-full ${
                              result.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${(result.recordsProcessed / result.recordsTotal) * 100}%` }}
                          ></div>
                        </div>
                      )}
                      
                      {result.errors.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm font-medium text-red-700 mb-1">Errors:</p>
                          <ul className="text-sm text-red-600 space-y-1">
                            {result.errors.slice(0, 3).map((error, index) => (
                              <li key={index}>• {error}</li>
                            ))}
                            {result.errors.length > 3 && (
                              <li className="text-gray-500">... and {result.errors.length - 3} more</li>
                            )}
                          </ul>
                        </div>
                      )}
                      
                      <div className="text-xs text-gray-500 mt-2">
                        Uploaded on {formatDate(result.uploadedAt)}
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => deleteUpload(result.id)}
                    className="text-red-600 hover:text-red-900 p-1 ml-4"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {uploadResults.length === 0 && (
            <div className="text-center py-12">
              <FileUp className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No uploads yet</h3>
              <p className="mt-1 text-sm text-gray-500">Upload your first file to get started.</p>
            </div>
          )}
        </div>

        {/* Guidelines */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-3">Upload Guidelines</h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>• Maximum file size: 10MB</li>
            <li>• Supported formats: CSV, Excel (.xlsx, .xls)</li>
            <li>• Use the provided templates to ensure proper formatting</li>
            <li>• Duplicate entries will be automatically skipped</li>
            <li>• Large files may take several minutes to process</li>
            <li>• You'll receive a notification when processing is complete</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  )
}