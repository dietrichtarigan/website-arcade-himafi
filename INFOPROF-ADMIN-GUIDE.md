# 📋 Panduan Admin Dashboard INFOPROF
## ARCADE HIMAFI ITB

---

## 🎯 **Tujuan**
Panduan ini membantu staf ARCADE HIMAFI menggunakan admin dashboard INFOPROF untuk mempublikasikan info magang, beasiswa, dan lowongan kerja secara efisien.

---

## 🚀 **Cara Akses Admin Dashboard**

### 1. **Login ke Admin Panel**
- URL: `https://arcade-himafi.netlify.app/admin`
- Login dengan GitHub atau Netlify Identity
- Hubungi admin utama untuk mendapatkan akses

### 2. **Navigasi ke INFOPROF**
- Klik menu "Info Karier (INFOPROF)" di sidebar
- Pilih "New Info Karier" untuk menambah info baru

---

## 🤖 **Metode 1: AI Otomatisasi (REKOMENDASI)**

### **Prompt AI untuk Ekstraksi Data**
Copy prompt berikut ke ChatGPT/GPT-4/Claude:

```
Kamu adalah AI Admin Assistant untuk website ARCADE HIMAFI. Tugasmu adalah memproses 2 input:

1. Poster (gambar)
2. Teks broadcast

dan mengubahnya menjadi format data JSON SIAP TAMPIL di website INFOPROF.

🎯 Output JSON harus sesuai struktur berikut:
{
  "judul": "Judul info",
  "kategori": "Magang | Beasiswa | Lowongan",
  "tanggal_post": "YYYY-MM-DD",
  "deskripsi": "Ringkasan singkat isi info (maksimal 2 kalimat, tidak copas full)",
  "link_utama": "https://...",
  "link_tambahan": ["https://..."],
  "kontak": {
    "email": "example@email.com",
    "wa": "08..."
  },
  "sumber": "Nama penyelenggara / lembaga resmi",
  "poster_filename": "nama-poster-yang-diupload.png"
}

⚙️ Aturan Output:
- Ambil judul utama dari broadcast/poster
- Kategori ditentukan dari konteks: "Magang", "Beasiswa", atau "Lowongan"
- Deskripsi wajib singkat (hanya intisari, bukan copas broadcast penuh)
- Jika lebih dari satu link → link_utama adalah yang paling umum, lainnya masuk link_tambahan
- Jika ada email/WA di broadcast, masukkan ke kontak
- Tulis poster_filename sesuai nama file gambar yang diupload
- Tanggal otomatis isi dengan hari ini (YYYY-MM-DD)

Sekarang berikan saya poster dan broadcast teks yang ingin diproses.
```

### **Langkah-langkah AI Otomatisasi:**

1. **Upload Poster**
   - Simpan poster dengan nama file yang jelas (contoh: `magang-brin-2025.png`)
   - Upload ke folder `/public/uploads/` via admin panel

2. **Paste Broadcast Teks**
   - Copy teks broadcast dari WhatsApp/Instagram
   - Paste ke prompt AI

3. **Dapatkan JSON**
   - AI akan menghasilkan JSON terstruktur
   - Copy JSON hasil ekstraksi

4. **Input ke Admin Dashboard**
   - Buka admin panel → Info Karier → New Info Karier
   - Isi form sesuai JSON yang dihasilkan AI

---

## 📝 **Metode 2: Input Manual**

### **Langkah-langkah Input Manual:**

1. **Buka Admin Dashboard**
   - Login ke `/admin`
   - Klik "Info Karier (INFOPROF)"
   - Klik "New Info Karier"

2. **Isi Form Fields:**

   **📋 Judul**
   - Masukkan judul utama info
   - Contoh: "Magang BRIN Batch 1 – 2025"

   **🏷️ Kategori**
   - Pilih: Magang / Beasiswa / Lowongan
   - Sesuaikan dengan jenis info

   **📅 Tanggal Post**
   - Isi tanggal publikasi (biasanya hari ini)
   - Format: YYYY-MM-DD

   **📄 Deskripsi**
   - Ringkasan singkat (1-2 kalimat)
   - Jangan copas broadcast penuh
   - Fokus pada intisari info

   **🔗 Link Utama**
   - URL utama untuk pendaftaran/info
   - Contoh: https://elsa.brin.go.id

   **🔗 Link Tambahan**
   - Link pendukung (opsional)
   - Bisa multiple links

   **📧 Email Kontak**
   - Email untuk pertanyaan
   - Opsional

   **📱 WhatsApp Kontak**
   - Nomor WA untuk kontak
   - Opsional

   **🏢 Sumber**
   - Nama lembaga/penyelenggara
   - Contoh: "BRIN - Direktorat Manajemen Talenta"

   **🖼️ Poster**
   - Upload gambar poster
   - Format: JPG, PNG
   - Maksimal: 10MB

   **📁 Arsipkan?**
   - Centang jika info sudah tidak aktif
   - Info arsip tidak tampil di halaman utama

