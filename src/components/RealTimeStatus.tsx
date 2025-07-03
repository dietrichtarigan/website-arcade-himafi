'use client'

import { useState, useEffect, useRef } from 'react'
import { Bell, Users, Lock, AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react'

interface Notification {
  id: string
  userId: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  data?: any
  isRead: boolean
  createdAt: string
  expiresAt?: string
}

interface UserSession {
  id: string
  userId: string
  username: string
  status: 'online' | 'away' | 'busy'
  lastSeen: string
  currentPage?: string
  metadata?: {
    browser?: string
    location?: string
  }
}

interface ContentLock {
  id: string
  resourceType: string
  resourceId: string
  userId: string
  username: string
  lockedAt: string
  expiresAt: string
}

interface RealTimeStatusProps {
  userId: string
  username: string
  className?: string
}

export default function RealTimeStatus({ userId, username, className = '' }: RealTimeStatusProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [sessions, setSessions] = useState<UserSession[]>([])
  const [contentLocks, setContentLocks] = useState<ContentLock[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [showOnlineUsers, setShowOnlineUsers] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Load initial data
    loadAllData()
    
    // Update session status
    updateSession()
    
    // Set up real-time updates every 10 seconds
    intervalRef.current = setInterval(() => {
      loadAllData()
      updateSession()
    }, 10000)

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [userId, username])

  const loadAllData = async () => {
    try {
      const [notificationsRes, sessionsRes, locksRes] = await Promise.all([
        fetch(`/api/admin/collaboration?action=notifications&userId=${userId}`),
        fetch('/api/admin/collaboration?action=sessions'),
        fetch('/api/admin/collaboration?action=content-locks')
      ])

      if (notificationsRes.ok) {
        const notifData = await notificationsRes.json()
        setNotifications(notifData.data.notifications || [])
        setUnreadCount(notifData.data.unreadCount || 0)
      }

      if (sessionsRes.ok) {
        const sessionData = await sessionsRes.json()
        setSessions(sessionData.data.sessions || [])
      }

      if (locksRes.ok) {
        const lockData = await locksRes.json()
        setContentLocks(lockData.data.locks || [])
      }
    } catch (error) {
      console.error('Error loading real-time data:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateSession = async () => {
    try {
      await fetch('/api/admin/collaboration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update-session',
          userId,
          username,
          status: 'online',
          currentPage: window.location.pathname,
          metadata: {
            browser: navigator.userAgent.split(' ').pop()?.split('/')[0] || 'Unknown',
            location: window.location.hostname
          }
        })
      })
    } catch (error) {
      console.error('Error updating session:', error)
    }
  }

  const markNotificationRead = async (notificationId: string) => {
    try {
      const response = await fetch('/api/admin/collaboration', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'mark-notification-read',
          id: notificationId
        })
      })

      if (response.ok) {
        setNotifications(prev => 
          prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
        )
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const markAllRead = async () => {
    try {
      const response = await fetch('/api/admin/collaboration', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'mark-all-read',
          userId
        })
      })

      if (response.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
        setUnreadCount(0)
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-500" />
      case 'error': return <XCircle className="w-5 h-5 text-red-500" />
      default: return <Info className="w-5 h-5 text-blue-500" />
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffMinutes < 1) return 'Baru saja'
    if (diffMinutes < 60) return `${diffMinutes} menit lalu`
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} jam lalu`
    return `${Math.floor(diffMinutes / 1440)} hari lalu`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-400'
      case 'away': return 'bg-yellow-400'
      case 'busy': return 'bg-red-400'
      default: return 'bg-gray-400'
    }
  }

  const onlineUsers = sessions.filter(s => s.status === 'online')

  if (loading) {
    return (
      <div className={`flex items-center space-x-4 ${className}`}>
        <div className="animate-pulse flex space-x-2">
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      {/* Notifications */}
      <div className="relative">
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative p-2 text-gray-600 hover:text-gray-900 transition"
        >
          <Bell className="w-6 h-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {showNotifications && (
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Notifications</h3>
                <div className="flex space-x-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      Mark all read
                    </button>
                  )}
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No notifications
                </div>
              ) : (
                notifications.slice(0, 10).map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
                      !notification.isRead ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => markNotificationRead(notification.id)}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-3">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {formatTimeAgo(notification.createdAt)}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Online Users */}
      <div className="relative">
        <button
          onClick={() => setShowOnlineUsers(!showOnlineUsers)}
          className="relative p-2 text-gray-600 hover:text-gray-900 transition"
        >
          <Users className="w-6 h-6" />
          {onlineUsers.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {onlineUsers.length}
            </span>
          )}
        </button>

        {showOnlineUsers && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border z-50">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Online Users</h3>
                <button
                  onClick={() => setShowOnlineUsers(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="max-h-64 overflow-y-auto">
              {onlineUsers.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No users online
                </div>
              ) : (
                onlineUsers.map((session) => (
                  <div key={session.id} className="p-3 border-b hover:bg-gray-50">
                    <div className="flex items-center">
                      <div className="relative">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {session.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div
                          className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(session.status)}`}
                        ></div>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {session.username}
                        </p>
                        <p className="text-xs text-gray-500">
                          {session.currentPage || 'Unknown page'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Content Locks */}
      {contentLocks.length > 0 && (
        <div className="relative">
          <div className="p-2 text-yellow-600">
            <Lock className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {contentLocks.length}
            </span>
          </div>
        </div>
      )}

      {/* Connection Status */}
      <div className="flex items-center">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span className="ml-2 text-xs text-gray-500">Connected</span>
      </div>
    </div>
  )
}

// Hook for managing content locks
export function useContentLock(resourceType: string, resourceId: string, userId: string, username: string) {
  const [isLocked, setIsLocked] = useState(false)
  const [lockInfo, setLockInfo] = useState<ContentLock | null>(null)
  const [myLock, setMyLock] = useState<ContentLock | null>(null)

  const acquireLock = async () => {
    try {
      const response = await fetch('/api/admin/collaboration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'acquire-lock',
          resourceType,
          resourceId,
          userId,
          username
        })
      })

      const result = await response.json()
      
      if (result.success) {
        setMyLock(result.data.lock)
        setIsLocked(false)
        return true
      } else {
        setLockInfo(result.data?.lock || null)
        setIsLocked(true)
        return false
      }
    } catch (error) {
      console.error('Error acquiring lock:', error)
      return false
    }
  }

  const releaseLock = async () => {
    if (!myLock) return

    try {
      const response = await fetch(`/api/admin/collaboration?action=release-lock&id=${myLock.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setMyLock(null)
        setIsLocked(false)
        setLockInfo(null)
      }
    } catch (error) {
      console.error('Error releasing lock:', error)
    }
  }

  const extendLock = async () => {
    if (!myLock) return

    try {
      const response = await fetch('/api/admin/collaboration', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'extend-lock',
          id: myLock.id
        })
      })

      if (response.ok) {
        const result = await response.json()
        setMyLock(result.data.lock)
      }
    } catch (error) {
      console.error('Error extending lock:', error)
    }
  }

  return {
    isLocked,
    lockInfo,
    myLock,
    acquireLock,
    releaseLock,
    extendLock
  }
}
