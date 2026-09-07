import React from 'react';
import { useApp } from '../../context/AppContext';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { DashboardView } from './views/DashboardView';
import { TripCatalogView } from './views/TripCatalogView';
import { SchedulesView } from './views/SchedulesView';
import { BookingsView } from './views/BookingsView';
import { ManifestView } from './views/ManifestView';
import { CheckInView } from './views/CheckInView';
import { ManualVerificationView } from './views/ManualVerificationView';
import { TransactionsView } from './views/TransactionsView';
import { GuidesView } from './views/GuidesView';
import { AvailabilityView } from './views/AvailabilityView';
import { MasterDataView } from './views/MasterDataView';

export const AdminPortal: React.FC = () => {
  const { adminTab } = useApp();

  const renderActiveView = () => {
    switch (adminTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'trips':
        return <TripCatalogView />;
      case 'schedules':
        return <SchedulesView />;
      case 'bookings':
        return <BookingsView />;
      case 'manifest':
        return <ManifestView />;
      case 'checkin':
        return <CheckInView />;
      case 'verification':
        return <ManualVerificationView />;
      case 'transactions':
        return <TransactionsView />;
      case 'guides':
      case 'certifications':
        return <GuidesView />;
      case 'availability':
        return <AvailabilityView />;
      case 'categories':
        return <MasterDataView type="categories" />;
      case 'destinations':
        return <MasterDataView type="destinations" />;
      case 'banners':
        return <MasterDataView type="banners" />;
      case 'participants':
        return <MasterDataView type="participants" />;
      case 'invoices':
        return <MasterDataView type="invoices" />;
      case 'refunds':
        return <MasterDataView type="refunds" />;
      case 'competencies':
        return <MasterDataView type="competencies" />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main-wrapper">
        <AdminHeader />
        <main className="admin-content-body">{renderActiveView()}</main>
      </div>
    </div>
  );
};
