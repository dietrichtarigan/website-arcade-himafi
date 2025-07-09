import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      users: [],
      roles: [],
      stats: {
        totalUsers: 0,
        activeUsers: 0,
        totalRoles: 0
      }
    }
  });
}

export async function POST() {
  return NextResponse.json({
    success: true,
    message: 'Auth operation completed'
  });
}
