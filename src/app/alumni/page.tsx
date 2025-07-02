'use client'

import { useState } from 'react'
import Image from 'next/image'

// Dummy data alumni
const dummyAlumni = [
  {
    id: 1,
    nama: 'Ahmad Fauzi',
    angkatan: '2019',
    bidang: 'Data Science',
    linkedin: 'https://linkedin.com/in/ahmad-fauzi',
    foto: '/uploads/alumni1.jpg',
    keterhubungan: 'Aktif'
  },
  {
    id: 2,
    nama: 'Sarah Putri',
    angkatan: '2020',
    bidang: 'Software Engineering',
    linkedin: 'https://linkedin.com/in/sarah-putri',
    foto: '/uploads/alumni2.jpg',
    keterhubungan: 'Aktif'
  },
  {
    id: 3,
    nama: 'Budi Santoso',
    angkatan: '2018',
    bidang: 'Research & Development',
    linkedin: 'https://linkedin.com/in/budi-santoso',
    foto: '/uploads/alumni3.jpg',
    keterhubungan: 'Moderat'
  },
  {
    id: 4,
    nama: 'Dewi Sari',
    angkatan: '2021',
    bidang: 'Consulting',
    linkedin: 'https://linkedin.com/in/dewi-sari',
    foto: '/uploads/alumni4.jpg',
    keterhubungan: 'Aktif'
  },
  {
    id: 5,
    nama: 'Rizki Pratama',
    angkatan: '2017',
    bidang: 'Finance',
    linkedin: 'https://linkedin.com/in/rizki-pratama',
    foto: '/uploads/alumni5.jpg',
    keterhubungan: 'Pasif'
  },
  {
    id: 6,
    nama: 'Nina Kartika',
    angkatan: '2020',
    bidang: 'Data Science',
    linkedin: 'https://linkedin.com/in/nina-kartika',
    foto: '/uploads/alumni6.jpg',
    keterhubungan: 'Aktif'
  }
]

const bidangOptions = ['Semua', 'Data Science', 'Software Engineering', 'Research & Development', 'Consulting', 'Finance']
const angkatanOptions = ['Semua', '2017', '2018', '2019', '2020', '2021', '2022', '2023']
const keterhubunganOptions = ['Semua', 'Aktif', 'Moderat', 'Pasif']

export default function AlumniPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBidang, setSelectedBidang] = useState('Semua')
  const [selectedAngkatan, setSelectedAngkatan] = useState('Semua')
  const [selectedKeterhubungan, setSelectedKeterhubungan] = useState('Semua')

  const filteredAlumni = dummyAlumni.filter(alumni => {
    const matchesSearch = alumni.nama.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesBidang = selectedBidang === 'Semua' || alumni.bidang === selectedBidang
    const matchesAngkatan = selectedAngkatan === 'Semua' || alumni.angkatan === selectedAngkatan
    const matchesKeterhubungan = selectedKeterhubungan === 'Semua' || alumni.keterhubungan === selectedKeterhubungan

    return matchesSearch && matchesBidang && matchesAngkatan && matchesKeterhubungan
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            ALIVE
          </h1>
          <p className="text-xl md:text-2xl text-blue-100">
            Alumni Verification - Database Alumni Fisika ITB
          </p>
          <p className="text-lg mt-4 text-blue-200 max-w-3xl mx-auto">
            Temukan dan hubungi alumni Fisika ITB berdasarkan bidang karier, angkatan, dan tingkat keterhubungan
          </p>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Cari Alumni</h2>
            
            {/* Search Bar */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Cari berdasarkan nama..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bidang Karier
                </label>
                <select
                  value={selectedBidang}
                  onChange={(e) => setSelectedBidang(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {bidangOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Angkatan
                </label>
                <select
                  value={selectedAngkatan}
                  onChange={(e) => setSelectedAngkatan(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {angkatanOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keterhubungan
                </label>
                <select
                  value={selectedKeterhubungan}
                  onChange={(e) => setSelectedKeterhubungan(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {keterhubunganOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-6 text-gray-600">
              Ditemukan {filteredAlumni.length} alumni
            </div>
          </div>
        </div>
      </section>

      {/* Alumni Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredAlumni.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAlumni.map((alumni) => (
                <div key={alumni.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                        {alumni.foto ? (
                          <Image
                            src={alumni.foto}
                            alt={alumni.nama}
                            width={64}
                            height={64}
                            className="rounded-full"
                          />
                        ) : (
                          <span className="text-2xl font-bold text-blue-600">
                            {alumni.nama.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{alumni.nama}</h3>
                        <p className="text-gray-600">Angkatan {alumni.angkatan}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Bidang:</span>
                        <p className="text-gray-900">{alumni.bidang}</p>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium text-gray-500">Keterhubungan:</span>
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                          alumni.keterhubungan === 'Aktif' ? 'bg-green-100 text-green-800' :
                          alumni.keterhubungan === 'Moderat' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {alumni.keterhubungan}
                        </span>
                      </div>

                      {alumni.linkedin && (
                        <a
                          href={alumni.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                        >
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                          LinkedIn Profile
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada alumni ditemukan</h3>
              <p className="text-gray-600">Coba ubah filter pencarian Anda</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Bergabung dengan Database Alumni
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Apakah Anda alumni Fisika ITB? Daftarkan diri Anda untuk terhubung dengan jaringan alumni
          </p>
          <a 
            href="/livinglink" 
            className="bg-white text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Daftar sebagai Alumni
          </a>
        </div>
      </section>
    </div>
  )
} 