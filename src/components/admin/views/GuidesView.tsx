import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Guide } from '../../../types';
import { UserCheck, Award, AlertTriangle, Plus, Star, Phone, Mail, X } from 'lucide-react';

export const GuidesView: React.FC = () => {
  const { guides, addGuide, showToast } = useApp();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    specialty: 'Gunung & Trekking Ijen',
    rating: 4.95,
    certName: 'Sertifikasi BNSP Pemandu Wisata',
    certIssuer: 'BNSP LSP Pariwisata',
    certValidUntil: '2028-05-20'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      showToast('Nama dan nomor kontak guide wajib diisi.', 'warning');
      return;
    }

    addGuide({
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim() || `${formData.name.toLowerCase().replace(/\s+/g, '')}@bendottravel.com`,
      avatar: formData.avatar,
      specialty: formData.specialty,
      rating: Number(formData.rating),
      completedTrips: 0,
      certifications: [
        {
          id: `cert-${Date.now()}`,
          name: formData.certName,
          issuer: formData.certIssuer,
          validUntil: formData.certValidUntil,
          status: 'Active'
        }
      ]
    });

    setIsAddModalOpen(false);
  };

  // Find any expiring certifications
  const expiringCerts: Array<{ guideName: string; certName: string; validUntil: string }> = [];
  guides.forEach((g) => {
    g.certifications.forEach((c) => {
      if (c.status === 'Expiring Soon') {
        expiringCerts.push({
          guideName: g.name,
          certName: c.name,
          validUntil: c.validUntil
        });
      }
    });
  });

  return (
    <div>
      {/* Expiry Warning Banner if any */}
      {expiringCerts.length > 0 && (
        <div
          style={{
            padding: '14px 18px',
            borderRadius: 'var(--radius-lg)',
            background: '#fffbeb',
            border: '1px solid #fde68a',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}
        >
          <AlertTriangle size={20} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong style={{ color: '#92400e', fontSize: '0.9rem', display: 'block' }}>
              Peringatan Lisensi Guide Mendekati Masa Kedaluwarsa (&lt; 30 Hari)
            </strong>
            {expiringCerts.map((ec, i) => (
              <p key={i} style={{ fontSize: '0.825rem', color: '#b45309', marginTop: '2px' }}>
                • <strong>{ec.guideName}</strong>: {ec.certName} (Berlaku hingga: {ec.validUntil}). Harap jadwalkan resertifikasi.
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Header action */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px'
        }}
      >
        <p style={{ fontSize: '0.875rem', color: 'var(--dark-500)' }}>
          Database pemandu wisata resmi Bendot Travel, status sertifikasi BNSP/HPI, dan rekam jejak trip.
        </p>

        <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
          <Plus size={16} />
          <span>Daftarkan Pemandu Baru</span>
        </button>
      </div>

      {/* Guides Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
          gap: '20px'
        }}
      >
        {guides.map((g) => (
          <div
            key={g.id}
            style={{
              background: '#ffffff',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--dark-200)',
              boxShadow: 'var(--shadow-sm)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <img
                src={g.avatar}
                alt={g.name}
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: 'var(--radius-lg)',
                  objectFit: 'cover',
                  border: '2px solid var(--teal-600)'
                }}
              />
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--dark-900)' }}>
                  {g.name}
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--amber-600)', fontWeight: 700 }}>
                  <Star size={14} fill="#f59e0b" color="#f59e0b" />
                  <span>{g.rating} / 5.0</span>
                  <span style={{ color: 'var(--dark-400)', fontWeight: 400 }}>({g.completedTrips} Trip Selesai)</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--teal-700)', fontWeight: 600 }}>
                  {g.specialty}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.8rem', color: 'var(--dark-600)', background: 'var(--dark-50)', padding: '10px 12px', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Phone size={13} color="var(--dark-400)" />
                <span>{g.phone}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={13} color="var(--dark-400)" />
                <span>{g.email}</span>
              </div>
            </div>

            {/* Certifications list */}
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--dark-500)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                Sertifikasi & Lisensi Resmi
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {g.certifications.map((cert) => (
                  <div
                    key={cert.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.78rem',
                      padding: '6px 10px',
                      background: cert.status === 'Expiring Soon' ? '#fffbeb' : '#f8fafc',
                      borderRadius: 'var(--radius-sm)',
                      border: `1px solid ${cert.status === 'Expiring Soon' ? '#fde68a' : 'var(--dark-200)'}`
                    }}
                  >
                    <div>
                      <strong style={{ display: 'block' }}>{cert.name}</strong>
                      <span style={{ fontSize: '0.7rem', color: 'var(--dark-400)' }}>
                        Penerbit: {cert.issuer} (s.d {cert.validUntil})
                      </span>
                    </div>
                    <span
                      className={`badge ${
                        cert.status === 'Active'
                          ? 'badge-emerald'
                          : cert.status === 'Expiring Soon'
                          ? 'badge-amber'
                          : 'badge-red'
                      }`}
                      style={{ fontSize: '0.65rem' }}
                    >
                      {cert.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Register Guide Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div
            className="modal-content"
            style={{ maxWidth: '560px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3 className="modal-title">Daftarkan Pemandu Wisata Baru</h3>
              <button
                className="modal-close-btn"
                onClick={() => setIsAddModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                    Nama Lengkap Pemandu *
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    style={{ paddingLeft: '14px' }}
                    placeholder="Contoh: Kang Joko Suharso"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                      Nomor HP / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      className="form-input"
                      style={{ paddingLeft: '14px' }}
                      placeholder="0812xxxx"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                      Spesialisasi Medan
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      style={{ paddingLeft: '14px' }}
                      value={formData.specialty}
                      onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                    Nama Sertifikasi Utama
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    style={{ paddingLeft: '14px' }}
                    value={formData.certName}
                    onChange={(e) => setFormData({ ...formData, certName: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                      Lembaga Penerbit
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      style={{ paddingLeft: '14px' }}
                      value={formData.certIssuer}
                      onChange={(e) => setFormData({ ...formData, certIssuer: e.target.value })}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                      Masa Berlaku s.d.
                    </label>
                    <input
                      type="date"
                      className="form-input"
                      style={{ paddingLeft: '14px' }}
                      value={formData.certValidUntil}
                      onChange={(e) => setFormData({ ...formData, certValidUntil: e.target.value })}
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
                  <span>Simpan Data Pemandu</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
