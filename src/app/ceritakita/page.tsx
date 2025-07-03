'use client'

export default function CeritaKitaPage() {
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
            {dummyCerita.map(cerita => (
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