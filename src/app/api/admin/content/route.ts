import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const contentDir = path.join(process.cwd(), 'content')

// Helper function to validate admin access
function validateAdminAccess(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  // In production, implement proper JWT validation with Netlify Identity
  // For now, we'll check for a basic auth header
  return authHeader && authHeader.startsWith('Bearer ')
}

// Helper function to ensure directory exists
function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
}

// GET: List all content or specific content by type
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // infoprof, alumni, ceritakita, etc.
    const id = searchParams.get('id')

    if (!type) {
      return NextResponse.json({ error: 'Content type is required' }, { status: 400 })
    }

    const typeDir = path.join(contentDir, type)
    
    if (!fs.existsSync(typeDir)) {
      return NextResponse.json({ content: [] })
    }

    if (id) {
      // Get specific content by ID
      const filePath = path.join(typeDir, `${id}.md`)
      if (!fs.existsSync(filePath)) {
        return NextResponse.json({ error: 'Content not found' }, { status: 404 })
      }

      const fileContent = fs.readFileSync(filePath, 'utf8')
      const { data, content } = matter(fileContent)
      
      return NextResponse.json({
        id,
        ...data,
        content,
        lastModified: fs.statSync(filePath).mtime
      })
    } else {
      // List all content of this type
      const files = fs.readdirSync(typeDir)
        .filter(file => file.endsWith('.md'))
        .map(file => {
          const filePath = path.join(typeDir, file)
          const fileContent = fs.readFileSync(filePath, 'utf8')
          const { data, content } = matter(fileContent)
          const id = file.replace('.md', '')
          const stats = fs.statSync(filePath)

          return {
            id,
            ...data,
            content: content.substring(0, 200) + (content.length > 200 ? '...' : ''),
            lastModified: stats.mtime,
            size: stats.size
          }
        })

      // Sort by last modified (newest first)
      files.sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())

      return NextResponse.json({ content: files, total: files.length })
    }
  } catch (error) {
    console.error('Error fetching content:', error)
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 })
  }
}

// POST: Create new content
export async function POST(request: NextRequest) {
  try {
    if (!validateAdminAccess(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { type, data, content } = body

    if (!type || !data) {
      return NextResponse.json({ error: 'Content type and data are required' }, { status: 400 })
    }

    const typeDir = path.join(contentDir, type)
    ensureDir(typeDir)

    // Generate ID based on content type and current timestamp
    const timestamp = new Date().toISOString().split('T')[0]
    const title = data.judul || data.nama || data.title || 'untitled'
    const slug = title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    
    const id = `${slug}-${timestamp}`
    const filePath = path.join(typeDir, `${id}.md`)

    // Create frontmatter
    const frontmatter = {
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const fileContent = matter.stringify(content || '', frontmatter)
    fs.writeFileSync(filePath, fileContent, 'utf8')

    return NextResponse.json({
      success: true,
      id,
      message: 'Content created successfully',
      path: filePath
    })
  } catch (error) {
    console.error('Error creating content:', error)
    return NextResponse.json({ error: 'Failed to create content' }, { status: 500 })
  }
}

// PUT: Update existing content
export async function PUT(request: NextRequest) {
  try {
    if (!validateAdminAccess(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { type, id, data, content } = body

    if (!type || !id || !data) {
      return NextResponse.json({ error: 'Content type, ID, and data are required' }, { status: 400 })
    }

    const filePath = path.join(contentDir, type, `${id}.md`)
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 })
    }

    // Read existing content to preserve creation date
    const existingContent = fs.readFileSync(filePath, 'utf8')
    const existing = matter(existingContent)

    // Update frontmatter
    const frontmatter = {
      ...existing.data,
      ...data,
      updated_at: new Date().toISOString()
    }

    const newFileContent = matter.stringify(content || existing.content, frontmatter)
    fs.writeFileSync(filePath, newFileContent, 'utf8')

    return NextResponse.json({
      success: true,
      id,
      message: 'Content updated successfully',
      path: filePath
    })
  } catch (error) {
    console.error('Error updating content:', error)
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 })
  }
}

// DELETE: Delete content
export async function DELETE(request: NextRequest) {
  try {
    if (!validateAdminAccess(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const id = searchParams.get('id')

    if (!type || !id) {
      return NextResponse.json({ error: 'Content type and ID are required' }, { status: 400 })
    }

    const filePath = path.join(contentDir, type, `${id}.md`)
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 })
    }

    // Move to trash instead of permanent deletion
    const trashDir = path.join(contentDir, '.trash', type)
    ensureDir(trashDir)
    
    const trashPath = path.join(trashDir, `${id}-${Date.now()}.md`)
    fs.renameSync(filePath, trashPath)

    return NextResponse.json({
      success: true,
      message: 'Content moved to trash',
      trashedPath: trashPath
    })
  } catch (error) {
    console.error('Error deleting content:', error)
    return NextResponse.json({ error: 'Failed to delete content' }, { status: 500 })
  }
}
