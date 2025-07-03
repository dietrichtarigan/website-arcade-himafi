'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const dummyInfo = [
  {
    id: 1,
    judul: 'Magang BRIN Batch 1 – 2025',
    kategori: 'Magang',
    tanggal_post: '2024-07-01',
    deskripsi: 'Program magang nasional dari BRIN untuk mahasiswa yang tertarik menekuni dunia riset dan inovasi langsung bersama peneliti.',
    link_utama: 'https://elsa.brin.go.id',
    link_tambahan: ['https://elsa.brin.go.id/subkategori/index/MBKM/26'],
    kontak: {
      email: 'mbkm@brin.go.id'
    },
    sumber: 'BRIN - Direktorat Manajemen Talenta',
    poster_filename: '/uploads/magang-brin-2025.png',
    arsip: false
  },
  {
    id: 2,
    judul: 'Lowongan Kerja PT Pertamina',
    kategori: 'Lowongan',
    tanggal_post: '2024-06-20',
    deskripsi: 'PT Pertamina membuka lowongan untuk posisi Research Analyst dengan fokus pada analisis data energi.',
    link_utama: 'https://pertamina.com/karir',
    link_tambahan: [],
    kontak: {
      email: 'recruitment@pertamina.com',
      wa: '08123456789'
    },
    sumber: 'PT Pertamina',
    poster_filename: '/uploads/lowongan-pertamina-2024.png',
    arsip: false
  },
  {
    id: 3,
    judul: 'Beasiswa S2 Luar Negeri 2025',
    kategori: 'Beasiswa',
    tanggal_post: '2024-05-15',
    deskripsi: 'Beasiswa penuh untuk S2 Fisika di berbagai universitas terkemuka di luar negeri.',
    link_utama: 'https://beasiswa.com',
    link_tambahan: ['https://beasiswa.com/apply', 'https://beasiswa.com/faq'],
    kontak: {
      email: 'info@beasiswa.com'
    },
    sumber: 'Kementerian Pendidikan dan Kebudayaan',
    poster_filename: '/uploads/beasiswa-s2-2025.png',
    arsip: false
  },
  {
    id: 4,
    judul: 'Magang R&D di LIPI',
    kategori: 'Magang',
    tanggal_post: '2024-04-10',
    deskripsi: 'Magang riset di LIPI untuk mahasiswa tingkat akhir yang ingin berkontribusi dalam penelitian nasional.',
    link_utama: 'https://lipi.go.id/magang',
    link_tambahan: [],
    kontak: {
      email: 'magang@lipi.go.id'
    },
    sumber: 'LIPI - Lembaga Ilmu Pengetahuan Indonesia',
    poster_filename: '/uploads/magang-lipi-2024.png',
    arsip: true
  }
]

const kategoriOptions = ['Semua', 'Magang', 'Beasiswa', 'Lowongan']
const arsipOptions = ['Semua', 'Aktif', 'Arsip']

export default function InfoProfPage() {
  const [selectedKategori, setSelectedKategori] = useState('Semua')
  const [selectedArsip, setSelectedArsip] = useState('Aktif')

  const filteredInfo = dummyInfo.filter(info => {
    const matchesKategori = selectedKategori === 'Semua' || info.kategori === selectedKategori
    const matchesArsip = selectedArsip === 'Semua' || (selectedArsip === 'Aktif' ? !info.arsip : info.arsip)
    return matchesKategori && matchesArsip
  })

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
                  {/* Poster Image */}
                  {info.poster_filename && (
                    <div className="h-48 bg-gray-200 flex items-center justify-center">
                      <div className="text-center">
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm text-gray-500">Poster {info.judul}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{info.judul}</h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-2 ${
                      info.kategori === 'Magang' ? 'bg-green-100 text-green-800' :
                      info.kategori === 'Lowongan' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {info.kategori}
                    </span>
                    <p className="text-gray-600 mb-4">{info.deskripsi}</p>
                    
                    {/* Sumber */}
                    <p className="text-sm text-gray-500 mb-3">
                      <strong>Sumber:</strong> {info.sumber}
                    </p>
                    
                    {/* Kontak */}
                    {info.kontak && (
                      <div className="mb-4">
                        {info.kontak.email && (
                          <p className="text-sm text-gray-600">
                            📧 {info.kontak.email}
                          </p>
                        )}
                        {info.kontak.wa && (
                          <p className="text-sm text-gray-600">
                            📱 {info.kontak.wa}
                          </p>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-sm text-gray-500">
                        {new Date(info.tanggal_post).toLocaleDateString('id-ID')}
                      </span>
                      <div className="space-x-2">
                        {info.link_utama && (
                          <a
                            href={info.link_utama}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-700 hover:text-green-900 font-medium text-sm"
                          >
                            Link Utama
                          </a>
                        )}
                        {info.link_tambahan && info.link_tambahan.length > 0 && (
                          <a
                            href={info.link_tambahan[0]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-700 hover:text-blue-900 font-medium text-sm"
                          >
                            Info Tambahan
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada info ditemukan</h3>
              <p className="text-gray-600">Coba ubah filter pencarian Anda</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
} 