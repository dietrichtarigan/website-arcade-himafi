# ARCADE HIMAFI CMS - Advanced Setup Guide

# Setup PowerShell script - Run as Administrator
if (!([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator))
{
    Write-Host "❌ This script requires Administrator privileges!" -ForegroundColor Red
    Write-Host "Right-click PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    exit 1
}

Write-Host "🚀 ARCADE HIMAFI Advanced CMS Setup" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan

# Check Node.js installation
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js detected: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found! Please install Node.js first." -ForegroundColor Red
    Write-Host "Download from: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Check npm installation
try {
    $npmVersion = npm --version
    Write-Host "✅ npm detected: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm not found!" -ForegroundColor Red
    exit 1
}

Write-Host "`n📦 Installing dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Dependencies installed successfully!" -ForegroundColor Green

# Create necessary directories
Write-Host "`n📁 Creating directory structure..." -ForegroundColor Yellow

$directories = @(
    "data",
    "content/infoprof", 
    "content/alumni",
    "content/ceritakita",
    "content/event",
    "content/companyvisit",
    "content/reaktor",
    "public/uploads",
    ".schedule"
)

foreach ($dir in $directories) {
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "  ✅ Created: $dir" -ForegroundColor Green
    } else {
        Write-Host "  ℹ️  Exists: $dir" -ForegroundColor Blue
    }
}

# Create sample content files if they don't exist
Write-Host "`n📝 Creating sample content..." -ForegroundColor Yellow

# Sample InfoProf content
$sampleInfoProf = @"
---
judul: "Magang Software Engineer - PT Teknologi Indonesia"
perusahaan: "PT Teknologi Indonesia"
posisi: "Software Engineer Intern"
kategori: "Magang"
gaji: "Rp 3,000,000"
lokasi: "Jakarta, Indonesia"
tanggal_post: "2025-07-03"
tanggal_deadline: "2025-08-15"
kontak: "hr@teknologi.co.id"
website: "https://teknologi.co.id"
tags: ["magang", "software", "jakarta", "web-development"]
featured_image: "/uploads/tech-company.jpg"
draft: false
---

# Magang Software Engineer - PT Teknologi Indonesia

## Deskripsi Posisi

Kami mencari mahasiswa berbakat untuk bergabung sebagai Software Engineer Intern di PT Teknologi Indonesia. Kesempatan ini akan memberikan pengalaman berharga dalam pengembangan software dan teknologi terkini.

## Persyaratan

- Mahasiswa aktif jurusan Informatika/Komputer
- Memahami bahasa pemrograman JavaScript, Python, atau Java
- Familiar dengan Git dan version control
- Kemampuan komunikasi yang baik
- Minimal semester 5

## Yang Akan Dipelajari

- Web Development dengan React dan Node.js
- Database management
- API development
- Software testing
- Agile development methodology

## Benefit

- Uang saku Rp 3,000,000/bulan
- Sertifikat magang
- Kesempatan full-time setelah lulus
- Mentoring dari senior developer
- Akses ke training dan workshop

## Cara Melamar

Kirimkan CV dan portfolio ke hr@teknologi.co.id dengan subject "Magang Software Engineer - [Nama Anda]"
"@

if (!(Test-Path "content/infoprof/sample-magang-2025.md")) {
    $sampleInfoProf | Out-File -FilePath "content/infoprof/sample-magang-2025.md" -Encoding UTF8
    Write-Host "  ✅ Created: sample-magang-2025.md" -ForegroundColor Green
}

# Sample Alumni content
$sampleAlumni = @"
---
nama: "Ahmad Rizki Pratama"
angkatan: "2019"
pekerjaan: "Senior Software Engineer"
perusahaan: "Google Indonesia"
lokasi: "Jakarta, Indonesia"
email: "ahmad.rizki@example.com"
linkedin: "https://linkedin.com/in/ahmadrizki"
foto: "/uploads/alumni/ahmad-rizki.jpg"
prestasi: ["Best Graduate 2023", "Outstanding Achievement Award"]
tags: ["google", "software-engineer", "jakarta", "2019"]
tanggal_update: "2025-07-03"
featured: true
draft: false
---

