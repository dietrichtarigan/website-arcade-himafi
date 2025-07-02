export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Tentang ARCADE
          </h1>
          <p className="text-xl md:text-2xl text-blue-100">
            Divisi Pengembangan Karier dan Relasi Alumni HIMAFI ITB
          </p>
        </div>
      </section>

      {/* About Content */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-8 text-gray-900">Visi & Misi</h2>
            
            <div className="mb-12">
              <h3 className="text-xl font-semibold mb-4 text-blue-900">Visi</h3>
              <p className="text-gray-700 leading-relaxed">
                Menjadi divisi terdepan dalam pengembangan karier dan relasi alumni yang menghubungkan mahasiswa Fisika ITB dengan peluang karier terbaik dan jaringan profesional yang luas.
              </p>
            </div>

            <div className="mb-12">
              <h3 className="text-xl font-semibold mb-4 text-blue-900">Misi</h3>
              <ul className="text-gray-700 leading-relaxed space-y-3">
                <li>• Membangun dan memelihara database alumni Fisika ITB yang komprehensif</li>
                <li>• Menyediakan informasi lowongan kerja, magang, dan beasiswa terkini</li>
                <li>• Memfasilitasi networking antara mahasiswa dan alumni</li>
                <li>• Mengorganisir event pengembangan karier dan sharing session</li>
                <li>• Menyediakan dokumentasi dan resources untuk pengembangan karier</li>
              </ul>
            </div>

            <div className="mb-12">
              <h3 className="text-xl font-semibold mb-4 text-blue-900">Program Unggulan</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">ALIVE (Alumni Verification)</h4>
                  <p className="text-gray-700 text-sm">Database alumni dengan filter bidang karier, angkatan, dan keterhubungan</p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">INFOPROF</h4>
                  <p className="text-gray-700 text-sm">Papan digital info magang, lowongan kerja, dan beasiswa</p>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-2">CeritaKita</h4>
                  <p className="text-gray-700 text-sm">Cerita inspiratif alumni dengan pengalaman karier</p>
                </div>
                <div className="bg-orange-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-orange-900 mb-2">INSIGHT & SINERGI</h4>
                  <p className="text-gray-700 text-sm">Event seminar dan silaturahmi alumni</p>
                </div>
                <div className="bg-red-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-red-900 mb-2">Company Visit</h4>
                  <p className="text-gray-700 text-sm">Dokumentasi kunjungan industri</p>
                </div>
                <div className="bg-yellow-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-yellow-900 mb-2">REAKTOR</h4>
                  <p className="text-gray-700 text-sm">Download dokumen dan proposal karier</p>
                </div>
              </div>
            </div>

            <div className="mb-12">
              <h3 className="text-xl font-semibold mb-4 text-blue-900">Struktur Organisasi</h3>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="text-center mb-6">
                  <h4 className="font-semibold text-lg text-gray-900">Kepala Divisi ARCADE</h4>
                  <p className="text-gray-600">[Nama Kepala Divisi]</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <h5 className="font-semibold text-gray-900 mb-2">Koordinator ALIVE</h5>
                    <p className="text-gray-600 text-sm">[Nama Koordinator]</p>
                  </div>
                  <div className="text-center">
                    <h5 className="font-semibold text-gray-900 mb-2">Koordinator INFOPROF</h5>
                    <p className="text-gray-600 text-sm">[Nama Koordinator]</p>
                  </div>
                  <div className="text-center">
                    <h5 className="font-semibold text-gray-900 mb-2">Koordinator Event</h5>
                    <p className="text-gray-600 text-sm">[Nama Koordinator]</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-blue-900">Kontak</h3>
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-700"><strong>Email:</strong> arcade@himafi.itb.ac.id</p>
                    <p className="text-gray-700"><strong>Instagram:</strong> @careerhimafi</p>
                  </div>
                  <div>
                    <p className="text-gray-700"><strong>LinkedIn:</strong> HIMAFI ITB</p>
                    <p className="text-gray-700"><strong>Alamat:</strong> Sekretariat HIMAFI ITB</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 