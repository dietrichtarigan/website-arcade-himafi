# 🚀 Auto Deploy Scripts untuk Website ARCADE HIMAFI ITB

Folder ini berisi 3 file `.bat` untuk mempermudah deployment website ke GitHub dan Netlify dengan sekali klik.

## 📁 File yang Tersedia

### 1. `quick-deploy.bat` ⚡
**Paling Sederhana - Untuk penggunaan sehari-hari**
- Double-click untuk langsung commit dan push semua perubahan
- Otomatis generate commit message dengan timestamp
- Cocok untuk update konten rutin

**Cara Pakai:**
- Double-click file `quick-deploy.bat`
- Script akan otomatis mendeteksi perubahan
- Commit dengan pesan otomatis
- Push ke GitHub
- Netlify akan otomatis deploy

### 2. `auto-deploy.bat` 🎯
**Dengan Konfirmasi - Lebih aman**
- Menampilkan perubahan yang akan di-commit
- Meminta konfirmasi commit message
- Bisa custom commit message atau pakai default
- Menampilkan status detail

**Cara Pakai:**
- Double-click file `auto-deploy.bat`
- Lihat preview perubahan
- Masukkan commit message (atau Enter untuk default)
- Script akan commit dan push

### 3. `smart-deploy.bat` 🧠
**Full Featured - Menu lengkap**
- Menu interaktif dengan berbagai pilihan
- Quick deploy, custom commit, check status
- Pull latest changes
- Buka Netlify dashboard
- Buka GitHub repository

**Cara Pakai:**
- Double-click file `smart-deploy.bat`
- Pilih opsi dari menu (1-7)
- Ikuti instruksi di layar

## 🔧 Setup Awal (Sekali Saja)

### 1. Pastikan Git Sudah Terinstall
```bash
git --version
```

### 2. Setup Repository GitHub
```bash
# Jika belum ada remote
git remote add origin https://github.com/USERNAME/website-arcade-himafi.git

# Test koneksi
git push -u origin main
```

### 3. Test File Batch
- Double-click `quick-deploy.bat` untuk test
- Pastikan tidak ada error
- Cek di GitHub apakah commit masuk

## 📋 Workflow Harian

### Untuk Update Konten Biasa:
1. Edit file website (content, components, dll)
2. Double-click `quick-deploy.bat`
3. Tunggu sampai selesai
4. Cek Netlify untuk status build

### Untuk Update Penting:
1. Edit file website
2. Double-click `auto-deploy.bat`
3. Tulis commit message yang jelas
4. Confirm dan tunggu selesai

### Untuk Management Lengkap:
1. Double-click `smart-deploy.bat`
2. Pilih opsi sesuai kebutuhan
3. Ikuti menu interaktif

## ⚠️ Tips dan Troubleshooting

### Jika Error "Git not found":
- Install Git dari [git-scm.com](https://git-scm.com/)
- Restart computer setelah install
- Test dengan `git --version` di Command Prompt

### Jika Error "Permission denied":
- Pastikan SSH key sudah setup
- Atau gunakan HTTPS dengan username/password
- Cek GitHub token jika perlu

### Jika Error "No changes detected":
- Memang tidak ada perubahan file
- Atau file sudah ter-commit sebelumnya
- Cek dengan `git status` manual

### Jika Build Netlify Gagal:
- Cek build logs di Netlify dashboard
- Pastikan environment variables sudah set
- Test build lokal dengan `npm run build`

## 🎯 Best Practices

### Commit Messages yang Baik:
- **Update**: Update konten InfoProf
- **Fix**: Perbaiki error di form contact
- **Feature**: Tambah halaman alumni baru
- **Style**: Update design responsive
- **Config**: Update environment variables

### Kapan Pakai Script Mana:
- **Harian**: `quick-deploy.bat`
- **Mingguan**: `auto-deploy.bat` 
- **Development**: `smart-deploy.bat`

### File yang Perlu Dicommit:
- ✅ Content markdown files
- ✅ Component updates
- ✅ Style changes
- ✅ Configuration updates
- ❌ `node_modules/`
- ❌ `.env.local`
- ❌ `.next/`

## 🌐 Link Penting

- **Website**: https://your-site-name.netlify.app
- **GitHub**: https://github.com/USERNAME/website-arcade-himafi
- **Netlify**: https://app.netlify.com/sites/your-site-name
- **Documentation**: Lihat `PANDUAN-DEPLOY-NETLIFY.md`

## 📞 Support

Jika ada masalah:
1. Cek error message di command prompt
2. Lihat troubleshooting di atas
3. Test manual dengan command git
4. Baca dokumentasi lengkap di `PANDUAN-DEPLOY-NETLIFY.md`

---

**Happy Deploying! 🚀**
*Tim ARCADE HIMAFI ITB*
