# ARCADE HIMAFI CMS Setup Script for Windows
# PowerShell script to set up the CMS system

Write-Host "🎯 ARCADE HIMAFI CMS Setup Script" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan

# Function to print colored output
function Write-Success { param($Message) Write-Host "[SUCCESS] $Message" -ForegroundColor Green }
function Write-Warning { param($Message) Write-Host "[WARNING] $Message" -ForegroundColor Yellow }
function Write-Error { param($Message) Write-Host "[ERROR] $Message" -ForegroundColor Red }
function Write-Step { param($Message) Write-Host "`n[STEP] $Message" -ForegroundColor Blue }

# Check if Node.js is installed
Write-Step "Checking Node.js installation..."
try {
    $nodeVersion = node --version
    Write-Success "Node.js is installed: $nodeVersion"
} catch {
    Write-Error "Node.js is not installed. Please install Node.js 18 or higher."
    Write-Host "Download from: https://nodejs.org/" -ForegroundColor Cyan
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Success "npm is installed: $npmVersion"
} catch {
    Write-Error "npm is not installed. Please install npm."
    exit 1
}

# Install dependencies
Write-Step "Installing dependencies..."
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Success "Dependencies installed successfully"
} else {
    Write-Error "Failed to install dependencies"
    exit 1
}

# Create necessary directories
Write-Step "Creating directory structure..."
$directories = @(
    "content\infoprof",
    "content\alumni", 
    "content\ceritakita",
    "content\event",
    "content\companyvisit",
    "content\reaktor",
    "content\pages",
    "public\uploads\images",
    "public\uploads\documents",
    "content\.trash\infoprof",
    "content\.trash\alumni",
    "content\.trash\ceritakita",
    "content\.trash\event",
    "content\.trash\companyvisit",
    "content\.trash\reaktor"
)

foreach ($dir in $directories) {
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "Created: $dir" -ForegroundColor Gray
    }
}
Write-Success "Directory structure created"

# Create sample content files
Write-Step "Creating sample content files..."

# Sample InfoProf content
$infoprofPath = "content\infoprof\sample-magang.md"
if (!(Test-Path $infoprofPath)) {
    $currentDate = Get-Date -Format "yyyy-MM-ddTHH:mm:ss.fffZ"
    $futureDate = (Get-Date).AddDays(30).ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
    
    $infoprofContent = @"
---
judul: "Program Magang Google Summer of Code 2025"
kategori: "Magang"
tanggal_post: "$currentDate"
deskripsi: "Kesempatan magang bergengsi di Google untuk mahasiswa informatika"
link_utama: "https://summerofcode.withgoogle.com/"
kontak_email: "gsoc-mentors@google.com"
sumber: "Google Open Source"
featured_image: "/uploads/gsoc-2025.jpg"
tags: ["magang", "google", "open-source", "programming"]
deadline: "$futureDate"
arsip: false
---

# Program Magang Google Summer of Code 2025

Google Summer of Code adalah program magang global yang mempertemukan mahasiswa dengan organisasi open source. Program ini memberikan kesempatan kepada mahasiswa untuk berkontribusi pada proyek open source yang nyata sambil mendapatkan mentoring dari pengembang berpengalaman.

## Keuntungan Program

- Stipend sebesar `$3000-`$6600 USD
- Mentoring langsung dari expert
- Pengalaman berkontribusi ke proyek open source terkenal
- Networking dengan developer di seluruh dunia
- Sertifikat resmi dari Google

## Persyaratan

- Mahasiswa S1/S2 aktif
- Kemampuan programming yang baik
- Familiar dengan Git dan GitHub
- Kemampuan bahasa Inggris yang baik

## Cara Mendaftar

1. Pilih organisasi dan proyek yang diminati
2. Diskusi dengan mentor di komunitas
3. Buat proposal yang detail
4. Submit aplikasi sebelum deadline

Jangan lewatkan kesempatan emas ini untuk meningkatkan skill programming sambil berkontribusi pada teknologi yang digunakan jutaan orang!
"@
    
    $infoprofContent | Out-File -FilePath $infoprofPath -Encoding UTF8
    Write-Success "Created sample InfoProf content"
}

