'use client'

import { useState, useEffect } from 'react'
import ResponsivePoster from '../../components/ResponsivePoster'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

interface InfoProfPost {
  id: string
  judul: string
  kategori: string
  tanggal_post: string
  deskripsi: string
  link_utama?: string
  kontak_email?: string
  sumber: string
  content: string
  poster_url?: string
  arsip?: boolean
  [key: string]: any
}

// Fungsi untuk mendapatkan data dari folder content
function getStaticInfoProf() {
  // Implementasi dummy untuk client-side
  // Data sebenarnya akan diambil saat build di Netlify
  return [
    {
      id: 'magang-telkom-2024-07-01',
      judul: 'Magang Data Scientist di Telkom',
      kategori: 'Magang',
      tanggal_post: '2024-07-01T00:00:00.000Z',
      deskripsi: 'Program magang data scientist di Telkom Indonesia',
      link_utama: 'https://telkom.co.id',
      kontak_email: 'recruitment@telkom.co.id',
      sumber: 'Telkom Indonesia',
      content: '',
      arsip: false
    },
    {
      id: 'magang-brin-2025',
      judul: 'Magang BRIN Batch 1 – 2025',
      kategori: 'Magang',
      tanggal_post: '2024-07-01T00:00:00.000Z',
      deskripsi: 'Program magang nasional dari BRIN untuk mahasiswa yang tertarik menekuni dunia riset dan inovasi langsung bersama peneliti.',
      link_utama: 'https://elsa.brin.go.id',
      kontak_email: 'mbkm@brin.go.id',
      sumber: 'BRIN - Direktorat Manajemen Talenta',
      content: '',
      arsip: false
    }
  ]
}

