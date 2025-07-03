import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

interface Notification {
  id: string;
  userId: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: string;
  expiresAt?: string;
}

interface UserSession {
  id: string;
  userId: string;
  username: string;
  status: 'online' | 'away' | 'busy';
  lastSeen: string;
  currentPage?: string;
  metadata?: {
    browser?: string;
    location?: string;
  };
}

interface ContentLock {
  id: string;
  resourceType: string;
  resourceId: string;
  userId: string;
  username: string;
  lockedAt: string;
  expiresAt: string;
}

const NOTIFICATIONS_FILE = path.join(process.cwd(), 'data', 'notifications.json');
const SESSIONS_FILE = path.join(process.cwd(), 'data', 'sessions.json');
const LOCKS_FILE = path.join(process.cwd(), 'data', 'content-locks.json');

async function ensureDataDirectory() {
  const dataDir = path.dirname(NOTIFICATIONS_FILE);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

async function readNotifications(): Promise<Notification[]> {
  try {
    await ensureDataDirectory();
    const data = await fs.readFile(NOTIFICATIONS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeNotifications(notifications: Notification[]): Promise<void> {
  await ensureDataDirectory();
  await fs.writeFile(NOTIFICATIONS_FILE, JSON.stringify(notifications, null, 2));
}

async function readSessions(): Promise<UserSession[]> {
  try {
    await ensureDataDirectory();
    const data = await fs.readFile(SESSIONS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeSessions(sessions: UserSession[]): Promise<void> {
  await ensureDataDirectory();
  await fs.writeFile(SESSIONS_FILE, JSON.stringify(sessions, null, 2));
}

async function readContentLocks(): Promise<ContentLock[]> {
  try {
    await ensureDataDirectory();
    const data = await fs.readFile(LOCKS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeContentLocks(locks: ContentLock[]): Promise<void> {
  await ensureDataDirectory();
  await fs.writeFile(LOCKS_FILE, JSON.stringify(locks, null, 2));
}

// Clean up expired items
async function cleanup() {
  const now = new Date();

  // Clean expired notifications
  const notifications = await readNotifications();
  const activeNotifications = notifications.filter(n => 
    !n.expiresAt || new Date(n.expiresAt) > now
  );
  if (activeNotifications.length !== notifications.length) {
    await writeNotifications(activeNotifications);
  }

  // Clean expired sessions (older than 30 minutes)
  const sessions = await readSessions();
  const activeSessions = sessions.filter(s => {
    const lastSeen = new Date(s.lastSeen);
    const diffMinutes = (now.getTime() - lastSeen.getTime()) / (1000 * 60);
    return diffMinutes < 30;
  });
  if (activeSessions.length !== sessions.length) {
    await writeSessions(activeSessions);
  }

  // Clean expired content locks
  const locks = await readContentLocks();
  const activeLocks = locks.filter(l => new Date(l.expiresAt) > now);
  if (activeLocks.length !== locks.length) {
    await writeContentLocks(activeLocks);
  }
}

export async function GET(request: NextRequest) {
  try {
    await cleanup();
    
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const userId = searchParams.get('userId');

    if (action === 'notifications') {
      if (!userId) {
        return NextResponse.json(
          { success: false, error: 'User ID is required' },
          { status: 400 }
        );
      }

      const notifications = await readNotifications();
      const userNotifications = notifications
        .filter(n => n.userId === userId || n.userId === 'all')
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      const unreadCount = userNotifications.filter(n => !n.isRead).length;

      return NextResponse.json({
        success: true,
        data: {
          notifications: userNotifications,
          unreadCount
        }
      });
    }

    if (action === 'sessions') {
      const sessions = await readSessions();
      const onlineUsers = sessions.filter(s => s.status === 'online');

      return NextResponse.json({
        success: true,
        data: {
          sessions: sessions,
          onlineUsers: onlineUsers,
          onlineCount: onlineUsers.length
        }
      });
    }

    if (action === 'content-locks') {
      const resourceType = searchParams.get('resourceType');
      const resourceId = searchParams.get('resourceId');

      const locks = await readContentLocks();
      let filteredLocks = locks;

      if (resourceType) {
        filteredLocks = filteredLocks.filter(l => l.resourceType === resourceType);
      }

      if (resourceId) {
        filteredLocks = filteredLocks.filter(l => l.resourceId === resourceId);
      }

      return NextResponse.json({
        success: true,
        data: { locks: filteredLocks }
      });
    }

    if (action === 'realtime-status') {
      const [notifications, sessions, locks] = await Promise.all([
        readNotifications(),
        readSessions(),
        readContentLocks()
      ]);

      const userNotifications = userId ? 
        notifications.filter(n => n.userId === userId || n.userId === 'all') : [];

      return NextResponse.json({
        success: true,
        data: {
          unreadNotifications: userNotifications.filter(n => !n.isRead).length,
          onlineUsers: sessions.filter(s => s.status === 'online').length,
          activeLocks: locks.length,
          lastUpdate: new Date().toISOString()
        }
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action'
    }, { status: 400 });

  } catch (error) {
    console.error('Error in collaboration API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'create-notification') {
      const { userId, type, title, message, data, expiresAt } = body;

      if (!userId || !type || !title || !message) {
        return NextResponse.json(
          { success: false, error: 'Missing required fields' },
          { status: 400 }
        );
      }

      const notifications = await readNotifications();
      const newNotification: Notification = {
        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        type,
        title,
        message,
        data,
        isRead: false,
        createdAt: new Date().toISOString(),
        expiresAt
      };

      notifications.unshift(newNotification);
      
      // Keep only last 100 notifications per user
      const userNotifications = notifications.filter(n => n.userId === userId);
      if (userNotifications.length > 100) {
        const toRemove = userNotifications.slice(100);
        const filteredNotifications = notifications.filter(n => 
          !toRemove.some(r => r.id === n.id)
        );
        await writeNotifications(filteredNotifications);
      } else {
        await writeNotifications(notifications);
      }

      return NextResponse.json({
        success: true,
        data: { notification: newNotification }
      });
    }

    if (action === 'update-session') {
      const { userId, username, status, currentPage, metadata } = body;

      if (!userId || !username) {
        return NextResponse.json(
          { success: false, error: 'User ID and username are required' },
          { status: 400 }
        );
      }

      const sessions = await readSessions();
      const existingSessionIndex = sessions.findIndex(s => s.userId === userId);

      const sessionData: UserSession = {
        id: existingSessionIndex >= 0 ? sessions[existingSessionIndex].id : 
            `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        username,
        status: status || 'online',
        lastSeen: new Date().toISOString(),
        currentPage,
        metadata
      };

      if (existingSessionIndex >= 0) {
        sessions[existingSessionIndex] = sessionData;
      } else {
        sessions.push(sessionData);
      }

      await writeSessions(sessions);

      return NextResponse.json({
        success: true,
        data: { session: sessionData }
      });
    }

    if (action === 'acquire-lock') {
      const { resourceType, resourceId, userId, username } = body;

      if (!resourceType || !resourceId || !userId || !username) {
        return NextResponse.json(
          { success: false, error: 'Missing required fields' },
          { status: 400 }
        );
      }

      const locks = await readContentLocks();
      
      // Check if resource is already locked by someone else
      const existingLock = locks.find(l => 
        l.resourceType === resourceType && 
        l.resourceId === resourceId && 
        l.userId !== userId &&
        new Date(l.expiresAt) > new Date()
      );

      if (existingLock) {
        return NextResponse.json({
          success: false,
          error: 'Resource is locked by another user',
          data: { lock: existingLock }
        }, { status: 409 });
      }

      // Remove any existing locks by this user for this resource
      const filteredLocks = locks.filter(l => 
        !(l.resourceType === resourceType && l.resourceId === resourceId && l.userId === userId)
      );

      // Create new lock (30 minutes duration)
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 30);

      const newLock: ContentLock = {
        id: `lock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        resourceType,
        resourceId,
        userId,
        username,
        lockedAt: new Date().toISOString(),
        expiresAt: expiresAt.toISOString()
      };

      filteredLocks.push(newLock);
      await writeContentLocks(filteredLocks);

      return NextResponse.json({
        success: true,
        data: { lock: newLock }
      });
    }

    if (action === 'broadcast-notification') {
      const { type, title, message, data, expiresAt } = body;

      if (!type || !title || !message) {
        return NextResponse.json(
          { success: false, error: 'Missing required fields' },
          { status: 400 }
        );
      }

      const notifications = await readNotifications();
      const broadcastNotification: Notification = {
        id: `broadcast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: 'all', // Special user ID for broadcast
        type,
        title,
        message,
        data,
        isRead: false,
        createdAt: new Date().toISOString(),
        expiresAt
      };

      notifications.unshift(broadcastNotification);
      await writeNotifications(notifications);

      return NextResponse.json({
        success: true,
        data: { notification: broadcastNotification }
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action'
    }, { status: 400 });

  } catch (error) {
    console.error('Error in collaboration API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, id } = body;

    if (action === 'mark-notification-read') {
      if (!id) {
        return NextResponse.json(
          { success: false, error: 'Notification ID is required' },
          { status: 400 }
        );
      }

      const notifications = await readNotifications();
      const notificationIndex = notifications.findIndex(n => n.id === id);

      if (notificationIndex === -1) {
        return NextResponse.json(
          { success: false, error: 'Notification not found' },
          { status: 404 }
        );
      }

      notifications[notificationIndex].isRead = true;
      await writeNotifications(notifications);

      return NextResponse.json({
        success: true,
        data: { notification: notifications[notificationIndex] }
      });
    }

    if (action === 'mark-all-read') {
      const { userId } = body;

      if (!userId) {
        return NextResponse.json(
          { success: false, error: 'User ID is required' },
          { status: 400 }
        );
      }

      const notifications = await readNotifications();
      let updatedCount = 0;

      notifications.forEach(notification => {
        if ((notification.userId === userId || notification.userId === 'all') && !notification.isRead) {
          notification.isRead = true;
          updatedCount++;
        }
      });

      await writeNotifications(notifications);

      return NextResponse.json({
        success: true,
        data: { updatedCount }
      });
    }

    if (action === 'extend-lock') {
      if (!id) {
        return NextResponse.json(
          { success: false, error: 'Lock ID is required' },
          { status: 400 }
        );
      }

      const locks = await readContentLocks();
      const lockIndex = locks.findIndex(l => l.id === id);

      if (lockIndex === -1) {
        return NextResponse.json(
          { success: false, error: 'Lock not found' },
          { status: 404 }
        );
      }

      // Extend lock by 30 minutes
      const newExpiresAt = new Date();
      newExpiresAt.setMinutes(newExpiresAt.getMinutes() + 30);
      locks[lockIndex].expiresAt = newExpiresAt.toISOString();

      await writeContentLocks(locks);

      return NextResponse.json({
        success: true,
        data: { lock: locks[lockIndex] }
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action'
    }, { status: 400 });

  } catch (error) {
    console.error('Error in collaboration API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const id = searchParams.get('id');

    if (action === 'release-lock') {
      if (!id) {
        return NextResponse.json(
          { success: false, error: 'Lock ID is required' },
          { status: 400 }
        );
      }

      const locks = await readContentLocks();
      const filteredLocks = locks.filter(l => l.id !== id);

      if (filteredLocks.length === locks.length) {
        return NextResponse.json(
          { success: false, error: 'Lock not found' },
          { status: 404 }
        );
      }

      await writeContentLocks(filteredLocks);

      return NextResponse.json({
        success: true,
        message: 'Lock released successfully'
      });
    }

    if (action === 'delete-notification') {
      if (!id) {
        return NextResponse.json(
          { success: false, error: 'Notification ID is required' },
          { status: 400 }
        );
      }

      const notifications = await readNotifications();
      const filteredNotifications = notifications.filter(n => n.id !== id);

      if (filteredNotifications.length === notifications.length) {
        return NextResponse.json(
          { success: false, error: 'Notification not found' },
          { status: 404 }
        );
      }

      await writeNotifications(filteredNotifications);

      return NextResponse.json({
        success: true,
        message: 'Notification deleted successfully'
      });
    }

    if (action === 'clear-old-notifications') {
      const { userId, days = 30 } = request.url.includes('userId=') ? 
        Object.fromEntries(new URLSearchParams(request.url.split('?')[1])) : {};

      const notifications = await readNotifications();
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - parseInt(days as string));

      let filteredNotifications = notifications.filter(n => 
        new Date(n.createdAt) > cutoffDate
      );

      if (userId) {
        // Only clear for specific user
        const userNotifications = notifications.filter(n => n.userId === userId);
        const oldUserNotifications = userNotifications.filter(n => 
          new Date(n.createdAt) <= cutoffDate
        );
        
        filteredNotifications = notifications.filter(n => 
          !oldUserNotifications.some(old => old.id === n.id)
        );
      }

      await writeNotifications(filteredNotifications);

      return NextResponse.json({
        success: true,
        message: `Cleared notifications older than ${days} days`,
        deletedCount: notifications.length - filteredNotifications.length
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action'
    }, { status: 400 });

  } catch (error) {
    console.error('Error in collaboration API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
