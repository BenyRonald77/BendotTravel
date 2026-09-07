import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Booking } from '../../../types';
import {
  Plus,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Printer,
  X,
  Phone,
  Mail,
  Users
} from 'lucide-react';

export const BookingsView: React.FC = () => {
  const { bookings, trips, schedules, addBooking, setAdminTab, showToast } = useApp();
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);

  // Manual Offline Booking form
  const [manualForm, setManualForm] = useState({
    tripId: trips[0]?.id || '',
    scheduleId: schedules[0]?.id || '',
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    participantCount: 1,
    paymentMethod: 'BCA' as const,
    notes: 'Booking manual walk-in kantor Bendot Travel'
  });

  const filteredBookings = bookings.filter((b) => {
    if (statusFilter !== 'All' && b.paymentStatus !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchCode = b.bookingCode.toLowerCase().includes(q);
      const matchName = b.customerName.toLowerCase().includes(q);
      const matchPhone = b.customerPhone.includes(q);
      if (!matchCode && !matchName && !matchPhone) return false;
    }
    return true;
  });

  const handleTripChangeInManual = (newTripId: string) => {
    const tripSchedules = schedules.filter((s) => s.tripId === newTripId);
    setManualForm((prev) => ({
      ...prev,
      tripId: newTripId,
      scheduleId: tripSchedules[0]?.id || ''
    }));
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualForm.customerName.trim() || !manualForm.customerPhone.trim()) {
      showToast('Nama dan nomor HP pemesan wajib diisi!', 'warning');
      return;
    }

    const selectedTrip = trips.find((t) => t.id === manualForm.tripId);
    const pricePerPax = selectedTrip?.price || 350000;
    const totalAmount = pricePerPax * manualForm.participantCount;

    const participants = Array.from({ length: manualForm.participantCount }, (_, idx) => ({
      id: `p-manual-${Date.now()}-${idx}`,
      name: idx === 0 ? manualForm.customerName : `Peserta ${idx + 1} (${manualForm.customerName})`,
      nik: `35100${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      gender: 'L' as const,
      phone: manualForm.customerPhone,
      emergencyContact: `Keluarga (${manualForm.customerPhone})`,
      checkedIn: false
    }));

    addBooking({
      tripId: manualForm.tripId,
      scheduleId: manualForm.scheduleId,
      customerName: manualForm.customerName,
      customerEmail: manualForm.customerEmail || `${manualForm.customerName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      customerPhone: manualForm.customerPhone,
      totalParticipants: manualForm.participantCount,
      participants,
      totalAmount,
      uniqueCode: 0,
      finalAmount: totalAmount,
      paymentMethod: manualForm.paymentMethod,
      paymentStatus: 'Terkonfirmasi',
      verifiedBy: 'Kasir Kantor Bendot (Tunai/Langsung)',
      verifiedAt: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) + ' WIB',
      notes: manualForm.notes
    });

    setIsManualModalOpen(false);
  };

  return (
    <div>
      {/* Top Action & Filter Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
          marginBottom: '20px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ position: 'relative', width: '280px' }}>
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--dark-400)'
              }}
            />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '38px' }}
              placeholder="Cari kode booking / nama tamu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            {['All', 'Pending', 'Menunggu Verifikasi', 'Terkonfirmasi', 'Ditolak'].map(
              (status) => (
                <button
                  key={status}
                  className={`chip-btn ${statusFilter === status ? 'active' : ''}`}
                  onClick={() => setStatusFilter(status)}
                >
                  {status === 'All' ? 'Semua Status' : status}
                </button>
              )
            )}
          </div>
        </div>

        <button className="btn btn-primary" onClick={() => setIsManualModalOpen(true)}>
          <Plus size={16} />
          <span>Input Booking Manual (Offline / WA)</span>
        </button>
      </div>

      {/* Bookings Table */}
      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Kode Booking</th>
              <th>Nama Pemesan & Kontak</th>
              <th>Paket Trip</th>
              <th>Jadwal Berangkat</th>
              <th>Peserta</th>
              <th>Total Biaya</th>
              <th>Status Bayar</th>
              <th style={{ textAlign: 'right' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '32px', color: 'var(--dark-500)' }}>
                  Tidak ada data reservasi yang sesuai dengan filter.
                </td>
              </tr>
            ) : (
              filteredBookings.map((b) => {
                const trip = trips.find((t) => t.id === b.tripId);
                const schedule = schedules.find((s) => s.id === b.scheduleId);

                return (
                  <tr key={b.id}>
                    <td>
                      <span className="badge badge-amber">{b.bookingCode}</span>
                      <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--dark-400)', marginTop: '2px' }}>
                        {b.createdAt}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700 }}>{b.customerName}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: 'var(--dark-500)', marginTop: '2px' }}>
                        <Phone size={12} /> {b.customerPhone}
                      </div>
                    </td>
                    <td>
                      <strong>{trip?.title || 'Trip'}</strong>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--teal-700)' }}>
                        {trip?.code}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{schedule?.departureDate || '-'}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                        <Users size={14} color="var(--teal-600)" />
                        <span>{b.totalParticipants} Orang</span>
                      </div>
                    </td>
                    <td style={{ fontWeight: 700 }}>
                      Rp {b.finalAmount.toLocaleString('id-ID')}
                      <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--dark-400)' }}>
                        {b.paymentMethod}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          b.paymentStatus === 'Terkonfirmasi'
                            ? 'badge-emerald'
                            : b.paymentStatus === 'Menunggu Verifikasi'
                            ? 'badge-amber'
                            : b.paymentStatus === 'Ditolak'
                            ? 'badge-red'
                            : 'badge-blue'
                        }`}
                      >
                        {b.paymentStatus}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {b.paymentStatus === 'Menunggu Verifikasi' ? (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => setAdminTab('verification')}
                        >
                          Verifikasi
                        </button>
                      ) : (
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => {
                            navigator.clipboard.writeText(b.bookingCode);
                            showToast(`Kode ${b.bookingCode} disalin.`, 'info');
                          }}
                        >
                          Salin Kode
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Manual Offline Booking Modal */}
      {isManualModalOpen && (
        <div className="modal-overlay" onClick={() => setIsManualModalOpen(false)}>
          <div
            className="modal-content"
            style={{ maxWidth: '600px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3 className="modal-title">Input Booking Manual (Offline / Walk-in)</h3>
              <button
                className="modal-close-btn"
                onClick={() => setIsManualModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleManualSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                    Pilih Paket Trip *
                  </label>
                  <select
                    className="form-select"
                    style={{ paddingLeft: '14px' }}
                    value={manualForm.tripId}
                    onChange={(e) => handleTripChangeInManual(e.target.value)}
                  >
                    {trips.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.code} — {t.title} (Rp {t.price.toLocaleString('id-ID')})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                    Jadwal Keberangkatan *
                  </label>
                  <select
                    className="form-select"
                    style={{ paddingLeft: '14px' }}
                    value={manualForm.scheduleId}
                    onChange={(e) => setManualForm({ ...manualForm, scheduleId: e.target.value })}
                  >
                    {schedules
                      .filter((s) => s.tripId === manualForm.tripId)
                      .map((sch) => (
                        <option key={sch.id} value={sch.id}>
                          {sch.departureDate} (Sisa {sch.quotaTotal - sch.quotaBooked} Kursi)
                        </option>
                      ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                      Nama Pemesan / Tamu *
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      style={{ paddingLeft: '14px' }}
                      placeholder="Contoh: Pak Bambang"
                      value={manualForm.customerName}
                      onChange={(e) => setManualForm({ ...manualForm, customerName: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                      Nomor HP / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      className="form-input"
                      style={{ paddingLeft: '14px' }}
                      placeholder="0812xxxx"
                      value={manualForm.customerPhone}
                      onChange={(e) => setManualForm({ ...manualForm, customerPhone: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                      Jumlah Tiket / Peserta *
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      className="form-input"
                      style={{ paddingLeft: '14px' }}
                      value={manualForm.participantCount}
                      onChange={(e) =>
                        setManualForm({ ...manualForm, participantCount: Number(e.target.value) })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                      Metode Pembayaran
                    </label>
                    <select
                      className="form-select"
                      style={{ paddingLeft: '14px' }}
                      value={manualForm.paymentMethod}
                      onChange={(e) => setManualForm({ ...manualForm, paymentMethod: e.target.value as any })}
                    >
                      <option value="BCA">Tunai di Kasir</option>
                      <option value="BCA">BCA Transfer</option>
                      <option value="Mandiri">Mandiri Transfer</option>
                      <option value="QRIS">QRIS Kantor</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                    Catatan Reservasi
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    style={{ paddingLeft: '14px' }}
                    value={manualForm.notes}
                    onChange={(e) => setManualForm({ ...manualForm, notes: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsManualModalOpen(false)}
                >
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  <span>Simpan Booking Offline (Langsung Terkonfirmasi)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
