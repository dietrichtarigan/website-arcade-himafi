import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: string;
  permissions: string[];
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
  metadata?: {
    fullName?: string;
    avatar?: string;
    department?: string;
  };
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isSystem: boolean;
  createdAt: string;
}

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');
const ROLES_FILE = path.join(process.cwd(), 'data', 'roles.json');

// Default permissions
const DEFAULT_PERMISSIONS = [
  'content.view',
  'content.create',
  'content.edit',
  'content.delete',
  'content.publish',
  'media.view',
  'media.upload',
  'media.delete',
  'analytics.view',
  'users.view',
  'users.create',
  'users.edit',
  'users.delete',
  'roles.view',
  'roles.create',
  'roles.edit',
  'roles.delete',
  'audit.view',
  'system.deploy',
  'system.settings'
];

// Default roles
const DEFAULT_ROLES: Role[] = [
  {
    id: 'admin',
    name: 'Administrator',
    description: 'Full system access',
    permissions: DEFAULT_PERMISSIONS,
    isSystem: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'editor',
    name: 'Content Editor',
    description: 'Can manage content and media',
    permissions: [
      'content.view',
      'content.create',
      'content.edit',
      'content.publish',
      'media.view',
      'media.upload',
      'analytics.view'
    ],
    isSystem: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'contributor',
    name: 'Contributor',
    description: 'Can create and edit own content',
    permissions: [
      'content.view',
      'content.create',
      'content.edit',
      'media.view',
      'media.upload'
    ],
    isSystem: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'viewer',
    name: 'Viewer',
    description: 'Read-only access',
    permissions: [
      'content.view',
      'media.view',
      'analytics.view'
    ],
    isSystem: true,
    createdAt: new Date().toISOString()
  }
];

