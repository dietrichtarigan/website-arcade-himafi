import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Alumni {
  id: number
  nama: string
  angkatan: string
  bidang: string
  linkedin?: string
  foto?: string
  keterhubungan?: string
  created_at: string
}

export interface InfoProf {
  id: number
  judul: string
  jenis: 'Magang' | 'Lowongan Kerja' | 'Beasiswa'
  tanggal: string
  deskripsi: string
  link?: string
  arsip?: boolean
  created_at: string
}

export interface CeritaKita {
  id: number
  nama: string
  gambar?: string
  cerita: string
  publish_date: string
  created_at: string
}

export interface Event {
  id: number
  nama_acara: string
  tanggal: string
  deskripsi: string
  rsvp?: string
  feedback?: string
  created_at: string
}

export interface CompanyVisit {
  id: number
  perusahaan: string
  tanggal: string
  laporan?: string
  galeri?: string[]
  testimoni?: string
  created_at: string
}

export interface Reaktor {
  id: number
  judul: string
  file: string
  deskripsi?: string
  created_at: string
} 