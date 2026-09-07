# Product Requirements Document (PRD)
# Bendot Open Trip & Travel — Sistem Manajemen Open Trip & Reservasi Wisata

> **Status Dokumen:** Approved / Siap Implementasi  
> **Versi:** 1.0  
> **Tanggal Rilis:** 6 September 2026  
> **Brand & Operator:** **Bendot Open Trip & Travel**  
> **Domain Operasional:** Operator Wisata Petualangan & Open Trip Nusantara (Spesialisasi Jawa Timur & Bali: Kawah Ijen, Bromo, Baluran, Pulau Menjangan, Osing Banyuwangi, dsb.)

---

## 1. Informasi Dokumen & Eksekutif

| Item | Deskripsi |
|---|---|
| **Nama Produk** | **Bendot Open Trip & Travel** (Platform Manajemen Operasional & Reservasi Mandiri) |
| **Tipe Sistem** | Web Application Terpadu: Portal Publik (Customer-Facing) + Dashboard Admin (Back-Office) |
| **Target Pengguna** | Traveler Wisata Nusantara, Admin Operasional, Staf Keuangan, Tour Guide & Field Leader |
| **Model Bisnis** | Open Trip (berbagi kuota perjalanan umum) & Private Tour kustom |

### Ringkasan Eksekutif
**Bendot Open Trip & Travel** adalah platform operasional terpadu yang dirancang khusus untuk mengelola seluruh rantai proses bisnis open trip wisata. Sistem ini mengintegrasikan pengalaman pemesanan tiket mandiri bagi calon peserta (*traveler*) dengan panel kontrol operasional (*back-office*) untuk manajemen kuota real-time, validasi transfer pembayaran manual, manifest resmi perizinan kawasan konservasi, penugasan pemandu (*guide scheduler*) bebas bentrok, serta check-in boarding di hari keberangkatan.

---

## 2. Latar Belakang & Masalah (Problem Statement)

Dalam operasional harian operator trip petualangan, metode konvensional (menggunakan WhatsApp chat terpisah, spreadsheet manual, dan pencatatan kasir fisik) menimbulkan sejumlah kendala kritikal:
1. **Risiko Double-Booking & Overcapacity:** Kuota kursi trip per tanggal tidak tersinkronisasi langsung saat calon peserta mendaftar serentak.
2. **Bottleneck Verifikasi Pembayaran:** Staf keuangan kesulitan memvalidasi mutasi rekening dengan ratusan tangkapan layar bukti transfer yang menumpuk di chat WhatsApp.
3. **Penerbitan Dokumen Manifest yang Rumit:** Kawasan konservasi (seperti BKSDA Kawah Ijen dan Baluran) mewajibkan manifest identitas lengkap (NIK, nama, kontak darurat). Membuat manifest secara manual memakan waktu berjam-jam menjelang malam keberangkatan.
4. **Bentrok Penjadwalan Tour Guide:** Tidak adanya sistem ketersediaan (*availability calendar*) menyebabkan seorang pemandu tidak sengaja ditugaskan pada dua ekspedisi yang bertabrakan waktu.
5. **Transparansi Peserta Rendah:** Calon peserta sering merasa cemas menanyakan status booking dan membutuhkan e-tiket resmi yang dapat disimpan di ponsel.

---

## 3. Tujuan Produk & Indikator Keberhasilan (OKRs)

### Tujuan Produk
- **Otomasi Alur Booking:** Calon traveler dapat memilih tanggal keberangkatan, mengisi identitas seluruh rombongan, melakukan transfer dengan nominal unik, mengunggah bukti bayar, dan melacak statusnya secara real-time.
- **Audit Finansial Cepat:** Modul Verifikasi Manual yang memungkinkan staf keuangan menyetujui atau menolak bukti transfer dalam 1 klik dengan audit trail nama verifikator.
- **Efisiensi Lapangan (Field Ops):** Menghasilkan dokumen manifest resmi format cetak/PDF dan memfasilitasi check-in kehadiran peserta di titik kumpul (*meeting point*) secara instan.
- **Manajemen Pemandu Cerdas:** Mengetahui status sertifikasi (BNSP/HPI) pemandu dan mencegah penugasan ganda pada jadwal yang bentrok.

### Indikator Keberhasilan (Success Metrics)
- **Zero Double Booking:** 0 insiden kelebihan kuota kursi berkat penguncian kuota otomatis.
- **Fast Payment Clearance:** Rata-rata verifikasi manual bukti bayar < 15 menit pada jam kerja.
- **Manifest Instan:** Generate manifest 100% otomatis dari database peserta.
- **Customer Self-Service:** Penurunan 70% pertanyaan status booking berulang di WhatsApp berkat fitur "Cek Status Booking" mandiri.

---

## 4. Arsitektur Informasi & Struktur Navigasi

Sistem terbagi menjadi dua antarmuka utama yang terhubung dalam satu aplikasi:

