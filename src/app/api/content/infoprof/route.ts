import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export async function GET() {
  try {
    const contentDirectory = path.join(process.cwd(), 'content')
    const infoprofDirectory = path.join(contentDirectory, 'infoprof')

    if (!fs.existsSync(infoprofDirectory)) {
      return NextResponse.json({ posts: [] })
    }

    const fileNames = fs.readdirSync(infoprofDirectory)
    const allPostsData = fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map((fileName) => {
        // Remove ".md" from file name to get id
        const id = fileName.replace(/\.md$/, '')
        const fullPath = path.join(infoprofDirectory, fileName)
        const fileContents = fs.readFileSync(fullPath, 'utf8')
        
        const matterResult = matter(fileContents)
        
        return {
          id,
          ...matterResult.data,
          content: matterResult.content
        }
      })
      .sort((a: any, b: any) => {
        const dateA = new Date(a.tanggal_post || '2000-01-01')
        const dateB = new Date(b.tanggal_post || '2000-01-01')
        return dateB.getTime() - dateA.getTime()
      })

    return NextResponse.json({ posts: allPostsData })
  } catch (error) {
    console.error('Error fetching content:', error)
    return NextResponse.json({ error: 'Failed to load content' }, { status: 500 })
  }
}
