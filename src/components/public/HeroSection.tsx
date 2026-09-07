import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Users, Award, HeartHandshake, ChevronRight, Compass, Ticket } from 'lucide-react';

interface HeroSectionProps {
  onExploreClick: () => void;
  onCheckTicketClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreClick,
  onCheckTicketClick
}) => {
  const { banners, trips, setSelectedTripForDetail } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);

  const activeBanners = banners.filter((b) => b.active);

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeBanners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [activeBanners.length]);

  const banner = activeBanners[currentSlide] || activeBanners[0];

  const handleBannerAction = () => {
    if (banner?.tripId) {
      const trip = trips.find((t) => t.id === banner.tripId);
      if (trip) {
        setSelectedTripForDetail(trip);
        return;
      }
    }
    onExploreClick();
  };

  return (
    <section className="hero-section">
      <div className="hero-slide">
        <img
          src={banner?.image || 'https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?auto=format&fit=crop&w=1600&q=80'}
          alt={banner?.title || 'Bendot Open Trip'}
          className="hero-slide-bg"
        />
        <div className="hero-gradient-overlay" />

        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-tag">
              <Compass size={14} />
              <span>{banner?.tag || 'Petualangan Terbaik 2026'}</span>
            </div>

            <h1 className="hero-title">
              Jelajahi Alam Bebas Bersama <span>Bendot Travel</span>
            </h1>

            <p className="hero-description">
              {banner?.subtitle ||
                'Temukan pengalaman open trip tak terlupakan ke Kawah Ijen, Bromo, Baluran, hingga Menjangan didampingi pemandu lokal berlisensi resmi.'}
            </p>

            <div className="hero-actions">
              <button className="btn btn-primary btn-lg" onClick={handleBannerAction}>
                <span>Lihat Jadwal & Paket</span>
                <ChevronRight size={18} />
              </button>
              <button
                className="btn btn-secondary btn-lg"
                onClick={onCheckTicketClick}
                style={{ background: 'rgba(255,255,255,0.15)', color: '#ffffff', borderColor: 'rgba(255,255,255,0.3)' }}
              >
                <Ticket size={18} />
                <span>Cek Status / Unduh Tiket</span>
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Dots */}
        {activeBanners.length > 1 && (
          <div className="hero-carousel-dots">
            {activeBanners.map((_, idx) => (
              <div
                key={idx}
                className={`dot ${idx === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(idx)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Trust Stats Bar */}
      <div className="trust-bar">
        <div className="trust-container">
          <div className="trust-item">
            <div className="trust-icon-box">
              <Users size={24} />
            </div>
            <div>
              <h4>12,500+ Traveler</h4>
              <p>Peserta bahagia bergabung sejak 2019</p>
            </div>
          </div>

          <div className="trust-item">
            <div className="trust-icon-box">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4>100% Pasti Berangkat</h4>
              <p>Jadwal terjamin tanpa pembatalan sepihak</p>
            </div>
          </div>

          <div className="trust-item">
            <div className="trust-icon-box">
              <Award size={24} />
            </div>
            <div>
              <h4>Guide Berlisensi BNSP</h4>
              <p>Pemandu resmi tersertifikasi HPI</p>
            </div>
          </div>

          <div className="trust-item">
            <div className="trust-icon-box">
              <HeartHandshake size={24} />
            </div>
            <div>
              <h4>Asuransi & P3K Lengkap</h4>
              <p>Keselamatan adalah prioritas nomor 1</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
