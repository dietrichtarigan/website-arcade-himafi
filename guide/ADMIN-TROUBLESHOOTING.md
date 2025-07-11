# 🚨 Troubleshooting Admin Panel ARCADE HIMAFI

## 🔍 **Masalah Umum & Solusi**

### **1. Admin Panel Tidak Bisa Diakses**
**Gejala:** Halaman `/admin` tidak muncul atau error

**Penyebab & Solusi:**
- ✅ **Lokal Development:** Admin panel TIDAK bisa digunakan di `localhost`. Hanya berfungsi di Netlify.
- ✅ **Deploy Required:** Wajib deploy ke Netlify terlebih dahulu
- ✅ **Build Success:** Pastikan `npm run build` berhasil tanpa error

### **2. Login Admin Gagal**
**Gejala:** Tidak bisa login ke admin panel

**Penyebab & Solusi:**
- ❌ **Netlify Identity belum di-enable**
  - Buka Netlify Dashboard → Site Settings → Identity
  - Klik "Enable Identity"
  
- ❌ **User belum di-invite**
  - Buka Identity → Users
  - Invite admin dengan email
  
- ❌ **Git Gateway belum aktif**
  - Buka Identity → Services
  - Enable "Git Gateway"

### **3. Tidak Bisa Edit Konten**
**Gejala:** Bisa login tapi tidak bisa save/edit konten

**Penyebab & Solusi:**
- ❌ **Git Gateway tidak ter-authorize**
  - Enable Git Gateway di Netlify Identity
  - Authorize dengan GitHub account yang sama
  
- ❌ **Permissions GitHub tidak cukup**
  - Pastikan user punya write access ke repository
  - Check repository settings → Collaborators

### **4. File Upload Gagal**
**Gejala:** Tidak bisa upload gambar/file

**Penyebab & Solusi:**
- ❌ **Media folder tidak ter-configure**
  - Check `config.yml`: `media_folder: "public/uploads"`
  - Check folder `public/uploads/` ada
  
- ❌ **File size terlalu besar**
  - Netlify limit: 100MB per file
  - Compress file sebelum upload

### **5. Environment Variables**
**Gejala:** Supabase connection error

**Solusi:**
```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

---

## 🛠️ **Langkah Deploy & Setup Admin Panel**

### **Step 1: Push ke GitHub**
```bash
git add .
git commit -m "Setup admin panel"
git push origin main
```

### **Step 2: Deploy ke Netlify**
1. Buka [netlify.com](https://netlify.com)
2. "New site from Git" → Pilih repository
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `out`
4. Deploy site

### **Step 3: Enable Netlify Identity**
1. Netlify Dashboard → Site Settings → Identity
2. "Enable Identity"
3. Registration: "Invite only"

### **Step 4: Enable Git Gateway**
1. Identity → Services → Git Gateway
2. Authorize dengan GitHub

### **Step 5: Invite Admin Users**
1. Identity → Users → "Invite User"
2. Masukkan email admin
3. User akan dapat invitation email

### **Step 6: Test Admin Panel**
1. Buka `https://your-site.netlify.app/admin`
2. Login dengan akun yang di-invite
3. Test create/edit konten

---

## 🚀 **Checklist Admin Panel Ready**

- [ ] Website berhasil di-deploy ke Netlify
- [ ] Netlify Identity enabled
- [ ] Git Gateway enabled & authorized
- [ ] Admin user sudah di-invite
- [ ] Environment variables sudah diset
- [ ] `/admin` bisa diakses dan login berhasil
- [ ] Bisa create/edit konten
- [ ] File upload berfungsi

---

## 📞 **Support**

Jika masih bermasalah, hubungi:
- Developer: [email/contact]
- Atau buat issue di GitHub repository

**Ingat:** Admin panel hanya berfungsi di production (Netlify), bukan di localhost!
