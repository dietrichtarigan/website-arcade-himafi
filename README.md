# ARCADE HIMAFI ITB Website

Website resmi ARCADE HIMAFI ITB (Divisi Pengembangan Karier & Relasi Alumni Himpunan Mahasiswa Fisika ITB)

## 🎉 NEW: Advanced CMS System

**This website now includes a comprehensive Advanced CMS with the following features:**

### 🔥 Advanced Features
- **📊 Analytics Dashboard**: Real-time content performance, SEO insights, engagement metrics
- **🔍 Advanced Search**: Full-text search, filtering, facets, and search analytics
- **👥 Real-time Collaboration**: Live user sessions, content locks, notifications
- **📅 Content Scheduling**: Schedule content for future publication with retry logic
- **📋 Audit Logging**: Complete activity tracking and security monitoring
- **👤 Role Management**: User roles (Admin/Editor/Viewer) with JWT authentication
- **🎛️ Unified Dashboard**: All-in-one admin interface with charts and visualizations

### 🚀 Quick Start
1. **Development**: `npm run dev` → Visit `http://localhost:3000/admin-dashboard`
2. **Simple Admin**: Visit `http://localhost:3000/admin-simple.html`
3. **Main Website**: Visit `http://localhost:3000`

### 🔧 Advanced CMS URLs
- **Advanced Dashboard**: `/admin-dashboard` (React-based, full-featured)
- **Simple Admin**: `/admin-simple.html` (Basic Netlify CMS)
- **API Documentation**: See `FINAL-CMS-DOCUMENTATION.md`

---

## ⚠️ PENTING: Legacy Admin Panel Setup

**Legacy admin panel (`/admin`) berfungsi setelah deploy ke Netlify:**

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