3. **Publish**
   - Klik "Publish" untuk publikasi
   - Info langsung tampil di website

---

## 📊 **Contoh Input Lengkap**

### **Input dari Broadcast:**
```
🔬 MAGANG BRIN Batch 1 – 2025 Telah Dibuka!
Buat kamu yang tertarik terjun langsung di dunia riset dan inovasi, ini kesempatan emas!
Bergabunglah dalam program Magang BRIN dan rasakan pengalaman belajar langsung bersama para peneliti dan inovator terbaik Indonesia! 🇮🇩✨

📌 Info lengkap dan pendaftaran:
🔗 https://elsa.brin.go.id
https://elsa.brin.go.id/subkategori/index/MBKM/26
📧 Email: mbkm@brin.go.id

Yuk, jadilah bagian dari masa depan riset Indonesia!
```

### **Output AI (JSON):**
```json
{
  "judul": "Magang BRIN Batch 1 – 2025",
  "kategori": "Magang",
  "tanggal_post": "2024-07-03",
  "deskripsi": "Program magang nasional dari BRIN untuk mahasiswa yang tertarik menekuni dunia riset dan inovasi langsung bersama peneliti.",
  "link_utama": "https://elsa.brin.go.id",
  "link_tambahan": [
    "https://elsa.brin.go.id/subkategori/index/MBKM/26"
  ],
  "kontak": {
    "email": "mbkm@brin.go.id"
  },
  "sumber": "BRIN - Direktorat Manajemen Talenta",
  "poster_filename": "magang-brin-2025.png"
}
```

### **Hasil di Website:**
- ✅ Judul: "Magang BRIN Batch 1 – 2025"
- ✅ Kategori: Magang (badge hijau)
- ✅ Deskripsi: Ringkasan singkat
- ✅ Link Utama: elsa.brin.go.id
- ✅ Info Tambahan: Link pendaftaran
- ✅ Kontak: mbkm@brin.go.id
- ✅ Sumber: BRIN - Direktorat Manajemen Talenta
- ✅ Poster: Tampil di card

---

## 🔧 **Fitur Admin Dashboard**

### **📋 Kelola Info**
- **View**: Lihat semua info yang sudah dipublish
- **Edit**: Ubah info yang sudah ada
- **Delete**: Hapus info yang tidak relevan
- **Archive**: Arsipkan info lama

### **🔍 Filter & Search**
- Filter berdasarkan kategori
- Filter berdasarkan status (Aktif/Arsip)
- Search berdasarkan judul

### **📊 Statistik**
- Total info yang dipublish
- Info per kategori
- Info yang diarsip

---

## ⚠️ **Tips & Best Practices**

### **✅ Yang Harus Dilakukan:**
- Gunakan AI otomatisasi untuk efisiensi
- Upload poster dengan nama file yang jelas
- Isi deskripsi singkat dan informatif
- Selalu isi sumber informasi
- Arsipkan info yang sudah tidak aktif

### **❌ Yang Tidak Boleh:**
- Copas broadcast penuh ke deskripsi
- Lupa upload poster
- Tidak mengisi sumber
- Membiarkan info lama tidak diarsip

### **🎯 Kategori yang Tersedia:**
- **Magang**: Program magang, internship, PKL
- **Beasiswa**: Beasiswa S1, S2, S3, dalam/luar negeri
- **Lowongan**: Lowongan kerja, recruitment, career fair

---

## 🆘 **Troubleshooting**

### **Masalah Umum:**

**Q: AI tidak menghasilkan JSON yang benar**
A: Pastikan broadcast teks lengkap dan jelas. Coba ulang dengan prompt yang lebih spesifik.

**Q: Poster tidak tampil di website**
A: Pastikan file diupload ke folder `/public/uploads/` dan nama file sesuai dengan yang diisi di form.

**Q: Info tidak muncul di halaman utama**
A: Cek apakah info sudah dipublish dan tidak diarsip. Pastikan tanggal post sudah benar.

**Q: Link tidak berfungsi**
A: Pastikan URL lengkap dengan `https://` dan sudah ditest sebelum dipublish.

---

## 📞 **Kontak Support**

Jika mengalami masalah teknis:
- **Email**: arcade@himafi.itb.ac.id
- **WhatsApp**: [Nomor admin]
- **Instagram**: @careerhimafi

---

## 🎉 **Selamat Menggunakan!**

Dengan panduan ini, staf ARCADE HIMAFI dapat mempublikasikan info karier dengan cepat dan efisien menggunakan AI otomatisasi atau input manual.

**Website INFOPROF siap membantu mahasiswa Fisika ITB menemukan peluang karier terbaik!** 🚀 