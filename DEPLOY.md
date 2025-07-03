# 🚀 Panduan Deploy Website ARCADE HIMAFI ITB

## 📋 **Overview**
Website ARCADE HIMAFI ITB adalah platform digital untuk divisi pengembangan karier dan hubungan alumni HIMAFI ITB. Website ini menggunakan Next.js, TailwindCSS, Netlify CMS, dan Supabase.

---

## 🛠️ **Tech Stack**
- **Frontend**: Next.js 14 + TypeScript
- **Styling**: TailwindCSS
- **CMS**: Netlify CMS (Decap CMS)
- **Database**: Supabase
- **Hosting**: Netlify
- **Forms**: Netlify Forms
- **Authentication**: Netlify Identity

---

## 📁 **Struktur Website**

### **Halaman Utama**
- **Home** (`/`) - Landing page dengan overview ARCADE
- **About** (`/about`) - Tentang divisi ARCADE
- **Alumni** (`/alumni`) - Database alumni (ALIVE)
- **Info Karier** (`/infoprof`) - Info magang, beasiswa, lowongan
- **CeritaKita** (`/ceritakita`) - Inspirasi alumni
- **Events** (`/events`) - Event INSIGHT & SINERGI
- **Company Visit** (`/company-visit`) - Dokumentasi kunjungan industri
- **REAKTOR** (`/reaktor`) - Download dokumen
- **LivingLink** (`/livinglink`) - Form pendaftaran alumni
- **Contact** (`/contact`) - Hubungi kami

### **Admin Dashboard**
- **URL**: `/admin`
- **Fitur**: CMS visual untuk kelola konten
- **Auth**: Netlify Identity

---

## 🚀 **Deploy ke Netlify**

### **1. Persiapan Repository**
```bash
# Clone repository
git clone [URL_REPOSITORY]
cd website-arcade-final-1

# Install dependencies
npm install

# Build project
npm run build
```

