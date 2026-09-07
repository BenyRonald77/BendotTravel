import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Calendar, UserCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export const AvailabilityView: React.FC = () => {
  const { guides, schedules, trips } = useApp();

  return (
    <div>
      <div
        style={{
          background: '#ffffff',
          padding: '20px 24px',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--dark-200)',
          marginBottom: '24px'
        }}
      >
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 800, marginBottom: '6px' }}>
          Kalender Ketersediaan & Penugasan Pemandu Wisata
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--dark-500)' }}>
          Sistem secara otomatis mengunci pemandu yang sedang bertugas pada tanggal tertentu agar tidak dapat ditugaskan ganda pada jadwal lain.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {guides.map((g) => {
          // Find schedules assigned to this guide
          const assignedSchedules = schedules.filter(
            (s) => s.guideId === g.id && s.status !== 'Cancelled'
          );

          return (
            <div
              key={g.id}
              style={{
                background: '#ffffff',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--dark-200)',
                padding: '20px 24px',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid var(--dark-100)',
                  paddingBottom: '14px',
                  marginBottom: '16px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img
                    src={g.avatar}
                    alt={g.name}
                    style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <h4 style={{ fontWeight: 800, fontSize: '1.05rem' }}>{g.name}</h4>
                    <span style={{ fontSize: '0.78rem', color: 'var(--teal-700)', fontWeight: 600 }}>
                      {g.specialty} • Telp: {g.phone}
                    </span>
                  </div>
                </div>

                <span className="badge badge-emerald">
                  {assignedSchedules.length} Jadwal Aktif
                </span>
              </div>

              <div>
                <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--dark-600)', marginBottom: '10px' }}>
                  Riwayat & Jadwal Penugasan Mendatang:
                </h5>

                {assignedSchedules.length === 0 ? (
                  <p style={{ fontSize: '0.85rem', color: 'var(--dark-400)', fontStyle: 'italic' }}>
                    Pemandu berstatus bebas tugas (Standby / Siaga menerima penugasan baru).
                  </p>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
                    {assignedSchedules.map((sch) => {
                      const trip = trips.find((t) => t.id === sch.tripId);
                      return (
                        <div
                          key={sch.id}
                          style={{
                            background: 'var(--dark-50)',
                            border: '1px solid var(--dark-200)',
                            borderLeft: '4px solid var(--teal-600)',
                            padding: '12px',
                            borderRadius: 'var(--radius-md)'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '0.85rem', color: 'var(--teal-900)' }}>
                            <Calendar size={14} />
                            <span>{sch.departureDate}</span>
                          </div>
                          <div style={{ fontWeight: 600, fontSize: '0.825rem', marginTop: '4px' }}>
                            {trip?.title}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--dark-500)', marginTop: '2px' }}>
                            Kapasitas: {sch.quotaBooked} / {sch.quotaTotal} Kursi Terisi
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
