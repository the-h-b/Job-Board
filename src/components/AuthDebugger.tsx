'use client'

import { useEffect, useState } from 'react'

interface DecodedToken {
  userId: string
  email: string
  role: string
  exp: number
}

export default function AuthDebugger() {
  const [authInfo, setAuthInfo] = useState<{
    hasToken: boolean
    token: string | null
    decodedToken: DecodedToken | null
  }>({
    hasToken: false,
    token: null,
    decodedToken: null
  })

  useEffect(() => {
    const token = localStorage.getItem('taiyari24_token')
    let decodedToken = null
    
    if (token) {
      try {
        // Simple base64 decode of JWT payload (without verification)
        const parts = token.split('.')
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]))
          decodedToken = payload
        }
      } catch (e) {
        console.error('Error decoding token:', e)
      }
    }

    setAuthInfo({
      hasToken: !!token,
      token,
      decodedToken
    })
  }, [])

  return (
    <div className="fixed top-4 right-4 bg-gray-100 p-4 rounded-lg max-w-sm z-50 text-sm">
      <h3 className="font-bold mb-2">Auth Debug Info</h3>
      <div className="space-y-2">
        <div>
          <strong>Has Token:</strong> {authInfo.hasToken ? 'Yes' : 'No'}
        </div>
        {authInfo.decodedToken && (
          <>
            <div>
              <strong>User ID:</strong> {authInfo.decodedToken.userId}
            </div>
            <div>
              <strong>Email:</strong> {authInfo.decodedToken.email}
            </div>
            <div>
              <strong>Role:</strong> {authInfo.decodedToken.role}
            </div>
            <div>
              <strong>Expires:</strong> {new Date(authInfo.decodedToken.exp * 1000).toLocaleString()}
            </div>
            <div>
              <strong>Expired:</strong> {authInfo.decodedToken.exp * 1000 < Date.now() ? 'Yes' : 'No'}
            </div>
          </>
        )}
      </div>
    </div>
  )
}