'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import ResponsivePoster from '../../../components/ResponsivePoster'

// Static generation untuk export
export async function generateStaticParams() {
  // Return empty array untuk sekarang, atau bisa di-populate dengan real slugs
  return []
}

interface InfoProfPost {
  slug: string
  judul: string
  kategori: string
  tanggal_post: string
  deskripsi: string
  link_utama?: string
  kontak_email?: string
  sumber?: string
  content: string
  poster_url?: string
  deadline?: string
  tags?: string[]
  arsip?: boolean
}

export default function InfoProfDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const [post, setPost] = useState<InfoProfPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await fetch('/api/content/infoprof')
        if (!response.ok) throw new Error('Failed to fetch')
        
        const { data } = await response.json()
        const foundPost = data.find((item: InfoProfPost) => item.slug === slug)
        
        if (!foundPost) {
          setError('Info karier tidak ditemukan')
        } else {
          setPost(foundPost)
        }
      } catch (err) {
        setError('Gagal memuat data')
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchPost()
    }
  }, [slug])

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('id-ID', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return dateString
    }
  }

  const formatDeadline = (dateString: string) => {
    try {
      const date = new Date(dateString)
      const now = new Date()
      const isExpired = date < now
      
      return {
        formatted: date.toLocaleDateString('id-ID', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        isExpired
      }
    } catch {
      return { formatted: dateString, isExpired: false }
    }
  }

  const getKategoriColor = (kategori: string) => {
    switch (kategori) {
      case 'Magang': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Beasiswa': return 'bg-green-100 text-green-800 border-green-200'
      case 'Lowongan': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'Sertifikasi': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Kompetisi': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat detail info karier...</p>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h1>
          <p className="text-gray-600 mb-6">{error || 'Info karier tidak ditemukan'}</p>
          <Link 
            href="/infoprof"
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            ← Kembali ke Info Karier
          </Link>
        </div>
      </div>
    )
  }

  const deadlineInfo = post.deadline ? formatDeadline(post.deadline) : null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link 
              href="/infoprof"
              className="flex items-center text-green-600 hover:text-green-700 font-medium"
            >
              ← Kembali ke Info Karier
            </Link>
            <Link 
              href="/"
              className="text-gray-600 hover:text-gray-900"
            >
              🏠 Beranda
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header with Poster */}
          {post.poster_url && (
            <ResponsivePoster
              src={post.poster_url}
              alt={post.judul}
              containerClassName="max-h-[400px]"
              showOverlay={true}
              overlayContent={
                <div className="absolute bottom-4 left-4 z-10">
                  <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full shadow-sm ${getKategoriColor(post.kategori)}`}>
                    {post.kategori}
                  </span>
                </div>
              }
            />
          )}

          <div className="p-6 md:p-8">
            {/* Category (if no poster) */}
            {!post.poster_url && (
              <div className="mb-4">
                <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full border ${getKategoriColor(post.kategori)}`}>
                  {post.kategori}
                </span>
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {post.judul}
            </h1>

            {/* Meta Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">📅 Dipublikasi</p>
                <p className="font-medium text-gray-900">{formatDate(post.tanggal_post)}</p>
              </div>
              
              {post.sumber && (
                <div>
                  <p className="text-sm text-gray-600">🏢 Sumber</p>
                  <p className="font-medium text-gray-900">{post.sumber}</p>
                </div>
              )}

              {deadlineInfo && (
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600">⏰ Deadline</p>
                  <p className={`font-bold text-lg ${deadlineInfo.isExpired ? 'text-red-600' : 'text-red-500'}`}>
                    {deadlineInfo.formatted}
                    {deadlineInfo.isExpired && (
                      <span className="ml-2 text-sm bg-red-100 text-red-800 px-2 py-1 rounded">
                        EXPIRED
                      </span>
                    )}
                  </p>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
              <p className="text-gray-800 leading-relaxed">{post.deskripsi}</p>
            </div>

            {/* Content */}
            {post.content && (
              <div className="prose prose-lg max-w-none mb-8">
                <div 
                  className="text-gray-800 leading-relaxed"
                  style={{ whiteSpace: 'pre-wrap' }}
                >
                  {post.content}
                </div>
              </div>
            )}

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-600 mb-2">🏷️ Tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-block px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              {post.link_utama && (
                <a
                  href={post.link_utama}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition"
                >
                  🔗 Link Pendaftaran
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}

              {post.kontak_email && (
                <a
                  href={`mailto:${post.kontak_email}?subject=Pertanyaan tentang ${post.judul}`}
                  className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
                >
                  ✉️ Kontak Email
                </a>
              )}
            </div>
          </div>
        </article>

        {/* Related or Back to List */}
        <div className="mt-8 text-center">
          <Link 
            href="/infoprof"
            className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
          >
            📋 Lihat Info Karier Lainnya
          </Link>
        </div>
      </main>
    </div>
  )
}
