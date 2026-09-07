import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Booking } from '../../../types';
import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  Eye,
  X,
  CreditCard,
  Clock,
  AlertTriangle
} from 'lucide-react';

export const ManualVerificationView: React.FC = () => {
  const { bookings, approvePayment, rejectPayment, showToast } = useApp();
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);
  const [rejectModalBooking, setRejectModalBooking] = useState<Booking | null>(null);
  const [rejectReason, setRejectReason] = useState('Nominal transfer tidak sesuai dengan total tagihan unik.');

  const pendingList = bookings.filter((b) => b.paymentStatus === 'Menunggu Verifikasi');
  const processedList = bookings.filter(
    (b) => b.paymentStatus === 'Terkonfirmasi' || b.paymentStatus === 'Ditolak'
  );

  const [activeTab, setActiveTab] = useState<'pending' | 'processed'>('pending');

  const handleApprove = (booking: Booking) => {
    approvePayment(booking.id, 'Staf Keuangan - Sarah');
  };

  const handleConfirmReject = () => {
    if (!rejectModalBooking) return;
    rejectPayment(rejectModalBooking.id, rejectReason, 'Staf Keuangan - Sarah');
    setRejectModalBooking(null);
  };

  return (
    <div>
      {/* Tab Switcher */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <button
          className={`chip-btn ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          <Clock size={14} />
          <span>Antrian Menunggu Verifikasi ({pendingList.length})</span>
        </button>
        <button
          className={`chip-btn ${activeTab === 'processed' ? 'active' : ''}`}
          onClick={() => setActiveTab('processed')}
        >
          <ShieldCheck size={14} />
          <span>Riwayat Verifikasi ({processedList.length})</span>
        </button>
      </div>

      {activeTab === 'pending' ? (
        pendingList.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              background: '#ffffff',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--dark-200)'
            }}
          >
            <CheckCircle size={48} color="var(--primary-500)" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--dark-800)' }}>
              Semua Pembayaran Sudah Terverifikasi!
            </h3>
            <p style={{ color: 'var(--dark-500)', fontSize: '0.85rem', marginTop: '6px' }}>
              Tidak ada antrian bukti transfer baru saat ini. Sistem siap menerima reservasi baru.
            </p>
          </div>
        ) : (
          <div className="verification-grid">
            {pendingList.map((b) => (
              <div key={b.id} className="verification-card">
                {/* Header info */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="badge badge-amber">{b.bookingCode}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--dark-400)' }}>{b.createdAt}</span>
                </div>

                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--dark-900)' }}>
                    {b.customerName}
                  </h4>
                  <div style={{ fontSize: '0.8rem', color: 'var(--dark-500)', marginTop: '2px' }}>
                    Telp: {b.customerPhone} • {b.totalParticipants} Peserta
                  </div>
                </div>

                {/* Amount to match */}
                <div
                  style={{
                    background: 'var(--dark-50)',
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--dark-200)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--dark-500)' }}>
                    <span>Metode: <strong>{b.paymentMethod}</strong></span>
                    <span>Kode Unik: <strong>+{b.uniqueCode}</strong></span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Total Harus Ditransfer:</span>
                    <strong style={{ fontSize: '1.1rem', color: 'var(--teal-700)' }}>
                      Rp {b.finalAmount.toLocaleString('id-ID')}
                    </strong>
                  </div>
                </div>

                {/* Receipt Preview */}
                {b.paymentProofUrl ? (
                  <div
                    className="verification-receipt-preview"
                    onClick={() => setSelectedReceipt(b.paymentProofUrl || null)}
                    title="Klik untuk memperbesar foto struk bukti bayar"
                  >
                    <img
                      src={b.paymentProofUrl}
                      alt="Struk Transfer"
                      className="verification-receipt-img"
                    />
                    <div className="receipt-zoom-hint">
                      <Eye size={12} /> Perbesar Foto
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      padding: '24px',
                      textAlign: 'center',
                      background: 'var(--dark-100)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--dark-500)',
                      fontSize: '0.85rem'
                    }}
                  >
                    Bukti transfer belum diunggah oleh peserta
                  </div>
                )}

                {b.notes && (
                  <p style={{ fontSize: '0.78rem', color: 'var(--dark-600)', fontStyle: 'italic' }}>
                    Catatan tamu: "{b.notes}"
                  </p>
                )}

                {/* Action Buttons */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: 'auto' }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ color: '#ef4444', borderColor: '#fca5a5' }}
                    onClick={() => setRejectModalBooking(b)}
                  >
                    <XCircle size={15} />
                    <span>Tolak</span>
                  </button>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleApprove(b)}
                  >
                    <CheckCircle size={15} />
                    <span>Setujui Pembayaran</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* Processed List */
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Kode Booking</th>
                <th>Nama Tamu</th>
                <th>Nominal</th>
                <th>Metode</th>
                <th>Status</th>
                <th>Diverifikasi Oleh</th>
                <th>Waktu</th>
              </tr>
            </thead>
            <tbody>
              {processedList.map((b) => (
                <tr key={b.id}>
                  <td>
                    <span className="badge badge-amber">{b.bookingCode}</span>
                  </td>
                  <td><strong>{b.customerName}</strong></td>
                  <td>Rp {b.finalAmount.toLocaleString('id-ID')}</td>
                  <td>{b.paymentMethod}</td>
                  <td>
                    <span
                      className={`badge ${
                        b.paymentStatus === 'Terkonfirmasi' ? 'badge-emerald' : 'badge-red'
                      }`}
                    >
                      {b.paymentStatus}
                    </span>
                  </td>
                  <td>{b.verifiedBy || '-'}</td>
                  <td>{b.verifiedAt || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Lightbox Modal for Receipt */}
      {selectedReceipt && (
        <div className="modal-overlay" onClick={() => setSelectedReceipt(null)}>
          <div
            className="modal-content"
            style={{ maxWidth: '600px', background: '#000', padding: '12px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
              <button
                onClick={() => setSelectedReceipt(null)}
                style={{ color: '#ffffff', padding: '6px' }}
              >
                <X size={20} />
              </button>
            </div>
            <img
              src={selectedReceipt}
              alt="Bukti Transfer Penuh"
              style={{ width: '100%', maxHeight: '75vh', objectFit: 'contain' }}
            />
          </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {rejectModalBooking && (
        <div className="modal-overlay" onClick={() => setRejectModalBooking(null)}>
          <div
            className="modal-content"
            style={{ maxWidth: '480px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3 className="modal-title">Tolak Bukti Pembayaran</h3>
              <button
                className="modal-close-btn"
                onClick={() => setRejectModalBooking(null)}
              >
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: '0.85rem', color: 'var(--dark-600)', marginBottom: '14px' }}>
                Peserta (<strong>{rejectModalBooking.customerName}</strong> — {rejectModalBooking.bookingCode}) akan menerima status penolakan ini dan dapat mengunggah bukti ulang di situs publik.
              </p>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
                Alasan Penolakan:
              </label>
              <select
                className="form-select"
                style={{ paddingLeft: '12px', marginBottom: '10px' }}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              >
                <option value="Nominal transfer tidak sesuai dengan total tagihan unik.">
                  Nominal transfer tidak sesuai dengan total tagihan unik.
                </option>
                <option value="Foto struk buram / tidak terbaca dengan jelas.">
                  Foto struk buram / tidak terbaca dengan jelas.
                </option>
                <option value="Bukti transfer terpotong atau tidak memuat tanggal transaksi.">
                  Bukti transfer terpotong atau tidak memuat tanggal transaksi.
                </option>
                <option value="Rekening tujuan transfer tidak sesuai dengan rekening resmi Bendot.">
                  Rekening tujuan transfer tidak sesuai dengan rekening resmi Bendot.
                </option>
              </select>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setRejectModalBooking(null)}
              >
                Batal
              </button>
              <button className="btn btn-danger" onClick={handleConfirmReject}>
                Konfirmasi Tolak Bukti
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
