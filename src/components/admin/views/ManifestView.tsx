import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Printer, Calendar, Users, MapPin, Compass, ShieldCheck } from 'lucide-react';

export const ManifestView: React.FC = () => {
  const {
    schedules,
    trips,
    guides,
    bookings,
    selectedScheduleForManifestId,
    setSelectedScheduleForManifestId
  } = useApp();

  const [currentScheduleId, setCurrentScheduleId] = useState<string>(
    selectedScheduleForManifestId || schedules[0]?.id || ''
  );

  const schedule = schedules.find((s) => s.id === currentScheduleId);
  const trip = trips.find((t) => t.id === schedule?.tripId);
  const guide = guides.find((g) => g.id === schedule?.guideId);

  // Collect all participants from confirmed bookings of this schedule
  const relevantBookings = bookings.filter(
    (b) => b.scheduleId === currentScheduleId && b.paymentStatus === 'Terkonfirmasi'
  );

  const manifestPassengers: Array<{
    bookingCode: string;
    name: string;
    nik: string;
    gender: 'L' | 'P';
    phone: string;
    emergencyContact: string;
    checkedIn: boolean;
  }> = [];

  relevantBookings.forEach((b) => {
    b.participants.forEach((p) => {
      manifestPassengers.push({
        bookingCode: b.bookingCode,
        name: p.name,
        nik: p.nik,
        gender: p.gender,
        phone: p.phone,
        emergencyContact: p.emergencyContact,
        checkedIn: p.checkedIn
      });
    });
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      {/* Top Selector (No Print) */}
      <div
        className="no-print"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#ffffff',
          padding: '16px 20px',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--dark-200)',
          marginBottom: '24px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <label style={{ fontWeight: 700, fontSize: '0.9rem' }}>
            Pilih Jadwal Keberangkatan:
          </label>
          <select
            className="form-select"
            style={{ width: 'auto', paddingLeft: '14px' }}
            value={currentScheduleId}
            onChange={(e) => {
              setCurrentScheduleId(e.target.value);
              setSelectedScheduleForManifestId(e.target.value);
            }}
          >
            {schedules.map((sch) => {
              const tr = trips.find((t) => t.id === sch.tripId);
              return (
                <option key={sch.id} value={sch.id}>
                  {sch.departureDate} — {tr?.title} ({sch.quotaBooked} Peserta)
                </option>
              );
            })}
          </select>
        </div>

        <button className="btn btn-primary" onClick={handlePrint}>
          <Printer size={16} />
          <span>Cetak Dokumen Manifest (Print / PDF)</span>
        </button>
      </div>

      {/* Official Manifest Document (Printable) */}
      <div className="manifest-document printable-area">
        {/* Header */}
        <div className="manifest-header">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '6px' }}>
            <Compass size={28} color="#047857" />
            <h2>BENDOT OPEN TRIP & TRAVEL NUSANTARA</h2>
          </div>
          <p>
            DAFTAR MANIFEST RESMI PENUMPANG & PESERTA EKSPEDISI WISATA
          </p>
          <small style={{ color: 'var(--dark-500)' }}>
            Lampiran Wajib Perizinan Kawasan Konservasi BKSDA Jawa Timur & Asuransi Jiwa Peserta
          </small>
        </div>

        {/* Metadata */}
        <div className="manifest-meta-box">
          <div>
            <strong>Nama Paket Trip:</strong>
            <div>{trip?.title || '-'}</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--dark-500)' }}>Kode: {trip?.code}</span>
          </div>

          <div>
            <strong>Tanggal Keberangkatan:</strong>
            <div>{schedule?.departureDate || '-'}</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--dark-500)' }}>Meeting: {trip?.meetingPoint}</span>
          </div>

          <div>
            <strong>Field Leader / Pemandu Utama:</strong>
            <div>{guide?.name || 'Belum Ditugaskan'}</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--dark-500)' }}>No. HP: {guide?.phone || '-'}</span>
          </div>
        </div>

        {/* Passengers Table */}
        <div style={{ border: '1px solid var(--dark-300)', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '24px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead style={{ background: 'var(--dark-100)', textAlign: 'left' }}>
              <tr>
                <th style={{ padding: '10px 12px', borderBottom: '1px solid var(--dark-300)' }}>No</th>
                <th style={{ padding: '10px 12px', borderBottom: '1px solid var(--dark-300)' }}>Kode Booking</th>
                <th style={{ padding: '10px 12px', borderBottom: '1px solid var(--dark-300)' }}>Nama Lengkap Peserta</th>
                <th style={{ padding: '10px 12px', borderBottom: '1px solid var(--dark-300)' }}>NIK KTP (16 Digit)</th>
                <th style={{ padding: '10px 12px', borderBottom: '1px solid var(--dark-300)' }}>L/P</th>
                <th style={{ padding: '10px 12px', borderBottom: '1px solid var(--dark-300)' }}>No. WhatsApp</th>
                <th style={{ padding: '10px 12px', borderBottom: '1px solid var(--dark-300)' }}>Kontak Darurat</th>
                <th style={{ padding: '10px 12px', borderBottom: '1px solid var(--dark-300)', textAlign: 'center' }}>Hadir</th>
              </tr>
            </thead>
            <tbody>
              {manifestPassengers.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '24px', color: 'var(--dark-500)' }}>
                    Belum ada peserta dengan booking terkonfirmasi pada jadwal ini.
                  </td>
                </tr>
              ) : (
                manifestPassengers.map((p, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--dark-200)' }}>
                    <td style={{ padding: '9px 12px' }}>{idx + 1}</td>
                    <td style={{ padding: '9px 12px', fontFamily: 'monospace', fontWeight: 600 }}>{p.bookingCode}</td>
                    <td style={{ padding: '9px 12px', fontWeight: 700 }}>{p.name}</td>
                    <td style={{ padding: '9px 12px', fontFamily: 'monospace' }}>{p.nik}</td>
                    <td style={{ padding: '9px 12px' }}>{p.gender}</td>
                    <td style={{ padding: '9px 12px' }}>{p.phone}</td>
                    <td style={{ padding: '9px 12px' }}>{p.emergencyContact}</td>
                    <td style={{ padding: '9px 12px', textAlign: 'center' }}>
                      {p.checkedIn ? '✓ Hadir' : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Signature Area */}
        <div className="manifest-signature-row">
          <div>
            <p>Petugas Pos Gerbang Perizinan / BKSDA</p>
            <div className="signature-space" />
            <p><strong>( .................................................... )</strong></p>
            <span style={{ fontSize: '0.75rem', color: 'var(--dark-500)' }}>NIP / Tanda Tangan Resmi</span>
          </div>

          <div>
            <p>Field Leader / Pemandu Bendot Travel</p>
            <div className="signature-space" />
            <p><strong>( {guide?.name || 'Kang Bendot Suharjo'} )</strong></p>
            <span style={{ fontSize: '0.75rem', color: 'var(--dark-500)' }}>Lisensi BNSP / HPI Terverifikasi</span>
          </div>
        </div>
      </div>
    </div>
  );
};
