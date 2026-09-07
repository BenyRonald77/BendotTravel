import React from 'react';
import { Trip } from '../../types';
import { useApp } from '../../context/AppContext';
import { Clock, Star, MapPin, Check, ArrowRight, Flame } from 'lucide-react';

interface TripCardProps {
  trip: Trip;
}

export const TripCard: React.FC<TripCardProps> = ({ trip }) => {
  const { schedules, setSelectedTripForDetail, setSelectedTripForBooking } = useApp();

  // Find next upcoming schedule for this trip
  const tripSchedules = schedules
    .filter((s) => s.tripId === trip.id && s.status !== 'Cancelled')
    .sort((a, b) => new Date(a.departureDate).getTime() - new Date(b.departureDate).getTime());

  const nearestSchedule = tripSchedules[0];

  const totalQuota = nearestSchedule ? nearestSchedule.quotaTotal : trip.quotaMax;
  const bookedQuota = nearestSchedule ? nearestSchedule.quotaBooked : 0;
  const remainingQuota = Math.max(0, totalQuota - bookedQuota);
  const fillPercent = Math.min(100, Math.round((bookedQuota / totalQuota) * 100));

  const isAlmostFull = remainingQuota <= 3 && remainingQuota > 0;
  const isFull = remainingQuota === 0;

  return (
    <div className="trip-card">
      <div className="trip-card-image-box">
        <img src={trip.image} alt={trip.title} className="trip-card-img" loading="lazy" />

        <div className="trip-badge-top">
          <Flame size={12} color="#fbbf24" />
          <span>OPEN TRIP</span>
        </div>

        <div className="trip-code-badge">{trip.code}</div>

        <div className="trip-duration-badge">
          <Clock size={12} />
          <span>{trip.duration}</span>
        </div>
      </div>

      <div className="trip-card-body">
        <div className="trip-card-header">
          <span className="trip-category-label">{trip.category}</span>
          <div className="trip-rating">
            <Star size={14} fill="#f59e0b" color="#f59e0b" />
            <span>{trip.rating}</span>
            <span style={{ color: 'var(--dark-400)', fontWeight: 400 }}>({trip.reviewsCount})</span>
          </div>
        </div>

        <h3 className="trip-card-title">{trip.title}</h3>

        <div className="trip-location">
          <MapPin size={14} color="var(--teal-600)" />
          <span>{trip.destination}</span>
        </div>

        <ul className="trip-highlights-list">
          {trip.highlights.slice(0, 2).map((hl, idx) => (
            <li key={idx} className="trip-highlight-item">
              <Check size={14} color="var(--primary-600)" />
              <span>{hl}</span>
            </li>
          ))}
        </ul>

        {/* Live Quota Bar */}
        <div className="trip-quota-status">
          <div className="quota-label-row">
            <span>
              {nearestSchedule ? (
                <>Keberangkatan: <strong>{nearestSchedule.departureDate}</strong></>
              ) : (
                'Jadwal Rutin Tiap Weekend'
              )}
            </span>
            <span style={{ color: isAlmostFull ? '#b45309' : isFull ? '#b91c1c' : '#047857' }}>
              {isFull
                ? 'Kuota Penuh'
                : isAlmostFull
                ? `Sisa ${remainingQuota} Kursi!`
                : `Sisa ${remainingQuota} dari ${totalQuota} Kursi`}
            </span>
          </div>
          <div className="quota-progress-bg">
            <div
              className={`quota-progress-fill ${isAlmostFull ? 'almost-full' : ''}`}
              style={{ width: `${fillPercent}%` }}
            />
          </div>
        </div>

        <div className="trip-card-footer">
          <div className="trip-price-group">
            <span className="price-label">Mulai dari / orang</span>
            <span className="price-value">Rp {trip.price.toLocaleString('id-ID')}</span>
          </div>

          <div className="trip-card-buttons">
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setSelectedTripForDetail(trip)}
              title="Lihat rincian itinerary & fasilitas"
            >
              Detail
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setSelectedTripForBooking(trip)}
              disabled={isFull}
              style={isFull ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
            >
              <span>{isFull ? 'Penuh' : 'Pesan'}</span>
              {!isFull && <ArrowRight size={14} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
