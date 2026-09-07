import React, { useState } from 'react';
import { Trip, Participant, Booking } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  X,
  Calendar,
  Users,
  CreditCard,
  Upload,
  CheckCircle,
  Plus,
  Trash2,
  Copy,
  ChevronRight,
  ArrowLeft,
  QrCode,
  FileCheck
} from 'lucide-react';

interface BookingModalProps {
  trip: Trip;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ trip, onClose }) => {
  const { schedules, addBooking, setBookingSuccessData, showToast } = useApp();

  const availableSchedules = schedules.filter(
    (s) => s.tripId === trip.id && s.status !== 'Cancelled' && s.quotaTotal - s.quotaBooked > 0
  );

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedScheduleId, setSelectedScheduleId] = useState<string>(
    availableSchedules[0]?.id || ''
  );

  // Booker info
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [notes, setNotes] = useState('');

  // Dynamic participants
  const [participants, setParticipants] = useState<Participant[]>([
    {
      id: `p-${Date.now()}-1`,
      name: '',
      nik: '',
      gender: 'L',
      phone: '',
      emergencyContact: '',
      checkedIn: false
    }
  ]);

  // Step 2 & 3 State
  const [paymentMethod, setPaymentMethod] = useState<'BCA' | 'Mandiri' | 'BRI' | 'QRIS'>('BCA');
  const [uniqueCode] = useState<number>(() => Math.floor(100 + Math.random() * 899));
  const [paymentProofUrl, setPaymentProofUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedSchedule = schedules.find((s) => s.id === selectedScheduleId);
  const remainingQuota = selectedSchedule ? selectedSchedule.quotaTotal - selectedSchedule.quotaBooked : 0;

  const totalAmount = trip.price * participants.length;
  const finalAmount = totalAmount + uniqueCode;

  const handleAddParticipant = () => {
    if (participants.length >= remainingQuota) {
      showToast(`Maksimal hanya dapat memesan ${remainingQuota} tiket sesuai sisa kuota!`, 'warning');
      return;
    }
    setParticipants((prev) => [
      ...prev,
      {
        id: `p-${Date.now()}-${prev.length + 1}`,
        name: '',
        nik: '',
        gender: 'L',
        phone: '',
        emergencyContact: '',
        checkedIn: false
      }
    ]);
  };

  const handleRemoveParticipant = (id: string) => {
    if (participants.length <= 1) return;
    setParticipants((prev) => prev.filter((p) => p.id !== id));
  };

  const handleParticipantChange = (id: string, field: keyof Participant, value: any) => {
    setParticipants((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  // Sync first participant name with customer name if empty
  const handleNextToStep2 = () => {
    if (!selectedScheduleId) {
      showToast('Silakan pilih tanggal jadwal keberangkatan.', 'warning');
      return;
    }
    if (!customerName.trim() || !customerPhone.trim()) {
      showToast('Mohon lengkapi nama pemesan dan nomor WhatsApp.', 'warning');
      return;
    }

    // Autofill first participant if blank
    if (participants.length > 0 && !participants[0].name.trim()) {
      handleParticipantChange(participants[0].id, 'name', customerName);
      handleParticipantChange(participants[0].id, 'phone', customerPhone);
    }

    // Validate participants
    for (let i = 0; i < participants.length; i++) {
      const p = participants[i];
      if (!p.name.trim()) {
        showToast(`Nama peserta ke-${i + 1} harus diisi.`, 'warning');
        return;
      }
    }

    setStep(2);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPaymentProofUrl(reader.result as string);
        showToast('Bukti transfer berhasil dimuat.', 'info');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUseDemoReceipt = () => {
    setPaymentProofUrl(
      'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80'
    );
    showToast('Contoh bukti struk transfer berhasil dipasang untuk simulasi demo!', 'success');
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast(`Nomor rekening ${text} berhasil disalin!`, 'info');
  };

  const handleFinalSubmit = () => {
    setIsSubmitting(true);

    try {
      const newBooking = addBooking({
        scheduleId: selectedScheduleId,
        tripId: trip.id,
        customerName,
        customerEmail: customerEmail || `${customerName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
        customerPhone,
        totalParticipants: participants.length,
        participants: participants.map((p, idx) => ({
          ...p,
          name: p.name || `Peserta ${idx + 1}`,
          nik: p.nik || `35100${Math.floor(1000000000 + Math.random() * 9000000000)}`,
          phone: p.phone || customerPhone,
          emergencyContact: p.emergencyContact || `Keluarga (${customerPhone})`
        })),
        totalAmount,
        uniqueCode,
        finalAmount,
        paymentMethod,
        paymentProofUrl: paymentProofUrl || undefined,
        paymentStatus: paymentProofUrl ? 'Menunggu Verifikasi' : 'Pending',
        notes: notes || undefined
      });

      setBookingSuccessData(newBooking);
      onClose();
    } catch (err) {
      showToast('Terjadi kesalahan saat memproses booking.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '720px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div>
            <span className="badge badge-emerald" style={{ marginBottom: '4px' }}>
              Booking Online Resmi
            </span>
            <h3 className="modal-title">{trip.title}</h3>
          </div>
          <button onClick={onClose} className="modal-close-btn" aria-label="Tutup">
            <X size={20} />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="booking-steps-bar">
          <div className={`step-indicator ${step === 1 ? 'active' : step > 1 ? 'completed' : ''}`}>
            <span className="step-num">1</span>
            <span>Data Peserta</span>
          </div>
          <ChevronRight size={14} color="var(--dark-300)" />
          <div className={`step-indicator ${step === 2 ? 'active' : step > 2 ? 'completed' : ''}`}>
            <span className="step-num">2</span>
            <span>Pembayaran & Rekening</span>
          </div>
          <ChevronRight size={14} color="var(--dark-300)" />
          <div className={`step-indicator ${step === 3 ? 'active' : ''}`}>
            <span className="step-num">3</span>
            <span>Unggah Bukti Bayar</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* STEP 1: Participants and Schedule */}
          {step === 1 && (
            <div>
              {/* Schedule Select */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: '8px' }}>
                  Pilih Tanggal Keberangkatan
                </label>
                {availableSchedules.length === 0 ? (
                  <div style={{ padding: '14px', background: '#fef2f2', color: '#b91c1c', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
                    Mohon maaf, semua kuota jadwal saat ini sedang penuh. Silakan hubungi admin via WhatsApp untuk jadwal tambahan.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {availableSchedules.map((sch) => {
                      const left = sch.quotaTotal - sch.quotaBooked;
                      return (
                        <label
                          key={sch.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '12px 16px',
                            borderRadius: 'var(--radius-md)',
                            border: `2px solid ${selectedScheduleId === sch.id ? 'var(--teal-600)' : 'var(--dark-200)'}`,
                            background: selectedScheduleId === sch.id ? 'var(--primary-50)' : '#ffffff',
                            cursor: 'pointer'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <input
                              type="radio"
                              name="scheduleOption"
                              checked={selectedScheduleId === sch.id}
                              onChange={() => setSelectedScheduleId(sch.id)}
                            />
                            <div>
                              <strong style={{ fontSize: '0.925rem' }}>{sch.departureDate}</strong>
                              <span style={{ fontSize: '0.75rem', color: 'var(--dark-500)', display: 'block' }}>
                                Titik Kumpul: {trip.meetingPoint}
                              </span>
                            </div>
                          </div>
                          <span className={`badge ${left <= 3 ? 'badge-amber' : 'badge-emerald'}`}>
                            Sisa {left} Kursi
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Lead Booker Form */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px', borderBottom: '1px solid var(--dark-200)', paddingBottom: '6px' }}>
                  Informasi Kontak Pemesan (Ketua Rombongan)
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      style={{ paddingLeft: '14px' }}
                      placeholder="Contoh: Dimas Ardiansyah"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                      Nomor WhatsApp Aktif *
                    </label>
                    <input
                      type="tel"
                      className="form-input"
                      style={{ paddingLeft: '14px' }}
                      placeholder="Contoh: 081234567890"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                    />
                  </div>
                </div>
                <div style={{ marginTop: '10px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                    Email (Opsional untuk E-Tiket)
                  </label>
                  <input
                    type="email"
                    className="form-input"
                    style={{ paddingLeft: '14px' }}
                    placeholder="nama@email.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Dynamic Participants Manifest Form */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>
                    Daftar Identitas Peserta ({participants.length} Orang)
                  </h4>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={handleAddParticipant}
                    style={{ borderColor: 'var(--teal-500)', color: 'var(--teal-700)' }}
                  >
                    <Plus size={14} />
                    <span>Tambah Peserta</span>
                  </button>
                </div>

                {participants.map((p, index) => (
                  <div key={p.id} className="participant-card-form">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--teal-800)' }}>
                        Peserta #{index + 1} {index === 0 ? '(Pemesan)' : ''}
                      </span>
                      {participants.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveParticipant(p.id)}
                          style={{ color: '#ef4444', padding: '4px' }}
                          title="Hapus peserta"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>

                    <div className="participant-form-grid">
                      <div>
                        <input
                          type="text"
                          className="form-input"
                          style={{ paddingLeft: '12px', fontSize: '0.85rem' }}
                          placeholder="Nama Sesuai KTP / Paspor *"
                          value={p.name}
                          onChange={(e) => handleParticipantChange(p.id, 'name', e.target.value)}
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          className="form-input"
                          style={{ paddingLeft: '12px', fontSize: '0.85rem' }}
                          placeholder="NIK KTP (16 Digit untuk Manifest BKSDA)"
                          value={p.nik}
                          maxLength={16}
                          onChange={(e) => handleParticipantChange(p.id, 'nik', e.target.value)}
                        />
                      </div>
                      <div>
                        <select
                          className="form-select"
                          style={{ paddingLeft: '12px', fontSize: '0.85rem' }}
                          value={p.gender}
                          onChange={(e) => handleParticipantChange(p.id, 'gender', e.target.value)}
                        >
                          <option value="L">Laki-laki (L)</option>
                          <option value="P">Perempuan (P)</option>
                        </select>
                      </div>
                      <div>
                        <input
                          type="text"
                          className="form-input"
                          style={{ paddingLeft: '12px', fontSize: '0.85rem' }}
                          placeholder="Kontak Darurat (Keluarga/Hubungan)"
                          value={p.emergencyContact}
                          onChange={(e) => handleParticipantChange(p.id, 'emergencyContact', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Cost Summary & Bank Transfer */}
          {step === 2 && (
            <div>
              <div
                style={{
                  background: 'var(--dark-50)',
                  border: '1px solid var(--dark-200)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '20px',
                  marginBottom: '20px'
                }}
              >
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--dark-500)', textTransform: 'uppercase', marginBottom: '12px' }}>
                  Rincian Biaya Pemesanan
                </h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                  <span>{trip.title} ({participants.length}x @ Rp {trip.price.toLocaleString('id-ID')})</span>
                  <strong>Rp {totalAmount.toLocaleString('id-ID')}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--teal-700)' }}>
                  <span>Kode Verifikasi Unik (Otomatis)</span>
                  <strong>+ Rp {uniqueCode}</strong>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingTop: '12px',
                    borderTop: '2px dashed var(--dark-300)',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: 'var(--dark-900)'
                  }}
                >
                  <span>TOTAL TRANSFER</span>
                  <span style={{ color: 'var(--teal-700)' }}>Rp {finalAmount.toLocaleString('id-ID')}</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--amber-600)', marginTop: '8px' }}>
                  * PENTING: Mohon transfer tepat hingga 3 digit terakhir (Rp {finalAmount.toLocaleString('id-ID')}) untuk mempercepat verifikasi otomatis staf Bendot Travel.
                </p>
              </div>

              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px' }}>
                Pilih Rekening Resmi Bendot Travel
              </h4>

              {/* Bank Selection */}
              <div
                className="bank-account-box"
                style={{ borderColor: paymentMethod === 'BCA' ? 'var(--teal-600)' : undefined }}
                onClick={() => setPaymentMethod('BCA')}
              >
                <div className="bank-info">
                  <h4>Bank BCA (Transfer Manual)</h4>
                  <div className="bank-acc-number">8935-0129-88</div>
                  <small style={{ color: 'var(--dark-500)' }}>a.n. PT BENDOT PETUALANGAN NUSANTARA</small>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy('8935012988');
                  }}
                >
                  <Copy size={13} /> Salin
                </button>
              </div>

              <div
                className="bank-account-box"
                style={{ borderColor: paymentMethod === 'Mandiri' ? 'var(--teal-600)' : undefined }}
                onClick={() => setPaymentMethod('Mandiri')}
              >
                <div className="bank-info">
                  <h4>Bank Mandiri (Transfer Manual)</h4>
                  <div className="bank-acc-number">143-00-998877-1</div>
                  <small style={{ color: 'var(--dark-500)' }}>a.n. BENDOT OPEN TRIP</small>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy('143009988771');
                  }}
                >
                  <Copy size={13} /> Salin
                </button>
              </div>

              <div
                className="bank-account-box"
                style={{ borderColor: paymentMethod === 'QRIS' ? 'var(--teal-600)' : undefined }}
                onClick={() => setPaymentMethod('QRIS')}
              >
                <div className="bank-info">
                  <h4>QRIS Semua Pembayaran (Gopay / OVO / ShopeePay / BCA Mobile)</h4>
                  <small style={{ color: 'var(--dark-500)' }}>Scan QRIS Resmi Bendot Travel Nusantara</small>
                </div>
                <span className="badge badge-emerald">Instant QRIS</span>
              </div>
            </div>
          )}

          {/* STEP 3: Upload Proof */}
          {step === 3 && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '6px' }}>
                  Unggah Bukti Transfer Pembayaran
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--dark-500)' }}>
                  Total yang harus dibayarkan: <strong style={{ color: 'var(--teal-700)' }}>Rp {finalAmount.toLocaleString('id-ID')}</strong>
                </p>
              </div>

              {paymentProofUrl ? (
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                  <div
                    style={{
                      width: '200px',
                      height: '240px',
                      margin: '0 auto 12px',
                      borderRadius: 'var(--radius-lg)',
                      overflow: 'hidden',
                      border: '2px solid var(--primary-500)'
                    }}
                  >
                    <img
                      src={paymentProofUrl}
                      alt="Bukti Transfer"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setPaymentProofUrl('')}
                  >
                    Ganti Foto Bukti
                  </button>
                </div>
              ) : (
                <div className="proof-upload-area" onClick={() => document.getElementById('proofFileInput')?.click()}>
                  <Upload size={32} color="var(--teal-600)" style={{ margin: '0 auto 10px' }} />
                  <h5 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '4px' }}>
                    Klik untuk Pilih File Bukti Transfer
                  </h5>
                  <p style={{ fontSize: '0.8rem', color: 'var(--dark-400)' }}>
                    Format JPG, PNG, atau tangkapan layar m-banking
                  </p>
                  <input
                    id="proofFileInput"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleFileUpload}
                  />
                </div>
              )}

              {/* Demo Helper Button */}
              <div style={{ marginTop: '16px', textAlign: 'center' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleUseDemoReceipt}
                  style={{ background: 'var(--dark-100)', fontSize: '0.8rem' }}
                >
                  <FileCheck size={14} />
                  <span>Pasang Contoh Bukti Transfer Demo (Cepat)</span>
                </button>
              </div>

              {/* Notes */}
              <div style={{ marginTop: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                  Catatan Khusus (Opsional)
                </label>
                <textarea
                  className="form-input"
                  style={{ paddingLeft: '14px', height: '70px', resize: 'none' }}
                  placeholder="Misal: Permintaan makanan vegetarian, titik penjemputan khusus hotel, dll."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          {step > 1 ? (
            <button
              className="btn btn-secondary"
              onClick={() => setStep((prev) => (prev - 1) as any)}
            >
              <ArrowLeft size={16} />
              <span>Kembali</span>
            </button>
          ) : (
            <button className="btn btn-secondary" onClick={onClose}>
              Batal
            </button>
          )}

          {step < 3 ? (
            <button className="btn btn-primary" onClick={step === 1 ? handleNextToStep2 : () => setStep(3)}>
              <span>Lanjut ke Langkah {step + 1}</span>
              <ChevronRight size={16} />
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={handleFinalSubmit}
              disabled={isSubmitting}
            >
              <CheckCircle size={16} />
              <span>{isSubmitting ? 'Memproses...' : 'Konfirmasi & Terbitkan Tiket'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
