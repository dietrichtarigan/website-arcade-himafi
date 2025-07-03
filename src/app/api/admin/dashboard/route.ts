import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const contentDir = path.join(process.cwd(), 'content')
const uploadsDir = path.join(process.cwd(), 'public', 'uploads')

// Helper function to validate admin access
function validateAdminAccess(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  return authHeader && authHeader.startsWith('Bearer ')
}

// Helper function to count files in directory
function countFiles(dirPath: string): number {
  if (!fs.existsSync(dirPath)) return 0
  return fs.readdirSync(dirPath).filter(file => file.endsWith('.md')).length
}

// Helper function to get directory size
function getDirectorySize(dirPath: string): number {
  if (!fs.existsSync(dirPath)) return 0
  
  let size = 0
  const items = fs.readdirSync(dirPath, { withFileTypes: true })
  
  for (const item of items) {
    const itemPath = path.join(dirPath, item.name)
    if (item.isDirectory()) {
      size += getDirectorySize(itemPath)
    } else {
      size += fs.statSync(itemPath).size
    }
  }
  
  return size
}

// Helper function to format bytes
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// GET: Dashboard statistics
export async function GET(request: NextRequest) {
  try {
    // Content statistics
    const contentStats = {
      infoprof: countFiles(path.join(contentDir, 'infoprof')),
      alumni: countFiles(path.join(contentDir, 'alumni')),
      ceritakita: countFiles(path.join(contentDir, 'ceritakita')),
      event: countFiles(path.join(contentDir, 'event')),
      companyvisit: countFiles(path.join(contentDir, 'companyvisit')),
      reaktor: countFiles(path.join(contentDir, 'reaktor'))
    }

    const totalContent = Object.values(contentStats).reduce((sum, count) => sum + count, 0)

    // Media statistics
    const uploadsSize = getDirectorySize(uploadsDir)
    const mediaFiles = fs.existsSync(uploadsDir) 
      ? fs.readdirSync(uploadsDir, { withFileTypes: true })
          .filter(item => !item.isDirectory() && !item.name.startsWith('.'))
          .length
      : 0

    // Recent activity (last 7 days)
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    let recentActivity = 0
    const contentTypes = ['infoprof', 'alumni', 'ceritakita', 'event', 'companyvisit', 'reaktor']
    
    for (const type of contentTypes) {
      const typeDir = path.join(contentDir, type)
      if (fs.existsSync(typeDir)) {
        const files = fs.readdirSync(typeDir)
        for (const file of files) {
          if (file.endsWith('.md')) {
            const filePath = path.join(typeDir, file)
            const stats = fs.statSync(filePath)
            if (stats.mtime > oneWeekAgo) {
              recentActivity++
            }
          }
        }
      }
    }

    // System information
    const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'))
    
    return NextResponse.json({
      success: true,
      dashboard: {
        content: {
          total: totalContent,
          breakdown: contentStats,
          recentActivity
        },
        media: {
          totalFiles: mediaFiles,
          totalSize: formatBytes(uploadsSize),
          sizeBytes: uploadsSize
        },
        system: {
          version: packageJson.version,
          lastUpdate: new Date().toISOString(),
          environment: process.env.NODE_ENV || 'development'
        },
        quickStats: [
          {
            label: 'Total Konten',
            value: totalContent,
            icon: '📝',
            color: 'blue'
          },
          {
            label: 'Info Karier',
            value: contentStats.infoprof,
            icon: '💼',
            color: 'green'
          },
          {
            label: 'Alumni',
            value: contentStats.alumni,
            icon: '🎓',
            color: 'purple'
          },
          {
            label: 'Media Files',
            value: mediaFiles,
            icon: '📁',
            color: 'orange'
          }
        ]
      }
    })
  } catch (error) {
    console.error('Error generating dashboard:', error)
    return NextResponse.json({ 
      error: 'Failed to generate dashboard data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
