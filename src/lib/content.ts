import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const contentDirectory = path.join(process.cwd(), 'content')

interface InfoProfPost {
  id: string
  judul: string
  kategori: string
  tanggal_post: string
  deskripsi: string
  link_utama?: string
  kontak_email?: string
  sumber: string
  content: string
  [key: string]: any
}

interface AlumniPost {
  id: string
  nama: string
  angkatan: string
  bidang: string
  linkedin?: string
  content: string
  [key: string]: any
}

interface CeritaKitaPost {
  id: string
  nama: string
  cerita: string
  publish_date?: string
  tanggal_post?: string
  content: string
  [key: string]: any
}

export function getInfoProfPosts(): InfoProfPost[] {
  const infoprofDirectory = path.join(contentDirectory, 'infoprof')
  
  // Check if directory exists
  if (!fs.existsSync(infoprofDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(infoprofDirectory)
  const allPostsData = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map((fileName) => {
      // Remove ".md" from file name to get id
      const id = fileName.replace(/\.md$/, '')

      // Read markdown file as string
      const fullPath = path.join(infoprofDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')

      // Use gray-matter to parse the post metadata section
      const matterResult = matter(fileContents)

      // Combine the data with the id
      return {
        id,
        ...matterResult.data,
        content: matterResult.content
      } as InfoProfPost
    })

  // Sort posts by date
  return allPostsData.sort((a, b) => {
    const dateA = new Date(a.tanggal_post)
    const dateB = new Date(b.tanggal_post)
    return dateB.getTime() - dateA.getTime()
  })
}

export function getAlumniPosts(): AlumniPost[] {
  const alumniDirectory = path.join(contentDirectory, 'alumni')
  
  if (!fs.existsSync(alumniDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(alumniDirectory)
  const allPostsData = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map((fileName) => {
      const id = fileName.replace(/\.md$/, '')
      const fullPath = path.join(alumniDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const matterResult = matter(fileContents)

      return {
        id,
        ...matterResult.data,
        content: matterResult.content
      } as AlumniPost
    })

  return allPostsData.sort((a, b) => {
    if (a.nama < b.nama) return -1
    if (a.nama > b.nama) return 1
    return 0
  })
}

export function getCeritaKitaPosts(): CeritaKitaPost[] {
  const ceritakitaDirectory = path.join(contentDirectory, 'ceritakita')
  
  if (!fs.existsSync(ceritakitaDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(ceritakitaDirectory)
  const allPostsData = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map((fileName) => {
      const id = fileName.replace(/\.md$/, '')
      const fullPath = path.join(ceritakitaDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const matterResult = matter(fileContents)

      return {
        id,
        ...matterResult.data,
        content: matterResult.content
      } as CeritaKitaPost
    })

  return allPostsData.sort((a, b) => {
    const dateA = new Date(a.publish_date || a.tanggal_post || '')
    const dateB = new Date(b.publish_date || b.tanggal_post || '')
    return dateB.getTime() - dateA.getTime()
  })
}