async function ensureDataDirectory() {
  const dataDir = path.dirname(USERS_FILE);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

async function readUsers(): Promise<User[]> {
  try {
    await ensureDataDirectory();
    const data = await fs.readFile(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    // Create default admin user
    const defaultUser: User = {
      id: 'admin',
      username: 'admin',
      email: 'admin@arcade.himafi.com',
      password: await bcrypt.hash('admin123', 10),
      role: 'admin',
      permissions: DEFAULT_PERMISSIONS,
      isActive: true,
      createdAt: new Date().toISOString(),
      metadata: {
        fullName: 'System Administrator'
      }
    };
    await writeUsers([defaultUser]);
    return [defaultUser];
  }
}

async function writeUsers(users: User[]): Promise<void> {
  await ensureDataDirectory();
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
}

async function readRoles(): Promise<Role[]> {
  try {
    await ensureDataDirectory();
    const data = await fs.readFile(ROLES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    await writeRoles(DEFAULT_ROLES);
    return DEFAULT_ROLES;
  }
}

async function writeRoles(roles: Role[]): Promise<void> {
  await ensureDataDirectory();
  await fs.writeFile(ROLES_FILE, JSON.stringify(roles, null, 2));
}

function hasPermission(userPermissions: string[], requiredPermission: string): boolean {
  return userPermissions.includes(requiredPermission) || userPermissions.includes('*');
}

function generateToken(user: Omit<User, 'password'>): string {
  return jwt.sign(
    { 
      userId: user.id, 
      username: user.username, 
      role: user.role,
      permissions: user.permissions 
    },
    process.env.JWT_SECRET || 'default-secret',
    { expiresIn: '24h' }
  );
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'users') {
      const users = await readUsers();
      const safeUsers = users.map(({ password, ...user }) => user);
      return NextResponse.json({
        success: true,
        data: { users: safeUsers }
      });
    }

    if (action === 'roles') {
      const roles = await readRoles();
      return NextResponse.json({
        success: true,
        data: { roles }
      });
    }

    if (action === 'permissions') {
      return NextResponse.json({
        success: true,
        data: { permissions: DEFAULT_PERMISSIONS }
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action'
    }, { status: 400 });

  } catch (error) {
    console.error('Error in auth API:', error);
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

    if (action === 'login') {
      const { username, password } = body;
      
      if (!username || !password) {
        return NextResponse.json(
          { success: false, error: 'Username and password are required' },
          { status: 400 }
        );
      }

      const users = await readUsers();
      const user = users.find(u => u.username === username || u.email === username);

      if (!user || !user.isActive) {
        return NextResponse.json(
          { success: false, error: 'Invalid credentials' },
          { status: 401 }
        );
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return NextResponse.json(
          { success: false, error: 'Invalid credentials' },
          { status: 401 }
        );
      }

      // Update last login
      user.lastLogin = new Date().toISOString();
      await writeUsers(users);

      const { password: _, ...safeUser } = user;
      const token = generateToken(safeUser);

      return NextResponse.json({
        success: true,
        data: {
          user: safeUser,
          token
        }
      });
    }

    if (action === 'create-user') {
      const { username, email, password, role, metadata } = body;
      
      if (!username || !email || !password || !role) {
        return NextResponse.json(
          { success: false, error: 'Missing required fields' },
          { status: 400 }
        );
      }

      const users = await readUsers();
      const roles = await readRoles();

      // Check if user already exists
      if (users.find(u => u.username === username || u.email === email)) {
        return NextResponse.json(
          { success: false, error: 'User already exists' },
          { status: 409 }
        );
      }

      // Validate role
      const userRole = roles.find(r => r.id === role);
      if (!userRole) {
        return NextResponse.json(
          { success: false, error: 'Invalid role' },
          { status: 400 }
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser: User = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        username,
        email,
        password: hashedPassword,
        role,
        permissions: userRole.permissions,
        isActive: true,
        createdAt: new Date().toISOString(),
        metadata
      };

      users.push(newUser);
      await writeUsers(users);

      const { password: _, ...safeUser } = newUser;
      return NextResponse.json({
        success: true,
        data: { user: safeUser }
      });
    }

    if (action === 'create-role') {
      const { name, description, permissions } = body;
      
      if (!name || !permissions || !Array.isArray(permissions)) {
        return NextResponse.json(
          { success: false, error: 'Missing required fields' },
          { status: 400 }
        );
      }

      const roles = await readRoles();

      // Check if role already exists
      if (roles.find(r => r.name.toLowerCase() === name.toLowerCase())) {
        return NextResponse.json(
          { success: false, error: 'Role already exists' },
          { status: 409 }
        );
      }

      const newRole: Role = {
        id: `role_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name,
        description: description || '',
        permissions,
        isSystem: false,
        createdAt: new Date().toISOString()
      };

      roles.push(newRole);
      await writeRoles(roles);

      return NextResponse.json({
        success: true,
        data: { role: newRole }
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action'
    }, { status: 400 });

  } catch (error) {
    console.error('Error in auth API:', error);
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

    if (action === 'update-user') {
      const { username, email, role, isActive, metadata, password } = body;
      
      if (!id) {
        return NextResponse.json(
          { success: false, error: 'User ID is required' },
          { status: 400 }
        );
      }

      const users = await readUsers();
      const userIndex = users.findIndex(u => u.id === id);

      if (userIndex === -1) {
        return NextResponse.json(
          { success: false, error: 'User not found' },
          { status: 404 }
        );
      }

      const user = users[userIndex];

      // Update fields
      if (username) user.username = username;
      if (email) user.email = email;
      if (role) {
        const roles = await readRoles();
        const userRole = roles.find(r => r.id === role);
        if (userRole) {
          user.role = role;
          user.permissions = userRole.permissions;
        }
      }
      if (typeof isActive === 'boolean') user.isActive = isActive;
      if (metadata) user.metadata = { ...user.metadata, ...metadata };
      if (password) user.password = await bcrypt.hash(password, 10);

      await writeUsers(users);

      const { password: _, ...safeUser } = user;
      return NextResponse.json({
        success: true,
        data: { user: safeUser }
      });
    }

    if (action === 'update-role') {
      const { name, description, permissions } = body;
      
      if (!id) {
        return NextResponse.json(
          { success: false, error: 'Role ID is required' },
          { status: 400 }
        );
      }

      const roles = await readRoles();
      const roleIndex = roles.findIndex(r => r.id === id);

      if (roleIndex === -1) {
        return NextResponse.json(
          { success: false, error: 'Role not found' },
          { status: 404 }
        );
      }

      const role = roles[roleIndex];

      if (role.isSystem) {
        return NextResponse.json(
          { success: false, error: 'Cannot modify system role' },
          { status: 403 }
        );
      }

      // Update fields
      if (name) role.name = name;
      if (description) role.description = description;
      if (permissions && Array.isArray(permissions)) role.permissions = permissions;

      await writeRoles(roles);

      // Update all users with this role
      const users = await readUsers();
      const updatedUsers = users.map(user => {
        if (user.role === id) {
          user.permissions = role.permissions;
        }
        return user;
      });
      await writeUsers(updatedUsers);

      return NextResponse.json({
        success: true,
        data: { role }
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action'
    }, { status: 400 });

  } catch (error) {
    console.error('Error in auth API:', error);
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

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID is required' },
        { status: 400 }
      );
    }

    if (action === 'delete-user') {
      const users = await readUsers();
      const userIndex = users.findIndex(u => u.id === id);

      if (userIndex === -1) {
        return NextResponse.json(
          { success: false, error: 'User not found' },
          { status: 404 }
        );
      }

      // Prevent deleting the last admin
      const user = users[userIndex];
      if (user.role === 'admin') {
        const adminCount = users.filter(u => u.role === 'admin' && u.isActive).length;
        if (adminCount <= 1) {
          return NextResponse.json(
            { success: false, error: 'Cannot delete the last admin user' },
            { status: 403 }
          );
        }
      }

      users.splice(userIndex, 1);
      await writeUsers(users);

      return NextResponse.json({
        success: true,
        message: 'User deleted successfully'
      });
    }

    if (action === 'delete-role') {
      const roles = await readRoles();
      const roleIndex = roles.findIndex(r => r.id === id);

      if (roleIndex === -1) {
        return NextResponse.json(
          { success: false, error: 'Role not found' },
          { status: 404 }
        );
      }

      const role = roles[roleIndex];

      if (role.isSystem) {
        return NextResponse.json(
          { success: false, error: 'Cannot delete system role' },
          { status: 403 }
        );
      }

      // Check if any users have this role
      const users = await readUsers();
      const usersWithRole = users.filter(u => u.role === id);

      if (usersWithRole.length > 0) {
        return NextResponse.json(
          { success: false, error: 'Cannot delete role that is assigned to users' },
          { status: 409 }
        );
      }

      roles.splice(roleIndex, 1);
      await writeRoles(roles);

      return NextResponse.json({
        success: true,
        message: 'Role deleted successfully'
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action'
    }, { status: 400 });

  } catch (error) {
    console.error('Error in auth API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Export utility functions
export { hasPermission, generateToken };
