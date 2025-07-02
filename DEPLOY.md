# Instruksi Deploy Website ARCADE HIMAFI ITB

## 🚀 Deploy ke Netlify

### 1. Persiapan Repository
```bash
# Push ke GitHub
git add .
git commit -m "Initial commit: Website ARCADE HIMAFI ITB"
git push origin main
```

### 2. Setup Netlify
1. Buka [netlify.com](https://netlify.com)
2. Klik "New site from Git"
3. Pilih GitHub dan pilih repository
4. Konfigurasi build:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
5. Klik "Deploy site"

### 3. Setup Environment Variables
Di Netlify Dashboard > Site settings > Environment variables:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Setup Netlify CMS
1. Di Netlify Dashboard > Site settings > Identity
2. Enable Identity service
3. Setup registration: Invite only
4. Invite admin users

### 5. Setup Netlify Forms
Forms sudah dikonfigurasi otomatis:
- `/livinglink` - Form alumni
- `/contact` - Form kontak

## 🗄️ Setup Supabase

### 1. Buat Project Supabase
1. Buka [supabase.com](https://supabase.com)
2. Buat project baru
3. Ambil URL dan API Key dari Settings > API

### 2. Buat Tabel Database
```sql
-- Tabel Alumni
CREATE TABLE alumni (
  id SERIAL PRIMARY KEY,
  nama VARCHAR(255) NOT NULL,
  angkatan VARCHAR(10) NOT NULL,
  bidang VARCHAR(100) NOT NULL,
  linkedin VARCHAR(255),
  foto VARCHAR(255),
  keterhubungan VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabel Info Karier
CREATE TABLE infoprof (
  id SERIAL PRIMARY KEY,
  judul VARCHAR(255) NOT NULL,
  jenis VARCHAR(50) NOT NULL,
  tanggal DATE NOT NULL,
  deskripsi TEXT NOT NULL,
  link VARCHAR(255),
  arsip BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabel Cerita Alumni
CREATE TABLE ceritakita (
  id SERIAL PRIMARY KEY,
  nama VARCHAR(255) NOT NULL,
  gambar VARCHAR(255),
  cerita TEXT NOT NULL,
  publish_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabel Event
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  nama_acara VARCHAR(255) NOT NULL,
  tanggal DATE NOT NULL,
  deskripsi TEXT NOT NULL,
  rsvp VARCHAR(255),
  feedback VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabel Company Visit
CREATE TABLE company_visit (
  id SERIAL PRIMARY KEY,
  perusahaan VARCHAR(255) NOT NULL,
  tanggal DATE NOT NULL,
  laporan VARCHAR(255),
  galeri TEXT[],
  testimoni TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabel Dokumen REAKTOR
CREATE TABLE reaktor (
  id SERIAL PRIMARY KEY,
  judul VARCHAR(255) NOT NULL,
  file VARCHAR(255) NOT NULL,
  deskripsi TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🔧 Konfigurasi Netlify CMS

### 1. Akses Admin Panel
- URL: `https://your-site.netlify.app/admin`
- Login dengan GitHub atau Netlify Identity

### 2. Upload Media
- Folder: `/public/uploads/`
- Format: JPG, PNG, PDF
- Maksimal: 10MB per file

### 3. Kelola Konten
- **Alumni**: Tambah/edit data alumni
- **Info Karier**: Post lowongan, magang, beasiswa
- **CeritaKita**: Tambah cerita alumni
- **Event**: Buat event baru
- **Company Visit**: Upload dokumentasi
- **REAKTOR**: Upload dokumen

## 📱 Fitur Website

### Halaman Publik
- **Home**: Overview ARCADE dengan program unggulan
- **About**: Visi misi dan struktur organisasi
- **Alumni (ALIVE)**: Database alumni dengan filter
- **Info Karier (INFOPROF)**: Papan digital lowongan
- **CeritaKita**: Blog alumni inspiratif
- **Events**: Daftar event INSIGHT & SINERGI
- **Company Visit**: Dokumentasi kunjungan industri
- **REAKTOR**: Download dokumen
- **LivingLink**: Form pendaftaran alumni
- **Contact**: Form kontak

### Admin Panel (`/admin`)
- CRUD semua konten
- Upload media
- Kelola jadwal publikasi
- Statistik website

## 🔗 Integrasi

### Netlify Forms
- Form data otomatis masuk ke Netlify
- Bisa di-export atau dihubungkan ke Supabase

### Supabase
- Database real-time
- File storage untuk media
- API untuk fetch data

### Instagram Feed
- Embed via SnapWidget atau iframe
- Update otomatis dari Instagram asli

## 🚀 Testing

### Local Development
```bash
npm run dev
# Buka http://localhost:3000
```

### Production
```bash
npm run build
npm start
```

## 📊 Monitoring

### Analytics
- Netlify Analytics (gratis)
- Google Analytics (opsional)

### Performance
- Lighthouse score
- Core Web Vitals
- Mobile responsiveness

## 🔒 Security

### Environment Variables
- Jangan commit `.env.local`
- Gunakan Netlify Environment Variables

### Admin Access
- Netlify Identity untuk login admin
- GitHub OAuth untuk backup

## 📞 Support

### Dokumentasi
- [Next.js Docs](https://nextjs.org/docs)
- [Netlify Docs](https://docs.netlify.com)
- [Supabase Docs](https://supabase.com/docs)

### Kontak
- Email: arcade@himafi.itb.ac.id
- Instagram: @careerhimafi
- LinkedIn: HIMAFI ITB

---

**Website ARCADE HIMAFI ITB siap digunakan!** 🎉 