### 4.1 Situs Publik (Customer Portal)
1. **Navbar & Brand Header:** Logo Bendot Travel, Navigasi (Beranda, Paket Trip, Jadwal, Cek Booking, Buka Dashboard).
2. **Hero & Banner Promosi:** Slider paket unggulan, USP ("Pasti Berangkat", "Guide Berlisensi", "Asuransi Terjamin").
3. **Pencarian & Filter Cerdas:** Filter berdasarkan Kategori (Gunung, Bahari, Savana, Budaya) dan Destinasi.
4. **Katalog Trip:** Kartu trip visual memukau, harga transparan, durasi, dan indikator sisa kuota.
5. **Detail Trip & Itinerary Modal:** Rincian jadwal per jam, fasilitas Include/Exclude, titik kumpul, dan ketentuan.
6. **Alur Booking Interaktif (3 Langkah):**
   - *Langkah 1:* Pilih Tanggal & Form Data Rombongan (Nama, NIK, No. HP, Kontak Darurat).
   - *Langkah 2:* Rincian Biaya, Kode Unik, dan Instruksi Rekening Resmi (BCA, Mandiri, BRI, QRIS).
   - *Langkah 3:* Unggah Bukti Transfer & Konfirmasi Instan.
7. **Cek Status Booking & E-Tiket Publik:** Melacak status via kode booking (misal: `BND-2026-X7K`) dan cetak E-Tiket ber-QR Code resmi.

### 4.2 Dashboard Admin (Back-Office Operasional)
Sesuai struktur hierarki operasional standar:
```
IKHTISAR
└─ Dashboard (KPI Harian, Grafik Tren 6 Bulan, Keberangkatan Terdekat)

TRIPS
├─ Trip Catalog (Katalog Master Paket Trip)
├─ Categories (Kategori Wisata)
├─ Destinations (Destinasi Tujuan)
├─ Banner Beranda (Manajemen Banner Promosi)
└─ Departures / Schedule (Jadwal Keberangkatan & Penugasan Pemandu)

RESERVATIONS
├─ Bookings (Daftar Booking Masuk & Input Booking Offline)
├─ Participants (Database Seluruh Peserta & NIK)
├─ Manifest (Generator Lembar Manifest Resmi Print-Ready)
└─ Check-in (Pencatatan Kehadiran Peserta di Titik Kumpul)

PAYMENTS
├─ Invoices (Pratinjau & Cetak Invoice Booking)
├─ Transactions (Buku Besar Mutasi Pembayaran)
├─ Manual Verification (Antrian Validasi Bukti Transfer Peserta)
└─ Refunds (Pengelolaan Pengembalian Dana)

GUIDES
├─ Tour Guides (Database Profil Pemandu Wisata)
├─ Certifications (Monitoring Lisensi BNSP/HPI & Notifikasi Expired)
├─ Competencies (Matriks Keahlian & Medan)
└─ Availability (Kalender Ketersediaan & Deteksi Bentrok)
```

---

## 5. Rincian Spesifikasi Fungsional

### 5.1 Dashboard Analitik
- **KPI Real-Time:** Menampilkan *Booking Hari Ini*, *Estimasi Pendapatan Bulan Ini*, *Trip Aktif Terbuka*, dan *Pemandu Bertugas*.
- **Grafik Tren 6 Bulan:** Visualisasi jumlah peserta dan booking dari bulan ke bulan.
- **Daftar Keberangkatan Terdekat:** Widget menampilkan 5 trip terdekat lengkap dengan kode keberangkatan (contoh: `DPR-7D6`), pemandu bertugas, dan persentase keterisian kuota.
- **Akses Cepat Situs Publik:** Tombol sticky di header untuk preview tampilan pengunjung.

### 5.2 Manajemen Trip & Jadwal (Trips & Schedules)
- **Katalog Trip:** Dukungan nama trip, kode trip unik, kategori, durasi (hari/malam), kapasitas minimum & maksimum, titik kumpul, deskripsi lengkap, susunan itinerary bertahap, dan galeri foto.
- **Jadwal Keberangkatan (Departures):**
  - Mengaitkan paket trip dengan tanggal spesifik.
  - Kuota otomatis berkurang saat booking diverifikasi.
  - Status jadwal dinamis: `Open`, `Hampir Penuh` (sisa < 4 kursi), `Penuh`, `Selesai`, `Dibatalkan`.
  - Pengecekan bentrok jadwal pemandu: Sistem menolak jika pemandu yang dipilih telah ditugaskan pada trip lain di tanggal yang sama.

### 5.3 Reservasi & Peserta (Reservations)
- **Modul Booking:** Menampilkan filter status (`Pending`, `Menunggu Verifikasi`, `Terkonfirmasi`, `Dibatalkan`).
- **Input Booking Manual (Offline):** Admin dapat memasukkan pemesanan langsung dari tamu yang datang via telepon/walk-in ke kantor Bendot Travel.
- **Manifest Kawasan Wisata:** Format cetak standar BKSDA/Taman Nasional yang memuat: Nomor Keberangkatan, Nama Trip, Tanggal, Pemandu Utama, dan tabel peserta (Nama Lengkap, NIK/Paspor, Usia, Jenis Kelamin, No. HP, Kontak Darurat).
- **Check-In Boarding:** Antarmuka responsif bagi field coordinator di meeting point untuk mencentang status kehadiran penumpang (*Hadir* / *Belum Hadir*) dengan penghitung kehadiran otomatis.

