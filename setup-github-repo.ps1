# 🔧 Setup GitHub Repository Baru untuk Website ARCADE
# Script ini membantu membuat dan setup repository GitHub baru

Write-Host "=== Setup GitHub Repository Baru ===" -ForegroundColor Cyan
Write-Host ""

# Fungsi helper
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

# Step 1: Persiapan
Write-Host "🔧 Step 1: Persiapan Git Repository" -ForegroundColor Cyan

# Cek apakah git sudah terinstall
try {
    $gitVersion = git --version
    Show-Progress "Git terdeteksi: $gitVersion"
}
catch {
    Show-Error "Git tidak terinstall. Silakan install Git terlebih dahulu."
    exit 1
}

# Cek apakah GitHub CLI terinstall (opsional)
try {
    $ghVersion = gh --version 2>$null
    if ($ghVersion) {
        Show-Progress "GitHub CLI terdeteksi"
        $useGHCLI = $true
    }
}
catch {
    Show-Warning "GitHub CLI tidak terinstall. Akan menggunakan metode manual."
    $useGHCLI = $false
}

# Step 2: Konfigurasi Repository
Write-Host ""
Write-Host "🔧 Step 2: Konfigurasi Repository" -ForegroundColor Cyan

$repoName = Read-Host "Nama repository (default: website-arcade-himafi)"
if (-not $repoName) {
    $repoName = "website-arcade-himafi"
}

$repoDescription = Read-Host "Deskripsi repository (default: Website ARCADE HIMAFI ITB - Pengembangan Karier & Alumni)"
if (-not $repoDescription) {
    $repoDescription = "Website ARCADE HIMAFI ITB - Pengembangan Karier & Alumni"
}

$repoVisibility = Read-Host "Visibility repository (public/private, default: public)"
if (-not $repoVisibility) {
    $repoVisibility = "public"
}

# Step 3: Setup Git Local
Write-Host ""
Write-Host "🔧 Step 3: Setup Git Local" -ForegroundColor Cyan

# Initialize git jika belum
if (-not (Test-Path ".git")) {
    Write-Host "Initializing Git repository..."
    git init
    Show-Progress "Git repository initialized"
}

# Setup git config jika belum
$gitUser = git config user.name
$gitEmail = git config user.email

if (-not $gitUser) {
    $userName = Read-Host "Masukkan nama Git user"
    git config user.name $userName
    Show-Progress "Git user name set: $userName"
}

if (-not $gitEmail) {
    $userEmail = Read-Host "Masukkan email Git user"
    git config user.email $userEmail
    Show-Progress "Git user email set: $userEmail"
}

# Add dan commit files
Write-Host "Adding and committing files..."
git add .

# Cek apakah ada changes
$status = git status --porcelain
if ($status) {
    git commit -m "Initial commit: Website ARCADE HIMAFI ITB

Features:
- Next.js 15 with TypeScript
- TailwindCSS untuk styling
- Netlify CMS untuk content management
- Supabase untuk database
- Responsive design
- Admin dashboard
- Alumni database (ALIVE)
- Info Karier (InfoProf)
- Events management
- Forms integration

Ready for deployment to Netlify."
    Show-Progress "Files committed"
} else {
    Show-Progress "No changes to commit"
}

# Step 4: Buat Repository GitHub
Write-Host ""
Write-Host "🔧 Step 4: Membuat Repository GitHub" -ForegroundColor Cyan

