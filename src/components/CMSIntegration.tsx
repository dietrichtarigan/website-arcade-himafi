'use client'

import { useState, useEffect } from 'react'

interface CMSContent {
  id: string
  type: string
  title: string
  description: string
  date: string
  featured_image?: string
  [key: string]: any
}

interface CMSIntegrationProps {
  contentType?: string
  limit?: number
  showLoadMore?: boolean
  className?: string
}

export default function CMSIntegration({ 
  contentType = 'infoprof', 
  limit = 6, 
  showLoadMore = true,
  className = ''
}: CMSIntegrationProps) {
  const [content, setContent] = useState<CMSContent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    loadContent(1)
  }, [contentType])

  const loadContent = async (pageNum: number = 1) => {
    try {
      setLoading(true)
      setError(null)

      // In production, this would call your API
      // For now, we'll simulate with the content lib
      const response = await fetch(`/api/admin/content?type=${contentType}&page=${pageNum}&limit=${limit}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch content')
      }

      const data = await response.json()
      
      if (pageNum === 1) {
        setContent(data.content || [])
      } else {
        setContent(prev => [...prev, ...(data.content || [])])
      }
      
      setHasMore(data.hasMore || false)
      setPage(pageNum)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      console.error('Error loading content:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadMore = () => {
    if (!loading && hasMore) {
      loadContent(page + 1)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  const getContentIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      infoprof: '💼',
      alumni: '🎓',
      ceritakita: '📖',
      event: '🎉',
      companyvisit: '🏢',
      reaktor: '⚛️'
    }
    return icons[type] || '📄'
  }

  if (loading && content.length === 0) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(limit)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-64"></div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="text-red-600 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-lg font-medium">Gagal memuat konten</p>
          <p className="text-sm text-gray-600 mt-2">{error}</p>
        </div>
        <button 
          onClick={() => loadContent(1)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Coba Lagi
        </button>
      </div>
    )
  }

  return (
    <div className={className}>
      {content.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="text-6xl mb-4">{getContentIcon(contentType)}</div>
          <p className="text-lg">Belum ada konten tersedia</p>
          <p className="text-sm mt-2">Konten akan muncul setelah admin menambahkannya melalui CMS</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.map((item) => (
              <ContentCard key={item.id} item={item} contentType={contentType} />
            ))}
          </div>

          {showLoadMore && hasMore && (
            <div className="text-center mt-8">
              <button
                onClick={loadMore}
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Memuat...
                  </>
                ) : (
                  'Muat Lebih Banyak'
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

interface ContentCardProps {
  item: CMSContent
  contentType: string
}

function ContentCard({ item, contentType }: ContentCardProps) {
  const getTitle = () => {
    return item.judul || item.nama || item.title || item.perusahaan || 'Untitled'
  }

  const getDescription = () => {
    return item.deskripsi || item.cerita || item.content || 'No description available'
  }

  const getDate = () => {
    return item.tanggal_post || item.publish_date || item.tanggal_event || item.tanggal || item.tanggal_publish
  }

  const getImage = () => {
    return item.featured_image || item.poster || item.foto || '/placeholder-image.jpg'
  }

  const getLink = () => {
    const baseUrls: { [key: string]: string } = {
      infoprof: '/infoprof',
      alumni: '/alumni',
      ceritakita: '/ceritakita',
      event: '/events',
      companyvisit: '/company-visit',
      reaktor: '/reaktor'
    }
    return `${baseUrls[contentType] || '/'}/${item.id}`
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition group">
      {item.featured_image && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={getImage()}
            alt={getTitle()}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = '/placeholder-image.jpg'
            }}
          />
          {item.kategori && (
            <div className="absolute top-4 left-4">
              <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                {item.kategori}
              </span>
            </div>
          )}
        </div>
      )}
      
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition">
          {getTitle()}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {getDescription().substring(0, 150)}
          {getDescription().length > 150 ? '...' : ''}
        </p>
        
        <div className="flex items-center justify-between">
          {getDate() && (
            <span className="text-xs text-gray-500">
              {new Date(getDate()).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </span>
          )}
          
          <a
            href={getLink()}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium transition"
          >
            Baca Selengkapnya →
          </a>
        </div>
      </div>
    </div>
  )
}
