import AdminDashboard from '@/components/AdminDashboard'
import RealTimeStatus from '@/components/RealTimeStatus'
import { CMSProvider } from '@/components/CMSProvider'

export default function AdminPage() {
  return (
    <CMSProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-gray-900">
                  🎯 ARCADE HIMAFI - Advanced CMS
                </h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <RealTimeStatus 
                  userId="admin" 
                  username="Administrator"
                  className="flex items-center space-x-2"
                />
                
                <div className="flex space-x-2">
                  <a 
                    href="/admin/" 
                    target="_blank"
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 transition"
                  >
                    🎨 Full CMS
                  </a>
                  
                  <a 
                    href="/admin-simple.html" 
                    target="_blank"
                    className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition"
                  >
                    ⚡ Simple Admin
                  </a>
                  
                  <a 
                    href="/" 
                    target="_blank"
                    className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition"
                  >
                    🌐 View Site
                  </a>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <AdminDashboard />
        </main>

        {/* Footer */}
        <footer className="bg-white border-t mt-12">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                <p>© 2025 ARCADE HIMAFI - Advanced Content Management System</p>
                <p className="mt-1">Built with Next.js, TypeScript, and Tailwind CSS</p>
              </div>
              
              <div className="flex space-x-6 text-sm">
                <a href="/docs" className="text-gray-400 hover:text-gray-500">
                  📚 Documentation
                </a>
                <a href="https://github.com/your-repo" className="text-gray-400 hover:text-gray-500">
                  💻 GitHub
                </a>
                <a href="/api/admin/health" className="text-gray-400 hover:text-gray-500">
                  ⚡ API Status
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </CMSProvider>
  )
}
