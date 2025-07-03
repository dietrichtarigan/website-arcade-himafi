'use client'

import { useState, useEffect } from 'react'
import { InfoProfPost } from '@/lib/content'

interface Props {
  initialData: InfoProfPost[]
}

export default function InfoProfClient({ initialData }: Props) {
  const [allInfo] = useState<InfoProfPost[]>(initialData)
  const [filteredInfo, setFilteredInfo] = useState<InfoProfPost[]>(initialData)
  const [selectedKategori, setSelectedKategori] = useState('Semua')
  const [selectedArsip, setSelectedArsip] = useState('Aktif')

  // Filter content when filters change
  useEffect(() => {
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
          {filteredInfo.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredInfo.map(info => (
                <div key={info.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                  {/* Header */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${getKategoriColor(info.kategori)}`}>
                        {info.kategori}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatDate(info.tanggal_post)}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {info.judul}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                      {info.deskripsi}
                    </p>
                    
                    {/* Links */}
                    {info.link_utama && (
                      <div className="mb-4">
                        <a 
                          href={info.link_utama}
                          target="_blank"
                          rel="noopener noreferrer"
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
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          {info.kontak_email}
                        </a>
                      </div>
                    )}
                    
                    {/* Source */}
                    <div className="text-sm text-gray-500 border-t pt-3">
                      <span className="font-medium">Sumber:</span> {info.sumber}
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