# Sample Alumni content
$alumniPath = "content\alumni\jane-smith-2019.md"
if (!(Test-Path $alumniPath)) {
    $alumniContent = @"
---
nama: "Jane Smith"
angkatan: "2019"
bidang: "Data Scientist"
linkedin: "https://linkedin.com/in/janesmith"
foto: "/uploads/alumni/jane-smith.jpg"
prestasi:
  - "Summa Cum Laude Graduate"
  - "Kaggle Competition Winner"
  - "Published ML Research Paper"
---

# Perjalanan Karier Jane Smith

Sebagai alumni Informatika angkatan 2019, Jane telah menjadi Data Scientist terkemuka di industri teknologi. Spesialisasinya dalam Machine Learning dan AI membuatnya dipercaya untuk memimpin berbagai proyek inovatif.

## Pengalaman Kerja

**Netflix (2023 - Present)**
- Senior Data Scientist
- Lead ML Engineer untuk Recommendation System
- Mengembangkan algoritma yang meningkatkan user engagement 15%

**Tokopedia (2021 - 2023)**
- Data Scientist
- Fraud Detection System Development
- A/B Testing dan Product Analytics

**Gojek (2019 - 2021)**
- Junior Data Scientist
- Demand Forecasting untuk GoFood
- Dynamic Pricing Algorithm

## Prestasi Akademik

- IPK: 3.85/4.00
- Juara 1 Hackathon Nasional AI 2019
- Research Assistant di Computer Vision Lab

## Pesan untuk Adik Kelas

"Data Science bukan hanya tentang coding, tapi juga tentang storytelling dengan data. Pelajari statistik dengan baik, praktek dengan dataset real, dan jangan takut untuk mencoba hal baru!"

## Kontak

Feel free to reach out via LinkedIn untuk diskusi tentang career path di Data Science!
"@
    
    $alumniContent | Out-File -FilePath $alumniPath -Encoding UTF8
    Write-Success "Created sample Alumni content"
}

# Sample Event content
$eventPath = "content\event\tech-talk-ai-2025.md"
if (!(Test-Path $eventPath)) {
    $eventDate = (Get-Date).AddDays(14).ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
    
    $eventContent = @"
---
judul: "Tech Talk: Future of AI in Indonesia"
deskripsi: "Diskusi mendalam tentang perkembangan AI dan peluang karier di Indonesia"
tanggal_event: "$eventDate"
lokasi: "Auditorium HIMAFI, Gedung E"
link_daftar: "https://bit.ly/techtalk-ai-2025"
poster: "/uploads/events/tech-talk-ai-poster.jpg"
organizer: "HIMAFI"
---

# Tech Talk: Future of AI in Indonesia

HIMAFI dengan bangga mempersembahkan Tech Talk bertema "Future of AI in Indonesia" yang akan menghadirkan praktisi AI terkemuka untuk berbagi insight tentang perkembangan dan peluang AI di tanah air.

## Pembicara

### Dr. Andi Susanto
- AI Research Director di Traveloka
- Former Google AI Researcher
- 15+ tahun pengalaman di bidang Machine Learning

### Sarah Wijaya
- Co-founder AI Startup
- Kaggle Grandmaster
- Spesialis Computer Vision

## Agenda

**13:00 - 13:30** : Registration & Networking
**13:30 - 14:30** : Keynote: "AI Landscape in Indonesia"
**14:30 - 15:30** : Panel Discussion: "Career Opportunities in AI"
**15:30 - 16:00** : Q&A Session
**16:00 - 16:30** : Networking & Closing

## Fasilitas

- Sertifikat kehadiran
- Snack & Coffee break
- Networking session dengan industry experts
- Doorprize menarik

## Target Peserta

- Mahasiswa Informatika & related fields
- Fresh graduates yang tertarik AI career
- Professionals yang ingin pivot ke AI

Daftarkan diri kalian sekarang! Slot terbatas hanya untuk 100 peserta pertama.

#TechTalk #AI #HIMAFI #CareerDevelopment
"@
    
    $eventContent | Out-File -FilePath $eventPath -Encoding UTF8
    Write-Success "Created sample Event content"
}

