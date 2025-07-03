# ARCADE HIMAFI ITB Website

Website resmi ARCADE HIMAFI ITB (Divisi Pengembangan Karier & Relasi Alumni Himpunan Mahasiswa Fisika ITB)

## ⚠️ PENTING: Admin Panel Setup

**Admin panel (`/admin`) hanya berfungsi setelah deploy ke Netlify dengan konfigurasi berikut:**

### 1. Deploy ke Netlify
1. Push repository ke GitHub
2. Connect repo ke Netlify
3. Deploy dengan build settings:
   - Build command: `npm run build`
   - Publish directory: `out`

### 2. Enable Netlify Identity
1. Buka Netlify Dashboard → Site Settings → Identity
2. Klik "Enable Identity"
3. Set registration: "Invite only"
4. Invite admin users dengan email
5. Enable Git Gateway di Identity → Services

### 3. Set Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Akses Admin Panel
- URL: `https://your-site.netlify.app/admin`
- Login dengan akun yang sudah di-invite
- Edit konten dengan visual CMS

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

## Development Local
```bash
npm install
npm run dev
```

**Catatan:** Admin panel tidak bisa digunakan di localhost. Untuk testing CMS, deploy ke Netlify.

## Database
- Supabase: Buat project, ambil API URL & Key, masukkan ke `.env.local`

## Dummy Data
- Folder `content/` untuk data awal (alumni, info, cerita, event, dsb)

---

Website ini ringan, mobile-friendly, dan mudah diupdate tanpa coding.
