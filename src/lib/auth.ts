import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'

export interface AuthenticatedUser {
  userId: string
  email: string
  role: 'admin' | 'company' | 'student'
}

export function verifyToken(token: string): AuthenticatedUser | null {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    return {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    }
  } catch (error) {
    return null
  }
}

export function getAuthUserFromRequest(request: NextRequest): AuthenticatedUser | null {
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  return verifyToken(token)
}

export function requireAuth(allowedRoles: string[] = []) {
  return (handler: (request: NextRequest, user: AuthenticatedUser) => Promise<Response>) => {
    return async (request: NextRequest) => {
      const user = getAuthUserFromRequest(request)
      
      if (!user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return new Response(JSON.stringify({ error: 'Forbidden' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      return handler(request, user)
    }
  }
}