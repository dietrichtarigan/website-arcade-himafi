'use client'

const dummyVisits = [
  {
    id: 1,
    perusahaan: 'PT Telkom Indonesia',
    tanggal: '2024-06-15',
    laporan: '/uploads/laporan-telkom.pdf',
    galeri: ['/uploads/telkom1.jpg', '/uploads/telkom2.jpg', '/uploads/telkom3.jpg'],
    testimoni: 'Kunjungan ke Telkom sangat informatif. Kami belajar banyak tentang teknologi telekomunikasi dan peluang karier di industri ini.'
  },
  {
    id: 2,
    perusahaan: 'LIPI (Lembaga Ilmu Pengetahuan Indonesia)',
    tanggal: '2024-05-20',
    laporan: '/uploads/laporan-lipi.pdf',
    galeri: ['/uploads/lipi1.jpg', '/uploads/lipi2.jpg'],
    testimoni: 'LIPI memberikan wawasan mendalam tentang penelitian dan pengembangan di Indonesia.'
  },
  {
    id: 3,
    perusahaan: 'PT Pertamina',
    tanggal: '2024-04-10',
    laporan: '/uploads/laporan-pertamina.pdf',
    galeri: ['/uploads/pertamina1.jpg', '/uploads/pertamina2.jpg', '/uploads/pertamina3.jpg'],
    testimoni: 'Kunjungan ke Pertamina membuka mata kami tentang industri energi dan teknologi yang digunakan.'
  }
]

export default function CompanyVisitPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-700 to-red-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Company Visit
          </h1>
          <p className="text-xl md:text-2xl text-red-100">
            Dokumentasi kunjungan industri dan testimoni mahasiswa
          </p>
        </div>
      </section>

      {/* Company Visits Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {dummyVisits.map((visit: any) => (
              <div key={visit.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{visit.perusahaan}</h3>
                  <p className="text-red-600 font-medium mb-4">
                    {new Date(visit.tanggal).toLocaleDateString('id-ID', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                  
                  {/* Galeri Foto */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Galeri Foto:</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {visit.galeri && visit.galeri.map((foto: string, index: number) => (
                        <img key={index} src={foto} alt={`Galeri ${index + 1}`} className="w-20 h-20 object-cover rounded mr-2" />
                      ))}
                    </div>
                  </div>

                  {/* Testimoni */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Testimoni:</h4>
                    <p className="text-gray-600 text-sm italic">"{visit.testimoni}"</p>
                  </div>

                  {/* Download Laporan */}
                  {visit.laporan && (
                    <a
                      href={visit.laporan}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full bg-red-600 text-white text-center py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Download Laporan
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-red-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ingin Mengadakan Company Visit?
          </h2>
          <p className="text-xl mb-8 text-red-100">
            Hubungi kami untuk mengatur kunjungan industri ke perusahaan mitra
          </p>
          <a 
            href="/contact" 
            className="bg-white text-red-900 px-8 py-3 rounded-lg font-semibold hover:bg-red-50 transition-colors"
          >
            Hubungi Kami
          </a>
        </div>
      </section>
    </div>
  )
} 