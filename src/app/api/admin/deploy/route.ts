import { NextRequest, NextResponse } from 'next/server'

// Helper function to validate admin access
function validateAdminAccess(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  return authHeader && authHeader.startsWith('Bearer ')
}

// POST: Trigger Netlify build/deploy
export async function POST(request: NextRequest) {
  try {
    if (!validateAdminAccess(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { message = 'Content update from CMS' } = body

    // Get build hook URL from environment
    const buildHookUrl = process.env.NETLIFY_BUILD_HOOK_URL

    if (!buildHookUrl) {
      return NextResponse.json({ 
        error: 'Build hook not configured. Please set NETLIFY_BUILD_HOOK_URL environment variable.' 
      }, { status: 500 })
    }

    // Trigger Netlify build
    const response = await fetch(buildHookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        trigger_title: message,
        trigger_branch: 'main'
      })
    })

    if (!response.ok) {
      throw new Error(`Netlify API error: ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      message: 'Deployment triggered successfully',
      buildId: data.id,
      status: 'triggered',
      estimatedTime: '2-5 minutes'
    })
  } catch (error) {
    console.error('Error triggering deployment:', error)
    return NextResponse.json({ 
      error: 'Failed to trigger deployment',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// GET: Check deployment status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const siteId = process.env.NETLIFY_SITE_ID
    const accessToken = process.env.NETLIFY_ACCESS_TOKEN

    if (!siteId || !accessToken) {
      return NextResponse.json({ 
        error: 'Netlify credentials not configured' 
      }, { status: 500 })
    }

    // Get latest deploys
    const response = await fetch(
      `https://api.netlify.com/api/v1/sites/${siteId}/deploys?per_page=5`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (!response.ok) {
      throw new Error(`Netlify API error: ${response.status}`)
    }

    const deploys = await response.json()
    
    const latestDeploy = deploys[0]
    const deployInfo = {
      id: latestDeploy.id,
      state: latestDeploy.state, // ready, building, error, etc.
      branch: latestDeploy.branch,
      commitRef: latestDeploy.commit_ref?.substring(0, 7),
      createdAt: latestDeploy.created_at,
      publishedAt: latestDeploy.published_at,
      deployUrl: latestDeploy.deploy_ssl_url,
      buildTime: latestDeploy.deploy_time,
      errorMessage: latestDeploy.error_message
    }

    return NextResponse.json({
      success: true,
      currentDeploy: deployInfo,
      recentDeploys: deploys.slice(0, 5).map((deploy: any) => ({
        id: deploy.id,
        state: deploy.state,
        createdAt: deploy.created_at,
        publishedAt: deploy.published_at,
        commitRef: deploy.commit_ref?.substring(0, 7)
      }))
    })
  } catch (error) {
    console.error('Error checking deployment status:', error)
    return NextResponse.json({ 
      error: 'Failed to check deployment status',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