# Setup environment file
Write-Step "Setting up environment configuration..."
if (!(Test-Path ".env.local")) {
    Copy-Item "env.example" ".env.local"
    Write-Warning "Please update .env.local with your actual environment variables"
    Write-Warning "Important: Set up Netlify credentials for full CMS functionality"
} else {
    Write-Success "Environment file already exists"
}

# Create pages content directory and sample files
Write-Step "Creating static pages content..."
$pagesDir = "content\pages"
if (!(Test-Path $pagesDir)) {
    New-Item -ItemType Directory -Path $pagesDir -Force | Out-Null
}

# About page
$aboutPath = "content\pages\about.md"
if (!(Test-Path $aboutPath)) {
    $aboutContent = @"
---
title: "Tentang ARCADE HIMAFI"
---

# Tentang ARCADE HIMAFI

ARCADE HIMAFI adalah platform digital resmi Himpunan Mahasiswa Informatika yang bertujuan untuk menjadi pusat informasi, networking, dan pengembangan karier bagi mahasiswa dan alumni Informatika.

## Visi

Menjadi platform terdepan dalam mendukung pengembangan karier dan networking komunitas Informatika di Indonesia.

## Misi

1. Menyediakan informasi karier dan peluang magang terkini
2. Memfasilitasi networking antara mahasiswa, alumni, dan industri
3. Mendokumentasikan perjalanan karier alumni sebagai inspirasi
4. Mengembangkan ekosistem pembelajaran berkelanjutan

## Fitur Utama

### 📋 Info Karier & Profesi
Portal informasi lowongan kerja, magang, beasiswa, dan peluang karier lainnya yang dikurasi khusus untuk mahasiswa Informatika.

### 🎓 Alumni Network
Database alumni dengan profil lengkap, pengalaman karier, dan kontak untuk networking dan mentoring.

### 📖 CeritaKita
Platform berbagi cerita inspiratif dari alumni tentang perjalanan karier, tips sukses, dan insight industri.

### 🎉 Events
Informasi lengkap tentang seminar, workshop, tech talk, dan acara pengembangan karier lainnya.

### 🏢 Company Visit
Dokumentasi kunjungan industri dan laporan dari berbagai perusahaan teknologi.

### ⚛️ Reaktor
Blog teknis berisi tutorial, artikel, review teknologi, dan tips pengembangan skill.

## Tim Pengembang

ARCADE HIMAFI dikembangkan oleh tim mahasiswa Informatika dengan dukungan penuh dari organisasi HIMAFI.

## Kontak

**Email:** info@himafi.com
**Instagram:** @himafi_official
**LinkedIn:** HIMAFI - Himpunan Mahasiswa Informatika

---

*Bergabunglah dengan komunitas kami dan wujudkan karier impian di bidang teknologi!*
"@
    
    $aboutContent | Out-File -FilePath $aboutPath -Encoding UTF8
    Write-Success "Created About page content"
}

