# 🎯 ARCADE HIMAFI CMS - Panduan Lengkap

## Daftar Isi
1. [Pengenalan](#pengenalan)
2. [Fitur Utama](#fitur-utama)
3. [Setup dan Instalasi](#setup-dan-instalasi)
4. [Konfigurasi](#konfigurasi)
5. [Penggunaan Admin Panel](#penggunaan-admin-panel)
6. [Manajemen Konten](#manajemen-konten)
7. [Deployment](#deployment)
8. [Troubleshooting](#troubleshooting)
9. [API Reference](#api-reference)

## Pengenalan

ARCADE HIMAFI CMS adalah sistem manajemen konten yang terintegrasi untuk website HIMAFI. Sistem ini memungkinkan admin untuk mengelola konten website secara mudah dan otomatis melakukan deployment ke Netlify.

### Teknologi yang Digunakan
- **Framework**: Next.js 15 dengan TypeScript
- **CMS**: Netlify CMS dengan Git Gateway
- **Styling**: Tailwind CSS
- **Deployment**: Netlify
- **Database Content**: Markdown files dengan frontmatter
- **Authentication**: Netlify Identity

## Fitur Utama

### 🎨 Dual Admin Interface
- **Full CMS**: Interface lengkap dengan Netlify CMS
- **Simple Admin**: Dashboard sederhana untuk quick actions

### 📝 Content Management
- **Info Karier**: Manajemen lowongan, magang, beasiswa
- **Alumni**: Database profil alumni dengan pengalaman karier
- **CeritaKita**: Platform berbagi cerita inspiratif
- **Events**: Manajemen acara dan workshop
- **Company Visit**: Dokumentasi kunjungan industri
- **Reaktor**: Blog teknis dan tutorial

### 📁 Media Management
- Upload dan manajemen file gambar
- Organisasi file dalam folder
- Auto-optimization untuk web
- Trash system untuk file yang dihapus

### 🚀 Auto Deployment
- Integrasi dengan Netlify build hooks
- Status monitoring deployment
- Auto-deploy saat konten diupdate

### 🔐 Security Features
- Admin authentication via Netlify Identity
- API protection dengan bearer tokens
- File type validation
- Content validation

## Setup dan Instalasi

### Prasyarat
- Node.js 18 atau lebih tinggi
- npm atau yarn
- Git
- Akun Netlify
- Akun GitHub

### 1. Clone dan Setup

#### Untuk Windows (PowerShell):
```powershell
# Run setup script
.\setup-cms.ps1
```

#### Manual Setup:
```bash
# Install dependencies
npm install

# Create directory structure
mkdir -p content/{infoprof,alumni,ceritakita,event,companyvisit,reaktor,pages}
mkdir -p public/uploads/{images,documents}

# Copy environment file
cp env.example .env.local

# Build project
npm run build
```

### 2. Konfigurasi Environment

Edit file `.env.local`:

```env
# Supabase (opsional)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key

# Netlify Configuration
NETLIFY_SITE_ID=your_netlify_site_id
NETLIFY_ACCESS_TOKEN=your_netlify_access_token
NETLIFY_BUILD_HOOK_URL=your_build_hook_url

# Admin API Security
ADMIN_SECRET_KEY=your_secret_key

# CMS Configuration
CMS_BRANCH=main
```

## Konfigurasi

### 1. Setup Netlify Identity

1. Login ke Netlify Dashboard
2. Pilih site Anda
3. Go to **Identity** tab
4. Click **Enable Identity**
5. Set **Registration preferences** ke "Invite only"
6. Pada **External providers**, aktifkan GitHub/Google
7. Go to **Settings & usage** > **Git Gateway** > Enable

### 2. Konfigurasi Git Gateway

1. Di Netlify Dashboard, pergi ke **Identity** > **Settings and usage**
2. Scroll ke **Git Gateway** section
3. Click **Enable Git Gateway**
4. Pilih repository GitHub Anda

### 3. Setup Build Hook

1. Di Netlify Dashboard, pergi ke **Site settings** > **Build & deploy**
2. Scroll ke **Build hooks** section
3. Click **Add build hook**
4. Beri nama "CMS Content Update"
5. Copy URL yang dihasilkan ke environment variable `NETLIFY_BUILD_HOOK_URL`

## Penggunaan Admin Panel

### Akses Admin Panel

1. **Full CMS**: `https://yoursite.netlify.app/admin/`
2. **Simple Admin**: `https://yoursite.netlify.app/admin-simple.html`
3. **Development**: `http://localhost:3000/admin/`

### Login ke CMS

1. Kunjungi `/admin/`
2. Klik "Login with Netlify Identity"
3. Jika belum ada akun, minta invitation dari admin
4. Setelah login, Anda dapat mulai mengelola konten

### Dashboard Features

#### Full CMS Features:
- **Content Editor**: WYSIWYG editor dengan preview
- **Media Library**: Upload dan manajemen file
- **Workflow**: Draft, review, publish workflow
- **Real-time Preview**: Preview konten sebelum publish

#### Simple Admin Features:
- **Quick Stats**: Overview konten dan statistik
- **Content List**: Daftar konten dengan aksi cepat
- **Media Management**: Upload dan hapus file
- **Deployment Status**: Monitor status deployment

## Manajemen Konten

### 1. Info Karier

Untuk menambah informasi karier baru:

1. Pilih **Info Karier** di sidebar
2. Click **New Info Karier**
3. Isi form:
   - **Judul**: Judul informasi
   - **Kategori**: Magang/Beasiswa/Lowongan/Sertifikasi/Kompetisi
   - **Tanggal Post**: Tanggal publikasi
   - **Deskripsi**: Deskripsi singkat
   - **Konten Detail**: Konten lengkap (Markdown)
   - **Link Utama**: Link pendaftaran/info lebih lanjut
   - **Email Kontak**: Email untuk pertanyaan
   - **Sumber**: Sumber informasi
   - **Featured Image**: Gambar utama
   - **Tags**: Tag untuk pencarian
   - **Deadline**: Tanggal deadline
   - **Arsip**: Centang untuk mengarsipkan

4. Click **Publish** atau **Save as Draft**

### 2. Alumni

Untuk menambah profil alumni:

1. Pilih **Alumni** di sidebar
2. Click **New Alumni**
3. Isi form:
   - **Nama**: Nama lengkap alumni
   - **Angkatan**: Tahun lulus
   - **Bidang Karier**: Bidang kerja saat ini
   - **LinkedIn**: URL LinkedIn profile
   - **Foto Profil**: Foto alumni
   - **Prestasi**: List prestasi (opsional)
   - **Pengalaman Kerja**: Pengalaman kerja (Markdown)
   - **Pesan untuk Adik Kelas**: Pesan inspiratif (Markdown)

### 3. CeritaKita

Untuk menambah cerita alumni:

1. Pilih **CeritaKita** di sidebar
2. Click **New CeritaKita**
3. Isi form:
   - **Nama Alumni**: Nama penulis cerita
   - **Cerita**: Konten cerita (Markdown)
   - **Tanggal Terbit**: Tanggal publikasi
   - **Foto**: Foto pendukung
   - **Kategori Cerita**: Karier/Akademik/Inspirasi/Tips

### 4. Events

Untuk menambah event:

1. Pilih **Events** di sidebar
2. Click **New Events**
3. Isi form:
   - **Judul Event**: Nama acara
   - **Deskripsi**: Deskripsi singkat
   - **Tanggal Event**: Tanggal pelaksanaan
   - **Lokasi**: Tempat acara
   - **Link Pendaftaran**: URL pendaftaran
   - **Poster**: Gambar poster acara
   - **Detail Event**: Detail lengkap (Markdown)
   - **Organizer**: Penyelenggara (default: HIMAFI)

### 5. Company Visit

Untuk mendokumentasikan kunjungan perusahaan:

1. Pilih **Company Visit** di sidebar
2. Click **New Company Visit**
3. Isi form:
   - **Nama Perusahaan**: Nama perusahaan
   - **Tanggal Kunjungan**: Tanggal kunjungan
   - **Deskripsi**: Deskripsi singkat
   - **Laporan Kunjungan**: Laporan lengkap (Markdown)
   - **Foto Gallery**: Upload multiple foto
   - **Bidang Industri**: Sektor industri perusahaan

### 6. Reaktor

Untuk menambah artikel teknis:

1. Pilih **Reaktor** di sidebar
2. Click **New Reaktor**
3. Isi form:
   - **Judul**: Judul artikel
   - **Kategori**: Tutorial/Artikel/Review/Tips
   - **Tanggal Publish**: Tanggal publikasi
   - **Penulis**: Nama penulis
   - **Konten**: Konten artikel (Markdown)
   - **Featured Image**: Gambar utama
   - **Tags**: Tag untuk kategori

### 7. Halaman Statis

Untuk mengedit halaman About dan Contact:

1. Pilih **Halaman Statis** di sidebar
2. Pilih halaman yang ingin diedit
3. Edit konten sesuai kebutuhan
4. Save changes

## Deployment

### Automatic Deployment

Sistem secara otomatis akan melakukan deployment ke Netlify ketika:
- Konten baru dipublish via CMS
- File diupload atau dihapus
- Konfigurasi diubah

### Manual Deployment

1. Via CMS:
   - Buka Simple Admin Dashboard
   - Klik tab "Deploy"
   - Klik "Deploy Now"

2. Via API:
   ```bash
   curl -X POST https://yoursite.netlify.app/api/admin/deploy \
     -H "Authorization: Bearer YOUR_SECRET_KEY" \
     -H "Content-Type: application/json" \
     -d '{"message": "Manual deployment"}'
   ```

3. Via Netlify Dashboard:
   - Login ke Netlify
   - Pilih site Anda
   - Go to "Deploys" tab
   - Click "Trigger deploy"

### Deployment Status

Monitor status deployment melalui:
- Simple Admin Dashboard > Deploy tab
- Netlify Dashboard > Deploys
- API endpoint: `/api/admin/deploy`

## Troubleshooting

### CMS Tidak Bisa Login

**Problem**: Error saat login ke admin panel

**Solutions**:
1. Pastikan Netlify Identity sudah diaktifkan
2. Check apakah user sudah diinvite
3. Verify Git Gateway configuration
4. Clear browser cache dan cookies

### Build Gagal

**Problem**: Deployment gagal dengan build error

**Solutions**:
1. Check build logs di Netlify Dashboard
2. Verify environment variables
3. Pastikan semua dependencies terinstall
4. Check syntax error di config files

### Konten Tidak Muncul

**Problem**: Konten yang dipublish tidak muncul di website

**Solutions**:
1. Check apakah deployment berhasil
2. Verify file format dan frontmatter
3. Clear CDN cache di Netlify
4. Check file permissions

### Media Upload Gagal

**Problem**: Error saat upload gambar/file

**Solutions**:
1. Check file size (max 10MB)
2. Verify file type yang diizinkan
3. Check folder permissions
4. Ensure API routes working

### Slow Performance

**Problem**: Website loading lambat

**Solutions**:
1. Optimize images (gunakan WebP format)
2. Enable Netlify's asset optimization
3. Check bundle size dengan `npm run analyze`
4. Implement lazy loading untuk images

## API Reference

### Authentication

Semua API routes admin memerlukan authorization header:

```
Authorization: Bearer YOUR_SECRET_KEY
```

### Content API

#### GET /api/admin/content

Get content list:

```bash
GET /api/admin/content?type=infoprof&id=sample-post
```

Parameters:
- `type`: Content type (infoprof, alumni, ceritakita, event, companyvisit, reaktor)
- `id`: Specific content ID (optional)

#### POST /api/admin/content

Create new content:

```bash
POST /api/admin/content
Content-Type: application/json
Authorization: Bearer YOUR_SECRET_KEY

{
  "type": "infoprof",
  "data": {
    "judul": "New Job Opening",
    "kategori": "Lowongan",
    "tanggal_post": "2025-07-03T10:00:00.000Z",
    "deskripsi": "Great opportunity..."
  },
  "content": "# Job Details\n\nDescription here..."
}
```

#### PUT /api/admin/content

Update existing content:

```bash
PUT /api/admin/content
Content-Type: application/json
Authorization: Bearer YOUR_SECRET_KEY

{
  "type": "infoprof",
  "id": "existing-post-id",
  "data": { "judul": "Updated Title" },
  "content": "Updated content..."
}
```

#### DELETE /api/admin/content

Delete content:

```bash
DELETE /api/admin/content?type=infoprof&id=post-to-delete
Authorization: Bearer YOUR_SECRET_KEY
```

### Media API

#### GET /api/admin/media

List media files:

```bash
GET /api/admin/media?folder=images&type=image
```

#### POST /api/admin/media

Upload file:

```bash
POST /api/admin/media
Content-Type: multipart/form-data
Authorization: Bearer YOUR_SECRET_KEY

FormData:
- file: [File]
- folder: "images" (optional)
```

#### DELETE /api/admin/media

Delete file:

```bash
DELETE /api/admin/media?path=/uploads/image.jpg
Authorization: Bearer YOUR_SECRET_KEY
```

### Deployment API

#### GET /api/admin/deploy

Check deployment status:

```bash
GET /api/admin/deploy
```

#### POST /api/admin/deploy

Trigger deployment:

```bash
POST /api/admin/deploy
Content-Type: application/json
Authorization: Bearer YOUR_SECRET_KEY

{
  "message": "Content update from CMS"
}
```

### Dashboard API

#### GET /api/admin/dashboard

Get dashboard statistics:

```bash
GET /api/admin/dashboard
```

Response:
```json
{
  "success": true,
  "dashboard": {
    "content": {
      "total": 45,
      "breakdown": {
        "infoprof": 12,
        "alumni": 8,
        "ceritakita": 15,
        "event": 5,
        "companyvisit": 3,
        "reaktor": 2
      },
      "recentActivity": 7
    },
    "media": {
      "totalFiles": 23,
      "totalSize": "15.7 MB"
    },
    "quickStats": [...]
  }
}
```

## Keamanan

### Best Practices

1. **Environment Variables**: Jangan commit file `.env.local`
2. **API Keys**: Gunakan key yang strong dan rotate secara berkala
3. **User Management**: Hanya invite user yang diperlukan ke Netlify Identity
4. **File Upload**: Validate file type dan size
5. **Content Validation**: Sanitize user input untuk mencegah XSS

### Security Headers

Tambahkan security headers di `netlify.toml`:

```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

## Contributing

Untuk berkontribusi pada pengembangan CMS:

1. Fork repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## Support

Untuk bantuan teknis:
- **Email**: technical@himafi.com
- **GitHub Issues**: [Repository Issues](https://github.com/your-repo/issues)
- **Documentation**: [Wiki Pages](https://github.com/your-repo/wiki)

## Changelog

### v1.0.0 (2025-07-03)
- Initial release
- Full CMS integration with Netlify
- Simple Admin Dashboard
- Content management for all sections
- Media management system
- Auto-deployment integration
- API endpoints for all operations
- Comprehensive documentation

---

**© 2025 HIMAFI - Himpunan Mahasiswa Informatika**
