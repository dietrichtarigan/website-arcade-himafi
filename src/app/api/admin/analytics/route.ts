import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const contentDir = path.join(process.cwd(), 'content')

// Helper function to validate admin access
function validateAdminAccess(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  return authHeader && authHeader.startsWith('Bearer ')
}

// Helper function to get content statistics
function getContentAnalytics() {
  const contentTypes = ['infoprof', 'alumni', 'ceritakita', 'event', 'companyvisit', 'reaktor']
  const analytics = {
    totalViews: 0,
    contentPerformance: [] as any[],
    categoryStats: {} as any,
    publishingTrends: [] as any[],
    seoScores: {} as any,
    popularTags: {} as any
  }

  for (const type of contentTypes) {
    const typeDir = path.join(contentDir, type)
    if (!fs.existsSync(typeDir)) continue

    const files = fs.readdirSync(typeDir).filter(file => file.endsWith('.md'))
    analytics.categoryStats[type] = {
      total: files.length,
      published: 0,
      draft: 0,
      averageLength: 0,
      recentActivity: 0
    }

    let totalLength = 0
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    for (const file of files) {
      const filePath = path.join(typeDir, file)
      const fileContent = fs.readFileSync(filePath, 'utf8')
      const { data, content } = matter(fileContent)
      const stats = fs.statSync(filePath)

      // Count published vs draft
      if (data.draft) {
        analytics.categoryStats[type].draft++
      } else {
        analytics.categoryStats[type].published++
      }

      // Calculate average content length
      totalLength += content.length
      
      // Recent activity
      if (stats.mtime > oneWeekAgo) {
        analytics.categoryStats[type].recentActivity++
      }

      // Popular tags
      if (data.tags && Array.isArray(data.tags)) {
        data.tags.forEach((tag: string) => {
          analytics.popularTags[tag] = (analytics.popularTags[tag] || 0) + 1
        })
      }

      // SEO Score calculation
      const seoScore = calculateSEOScore(data, content)
      analytics.seoScores[file] = seoScore

      // Content performance (simulated metrics)
      analytics.contentPerformance.push({
        id: file.replace('.md', ''),
        type,
        title: data.judul || data.nama || data.title || 'Untitled',
        views: Math.floor(Math.random() * 1000) + 100, // Simulated
        engagement: Math.floor(Math.random() * 100) + 10, // Simulated
        seoScore,
        lastModified: stats.mtime,
        wordCount: content.split(' ').length
      })
    }

    if (files.length > 0) {
      analytics.categoryStats[type].averageLength = Math.round(totalLength / files.length)
    }
  }

  // Sort content by performance
  analytics.contentPerformance.sort((a, b) => b.views - a.views)

  // Generate publishing trends (last 30 days)
  for (let i = 29; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    
    // Simulated publishing data
    analytics.publishingTrends.push({
      date: dateStr,
      published: Math.floor(Math.random() * 5),
      views: Math.floor(Math.random() * 500) + 100
    })
  }

  return analytics
}

