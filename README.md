# ARCADE HIMAFI ITB Website

Website resmi ARCADE HIMAFI ITB (Divisi Pengembangan Karier & Relasi Alumni Himpunan Mahasiswa Fisika ITB)

## Teknologi
- Next.js (TypeScript)
- TailwindCSS
- Netlify CMS (akses di `/admin`)
- Supabase (database & file storage)
- Netlify Forms (form alumni, RSVP, dsb)
- Hosting: Netlify

## Struktur Navigasi
- Home
- Tentang ARCADE
- Alumni (ALIVE)
- Info Karier (INFOPROF)
- CeritaKita
- Acara (INSIGHT, SINERGI, Visit)
- REAKTOR (Download Dokumen)
- LivingLink (Form Alumni)
- Hubungi Kami

## Deploy
1. Push ke GitHub
2. Hubungkan repo ke Netlify
3. Deploy otomatis (build command: `next build`, publish: `.next`)

## Admin Panel
- Akses: `/admin`
- Login: GitHub/Netlify Identity
- CRUD Alumni, Info Karier, Cerita, Event, Company Visit, Dokumen

## Database
- Supabase: Buat project, ambil API URL & Key, masukkan ke `.env.local`

## Dummy Data
- Folder `content/` untuk data awal (alumni, info, cerita, event, dsb)

---

Website ini ringan, mobile-friendly, dan mudah diupdate tanpa coding.
