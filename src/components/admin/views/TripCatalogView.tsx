import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Trip } from '../../../types';
import { Plus, Edit2, Trash2, Eye, EyeOff, Check, X, Search } from 'lucide-react';

export const TripCatalogView: React.FC = () => {
  const { trips, addTrip, updateTrip, deleteTrip, showToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    category: 'Gunung & Vulkanik',
    destination: 'Kawah Ijen & Blue Fire',
    duration: '1 Hari (Midnight)',
    price: 350000,
    quotaMin: 4,
    quotaMax: 15,
    meetingPoint: 'Basecamp Bendot Banyuwangi',
    image: 'https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?auto=format&fit=crop&w=1200&q=80',
    description: '',
    highlights: 'Pemandangan spektakuler\nGuide profesional\nDokumentasi foto',
    includes: 'Transportasi PP AC\nTiket masuk wisata resmi\nTour guide berlisensi',
    excludes: 'Pengeluaran pribadi\nTip sukarela guide'
  });

  const handleOpenAdd = () => {
    setEditingTrip(null);
    setFormData({
      code: `BND-${Math.random().toString(36).substring(2, 5).toUpperCase()}`,
      title: '',
      category: 'Gunung & Vulkanik',
      destination: 'Kawah Ijen & Blue Fire',
      duration: '1 Hari (Midnight)',
      price: 350000,
      quotaMin: 4,
      quotaMax: 15,
      meetingPoint: 'Basecamp Bendot Banyuwangi',
      image: 'https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?auto=format&fit=crop&w=1200&q=80',
      description: 'Deskripsi lengkap paket petualangan open trip.',
      highlights: 'Pemandangan spektakuler\nGuide profesional\nDokumentasi foto',
      includes: 'Transportasi PP AC\nTiket masuk wisata resmi\nTour guide berlisensi',
      excludes: 'Pengeluaran pribadi\nTip sukarela guide'
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (trip: Trip) => {
    setEditingTrip(trip);
    setFormData({
      code: trip.code,
      title: trip.title,
      category: trip.category,
      destination: trip.destination,
      duration: trip.duration,
      price: trip.price,
      quotaMin: trip.quotaMin,
      quotaMax: trip.quotaMax,
      meetingPoint: trip.meetingPoint,
      image: trip.image,
      description: trip.description,
      highlights: trip.highlights.join('\n'),
      includes: trip.includes.join('\n'),
      excludes: trip.excludes.join('\n')
    });
    setIsAddModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.code.trim()) {
      showToast('Nama trip dan kode trip wajib diisi!', 'warning');
      return;
    }

    const payload = {
      code: formData.code.trim().toUpperCase(),
      title: formData.title.trim(),
      category: formData.category,
      destination: formData.destination,
      duration: formData.duration,
      price: Number(formData.price),
      quotaMin: Number(formData.quotaMin),
      quotaMax: Number(formData.quotaMax),
      meetingPoint: formData.meetingPoint,
      image: formData.image,
      description: formData.description,
      highlights: formData.highlights.split('\n').map((s) => s.trim()).filter(Boolean),
      includes: formData.includes.split('\n').map((s) => s.trim()).filter(Boolean),
      excludes: formData.excludes.split('\n').map((s) => s.trim()).filter(Boolean),
      itinerary: editingTrip?.itinerary || [
        { time: '00.00 - 01.30', activity: 'Kumpul di titik kumpul meeting point' },
        { time: '01.30 - 05.00', activity: 'Aktivitas petualangan dan eksplorasi destinasi' },
        { time: '05.00 - 08.00', activity: 'Momen sunrise, sarapan, dan kembali ke basecamp' }
      ],
      status: editingTrip?.status || ('Published' as const),
      rating: editingTrip?.rating || 4.9,
      reviewsCount: editingTrip?.reviewsCount || 10
    };

    if (editingTrip) {
      updateTrip(editingTrip.id, payload);
    } else {
      addTrip(payload);
    }

    setIsAddModalOpen(false);
  };

  const filteredTrips = trips.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.destination.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* Top Action Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '20px'
        }}
      >
        <div style={{ position: 'relative', width: '340px' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--dark-400)'
            }}
          />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '38px' }}
            placeholder="Cari trip atau kode..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={16} />
          <span>Tambah Paket Trip Baru</span>
        </button>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Kode</th>
              <th>Nama Paket Trip</th>
              <th>Kategori & Destinasi</th>
              <th>Durasi</th>
              <th>Harga / Pax</th>
              <th>Kapasitas</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredTrips.map((trip) => (
              <tr key={trip.id}>
                <td>
                  <span className="badge badge-amber">{trip.code}</span>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                      src={trip.image}
                      alt={trip.title}
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: 'var(--radius-md)',
                        objectFit: 'cover'
                      }}
                    />
                    <div>
                      <strong>{trip.title}</strong>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--dark-400)' }}>
                        Meeting Point: {trip.meetingPoint}
                      </span>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="badge badge-emerald" style={{ marginBottom: '4px' }}>
                    {trip.category}
                  </span>
                  <div style={{ fontSize: '0.78rem', color: 'var(--dark-500)' }}>
                    {trip.destination}
                  </div>
                </td>
                <td>{trip.duration}</td>
                <td style={{ fontWeight: 700, color: 'var(--dark-900)' }}>
                  Rp {trip.price.toLocaleString('id-ID')}
                </td>
                <td>{trip.quotaMin} - {trip.quotaMax} Orang</td>
                <td>
                  <button
                    onClick={() =>
                      updateTrip(trip.id, {
                        status: trip.status === 'Published' ? 'Draft' : 'Published'
                      })
                    }
                    className={`badge ${trip.status === 'Published' ? 'badge-emerald' : 'badge-gray'}`}
                    style={{ cursor: 'pointer' }}
                    title="Klik untuk mengubah status publish / draft"
                  >
                    {trip.status}
                  </button>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleOpenEdit(trip)}
                      title="Edit trip"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ color: '#ef4444' }}
                      onClick={() => {
                        if (confirm(`Hapus paket trip "${trip.title}"?`)) {
                          deleteTrip(trip.id);
                        }
                      }}
                      title="Hapus trip"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div
            className="modal-content"
            style={{ maxWidth: '720px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3 className="modal-title">
                {editingTrip ? 'Edit Paket Trip' : 'Tambah Paket Trip Baru'}
              </h3>
              <button
                className="modal-close-btn"
                onClick={() => setIsAddModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                      Kode Trip *
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      style={{ paddingLeft: '14px', textTransform: 'uppercase' }}
                      placeholder="Contoh: BND-IJEN"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                      Nama Paket Trip *
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      style={{ paddingLeft: '14px' }}
                      placeholder="Contoh: Open Trip Kawah Ijen Midnight Blue Fire"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                      Kategori
                    </label>
                    <select
                      className="form-select"
                      style={{ paddingLeft: '14px' }}
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="Gunung & Vulkanik">Gunung & Vulkanik</option>
                      <option value="Bahari & Snorkeling">Bahari & Snorkeling</option>
                      <option value="Safari & Alam Bebas">Safari & Alam Bebas</option>
                      <option value="Budaya & Tradisi">Budaya & Tradisi</option>
                      <option value="Trekking & Air Terjun">Trekking & Air Terjun</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                      Harga per Orang (Rp) *
                    </label>
                    <input
                      type="number"
                      className="form-input"
                      style={{ paddingLeft: '14px' }}
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                      Durasi
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      style={{ paddingLeft: '14px' }}
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                      Kapasitas Maksimal (Orang)
                    </label>
                    <input
                      type="number"
                      className="form-input"
                      style={{ paddingLeft: '14px' }}
                      value={formData.quotaMax}
                      onChange={(e) => setFormData({ ...formData, quotaMax: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                      Titik Kumpul (Meeting Point)
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      style={{ paddingLeft: '14px' }}
                      value={formData.meetingPoint}
                      onChange={(e) => setFormData({ ...formData, meetingPoint: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                    URL Foto Utama (Unsplash / Gambar)
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    style={{ paddingLeft: '14px' }}
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                    Deskripsi Ringkas
                  </label>
                  <textarea
                    className="form-input"
                    style={{ paddingLeft: '14px', height: '70px', resize: 'none' }}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                      Fasilitas Termasuk (Satu per baris)
                    </label>
                    <textarea
                      className="form-input"
                      style={{ paddingLeft: '14px', height: '90px', resize: 'none', fontSize: '0.8rem' }}
                      value={formData.includes}
                      onChange={(e) => setFormData({ ...formData, includes: e.target.value })}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                      Tidak Termasuk (Satu per baris)
                    </label>
                    <textarea
                      className="form-input"
                      style={{ paddingLeft: '14px', height: '90px', resize: 'none', fontSize: '0.8rem' }}
                      value={formData.excludes}
                      onChange={(e) => setFormData({ ...formData, excludes: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  <span>{editingTrip ? 'Simpan Perubahan' : 'Terbitkan Trip'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
