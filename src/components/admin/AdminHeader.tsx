import React from 'react';
import { useApp } from '../../context/AppContext';
import { ExternalLink, RotateCcw, Bell, ShieldCheck } from 'lucide-react';

export const AdminHeader: React.FC = () => {
  const { adminTab, setAdminTab, setCurrentView, resetAllData, bookings } = useApp();

  const pendingVerificationCount = bookings.filter(
    (b) => b.paymentStatus === 'Menunggu Verifikasi'
  ).length;

  const tabTitles: Record<string, { title: string; subtitle: string }> = {
    dashboard: {
      title: 'Dashboard Operasional',
      subtitle: 'Ringkasan KPI harian, tren booking, dan keberangkatan terdekat'
    },
    trips: {
      title: 'Katalog Master Paket Trip',
      subtitle: 'Kelola paket open trip, durasi, fasilitas, dan harga per peserta'
    },
    categories: {
      title: 'Kategori Wisata (Roadmap)',
      subtitle: 'Pengelompokan trip berdasarkan tema petualangan'
    },
    destinations: {
      title: 'Master Destinasi (Roadmap)',
      subtitle: 'Data kawasan wisata Jawa Timur & Bali'
    },
    banners: {
      title: 'Banner Beranda Situs Publik',
      subtitle: 'Pengelolaan slider promosi dan kampanye open trip'
    },
    schedules: {
      title: 'Jadwal Keberangkatan & Pemandu',
      subtitle: 'Penetapan tanggal, kuota real-time, dan penugasan guide bebas bentrok'
    },
    bookings: {
      title: 'Daftar Booking Masuk',
      subtitle: 'Seluruh reservasi dari situs publik & input manual tamu offline'
    },
    participants: {
      title: 'Database Peserta & NIK',
      subtitle: 'Rincian identitas lengkap peserta untuk perizinan'
    },
    manifest: {
      title: 'Generator Manifest Penumpang',
      subtitle: 'Dokumen manifest resmi standar BKSDA/Taman Nasional format cetak'
    },
    checkin: {
      title: 'Check-In Boarding Hari Keberangkatan',
      subtitle: 'Pencatatan kehadiran peserta di meeting point secara real-time'
    },
    invoices: {
      title: 'Faktur & Invoice Pembayaran',
      subtitle: 'Rincian invoice resmi pemesanan paket open trip'
    },
    transactions: {
      title: 'Buku Besar Transaksi Keuangan',
      subtitle: 'Rekap mutasi pembayaran transfer manual dan gerbang pembayaran'
    },
    verification: {
      title: 'Verifikasi Pembayaran Manual',
      subtitle: 'Antrian bukti transfer peserta untuk disetujui / ditolak dengan audit trail'
    },
    refunds: {
      title: 'Manajemen Pengembalian Dana (Refunds)',
      subtitle: 'Pengelolaan klaim pengembalian dana pembatalan trip'
    },
    guides: {
      title: 'Pemandu Wisata (Tour Guides)',
      subtitle: 'Master data pemandu, nomor lisensi HPI, dan riwayat penugasan'
    },
    certifications: {
      title: 'Sertifikasi & Lisensi Guide',
      subtitle: 'Monitoring masa berlaku sertifikat BNSP/P3K dengan peringatan <30 hari'
    },
    competencies: {
      title: 'Matriks Kompetensi Pemandu',
      subtitle: 'Keahlian medan gunung, bahari snorkeling, dan bahasa asing'
    },
    availability: {
      title: 'Kalender Ketersediaan Pemandu',
      subtitle: 'Cek jadwal aktif guide untuk mencegah penugasan ganda (bentrok)'
    }
  };

  const currentInfo = tabTitles[adminTab] || {
    title: 'Panel Operasional Bendot Travel',
    subtitle: 'Sistem manajemen terpusat'
  };

  return (
    <header className="admin-topbar">
      <div className="admin-page-title-group">
        <h2>{currentInfo.title}</h2>
        <p>{currentInfo.subtitle}</p>
      </div>

      <div className="admin-topbar-actions">
        {pendingVerificationCount > 0 && (
          <button
            className="btn btn-sm"
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              color: '#dc2626',
              border: '1px solid rgba(239, 68, 68, 0.3)'
            }}
            onClick={() => setAdminTab('verification')}
            title="Ada bukti transfer baru yang menunggu verifikasi Anda!"
          >
            <ShieldCheck size={16} />
            <span>{pendingVerificationCount} Menunggu Verifikasi</span>
          </button>
        )}

        <button
          className="btn btn-secondary btn-sm"
          onClick={resetAllData}
          title="Reset data demo ke kondisi awal"
        >
          <RotateCcw size={14} />
          <span>Reset Demo</span>
        </button>

        <button
          className="btn btn-primary btn-sm"
          onClick={() => setCurrentView('public')}
          title="Buka portal publik yang dilihat oleh traveler"
        >
          <span>Lihat Situs Publik</span>
          <ExternalLink size={14} />
        </button>
      </div>
    </header>
  );
};