export default function InfoProfPage() {
  const [allInfo, setAllInfo] = useState<InfoProfPost[]>([])
  const [filteredInfo, setFilteredInfo] = useState<InfoProfPost[]>([])
  const [selectedKategori, setSelectedKategori] = useState('Semua')
  const [selectedArsip, setSelectedArsip] = useState('Aktif')
  const [isLoading, setIsLoading] = useState(true)

  // Load CMS content on component mount
  useEffect(() => {
    // Fetch data from the API endpoint that will provide content data
    async function fetchContent() {
      try {
        const response = await fetch('/api/content/infoprof')
        if (!response.ok) throw new Error('Failed to fetch content')
        const result = await response.json()
        
        if (result.success && result.data) {
          const processedData = result.data.map((item: any) => ({
            id: item.slug,
            judul: item.judul || 'No Title',
            kategori: item.kategori || 'Lainnya',
            tanggal_post: item.tanggal_post || new Date().toISOString(),
            deskripsi: item.deskripsi || 'No description',
            link_utama: item.link_utama,
            kontak_email: item.kontak_email,
            sumber: item.sumber,
            content: item.content || '',
            poster_url: item.poster_url,
            deadline: item.deadline,
            arsip: item.arsip || false
          }))
          setAllInfo(processedData)
          setFilteredInfo(processedData)
        } else {
          // Fallback to static data if API response is not valid
          const data = getStaticInfoProf()
          setAllInfo(data)
          setFilteredInfo(data)
        }
      } catch (error) {
        console.error('Error loading content:', error)
        // Fallback to static data if API fails
        const data = getStaticInfoProf()
        setAllInfo(data)
        setFilteredInfo(data)
      } finally {
        setIsLoading(false)
      }
    }

    fetchContent()
  }, [])

  // Filter content when filters change
  useEffect(() => {
    if (!allInfo) return
    
    const filtered = allInfo.filter(info => {
      const kategoriMatch = selectedKategori === 'Semua' || info.kategori === selectedKategori
      const arsipMatch = selectedArsip === 'Semua' || 
                        (selectedArsip === 'Aktif' && !info.arsip) || 
                        (selectedArsip === 'Arsip' && info.arsip)
      
      return kategoriMatch && arsipMatch
    })
    
    setFilteredInfo(filtered)
  }, [allInfo, selectedKategori, selectedArsip])

  const kategoriOptions = ['Semua', 'Magang', 'Beasiswa', 'Lowongan']
  const arsipOptions = ['Aktif', 'Arsip', 'Semua']

  const getKategoriColor = (kategori: string) => {
    switch (kategori) {
      case 'Magang': return 'bg-blue-100 text-blue-800'
      case 'Beasiswa': return 'bg-green-100 text-green-800'
      case 'Lowongan': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('id-ID', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    } catch {
      return dateString
    }
  }

  const formatDeadline = (deadlineString: string) => {
    try {
      const deadline = new Date(deadlineString)
      return deadline.toLocaleDateString('id-ID', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    } catch {
      return deadlineString
    }
  }

  const isDeadlineClose = (deadlineString: string) => {
    try {
      const deadline = new Date(deadlineString)
      const now = new Date()
      const diffDays = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      return diffDays <= 7 // Deadline dalam 7 hari atau sudah lewat
    } catch {
      return false
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-700 to-green-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Info Karier (INFOPROF)
          </h1>
          <p className="text-xl md:text-2xl text-green-100">
            Papan digital info magang, lowongan kerja, dan beasiswa untuk Fisika ITB
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Filter Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                <select
                  value={selectedKategori}
                  onChange={e => setSelectedKategori(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {kategoriOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={selectedArsip}
                  onChange={e => setSelectedArsip(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {arsipOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-6 text-gray-600">
              Ditemukan {filteredInfo.length} info
            </div>
          </div>
        </div>
      </section>

      {/* Info Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Memuat info karier...</p>
            </div>
          ) : filteredInfo.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredInfo.map(info => (
                <div 
                  key={info.id} 
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden cursor-pointer group"
                  onClick={() => window.open(`/infoprof/${info.id}`, '_blank')}
                >
                  {/* Poster Image */}
                  {info.poster_url && (
                    <ResponsivePoster
                      src={info.poster_url}
                      alt={info.judul}
                      className="group-hover:scale-[1.02]"
                      showOverlay={false}
                      overlayContent={
                        <div className="absolute inset-0 pointer-events-auto">
                          <div className="absolute top-4 left-4 z-10">
                            <span className={`px-3 py-1 text-sm font-medium rounded-full shadow-sm ${getKategoriColor(info.kategori)}`}>
                              {info.kategori}
                            </span>
                          </div>
                          {/* Deadline badge on poster */}
                          {info.deadline && (
                            <div className="absolute top-4 right-4 z-10">
                              <span className={`px-2 py-1 text-xs font-bold rounded shadow-sm ${
                                isDeadlineClose(info.deadline) 
                                  ? 'bg-red-500 text-white' 
                                  : 'bg-orange-500 text-white'
                              }`}>
                                ⏰ {formatDeadline(info.deadline)}
                              </span>
                            </div>
                          )}
                        </div>
                      }
                    />
                  )}
                  
                  {/* Content */}
                  <div className="p-6">
                    {/* Header (only show if no poster) */}
                    {!info.poster_url && (
                      <div className="flex items-start justify-between mb-4">
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${getKategoriColor(info.kategori)}`}>
                          {info.kategori}
                        </span>
                        <span className="text-sm text-gray-500">
                          {formatDate(info.tanggal_post)}
                        </span>
                      </div>
                    )}
                    
                    {/* Date (show for cards with poster) */}
                    {info.poster_url && (
                      <div className="mb-3">
                        <span className="text-sm text-gray-500">
                          {formatDate(info.tanggal_post)}
                        </span>
                      </div>
                    )}
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                      {info.judul}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                      {info.deskripsi}
                    </p>

                    {/* Deadline (show for cards without poster) */}
                    {!info.poster_url && info.deadline && (
                      <div className="mb-4">
                        <span className={`inline-flex items-center px-3 py-1 text-sm font-bold rounded ${
                          isDeadlineClose(info.deadline) 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          ⏰ Deadline: {formatDeadline(info.deadline)}
                        </span>
                      </div>
                    )}
                    
                    {/* Links */}
                    {info.link_utama && (
                      <div className="mb-4">
                        <a 
                          href={info.link_utama}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()} // Prevent card click
                          className="inline-flex items-center text-green-600 hover:text-green-700 font-medium text-sm"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          Link Pendaftaran
                        </a>
                      </div>
                    )}
                    
                    {/* Contact */}
                    {info.kontak_email && (
                      <div className="mb-4">
                        <span className="text-sm text-gray-500">Kontak: </span>
                        <a 
                          href={`mailto:${info.kontak_email}`}
                          onClick={(e) => e.stopPropagation()} // Prevent card click
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          {info.kontak_email}
                        </a>
                      </div>
                    )}
                    
                    {/* Source */}
                    {info.sumber && (
                      <div className="text-sm text-gray-500 border-t pt-3">
                        <span className="font-medium">Sumber:</span> {info.sumber}
                      </div>
                    )}

                    {/* Click to view more indicator */}
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <span className="text-sm text-green-600 font-medium group-hover:text-green-700">
                        Klik untuk lihat detail lengkap →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-white rounded-lg shadow-sm p-8">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Info</h3>
                <p className="text-gray-500">
                  {allInfo.length === 0 
                    ? "Belum ada info karier yang dipublikasikan."
                    : "Tidak ada info yang sesuai dengan filter yang dipilih."
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Dapatkan Update Info Karier Terbaru
          </h2>
          <p className="text-xl mb-8 text-green-100">
            Ikuti media sosial kami untuk mendapatkan info magang, beasiswa, dan lowongan kerja terbaru
          </p>
          <div className="flex justify-center space-x-6">
            <a 
              href="https://instagram.com/careerhimafi" 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-green-700 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
            >
              Instagram
            </a>
            <a 
              href="https://linkedin.com/company/himafi-itb" 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-green-700 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