### 5.4 Keuangan & Verifikasi Manual (Payments)
- **Antrian Verifikasi Manual:**
  - Menampilkan thumbnail bukti transfer yang diunggah peserta.
  - Modal inspeksi bukti bayar resolusi tinggi, nominal tertera, nama bank pengirim, dan nomor referensi.
  - Tombol aksi:
    - `Approve`: Otomatis mengubah status booking menjadi **Terkonfirmasi**, mengurangi sisa kuota trip, mencatat audit trail (nama verifikator dan waktu), dan mengaktifkan E-Tiket peserta.
    - `Reject`: Meminta perbaikan bukti bayar dengan catatan alasan (misal: "Nominal tidak sesuai", "Bukti buram").
- **Transaksi & Invoice:** Rekap riwayat seluruh pembayaran masuk dan tombol cetak invoice PDF/struk resmi berlogo Bendot Travel.

### 5.5 Pemandu Wisata & Sertifikasi (Tour Guides)
- **Database Pemandu:** Nama lengkap, nomor lisensi, nomor telepon/WhatsApp, rating peserta, dan keahlian medan (Pendakian Gunung, Snorkeling/Diving, Sejarah & Budaya).
- **Monitoring Sertifikasi:** Memantau masa berlaku sertifikasi (P3K / First Aid, Lisensi BNSP Pemandu Gunung, dsb.) dengan indikator warna status dan peringatan jika kedaluwarsa dalam 30 hari.
- **Kalender Ketersediaan:** Menampilkan riwayat penugasan trip dan mencegah konflik jadwal penugasan (*zero-conflict scheduling*).

---

## 6. Model Data Utama (Data Schema)

```
Trip {
  id: string
  code: string          // contoh: "BND-IJEN"
  title: string
  category: string      // "Gunung", "Bahari", "Budaya", "Safari"
  destination: string
  duration: string      // "2H1M", "12 Jam", dll.
  price: number
  quotaMin: number
  quotaMax: number
  meetingPoint: string
  image: string
  description: string
  itinerary: Array<{ time: string, activity: string }>
  includes: string[]
  excludes: string[]
  status: "Published" | "Draft"
}

Schedule {
  id: string
  tripId: string
  departureDate: string // YYYY-MM-DD
  returnDate: string
  quotaTotal: number
  quotaBooked: number
  guideId: string
  status: "Open" | "Almost Full" | "Full" | "Completed" | "Cancelled"
}

Booking {
  id: string
  bookingCode: string   // contoh: "BND-2026-X89K"
  scheduleId: string
  tripId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  totalParticipants: number
  participants: Array<{
    name: string
    nik: string
    gender: "L" | "P"
    phone: string
    emergencyContact: string
    checkedIn: boolean
  }>
  totalAmount: number
  uniqueCode: number
  finalAmount: number
  paymentMethod: "BCA" | "Mandiri" | "BRI" | "QRIS"
  paymentProofUrl?: string
  paymentStatus: "Pending" | "Menunggu Verifikasi" | "Terkonfirmasi" | "Ditolak"
  verifiedBy?: string
  verifiedAt?: string
  rejectionReason?: string
  createdAt: string
}

Guide {
  id: string
  name: string
  phone: string
  specialty: string
  rating: number
  completedTrips: number
  certifications: Array<{
    name: string
    issuer: string
    validUntil: string
    status: "Active" | "Expiring Soon" | "Expired"
  }>
}
```

---

## 7. Desain Antarmuka & Pedoman Estetika (UI/UX)

- **Tema Visual:** *Deep Rainforest & Obsidian Luxury*.
  - Warna Primer: Deep Emerald Forest (`#064e3b`), Ocean Cyan/Teal (`#0d9488`), Sunset Golden Accent (`#f59e0b`).
  - Latar Belakang Admin: Obsidian Slate (`#0f172a` dan `#1e293b`) dengan aksen kartu bersih dan kontras tinggi.
  - Tipografi: Modern geometric sans-serif (*Plus Jakarta Sans* / *Outfit*).
- **Interaksi & Mikro-animasi:** Transisi modal halus, badge status beranimasi lembut, kartu hover dengan efek elevasi 3D ringan, dan feedback toast interaktif pada setiap aksi.
- **Standar Responsif:** Mendukung tampilan layar laptop lebar, tablet horizontal/vertikal, hingga mobile viewport. Format cetak khusus menggunakan styling `@media print` untuk E-Tiket dan Manifest.

---

## 8. Jadwal Peluncuran & Verifikasi

- **Fase 1 (Selesai pada rilis ini):** Seluruh fungsionalitas Portal Publik, Pemesanan Mandiri, Unggah Bukti, Cek Status E-Tiket, Dashboard Admin, Verifikasi Pembayaran Manual, Generator Manifest, Check-In, dan Jadwal Pemandu beroperasi 100% aktif dengan data terintegrasi.

---
*Disahkan oleh Tim Pengembang & Manajemen Operasional Bendot Open Trip & Travel.*
