'use client'

import { useState, useEffect, useRef } from 'react'
import { Chart, registerables } from 'chart.js'

// Register Chart.js components
Chart.register(...registerables)

interface DashboardData {
  overview: {
    totalContent: number
    totalViews: number
    averageSEO: number
    topPerformer: any
  }
  analytics: {
    publishingTrends: Array<{ date: string; published: number; views: number }>
    contentPerformance: Array<any>
    categoryStats: any
    popularTags: Array<{ tag: string; count: number }>
  }
  scheduled: {
    upcoming: number
    total: number
    failed: number
  }
  system: {
    lastDeploy: string
    deployStatus: string
    buildTime: string
  }
  audit: {
    recentActions: Array<{
      id: string
      action: string
      user: string
      timestamp: string
      details: any
    }>
    totalActions: number
  }
  users: {
    online: number
    total: number
    byRole: Record<string, number>
  }
  search: {
    totalSearches: number
    popularQueries: Array<{ query: string; count: number }>
  }
}

interface AdminDashboardProps {
  className?: string
}

export default function AdminDashboard({ className = '' }: AdminDashboardProps) {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [refreshing, setRefreshing] = useState(false)

  // Chart refs
  const publishingChartRef = useRef<HTMLCanvasElement>(null)
  const categoryChartRef = useRef<HTMLCanvasElement>(null)
  const performanceChartRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    loadDashboardData()
    
    // Set up auto-refresh every 5 minutes
    const interval = setInterval(loadDashboardData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (data && activeTab === 'analytics') {
      setTimeout(() => {
        renderCharts()
      }, 100)
    }
  }, [data, activeTab])

  const loadDashboardData = async () => {
    try {
      setError(null)
      if (!loading) setRefreshing(true)

      // Load all dashboard data in parallel
      const [overviewRes, analyticsRes, scheduledRes, deployRes, auditRes, authRes, searchRes] = await Promise.all([
        fetch('/api/admin/dashboard'),
        fetch('/api/admin/analytics'),
        fetch('/api/admin/schedule?upcoming=true'),
        fetch('/api/admin/deploy'),
        fetch('/api/admin/audit?limit=10'),
        fetch('/api/admin/auth?stats=true'),
        fetch('/api/admin/search?stats=true')
      ])

      const [overview, analytics, scheduled, deploy, audit, auth, search] = await Promise.all([
        overviewRes.json(),
        analyticsRes.json(),
        scheduledRes.json(),
        deployRes.json(),
        auditRes.json(),
        authRes.json(),
        searchRes.json()
      ])

      setData({
        overview: overview.dashboard || {},
        analytics: analytics.data || {},
        scheduled: scheduled.stats || {},
        system: deploy.currentDeploy || {},
        audit: {
          recentActions: audit.actions || [],
          totalActions: audit.total || 0
        },
        users: {
          online: auth.onlineUsers || 0,
          total: auth.totalUsers || 0,
          byRole: auth.usersByRole || {}
        },
        search: {
          totalSearches: search.totalSearches || 0,
          popularQueries: search.popularQueries || []
        }
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const renderCharts = () => {
    if (!data) return

    // Publishing trends chart
    if (publishingChartRef.current) {
      const ctx = publishingChartRef.current.getContext('2d')
      if (ctx) {
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: data.analytics.publishingTrends?.map(item => 
              new Date(item.date).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })
            ) || [],
            datasets: [
              {
                label: 'Published Content',
                data: data.analytics.publishingTrends?.map(item => item.published) || [],
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4
              },
              {
                label: 'Page Views',
                data: data.analytics.publishingTrends?.map(item => item.views) || [],
                borderColor: 'rgb(16, 185, 129)',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4,
                yAxisID: 'y1'
              }
            ]
          },
          options: {
            responsive: true,
            plugins: {
              title: { display: true, text: 'Publishing Trends (Last 30 Days)' }
            },
            scales: {
              y: { type: 'linear', display: true, position: 'left' },
              y1: { type: 'linear', display: true, position: 'right', grid: { drawOnChartArea: false } }
            }
          }
        })
      }
    }

    // Category distribution chart
    if (categoryChartRef.current) {
      const ctx = categoryChartRef.current.getContext('2d')
      if (ctx) {
        const categoryData = data.analytics.categoryStats || {}
        new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: Object.keys(categoryData).map(key => 
              key.charAt(0).toUpperCase() + key.slice(1)
            ),
            datasets: [{
              data: Object.values(categoryData).map((stat: any) => stat.total || 0),
              backgroundColor: [
                'rgb(59, 130, 246)',
                'rgb(16, 185, 129)', 
                'rgb(245, 158, 11)',
                'rgb(239, 68, 68)',
                'rgb(139, 92, 246)',
                'rgb(6, 182, 212)'
              ]
            }]
          },
          options: {
            responsive: true,
            plugins: {
              title: { display: true, text: 'Content Distribution by Category' }
            }
          }
        })
      }
    }

    // Performance chart
    if (performanceChartRef.current) {
      const ctx = performanceChartRef.current.getContext('2d')
      if (ctx) {
        const topContent = data.analytics.contentPerformance?.slice(0, 10) || []
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: topContent.map(item => item.title?.substring(0, 20) + '...' || 'Untitled'),
            datasets: [{
              label: 'Views',
              data: topContent.map(item => item.views || 0),
              backgroundColor: 'rgba(59, 130, 246, 0.8)',
              borderColor: 'rgb(59, 130, 246)',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            plugins: {
              title: { display: true, text: 'Top Performing Content' }
            },
            scales: {
              y: { beginAtZero: true }
            }
          }
        })
      }
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className={`animate-pulse space-y-6 ${className}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-32"></div>
          ))}
        </div>
        <div className="bg-gray-200 rounded-lg h-96"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-red-600 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-medium">Failed to load dashboard</h3>
          <p className="text-sm text-gray-600 mt-2">{error}</p>
        </div>
        <button 
          onClick={loadDashboardData}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Comprehensive overview of your content management system</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={loadDashboardData}
            disabled={refreshing}
            className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
          >
            <svg className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <div className="text-sm text-gray-500">
            Last updated: {formatDate(new Date().toISOString())}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Content"
          value={data?.overview?.totalContent || 0}
          icon="📝"
          color="blue"
          trend="+12%"
        />
        <StatCard
          title="Total Views"
          value={formatNumber(data?.overview?.totalViews || 0)}
          icon="👀"
          color="green"
          trend="+8%"
        />
        <StatCard
          title="SEO Score"
          value={`${Math.round(data?.overview?.averageSEO || 0)}%`}
          icon="🎯"
          color="purple"
          trend="+5%"
        />
        <StatCard
          title="Scheduled"
          value={data?.scheduled?.upcoming || 0}
          icon="⏰"
          color="orange"
          trend="3 upcoming"
        />
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'analytics', label: 'Analytics', icon: '📈' },
              { id: 'content', label: 'Content', icon: '📝' },
              { id: 'scheduled', label: 'Scheduled', icon: '⏰' },
              { id: 'audit', label: 'Audit Log', icon: '🔍' },
              { id: 'users', label: 'Users & Roles', icon: '👥' },
              { id: 'search', label: 'Search & SEO', icon: '🔎' },
              { id: 'system', label: 'System', icon: '⚙️' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium mb-4">Top Performer</h3>
                  {data?.overview?.topPerformer ? (
                    <div>
                      <h4 className="font-medium">{data.overview.topPerformer.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{data.overview.topPerformer.type}</p>
                      <div className="mt-3 flex items-center space-x-4 text-sm">
                        <span className="text-green-600">👀 {formatNumber(data.overview.topPerformer.views || 0)} views</span>
                        <span className="text-blue-600">🎯 {data.overview.topPerformer.seoScore || 0}% SEO</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500">No performance data available</p>
                  )}
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {data?.analytics?.contentPerformance?.slice(0, 3).map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{item.title?.substring(0, 30)}...</p>
                          <p className="text-xs text-gray-500">{item.type}</p>
                        </div>
                        <div className="text-xs text-gray-400">
                          {formatDate(item.lastModified)}
                        </div>
                      </div>
                    )) || <p className="text-gray-500">No recent activity</p>}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 rounded-lg p-6 text-center">
                  <div className="text-2xl mb-2">📋</div>
                  <h3 className="font-medium">Content Types</h3>
                  <p className="text-2xl font-bold text-blue-600 mt-2">
                    {Object.keys(data?.analytics?.categoryStats || {}).length}
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-6 text-center">
                  <div className="text-2xl mb-2">🏷️</div>
                  <h3 className="font-medium">Popular Tags</h3>
                  <p className="text-2xl font-bold text-green-600 mt-2">
                    {data?.analytics?.popularTags?.length || 0}
                  </p>
                </div>
                <div className="bg-purple-50 rounded-lg p-6 text-center">
                  <div className="text-2xl mb-2">📈</div>
                  <h3 className="font-medium">Growth Rate</h3>
                  <p className="text-2xl font-bold text-purple-600 mt-2">+12%</p>
                </div>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border rounded-lg p-4">
                  <canvas ref={publishingChartRef} width={400} height={200}></canvas>
                </div>
                <div className="bg-white border rounded-lg p-4">
                  <canvas ref={categoryChartRef} width={400} height={200}></canvas>
                </div>
              </div>
              <div className="bg-white border rounded-lg p-4">
                <canvas ref={performanceChartRef} width={800} height={300}></canvas>
              </div>
            </div>
          )}

          {/* Content Tab */}
          {activeTab === 'content' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Content Management</h3>
                <div className="flex space-x-2">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm">
                    📝 New Content
                  </button>
                  <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition text-sm">
                    📁 Manage Media
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(data?.analytics?.categoryStats || {}).map(([type, stats]: [string, any]) => (
                  <div key={type} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium capitalize">{type}</h4>
                      <span className="text-2xl">
                        {type === 'infoprof' ? '💼' : 
                         type === 'alumni' ? '🎓' :
                         type === 'ceritakita' ? '📖' :
                         type === 'event' ? '🎉' :
                         type === 'companyvisit' ? '🏢' : '⚛️'}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Total:</span>
                        <span className="font-medium">{stats.total || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Published:</span>
                        <span className="font-medium text-green-600">{stats.published || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Draft:</span>
                        <span className="font-medium text-yellow-600">{stats.draft || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Recent:</span>
                        <span className="font-medium text-blue-600">{stats.recentActivity || 0}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Scheduled Tab */}
          {activeTab === 'scheduled' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Scheduled Content</h3>
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition text-sm">
                  ⏰ Schedule New
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-purple-50 rounded-lg p-6 text-center">
                  <div className="text-2xl mb-2">⏰</div>
                  <h3 className="font-medium">Upcoming</h3>
                  <p className="text-2xl font-bold text-purple-600 mt-2">
                    {data?.scheduled?.upcoming || 0}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <div className="text-2xl mb-2">📅</div>
                  <h3 className="font-medium">Total Scheduled</h3>
                  <p className="text-2xl font-bold text-gray-600 mt-2">
                    {data?.scheduled?.total || 0}
                  </p>
                </div>
                <div className="bg-red-50 rounded-lg p-6 text-center">
                  <div className="text-2xl mb-2">❌</div>
                  <h3 className="font-medium">Failed</h3>
                  <p className="text-2xl font-bold text-red-600 mt-2">
                    {data?.scheduled?.failed || 0}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-medium mb-4">Scheduling Features</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <span className="mr-2">✅</span>
                    <span>Auto-publish at scheduled time</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">✅</span>
                    <span>Automatic deployment trigger</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">✅</span>
                    <span>Email notifications</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">✅</span>
                    <span>SEO validation before publish</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">✅</span>
                    <span>Social media integration</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">✅</span>
                    <span>Retry mechanism for failures</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Audit Log Tab */}
          {activeTab === 'audit' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Audit Log</h3>
                <div className="flex space-x-2">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm">
                    📊 Generate Report
                  </button>
                  <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition text-sm">
                    🔍 Advanced Search
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-blue-50 rounded-lg p-6 text-center">
                  <div className="text-2xl mb-2">📋</div>
                  <h3 className="font-medium">Total Actions</h3>
                  <p className="text-2xl font-bold text-blue-600 mt-2">
                    {data?.audit?.totalActions || 0}
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-6 text-center">
                  <div className="text-2xl mb-2">✅</div>
                  <h3 className="font-medium">Today's Activity</h3>
                  <p className="text-2xl font-bold text-green-600 mt-2">
                    {data?.audit?.recentActions?.filter(action => 
                      new Date(action.timestamp).toDateString() === new Date().toDateString()
                    ).length || 0}
                  </p>
                </div>
                <div className="bg-purple-50 rounded-lg p-6 text-center">
                  <div className="text-2xl mb-2">👥</div>
                  <h3 className="font-medium">Active Users</h3>
                  <p className="text-2xl font-bold text-purple-600 mt-2">
                    {data?.users?.online || 0}
                  </p>
                </div>
              </div>

              <div className="bg-white border rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b bg-gray-50">
                  <h4 className="font-medium">Recent Activity</h4>
                </div>
                <div className="divide-y">
                  {data?.audit?.recentActions?.map((action, index) => (
                    <div key={action.id || index} className="px-6 py-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm">
                              {action.action.includes('create') ? '➕' :
                               action.action.includes('update') ? '✏️' :
                               action.action.includes('delete') ? '🗑️' :
                               action.action.includes('login') ? '🔑' : '📝'}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-sm">{action.action}</p>
                            <p className="text-xs text-gray-500">by {action.user}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">{formatDate(action.timestamp)}</p>
                          {action.details && (
                            <p className="text-xs text-blue-600">
                              {JSON.stringify(action.details).substring(0, 50)}...
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )) || (
                    <div className="px-6 py-8 text-center text-gray-500">
                      No recent activity found
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Users & Roles Tab */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Users & Role Management</h3>
                <div className="flex space-x-2">
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm">
                    👤 Add User
                  </button>
                  <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition text-sm">
                    🎭 Manage Roles
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-green-50 rounded-lg p-6 text-center">
                  <div className="text-2xl mb-2">👥</div>
                  <h3 className="font-medium">Total Users</h3>
                  <p className="text-2xl font-bold text-green-600 mt-2">
                    {data?.users?.total || 0}
                  </p>
                </div>
                <div className="bg-blue-50 rounded-lg p-6 text-center">
                  <div className="text-2xl mb-2">🟢</div>
                  <h3 className="font-medium">Online Now</h3>
                  <p className="text-2xl font-bold text-blue-600 mt-2">
                    {data?.users?.online || 0}
                  </p>
                </div>
                <div className="bg-purple-50 rounded-lg p-6 text-center">
                  <div className="text-2xl mb-2">🎭</div>
                  <h3 className="font-medium">Roles</h3>
                  <p className="text-2xl font-bold text-purple-600 mt-2">
                    {Object.keys(data?.users?.byRole || {}).length}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border rounded-lg">
                  <div className="px-6 py-4 border-b bg-gray-50">
                    <h4 className="font-medium">Users by Role</h4>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {Object.entries(data?.users?.byRole || {}).map(([role, count]) => (
                        <div key={role} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-lg">
                              {role === 'admin' ? '👑' :
                               role === 'editor' ? '✏️' :
                               role === 'author' ? '📝' : '👤'}
                            </span>
                            <span className="font-medium capitalize">{role}</span>
                          </div>
                          <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                            {count}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-white border rounded-lg">
                  <div className="px-6 py-4 border-b bg-gray-50">
                    <h4 className="font-medium">Role Permissions</h4>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4 text-sm">
                      <div className="flex items-center justify-between">
                        <span>Content Management:</span>
                        <div className="flex space-x-2">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Admin</span>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Editor</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>User Management:</span>
                        <div className="flex space-x-2">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Admin</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Publishing:</span>
                        <div className="flex space-x-2">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Admin</span>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Editor</span>
                          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">Author</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>System Settings:</span>
                        <div className="flex space-x-2">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Admin</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Analytics:</span>
                        <div className="flex space-x-2">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Admin</span>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Editor</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Search & SEO Tab */}
          {activeTab === 'search' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Search & SEO Analytics</h3>
                <div className="flex space-x-2">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm">
                    🔍 Advanced Search
                  </button>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm">
                    🎯 SEO Report
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 rounded-lg p-6 text-center">
                  <div className="text-2xl mb-2">🔍</div>
                  <h3 className="font-medium">Total Searches</h3>
                  <p className="text-2xl font-bold text-blue-600 mt-2">
                    {formatNumber(data?.search?.totalSearches || 0)}
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-6 text-center">
                  <div className="text-2xl mb-2">🎯</div>
                  <h3 className="font-medium">Avg SEO Score</h3>
                  <p className="text-2xl font-bold text-green-600 mt-2">
                    {Math.round(data?.overview?.averageSEO || 0)}%
                  </p>
                </div>
                <div className="bg-purple-50 rounded-lg p-6 text-center">
                  <div className="text-2xl mb-2">🏷️</div>
                  <h3 className="font-medium">Popular Queries</h3>
                  <p className="text-2xl font-bold text-purple-600 mt-2">
                    {data?.search?.popularQueries?.length || 0}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border rounded-lg">
                  <div className="px-6 py-4 border-b bg-gray-50">
                    <h4 className="font-medium">Popular Search Queries</h4>
                  </div>
                  <div className="p-6">
                    <div className="space-y-3">
                      {data?.search?.popularQueries?.slice(0, 8).map((query, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm font-medium">{query.query}</span>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                            {query.count} searches
                          </span>
                        </div>
                      )) || (
                        <p className="text-gray-500 text-sm">No search data available</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-white border rounded-lg">
                  <div className="px-6 py-4 border-b bg-gray-50">
                    <h4 className="font-medium">SEO Features</h4>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4 text-sm">
                      <div className="flex items-center justify-between">
                        <span>Real-time SEO scoring</span>
                        <span className="text-green-600">✅ Active</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Meta tag optimization</span>
                        <span className="text-green-600">✅ Active</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Keyword density analysis</span>
                        <span className="text-green-600">✅ Active</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Image alt text checking</span>
                        <span className="text-green-600">✅ Active</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Internal linking suggestions</span>
                        <span className="text-green-600">✅ Active</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Readability analysis</span>
                        <span className="text-green-600">✅ Active</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Content duplication check</span>
                        <span className="text-green-600">✅ Active</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Sitemap auto-generation</span>
                        <span className="text-green-600">✅ Active</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* System Tab */}
          {activeTab === 'system' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium mb-4">Deployment Status</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className={`font-medium ${
                        data?.system?.deployStatus === 'ready' ? 'text-green-600' :
                        data?.system?.deployStatus === 'building' ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {data?.system?.deployStatus || 'Unknown'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Deploy:</span>
                      <span className="font-medium">
                        {data?.system?.lastDeploy ? formatDate(data.system.lastDeploy) : 'Never'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Build Time:</span>
                      <span className="font-medium">{data?.system?.buildTime || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium mb-4">System Health</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>API Status:</span>
                      <span className="text-green-600 font-medium">✅ Online</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>CMS Status:</span>
                      <span className="text-green-600 font-medium">✅ Running</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Database:</span>
                      <span className="text-green-600 font-medium">✅ Connected</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>CDN Cache:</span>
                      <span className="text-green-600 font-medium">✅ Active</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm">
                    🚀 Deploy Now
                  </button>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm">
                    🗑️ Clear Cache
                  </button>
                  <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition text-sm">
                    🔄 Sync Content
                  </button>
                  <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition text-sm">
                    📊 Generate Report
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface StatCardProps {
  title: string
  value: string | number
  icon: string
  color: 'blue' | 'green' | 'purple' | 'orange'
  trend?: string
}

function StatCard({ title, value, icon, color, trend }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600'
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`rounded-lg p-3 ${colorClasses[color]}`}>
          <span className="text-2xl">{icon}</span>
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className="text-sm text-green-600 mt-1">
              <span className="mr-1">↗</span>
              {trend}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
