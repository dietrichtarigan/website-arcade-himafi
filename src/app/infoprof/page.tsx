'use client'

import { useState } from 'react'
import Link from 'next/link'

const dummyInfo = [
  {
    id: 1,
    judul: 'Magang Data Scientist di Telkom',
    jenis: 'Magang',
    tanggal: '2024-07-01',
    deskripsi: 'Kesempatan magang di Telkom Indonesia untuk mahasiswa Fisika ITB.',
    link: 'https://telkom.co.id/magang',
    arsip: false
  },
  {
    id: 2,
    judul: 'Lowongan Kerja PT Pertamina',
    jenis: 'Lowongan Kerja',
    tanggal: '2024-06-20',
    deskripsi: 'PT Pertamina membuka lowongan untuk posisi Research Analyst.',
    link: 'https://pertamina.com/karir',
    arsip: false
  },
  {
    id: 3,
    judul: 'Beasiswa S2 Luar Negeri',
    jenis: 'Beasiswa',
    tanggal: '2024-05-15',
    deskripsi: 'Beasiswa penuh untuk S2 Fisika di luar negeri.',
    link: 'https://beasiswa.com',
    arsip: false
  },
  {
    id: 4,
    judul: 'Magang R&D di LIPI',
    jenis: 'Magang',
    tanggal: '2024-04-10',
    deskripsi: 'Magang riset di LIPI untuk mahasiswa tingkat akhir.',
    link: 'https://lipi.go.id/magang',
    arsip: true
  }
]

const jenisOptions = ['Semua', 'Magang', 'Lowongan Kerja', 'Beasiswa']
const arsipOptions = ['Semua', 'Aktif', 'Arsip']

export default function InfoProfPage() {
  const [selectedJenis, setSelectedJenis] = useState('Semua')
  const [selectedArsip, setSelectedArsip] = useState('Aktif')

  const filteredInfo = dummyInfo.filter(info => {
    const matchesJenis = selectedJenis === 'Semua' || info.jenis === selectedJenis
    const matchesArsip = selectedArsip === 'Semua' || (selectedArsip === 'Aktif' ? !info.arsip : info.arsip)
    return matchesJenis && matchesArsip
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Info</label>
                <select
                  value={selectedJenis}
                  onChange={e => setSelectedJenis(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {jenisOptions.map(option => (
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
                <div key={info.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{info.judul}</h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-2 ${
                      info.jenis === 'Magang' ? 'bg-green-100 text-green-800' :
                      info.jenis === 'Lowongan Kerja' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {info.jenis}
                    </span>
                    <p className="text-gray-600 mb-4">{info.deskripsi}</p>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-sm text-gray-500">{new Date(info.tanggal).toLocaleDateString('id-ID')}</span>
                    <a
                      href={info.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-700 hover:text-green-900 font-medium"
                    >
                      Lihat Detail
                    </a>
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