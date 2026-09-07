import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Booking } from '../../types';
import {
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Printer,
  Calendar,
  MapPin,
  Users,
  QrCode,
  Compass,
  Upload,
  ArrowRight
} from 'lucide-react';

interface BookingStatusViewProps {
  initialBookingCode?: string;
  onClose?: () => void;
}

export const BookingStatusView: React.FC<BookingStatusViewProps> = ({
  initialBookingCode = '',
  onClose
}) => {
  const { bookings, trips, schedules, submitPaymentProof, showToast } = useApp();
  const [searchCode, setSearchCode] = useState(initialBookingCode);
  const [activeBooking, setActiveBooking] = useState<Booking | null>(() => {
    if (initialBookingCode) {
      return (
        bookings.find(
          (b) => b.bookingCode.toUpperCase() === initialBookingCode.toUpperCase()
        ) || null
      );
    }
    return bookings[0] || null;
  });

  const [reUploadProofUrl, setReUploadProofUrl] = useState('');

  const handleSearch = (codeToSearch: string) => {
    const found = bookings.find(
      (b) => b.bookingCode.toUpperCase() === codeToSearch.trim().toUpperCase()
    );
    if (found) {
      setActiveBooking(found);
      setSearchCode(found.bookingCode);
    } else {
      showToast(`Booking dengan kode "${codeToSearch}" tidak ditemukan.`, 'error');
    }
  };

  const handlePrintTicket = () => {
    window.print();
  };

  const handleReUploadProof = () => {
    if (!activeBooking || !reUploadProofUrl) return;
    const ok = submitPaymentProof(activeBooking.bookingCode, reUploadProofUrl);
    if (ok) {
      setActiveBooking((prev) =>
        prev
          ? {
              ...prev,
              paymentProofUrl: reUploadProofUrl,
              paymentStatus: 'Menunggu Verifikasi'
            }
          : null
      );
      setReUploadProofUrl('');
    }
  };

  const currentTrip = activeBooking
    ? trips.find((t) => t.id === activeBooking.tripId)
    : null;
  const currentSchedule = activeBooking
    ? schedules.find((s) => s.id === activeBooking.scheduleId)
    : null;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px 0' }}>
      {/* Search Bar */}
      <div
        className="no-print"
        style={{
          background: '#ffffff',
          padding: '24px',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid var(--dark-200)',
          marginBottom: '28px'
        }}
      >
        <h3
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.25rem',
            fontWeight: 800,
            marginBottom: '8px'
          }}
        >
          Lacak Status Pemesanan & Unduh E-Tiket
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--dark-500)', marginBottom: '16px' }}>
          Masukkan kode booking unik yang Anda dapatkan saat reservasi (contoh: <code>BND-2026-X89K</code>)
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch(searchCode);
          }}
          style={{ display: 'flex', gap: '10px' }}
        >
          <div style={{ position: 'relative', flexGrow: 1 }}>
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--dark-400)'
              }}
            />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '44px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
              placeholder="KODE BOOKING (MISAL: BND-2026-X89K)"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            <span>Cari Booking</span>
          </button>
        </form>

        {/* Quick Demo Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '14px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--dark-500)' }}>Coba Kode Demo:</span>
          {bookings.slice(0, 3).map((b) => (
            <button
              key={b.id}
              type="button"
              className="chip-btn"
              style={{ padding: '3px 10px', fontSize: '0.75rem' }}
              onClick={() => handleSearch(b.bookingCode)}
            >
              {b.bookingCode} ({b.paymentStatus})
            </button>
          ))}
        </div>
      </div>

      {/* Booking Details / Ticket */}
      {activeBooking && (
        <div className="printable-area">
          {/* Status Banner */}
          <div
            className="no-print"
            style={{
              padding: '16px 20px',
              borderRadius: 'var(--radius-lg)',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background:
                activeBooking.paymentStatus === 'Terkonfirmasi'
                  ? 'rgba(16, 185, 129, 0.12)'
                  : activeBooking.paymentStatus === 'Menunggu Verifikasi'
                  ? 'rgba(245, 158, 11, 0.12)'
                  : activeBooking.paymentStatus === 'Ditolak'
                  ? 'rgba(239, 68, 68, 0.12)'
                  : 'rgba(14, 165, 233, 0.12)',
              border: `1px solid ${
                activeBooking.paymentStatus === 'Terkonfirmasi'
                  ? 'rgba(16, 185, 129, 0.3)'
                  : activeBooking.paymentStatus === 'Menunggu Verifikasi'
                  ? 'rgba(245, 158, 11, 0.3)'
                  : activeBooking.paymentStatus === 'Ditolak'
                  ? 'rgba(239, 68, 68, 0.3)'
                  : 'rgba(14, 165, 233, 0.3)'
              }`
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {activeBooking.paymentStatus === 'Terkonfirmasi' ? (
                <CheckCircle2 size={24} color="#059669" />
              ) : activeBooking.paymentStatus === 'Menunggu Verifikasi' ? (
                <Clock size={24} color="#d97706" />
              ) : activeBooking.paymentStatus === 'Ditolak' ? (
                <XCircle size={24} color="#dc2626" />
              ) : (
                <AlertTriangle size={24} color="#0284c7" />
              )}
              <div>
                <strong style={{ fontSize: '1rem', display: 'block' }}>
                  Status Booking: {activeBooking.paymentStatus}
                </strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--dark-600)' }}>
                  {activeBooking.paymentStatus === 'Terkonfirmasi'
                    ? `Diverifikasi oleh ${activeBooking.verifiedBy || 'Staf Keuangan'} pada ${activeBooking.verifiedAt || 'Baru Saja'}. E-Tiket Anda siap digunakan!`
                    : activeBooking.paymentStatus === 'Menunggu Verifikasi'
                    ? 'Bukti transfer sedang diperiksa tim keuangan Bendot Travel (Maks. 15 menit).'
                    : activeBooking.paymentStatus === 'Ditolak'
                    ? `Catatan penolakan: ${activeBooking.rejectionReason || 'Bukti bayar tidak valid. Silakan upload ulang.'}`
                    : 'Menunggu transfer pembayaran dari Anda.'}
                </span>
              </div>
            </div>

            {activeBooking.paymentStatus === 'Terkonfirmasi' && (
              <button className="btn btn-primary btn-sm" onClick={handlePrintTicket}>
                <Printer size={16} />
                <span>Cetak E-Tiket</span>
              </button>
            )}
          </div>

          {/* If Pending / Rejected, show upload box */}
          {activeBooking.paymentStatus !== 'Terkonfirmasi' && (
            <div
              className="no-print"
              style={{
                background: '#ffffff',
                padding: '20px',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--dark-200)',
                marginBottom: '24px'
              }}
            >
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '8px' }}>
                {activeBooking.paymentProofUrl ? 'Bukti Bayar Terunggah' : 'Unggah Bukti Transfer Sekarang'}
              </h4>

              {activeBooking.paymentProofUrl ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <img
                    src={activeBooking.paymentProofUrl}
                    alt="Struk Transfer"
                    style={{
                      width: '80px',
                      height: '80px',
                      objectFit: 'cover',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--dark-300)'
                    }}
                  />
                  <div>
                    <span className="badge badge-amber">Sedang Ditinjau Admin</span>
                    <p style={{ fontSize: '0.8rem', color: 'var(--dark-500)', marginTop: '4px' }}>
                      Jika nominal transfer salah atau ingin ganti bukti struk, silakan unggah ulang.
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--dark-600)', marginBottom: '12px' }}>
                    Silakan transfer sebesar <strong>Rp {activeBooking.finalAmount.toLocaleString('id-ID')}</strong> ke rekening BCA <code>8935-0129-88</code> a.n. PT BENDOT PETUALANGAN NUSANTARA.
                  </p>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      submitPaymentProof(
                        activeBooking.bookingCode,
                        'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80'
                      );
                      setActiveBooking((prev) =>
                        prev
                          ? {
                              ...prev,
                              paymentProofUrl:
                                'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
                              paymentStatus: 'Menunggu Verifikasi'
                            }
                          : null
                      );
                    }}
                  >
                    <Upload size={14} />
                    <span>Simulasikan Unggah Bukti Bayar Sekarang</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* OFFICIAL E-TICKET CARD */}
          <div className="ticket-container">
            {/* Ticket Header */}
            <div className="ticket-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    background: '#ffffff',
                    color: 'var(--teal-800)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Compass size={22} />
                </div>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800, lineHeight: 1.1 }}>
                    BENDOT OPEN TRIP & TRAVEL
                  </h3>
                  <span style={{ fontSize: '0.72rem', letterSpacing: '0.08em', color: 'var(--amber-400)', textTransform: 'uppercase' }}>
                    E-Tiket & Boarding Pass Resmi
                  </span>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.7rem', opacity: 0.8, textTransform: 'uppercase' }}>Kode Booking</span>
                <div style={{ fontFamily: 'monospace', fontSize: '1.2rem', fontWeight: 800, letterSpacing: '0.05em' }}>
                  {activeBooking.bookingCode}
                </div>
              </div>
            </div>

            {/* Ticket Body */}
            <div className="ticket-body">
              <div style={{ marginBottom: '16px' }}>
                <span className="badge badge-emerald" style={{ marginBottom: '6px' }}>
                  {currentTrip?.category || 'Wisata Nusantara'}
                </span>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 800, color: 'var(--dark-900)' }}>
                  {currentTrip?.title || 'Open Trip Petualangan'}
                </h2>
              </div>

              <div className="ticket-meta-grid">
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--dark-500)', textTransform: 'uppercase' }}>
                    Tanggal Keberangkatan
                  </span>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                    <Calendar size={15} color="var(--teal-600)" />
                    {currentSchedule?.departureDate || 'Sesuai Jadwal'}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--dark-500)', textTransform: 'uppercase' }}>
                    Titik Kumpul (Meeting Point)
                  </span>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                    <MapPin size={15} color="var(--teal-600)" />
                    {currentTrip?.meetingPoint || 'Basecamp Bendot Banyuwangi'}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--dark-500)', textTransform: 'uppercase' }}>
                    Jumlah Peserta
                  </span>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                    <Users size={15} color="var(--teal-600)" />
                    {activeBooking.totalParticipants} Orang
                  </div>
                </div>
              </div>

              {/* Manifest Passengers Table in Ticket */}
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--dark-700)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Manifest Peserta Terdaftar
                </h4>
                <div style={{ border: '1px solid var(--dark-200)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                  <table style={{ width: '100%', fontSize: '0.825rem', borderCollapse: 'collapse' }}>
                    <thead style={{ background: 'var(--dark-50)', textAlign: 'left' }}>
                      <tr>
                        <th style={{ padding: '8px 12px' }}>No</th>
                        <th style={{ padding: '8px 12px' }}>Nama Peserta</th>
                        <th style={{ padding: '8px 12px' }}>NIK KTP</th>
                        <th style={{ padding: '8px 12px' }}>Gender</th>
                        <th style={{ padding: '8px 12px' }}>Kontak Darurat</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeBooking.participants.map((p, idx) => (
                        <tr key={p.id} style={{ borderTop: '1px solid var(--dark-100)' }}>
                          <td style={{ padding: '8px 12px' }}>{idx + 1}</td>
                          <td style={{ padding: '8px 12px', fontWeight: 600 }}>{p.name}</td>
                          <td style={{ padding: '8px 12px', fontFamily: 'monospace' }}>{p.nik}</td>
                          <td style={{ padding: '8px 12px' }}>{p.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</td>
                          <td style={{ padding: '8px 12px' }}>{p.emergencyContact}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* QR Code & Barcode Section */}
              <div className="ticket-qr-section">
                <div className="qr-code-placeholder">
                  {/* Simulated Crisp QR Code */}
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(5, 1fr)',
                      gap: '2px',
                      background: '#fff'
                    }}
                  >
                    {[...Array(25)].map((_, i) => (
                      <div
                        key={i}
                        style={{
                          background:
                            i % 2 === 0 || i === 0 || i === 4 || i === 20 || i === 24
                              ? '#0f172a'
                              : 'transparent',
                          borderRadius: '1px'
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div style={{ flexGrow: 1 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--dark-900)' }}>
                    QR Code Check-In Lapangan
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--dark-500)', lineHeight: '1.4', marginTop: '2px' }}>
                    Tunjukkan QR Code ini kepada Field Coordinator / Tour Guide saat kumpul di meeting point untuk verifikasi manifest kehadiran.
                  </p>
                  <div style={{ marginTop: '6px', fontSize: '0.75rem', color: 'var(--teal-700)', fontWeight: 600 }}>
                    Status Bayar: {activeBooking.paymentStatus} (LUNAS Rp {activeBooking.finalAmount.toLocaleString('id-ID')})
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
