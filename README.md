# 🏔️ Bendot Open Trip & Travel Platform

[![React](https://img.shields.io/badge/React-18.3-blue.svg?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF.svg?style=flat-square&logo=vite)](https://vitejs.dev/)
[![PRD](https://img.shields.io/badge/PRD-Documented-emerald.svg?style=flat-square)](./PRD.md)

**Bendot Open Trip & Travel** adalah platform operasional wisata dan reservasi mandiri terintegrasi untuk bisnis *Open Trip* petualangan Nusantara (spesialisasi Jawa Timur & Bali: Kawah Ijen Blue Fire, Baluran Africa van Java, Bromo Sunrise, Snorkeling Pulau Menjangan, Budaya Osing Kemiren, dan Trekking Kalibendo).

Platform ini menggabungkan **Situs Publik (Customer-Facing)** untuk pemesanan tiket mandiri dengan **Dashboard Admin (Back-Office)** lengkap 18 modul operasional sesuai spesifikasi [Product Requirements Document (PRD.md)](./PRD.md).

---

## ✨ Fitur Utama

### 1. 🌐 Portal Publik (Customer-Facing Website)
- **Hero Slider & Promosi**: Banner interaktif dengan jaminan *100% Pasti Berangkat*, *Guide Berlisensi BNSP/HPI*, dan *Asuransi Tercover*.
- **Pencarian & Filter Cerdas**: Filter paket berdasarkan destinasi, kategori tema wisata (Gunung, Bahari, Safari, Budaya, Trekking), dan kata kunci.
- **Katalog Trip Interaktif**: Detail harga per pax, durasi, fasilitas include/exclude, rincian itinerary per jam, titik kumpul (*meeting point*), dan sisa kuota live.
- **Alur Pemesanan 3 Langkah**:
  1. *Langkah 1*: Pilih tanggal keberangkatan & formulir rombongan (Nama, NIK 16 digit, gender, kontak darurat).
  2. *Langkah 2*: Rincian biaya otomatis dengan **kode unik 3-digit transfer**, nomor rekening resmi (BCA, Mandiri, QRIS) dengan tombol salin cepat.
  3. *Langkah 3*: Unggah bukti bayar (dukungan upload gambar atau simulasi struk demo instant) -> Menerbitkan kode booking unik (contoh: `BND-2026-X89K`).
- **Layanan Mandiri E-Tiket**: Lacak status reservasi kapan saja dan cetak/unduh **E-Tiket resmi ber-QR Code** untuk boarding pass lapangan (`window.print()`).

---

### 2. 📊 Dashboard Admin Operasional (Back-Office)
- **Dashboard Analitik**: KPI harian real-time, grafik batang tren reservasi 6 bulan, dan daftar 5 Keberangkatan Terdekat.
- **Trip Catalog (Katalog Master)**: CRUD paket trip, pengaturan durasi, harga per orang, kuota min/maks, include/exclude.
- **Departures / Schedule**: Penjadwalan tanggal keberangkatan dengan fitur **Pencegahan Bentrok Pemandu (*Guide Clash Detection*)**.
- **Bookings Manager**: Monitoring seluruh reservasi masuk, filter status, dan **Input Booking Tamu Offline (Walk-in / WA)**.
- **Manual Payment Verification**: Antrian verifikasi transfer manual dengan penampil foto struk resolusi tinggi, tombol **Approve** (otomatis mengaktifkan E-Tiket), dan tombol **Reject** disertai catatan audit trail.
- **Generator Manifest Penumpang**: Dokumen manifest resmi standar BKSDA/Taman Nasional format cetak siap pakai (`@media print`).
- **Check-In Boarding**: Presensi kehadiran penumpang di meeting point dengan tombol centang hadir real-time.
- **Tour Guides & Certifications**: Database profil pemandu berlisensi resmi dengan peringatan lisensi yang akan kedaluwarsa (&lt; 30 hari).
- **Transactions & Invoice**: Buku besar mutasi finansial dan cetak invoice resmi pemesanan.

---

## 🛠️ Tech Stack & Desain

- **Framework:** [React 18](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Styling:** **Pure Vanilla CSS** (Arsitektur custom design tokens, Deep Rainforest Emerald `#064e3b`, Ocean Teal `#0d9488`, Amber Sunset `#f59e0b`, Obsidian Slate `#0f172a`, Glassmorphism & Print stylesheet).
- **State & Storage:** Reactive Context API dengan sinkronisasi `localStorage` dan pre-seeded mock data realistis.

---

## 🚀 Memulai (Quick Start)

### Prasyarat
- [Node.js](https://nodejs.org/) (versi 18 ke atas disarankan)
- Git

### Instalasi & Menjalankan Lokal

```bash
# 1. Clone repository
git clone https://github.com/BenyRonald77/BendotTravel.git

# 2. Masuk ke direktori proyek
cd BendotTravel

# 3. Install dependencies
npm install

# 4. Jalankan development server
npm run dev
```

Buka browser Anda dan akses:
```
http://localhost:5173/
```

### Build Produksi

```bash
npm run build
```
File hasil build akan berada di direktori `dist/` dan siap di-deploy ke Vercel, Netlify, atau GitHub Pages.

---

## 📁 Struktur Direktori Proyek

```
Travel/
├── PRD.md                        # Product Requirements Document Resmi
├── PRD_Bendot_Open_Trip.md       # Spesifikasi Draf Terkait
├── index.html                    # HTML Shell dengan font Google Plus Jakarta Sans & Outfit
├── package.json
├── tsconfig.json
├── vite.config.ts
├── src/
│   ├── main.tsx                  # Entry point React
│   ├── App.tsx                   # Main switcher (Public Portal ↔ Admin Portal)
│   ├── types/                    # TypeScript interfaces
│   │   └── index.ts
│   ├── data/                     # Seed data kaya (trips, schedules, guides, bookings)
│   │   └── seedData.ts
│   ├── context/                  # Central state management & localStorage sync
│   │   └── AppContext.tsx
│   ├── styles/                   # Modern Vanilla CSS design system
│   │   ├── index.css             # Global tokens & animations
│   │   ├── public.css            # Public portal styling
│   │   └── admin.css             # Dark luxury admin styling
│   └── components/
│       ├── common/               # Navbar, Toast notifications
│       ├── public/               # Hero, TripCard, Modals, Booking flow, E-Tiket
│       └── admin/                # Sidebar, Header, Dashboard, Manifest, Check-in, dll.
```

---

## 📄 Lisensi & Dokumen

- Spesifikasi lengkap sistem dapat dibaca di [PRD.md](./PRD.md).
- Dikembangkan untuk operasional **Bendot Open Trip & Travel Nusantara**.