# Ahmad Rizki Pratama - Alumni Berprestasi

## Profil

Ahmad Rizki Pratama adalah alumni HIMAFI angkatan 2019 yang kini berkarir sebagai Senior Software Engineer di Google Indonesia. Perjalanan karirnya dimulai dari magang di startup lokal hingga akhirnya bergabung dengan perusahaan teknologi terbesar dunia.

## Perjalanan Karir

### 2019-2020: Junior Developer at Startup ABC
- Mengembangkan aplikasi mobile untuk e-commerce
- Belajar framework React Native dan Node.js
- Terlibat dalam pengembangan MVP produk

### 2020-2022: Software Engineer at Tech Corp
- Lead developer untuk platform fintech
- Implementasi microservices architecture
- Mentoring junior developer

### 2022-Present: Senior Software Engineer at Google Indonesia
- Core team Google Cloud Platform
- Fokus pada infrastructure dan scalability
- Kontributor open source projects

## Tips untuk Adik-Adik

"Jangan pernah berhenti belajar. Teknologi terus berkembang, dan kita harus selalu update dengan tren terbaru. Manfaatkan masa kuliah untuk build portfolio yang kuat dan jangan takut untuk apply magang di perusahaan impian kalian!"

## Kontak

- Email: ahmad.rizki@example.com
- LinkedIn: [Ahmad Rizki Pratama](https://linkedin.com/in/ahmadrizki)
"@

if (!(Test-Path "content/alumni/ahmad-rizki-2019.md")) {
    $sampleAlumni | Out-File -FilePath "content/alumni/ahmad-rizki-2019.md" -Encoding UTF8
    Write-Host "  ✅ Created: ahmad-rizki-2019.md" -ForegroundColor Green
}

# Create environment file template
Write-Host "`n🔧 Creating environment configuration..." -ForegroundColor Yellow

$envTemplate = @"
# ARCADE HIMAFI CMS Environment Configuration
# Copy this file to .env.local and fill in your values

# Netlify Configuration
NETLIFY_SITE_ID=your_netlify_site_id_here
NETLIFY_ACCESS_TOKEN=your_netlify_access_token_here
NETLIFY_BUILD_HOOK_URL=https://api.netlify.com/build_hooks/your_build_hook_id

# Security
ADMIN_SECRET_KEY=your_super_secret_admin_key_here_please_change_this
JWT_SECRET=your_jwt_secret_key_here_please_change_this

# Authentication
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# Notifications
WEBHOOK_URL=https://your-webhook-url.com/notifications
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Analytics (Optional)
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX

# Database (Optional - for advanced features)
DATABASE_URL=your_database_url_here

# Development
NODE_ENV=development
DEBUG=true
"@

if (!(Test-Path ".env.example")) {
    $envTemplate | Out-File -FilePath ".env.example" -Encoding UTF8
    Write-Host "  ✅ Created: .env.example" -ForegroundColor Green
}

if (!(Test-Path ".env.local")) {
    $envTemplate | Out-File -FilePath ".env.local" -Encoding UTF8
    Write-Host "  ✅ Created: .env.local (please configure!)" -ForegroundColor Yellow
}

# Create Netlify configuration
Write-Host "`n🌐 Creating Netlify configuration..." -ForegroundColor Yellow

$netlifyToml = @"
[build]
  publish = "out"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/admin/*"
  to = "/admin/index.html"
  status = 200

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

# Netlify CMS admin access
[[headers]]
  for = "/admin/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"

# API security headers
[[headers]]
  for = "/api/*"
  [headers.values]
    Access-Control-Allow-Origin = "*"
    Access-Control-Allow-Headers = "Content-Type, Authorization"
    Access-Control-Allow-Methods = "GET, POST, PUT, DELETE, OPTIONS"

# Static assets caching
[[headers]]
  for = "/uploads/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000"

# HTML caching
[[headers]]
  for = "/*.html"
  [headers.values]
    Cache-Control = "public, max-age=3600"
"@

if (!(Test-Path "netlify.toml")) {
    $netlifyToml | Out-File -FilePath "netlify.toml" -Encoding UTF8
    Write-Host "  ✅ Created: netlify.toml" -ForegroundColor Green
}

# Create comprehensive documentation
Write-Host "`n📚 Creating documentation..." -ForegroundColor Yellow

$readmeContent = @"
# 🎯 ARCADE HIMAFI - Advanced CMS System

Sistem manajemen konten lengkap untuk website HIMAFI dengan fitur-fitur canggih dan antarmuka yang user-friendly.

## ✨ Fitur Lengkap

### 🎨 **Dual Interface System**
- **Full CMS Interface** (`/admin/`) - Netlify CMS dengan visual editor lengkap
- **Simple Dashboard** (`/admin-simple.html`) - Dashboard cepat dengan Alpine.js

### 📊 **Advanced Analytics & Monitoring**
- Real-time dashboard dengan Chart.js
- SEO scoring dan recommendations
- Content performance tracking
- User activity monitoring
- Publishing trends analysis

### 👥 **User Management & Collaboration**
- Role-based access control (Admin, Editor, Author, Viewer)
- Real-time user sessions tracking
- Content locking system untuk collaborative editing
- Audit log untuk semua aktivitas

### 🔍 **Powerful Search & SEO**
- Advanced search dengan filtering
- Real-time SEO analysis
- Keyword density checking
- Meta tag optimization
- Internal linking suggestions

### ⏰ **Content Scheduling**
- Schedule content untuk auto-publish
- Retry mechanism untuk failed deployments
- Email dan Slack notifications
- Bulk operations support

### 🔄 **Auto-Deployment**
- Integration dengan Netlify build hooks
- Auto-deploy saat content dipublish
- Build status monitoring
- CDN cache management

## 🚀 Quick Start

### 1. Install Dependencies
\`\`\`powershell
npm install
\`\`\`

### 2. Configure Environment
Copy \`.env.example\` to \`.env.local\` dan isi konfigurasi:
\`\`\`bash
cp .env.example .env.local
\`\`\`

### 3. Run Development Server
\`\`\`bash
npm run dev
\`\`\`

### 4. Access Interfaces
- **Website**: http://localhost:3000
- **Full CMS**: http://localhost:3000/admin/
- **Simple Admin**: http://localhost:3000/admin-simple.html

## 📁 Content Structure

\`\`\`
content/
├── infoprof/         # Info karir & magang
├── alumni/           # Database alumni
├── ceritakita/       # Stories dari alumni
├── event/            # Event & kegiatan
├── companyvisit/     # Company visit
└── reaktor/          # Dokumen & resources
\`\`\`

## 🔧 Configuration

### Netlify Setup
1. Connect repository ke Netlify
2. Set build command: \`npm run build\`
3. Set publish directory: \`out\`
4. Configure environment variables

### Environment Variables
\`\`\`bash
NETLIFY_SITE_ID=your_site_id
NETLIFY_ACCESS_TOKEN=your_token
NETLIFY_BUILD_HOOK_URL=your_build_hook
ADMIN_SECRET_KEY=your_secret_key
JWT_SECRET=your_jwt_secret
\`\`\`

## 📱 Content Management

### Adding Content via CMS
1. Buka \`/admin/\` di browser
2. Login dengan Netlify Identity
3. Pilih collection yang ingin diedit
4. Create/Edit content dengan visual editor
5. Publish untuk auto-deploy

### Adding Content Manually
1. Buat file markdown di folder \`content/[type]/\`
2. Gunakan frontmatter yang sesuai
3. Commit ke repository
4. Deployment otomatis via Netlify

## 🎯 Advanced Features

### Role Management
- **Admin**: Full access ke semua fitur
- **Editor**: Manage content dan media
- **Author**: Create dan edit own content
- **Viewer**: Read-only access

### Content Scheduling
\`\`\`javascript
// Schedule content untuk publish nanti
{
  "publishAt": "2025-12-25T10:00:00Z",
  "actions": ["deploy", "social_media", "email_notify"],
  "notifications": {
    "email": ["admin@himafi.com"],
    "slack": "#content-updates"
  }
}
\`\`\`

### SEO Optimization
- Automatic meta tag generation
- Image optimization
- Internal linking suggestions
- Content readability analysis
- Sitemap auto-generation

### Real-time Features
- Live user sessions
- Content lock system
- Push notifications
- Activity feeds
- Collaborative editing

## 📊 Analytics & Monitoring

### Dashboard Metrics
- Total content count
- Page views dan engagement
- SEO performance scores
- User activity logs
- Publishing trends

### Content Performance
- View tracking per article
- Engagement metrics
- Popular search queries
- Content effectiveness scores

## 🔄 Deployment

### Automatic Deployment
Content otomatis deploy ke Netlify saat:
- Content dipublish via CMS
- Scheduled content ready
- Manual trigger via dashboard

### Manual Deployment
\`\`\`bash
npm run build
npm run deploy:manual
\`\`\`

## 🛠️ Development

### Local Development
\`\`\`bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
\`\`\`

### Adding New Content Types
1. Update \`public/admin/config.yml\`
2. Create content folder
3. Add API routes jika diperlukan
4. Update TypeScript interfaces

### Custom Components
Tambah komponen baru di \`src/components/\` dan import di pages yang membutuhkan.

## 📚 API Reference

### Content API
- \`GET /api/content/[type]\` - Get content by type
- \`POST /api/content/[type]\` - Create new content
- \`PUT /api/content/[type]/[id]\` - Update content
- \`DELETE /api/content/[type]/[id]\` - Delete content

### Admin API
- \`GET /api/admin/dashboard\` - Dashboard data
- \`GET /api/admin/analytics\` - Analytics data
- \`GET /api/admin/users\` - User management
- \`POST /api/admin/deploy\` - Trigger deployment

### Search API
- \`GET /api/admin/search\` - Advanced search
- \`POST /api/admin/search\` - Save search analytics

## 🔒 Security

### Authentication
- Netlify Identity integration
- JWT-based API authentication
- Role-based access control
- Session management

### Data Protection
- Input validation
- XSS protection
- CSRF protection
- Secure headers

## 🐛 Troubleshooting

### Common Issues
1. **CMS not loading**: Check Netlify Identity setup
2. **Build failures**: Verify environment variables
3. **Content not updating**: Check build hooks
4. **Permission errors**: Verify user roles

### Debug Mode
Set \`DEBUG=true\` di environment untuk detailed logging.

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

- **Documentation**: [/docs](/docs)
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Email**: admin@himafi.com
- **Discord**: [HIMAFI Tech](https://discord.gg/himafi)

---

**Made with ❤️ by HIMAFI Tech Team**
"@

$readmeContent | Out-File -FilePath "README-ADVANCED.md" -Encoding UTF8
Write-Host "  ✅ Created: README-ADVANCED.md" -ForegroundColor Green

# Final setup completion
Write-Host "`n🎉 Setup completed successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Configure .env.local with your Netlify credentials" -ForegroundColor White
Write-Host "2. Run: npm run dev" -ForegroundColor White
Write-Host "3. Visit: http://localhost:3000" -ForegroundColor White
Write-Host "4. Access CMS: http://localhost:3000/admin/" -ForegroundColor White
Write-Host "5. Simple Admin: http://localhost:3000/admin-simple.html" -ForegroundColor White
Write-Host ""
Write-Host "🔧 Configuration Files Created:" -ForegroundColor Yellow
Write-Host "  ✅ .env.local (configure this!)" -ForegroundColor Green
Write-Host "  ✅ netlify.toml" -ForegroundColor Green
Write-Host "  ✅ Sample content files" -ForegroundColor Green
Write-Host "  ✅ Advanced documentation" -ForegroundColor Green
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Yellow
Write-Host "  📖 README-ADVANCED.md - Complete setup guide" -ForegroundColor White
Write-Host "  📖 .env.example - Environment configuration template" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Your advanced CMS is ready!" -ForegroundColor Cyan
