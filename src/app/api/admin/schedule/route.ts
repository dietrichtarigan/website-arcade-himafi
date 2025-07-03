import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const contentDir = path.join(process.cwd(), 'content')
const scheduleDir = path.join(process.cwd(), '.schedule')

interface ScheduledContent {
  id: string
  type: string
  title: string
  scheduledDate: string
  status: 'scheduled' | 'published' | 'failed' | 'cancelled'
  createdAt: string
  updatedAt: string
  author: string
  content: any
  publishActions: string[]
  notificationsSent: boolean
  retryCount: number
}

interface ContentSchedule {
  publishAt: string
  actions: string[]
  notifications: {
    email?: string[]
    webhook?: string
    slack?: string
  }
  autoSocial?: {
    twitter?: boolean
    linkedin?: boolean
    instagram?: boolean
  }
  seoChecks?: boolean
  previewMode?: boolean
}

// Helper function to ensure schedule directory exists
function ensureScheduleDir() {
  if (!fs.existsSync(scheduleDir)) {
    fs.mkdirSync(scheduleDir, { recursive: true })
  }
}

// Helper function to validate admin access
function validateAdminAccess(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  return authHeader && authHeader.startsWith('Bearer ')
}

// Get all scheduled content
function getScheduledContent(): ScheduledContent[] {
  ensureScheduleDir()
  
  const scheduleFiles = fs.readdirSync(scheduleDir).filter(file => file.endsWith('.json'))
  
  return scheduleFiles.map(file => {
    const filePath = path.join(scheduleDir, file)
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    return content as ScheduledContent
  }).sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
}

// Save scheduled content
function saveScheduledContent(scheduled: ScheduledContent) {
  ensureScheduleDir()
  const filePath = path.join(scheduleDir, `${scheduled.id}.json`)
  fs.writeFileSync(filePath, JSON.stringify(scheduled, null, 2))
}

// Process scheduled content that's ready to publish
async function processScheduledContent() {
  const now = new Date()
  const scheduled = getScheduledContent()
  const results = []

  for (const item of scheduled) {
    if (item.status === 'scheduled' && new Date(item.scheduledDate) <= now) {
      try {
        await publishScheduledContent(item)
        item.status = 'published'
        item.updatedAt = now.toISOString()
        saveScheduledContent(item)
        
        results.push({
          id: item.id,
          success: true,
          message: 'Published successfully'
        })
      } catch (error) {
        item.status = 'failed'
        item.retryCount = (item.retryCount || 0) + 1
        item.updatedAt = now.toISOString()
        saveScheduledContent(item)
        
        results.push({
          id: item.id,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }
  }

  return results
}

// Publish scheduled content
async function publishScheduledContent(scheduled: ScheduledContent) {
  const { type, content, publishActions } = scheduled
  
  // Create content file
  const typeDir = path.join(contentDir, type)
  if (!fs.existsSync(typeDir)) {
    fs.mkdirSync(typeDir, { recursive: true })
  }

  // Generate filename
  const timestamp = new Date().toISOString().split('T')[0]
  const title = content.data.judul || content.data.nama || content.data.title || 'untitled'
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  const filename = `${slug}-${timestamp}.md`
  const filePath = path.join(typeDir, filename)

  // Update frontmatter with publish date
  const frontmatter = {
    ...content.data,
    published_at: new Date().toISOString(),
    scheduled_publish: true
  }

  // Create markdown content
  const fileContent = matter.stringify(content.content || '', frontmatter)
  fs.writeFileSync(filePath, fileContent, 'utf8')

  // Execute publish actions
  for (const action of publishActions) {
    await executePublishAction(action, scheduled, filePath)
  }

  // Send notifications
  if (!scheduled.notificationsSent) {
    await sendPublishNotifications(scheduled)
    scheduled.notificationsSent = true
  }
}

// Execute publish actions
async function executePublishAction(action: string, scheduled: ScheduledContent, filePath: string) {
  switch (action) {
    case 'deploy':
      // Trigger Netlify deployment
      const buildHookUrl = process.env.NETLIFY_BUILD_HOOK_URL
      if (buildHookUrl) {
        await fetch(buildHookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            trigger_title: `Scheduled publish: ${scheduled.title}`,
            trigger_branch: 'main'
          })
        })
      }
      break

    case 'seo_check':
      // Perform SEO validation
      await performSEOCheck(scheduled.content)
      break

    case 'social_media':
      // Post to social media (placeholder)
      await postToSocialMedia(scheduled)
      break

    case 'generate_sitemap':
      // Update sitemap
      await updateSitemap()
      break

    case 'clear_cache':
      // Clear CDN cache (placeholder)
      await clearCDNCache()
      break
  }
}

// Send notifications
async function sendPublishNotifications(scheduled: ScheduledContent) {
  // Email notifications (placeholder)
  console.log(`Sending email notification for: ${scheduled.title}`)
  
  // Webhook notifications
  if (process.env.WEBHOOK_URL) {
    await fetch(process.env.WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'content_published',
        content: scheduled,
        timestamp: new Date().toISOString()
      })
    })
  }

  // Slack notification (placeholder)
  if (process.env.SLACK_WEBHOOK_URL) {
    await fetch(process.env.SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `📝 Content published: ${scheduled.title}`,
        attachments: [{
          color: 'good',
          fields: [
            { title: 'Type', value: scheduled.type, short: true },
            { title: 'Author', value: scheduled.author, short: true },
            { title: 'Scheduled Date', value: scheduled.scheduledDate, short: true }
          ]
        }]
      })
    })
  }
}

