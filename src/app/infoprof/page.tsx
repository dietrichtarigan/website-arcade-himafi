import { getInfoProfPosts, InfoProfPost } from '@/lib/content'
import InfoProfClient from './InfoProfClient'

export default async function InfoProfPage() {
  // This runs at build time on the server
  let allInfo: InfoProfPost[] = []
  
  try {
    allInfo = getInfoProfPosts()
  } catch (error) {
    console.error('Error loading content:', error)
    allInfo = []
  }

  return <InfoProfClient initialData={allInfo} />
}
