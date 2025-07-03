'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface CMSContextType {
  isAdmin: boolean
  user: any | null
  notifications: any[]
  onlineUsers: any[]
  contentLocks: any[]
  login: (credentials: any) => Promise<boolean>
  logout: () => void
  markNotificationRead: (id: string) => void
  checkContentLock: (resourceType: string, resourceId: string) => any | null
  acquireContentLock: (resourceType: string, resourceId: string) => Promise<boolean>
  releaseContentLock: (resourceType: string, resourceId: string) => void
}

const CMSContext = createContext<CMSContextType | null>(null)

export function useCMS() {
  const context = useContext(CMSContext)
  if (!context) {
    throw new Error('useCMS must be used within a CMSProvider')
  }
  return context
}

interface CMSProviderProps {
  children: ReactNode
}

export function CMSProvider({ children }: CMSProviderProps) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [notifications, setNotifications] = useState<any[]>([])
  const [onlineUsers, setOnlineUsers] = useState<any[]>([])
  const [contentLocks, setContentLocks] = useState<any[]>([])
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    // Check for existing session
    const savedToken = localStorage.getItem('cms_token')
    if (savedToken) {
      setToken(savedToken)
      validateSession(savedToken)
    }

    // Set up real-time updates
    const interval = setInterval(() => {
      if (isAdmin && token) {
        fetchRealTimeData()
      }
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [isAdmin, token])

  const validateSession = async (sessionToken: string) => {
    try {
      const response = await fetch('/api/admin/auth', {
        headers: {
          'Authorization': `Bearer ${sessionToken}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        setIsAdmin(true)
        fetchRealTimeData()
      } else {
        localStorage.removeItem('cms_token')
        setToken(null)
      }
    } catch (error) {
      console.error('Session validation failed:', error)
      localStorage.removeItem('cms_token')
      setToken(null)
    }
  }

  const fetchRealTimeData = async () => {
    if (!token) return

    try {
      const [notificationsRes, collaborationRes] = await Promise.all([
        fetch('/api/admin/collaboration?type=notifications', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/admin/collaboration?type=sessions', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ])

      if (notificationsRes.ok) {
        const notificationsData = await notificationsRes.json()
        setNotifications(notificationsData.notifications || [])
      }

      if (collaborationRes.ok) {
        const collaborationData = await collaborationRes.json()
        setOnlineUsers(collaborationData.sessions || [])
        setContentLocks(collaborationData.locks || [])
      }
    } catch (error) {
      console.error('Failed to fetch real-time data:', error)
    }
  }

  const login = async (credentials: any): Promise<boolean> => {
    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      })

      if (response.ok) {
        const data = await response.json()
        setToken(data.token)
        setUser(data.user)
        setIsAdmin(true)
        localStorage.setItem('cms_token', data.token)
        
        // Start session tracking
        await fetch('/api/admin/collaboration', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${data.token}`
          },
          body: JSON.stringify({
            type: 'session',
            action: 'start'
          })
        })

        return true
      }
      
      return false
    } catch (error) {
      console.error('Login failed:', error)
      return false
    }
  }

  const logout = async () => {
    try {
      if (token) {
        // End session
        await fetch('/api/admin/collaboration', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            type: 'session',
            action: 'end'
          })
        })
      }
    } catch (error) {
      console.error('Logout cleanup failed:', error)
    } finally {
      setToken(null)
      setUser(null)
      setIsAdmin(false)
      setNotifications([])
      setOnlineUsers([])
      setContentLocks([])
      localStorage.removeItem('cms_token')
    }
  }

  const markNotificationRead = async (id: string) => {
    if (!token) return

    try {
      await fetch('/api/admin/collaboration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          type: 'notification',
          action: 'markRead',
          notificationId: id
        })
      })

      setNotifications(prev => 
        prev.map((notif: any) => 
          notif.id === id ? { ...notif, isRead: true } : notif
        )
      )
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  const checkContentLock = (resourceType: string, resourceId: string) => {
    return contentLocks.find((lock: any) => 
      lock.resourceType === resourceType && lock.resourceId === resourceId
    ) || null
  }

  const acquireContentLock = async (resourceType: string, resourceId: string): Promise<boolean> => {
    if (!token) return false

    try {
      const response = await fetch('/api/admin/collaboration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          type: 'lock',
          action: 'acquire',
          resourceType,
          resourceId
        })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setContentLocks(prev => [...prev, data.lock])
          return true
        }
      }
      
      return false
    } catch (error) {
      console.error('Failed to acquire content lock:', error)
      return false
    }
  }

  const releaseContentLock = async (resourceType: string, resourceId: string) => {
    if (!token) return

    try {
      await fetch('/api/admin/collaboration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          type: 'lock',
          action: 'release',
          resourceType,
          resourceId
        })
      })

      setContentLocks(prev => 
        prev.filter((lock: any) => 
          !(lock.resourceType === resourceType && lock.resourceId === resourceId)
        )
      )
    } catch (error) {
      console.error('Failed to release content lock:', error)
    }
  }

  const contextValue: CMSContextType = {
    isAdmin,
    user,
    notifications,
    onlineUsers,
    contentLocks,
    login,
    logout,
    markNotificationRead,
    checkContentLock,
    acquireContentLock,
    releaseContentLock
  }

  return (
    <CMSContext.Provider value={contextValue}>
      {children}
    </CMSContext.Provider>
  )
}
