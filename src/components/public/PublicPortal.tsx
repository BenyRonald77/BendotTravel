import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Navbar } from '../common/Navbar';
import { HeroSection } from './HeroSection';
import { TripCard } from './TripCard';
import { TripDetailModal } from './TripDetailModal';
import { BookingModal } from './BookingModal';
import { BookingStatusView } from './BookingStatusView';
import {
  Search,
  Filter,
  Compass,
  MapPin,
  Star,
  Shield,
  HelpCircle,
  PhoneCall,
  Mail,
  Instagram,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const PublicPortal: React.FC = () => {
  const {
    trips,
    categories,
    destinations,
    selectedTripForDetail,
    setSelectedTripForDetail,
    selectedTripForBooking,
    setSelectedTripForBooking,
    bookingSuccessData,
    setBookingSuccessData,
    setCurrentView
  } = useApp();

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>('all');
  const [selectedDestination, setSelectedDestination] = useState<string>('all');
  const [showStatusModal, setShowStatusModal] = useState(false);

  const tripsRef = useRef<HTMLDivElement>(null);
  const destRef = useRef<HTMLDivElement>(null);

  const scrollToTrips = () => {
    tripsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToDestinations = () => {
    destRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Filter logic
  const filteredTrips = trips.filter((t) => {
    if (t.status !== 'Published') return false;

    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchDest = t.destination.toLowerCase().includes(q);
      const matchCat = t.category.toLowerCase().includes(q);
      const matchCode = t.code.toLowerCase().includes(q);
      if (!matchTitle && !matchDest && !matchCat && !matchCode) return false;
    }

    // Category
    if (selectedCategorySlug !== 'all') {
      const categoryObj = categories.find((c) => c.slug === selectedCategorySlug);
      if (categoryObj && !t.category.toLowerCase().includes(categoryObj.name.toLowerCase().split(' ')[0])) {
        return false;
      }
    }

    // Destination
    if (selectedDestination !== 'all') {
      if (t.destination !== selectedDestination) return false;
    }

    return true;
  });

  return (
    <div>
      {/* Navbar */}
      <Navbar
        onOpenCheckBooking={() => setShowStatusModal(true)}
        onScrollToTrips={scrollToTrips}
        onScrollToDestinations={scrollToDestinations}
      />

      {/* Hero Banner Carousel & Trust Bar */}
      <HeroSection
        onExploreClick={scrollToTrips}
        onCheckTicketClick={() => setShowStatusModal(true)}
      />

      {/* Main Content Area */}
      <main className="public-main">
        {/* Search & Filter Floating Card */}
        <section className="filter-section">
          <div className="search-row">
            <div className="input-icon-wrapper">
              <Search size={18} className="input-icon" />
              <input
                type="text"
                className="form-input"
                placeholder="Cari destinasi, nama trip, atau kode (misal: Ijen, Baluran, Bromo)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div>
              <select
                className="form-select"
                style={{ paddingLeft: '14px' }}
                value={selectedDestination}
                onChange={(e) => setSelectedDestination(e.target.value)}
              >
                <option value="all">Semua Destinasi Unggulan</option>
                {destinations.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                className="form-select"
                style={{ paddingLeft: '14px' }}
                value={selectedCategorySlug}
                onChange={(e) => setSelectedCategorySlug(e.target.value)}
              >
                <option value="all">Semua Kategori</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="btn btn-secondary"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategorySlug('all');
                setSelectedDestination('all');
              }}
            >
              Reset Filter
            </button>
          </div>

          {/* Category Chips Bar */}
          <div className="category-chips">
            <button
              className={`chip-btn ${selectedCategorySlug === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategorySlug('all')}
            >
              <Sparkles size={14} /> Semua Paket ({trips.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`chip-btn ${selectedCategorySlug === cat.slug ? 'active' : ''}`}
                onClick={() => setSelectedCategorySlug(cat.slug)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </section>

        {/* Trips Catalog Section */}
        <section ref={tripsRef} style={{ marginBottom: '60px' }}>
          <div className="section-header">
            <span className="section-tag">Katalog Open Trip Resmi</span>
            <h2 className="section-title">Pilihan Destinasi Terbaik Bendot Travel</h2>
            <p style={{ color: 'var(--dark-500)', fontSize: '0.95rem', marginTop: '6px' }}>
              Pasti berangkat setiap akhir pekan dengan pemandu berlisensi resmi HPI & BNSP.
            </p>
          </div>

          {filteredTrips.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '60px 20px',
                background: '#ffffff',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--dark-200)'
              }}
            >
              <Compass size={48} color="var(--dark-400)" style={{ margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--dark-800)' }}>
                Tidak ada trip yang sesuai kriteria pencarian
              </h3>
              <p style={{ color: 'var(--dark-500)', fontSize: '0.85rem', marginTop: '6px' }}>
                Silakan coba ubah kata kunci atau tekan tombol "Reset Filter".
              </p>
            </div>
          ) : (
            <div className="trips-grid">
              {filteredTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          )}
        </section>

        {/* Destinations Showcase Section */}
        <section ref={destRef} style={{ marginBottom: '70px' }}>
          <div className="section-header">
            <span className="section-tag">Jelajahi Wilayah</span>
            <h2 className="section-title">Destinasi Utama di Jawa Timur & Bali</h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '20px'
            }}
          >
            {destinations.map((dest) => (
              <div
                key={dest.id}
                style={{
                  position: 'relative',
                  height: '240px',
                  borderRadius: 'var(--radius-xl)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-md)',
                  transition: 'transform 0.3s ease'
                }}
                onClick={() => {
                  setSelectedDestination(dest.name);
                  scrollToTrips();
                }}
              >
                <img
                  src={dest.image}
                  alt={dest.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.85) 100%)'
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: '16px',
                    left: '18px',
                    right: '18px',
                    color: '#ffffff'
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: 'var(--amber-400)',
                      textTransform: 'uppercase'
                    }}
                  >
                    {dest.province}
                  </span>
                  <h4
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.15rem',
                      fontWeight: 800,
                      lineHeight: 1.2,
                      marginTop: '2px'
                    }}
                  >
                    {dest.name}
                  </h4>
                  <p
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--dark-300)',
                      marginTop: '4px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {dest.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Why Choose Bendot Travel */}
        <section
          style={{
            background: 'linear-gradient(135deg, var(--teal-900) 0%, var(--dark-950) 100%)',
            color: '#ffffff',
            padding: '50px 40px',
            borderRadius: 'var(--radius-xl)',
            marginBottom: '70px'
          }}
        >
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <span
              style={{
                color: 'var(--teal-400)',
                fontWeight: 700,
                fontSize: '0.85rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase'
              }}
            >
              Komitmen Kualitas
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '2.2rem',
                fontWeight: 800,
                marginTop: '8px',
                marginBottom: '16px'
              }}
            >
              Kenapa Memilih Bendot Open Trip?
            </h2>
            <p style={{ color: 'var(--dark-300)', fontSize: '1rem', lineHeight: '1.6', marginBottom: '32px' }}>
              Kami bukan sekadar menjual tiket perjalanan. Kami menghadirkan persahabatan, keamanan standar tinggi di alam terbuka, dan cerita kearifan lokal yang abadi bersama para pemandu asli putra daerah.
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '24px',
                textAlign: 'left'
              }}
            >
              <div style={{ background: 'rgba(255,255,255,0.06)', padding: '20px', borderRadius: 'var(--radius-lg)' }}>
                <h4 style={{ color: 'var(--amber-400)', fontWeight: 700, fontSize: '1rem', marginBottom: '6px' }}>
                  Solo Traveler Friendly
                </h4>
                <p style={{ fontSize: '0.825rem', color: 'var(--dark-300)' }}>
                  Daftar sendiri tetap jalan! Temukan teman baru dan keluarga baru selama perjalanan.
                </p>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.06)', padding: '20px', borderRadius: 'var(--radius-lg)' }}>
                <h4 style={{ color: 'var(--teal-400)', fontWeight: 700, fontSize: '1rem', marginBottom: '6px' }}>
                  Safety First & P3K
                </h4>
                <p style={{ fontSize: '0.825rem', color: 'var(--dark-300)' }}>
                  Peralatan keselamatan teruji: respirator gas Ijen bersertifikat dan asuransi BKSDA resmi.
                </p>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.06)', padding: '20px', borderRadius: 'var(--radius-lg)' }}>
                <h4 style={{ color: '#60a5fa', fontWeight: 700, fontSize: '1rem', marginBottom: '6px' }}>
                  Free Dokumentasi
                </h4>
                <p style={{ fontSize: '0.825rem', color: 'var(--dark-300)' }}>
                  Pulang bawa stok konten estetik untuk media sosial Anda dengan kamera mirrorless & GoPro.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="public-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <div className="brand-logo" style={{ color: '#ffffff' }}>
              <div className="brand-icon-box">
                <Compass size={22} />
              </div>
              <div className="brand-name-group">
                <span className="brand-title" style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff' }}>
                  BENDOT TRAVEL
                </span>
                <span className="brand-subtitle">Open Trip & Adventure</span>
              </div>
            </div>
            <p>
              Platform manajemen operasional dan reservasi open trip terpercaya. Melayani ekspedisi Kawah Ijen, Bromo, Baluran, hingga surga bawah laut Menjangan dengan standar keamanan tinggi.
            </p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <span className="badge badge-emerald">Berizin Resmi LSP-Pariwisata</span>
            </div>
          </div>

          <div className="footer-col">
            <h4>Paket Unggulan</h4>
            <ul className="footer-links">
              <li><a href="#trips" onClick={scrollToTrips}>Kawah Ijen Blue Fire</a></li>
              <li><a href="#trips" onClick={scrollToTrips}>Baluran Africa van Java</a></li>
              <li><a href="#trips" onClick={scrollToTrips}>Midnight Bromo Sunrise</a></li>
              <li><a href="#trips" onClick={scrollToTrips}>Snorkeling Menjangan</a></li>
              <li><a href="#trips" onClick={scrollToTrips}>Desa Budaya Osing Kemiren</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Layanan Peserta</h4>
            <ul className="footer-links">
              <li>
                <button
                  style={{ color: 'var(--dark-400)', fontSize: '0.875rem' }}
                  onClick={() => setShowStatusModal(true)}
                >
                  Cek Status Booking
                </button>
              </li>
              <li>
                <button
                  style={{ color: 'var(--dark-400)', fontSize: '0.875rem' }}
                  onClick={() => setShowStatusModal(true)}
                >
                  Unduh E-Tiket Resmi
                </button>
              </li>
              <li>
                <a
                  href="https://wa.me/6281234567890"
                  target="_blank"
                  rel="noreferrer"
                >
                  Konsultasi Rute WhatsApp
                </a>
              </li>
              <li>
                <button
                  style={{ color: 'var(--teal-400)', fontSize: '0.875rem', fontWeight: 600 }}
                  onClick={() => setCurrentView('admin')}
                >
                  Panel Petugas Operasional
                </button>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Kantor Basecamp</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--dark-400)', lineHeight: '1.6' }}>
              Jl. Raya Ijen No. 88, Licin, Banyuwangi, Jawa Timur — Indonesia (Depan Stasiun Banyuwangi Kota)
            </p>
            <div style={{ marginTop: '12px', fontSize: '0.85rem', color: 'var(--dark-300)' }}>
              <div>WhatsApp: <strong>0812-3456-7890</strong></div>
              <div>Email: <strong>halo@bendottravel.com</strong></div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            © 2026 <strong>Bendot Open Trip & Travel Nusantara</strong>. Hak Cipta Dilindungi Undang-Undang.
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span>Syarat & Ketentuan</span>
            <span>Kebijakan Privasi UU PDP</span>
            <span>Standar P3K & BKSDA</span>
          </div>
        </div>
      </footer>

      {/* Trip Detail Modal */}
      {selectedTripForDetail && (
        <TripDetailModal
          trip={selectedTripForDetail}
          onClose={() => setSelectedTripForDetail(null)}
        />
      )}

      {/* Booking Multi-Step Modal */}
      {selectedTripForBooking && (
        <BookingModal
          trip={selectedTripForBooking}
          onClose={() => setSelectedTripForBooking(null)}
        />
      )}

      {/* Self-Service Booking Status / E-Ticket Modal */}
      {(showStatusModal || bookingSuccessData) && (
        <div
          className="modal-overlay"
          onClick={() => {
            setShowStatusModal(false);
            setBookingSuccessData(null);
          }}
        >
          <div
            className="modal-content"
            style={{ maxWidth: '840px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3 className="modal-title">Layanan Mandiri E-Tiket & Booking</h3>
              <button
                className="modal-close-btn"
                onClick={() => {
                  setShowStatusModal(false);
                  setBookingSuccessData(null);
                }}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <BookingStatusView
                initialBookingCode={bookingSuccessData?.bookingCode || ''}
                onClose={() => {
                  setShowStatusModal(false);
                  setBookingSuccessData(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
