import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Schedule } from '../../../types';
import { Plus, Calendar, AlertTriangle, Trash2, Printer, CheckSquare, X } from 'lucide-react';

export const SchedulesView: React.FC = () => {
  const {
    schedules,
    trips,
    guides,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    setAdminTab,
    setSelectedScheduleForManifestId,
    showToast
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    tripId: trips[0]?.id || '',
    departureDate: '2026-09-26',
    returnDate: '2026-09-26',
    quotaTotal: 15,
    quotaBooked: 0,
    guideId: guides[0]?.id || '',
    status: 'Open' as const
  });

  const [clashError, setClashError] = useState<string | null>(null);

  const handleOpenAdd = () => {
    setClashError(null);
    setFormData({
      tripId: trips[0]?.id || '',
      departureDate: '2026-09-27',
      returnDate: '2026-09-27',
      quotaTotal: 15,
      quotaBooked: 0,
      guideId: guides[0]?.id || '',
      status: 'Open'
    });
    setIsModalOpen(true);
  };

  const handleDateOrGuideChange = (newDate: string, newGuideId: string) => {
    setFormData((prev) => ({
      ...prev,
      departureDate: newDate,
      guideId: newGuideId
    }));

    // Live clash preview
    if (newGuideId && newDate) {
      const clash = schedules.find(
        (s) =>
          s.guideId === newGuideId &&
          s.departureDate === newDate &&
          s.status !== 'Cancelled'
      );
      if (clash) {
        const guide = guides.find((g) => g.id === newGuideId);
        const clashedTrip = trips.find((t) => t.id === clash.tripId);
        setClashError(
          `Peringatan: Pemandu ${guide?.name || 'terpilih'} telah ditugaskan pada trip "${clashedTrip?.title}" di tanggal ${newDate}!`
        );
        return;
      }
    }
    setClashError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = addSchedule({
      tripId: formData.tripId,
      departureDate: formData.departureDate,
      returnDate: formData.returnDate || formData.departureDate,
      quotaTotal: Number(formData.quotaTotal),
      quotaBooked: Number(formData.quotaBooked),
      guideId: formData.guideId,
      status: formData.status
    });

    if (!result.success) {
      setClashError(result.error || 'Terjadi bentrok jadwal pemandu!');
    } else {
      setIsModalOpen(false);
    }
  };

  const handleOpenManifest = (scheduleId: string) => {
    setSelectedScheduleForManifestId(scheduleId);
    setAdminTab('manifest');
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px'
        }}
      >
        <p style={{ fontSize: '0.875rem', color: 'var(--dark-500)' }}>
          Kelola tanggal keberangkatan open trip dan penugasan pemandu bebas bentrok jadwal.
        </p>

        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={16} />
          <span>Buat Jadwal Keberangkatan Baru</span>
        </button>
      </div>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Tanggal Berangkat</th>
              <th>Paket Trip Terkait</th>
              <th>Pemandu Ditugaskan</th>
              <th>Kapasitas & Sisa Kuota</th>
              <th>Status Jadwal</th>
              <th style={{ textAlign: 'right' }}>Aksi Operasional</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((sch) => {
              const trip = trips.find((t) => t.id === sch.tripId);
              const guide = guides.find((g) => g.id === sch.guideId);
              const remaining = sch.quotaTotal - sch.quotaBooked;

              return (
                <tr key={sch.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
                      <Calendar size={15} color="var(--teal-600)" />
                      <span>{sch.departureDate}</span>
                    </div>
                  </td>
                  <td>
                    <strong>{trip?.title || 'Trip'}</strong>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--dark-400)' }}>
                      Kode: {trip?.code} • {trip?.duration}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{guide?.name || 'Belum Ada Guide'}</div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--dark-400)' }}>
                      {guide?.phone}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: remaining <= 2 ? '#b45309' : '#047857' }}>
                      {sch.quotaBooked} terisi / {sch.quotaTotal} Total ({remaining} Kursi Tersisa)
                    </div>
                  </td>
                  <td>
                    <select
                      className="form-select"
                      style={{ padding: '4px 8px', fontSize: '0.78rem', width: 'auto' }}
                      value={sch.status}
                      onChange={(e) =>
                        updateSchedule(sch.id, { status: e.target.value as any })
                      }
                    >
                      <option value="Open">Open</option>
                      <option value="Almost Full">Almost Full</option>
                      <option value="Full">Full</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleOpenManifest(sch.id)}
                        title="Cetak Manifest"
                      >
                        <Printer size={13} />
                        <span>Manifest</span>
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ color: '#ef4444' }}
                        onClick={() => {
                          if (confirm('Hapus jadwal ini?')) {
                            deleteSchedule(sch.id);
                          }
                        }}
                        title="Hapus Jadwal"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add Schedule Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div
            className="modal-content"
            style={{ maxWidth: '580px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3 className="modal-title">Jadwalkan Keberangkatan Open Trip</h3>
              <button
                className="modal-close-btn"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {clashError && (
                  <div
                    style={{
                      padding: '12px 14px',
                      background: '#fef2f2',
                      border: '1px solid #f87171',
                      borderRadius: 'var(--radius-md)',
                      color: '#b91c1c',
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px'
                    }}
                  >
                    <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{clashError}</span>
                  </div>
                )}

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                    Pilih Paket Open Trip *
                  </label>
                  <select
                    className="form-select"
                    style={{ paddingLeft: '14px' }}
                    value={formData.tripId}
                    onChange={(e) => setFormData({ ...formData, tripId: e.target.value })}
                  >
                    {trips.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.code} — {t.title} (Rp {t.price.toLocaleString('id-ID')})
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                      Tanggal Berangkat *
                    </label>
                    <input
                      type="date"
                      className="form-input"
                      style={{ paddingLeft: '14px' }}
                      value={formData.departureDate}
                      onChange={(e) =>
                        handleDateOrGuideChange(e.target.value, formData.guideId)
                      }
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                      Tanggal Kembali
                    </label>
                    <input
                      type="date"
                      className="form-input"
                      style={{ paddingLeft: '14px' }}
                      value={formData.returnDate}
                      onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                      Kapasitas Kuota Kursi *
                    </label>
                    <input
                      type="number"
                      className="form-input"
                      style={{ paddingLeft: '14px' }}
                      value={formData.quotaTotal}
                      onChange={(e) => setFormData({ ...formData, quotaTotal: Number(e.target.value) })}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                      Status Awal
                    </label>
                    <select
                      className="form-select"
                      style={{ paddingLeft: '14px' }}
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    >
                      <option value="Open">Open (Buka Pendaftaran)</option>
                      <option value="Almost Full">Almost Full</option>
                      <option value="Full">Full (Penuh)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                    Tugaskan Pemandu Wisata (Tour Guide)
                  </label>
                  <select
                    className="form-select"
                    style={{ paddingLeft: '14px' }}
                    value={formData.guideId}
                    onChange={(e) =>
                      handleDateOrGuideChange(formData.departureDate, e.target.value)
                    }
                  >
                    {guides.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name} — {g.specialty} (⭐ {g.rating})
                      </option>
                    ))}
                  </select>
                  <span style={{ fontSize: '0.75rem', color: 'var(--dark-500)', marginTop: '4px', display: 'block' }}>
                    * Sistem otomatis mengecek jika pemandu sudah memiliki penugasan lain pada tanggal tersebut.
                  </span>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={Boolean(clashError)}
                >
                  <span>Simpan Jadwal</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
