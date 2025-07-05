<<<<<<< HEAD
import mongoose from 'mongoose' 
=======
import mongoose from 'mongoose'
import StudentModel from '@/models/Student' 
import UserModel from '@/models/User' 
import ApplicationModel from '@/models/Application' 
>>>>>>> d812608e635416e23ef7d69734ee6dd6ad7fdefb


interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  var mongoose: MongooseCache | undefined
}

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  console.warn('MONGODB_URI is not defined. Database operations will fail.')
  // During build time, we might not have a database connection
  // This prevents the build from failing due to missing env vars
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function dbConnect() {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined. Please check your environment variables.')
  }

  if (cached?.conn) {
    return cached.conn
  }

  if (!cached!.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
    }

    cached!.promise = mongoose.connect(MONGODB_URI, opts)
      .then((m) => {
<<<<<<< HEAD
=======

>>>>>>> d812608e635416e23ef7d69734ee6dd6ad7fdefb
        return m
      })
  }

  try {
    cached!.conn = await cached!.promise
  } catch (e) {
    cached!.promise = null
    throw e
  }

  return cached!.conn
}

export default dbConnect