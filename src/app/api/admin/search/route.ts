import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const contentDir = path.join(process.cwd(), 'content')

interface SearchFilters {
  query?: string
  contentType?: string
  category?: string
  tags?: string[]
  dateFrom?: string
  dateTo?: string
  author?: string
  status?: 'published' | 'draft' | 'archived'
  sortBy?: 'date' | 'title' | 'views' | 'relevance'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

interface SearchResult {
  id: string
  type: string
  title: string
  description: string
  content: string
  date: string
  author?: string
  category?: string
  tags?: string[]
  featured_image?: string
  status: string
  relevanceScore: number
  highlights: string[]
  url: string
  lastModified: string
  wordCount: number
}

// Advanced search function
function performAdvancedSearch(filters: SearchFilters): {
  results: SearchResult[]
  total: number
  facets: any
  suggestions: string[]
} {
  const contentTypes = filters.contentType ? [filters.contentType] : 
    ['infoprof', 'alumni', 'ceritakita', 'event', 'companyvisit', 'reaktor']
  
  let allResults: SearchResult[] = []
  const facets = {
    contentTypes: {} as any,
    categories: {} as any,
    tags: {} as any,
    authors: {} as any,
    years: {} as any
  }

  for (const type of contentTypes) {
    const typeDir = path.join(contentDir, type)
    if (!fs.existsSync(typeDir)) continue

    const files = fs.readdirSync(typeDir).filter(file => file.endsWith('.md'))
    
    for (const file of files) {
      const filePath = path.join(typeDir, file)
      const fileContent = fs.readFileSync(filePath, 'utf8')
      const { data, content } = matter(fileContent)
      const stats = fs.statSync(filePath)

      const result = createSearchResult(file, type, data, content, stats, filters)
      if (result && passesFilters(result, filters)) {
        allResults.push(result)
        
        // Update facets
        updateFacets(facets, result)
      }
    }
  }

  // Sort results
  allResults = sortResults(allResults, filters.sortBy || 'relevance', filters.sortOrder || 'desc')

  // Pagination
  const page = filters.page || 1
  const limit = filters.limit || 20
  const startIndex = (page - 1) * limit
  const paginatedResults = allResults.slice(startIndex, startIndex + limit)

  // Generate suggestions
  const suggestions = generateSearchSuggestions(filters.query || '', allResults)

  return {
    results: paginatedResults,
    total: allResults.length,
    facets,
    suggestions
  }
}

function createSearchResult(
  filename: string, 
  type: string, 
  frontmatter: any, 
  content: string, 
  stats: fs.Stats,
  filters: SearchFilters
): SearchResult | null {
  const id = filename.replace('.md', '')
  const title = frontmatter.judul || frontmatter.nama || frontmatter.title || 'Untitled'
  const description = frontmatter.deskripsi || frontmatter.cerita || frontmatter.description || ''
  const date = frontmatter.tanggal_post || frontmatter.publish_date || frontmatter.tanggal_event || 
               frontmatter.tanggal || frontmatter.tanggal_publish || stats.birthtime.toISOString()

  // Calculate relevance score
  const relevanceScore = calculateRelevanceScore(
    title, description, content, frontmatter.tags || [], filters.query || ''
  )

  // Generate highlights
  const highlights = generateHighlights(title, description, content, filters.query || '')

  // Determine status
  const status = frontmatter.draft ? 'draft' : 
                 frontmatter.arsip ? 'archived' : 'published'

  // Generate URL
  const urlMap: { [key: string]: string } = {
    infoprof: '/infoprof',
    alumni: '/alumni',
    ceritakita: '/ceritakita',
    event: '/events',
    companyvisit: '/company-visit',
    reaktor: '/reaktor'
  }

  return {
    id,
    type,
    title,
    description,
    content: content.substring(0, 500), // Truncated content
    date,
    author: frontmatter.penulis || frontmatter.author,
    category: frontmatter.kategori || frontmatter.category,
    tags: frontmatter.tags || [],
    featured_image: frontmatter.featured_image || frontmatter.poster || frontmatter.foto,
    status,
    relevanceScore,
    highlights,
    url: `${urlMap[type] || '/'}/${id}`,
    lastModified: stats.mtime.toISOString(),
    wordCount: content.split(' ').length
  }
}

function calculateRelevanceScore(
  title: string, 
  description: string, 
  content: string, 
  tags: string[], 
  query: string
): number {
  if (!query) return 100

  const queryTerms = query.toLowerCase().split(' ').filter(term => term.length > 2)
  let score = 0

  for (const term of queryTerms) {
    // Title matches (highest weight)
    if (title.toLowerCase().includes(term)) score += 50

    // Description matches
    if (description.toLowerCase().includes(term)) score += 30

    // Tag matches
    if (tags.some(tag => tag.toLowerCase().includes(term))) score += 25

    // Content matches
    const contentMatches = (content.toLowerCase().match(new RegExp(term, 'g')) || []).length
    score += Math.min(contentMatches * 2, 20)
  }

  return Math.min(score, 100)
}

function generateHighlights(title: string, description: string, content: string, query: string): string[] {
  if (!query) return []

  const highlights: string[] = []
  const queryTerms = query.toLowerCase().split(' ').filter(term => term.length > 2)

  for (const term of queryTerms) {
    // Find in title
    if (title.toLowerCase().includes(term)) {
      highlights.push(`<mark>${title}</mark>`)
    }

    // Find in description
    if (description.toLowerCase().includes(term)) {
      const index = description.toLowerCase().indexOf(term)
      const start = Math.max(0, index - 50)
      const end = Math.min(description.length, index + 100)
      const snippet = description.substring(start, end)
      highlights.push(`...${snippet.replace(new RegExp(term, 'gi'), `<mark>$&</mark>`)}...`)
    }
  }

  return highlights.slice(0, 3) // Limit highlights
}

function passesFilters(result: SearchResult, filters: SearchFilters): boolean {
  // Category filter
  if (filters.category && result.category !== filters.category) return false

  // Tags filter
  if (filters.tags && filters.tags.length > 0) {
    if (!result.tags || !filters.tags.some(tag => result.tags!.includes(tag))) return false
  }

  // Date range filter
  if (filters.dateFrom) {
    if (new Date(result.date) < new Date(filters.dateFrom)) return false
  }
  if (filters.dateTo) {
    if (new Date(result.date) > new Date(filters.dateTo)) return false
  }

  // Author filter
  if (filters.author && result.author !== filters.author) return false

  // Status filter
  if (filters.status && result.status !== filters.status) return false

  return true
}

function sortResults(results: SearchResult[], sortBy: string, sortOrder: string): SearchResult[] {
  return results.sort((a, b) => {
    let comparison = 0

    switch (sortBy) {
      case 'date':
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
        break
      case 'title':
        comparison = a.title.localeCompare(b.title)
        break
      case 'views':
        // Simulated view count based on relevance score
        comparison = a.relevanceScore - b.relevanceScore
        break
      case 'relevance':
      default:
        comparison = a.relevanceScore - b.relevanceScore
        break
    }

    return sortOrder === 'desc' ? -comparison : comparison
  })
}

function updateFacets(facets: any, result: SearchResult) {
  // Content types
  facets.contentTypes[result.type] = (facets.contentTypes[result.type] || 0) + 1

  // Categories
  if (result.category) {
    facets.categories[result.category] = (facets.categories[result.category] || 0) + 1
  }

  // Tags
  if (result.tags) {
    result.tags.forEach(tag => {
      facets.tags[tag] = (facets.tags[tag] || 0) + 1
    })
  }

  // Authors
  if (result.author) {
    facets.authors[result.author] = (facets.authors[result.author] || 0) + 1
  }

  // Years
  const year = new Date(result.date).getFullYear().toString()
  facets.years[year] = (facets.years[year] || 0) + 1
}

function generateSearchSuggestions(query: string, allResults: SearchResult[]): string[] {
  if (!query || query.length < 3) return []

  const suggestions = new Set<string>()
  const queryLower = query.toLowerCase()

  // Generate suggestions from titles, tags, and categories
  allResults.forEach(result => {
    // Title words
    result.title.split(' ').forEach(word => {
      if (word.toLowerCase().startsWith(queryLower) && word.length > 3) {
        suggestions.add(word.toLowerCase())
      }
    })

    // Tags
    if (result.tags) {
      result.tags.forEach(tag => {
        if (tag.toLowerCase().includes(queryLower)) {
          suggestions.add(tag.toLowerCase())
        }
      })
    }

    // Categories
    if (result.category && result.category.toLowerCase().includes(queryLower)) {
      suggestions.add(result.category.toLowerCase())
    }
  })

  return Array.from(suggestions).slice(0, 5)
}

// GET: Advanced search
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const filters: SearchFilters = {
      query: searchParams.get('q') || undefined,
      contentType: searchParams.get('type') || undefined,
      category: searchParams.get('category') || undefined,
      tags: searchParams.get('tags')?.split(',').filter(Boolean) || undefined,
      dateFrom: searchParams.get('dateFrom') || undefined,
      dateTo: searchParams.get('dateTo') || undefined,
      author: searchParams.get('author') || undefined,
      status: searchParams.get('status') as any || undefined,
      sortBy: searchParams.get('sortBy') as any || 'relevance',
      sortOrder: searchParams.get('sortOrder') as any || 'desc',
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '20')
    }

    const searchResults = performAdvancedSearch(filters)

    return NextResponse.json({
      success: true,
      query: filters.query,
      filters,
      results: searchResults.results,
      pagination: {
        page: filters.page || 1,
        limit: filters.limit || 20,
        total: searchResults.total,
        totalPages: Math.ceil(searchResults.total / (filters.limit || 20))
      },
      facets: searchResults.facets,
      suggestions: searchResults.suggestions,
      searchTime: Date.now() // For performance monitoring
    })
  } catch (error) {
    console.error('Error performing search:', error)
    return NextResponse.json({ 
      error: 'Search failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// POST: Save search query (for analytics)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query, filters, resultCount, clickedResult } = body

    // In a real implementation, you would save search analytics to a database
    console.log('Search Analytics:', {
      query,
      filters,
      resultCount,
      clickedResult,
      timestamp: new Date().toISOString()
    })

    return NextResponse.json({
      success: true,
      message: 'Search analytics saved'
    })
  } catch (error) {
    console.error('Error saving search analytics:', error)
    return NextResponse.json({ 
      error: 'Failed to save search analytics'
    }, { status: 500 })
  }
}