// Placeholder functions for additional features
async function performSEOCheck(content: any) {
  console.log('Performing SEO check...')
  // Implement SEO validation logic
}

async function postToSocialMedia(scheduled: ScheduledContent) {
  console.log('Posting to social media...')
  // Implement social media posting
}

async function updateSitemap() {
  console.log('Updating sitemap...')
  // Implement sitemap generation
}

async function clearCDNCache() {
  console.log('Clearing CDN cache...')
  // Implement cache clearing
}

// GET: List scheduled content
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') as ScheduledContent['status'] | null
    const type = searchParams.get('type')
    const upcoming = searchParams.get('upcoming') === 'true'

    let scheduled = getScheduledContent()

    // Filter by status
    if (status) {
      scheduled = scheduled.filter(item => item.status === status)
    }

    // Filter by type
    if (type) {
      scheduled = scheduled.filter(item => item.type === type)
    }

    // Filter upcoming only
    if (upcoming) {
      const now = new Date()
      scheduled = scheduled.filter(item => 
        item.status === 'scheduled' && new Date(item.scheduledDate) > now
      )
    }

    // Get statistics
    const stats = {
      total: scheduled.length,
      scheduled: scheduled.filter(item => item.status === 'scheduled').length,
      published: scheduled.filter(item => item.status === 'published').length,
      failed: scheduled.filter(item => item.status === 'failed').length,
      upcoming: scheduled.filter(item => 
        item.status === 'scheduled' && new Date(item.scheduledDate) > new Date()
      ).length
    }

    return NextResponse.json({
      success: true,
      scheduled,
      stats,
      currentTime: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error fetching scheduled content:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch scheduled content',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// POST: Schedule new content or process scheduled content
export async function POST(request: NextRequest) {
  try {
    if (!validateAdminAccess(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action, ...data } = body

    if (action === 'process') {
      // Process scheduled content that's ready
      const results = await processScheduledContent()
      return NextResponse.json({
        success: true,
        message: 'Processed scheduled content',
        results
      })
    }

    // Schedule new content
    const { type, content, schedule, author } = data as {
      type: string
      content: any
      schedule: ContentSchedule
      author: string
    }

    if (!type || !content || !schedule || !schedule.publishAt) {
      return NextResponse.json({ 
        error: 'Missing required fields: type, content, schedule.publishAt' 
      }, { status: 400 })
    }

    // Validate schedule date
    const scheduledDate = new Date(schedule.publishAt)
    if (scheduledDate <= new Date()) {
      return NextResponse.json({ 
        error: 'Scheduled date must be in the future' 
      }, { status: 400 })
    }

    // Create scheduled content entry
    const scheduled: ScheduledContent = {
      id: `scheduled-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      title: content.data?.judul || content.data?.nama || content.data?.title || 'Untitled',
      scheduledDate: schedule.publishAt,
      status: 'scheduled',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author,
      content,
      publishActions: schedule.actions || ['deploy'],
      notificationsSent: false,
      retryCount: 0
    }

    // Save scheduled content
    saveScheduledContent(scheduled)

    return NextResponse.json({
      success: true,
      message: 'Content scheduled successfully',
      scheduled: {
        id: scheduled.id,
        title: scheduled.title,
        scheduledDate: scheduled.scheduledDate,
        status: scheduled.status
      }
    })
  } catch (error) {
    console.error('Error scheduling content:', error)
    return NextResponse.json({ 
      error: 'Failed to schedule content',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// PUT: Update scheduled content
export async function PUT(request: NextRequest) {
  try {
    if (!validateAdminAccess(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, updates } = body

    if (!id) {
      return NextResponse.json({ error: 'Scheduled content ID is required' }, { status: 400 })
    }

    const filePath = path.join(scheduleDir, `${id}.json`)
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Scheduled content not found' }, { status: 404 })
    }

    const scheduled = JSON.parse(fs.readFileSync(filePath, 'utf8')) as ScheduledContent
    
    // Update fields
    Object.assign(scheduled, updates, {
      updatedAt: new Date().toISOString()
    })

    // Validate new schedule date if updated
    if (updates.scheduledDate) {
      const newDate = new Date(updates.scheduledDate)
      if (newDate <= new Date() && scheduled.status === 'scheduled') {
        return NextResponse.json({ 
          error: 'Scheduled date must be in the future for scheduled content' 
        }, { status: 400 })
      }
    }

    saveScheduledContent(scheduled)

    return NextResponse.json({
      success: true,
      message: 'Scheduled content updated successfully',
      scheduled
    })
  } catch (error) {
    console.error('Error updating scheduled content:', error)
    return NextResponse.json({ 
      error: 'Failed to update scheduled content',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// DELETE: Cancel scheduled content
export async function DELETE(request: NextRequest) {
  try {
    if (!validateAdminAccess(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Scheduled content ID is required' }, { status: 400 })
    }

    const filePath = path.join(scheduleDir, `${id}.json`)
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Scheduled content not found' }, { status: 404 })
    }

    const scheduled = JSON.parse(fs.readFileSync(filePath, 'utf8')) as ScheduledContent
    
    if (scheduled.status === 'published') {
      return NextResponse.json({ 
        error: 'Cannot delete already published content' 
      }, { status: 400 })
    }

    // Mark as cancelled instead of deleting
    scheduled.status = 'cancelled'
    scheduled.updatedAt = new Date().toISOString()
    saveScheduledContent(scheduled)

    return NextResponse.json({
      success: true,
      message: 'Scheduled content cancelled successfully'
    })
  } catch (error) {
    console.error('Error cancelling scheduled content:', error)
    return NextResponse.json({ 
      error: 'Failed to cancel scheduled content',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
