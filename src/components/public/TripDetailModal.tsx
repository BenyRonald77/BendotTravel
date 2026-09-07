import React, { useState } from 'react';
import { Trip } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  X,
  MapPin,
  Clock,
  Users,
  CheckCircle2,
  XCircle,
  Calendar,
  Compass,
  ArrowRight
} from 'lucide-react';

interface TripDetailModalProps {
  trip: Trip;
  onClose: () => void;
}

export const TripDetailModal: React.FC<TripDetailModalProps> = ({ trip, onClose }) => {
  const { schedules, setSelectedTripForBooking } = useApp();
  const [activeTab, setActiveTab] = useState<'itinerary' | 'facilities' | 'schedules'>('itinerary');

  const tripSchedules = schedules.filter((s) => s.tripId === trip.id && s.status !== 'Cancelled');

  const handleStartBooking = () => {
    onClose();
    setSelectedTripForBooking(trip);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '780px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header Image */}
        <div style={{ position: 'relative', height: '240px', overflow: 'hidden' }}>
          <img
            src={trip.image}
            alt={trip.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.85) 100%)'
            }}
          />
          <button
            onClick={onClose}
            className="modal-close-btn"
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'rgba(0,0,0,0.6)',
              color: '#ffffff',
              borderRadius: '50%'
            }}
            aria-label="Tutup"
          >
            <X size={20} />
          </button>

          <div
            style={{
              position: 'absolute',
              bottom: '16px',
              left: '24px',
              right: '24px',
              color: '#ffffff'
            }}
          >
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-emerald">{trip.category}</span>
              <span className="badge badge-amber">{trip.code}</span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800 }}>
              {trip.title}
            </h2>
          </div>
        </div>

        {/* Quick Meta Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            padding: '16px 24px',
            background: 'var(--dark-50)',
            borderBottom: '1px solid var(--dark-200)',
            fontSize: '0.85rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={16} color="var(--teal-600)" />
            <span>Durasi: <strong>{trip.duration}</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={16} color="var(--teal-600)" />
            <span>Kapasitas: <strong>{trip.quotaMin} - {trip.quotaMax} Peserta</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={16} color="var(--teal-600)" />
            <span>Lokasi: <strong>{trip.destination}</strong></span>
          </div>
        </div>

        {/* Body Content with Tabs */}
        <div className="modal-body">
          <p style={{ fontSize: '0.925rem', lineHeight: '1.6', color: 'var(--dark-700)', marginBottom: '20px' }}>
            {trip.description}
          </p>

          {/* Meeting Point Box */}
          <div
            style={{
              background: 'rgba(13, 148, 136, 0.08)',
              border: '1px solid rgba(13, 148, 136, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 16px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <Compass size={22} color="var(--teal-700)" />
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--teal-800)', textTransform: 'uppercase' }}>
                Titik Kumpul (Meeting Point)
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--dark-900)' }}>
                {trip.meetingPoint}
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--dark-200)', marginBottom: '16px' }}>
            <button
              style={{
                padding: '8px 16px',
                fontWeight: 700,
                fontSize: '0.875rem',
                borderBottom: activeTab === 'itinerary' ? '2px solid var(--teal-600)' : '2px solid transparent',
                color: activeTab === 'itinerary' ? 'var(--teal-700)' : 'var(--dark-500)'
              }}
              onClick={() => setActiveTab('itinerary')}
            >
              Rencana Perjalanan (Itinerary)
            </button>
            <button
              style={{
                padding: '8px 16px',
                fontWeight: 700,
                fontSize: '0.875rem',
                borderBottom: activeTab === 'facilities' ? '2px solid var(--teal-600)' : '2px solid transparent',
                color: activeTab === 'facilities' ? 'var(--teal-700)' : 'var(--dark-500)'
              }}
              onClick={() => setActiveTab('facilities')}
            >
              Fasilitas (Include / Exclude)
            </button>
            <button
              style={{
                padding: '8px 16px',
                fontWeight: 700,
                fontSize: '0.875rem',
                borderBottom: activeTab === 'schedules' ? '2px solid var(--teal-600)' : '2px solid transparent',
                color: activeTab === 'schedules' ? 'var(--teal-700)' : 'var(--dark-500)'
              }}
              onClick={() => setActiveTab('schedules')}
            >
              Jadwal Tersedia ({tripSchedules.length})
            </button>
          </div>

          {/* Tab 1: Itinerary */}
          {activeTab === 'itinerary' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {trip.itinerary.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    gap: '14px',
                    padding: '10px 14px',
                    background: 'var(--dark-50)',
                    borderRadius: 'var(--radius-md)',
                    borderLeft: '3px solid var(--teal-600)'
                  }}
                >
                  <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--teal-800)', minWidth: '100px' }}>
                    {item.time}
                  </span>
                  <span style={{ fontSize: '0.875rem', color: 'var(--dark-800)' }}>
                    {item.activity}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Tab 2: Facilities */}
          {activeTab === 'facilities' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary-700)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={16} /> Fasilitas Termasuk (Include)
                </h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {trip.includes.map((inc, i) => (
                    <li key={i} style={{ fontSize: '0.85rem', color: 'var(--dark-700)', display: 'flex', gap: '8px' }}>
                      <span style={{ color: 'var(--primary-600)' }}>✓</span>
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#dc2626', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <XCircle size={16} /> Tidak Termasuk (Exclude)
                </h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {trip.excludes.map((exc, i) => (
                    <li key={i} style={{ fontSize: '0.85rem', color: 'var(--dark-700)', display: 'flex', gap: '8px' }}>
                      <span style={{ color: '#ef4444' }}>✕</span>
                      <span>{exc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Tab 3: Schedules */}
          {activeTab === 'schedules' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {tripSchedules.length === 0 ? (
                <p style={{ color: 'var(--dark-500)', fontSize: '0.9rem', textAlign: 'center', padding: '20px' }}>
                  Belum ada jadwal keberangkatan terdaftar untuk trip ini.
                </p>
              ) : (
                tripSchedules.map((sch) => {
                  const remaining = sch.quotaTotal - sch.quotaBooked;
                  return (
                    <div
                      key={sch.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        background: 'var(--dark-50)',
                        border: '1px solid var(--dark-200)',
                        borderRadius: 'var(--radius-md)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Calendar size={18} color="var(--teal-600)" />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.925rem' }}>
                            {sch.departureDate}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--dark-500)' }}>
                            Status: <strong style={{ color: remaining <= 3 ? '#b45309' : '#047857' }}>{sch.status}</strong>
                          </div>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: remaining <= 3 ? '#b45309' : '#047857' }}>
                          Sisa {remaining} Kursi
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="modal-footer" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--dark-500)', display: 'block' }}>Biaya Paket</span>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 800, color: 'var(--dark-900)' }}>
              Rp {trip.price.toLocaleString('id-ID')} <small style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--dark-500)' }}>/ orang</small>
            </span>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-secondary" onClick={onClose}>
              Tutup
            </button>
            <button className="btn btn-primary" onClick={handleStartBooking}>
              <span>Pesan Kursi Sekarang</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
