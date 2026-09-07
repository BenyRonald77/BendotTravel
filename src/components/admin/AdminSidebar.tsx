import React from 'react';
import { useApp, AdminTab } from '../../context/AppContext';
import {
  Compass,
  LayoutDashboard,
  MapPin,
  FolderTree,
  Image as ImageIcon,
  Calendar,
  Ticket,
  Users,
  FileSpreadsheet,
  CheckSquare,
  Receipt,
  CreditCard,
  ShieldCheck,
  RotateCcw,
  UserCheck,
  Award,
  Sparkles,
  CalendarClock,
  ExternalLink
} from 'lucide-react';

export const AdminSidebar: React.FC = () => {
  const { adminTab, setAdminTab, bookings, setCurrentView } = useApp();

  // Count pending verifications
  const pendingVerificationCount = bookings.filter(
    (b) => b.paymentStatus === 'Menunggu Verifikasi'
  ).length;

  interface MenuItem {
    id: AdminTab;
    label: string;
    icon: React.ElementType;
    badge?: string;
    badgeType?: 'soon' | 'guide' | 'count';
  }

  interface MenuGroup {
    title: string;
    items: MenuItem[];
  }

  const menuGroups: MenuGroup[] = [
    {
      title: 'IKHTISAR',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }
      ]
    },
    {
      title: 'TRIPS',
      items: [
        { id: 'trips', label: 'Trip Catalog', icon: Compass },
        { id: 'categories', label: 'Categories', icon: FolderTree, badge: 'Soon', badgeType: 'soon' },
        { id: 'destinations', label: 'Destinations', icon: MapPin, badge: 'Soon', badgeType: 'soon' },
        { id: 'banners', label: 'Banner Beranda', icon: ImageIcon },
        { id: 'schedules', label: 'Departures / Schedule', icon: Calendar }
      ]
    },
    {
      title: 'RESERVATIONS',
      items: [
        { id: 'bookings', label: 'Bookings', icon: Ticket },
        { id: 'participants', label: 'Participants', icon: Users, badge: 'Soon', badgeType: 'soon' },
        { id: 'manifest', label: 'Manifest', icon: FileSpreadsheet, badge: 'Pilih', badgeType: 'guide' },
        { id: 'checkin', label: 'Check-in', icon: CheckSquare, badge: 'Pilih', badgeType: 'guide' }
      ]
    },
    {
      title: 'PAYMENTS',
      items: [
        { id: 'invoices', label: 'Invoices', icon: Receipt, badge: 'Soon', badgeType: 'soon' },
        { id: 'transactions', label: 'Transactions', icon: CreditCard },
        {
          id: 'verification',
          label: 'Manual Verification',
          icon: ShieldCheck,
          badge: pendingVerificationCount > 0 ? `${pendingVerificationCount}` : undefined,
          badgeType: pendingVerificationCount > 0 ? 'count' : undefined
        },
        { id: 'refunds', label: 'Refunds', icon: RotateCcw, badge: 'Soon', badgeType: 'soon' }
      ]
    },
    {
      title: 'GUIDES',
      items: [
        { id: 'guides', label: 'Tour Guides', icon: UserCheck },
        { id: 'certifications', label: 'Certifications', icon: Award, badge: 'Guide', badgeType: 'guide' },
        { id: 'competencies', label: 'Competencies', icon: Sparkles, badge: 'Soon', badgeType: 'soon' },
        { id: 'availability', label: 'Availability', icon: CalendarClock, badge: 'Guide', badgeType: 'guide' }
      ]
    }
  ];

  return (
    <aside className="admin-sidebar">
      {/* Brand Header */}
      <div className="admin-sidebar-header">
        <div className="admin-brand-icon">
          <Compass size={22} />
        </div>
        <div>
          <div className="admin-brand-title">BENDOT OPS</div>
          <span className="admin-brand-badge">Sistem Reservasi v1.0</span>
        </div>
      </div>

      {/* Navigation List */}
      <div className="admin-sidebar-nav">
        {menuGroups.map((group, idx) => (
          <div key={idx} className="nav-group">
            <div className="nav-group-title">{group.title}</div>
            <ul className="nav-menu-list">
              {group.items.map((item) => {
                const IconComponent = item.icon;
                const isActive = adminTab === item.id;

                return (
                  <li
                    key={item.id}
                    className={`nav-menu-item ${isActive ? 'active' : ''}`}
                    onClick={() => setAdminTab(item.id)}
                  >
                    <div className="nav-item-left">
                      <IconComponent size={17} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={
                          item.badgeType === 'count'
                            ? 'menu-badge-count'
                            : item.badgeType === 'guide'
                            ? 'menu-badge-guide'
                            : 'menu-badge-soon'
                        }
                      >
                        {item.badge}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        <div className="admin-user-card">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
            alt="Super Admin"
            className="admin-avatar"
          />
          <div className="admin-user-info">
            <h5>Kang Bendot Suharjo</h5>
            <p>Super Admin Operasional</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
