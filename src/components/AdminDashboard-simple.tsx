'use client'

import { useState, useEffect } from 'react'
import InfoProfForm from './InfoProfForm'

interface InfoProfData {
  slug: string
  judul: string
  kategori: string
  tanggal_post: string
  deskripsi: string
  link_utama?: string
  kontak_email?: string
  sumber: string
  content: string
  arsip?: boolean
  tags?: string[]
  deadline?: string
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [showInfoProfForm, setShowInfoProfForm] = useState(false)
  const [infoProfData, setInfoProfData] = useState<InfoProfData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'content', name: 'Content', icon: '📝' },
    { id: 'infoprof', name: 'Info Karier', icon: '💼' },
    { id: 'analytics', name: 'Analytics', icon: '📈' },
    { id: 'users', name: 'Users', icon: '👥' }
  ]

  // Load existing infoprof data
  const loadInfoProfData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/content/infoprof')
      if (response.ok) {
        const result = await response.json()
        setInfoProfData(result.data || [])
      }
    } catch (error) {
      console.error('Error loading infoprof data:', error)
      setMessage({ type: 'error', text: 'Gagal memuat data info karier' })
    } finally {
      setIsLoading(false)
    }
  }

  // Load data on component mount
  useEffect(() => {
    if (activeTab === 'infoprof') {
      loadInfoProfData()
    }
  }, [activeTab])

  // Handle form submission
  const handleInfoProfSubmit = async (formData: any) => {
    try {
      console.log('Submitting form data:', formData)
      
      const response = await fetch('/api/content/infoprof', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      console.log('Response status:', response.status)
      console.log('Response headers:', response.headers)

      // Check if response is JSON
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text()
        console.error('Non-JSON response:', text)
        throw new Error('Server returned non-JSON response. Check server logs.')
      }

      const result = await response.json()
      console.log('Response data:', result)

      if (response.ok && result.success) {
        setMessage({ type: 'success', text: 'Info karier berhasil disimpan!' })
        setShowInfoProfForm(false)
        loadInfoProfData() // Reload data
      } else {
        const errorMsg = result.error || result.message || 'Gagal menyimpan data'
        console.error('API Error:', result)
        setMessage({ type: 'error', text: errorMsg })
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      const errorMsg = error instanceof Error ? error.message : 'Terjadi kesalahan saat menyimpan data'
      setMessage({ type: 'error', text: errorMsg })
    }
  }

  // Clear message after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [message])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Message notification */}
      {message && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-md ${
          message.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {message.text}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Kelola website ARCADE HIMAFI ITB</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-4 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon} {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm font-bold">📄</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Content</dt>
                      <dd className="text-lg font-medium text-gray-900">{infoProfData.length}</dd>
                    </dl>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm font-bold">👀</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Active Info</dt>
                      <dd className="text-lg font-medium text-gray-900">{infoProfData.filter(item => !item.arsip).length}</dd>
                    </dl>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm font-bold">�</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Archived</dt>
                      <dd className="text-lg font-medium text-gray-900">{infoProfData.filter(item => item.arsip).length}</dd>
                    </dl>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm font-bold">⭐</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Latest Update</dt>
                      <dd className="text-lg font-medium text-gray-900">Today</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'content' && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Content Management</h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-400 bg-blue-50 p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-blue-700">
                          <strong>Info Karier:</strong> {infoProfData.length} artikel published
                        </p>
                      </div>
                      <button
                        onClick={() => setActiveTab('infoprof')}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Kelola →
                      </button>
                    </div>
                  </div>
                  <div className="border-l-4 border-green-400 bg-green-50 p-4">
                    <div className="flex">
                      <div className="ml-3">
                        <p className="text-sm text-green-700">
                          <strong>Alumni:</strong> 8 profil tersedia
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4">
                    <div className="flex">
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                          <strong>Events:</strong> 5 event mendatang
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'infoprof' && (
            <div className="space-y-6">
              {/* Header with Add Button */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      💼 Kelola Info Karier & Profesi
                    </h3>
                    <button
                      onClick={() => setShowInfoProfForm(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      ➕ Tambah Info Baru
                    </button>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-6">
                    Kelola informasi karier, magang, beasiswa, dan kesempatan lainnya untuk mahasiswa fisika.
                  </p>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{infoProfData.filter(item => item.kategori === 'Magang').length}</div>
                      <div className="text-xs text-gray-600">Magang</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{infoProfData.filter(item => item.kategori === 'Beasiswa').length}</div>
                      <div className="text-xs text-gray-600">Beasiswa</div>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">{infoProfData.filter(item => item.kategori === 'Lowongan').length}</div>
                      <div className="text-xs text-gray-600">Lowongan</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{infoProfData.filter(item => item.kategori === 'Kompetisi').length}</div>
                      <div className="text-xs text-gray-600">Kompetisi</div>
                    </div>
                  </div>

                  {/* Data Table */}
                  {isLoading ? (
                    <div className="text-center py-8">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <p className="mt-2 text-gray-600">Memuat data...</p>
                    </div>
                  ) : infoProfData.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-gray-400 text-4xl mb-4">📝</div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada data</h3>
                      <p className="text-gray-600 mb-4">Mulai tambahkan info karier pertama Anda.</p>
                      <button
                        onClick={() => setShowInfoProfForm(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        ➕ Tambah Info Pertama
                      </button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Judul
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Kategori
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Tanggal
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Aksi
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {infoProfData.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{item.judul}</div>
                                <div className="text-sm text-gray-500">{item.sumber}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  item.kategori === 'Magang' ? 'bg-blue-100 text-blue-800' :
                                  item.kategori === 'Beasiswa' ? 'bg-green-100 text-green-800' :
                                  item.kategori === 'Lowongan' ? 'bg-yellow-100 text-yellow-800' :
                                  item.kategori === 'Kompetisi' ? 'bg-purple-100 text-purple-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {item.kategori}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(item.tanggal_post).toLocaleDateString('id-ID')}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  item.arsip ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                }`}>
                                  {item.arsip ? 'Arsip' : 'Aktif'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button className="text-blue-600 hover:text-blue-900 mr-3">
                                  Edit
                                </button>
                                <button className="text-red-600 hover:text-red-900">
                                  Hapus
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Analytics Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-md font-medium text-gray-700 mb-2">Popular Content</h4>
                    <ul className="space-y-2">
                      {infoProfData.slice(0, 3).map((item, index) => (
                        <li key={index} className="flex justify-between">
                          <span className="text-sm text-gray-600 truncate">{item.judul}</span>
                          <span className="text-sm font-medium">{Math.floor(Math.random() * 1000)} views</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-md font-medium text-gray-700 mb-2">Recent Activity</h4>
                    <ul className="space-y-2">
                      <li className="text-sm text-gray-600">Content published: Info Karier Terbaru</li>
                      <li className="text-sm text-gray-600">Data updated: {new Date().toLocaleDateString('id-ID')}</li>
                      <li className="text-sm text-gray-600">CMS Status: Active</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">User Management</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Administrator</p>
                      <p className="text-sm text-gray-500">Full access to all features</p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Content Editor</p>
                      <p className="text-sm text-gray-500">Can edit and publish content</p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Online
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Viewer</p>
                      <p className="text-sm text-gray-500">Read-only access</p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      Offline
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* InfoProf Form Modal */}
        {showInfoProfForm && (
          <InfoProfForm
            onSubmit={handleInfoProfSubmit}
            onCancel={() => setShowInfoProfForm(false)}
          />
        )}
      </div>
    </div>
  )
}
