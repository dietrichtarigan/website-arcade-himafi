import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export async function GET() {
  try {
    const contentDirectory = path.join(process.cwd(), 'content')
    const alumniDirectory = path.join(contentDirectory, 'alumni')

    if (!fs.existsSync(alumniDirectory)) {
      return NextResponse.json({ posts: [] })
    }

    const fileNames = fs.readdirSync(alumniDirectory)
    const allPostsData = fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map((fileName) => {
        // Remove ".md" from file name to get id
        const id = fileName.replace(/\.md$/, '')
        const fullPath = path.join(alumniDirectory, fileName)
        const fileContents = fs.readFileSync(fullPath, 'utf8')
        
        const matterResult = matter(fileContents)
        
        return {
          id,
          ...matterResult.data,
          content: matterResult.content
        }
      })
      .sort((a: any, b: any) => {
        if (a.nama < b.nama) return -1
        if (a.nama > b.nama) return 1
        return 0
      })

    return NextResponse.json({ posts: allPostsData })
  } catch (error) {
    console.error('Error fetching alumni:', error)
    return NextResponse.json({ error: 'Failed to load alumni' }, { status: 500 })
  }
}
