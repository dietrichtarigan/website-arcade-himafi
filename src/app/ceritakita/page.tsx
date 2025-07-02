'use client'

import { useState } from 'react'
import Image from 'next/image'

const dummyCerita = [
  {
    id: 1,
    nama: 'Ahmad Fauzi',
    gambar: '/uploads/cerita1.jpg',
    cerita: 'Setelah lulus dari Fisika ITB, saya memulai karier sebagai Data Scientist di startup teknologi. Pengalaman belajar fisika memberikan saya kemampuan analisis yang kuat dalam menghadapi masalah kompleks.',
    publish_date: '2024-07-01'
  },
  {
    id: 2,
    nama: 'Sarah Putri',
    gambar: '/uploads/cerita2.jpg',
    cerita: 'Dari Fisika ITB ke Software Engineering di Google. Fisika mengajarkan saya cara berpikir sistematis yang sangat berguna dalam pengembangan software.',
    publish_date: '2024-06-15'
  },
  {
    id: 3,
    nama: 'Budi Santoso',
    gambar: '/uploads/cerita3.jpg',
    cerita: 'Saya sekarang bekerja sebagai Research Analyst di lembaga penelitian. Ilmu fisika yang dipelajari di ITB menjadi fondasi kuat untuk karier riset saya.',
    publish_date: '2024-05-20'
  }
]

export default function CeritaKitaPage() {
  const [selectedCerita, setSelectedCerita] = useState(null)

  const publishedCerita = dummyCerita.filter(cerita => 
    new Date(cerita.publish_date) <= new Date()
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-700 to-purple-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            CeritaKita
          </h1>
          <p className="text-xl md:text-2xl text-purple-100">
            Cerita inspiratif alumni Fisika ITB
          </p>
        </div>
      </section>

      {/* Cerita Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {publishedCerita.map(cerita => (
              <div key={cerita.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                      {cerita.gambar ? (
                        <Image
                          src={cerita.gambar}
                          alt={cerita.nama}
                          width={64}
                          height={64}
                          className="rounded-full"
                        />
                      ) : (
                        <span className="text-2xl font-bold text-purple-600">
                          {cerita.nama.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{cerita.nama}</h3>
                      <p className="text-gray-600 text-sm">{new Date(cerita.publish_date).toLocaleDateString('id-ID')}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{cerita.cerita}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
} 