### **2. Deploy via Netlify UI**
1. Buka [netlify.com](https://netlify.com)
2. Klik "New site from Git"
3. Pilih repository GitHub
4. Set build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `out`
5. Klik "Deploy site"

### **3. Environment Variables**
Set environment variables di Netlify Dashboard:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Netlify Identity
NEXT_PUBLIC_NETLIFY_IDENTITY_URL=https://your-site.netlify.app
```

---

## 🔐 **Setup Netlify Identity**

### **1. Enable Identity**
1. Buka Netlify Dashboard → Site settings
2. Klik "Identity" → "Enable Identity"
3. Set registration: "Invite only"

### **2. Configure Admin Access**
1. Buka "Identity" → "Users"
2. Invite admin users dengan email
3. Set role: "admin"

### **3. Enable Git Gateway**
1. Buka "Identity" → "Services"
2. Enable "Git Gateway"
3. Authorize dengan GitHub

---

## 🗄️ **Setup Supabase Database**

### **1. Create Supabase Project**
1. Buka [supabase.com](https://supabase.com)
2. Create new project
3. Catat URL dan anon key

### **2. Create Tables**
Jalankan SQL berikut di Supabase SQL Editor:

```sql
-- Alumni table
CREATE TABLE alumni (
  id SERIAL PRIMARY KEY,
  nama VARCHAR(255) NOT NULL,
  angkatan VARCHAR(10) NOT NULL,
  bidang VARCHAR(255),
  linkedin VARCHAR(255),
  foto VARCHAR(255),
  keterhubungan TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- InfoProf table
CREATE TABLE infoprof (
  id SERIAL PRIMARY KEY,
  judul VARCHAR(255) NOT NULL,
  kategori VARCHAR(50) NOT NULL CHECK (kategori IN ('Magang', 'Beasiswa', 'Lowongan')),
  tanggal_post DATE NOT NULL,
  deskripsi TEXT NOT NULL,
  link_utama VARCHAR(255),
  link_tambahan TEXT[],
  kontak JSONB,
  sumber VARCHAR(255) NOT NULL,
  poster_filename VARCHAR(255),
  arsip BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- CeritaKita table
CREATE TABLE ceritakita (
  id SERIAL PRIMARY KEY,
  nama VARCHAR(255) NOT NULL,
  gambar VARCHAR(255),
  cerita TEXT NOT NULL,
  publish_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Events table
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  nama_acara VARCHAR(255) NOT NULL,
  tanggal DATE NOT NULL,
  deskripsi TEXT NOT NULL,
  rsvp VARCHAR(255),
  feedback VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Company Visit table
CREATE TABLE company_visit (
  id SERIAL PRIMARY KEY,
  perusahaan VARCHAR(255) NOT NULL,
  tanggal DATE NOT NULL,
  laporan VARCHAR(255),
  galeri TEXT[],
  testimoni TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Reaktor table
CREATE TABLE reaktor (
  id SERIAL PRIMARY KEY,
  judul VARCHAR(255) NOT NULL,
  file VARCHAR(255) NOT NULL,
  deskripsi TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### **3. Set Row Level Security (RLS)**
```sql
-- Enable RLS
ALTER TABLE alumni ENABLE ROW LEVEL SECURITY;
ALTER TABLE infoprof ENABLE ROW LEVEL SECURITY;
ALTER TABLE ceritakita ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_visit ENABLE ROW LEVEL SECURITY;
ALTER TABLE reaktor ENABLE ROW LEVEL SECURITY;

-- Create policies (read-only for public)
CREATE POLICY "Allow public read access" ON alumni FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON infoprof FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON ceritakita FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON events FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON company_visit FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON reaktor FOR SELECT USING (true);
```

---

## 📝 **Setup Netlify Forms**

### **1. LivingLink Form**
Form sudah dikonfigurasi di `/livinglink` dengan Netlify Forms.

### **2. Contact Form**
Form sudah dikonfigurasi di `/contact` dengan Netlify Forms.

### **3. View Form Submissions**
1. Buka Netlify Dashboard → Site
2. Klik "Forms" tab
3. Lihat submissions dari form

---

## 🤖 **Sistem INFOPROF dengan AI Otomatisasi**

### **Fitur Baru:**
- **AI Prompt Otomatisasi**: Staf bisa gunakan AI untuk ekstrak data dari poster + broadcast
- **Struktur JSON Terstandar**: Format data yang konsisten
- **Admin Dashboard Terintegrasi**: Input manual atau via AI JSON

### **Cara Kerja:**
1. Staf upload poster + paste broadcast ke AI
2. AI generate JSON terstruktur
3. Copy JSON → paste ke admin dashboard
4. Info langsung tampil di website

### **Panduan Lengkap:**
Lihat file `INFOPROF-ADMIN-GUIDE.md` untuk panduan detail penggunaan admin dashboard INFOPROF.

---

## 🔧 **Konfigurasi Lanjutan**

### **1. Custom Domain**
1. Buka Netlify Dashboard → Domain settings
2. Add custom domain
3. Update DNS records

### **2. SSL Certificate**
- Otomatis disediakan Netlify
- HTTPS aktif secara default

### **3. CDN & Performance**
- Otomatis dioptimasi Netlify
- Global CDN aktif

---

## 📊 **Monitoring & Analytics**

### **1. Netlify Analytics**
- Buka Dashboard → Analytics
- Lihat traffic, performance, errors

### **2. Form Submissions**
- Monitor form submissions
- Export data jika diperlukan

### **3. Error Tracking**
- Netlify Functions logs
- Build logs untuk debugging

---

## 🔄 **Update & Maintenance**

### **1. Update Content**
- Via admin dashboard `/admin`
- Atau edit file markdown di repository

### **2. Update Code**
```bash
# Pull latest changes
git pull origin main

# Install new dependencies
npm install

# Build & deploy
npm run build
```

### **3. Backup**
- Database: Supabase backup otomatis
- Content: Git repository
- Files: Netlify CDN

---

## 🆘 **Troubleshooting**

### **Common Issues:**

**Build Error**
```bash
# Check build logs
npm run build

# Clear cache
npm run clean
```

**CMS Not Loading**
- Check Netlify Identity setup
- Verify Git Gateway enabled
- Check admin user permissions

**Database Connection**
- Verify Supabase credentials
- Check RLS policies
- Test connection in Supabase dashboard

**Forms Not Working**
- Check Netlify Forms enabled
- Verify form names match
- Check spam filter settings

---

## 📞 **Support & Contact**

### **Technical Support:**
- **Email**: arcade@himafi.itb.ac.id
- **Documentation**: Lihat file README.md
- **Issues**: GitHub repository issues

### **Admin Access:**
- **Admin Panel**: `/admin`
- **Identity Setup**: Netlify Dashboard
- **User Management**: Invite via Netlify Identity

---

## ✅ **Checklist Deploy**

- [ ] Repository cloned dan dependencies installed
- [ ] Netlify site created dan connected ke GitHub
- [ ] Environment variables set di Netlify
- [ ] Netlify Identity enabled dan configured
- [ ] Git Gateway enabled
- [ ] Supabase project created dan tables created
- [ ] RLS policies set
- [ ] Admin users invited
- [ ] Custom domain configured (opsional)
- [ ] Forms tested
- [ ] Admin dashboard accessible
- [ ] Content uploaded via CMS
- [ ] Performance tested
- [ ] Mobile responsive checked

---

## 🎉 **Website Siap Digunakan!**

Setelah semua setup selesai, website ARCADE HIMAFI ITB siap digunakan dengan fitur:

✅ **Admin Dashboard** - Kelola konten tanpa coding  
✅ **AI Otomatisasi INFOPROF** - Ekstrak data dengan AI  
✅ **Responsive Design** - Optimal di semua device  
✅ **Fast Performance** - CDN dan optimasi  
✅ **SEO Optimized** - Meta tags dan sitemap  
✅ **Form Handling** - Netlify Forms integration  
✅ **Database** - Supabase untuk data dinamis  

**Website siap membantu mahasiswa Fisika ITB menemukan peluang karier terbaik!** 🚀 