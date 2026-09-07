import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { CheckSquare, Search, Users, UserCheck, Clock, CheckCircle2 } from 'lucide-react';

export const CheckInView: React.FC = () => {
  const { schedules, trips, bookings, toggleParticipantCheckIn, showToast } = useApp();
  const [selectedScheduleId, setSelectedScheduleId] = useState<string>(
    schedules[0]?.id || ''
  );
  const [searchQuery, setSearchQuery] = useState('');

  const schedule = schedules.find((s) => s.id === selectedScheduleId);
  const trip = trips.find((t) => t.id === schedule?.tripId);

  // Relevant bookings
  const relevantBookings = bookings.filter(
    (b) => b.scheduleId === selectedScheduleId && b.paymentStatus === 'Terkonfirmasi'
  );

  // Flatten all participants
  const allParticipants: Array<{
    bookingId: string;
    bookingCode: string;
    participantId: string;
    name: string;
    nik: string;
    gender: string;
    phone: string;
    checkedIn: boolean;
  }> = [];

  relevantBookings.forEach((b) => {
    b.participants.forEach((p) => {
      allParticipants.push({
        bookingId: b.id,
        bookingCode: b.bookingCode,
        participantId: p.id,
        name: p.name,
        nik: p.nik,
        gender: p.gender,
        phone: p.phone,
        checkedIn: p.checkedIn
      });
    });
  });

  const filteredParticipants = allParticipants.filter((p) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.bookingCode.toLowerCase().includes(q) ||
      p.nik.includes(q)
    );
  });

  const totalConfirmed = allParticipants.length;
  const presentCount = allParticipants.filter((p) => p.checkedIn).length;
  const absentCount = totalConfirmed - presentCount;

  return (
    <div>
      {/* Schedule Picker & Search */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '20px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <label style={{ fontWeight: 700, fontSize: '0.875rem' }}>Keberangkatan:</label>
          <select
            className="form-select"
            style={{ width: 'auto', paddingLeft: '14px' }}
            value={selectedScheduleId}
            onChange={(e) => setSelectedScheduleId(e.target.value)}
          >
            {schedules.map((sch) => {
              const tr = trips.find((t) => t.id === sch.tripId);
              return (
                <option key={sch.id} value={sch.id}>
                  {sch.departureDate} — {tr?.title}
                </option>
              );
            })}
          </select>
        </div>

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
            placeholder="Cari nama peserta / kode booking..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Check-In Live Stats Bar */}
      <div className="checkin-stats-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--dark-100)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--dark-700)'
            }}
          >
            <Users size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--dark-500)', textTransform: 'uppercase' }}>
              Total Penumpang
            </span>
            <div style={{ fontWeight: 800, fontSize: '1.25rem' }}>{totalConfirmed} Orang</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#047857'
            }}
          >
            <UserCheck size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--dark-500)', textTransform: 'uppercase' }}>
              Sudah Hadir (Boarded)
            </span>
            <div style={{ fontWeight: 800, fontSize: '1.25rem', color: '#047857' }}>
              {presentCount} Orang
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(245, 158, 11, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#b45309'
            }}
          >
            <Clock size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--dark-500)', textTransform: 'uppercase' }}>
              Belum Hadir
            </span>
            <div style={{ fontWeight: 800, fontSize: '1.25rem', color: '#b45309' }}>
              {absentCount} Orang
            </div>
          </div>
        </div>
      </div>

      {/* Check-In Table */}
      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Nama Lengkap Peserta</th>
              <th>Kode Booking</th>
              <th>NIK KTP</th>
              <th>No. WhatsApp</th>
              <th style={{ textAlign: 'right' }}>Aksi Boarding</th>
            </tr>
          </thead>
          <tbody>
            {filteredParticipants.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: 'var(--dark-500)' }}>
                  Tidak ada data peserta terkonfirmasi pada jadwal keberangkatan ini.
                </td>
              </tr>
            ) : (
              filteredParticipants.map((p, idx) => (
                <tr key={idx}>
                  <td>
                    <span className={`badge ${p.checkedIn ? 'badge-emerald' : 'badge-gray'}`}>
                      {p.checkedIn ? '✓ HADIR' : 'BELUM HADIR'}
                    </span>
                  </td>
                  <td>
                    <strong style={{ fontSize: '0.925rem' }}>{p.name}</strong>
                  </td>
                  <td>
                    <span className="badge badge-amber">{p.bookingCode}</span>
                  </td>
                  <td style={{ fontFamily: 'monospace' }}>{p.nik}</td>
                  <td>{p.phone}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className={`checkin-toggle-btn ${p.checkedIn ? 'checked' : 'not-checked'}`}
                      onClick={() => {
                        toggleParticipantCheckIn(p.bookingId, p.participantId);
                        showToast(
                          `Status kehadiran ${p.name} diubah menjadi: ${
                            !p.checkedIn ? 'Hadir' : 'Belum Hadir'
                          }`,
                          'info'
                        );
                      }}
                    >
                      {p.checkedIn ? 'Batalkan Hadir' : 'Tandai Hadir ✓'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