// SEO Score calculation
function calculateSEOScore(frontmatter: any, content: string): number {
  let score = 0
  const maxScore = 100

  // Title optimization (20 points)
  const title = frontmatter.judul || frontmatter.nama || frontmatter.title || ''
  if (title.length >= 30 && title.length <= 60) score += 20
  else if (title.length > 0) score += 10

  // Description optimization (20 points)
  const description = frontmatter.deskripsi || frontmatter.description || ''
  if (description.length >= 120 && description.length <= 160) score += 20
  else if (description.length > 0) score += 10

  // Content length (15 points)
  const wordCount = content.split(' ').length
  if (wordCount >= 300) score += 15
  else if (wordCount >= 150) score += 10
  else if (wordCount >= 50) score += 5

  // Images (10 points)
  if (frontmatter.featured_image || frontmatter.poster || frontmatter.foto) score += 10

  // Tags (10 points)
  if (frontmatter.tags && Array.isArray(frontmatter.tags) && frontmatter.tags.length > 0) {
    score += Math.min(frontmatter.tags.length * 2, 10)
  }

  // Internal links (10 points) - simplified check
  const internalLinks = (content.match(/\[.*?\]\(\/.*?\)/g) || []).length
  if (internalLinks > 0) score += Math.min(internalLinks * 3, 10)

  // Headers structure (10 points)
  const headers = (content.match(/^#{1,6}\s/gm) || []).length
  if (headers >= 3) score += 10
  else if (headers >= 1) score += 5

  // Meta fields completeness (5 points)
  if (frontmatter.kategori || frontmatter.category) score += 3
  if (frontmatter.tanggal_post || frontmatter.publish_date || frontmatter.date) score += 2

  return Math.min(score, maxScore)
}

// GET: Analytics data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // overview, content, seo, trends

    const analytics = getContentAnalytics()

    switch (type) {
      case 'content':
        return NextResponse.json({
          success: true,
          data: {
            performance: analytics.contentPerformance.slice(0, 20),
            categoryStats: analytics.categoryStats
          }
        })

      case 'seo':
        return NextResponse.json({
          success: true,
          data: {
            seoScores: analytics.seoScores,
            averageScore: Object.values(analytics.seoScores).reduce((a: number, b: any) => a + b, 0) / Object.keys(analytics.seoScores).length || 0,
            recommendations: generateSEORecommendations(analytics.seoScores)
          }
        })

      case 'trends':
        return NextResponse.json({
          success: true,
          data: {
            publishingTrends: analytics.publishingTrends,
            popularTags: Object.entries(analytics.popularTags)
              .sort(([,a], [,b]) => (b as number) - (a as number))
              .slice(0, 10)
              .map(([tag, count]) => ({ tag, count }))
          }
        })

      default: // overview
        return NextResponse.json({
          success: true,
          data: {
            overview: {
              totalContent: analytics.contentPerformance.length,
              totalViews: analytics.contentPerformance.reduce((sum, item) => sum + item.views, 0),
              averageSEO: Object.values(analytics.seoScores).reduce((a: number, b: any) => a + b, 0) / Object.keys(analytics.seoScores).length || 0,
              topPerformer: analytics.contentPerformance[0] || null
            },
            categoryStats: analytics.categoryStats,
            recentActivity: analytics.contentPerformance
              .filter(item => {
                const oneWeekAgo = new Date()
                oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
                return new Date(item.lastModified) > oneWeekAgo
              })
              .slice(0, 5)
          }
        })
    }
  } catch (error) {
    console.error('Error generating analytics:', error)
    return NextResponse.json({ 
      error: 'Failed to generate analytics',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Generate SEO recommendations
function generateSEORecommendations(seoScores: any): string[] {
  const recommendations = []
  const scores = Object.values(seoScores) as number[]
  const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length

  if (averageScore < 60) {
    recommendations.push("Tingkatkan panjang konten minimal 300 kata untuk SEO yang lebih baik")
  }
  
  if (averageScore < 70) {
    recommendations.push("Tambahkan meta description yang optimal (120-160 karakter)")
  }
  
  if (averageScore < 80) {
    recommendations.push("Gunakan featured image pada setiap konten")
    recommendations.push("Tambahkan tags yang relevan untuk kategorisasi")
  }

  recommendations.push("Gunakan struktur heading (H1, H2, H3) yang jelas")
  recommendations.push("Tambahkan internal links ke konten terkait")

  return recommendations
}

// POST: Update content views (for tracking)
export async function POST(request: NextRequest) {
  try {
    if (!validateAdminAccess(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { contentId, contentType, action } = body

    // In a real implementation, you would update view counts in a database
    // For now, we'll just acknowledge the tracking request
    
    return NextResponse.json({
      success: true,
      message: `Tracked ${action} for ${contentId}`,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error tracking analytics:', error)
    return NextResponse.json({ 
      error: 'Failed to track analytics',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