if ($useGHCLI) {
    # Menggunakan GitHub CLI
    Write-Host "Membuat repository menggunakan GitHub CLI..."
    
    try {
        $ghCommand = "gh repo create $repoName --$repoVisibility --description `"$repoDescription`" --source=. --remote=origin --push"
        Invoke-Expression $ghCommand
        Show-Progress "Repository berhasil dibuat dan di-push menggunakan GitHub CLI"
        $repoCreated = $true
    }
    catch {
        Show-Error "Gagal membuat repository dengan GitHub CLI. Akan menggunakan metode manual."
        $repoCreated = $false
    }
} else {
    $repoCreated = $false
}

if (-not $repoCreated) {
    # Metode manual
    Write-Host ""
    Write-Host "📋 Langkah Manual untuk Membuat Repository:" -ForegroundColor Yellow
    Write-Host "1. Buka https://github.com/new"
    Write-Host "2. Repository name: $repoName"
    Write-Host "3. Description: $repoDescription"
    Write-Host "4. Visibility: $repoVisibility"
    Write-Host "5. JANGAN centang 'Initialize with README'"
    Write-Host "6. Klik 'Create repository'"
    Write-Host ""
    
    $repoUrl = Read-Host "Setelah dibuat, masukkan URL repository (contoh: https://github.com/username/$repoName.git)"
    
    if ($repoUrl) {
        try {
            # Remove existing origin jika ada
            git remote remove origin 2>$null
            
            # Add new origin
            git remote add origin $repoUrl
            Show-Progress "Remote origin added: $repoUrl"
            
            # Push ke repository
            Write-Host "Pushing to GitHub..."
            git push -u origin main
            Show-Progress "Code berhasil di-push ke GitHub"
        }
        catch {
            Show-Error "Gagal push ke repository. Cek URL dan coba lagi."
        }
    }
}

# Step 5: Setup Repository Settings
Write-Host ""
Write-Host "🔧 Step 5: Repository Settings" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Setup Repository (lakukan di GitHub.com):" -ForegroundColor Yellow
Write-Host "1. Buka repository di GitHub"
Write-Host "2. Settings → Pages → Deploy from branch (main, /docs atau /root)"
Write-Host "3. Settings → Security → Secrets → Add repository secrets untuk CI/CD"
Write-Host "4. About → Add description dan website URL"
Write-Host "5. Add topics: nextjs, typescript, netlify, cms, himafi"
Write-Host ""

# Step 6: Buat file GitHub workflows (CI/CD)
Write-Host "🔧 Step 6: Setup GitHub Actions" -ForegroundColor Cyan

$setupWorkflows = Read-Host "Setup GitHub Actions untuk CI/CD? (y/n)"
if ($setupWorkflows -eq "y" -or $setupWorkflows -eq "Y") {
    
    # Buat direktori .github/workflows
    if (-not (Test-Path ".github/workflows")) {
        New-Item -ItemType Directory -Path ".github/workflows" -Force
        Show-Progress "GitHub workflows directory created"
    }
    
    # Buat workflow file untuk deploy
    $workflowContent = @"
name: Deploy to Netlify

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build project
      run: npm run build
      env:
        NEXT_PUBLIC_SUPABASE_URL: `${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
        NEXT_PUBLIC_SUPABASE_ANON_KEY: `${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
        
    - name: Deploy to Netlify
      uses: nwtgck/actions-netlify@v2.0
      with:
        publish-dir: './out'
        production-branch: main
        github-token: `${{ secrets.GITHUB_TOKEN }}
        deploy-message: "Deploy from GitHub Actions"
      env:
        NETLIFY_AUTH_TOKEN: `${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: `${{ secrets.NETLIFY_SITE_ID }}
"@
    
    Set-Content -Path ".github/workflows/deploy.yml" -Value $workflowContent
    Show-Progress "GitHub Actions workflow created"
}

# Step 7: Final Instructions
Write-Host ""
Write-Host "🎉 Repository Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Setup Netlify deployment dari repository GitHub"
Write-Host "2. Configure environment variables di Netlify"
Write-Host "3. Setup Supabase database"
Write-Host "4. Enable Netlify Identity & Git Gateway"
Write-Host "5. Test website dan admin CMS"
Write-Host ""

Write-Host "📖 Baca PANDUAN-DEPLOY-NETLIFY.md untuk langkah detail" -ForegroundColor Blue
Write-Host ""

# Commit workflow jika dibuat
if ($setupWorkflows -eq "y" -or $setupWorkflows -eq "Y") {
    git add .github/workflows/deploy.yml
    git commit -m "Add GitHub Actions workflow for Netlify deployment"
    git push
    Show-Progress "GitHub Actions workflow committed and pushed"
}

Write-Host "✨ Repository siap untuk deployment!" -ForegroundColor Green
