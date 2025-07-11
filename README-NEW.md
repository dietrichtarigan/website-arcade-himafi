# 🎯 Website ARCADE HIMAFI ITB

[![Deploy Status](https://api.netlify.com/api/v1/badges/your-site-id/deploy-status)](https://app.netlify.com/sites/your-site-name/deploys)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4)](https://tailwindcss.com/)

Website resmi divisi **ARCADE (Alumni Relations, Career Development, and Events)** HIMAFI ITB untuk mengelola pengembangan karier, hubungan alumni, dan acara-acara strategis.

## 🌟 Features

### 🎯 Core Features
- **Alumni Database (ALIVE)** - Database alumni HIMAFI ITB
- **Info Karier (InfoProf)** - Informasi magang, beasiswa, dan lowongan kerja
- **CeritaKita** - Platform berbagi inspirasi alumni
- **Events Management** - Manajemen acara INSIGHT & SINERGI
- **Company Visit** - Dokumentasi kunjungan industri
- **REAKTOR** - Download center untuk dokumen
- **LivingLink** - Form pendaftaran alumni baru

### 🔧 Technical Features
- **Modern Stack**: Next.js 15 + TypeScript + TailwindCSS
- **Headless CMS**: Netlify CMS untuk manajemen konten
- **Database**: Supabase untuk data persistence
- **Authentication**: Netlify Identity untuk admin access
- **Forms**: Netlify Forms integration
- **Deployment**: Netlify dengan CI/CD
- **Performance**: Static site generation + caching

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm atau yarn
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/your-username/website-arcade-himafi.git
cd website-arcade-himafi

# Install dependencies
npm install

# Setup environment
cp env.example .env.local
# Edit .env.local dengan konfigurasi Anda

# Start development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) untuk melihat website.

## 📁 Project Structure

```
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── about/          # Halaman tentang
│   │   ├── alumni/         # Database alumni (ALIVE)
│   │   ├── api/            # API routes
│   │   ├── ceritakita/     # Platform inspirasi alumni
│   │   ├── events/         # Management events
│   │   ├── infoprof/       # Info karier
│   │   └── ...
│   ├── components/         # Reusable components
│   └── lib/               # Utilities & configurations
├── content/               # Content files (Markdown)
│   ├── infoprof/         # Info karier content
│   ├── ceritakita/       # Alumni stories
│   ├── events/           # Events content
│   └── ...
├── public/               # Static assets
│   ├── admin/           # Netlify CMS configuration
│   └── uploads/         # User uploaded files
└── data/                # JSON data files
```

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint

# CMS & Setup
npm run setup           # Setup Netlify CMS
npm run cms:config      # Show CMS configuration
npm run cms:test        # Test CMS endpoints

# Deployment
npm run deploy:github   # Setup GitHub repository
npm run deploy:netlify  # Deploy to Netlify
npm run deploy:manual   # Manual Netlify deploy
npm run deploy:preview  # Deploy preview

# Testing
npm run test:build      # Test production build
npm run validate        # Run lint + build test
```

### Environment Variables

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Netlify Identity
NEXT_PUBLIC_NETLIFY_IDENTITY_URL=https://your-site.netlify.app

# Optional: Analytics
NEXT_PUBLIC_GA_ID=your_google_analytics_id
```

## 🚀 Deployment

### Option 1: Automated Deployment

```bash
# Setup GitHub repository dan deploy ke Netlify
npm run deploy:github
npm run deploy:netlify
```

### Option 2: Manual Deployment

1. **Deploy to Netlify**:
   - Connect repository ke Netlify
   - Build command: `npm run build`
   - Publish directory: `out`

2. **Setup Environment Variables** di Netlify Dashboard

3. **Enable Netlify Identity & Git Gateway**

4. **Setup Supabase Database**

Lihat [PANDUAN-DEPLOY-NETLIFY.md](PANDUAN-DEPLOY-NETLIFY.md) untuk panduan lengkap.

## 📝 Content Management

### Admin Access
- URL: `https://your-site.netlify.app/admin`
- Login menggunakan Netlify Identity
- Manage semua konten melalui visual editor

### Content Types
- **Info Karier**: Magang, beasiswa, lowongan kerja
- **Alumni Stories**: Inspirasi dan pengalaman alumni
- **Events**: INSIGHT, SINERGI, dan acara lainnya
- **Company Visits**: Dokumentasi kunjungan industri
- **REAKTOR**: Dokumen dan resources

## 🎨 Customization

### Styling
- TailwindCSS untuk utility-first styling
- Custom components di `src/components/`
- Global styles di `src/app/globals.css`

### Components
- Responsive design dengan mobile-first approach
- Reusable components untuk konsistensi
- TypeScript untuk type safety

## 🔒 Security

- Content Security Policy (CSP) headers
- XSS protection
- Secure authentication dengan Netlify Identity
- Row Level Security (RLS) di Supabase
- Input validation dan sanitization

## 📊 Performance

- Static Site Generation (SSG)
- Image optimization
- Code splitting
- CDN delivery melalui Netlify
- Caching strategies

## 🤝 Contributing

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buka Pull Request

## 📞 Support

- **Documentation**: Lihat folder docs/ untuk panduan lengkap
- **Issues**: [GitHub Issues](https://github.com/your-username/website-arcade-himafi/issues)
- **Email**: arcade@himafi.org
- **Discord**: HIMAFI ITB Server

## 📜 License

This project is licensed under the MIT License - lihat [LICENSE](LICENSE) file untuk detail.

## 🙏 Acknowledgments

- **HIMAFI ITB** - Himpunan Mahasiswa Fisika ITB
- **Divisi ARCADE** - Alumni Relations, Career Development, and Events
- **Contributors** - Semua yang berkontribusi pada project ini

---

**Dibuat dengan ❤️ oleh Tim ARCADE HIMAFI ITB**
