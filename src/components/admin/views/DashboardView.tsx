import React from 'react';
import { useApp } from '../../../context/AppContext';
import {
  TrendingUp,
  CreditCard,
  Compass,
  UserCheck,
  Calendar,
  ArrowRight,
  Printer,
  CheckSquare,
  AlertCircle
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    bookings,
    trips,
    schedules,
    guides,
    transactions,
    setAdminTab,
    setSelectedScheduleForManifestId
  } = useApp();

  // Metrics
  const totalRevenue = transactions
    .filter((t) => t.status === 'Success')
    .reduce((sum, t) => sum + t.amount, 0);

  const activeTripsCount = trips.filter((t) => t.status === 'Published').length;
  const readyGuidesCount = guides.length;

  // Nearest Departures (Sorted by date)
  const sortedSchedules = [...schedules]
    .filter((s) => s.status !== 'Cancelled')
    .sort((a, b) => new Date(a.departureDate).getTime() - new Date(b.departureDate).getTime())
    .slice(0, 5);

  // 6-Month Trend Data (Simulation)
  const trendData = [
    { month: 'Apr', count: 42, label: '42 Booking' },
    { month: 'Mei', count: 68, label: '68 Booking' },
    { month: 'Jun', count: 85, label: '85 Booking' },
    { month: 'Jul', count: 120, label: '120 Booking (Liburan)' },
    { month: 'Agu', count: 98, label: '98 Booking' },
    { month: 'Sep', count: bookings.length + 75, label: `${bookings.length + 75} Booking (Berjalan)` }
  ];
  const maxTrend = Math.max(...trendData.map((d) => d.count));

  const handleOpenManifest = (scheduleId: string) => {
    setSelectedScheduleForManifestId(scheduleId);
    setAdminTab('manifest');
  };

  const handleOpenCheckIn = () => {
    setAdminTab('checkin');
  };

  return (
    <div>
      {/* 4 KPI Cards Grid */}
      <div className="kpi-grid">
        {/* KPI 1: Booking Masuk */}
        <div className="kpi-card">
          <div className="kpi-info-group">
            <p>Total Booking Masuk</p>
            <div className="kpi-value">{bookings.length} Reservasi</div>
            <div className="kpi-trend positive">
              <TrendingUp size={14} />
              <span>+18% dibanding minggu lalu</span>
            </div>
          </div>
          <div className="kpi-icon-box kpi-icon-teal">
            <TrendingUp size={24} />
          </div>
        </div>

        {/* KPI 2: Estimasi Omset Terkonfirmasi */}
        <div className="kpi-card">
          <div className="kpi-info-group">
            <p>Pendapatan Terverifikasi</p>
            <div className="kpi-value">
              Rp {(totalRevenue / 1000).toLocaleString('id-ID')}k
            </div>
            <div className="kpi-trend positive">
              <TrendingUp size={14} />
              <span>Buku besar mutasi valid</span>
            </div>
          </div>
          <div className="kpi-icon-box kpi-icon-emerald">
            <CreditCard size={24} />
          </div>
        </div>

        {/* KPI 3: Trip Aktif */}
        <div className="kpi-card">
          <div className="kpi-info-group">
            <p>Paket Trip Aktif</p>
            <div className="kpi-value">{activeTripsCount} Paket</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--dark-500)' }}>
              Siap dipesan di situs publik
            </div>
          </div>
          <div className="kpi-icon-box kpi-icon-amber">
            <Compass size={24} />
          </div>
        </div>

        {/* KPI 4: Pemandu Bertugas */}
        <div className="kpi-card">
          <div className="kpi-info-group">
            <p>Pemandu Wisata Siap</p>
            <div className="kpi-value">{readyGuidesCount} Guide</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--primary-700)' }}>
              100% Berlisensi BNSP & HPI
            </div>
          </div>
          <div className="kpi-icon-box kpi-icon-blue">
            <UserCheck size={24} />
          </div>
        </div>
      </div>

      {/* Middle Grid: 6-Month Trend Chart + Operational Focus */}
      <div className="dashboard-middle-grid">
        {/* Trend Bar Chart */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3>Tren Booking 6 Bulan Terakhir</h3>
            <span className="badge badge-emerald">Volume Reservasi</span>
          </div>
          <div className="admin-card-body">
            <div className="trend-chart-container">
              {trendData.map((d, i) => {
                const heightPercent = Math.round((d.count / maxTrend) * 100);
                return (
                  <div key={i} className="chart-bar-group">
                    <div
                      className="chart-bar"
                      style={{ height: `${heightPercent}%` }}
                    >
                      <span className="chart-tooltip">{d.label}</span>
                    </div>
                    <span className="chart-bar-label">{d.month}</span>
                  </div>
                );
              })}
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '16px',
                fontSize: '0.8rem',
                color: 'var(--dark-500)'
              }}
            >
              <span>* Puncak reservasi tercatat pada periode liburan sekolah bulan Juli.</span>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setAdminTab('bookings')}
              >
                Lihat Semua Booking <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Operations Guide Card */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3>Aksi Cepat Tim Operasional</h3>
          </div>
          <div
            className="admin-card-body"
            style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
          >
            <div
              style={{
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--dark-50)',
                border: '1px solid var(--dark-200)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <strong style={{ fontSize: '0.9rem', display: 'block' }}>Verifikasi Bukti Transfer</strong>
                <span style={{ fontSize: '0.78rem', color: 'var(--dark-500)' }}>
                  Periksa mutasi rekening & approve e-tiket
                </span>
              </div>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setAdminTab('verification')}
              >
                Buka
              </button>
            </div>

            <div
              style={{
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--dark-50)',
                border: '1px solid var(--dark-200)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <strong style={{ fontSize: '0.9rem', display: 'block' }}>Input Booking Tamu Walk-in / WA</strong>
                <span style={{ fontSize: '0.78rem', color: 'var(--dark-500)' }}>
                  Catat pesanan offline agar kuota tersinkron
                </span>
              </div>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setAdminTab('bookings')}
              >
                Input
              </button>
            </div>

            <div
              style={{
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--dark-50)',
                border: '1px solid var(--dark-200)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <strong style={{ fontSize: '0.9rem', display: 'block' }}>Boarding Check-In Meeting Point</strong>
                <span style={{ fontSize: '0.78rem', color: 'var(--dark-500)' }}>
                  Centang kehadiran penumpang hari ini
                </span>
              </div>
              <button
                className="btn btn-secondary btn-sm"
                onClick={handleOpenCheckIn}
              >
                Check-in
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Keberangkatan Terdekat Table */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3>Keberangkatan Terdekat (5 Jadwal Terdekat)</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--dark-500)' }}>
              Pantau keterisian kuota dan cetak manifest untuk perizinan BKSDA
            </p>
          </div>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setAdminTab('schedules')}
          >
            Kelola Semua Jadwal <ArrowRight size={14} />
          </button>
        </div>

        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Kode Trip</th>
                <th>Paket Open Trip</th>
                <th>Tanggal Berangkat</th>
                <th>Pemandu Ditugaskan</th>
                <th>Keterisian Kuota</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Aksi Lapangan</th>
              </tr>
            </thead>
            <tbody>
              {sortedSchedules.map((sch) => {
                const trip = trips.find((t) => t.id === sch.tripId);
                const guide = guides.find((g) => g.id === sch.guideId);
                const fillPercent = Math.min(100, Math.round((sch.quotaBooked / sch.quotaTotal) * 100));

                return (
                  <tr key={sch.id}>
                    <td>
                      <span className="badge badge-amber">{trip?.code || 'TRIP'}</span>
                    </td>
                    <td>
                      <strong>{trip?.title || 'Trip Tak Dikenal'}</strong>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--dark-400)' }}>
                        {trip?.destination}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                        <Calendar size={14} color="var(--teal-600)" />
                        <span>{sch.departureDate}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{guide?.name || 'Belum Ditugaskan'}</div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--dark-400)' }}>
                        {guide?.phone || '-'}
                      </span>
                    </td>
                    <td style={{ minWidth: '160px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                        <span>{sch.quotaBooked} / {sch.quotaTotal} Kursi</span>
                        <strong>{fillPercent}%</strong>
                      </div>
                      <div className="quota-progress-bg">
                        <div
                          className="quota-progress-fill"
                          style={{
                            width: `${fillPercent}%`,
                            background: fillPercent >= 100 ? '#ef4444' : fillPercent >= 80 ? '#f59e0b' : undefined
                          }}
                        />
                      </div>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          sch.status === 'Full'
                            ? 'badge-red'
                            : sch.status === 'Almost Full'
                            ? 'badge-amber'
                            : 'badge-emerald'
                        }`}
                      >
                        {sch.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleOpenManifest(sch.id)}
                        title="Cetak manifest resmi peserta untuk pengelola kawasan"
                      >
                        <Printer size={13} />
                        <span>Manifest</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
