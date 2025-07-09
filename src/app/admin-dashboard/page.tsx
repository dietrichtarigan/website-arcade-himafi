import AdminDashboard from '@/components/AdminDashboard-simple'

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                🎯 ARCADE HIMAFI - Admin Dashboard
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <a 
                href="/admin/" 
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 transition"
              >
                🎨 Netlify CMS
              </a>
              
              <a 
                href="/" 
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition"
              >
                🌐 View Site
              </a>
            </div>
          </div>
        </div>
      </header>

      <main>
        <AdminDashboard />
      </main>
    </div>
  )
}
