# 🚀 Panduan Deploy Website ARCADE ke Netlify dan GitHub

## 📋 Langkah 1: Persiapan Repository Baru

### 1.1 Buat Repository Baru di GitHub
1. Buka [github.com](https://github.com) dan login
2. Klik tombol **"New"** atau **"+"** → **"New repository"**
3. Isi nama repository: `website-arcade-himafi`
4. Set sebagai **Public** repository
5. Jangan centang "Initialize with README" (karena sudah ada)
6. Klik **"Create repository"**

### 1.2 Setup Git dan Push ke Repository Baru
```powershell
# Pindah ke direktori project
cd c:\CODE\website-arcade-final-1

# Initialize git (jika belum)
git init

# Add semua file
git add .

# Commit pertama
git commit -m "Initial commit - Website ARCADE HIMAFI ITB"

# Tambah remote origin (ganti dengan URL repo Anda)
git remote add origin https://github.com/USERNAME/website-arcade-himafi.git

# Push ke GitHub
git push -u origin main
```

## 📋 Langkah 2: Deploy ke Netlify

### 2.1 Deploy Otomatis via GitHub
1. Buka [netlify.com](https://netlify.com) dan login
2. Klik **"New site from Git"**
3. Pilih **"GitHub"** sebagai Git provider
4. Cari dan pilih repository `website-arcade-himafi`
5. Konfigurasi build settings:
   - **Branch to deploy**: `main`
   - **Build command**: `npm run build`
   - **Publish directory**: `out`
6. Klik **"Deploy site"**

### 2.2 Konfigurasi Environment Variables
Di Netlify Dashboard → Site settings → Environment variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Netlify Identity
NEXT_PUBLIC_NETLIFY_IDENTITY_URL=https://your-site-name.netlify.app

# Environment
NODE_ENV=production
NODE_VERSION=18
```

### 2.3 Custom Domain (Opsional)
1. Buka **Domain settings** di Netlify
2. Klik **"Add custom domain"**
3. Masukkan domain: `arcade.himafi.org` atau sesuai keinginan
4. Ikuti instruksi DNS setup

## 📋 Langkah 3: Setup Netlify Identity & CMS

### 3.1 Enable Netlify Identity
1. Di Netlify Dashboard → **Identity**
2. Klik **"Enable Identity"**
3. Set **Registration preferences**: "Invite only"
4. Set **External providers**: Google (opsional)

### 3.2 Enable Git Gateway
1. Buka **Identity** → **Services**
2. Enable **"Git Gateway"**
3. Authorize dengan GitHub account

### 3.3 Invite Admin Users
1. Buka **Identity** → **Users**
2. Klik **"Invite users"**
3. Masukkan email admin
4. Set role sebagai "admin"

## 📋 Langkah 4: Setup Supabase Database

### 4.1 Buat Project Supabase
1. Buka [supabase.com](https://supabase.com)
2. Klik **"New project"**
3. Isi nama: "arcade-himafi-website"
4. Set password database
5. Pilih region terdekat (Singapore)

### 4.2 Setup Database Schema
Jalankan SQL ini di SQL Editor Supabase:

```sql
-- Tabel untuk data alumni
CREATE TABLE alumni (
  id SERIAL PRIMARY KEY,
  nama VARCHAR(255) NOT NULL,
  angkatan INTEGER,
  jurusan VARCHAR(100),
  pekerjaan VARCHAR(255),
  perusahaan VARCHAR(255),
  email VARCHAR(255),
  linkedin_url TEXT,
  foto_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabel untuk submission form
CREATE TABLE submissions (
  id SERIAL PRIMARY KEY,
  form_type VARCHAR(50) NOT NULL,
  data JSONB NOT NULL,
  email VARCHAR(255),
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE alumni ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Policy untuk read public
CREATE POLICY "Allow public read access" ON alumni
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert" ON submissions
  FOR INSERT WITH CHECK (true);
```

### 4.3 Dapatkan API Keys
1. Buka **Settings** → **API**
2. Copy **Project URL** dan **anon public key**
3. Masukkan ke Environment Variables Netlify

## 📋 Langkah 5: Testing dan Validasi

### 5.1 Test Build Lokal
```powershell
# Install dependencies
npm install

# Test build
npm run build

# Test locally
npm start
```

### 5.2 Test CMS Admin
1. Buka `https://your-site.netlify.app/admin`
2. Login dengan email yang diinvite
3. Test create/edit konten
4. Pastikan Git Gateway berjalan

### 5.3 Test Forms
1. Test form kontak di `/contact`
2. Test form LivingLink di `/livinglink`
3. Check submissions di Netlify Dashboard

## 📋 Langkah 6: Monitoring dan Maintenance

### 6.1 Setup Domain Email (Opsional)
```yaml
# netlify.toml - Email redirects
[[redirects]]
  from = "https://yourdomain.com/email-confirmation"
  to = "/.netlify/functions/email-handler"
  status = 200
```

### 6.2 Performance Monitoring
- Enable **Analytics** di Netlify
- Setup **Performance monitoring**
- Monitor **Build times**

### 6.3 Backup Strategy
- Database: Supabase automatic backups
- Code: GitHub repository
- Content: CMS git commits

## 🔧 Troubleshooting

### Build Failures
```powershell
# Clear cache dan rebuild
npm run clean
npm install
npm run build
```

### CMS Issues
- Check Git Gateway connection
- Verify admin user permissions
- Check Netlify Identity settings

### Database Connection
- Verify Supabase URL dan keys
- Check RLS policies
- Test API endpoints

## 📞 Support

Jika ada masalah:
1. Check build logs di Netlify
2. Periksa browser console untuk errors
3. Test API endpoints
4. Check environment variables

---

## ✅ Checklist Deploy

- [ ] Repository GitHub dibuat
- [ ] Code di-push ke GitHub
- [ ] Site deployed di Netlify
- [ ] Environment variables set
- [ ] Custom domain configured (opsional)
- [ ] Netlify Identity enabled
- [ ] Git Gateway enabled
- [ ] Admin users invited
- [ ] Supabase project created
- [ ] Database schema setup
- [ ] API keys configured
- [ ] CMS testing successful
- [ ] Forms testing successful
- [ ] Performance monitoring enabled

**Selamat! Website ARCADE HIMAFI ITB berhasil di-deploy! 🎉**
