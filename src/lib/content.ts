import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const contentDirectory = path.join(process.cwd(), 'content')

export interface InfoProfPost {
  id: string
  judul: string
  kategori: string
  tanggal_post: string
  deskripsi: string
  link_utama?: string
  kontak_email?: string
  sumber: string
  content: string
  arsip?: boolean
  [key: string]: any
}

export interface AlumniPost {
  id: string
  nama: string
  angkatan: string
  bidang: string
  linkedin?: string
  content: string
  [key: string]: any
}

export interface CeritaKitaPost {
  id: string
  nama: string
  cerita: string
  publish_date?: string
  tanggal_post?: string
  content: string
  [key: string]: any
}

// Enhanced interfaces with more fields
export interface CompanyVisitPost {
  id: string
  perusahaan: string
  tanggal: string
  deskripsi: string
  bidang: string
  gallery?: string[]
  content: string
  [key: string]: any
}

export interface EventPost {
  id: string
  judul: string
  deskripsi: string
  tanggal_event: string
  lokasi: string
  link_daftar?: string
  poster?: string
  organizer: string
  content: string
  [key: string]: any
}

export interface ReaktorPost {
  id: string
  judul: string
  kategori: string
  tanggal_publish: string
  penulis: string
  featured_image?: string
  tags?: string[]
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

// Enhanced functions for new content types
export function getCompanyVisitPosts(): CompanyVisitPost[] {
  const companyVisitDirectory = path.join(contentDirectory, 'companyvisit')
  
  if (!fs.existsSync(companyVisitDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(companyVisitDirectory)
  const allPostsData = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map((fileName) => {
      const id = fileName.replace(/\.md$/, '')
      const fullPath = path.join(companyVisitDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const matterResult = matter(fileContents)

      return {
        id,
        ...matterResult.data,
        content: matterResult.content
      } as CompanyVisitPost
    })

  return allPostsData.sort((a, b) => {
    const dateA = new Date(a.tanggal)
    const dateB = new Date(b.tanggal)
    return dateB.getTime() - dateA.getTime()
  })
}

export function getEventPosts(): EventPost[] {
  const eventDirectory = path.join(contentDirectory, 'event')
  
  if (!fs.existsSync(eventDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(eventDirectory)
  const allPostsData = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map((fileName) => {
      const id = fileName.replace(/\.md$/, '')
      const fullPath = path.join(eventDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const matterResult = matter(fileContents)

      return {
        id,
        ...matterResult.data,
        content: matterResult.content
      } as EventPost
    })

  return allPostsData.sort((a, b) => {
    const dateA = new Date(a.tanggal_event)
    const dateB = new Date(b.tanggal_event)
    return dateB.getTime() - dateA.getTime()
  })
}

export function getReaktorPosts(): ReaktorPost[] {
  const reaktorDirectory = path.join(contentDirectory, 'reaktor')
  
  if (!fs.existsSync(reaktorDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(reaktorDirectory)
  const allPostsData = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map((fileName) => {
      const id = fileName.replace(/\.md$/, '')
      const fullPath = path.join(reaktorDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const matterResult = matter(fileContents)

      return {
        id,
        ...matterResult.data,
        content: matterResult.content
      } as ReaktorPost
    })

  return allPostsData.sort((a, b) => {
    const dateA = new Date(a.tanggal_publish)
    const dateB = new Date(b.tanggal_publish)
    return dateB.getTime() - dateA.getTime()
  })
}

// Enhanced utility functions
export function getAllPosts() {
  return {
    infoprof: getInfoProfPosts(),
    alumni: getAlumniPosts(),
    ceritakita: getCeritaKitaPosts(),
    event: getEventPosts(),
    companyvisit: getCompanyVisitPosts(),
    reaktor: getReaktorPosts()
  }
}

export function getPostById(type: string, id: string) {
  const typeDirectory = path.join(contentDirectory, type)
  const fullPath = path.join(typeDirectory, `${id}.md`)
  
  if (!fs.existsSync(fullPath)) {
    return null
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const matterResult = matter(fileContents)

  return {
    id,
    type,
    ...matterResult.data,
    content: matterResult.content
  }
}

export function searchPosts(query: string, type?: string) {
  const allPosts = getAllPosts()
  const searchTerms = query.toLowerCase().split(' ')
  
  let postsToSearch: any[] = []
  
  if (type && allPosts[type as keyof typeof allPosts]) {
    postsToSearch = allPosts[type as keyof typeof allPosts]
  } else {
    postsToSearch = Object.values(allPosts).flat()
  }

  return postsToSearch.filter(post => {
    const searchText = (
      (post.judul || post.nama || post.title || '') + ' ' +
      (post.deskripsi || post.cerita || '') + ' ' +
      (post.content || '') + ' ' +
      (post.kategori || '') + ' ' +
      (post.tags?.join(' ') || '')
    ).toLowerCase()

    return searchTerms.every(term => searchText.includes(term))
  })
}

export function getPostsByCategory(category: string, type?: string) {
  const allPosts = getAllPosts()
  
  let postsToFilter: any[] = []
  
  if (type && allPosts[type as keyof typeof allPosts]) {
    postsToFilter = allPosts[type as keyof typeof allPosts]
  } else {
    postsToFilter = Object.values(allPosts).flat()
  }

  return postsToFilter.filter(post => 
    post.kategori?.toLowerCase() === category.toLowerCase()
  )
}

export function getRecentPosts(limit: number = 10) {
  const allPosts = Object.entries(getAllPosts())
    .flatMap(([type, posts]) => 
      posts.map(post => ({ ...post, type }))
    )
    .sort((a, b) => {
      const dateA = new Date((a as any).tanggal_post || (a as any).publish_date || (a as any).tanggal_event || (a as any).tanggal || (a as any).tanggal_publish || 0)
      const dateB = new Date((b as any).tanggal_post || (b as any).publish_date || (b as any).tanggal_event || (b as any).tanggal || (b as any).tanggal_publish || 0)
      return dateB.getTime() - dateA.getTime()
    })

  return allPosts.slice(0, limit)
}