# Contact page
$contactPath = "content\pages\contact.md"
if (!(Test-Path $contactPath)) {
    $contactContent = @"
---
title: "Hubungi Kami"
email: "info@himafi.com"
instagram: "@himafi_official"
whatsapp: "+62812-3456-7890"
---

# Hubungi Kami

Kami senang mendengar dari Anda! Jangan ragu untuk menghubungi tim ARCADE HIMAFI melalui berbagai channel komunikasi di bawah ini.

## Kontak Resmi

### 📧 Email
**info@himafi.com**
Untuk pertanyaan umum, saran, atau proposal kerjasama.

### 📱 Instagram
**@himafi_official**
Follow kami untuk update terbaru, pengumuman acara, dan konten menarik seputar dunia Informatika.

### 💬 WhatsApp
**+62812-3456-7890**
Untuk pertanyaan urgent atau koordinasi acara.

### 💼 LinkedIn
**HIMAFI - Himpunan Mahasiswa Informatika**
Connect dengan kami untuk networking profesional dan update karier.

## Alamat Sekretariat

**Gedung Informatika Lantai 2**
Universitas XYZ
Jl. Raya Kampus No. 123
Kota, Provinsi 12345

**Jam Operasional:**
Senin - Jumat: 09:00 - 17:00 WIB

## Untuk Alumni

Jika Anda adalah alumni yang ingin:
- Menambahkan profil ke database alumni
- Berbagi cerita karier di CeritaKita
- Menjadi mentor atau speaker
- Berkolaborasi dalam acara

Silakan hubungi kami melalui email dengan subject: **[ALUMNI] - [Keperluan Anda]**

## Untuk Perusahaan

Tertarik untuk berkolaborasi dengan HIMAFI dalam:
- Job fair dan recruitment
- Company visit
- Sponsorship acara
- Workshop atau training

Kirim proposal kerjasama Anda ke email kami dengan subject: **[PARTNERSHIP] - [Nama Perusahaan]**

## Untuk Mahasiswa

Ada pertanyaan tentang:
- Informasi karier dan magang
- Cara bergabung dengan HIMAFI
- Event dan workshop
- Mentoring dan networking

Jangan ragu untuk menghubungi kami atau datang langsung ke sekretariat!

---

*Terima kasih atas kepercayaan dan dukungan Anda untuk ARCADE HIMAFI!*
"@
    
    $contactContent | Out-File -FilePath $contactPath -Encoding UTF8
    Write-Success "Created Contact page content"
}

# Build the project
Write-Step "Building the project..."
npm run build
if ($LASTEXITCODE -eq 0) {
    Write-Success "Project built successfully"
} else {
    Write-Error "Build failed"
    Write-Warning "This might be normal if some environment variables are not set yet"
}

# Create a simple start script
Write-Step "Creating start scripts..."
$startScript = @"
@echo off
echo Starting ARCADE HIMAFI Development Server...
echo.
echo Available URLs:
echo - Local:            http://localhost:3000
echo - Admin Panel:      http://localhost:3000/admin/
echo - Simple Admin:     http://localhost:3000/admin-simple.html
echo.
npm run dev
"@

$startScript | Out-File -FilePath "start-dev.bat" -Encoding ASCII
Write-Success "Created start-dev.bat script"

# Print completion message
Write-Host ""
Write-Host "🎉 Setup completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Update .env.local with your environment variables" -ForegroundColor White
Write-Host "2. Configure Netlify CMS:" -ForegroundColor White
Write-Host "   - Set up Netlify Identity" -ForegroundColor Gray
Write-Host "   - Configure Git Gateway" -ForegroundColor Gray
Write-Host "   - Set up build hooks" -ForegroundColor Gray
Write-Host "3. Deploy to Netlify:" -ForegroundColor White
Write-Host "   - Connect your GitHub repository" -ForegroundColor Gray
Write-Host "   - Set build command: npm run build" -ForegroundColor Gray
Write-Host "   - Set publish directory: out" -ForegroundColor Gray
Write-Host ""
Write-Host "Access URLs:" -ForegroundColor Cyan
Write-Host "- Development: http://localhost:3000" -ForegroundColor White
Write-Host "- Admin Panel: http://localhost:3000/admin/" -ForegroundColor White
Write-Host "- Simple Admin: http://localhost:3000/admin-simple.html" -ForegroundColor White
Write-Host ""
Write-Host "To start development server:" -ForegroundColor Cyan
Write-Host "npm run dev" -ForegroundColor Yellow
Write-Host "OR" -ForegroundColor Gray
Write-Host "Double-click start-dev.bat" -ForegroundColor Yellow
Write-Host ""
Write-Success "Setup script completed!"

# Ask if user wants to start dev server
$start = Read-Host "Would you like to start the development server now? (y/N)"
if ($start -eq "y" -or $start -eq "Y") {
    Write-Host "Starting development server..." -ForegroundColor Green
    npm run dev
}
