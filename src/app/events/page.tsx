'use client'

const dummyEvents = [
  {
    id: 1,
    nama_acara: 'Seminar Karier Fisika ITB 2024',
    tanggal: '2024-08-15',
    deskripsi: 'Seminar karier untuk mahasiswa Fisika ITB dengan pembicara alumni sukses.',
    rsvp: 'https://forms.gle/example1',
    feedback: 'https://forms.gle/example2'
  },
  {
    id: 2,
    nama_acara: 'Silaturahmi Alumni Fisika ITB',
    tanggal: '2024-09-20',
    deskripsi: 'Acara silaturahmi tahunan alumni Fisika ITB untuk networking dan sharing.',
    rsvp: 'https://forms.gle/example3',
    feedback: 'https://forms.gle/example4'
  },
  {
    id: 3,
    nama_acara: 'Workshop Data Science untuk Fisikawan',
    tanggal: '2024-10-05',
    deskripsi: 'Workshop praktis data science yang relevan untuk lulusan fisika.',
    rsvp: 'https://forms.gle/example5',
    feedback: 'https://forms.gle/example6'
  }
]

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-700 to-orange-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            INSIGHT & SINERGI
          </h1>
          <p className="text-xl md:text-2xl text-orange-100">
            Event seminar dan silaturahmi alumni Fisika ITB
          </p>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">Event Mendatang</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {dummyEvents.map((event: any) => (
              <div key={event.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.nama_acara}</h3>
                <p className="text-orange-600 font-medium mb-4">
                  {new Date(event.tanggal).toLocaleDateString('id-ID', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
                <p className="text-gray-700 mb-6">{event.deskripsi}</p>
                <div className="space-y-3">
                  {event.rsvp && (
                    <a
                      href={event.rsvp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full bg-orange-600 text-white text-center py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      RSVP Event
                    </a>
                  )}
                  {event.feedback && (
                    <a
                      href={event.feedback}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full border border-orange-600 text-orange-600 text-center py-2 px-4 rounded-lg hover:bg-orange-50 transition-colors"
                    >
                      Berikan Feedback
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-orange-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ingin Mengadakan Event?
          </h2>
          <p className="text-xl mb-8 text-orange-100">
            Hubungi kami untuk mengadakan event seminar atau silaturahmi alumni
          </p>
          <a 
            href="/contact" 
            className="bg-white text-orange-900 px-8 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
          >
            Hubungi Kami
          </a>
        </div>
      </section>
    </div>
  )
} 