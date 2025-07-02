'use client'

import { useState } from 'react'

const dummyDocuments = [
  {
    id: 1,
    judul: 'Panduan Karier Fisika ITB 2024',
    file: '/uploads/panduan-karier-2024.pdf',
    deskripsi: 'Panduan lengkap untuk mahasiswa Fisika ITB dalam merencanakan karier pasca lulus.',
    ukuran: '2.5 MB'
  },
  {
    id: 2,
    judul: 'Template CV untuk Fisikawan',
    file: '/uploads/template-cv-fisikawan.pdf',
    deskripsi: 'Template CV yang disesuaikan untuk lulusan fisika dengan berbagai bidang karier.',
    ukuran: '1.8 MB'
  },
  {
    id: 3,
    judul: 'Proposal Program ALIVE 2024',
    file: '/uploads/proposal-alive-2024.pdf',
    deskripsi: 'Proposal lengkap program ALIVE (Alumni Verification) untuk tahun 2024.',
    ukuran: '3.2 MB'
  },
  {
    id: 4,
    judul: 'Laporan Kegiatan INFOPROF 2023',
    file: '/uploads/laporan-infoprof-2023.pdf',
    deskripsi: 'Laporan kegiatan INFOPROF tahun 2023 dengan statistik dan evaluasi.',
    ukuran: '4.1 MB'
  },
  {
    id: 5,
    judul: 'Buku Saku Alumni Fisika ITB',
    file: '/uploads/buku-saku-alumni.pdf',
    deskripsi: 'Buku saku berisi informasi penting untuk alumni Fisika ITB.',
    ukuran: '1.5 MB'
  },
  {
    id: 6,
    judul: 'Proposal Company Visit 2024',
    file: '/uploads/proposal-company-visit-2024.pdf',
    deskripsi: 'Proposal program kunjungan industri untuk tahun 2024.',
    ukuran: '2.8 MB'
  }
]

export default function ReaktorPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredDocuments = dummyDocuments.filter(doc =>
    doc.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.deskripsi.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-yellow-700 to-yellow-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            REAKTOR
          </h1>
          <p className="text-xl md:text-2xl text-yellow-100">
            Download dokumen dan proposal terkait pengembangan karier
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Cari Dokumen</h2>
            <input
              type="text"
              placeholder="Cari berdasarkan judul atau deskripsi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
            <div className="mt-4 text-gray-600">
              Ditemukan {filteredDocuments.length} dokumen
            </div>
          </div>
        </div>
      </section>

      {/* Documents Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredDocuments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDocuments.map(doc => (
                <div key={doc.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-500">{doc.ukuran}</span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{doc.judul}</h3>
                  <p className="text-gray-600 mb-4">{doc.deskripsi}</p>
                  
                  <a
                    href={doc.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-yellow-600 text-white text-center py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors"
                  >
                    Download PDF
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada dokumen ditemukan</h3>
              <p className="text-gray-600">Coba ubah kata kunci pencarian Anda</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-yellow-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Butuh Dokumen Lain?
          </h2>
          <p className="text-xl mb-8 text-yellow-100">
            Hubungi kami jika Anda membutuhkan dokumen atau proposal tertentu
          </p>
          <a 
            href="/contact" 
            className="bg-white text-yellow-900 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-50 transition-colors"
          >
            Hubungi Kami
          </a>
        </div>
      </section>
    </div>
  )
} 