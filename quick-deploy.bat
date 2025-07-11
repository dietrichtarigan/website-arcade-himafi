@echo off
:: 🚀 ARCADE HIMAFI ITB - Quick Deploy
:: Double-click untuk auto commit dan push semua perubahan

title ARCADE Quick Deploy

:: Pindah ke direktori project
cd /d "%~dp0"

echo.
echo ================================================
echo    🚀 ARCADE HIMAFI ITB - Quick Deploy
echo ================================================
echo.

:: Cek apakah ada perubahan
git status --porcelain > temp.txt
for /f %%i in ("temp.txt") do set size=%%~zi
del temp.txt

if %size% equ 0 (
    echo ✅ Tidak ada perubahan untuk di-commit
    echo Repository sudah up to date
    timeout /t 3
    exit
)

:: Tampilkan perubahan
echo 📋 Perubahan yang akan di-commit:
git status --short
echo.

:: Buat timestamp untuk commit message
for /f "tokens=1-3 delims=/ " %%a in ('date /t') do set tgl=%%c-%%a-%%b
for /f "tokens=1-2 delims=: " %%a in ('time /t') do set waktu=%%a:%%b
set timestamp=%tgl% %waktu%

:: Commit dan push
echo 🔄 Menambahkan semua file...
git add .

echo 🔄 Commit perubahan...
git commit -m "Auto deploy: Update website - %timestamp%"

echo 🔄 Push ke GitHub...
git push

if %errorlevel% equ 0 (
    echo.
    echo ================================================
    echo            🎉 DEPLOY BERHASIL! 🎉
    echo ================================================
    echo.
    echo ✅ Semua perubahan berhasil di-push ke GitHub
    echo ✅ Netlify akan otomatis deploy website Anda
    echo ✅ Tunggu 2-3 menit untuk build selesai
    echo.
    echo 🌐 Website: https://your-site-name.netlify.app
    echo 📊 Status Deploy: https://app.netlify.com/
    echo.
) else (
    echo.
    echo ❌ ERROR: Gagal push ke repository
    echo Periksa koneksi internet dan akses repository
    echo.
)

echo Tekan tombol apa saja untuk menutup...
pause >nul
