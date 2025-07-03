import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const uploadsDir = path.join(process.cwd(), 'public', 'uploads')

// Helper function to validate admin access
function validateAdminAccess(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  return authHeader && authHeader.startsWith('Bearer ')
}

// Helper function to ensure directory exists
function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
}

// Helper function to validate file type
function isValidFileType(filename: string) {
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf', '.doc', '.docx']
  const ext = path.extname(filename).toLowerCase()
  return allowedExtensions.includes(ext)
}

// Helper function to generate safe filename
function generateSafeFilename(originalName: string) {
  const ext = path.extname(originalName)
  const name = path.basename(originalName, ext)
  const safeName = name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
  
  const timestamp = Date.now()
  return `${safeName}-${timestamp}${ext}`
}

// GET: List uploaded media files
export async function GET(request: NextRequest) {
  try {
    ensureDir(uploadsDir)
    
    const { searchParams } = new URL(request.url)
    const folder = searchParams.get('folder') || ''
    const type = searchParams.get('type') // image, document, all
    
    const targetDir = path.join(uploadsDir, folder)
    
    if (!fs.existsSync(targetDir)) {
      return NextResponse.json({ files: [] })
    }

    const files = fs.readdirSync(targetDir, { withFileTypes: true })
      .filter(dirent => {
        if (dirent.isDirectory()) return false
        
        const filename = dirent.name
        if (!isValidFileType(filename)) return false
        
        if (type === 'image') {
          return /\.(jpg|jpeg|png|gif|webp)$/i.test(filename)
        } else if (type === 'document') {
          return /\.(pdf|doc|docx)$/i.test(filename)
        }
        
        return true
      })
      .map(dirent => {
        const filePath = path.join(targetDir, dirent.name)
        const stats = fs.statSync(filePath)
        const relativePath = path.join('/uploads', folder, dirent.name).replace(/\\/g, '/')
        
        return {
          name: dirent.name,
          path: relativePath,
          size: stats.size,
          lastModified: stats.mtime,
          type: path.extname(dirent.name).substring(1).toLowerCase()
        }
      })

    // Sort by last modified (newest first)
    files.sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())

    return NextResponse.json({ 
      files, 
      total: files.length,
      folder: folder || 'root'
    })
  } catch (error) {
    console.error('Error listing media files:', error)
    return NextResponse.json({ error: 'Failed to list media files' }, { status: 500 })
  }
}

// POST: Upload new media file
export async function POST(request: NextRequest) {
  try {
    if (!validateAdminAccess(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = (formData.get('folder') as string) || ''
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!isValidFileType(file.name)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 })
    }

    const targetDir = path.join(uploadsDir, folder)
    ensureDir(targetDir)

    const safeFilename = generateSafeFilename(file.name)
    const filePath = path.join(targetDir, safeFilename)
    
    // Check if file already exists
    if (fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'File already exists' }, { status: 409 })
    }

    // Save file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    fs.writeFileSync(filePath, buffer)

    const relativePath = path.join('/uploads', folder, safeFilename).replace(/\\/g, '/')
    
    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully',
      file: {
        name: safeFilename,
        originalName: file.name,
        path: relativePath,
        size: file.size,
        type: path.extname(file.name).substring(1).toLowerCase()
      }
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
  }
}

// DELETE: Delete media file
export async function DELETE(request: NextRequest) {
  try {
    if (!validateAdminAccess(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const filePath = searchParams.get('path')
    
    if (!filePath) {
      return NextResponse.json({ error: 'File path is required' }, { status: 400 })
    }

    // Remove leading slash and ensure it's in uploads directory
    const cleanPath = filePath.replace(/^\/+/, '')
    if (!cleanPath.startsWith('uploads/')) {
      return NextResponse.json({ error: 'Invalid file path' }, { status: 400 })
    }

    const fullPath = path.join(process.cwd(), 'public', cleanPath)
    
    if (!fs.existsSync(fullPath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    // Move to trash instead of permanent deletion
    const trashDir = path.join(uploadsDir, '.trash')
    ensureDir(trashDir)
    
    const filename = path.basename(fullPath)
    const trashPath = path.join(trashDir, `${Date.now()}-${filename}`)
    fs.renameSync(fullPath, trashPath)

    return NextResponse.json({
      success: true,
      message: 'File moved to trash',
      trashedPath: trashPath
    })
  } catch (error) {
    console.error('Error deleting file:', error)
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 })
  }
}
