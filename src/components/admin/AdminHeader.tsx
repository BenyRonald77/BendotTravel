import React from 'react';
import { useApp } from '../../context/AppContext';
import { ExternalLink, RotateCcw, Bell, ShieldCheck, Sparkles } from 'lucide-react';

export const AdminHeader: React.FC = () => {
  const { adminTab, setAdminTab, setCurrentView, resetAllData, bookings, confirm, alert, prompt, showToast } = useApp();

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

  const handleResetDemo = async () => {
    const confirmed = await confirm({
      title: 'Reset Seluruh Data Demo?',
      message: (
        <span>
          Perhatian: Seluruh penambahan paket wisata, jadwal baru, alokasi pemandu, dan data booking yang tersimpan di browser akan dikembalikan ke data awal.
          <br /><br />
          Apakah Anda yakin ingin melanjutkan reset sistem?
        </span>
      ),
      variant: 'warning',
      icon: 'refresh',
      confirmText: 'Ya, Reset Data Sekarang',
      cancelText: 'Batalkan'
    });
    if (confirmed) {
      resetAllData();
    }
  };

  const handleTestDialogShowcase = async () => {
    const choice = await prompt({
      title: 'Showcase Custom Dialog UI',
      message: (
        <span>
          Pilih tipe dialog yang ingin Anda uji coba (ketik <strong>1</strong>, <strong>2</strong>, <strong>3</strong>, atau <strong>4</strong>):<br />
          • <strong>1</strong>: Danger Dialog (Hapus Data)<br />
          • <strong>2</strong>: Warning Dialog (Peringatan Kuota)<br />
          • <strong>3</strong>: Info Alert (Pemeliharaan Server)<br />
          • <strong>4</strong>: Success Alert (Sinkronisasi Berhasil)
        </span>
      ),
      defaultValue: '1',
      placeholder: 'Ketik 1, 2, 3, atau 4',
      confirmText: 'Tampilkan Dialog'
    });

    if (choice === '1') {
      const ok = await confirm({
        title: 'Hapus Data Destinasi Wisata?',
        message: 'Tindakan ini akan menghapus paket trip dan dokumentasi terkait secara permanen dari server database.',
        variant: 'danger',
        icon: 'trash',
        confirmText: 'Hapus Permanen',
        cancelText: 'Batalkan'
      });
      if (ok) showToast('Aksi konfirmasi berhasil dieksekusi!', 'success');
    } else if (choice === '2') {
      const ok = await confirm({
        title: 'Perubahan Kuota Maksimal',
        message: 'Mengubah batas kuota di bawah jumlah peserta yang telah terkonfirmasi dapat membatalkan tiket overbooked.',
        variant: 'warning',
        confirmText: 'Lanjutkan Simpan',
        cancelText: 'Batal'
      });
      if (ok) showToast('Perubahan kuota disimpan.', 'info');
    } else if (choice === '3') {
      await alert({
        title: 'Pemeliharaan Server Terjadwal',
        message: 'Sistem operasional Bendot Travel akan melakukan sinkronisasi manifes lapangan pada pukul 23:00 WIB malam ini.',
        variant: 'info',
        confirmText: 'Saya Mengerti'
      });
    } else if (choice === '4') {
      await alert({
        title: 'Sinkronisasi Selesai!',
        message: 'Seluruh manifest peserta dan kwitansi invoice digital berhasil diperbarui ke kondisi terkini.',
        variant: 'success',
        confirmText: 'Tutup'
      });
    }
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
          onClick={handleTestDialogShowcase}
          title="Uji coba seluruh varian Custom UI Dialog"
          style={{ borderColor: 'var(--teal-400)', color: 'var(--teal-700)' }}
        >
          <Sparkles size={14} />
          <span>Uji Dialog UI</span>
        </button>

        <button
          className="btn btn-secondary btn-sm"
          onClick={handleResetDemo}
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
