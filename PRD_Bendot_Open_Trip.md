# Product Requirements Document (PRD)
# Bendot Open Trip & Travel — Sistem Manajemen Open Trip & Reservasi Wisata

> **Catatan:** Dokumen PRD ini mendefinisikan sistem operasional **Bendot Open Trip & Travel** yang menggabungkan situs publik pemesanan mandiri oleh traveler dan dashboard back-office komprehensif bagi tim operasional, pemandu, dan manajemen keuangan.

---

## 1. Informasi Dokumen

| Item | Detail |
|---|---|
| Nama Produk | **Bendot Open Trip & Travel** — Sistem Manajemen Open Trip & Reservasi Wisata |
| Jenis Dokumen | Product Requirements Document (PRD) |
| Versi | 1.0 (Final Approved) |
| Tanggal Dibuat | 6 September 2026 |
| Status | Siap Produksi & Terimplementasi |
| Domain Bisnis | Operator Wisata Open Trip & Petualangan Nusantara (Kawah Ijen, Baluran, Bromo, Menjangan, Osing Kemiren, Kalibendo) |

---

## 2. Ringkasan Eksekutif

**Bendot Open Trip & Travel** adalah platform manajemen operasional untuk bisnis **Open Trip** — model perjalanan wisata dimana satu keberangkatan dibuka untuk umum dan peserta bisa mendaftar secara individu maupun grup kecil. Sistem terdiri dari dua sisi terintegrasi:

1. **Dashboard Admin (Back-office)** — untuk tim internal Bendot Travel mengelola katalog trip, jadwal keberangkatan, reservasi, pembayaran, verifikasi manual bukti bayar, cetak manifest, check-in penumpang, dan penugasan pemandu wisata.
2. **Situs Publik (Customer-facing)** — untuk calon peserta mencari katalog trip, memilih jadwal tanggal, mendaftar mandiri, transfer dengan kode unik, mengunggah bukti pembayaran, serta mengecek status booking & mencetak E-Tiket ber-QR Code.

Tujuan utama produk adalah mengeliminasi proses manual (WhatsApp, spreadsheet terpencar, kwitansi kertas) dengan sistem terpusat yang mencegah double-booking, mempercepat validasi transfer pembayaran, dan mempermudah perizinan kawasan konservasi.

---

## 3. Struktur Menu & Modul Terpasang

```
IKHTISAR
└─ Dashboard (KPI Real-Time, Grafik Tren 6 Bulan, 5 Keberangkatan Terdekat)

TRIPS
├─ Trip Catalog (Katalog Master Paket Trip)
├─ Categories (Kategori Wisata: Gunung, Bahari, Budaya, Safari)
├─ Destinations (Destinasi Tujuan Unggulan)
├─ Banner Beranda (Pengelolaan Banner Promo)
└─ Departures / Schedule (Jadwal Keberangkatan, Kuota Real-time, Penugasan Guide)

RESERVATIONS
├─ Bookings (Daftar Booking Masuk & Input Booking Manual Offline)
├─ Participants (Database Seluruh Peserta, NIK, dan Kontak Darurat)
├─ Manifest (Generator Lembar Manifest Resmi BKSDA/Taman Nasional Print-Ready)
└─ Check-in (Pencatatan Kehadiran Peserta di Meeting Point)

PAYMENTS
├─ Invoices (Pratinjau & Cetak Invoice Pembayaran)
├─ Transactions (Buku Besar Mutasi Finansial)
├─ Manual Verification (Antrian Validasi Bukti Transfer Peserta dengan Foto & Action)
└─ Refunds (Pengelolaan Pengembalian Dana)

GUIDES
├─ Tour Guides (Database Profil Pemandu Wisata)
├─ Certifications (Monitoring Lisensi BNSP/HPI & Notifikasi Expired < 30 Hari)
├─ Competencies (Matriks Keahlian & Medan Wisata)
└─ Availability (Kalender Ketersediaan & Deteksi Bentrok Jadwal)
```

---
*Dokumen ini merupakan panduan spesifikasi resmi untuk implementasi sistem Bendot Open Trip & Travel.*
