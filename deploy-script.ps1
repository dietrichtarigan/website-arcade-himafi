# 🚀 Script Deploy Otomatis Website ARCADE
# Jalankan script ini untuk deploy ke Netlify dan setup repo baru

Write-Host "=== ARCADE HIMAFI ITB - Deploy Script ===" -ForegroundColor Cyan
Write-Host ""

# Fungsi untuk menampilkan progress
function Show-Progress {
    param($Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Show-Warning {
    param($Message)
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
}

function Show-Error {
    param($Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

# Step 1: Persiapan Repository
Write-Host "🔧 Step 1: Persiapan Repository" -ForegroundColor Cyan
Write-Host ""

# Cek apakah git sudah diinit
if (-not (Test-Path ".git")) {
    Write-Host "Initializing Git repository..."
    git init
    Show-Progress "Git repository initialized"
} else {
    Show-Progress "Git repository already exists"
}

# Cek status git
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "Adding and committing changes..."
    git add .
    $commitMessage = Read-Host "Enter commit message (default: 'Deploy update')"
    if (-not $commitMessage) {
        $commitMessage = "Deploy update"
    }
    git commit -m $commitMessage
    Show-Progress "Changes committed"
} else {
    Show-Progress "No changes to commit"
}

# Step 2: Setup Repository Baru (Opsional)
Write-Host ""
Write-Host "🔧 Step 2: Setup Repository Baru" -ForegroundColor Cyan
$createNewRepo = Read-Host "Apakah Anda ingin setup repository GitHub baru? (y/n)"

if ($createNewRepo -eq "y" -or $createNewRepo -eq "Y") {
    $repoUrl = Read-Host "Masukkan URL repository GitHub baru (contoh: https://github.com/username/website-arcade-himafi.git)"
    
    if ($repoUrl) {
        try {
            # Remove existing origin if exists
            git remote remove origin 2>$null
            
            # Add new origin
            git remote add origin $repoUrl
            
            # Push to new repository
            Write-Host "Pushing to new repository..."
            git push -u origin main
            Show-Progress "Code pushed to new repository"
        }
        catch {
            Show-Error "Failed to setup new repository. Please check the URL and try manually."
        }
    }
}

# Step 3: Build Project
Write-Host ""
Write-Host "🔧 Step 3: Building Project" -ForegroundColor Cyan

try {
    Write-Host "Installing dependencies..."
    npm install
    Show-Progress "Dependencies installed"
    
    Write-Host "Building project..."
    npm run build
    Show-Progress "Project built successfully"
}
catch {
    Show-Error "Build failed. Please check the errors above."
    exit 1
}

# Step 4: Environment Setup
Write-Host ""
Write-Host "🔧 Step 4: Environment Configuration" -ForegroundColor Cyan

# Cek apakah file .env.local ada
if (-not (Test-Path ".env.local")) {
    Write-Host "Creating .env.local file..."
    Copy-Item "env.example" ".env.local"
    Show-Warning "Please edit .env.local with your actual environment variables"
    
    # Buka file untuk editing
    $openEnv = Read-Host "Buka .env.local untuk editing? (y/n)"
    if ($openEnv -eq "y" -or $openEnv -eq "Y") {
        notepad .env.local
    }
} else {
    Show-Progress ".env.local already exists"
}

# Step 5: Netlify Deployment Info
Write-Host ""
Write-Host "🚀 Step 5: Netlify Deployment" -ForegroundColor Cyan
Write-Host ""
Write-Host "Untuk deploy ke Netlify:" -ForegroundColor Yellow
Write-Host "1. Buka https://netlify.com dan login"
Write-Host "2. Klik 'New site from Git'"
Write-Host "3. Pilih repository GitHub Anda"
Write-Host "4. Set build command: npm run build"
Write-Host "5. Set publish directory: out"
Write-Host "6. Deploy!"
Write-Host ""

# Environment Variables yang dibutuhkan
Write-Host "Environment Variables untuk Netlify:" -ForegroundColor Yellow
Write-Host "NEXT_PUBLIC_SUPABASE_URL=your_supabase_url"
Write-Host "NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key"
Write-Host "NEXT_PUBLIC_NETLIFY_IDENTITY_URL=https://your-site.netlify.app"
Write-Host "NODE_ENV=production"
Write-Host "NODE_VERSION=18"
Write-Host ""

# Step 6: CMS Setup Info
Write-Host "🔧 Step 6: CMS Setup" -ForegroundColor Cyan
Write-Host ""
Write-Host "Setelah deploy, setup CMS:" -ForegroundColor Yellow
Write-Host "1. Enable Netlify Identity di dashboard"
Write-Host "2. Enable Git Gateway"
Write-Host "3. Invite admin users"
Write-Host "4. Test CMS di /admin"
Write-Host ""

# Final Steps
Write-Host "📋 Final Checklist:" -ForegroundColor Cyan
Write-Host "[ ] Repository GitHub dibuat/updated"
Write-Host "[ ] Project berhasil di-build"
Write-Host "[ ] Deploy ke Netlify"
Write-Host "[ ] Set environment variables"
Write-Host "[ ] Enable Netlify Identity & Git Gateway"
Write-Host "[ ] Setup Supabase database"
Write-Host "[ ] Test website dan admin CMS"
Write-Host ""

Show-Progress "Deploy script completed!"
Write-Host ""
Write-Host "📖 Baca PANDUAN-DEPLOY-NETLIFY.md untuk detail lengkap" -ForegroundColor Blue

# Opsional: Buka panduan
$openGuide = Read-Host "Buka panduan lengkap? (y/n)"
if ($openGuide -eq "y" -or $openGuide -eq "Y") {
    notepad "PANDUAN-DEPLOY-NETLIFY.md"
}

Write-Host ""
Write-Host "🎉 Happy deploying! Website ARCADE HIMAFI ITB siap diluncurkan!" -ForegroundColor Green
