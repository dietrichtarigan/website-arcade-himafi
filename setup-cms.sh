#!/bin/bash

# ARCADE HIMAFI CMS Setup Script
# This script sets up the CMS system and prepares for deployment

echo "🎯 ARCADE HIMAFI CMS Setup Script"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "\n${BLUE}[STEP]${NC} $1"
}

# Check if Node.js is installed
print_step "Checking Node.js installation..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_status "Node.js is installed: $NODE_VERSION"
else
    print_error "Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

# Check if npm is installed
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    print_status "npm is installed: $NPM_VERSION"
else
    print_error "npm is not installed. Please install npm."
    exit 1
fi

# Install dependencies
print_step "Installing dependencies..."
npm install
if [ $? -eq 0 ]; then
    print_status "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Create necessary directories
print_step "Creating directory structure..."
mkdir -p content/{infoprof,alumni,ceritakita,event,companyvisit,reaktor,pages}
mkdir -p public/uploads/{images,documents}
mkdir -p content/.trash/{infoprof,alumni,ceritakita,event,companyvisit,reaktor}
print_status "Directory structure created"

# Create sample content files if they don't exist
print_step "Creating sample content files..."

# Sample InfoProf content
if [ ! -f "content/infoprof/sample-magang.md" ]; then
    cat > content/infoprof/sample-magang.md << EOF
---
judul: "Program Magang Google Summer of Code 2025"
kategori: "Magang"
tanggal_post: "$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")"
deskripsi: "Kesempatan magang bergengsi di Google untuk mahasiswa informatika"
link_utama: "https://summerofcode.withgoogle.com/"
kontak_email: "gsoc-mentors@google.com"
sumber: "Google Open Source"
featured_image: "/uploads/gsoc-2025.jpg"
tags: ["magang", "google", "open-source", "programming"]
deadline: "$(date -u -d '+30 days' +"%Y-%m-%dT%H:%M:%S.000Z")"
arsip: false
---

# Program Magang Google Summer of Code 2025

Google Summer of Code adalah program magang global yang mempertemukan mahasiswa dengan organisasi open source. Program ini memberikan kesempatan kepada mahasiswa untuk berkontribusi pada proyek open source yang nyata sambil mendapatkan mentoring dari pengembang berpengalaman.

## Keuntungan Program

- Stipend sebesar $3000-$6600 USD
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
EOF
    print_status "Created sample InfoProf content"
fi

# Sample Alumni content
if [ ! -f "content/alumni/john-doe-2020.md" ]; then
    cat > content/alumni/john-doe-2020.md << EOF
---
nama: "John Doe"
angkatan: "2020"
bidang: "Software Engineer"
linkedin: "https://linkedin.com/in/johndoe"
foto: "/uploads/alumni/john-doe.jpg"
prestasi:
  - "Best Graduate Award 2020"
  - "Google Developer Expert"
  - "Published 3 research papers"
pengalaman: |
  Saat ini bekerja sebagai Senior Software Engineer di Google, memimpin tim untuk pengembangan sistem distributed yang melayani miliaran pengguna.
---

# Perjalanan Karier John Doe

Sebagai alumni Informatika angkatan 2020, John telah mencapai banyak prestasi dalam bidang teknologi. Perjalanan kariernya dimulai dari magang di startup lokal hingga akhirnya bergabung dengan Google sebagai Software Engineer.

## Pengalaman Kerja

**Google (2022 - Present)**
- Senior Software Engineer
- Tech Lead untuk Google Search Infrastructure
- Mengelola tim 8 engineer

**Microsoft (2020 - 2022)**
- Software Engineer
- Berkontribusi pada Azure Cloud Platform
- Mengembangkan microservices architecture

## Pesan untuk Adik Kelas

"Jangan takut untuk bermimpi besar! Fokus pada fundamental programming, selalu belajar teknologi baru, dan yang terpenting - jangan pernah berhenti berkontribusi ke open source community."

## Kontak

Kalian bisa menghubungi saya melalui LinkedIn untuk diskusi seputar karier di tech industry!
EOF
    print_status "Created sample Alumni content"
fi

# Setup environment file
print_step "Setting up environment configuration..."
if [ ! -f ".env.local" ]; then
    cp env.example .env.local
    print_warning "Please update .env.local with your actual environment variables"
    print_warning "Important: Set up Netlify credentials for full CMS functionality"
else
    print_status "Environment file already exists"
fi

# Build the project
print_step "Building the project..."
npm run build
if [ $? -eq 0 ]; then
    print_status "Project built successfully"
else
    print_error "Build failed"
    exit 1
fi

# Setup Git hooks (if .git exists)
if [ -d ".git" ]; then
    print_step "Setting up Git hooks..."
    mkdir -p .git/hooks
    
    cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
echo "Running pre-commit checks..."
npm run lint
if [ $? -ne 0 ]; then
    echo "Linting failed. Please fix the issues before committing."
    exit 1
fi
EOF
    chmod +x .git/hooks/pre-commit
    print_status "Git hooks configured"
fi

# Print success message and next steps
print_step "Setup completed successfully! 🎉"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your environment variables"
echo "2. Configure Netlify CMS:"
echo "   - Set up Netlify Identity"
echo "   - Configure Git Gateway"
echo "   - Set up build hooks"
echo "3. Deploy to Netlify:"
echo "   - Connect your GitHub repository"
echo "   - Set build command: npm run build"
echo "   - Set publish directory: out"
echo ""
echo "Access URLs:"
echo "- Development: http://localhost:3000"
echo "- Admin Panel: http://localhost:3000/admin/"
echo "- Simple Admin: http://localhost:3000/admin-simple.html"
echo ""
echo "To start development server:"
echo "npm run dev"
echo ""
print_status "Setup script completed!"
