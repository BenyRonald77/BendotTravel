import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Transaction } from '../../../types';
import { CreditCard, Printer, Search, X, Receipt, CheckCircle, Clock, XCircle } from 'lucide-react';

export const TransactionsView: React.FC = () => {
  const { transactions, bookings, trips, showToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrxForInvoice, setSelectedTrxForInvoice] = useState<Transaction | null>(null);

  const filteredTransactions = transactions.filter((t) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.bookingCode.toLowerCase().includes(q) ||
      t.customerName.toLowerCase().includes(q) ||
      t.id.toLowerCase().includes(q)
    );
  });

  const totalSuccess = transactions
    .filter((t) => t.status === 'Success')
    .reduce((sum, t) => sum + t.amount, 0);

  const handlePrintInvoice = () => {
    window.print();
  };

  const invoiceBooking = selectedTrxForInvoice
    ? bookings.find((b) => b.bookingCode === selectedTrxForInvoice.bookingCode)
    : null;
  const invoiceTrip = invoiceBooking
    ? trips.find((t) => t.id === invoiceBooking.tripId)
    : null;

  return (
    <div>
      {/* Metrics Summary */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px',
          marginBottom: '24px'
        }}
      >
        <div className="kpi-card">
          <div>
            <p style={{ fontSize: '0.8rem', color: 'var(--dark-500)', fontWeight: 600 }}>
              TOTAL PEMASUKAN BERSIH
            </p>
            <div className="kpi-value" style={{ color: '#047857' }}>
              Rp {totalSuccess.toLocaleString('id-ID')}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--dark-400)' }}>
              Dari {transactions.filter((t) => t.status === 'Success').length} transaksi berhasil
            </span>
          </div>
          <div className="kpi-icon-box kpi-icon-emerald">
            <CreditCard size={22} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <p style={{ fontSize: '0.8rem', color: 'var(--dark-500)', fontWeight: 600 }}>
              TRANSAKSI TERTUNDA (PENDING)
            </p>
            <div className="kpi-value" style={{ color: '#b45309' }}>
              {transactions.filter((t) => t.status === 'Pending').length} Tagihan
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--dark-400)' }}>
              Menunggu bukti transfer dari peserta
            </span>
          </div>
          <div className="kpi-icon-box kpi-icon-amber">
            <Clock size={22} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <p style={{ fontSize: '0.8rem', color: 'var(--dark-500)', fontWeight: 600 }}>
              KODE VERIFIKASI UNIK TERKUMPUL
            </p>
            <div className="kpi-value" style={{ color: 'var(--teal-700)' }}>
              Rp {(bookings.reduce((sum, b) => sum + (b.uniqueCode || 0), 0)).toLocaleString('id-ID')}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--dark-400)' }}>
              Otomatis terakumulasi dalam rekening
            </span>
          </div>
          <div className="kpi-icon-box kpi-icon-teal">
            <Receipt size={22} />
          </div>
        </div>
      </div>

      {/* Search and Table */}
      <div className="table-container">
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--dark-200)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ position: 'relative', width: '320px' }}>
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50)',
                color: 'var(--dark-400)'
              }}
            />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '38px' }}
              placeholder="Cari transaksi atau kode booking..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--dark-500)' }}>
            Menampilkan {filteredTransactions.length} transaksi
          </span>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>ID Transaksi</th>
              <th>Kode Booking</th>
              <th>Nama Pembayar</th>
              <th>Nominal</th>
              <th>Metode Pembayaran</th>
              <th>Tanggal</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Invoice</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((trx) => (
              <tr key={trx.id}>
                <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{trx.id}</td>
                <td>
                  <span className="badge badge-amber">{trx.bookingCode}</span>
                </td>
                <td><strong>{trx.customerName}</strong></td>
                <td style={{ fontWeight: 700, color: 'var(--dark-900)' }}>
                  Rp {trx.amount.toLocaleString('id-ID')}
                </td>
                <td>{trx.paymentMethod}</td>
                <td style={{ fontSize: '0.8rem', color: 'var(--dark-500)' }}>{trx.date}</td>
                <td>
                  <span
                    className={`badge ${
                      trx.status === 'Success'
                        ? 'badge-emerald'
                        : trx.status === 'Pending'
                        ? 'badge-amber'
                        : 'badge-red'
                    }`}
                  >
                    {trx.status === 'Success' ? 'LUNAS' : trx.status}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setSelectedTrxForInvoice(trx)}
                  >
                    <Receipt size={13} />
                    <span>Invoice</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Invoice Modal */}
      {selectedTrxForInvoice && (
        <div className="modal-overlay" onClick={() => setSelectedTrxForInvoice(null)}>
          <div
            className="modal-content"
            style={{ maxWidth: '640px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header no-print">
              <h3 className="modal-title">Faktur / Invoice Pembayaran</h3>
              <button
                className="modal-close-btn"
                onClick={() => setSelectedTrxForInvoice(null)}
              >
                <X size={18} />
              </button>
            </div>

            {/* Printable Invoice Sheet */}
            <div className="modal-body printable-area" style={{ padding: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid var(--teal-700)', paddingBottom: '16px', marginBottom: '20px' }}>
                <div>
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--teal-800)' }}>
                    BENDOT TRAVEL NUSANTARA
                  </h2>
                  <p style={{ fontSize: '0.78rem', color: 'var(--dark-500)' }}>
                    PT BENDOT PETUALANGAN NUSANTARA • NPWP: 93.812.049.2-628.000
                  </p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--dark-500)' }}>
                    Jl. Raya Ijen No. 88, Licin, Banyuwangi — Jawa Timur
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="badge badge-emerald" style={{ fontSize: '0.85rem' }}>
                    INVOICE RESMI
                  </span>
                  <div style={{ fontFamily: 'monospace', fontWeight: 700, marginTop: '4px' }}>
                    {selectedTrxForInvoice.id}
                  </div>
                  <small style={{ color: 'var(--dark-400)' }}>{selectedTrxForInvoice.date}</small>
                </div>
              </div>

              {/* Customer and Booking Meta */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px', fontSize: '0.85rem' }}>
                <div>
                  <strong style={{ color: 'var(--dark-500)', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                    Ditagihkan Kepada:
                  </strong>
                  <div style={{ fontWeight: 700, fontSize: '1rem', marginTop: '2px' }}>
                    {selectedTrxForInvoice.customerName}
                  </div>
                  <div>Telp: {invoiceBooking?.customerPhone}</div>
                  <div>Email: {invoiceBooking?.customerEmail}</div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <strong style={{ color: 'var(--dark-500)', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                    Detail Pemesanan:
                  </strong>
                  <div style={{ fontWeight: 700, marginTop: '2px' }}>
                    Kode: {selectedTrxForInvoice.bookingCode}
                  </div>
                  <div>Paket: {invoiceTrip?.title}</div>
                  <div>Metode: {selectedTrxForInvoice.paymentMethod}</div>
                </div>
              </div>

              {/* Items Table */}
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', marginBottom: '24px' }}>
                <thead style={{ background: 'var(--dark-50)', borderBottom: '1px solid var(--dark-300)' }}>
                  <tr>
                    <th style={{ padding: '8px', textAlign: 'left' }}>Deskripsi</th>
                    <th style={{ padding: '8px', textAlign: 'center' }}>Jumlah</th>
                    <th style={{ padding: '8px', textAlign: 'right' }}>Harga Satuan</th>
                    <th style={{ padding: '8px', textAlign: 'right' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--dark-100)' }}>
                    <td style={{ padding: '10px 8px' }}>
                      <strong>{invoiceTrip?.title || 'Paket Open Trip'}</strong>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--dark-500)' }}>
                        All-in include tiket BKSDA & asuransi
                      </span>
                    </td>
                    <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                      {invoiceBooking?.totalParticipants || 1} Pax
                    </td>
                    <td style={{ padding: '10px 8px', textAlign: 'right' }}>
                      Rp {(invoiceTrip?.price || selectedTrxForInvoice.amount).toLocaleString('id-ID')}
                    </td>
                    <td style={{ padding: '10px 8px', textAlign: 'right', fontWeight: 600 }}>
                      Rp {(invoiceBooking?.totalAmount || selectedTrxForInvoice.amount).toLocaleString('id-ID')}
                    </td>
                  </tr>
                  {invoiceBooking?.uniqueCode ? (
                    <tr style={{ borderBottom: '1px solid var(--dark-100)', color: 'var(--teal-700)' }}>
                      <td style={{ padding: '8px' }}>Kode Verifikasi Unik Rekening</td>
                      <td style={{ padding: '8px', textAlign: 'center' }}>1</td>
                      <td style={{ padding: '8px', textAlign: 'right' }}>Rp {invoiceBooking.uniqueCode}</td>
                      <td style={{ padding: '8px', textAlign: 'right', fontWeight: 600 }}>Rp {invoiceBooking.uniqueCode}</td>
                    </tr>
                  ) : null}
                  <tr style={{ fontWeight: 800, fontSize: '1rem', borderTop: '2px solid var(--dark-900)' }}>
                    <td colSpan={3} style={{ padding: '12px 8px', textAlign: 'right' }}>TOTAL DIBAYARKAN:</td>
                    <td style={{ padding: '12px 8px', textAlign: 'right', color: '#047857' }}>
                      Rp {selectedTrxForInvoice.amount.toLocaleString('id-ID')}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div style={{ background: 'var(--dark-50)', padding: '12px 16px', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', color: 'var(--dark-600)' }}>
                Status: <strong>LUNAS & TERVERIFIKASI SISTEM</strong> • Terima kasih telah mempercayakan petualangan Anda kepada Bendot Open Trip & Travel.
              </div>
            </div>

            <div className="modal-footer no-print">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setSelectedTrxForInvoice(null)}
              >
                Tutup
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handlePrintInvoice}
              >
                <Printer size={15} />
                <span>Cetak / Simpan PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
