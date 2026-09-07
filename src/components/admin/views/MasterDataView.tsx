import React from 'react';
import { useApp } from '../../../context/AppContext';
import {
  FolderTree,
  MapPin,
  Image as ImageIcon,
  Users,
  RotateCcw,
  Sparkles,
  Receipt,
  CheckCircle,
  ExternalLink
} from 'lucide-react';

interface MasterDataViewProps {
  type:
    | 'categories'
    | 'destinations'
    | 'banners'
    | 'participants'
    | 'invoices'
    | 'refunds'
    | 'competencies';
}

export const MasterDataView: React.FC<MasterDataViewProps> = ({ type }) => {
  const { categories, destinations, banners, bookings, trips, setAdminTab } = useApp();

  // CATEGORIES
  if (type === 'categories') {
    return (
      <div>
        <div style={{ marginBottom: '20px' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--dark-500)' }}>
            Daftar kategori tema wisata untuk memfilter paket trip di beranda publik.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {categories.map((cat) => {
            const count = trips.filter((t) => t.category.includes(cat.name.split(' ')[0])).length;
            return (
              <div
                key={cat.id}
                style={{
                  background: '#ffffff',
                  padding: '20px',
                  borderRadius: 'var(--radius-xl)',
                  border: '1px solid var(--dark-200)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span className="badge badge-emerald">{cat.slug}</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--teal-700)' }}>
                    {count} Paket Aktif
                  </span>
                </div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '6px' }}>{cat.name}</h4>
                <p style={{ fontSize: '0.825rem', color: 'var(--dark-500)', lineHeight: '1.5' }}>
                  {cat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // DESTINATIONS
  if (type === 'destinations') {
    return (
      <div>
        <div style={{ marginBottom: '20px' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--dark-500)' }}>
            Kawasan destinasi unggulan operasional Bendot Travel di Jawa Timur & Bali.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {destinations.map((d) => (
            <div
              key={d.id}
              style={{
                background: '#ffffff',
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                border: '1px solid var(--dark-200)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <img src={d.image} alt={d.name} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
              <div style={{ padding: '16px' }}>
                <span className="badge badge-amber" style={{ marginBottom: '4px' }}>{d.province}</span>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '4px 0 6px' }}>{d.name}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--dark-500)' }}>{d.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // BANNERS
  if (type === 'banners') {
    return (
      <div>
        <div style={{ marginBottom: '20px' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--dark-500)' }}>
            Kelola banner slider promo yang tampil di bagian Hero halaman publik.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
          {banners.map((ban) => (
            <div
              key={ban.id}
              style={{
                background: '#ffffff',
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                border: '1px solid var(--dark-200)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <img src={ban.image} alt={ban.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
              <div style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span className="badge badge-emerald">{ban.tag}</span>
                  <span className={`badge ${ban.active ? 'badge-emerald' : 'badge-gray'}`}>
                    {ban.active ? 'Tayang' : 'Non-aktif'}
                  </span>
                </div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '4px' }}>{ban.title}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--dark-500)' }}>{ban.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // PARTICIPANTS DATABASE
  if (type === 'participants') {
    const allParticipants: Array<{
      bookingCode: string;
      customerName: string;
      name: string;
      nik: string;
      gender: string;
      phone: string;
      emergencyContact: string;
    }> = [];

    bookings.forEach((b) => {
      b.participants.forEach((p) => {
        allParticipants.push({
          bookingCode: b.bookingCode,
          customerName: b.customerName,
          name: p.name,
          nik: p.nik,
          gender: p.gender,
          phone: p.phone,
          emergencyContact: p.emergencyContact
        });
      });
    });

    return (
      <div>
        <div style={{ marginBottom: '16px' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--dark-500)' }}>
            Database seluruh peserta wisata, NIK KTP resmi, dan nomor kontak darurat keluarga.
          </p>
        </div>
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Lengkap Peserta</th>
                <th>NIK (KTP)</th>
                <th>L/P</th>
                <th>No WhatsApp</th>
                <th>Kontak Darurat</th>
                <th>Kode Booking Terkait</th>
              </tr>
            </thead>
            <tbody>
              {allParticipants.map((p, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td><strong>{p.name}</strong></td>
                  <td style={{ fontFamily: 'monospace' }}>{p.nik}</td>
                  <td>{p.gender}</td>
                  <td>{p.phone}</td>
                  <td>{p.emergencyContact}</td>
                  <td><span className="badge badge-amber">{p.bookingCode}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // REFUNDS
  if (type === 'refunds') {
    return (
      <div
        style={{
          background: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          padding: '40px',
          textAlign: 'center',
          border: '1px solid var(--dark-200)'
        }}
      >
        <RotateCcw size={48} color="var(--dark-400)" style={{ margin: '0 auto 16px' }} />
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Tidak Ada Klaim Refund Aktif</h3>
        <p style={{ color: 'var(--dark-500)', fontSize: '0.85rem', marginTop: '6px' }}>
          Seluruh keberangkatan open trip berjalan lancar dan belum ada peserta yang mengajukan pengembalian dana.
        </p>
      </div>
    );
  }

  // INVOICES SHORTCUT
  if (type === 'invoices') {
    return (
      <div>
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--dark-500)' }}>
            Faktur & tagihan resmi dari seluruh reservasi yang terdaftar di sistem.
          </p>
          <button className="btn btn-secondary btn-sm" onClick={() => setAdminTab('transactions')}>
            Buka Buku Besar Transaksi
          </button>
        </div>
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>No Invoice</th>
                <th>Nama Pelanggan</th>
                <th>Nominal</th>
                <th>Status Pembayaran</th>
                <th>Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>INV-{b.bookingCode}</td>
                  <td><strong>{b.customerName}</strong></td>
                  <td style={{ fontWeight: 700 }}>Rp {b.finalAmount.toLocaleString('id-ID')}</td>
                  <td>
                    <span className={`badge ${b.paymentStatus === 'Terkonfirmasi' ? 'badge-emerald' : 'badge-amber'}`}>
                      {b.paymentStatus}
                    </span>
                  </td>
                  <td>{b.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // COMPETENCIES
  if (type === 'competencies') {
    return (
      <div
        style={{
          background: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          padding: '24px',
          border: '1px solid var(--dark-200)'
        }}
      >
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 800, marginBottom: '6px' }}>
          Matriks Kompetensi Pemandu Wisata Nusantara
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--dark-500)', marginBottom: '20px' }}>
          Standar keahlian pemandu lapangan untuk rekomendasi penugasan ke jadwal trip yang sesuai.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          <div style={{ padding: '16px', borderRadius: 'var(--radius-lg)', background: 'var(--dark-50)', border: '1px solid var(--dark-200)' }}>
            <h4 style={{ fontWeight: 700, color: 'var(--teal-800)' }}>Pemandu Gunung & Vulkanologi</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--dark-600)', marginTop: '4px' }}>
              Penguasaan jalur Kawah Ijen, Bromo, Semeru; Penggunaan respirator gas militer; Mitigasi belerang.
            </p>
          </div>
          <div style={{ padding: '16px', borderRadius: 'var(--radius-lg)', background: 'var(--dark-50)', border: '1px solid var(--dark-200)' }}>
            <h4 style={{ fontWeight: 700, color: '#0369a1' }}>Instruktur Bahari & Penyelaman</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--dark-600)', marginTop: '4px' }}>
              Sertifikasi PADI/POSSI; Penyelamatan air terbuka; Fotografi makro underwater Pulau Menjangan.
            </p>
          </div>
          <div style={{ padding: '16px', borderRadius: 'var(--radius-lg)', background: 'var(--dark-50)', border: '1px solid var(--dark-200)' }}>
            <h4 style={{ fontWeight: 700, color: '#b45309' }}>Naturalist & Safari Ekowisata</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--dark-600)', marginTop: '4px' }}>
              Pelacakan kawanan satwa liar Taman Nasional Baluran; Edukasi habitat banteng jawa & burung langka.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
