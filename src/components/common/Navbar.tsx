import React from 'react';
import { useApp } from '../../context/AppContext';
import { Compass, Shield, Search, LayoutDashboard, MessageSquare } from 'lucide-react';

interface NavbarProps {
  onOpenCheckBooking: () => void;
  onScrollToTrips: () => void;
  onScrollToDestinations: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCheckBooking,
  onScrollToTrips,
  onScrollToDestinations
}) => {
  const { setCurrentView } = useApp();

  return (
    <header className="public-header">
      <div className="public-navbar">
        {/* Brand */}
        <div className="brand-logo" style={{ cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="brand-icon-box">
            <Compass size={24} />
          </div>
          <div className="brand-name-group">
            <span className="brand-title">BENDOT TRAVEL</span>
            <span className="brand-subtitle">Open Trip & Adventure</span>
          </div>
        </div>

        {/* Links */}
        <nav className="public-nav-links">
          <button className="nav-link" onClick={onScrollToTrips}>
            Paket Open Trip
          </button>
          <button className="nav-link" onClick={onScrollToDestinations}>
            Destinasi
          </button>
          <button className="nav-link" onClick={onOpenCheckBooking}>
            <Search size={15} />
            Cek Status Booking
          </button>
          <a
            href="https://wa.me/6281234567890?text=Halo%20Admin%20Bendot%20Travel,%20saya%20ingin%20tanya%20jadwal%20open%20trip"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link"
          >
            <MessageSquare size={15} />
            Tanya Admin via WA
          </a>
        </nav>

        {/* Actions */}
        <div className="public-nav-actions">
          <button
            className="btn btn-switch-admin"
            onClick={() => setCurrentView('admin')}
            title="Buka panel admin untuk operasional, verifikasi manual, dan jadwal"
          >
            <LayoutDashboard size={16} />
            <span>Dashboard Admin</span>
          </button>
        </div>
      </div>
    </header>
  );
};
