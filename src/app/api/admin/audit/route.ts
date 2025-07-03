import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  resourceId: string;
  changes?: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
  metadata?: {
    ip?: string;
    userAgent?: string;
    sessionId?: string;
  };
}

const AUDIT_LOG_FILE = path.join(process.cwd(), 'data', 'audit-logs.json');

async function ensureDataDirectory() {
  const dataDir = path.dirname(AUDIT_LOG_FILE);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

async function readAuditLogs(): Promise<AuditLog[]> {
  try {
    await ensureDataDirectory();
    const data = await fs.readFile(AUDIT_LOG_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeAuditLogs(logs: AuditLog[]): Promise<void> {
  await ensureDataDirectory();
  await fs.writeFile(AUDIT_LOG_FILE, JSON.stringify(logs, null, 2));
}

async function addAuditLog(log: Omit<AuditLog, 'id' | 'timestamp'>): Promise<void> {
  const logs = await readAuditLogs();
  const newLog: AuditLog = {
    id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    ...log
  };
  
  logs.unshift(newLog); // Add to beginning
  
  // Keep only last 1000 logs
  if (logs.length > 1000) {
    logs.splice(1000);
  }
  
  await writeAuditLogs(logs);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const user = searchParams.get('user');
    const action = searchParams.get('action');
    const resource = searchParams.get('resource');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let logs = await readAuditLogs();

    // Apply filters
    if (user) {
      logs = logs.filter(log => log.user.toLowerCase().includes(user.toLowerCase()));
    }
    
    if (action) {
      logs = logs.filter(log => log.action === action);
    }
    
    if (resource) {
      logs = logs.filter(log => log.resource === resource);
    }
    
    if (startDate) {
      const start = new Date(startDate);
      logs = logs.filter(log => new Date(log.timestamp) >= start);
    }
    
    if (endDate) {
      const end = new Date(endDate);
      logs = logs.filter(log => new Date(log.timestamp) <= end);
    }

    // Pagination
    const total = logs.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedLogs = logs.slice(startIndex, endIndex);

    // Statistics
    const stats = {
      totalLogs: total,
      actionCounts: logs.reduce((acc, log) => {
        acc[log.action] = (acc[log.action] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      resourceCounts: logs.reduce((acc, log) => {
        acc[log.resource] = (acc[log.resource] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      userCounts: logs.reduce((acc, log) => {
        acc[log.user] = (acc[log.user] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };

    return NextResponse.json({
      success: true,
      data: {
        logs: paginatedLogs,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: endIndex < total,
          hasPrev: page > 1
        },
        stats
      }
    });

  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch audit logs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user, action, resource, resourceId, changes, metadata } = body;

    if (!user || !action || !resource || !resourceId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await addAuditLog({
      user,
      action,
      resource,
      resourceId,
      changes,
      metadata: {
        ...metadata,
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Audit log created successfully'
    });

  } catch (error) {
    console.error('Error creating audit log:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create audit log' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');

    const logs = await readAuditLogs();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const filteredLogs = logs.filter(log => 
      new Date(log.timestamp) > cutoffDate
    );

    await writeAuditLogs(filteredLogs);

    return NextResponse.json({
      success: true,
      message: `Deleted logs older than ${days} days`,
      deletedCount: logs.length - filteredLogs.length
    });

  } catch (error) {
    console.error('Error cleaning audit logs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to clean audit logs' },
      { status: 500 }
    );
  }
}

// Export function for use in other API routes
export { addAuditLog };
