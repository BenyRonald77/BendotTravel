import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Trip,
  Category,
  Destination,
  Schedule,
  Guide,
  Booking,
  Banner,
  Transaction,
  Participant
} from '../types';
import {
  initialTrips,
  initialCategories,
  initialDestinations,
  initialSchedules,
  initialGuides,
  initialBookings,
  initialBanners,
  initialTransactions
} from '../data/seedData';

export type AdminTab =
  | 'dashboard'
  | 'trips'
  | 'categories'
  | 'destinations'
  | 'banners'
  | 'schedules'
  | 'bookings'
  | 'participants'
  | 'manifest'
  | 'checkin'
  | 'invoices'
  | 'transactions'
  | 'verification'
  | 'refunds'
  | 'guides'
  | 'certifications'
  | 'competencies'
  | 'availability';

interface ToastState {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface AppContextType {
  // Data
  trips: Trip[];
  categories: Category[];
  destinations: Destination[];
  schedules: Schedule[];
  guides: Guide[];
  bookings: Booking[];
  banners: Banner[];
  transactions: Transaction[];

  // Navigation
  currentView: 'public' | 'admin';
  setCurrentView: (view: 'public' | 'admin') => void;
  adminTab: AdminTab;
  setAdminTab: (tab: AdminTab) => void;
  selectedScheduleForManifestId: string | null;
  setSelectedScheduleForManifestId: (id: string | null) => void;

  // Modals & Active selections
  selectedTripForDetail: Trip | null;
  setSelectedTripForDetail: (trip: Trip | null) => void;
  selectedTripForBooking: Trip | null;
  setSelectedTripForBooking: (trip: Trip | null) => void;
  bookingSuccessData: Booking | null;
  setBookingSuccessData: (booking: Booking | null) => void;

  // Actions
  addBooking: (
    bookingData: Omit<Booking, 'id' | 'bookingCode' | 'createdAt'>
  ) => Booking;
  submitPaymentProof: (bookingCode: string, proofUrl: string) => boolean;
  approvePayment: (bookingId: string, verifierName?: string) => void;
  rejectPayment: (bookingId: string, reason: string, verifierName?: string) => void;
  toggleParticipantCheckIn: (bookingId: string, participantId: string) => void;
  addTrip: (trip: Omit<Trip, 'id'>) => void;
  updateTrip: (id: string, updated: Partial<Trip>) => void;
  deleteTrip: (id: string) => void;
  addSchedule: (
    schedule: Omit<Schedule, 'id'>
  ) => { success: boolean; error?: string };
  updateSchedule: (id: string, updated: Partial<Schedule>) => void;
  deleteSchedule: (id: string) => void;
  addGuide: (guide: Omit<Guide, 'id'>) => void;
  updateGuide: (id: string, updated: Partial<Guide>) => void;
  resetAllData: () => void;

  // Toast
  toasts: ToastState[];
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  removeToast: (id: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // LocalStorage loaders
  const loadStored = <T,>(key: string, fallback: T): T => {
    try {
      const stored = localStorage.getItem(`bendot_travel_${key}`);
      return stored ? JSON.parse(stored) : fallback;
    } catch {
      return fallback;
    }
  };

  const [trips, setTrips] = useState<Trip[]>(() => loadStored('trips', initialTrips));
  const [categories] = useState<Category[]>(() => loadStored('categories', initialCategories));
  const [destinations] = useState<Destination[]>(() => loadStored('destinations', initialDestinations));
  const [schedules, setSchedules] = useState<Schedule[]>(() => loadStored('schedules', initialSchedules));
  const [guides, setGuides] = useState<Guide[]>(() => loadStored('guides', initialGuides));
  const [bookings, setBookings] = useState<Booking[]>(() => loadStored('bookings', initialBookings));
  const [banners] = useState<Banner[]>(() => loadStored('banners', initialBanners));
  const [transactions, setTransactions] = useState<Transaction[]>(() => loadStored('transactions', initialTransactions));

  // Navigation State
  const [currentView, setCurrentView] = useState<'public' | 'admin'>('public');
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');
  const [selectedScheduleForManifestId, setSelectedScheduleForManifestId] = useState<string | null>(null);

  // Modals
  const [selectedTripForDetail, setSelectedTripForDetail] = useState<Trip | null>(null);
  const [selectedTripForBooking, setSelectedTripForBooking] = useState<Trip | null>(null);
  const [bookingSuccessData, setBookingSuccessData] = useState<Booking | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastState[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('bendot_travel_trips', JSON.stringify(trips));
  }, [trips]);
  useEffect(() => {
    localStorage.setItem('bendot_travel_schedules', JSON.stringify(schedules));
  }, [schedules]);
  useEffect(() => {
    localStorage.setItem('bendot_travel_guides', JSON.stringify(guides));
  }, [guides]);
  useEffect(() => {
    localStorage.setItem('bendot_travel_bookings', JSON.stringify(bookings));
  }, [bookings]);
  useEffect(() => {
    localStorage.setItem('bendot_travel_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Actions
  const addBooking = (bookingData: Omit<Booking, 'id' | 'bookingCode' | 'createdAt'>): Booking => {
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const newBookingCode = `BND-2026-${randomSuffix}`;
    const newBooking: Booking = {
      ...bookingData,
      id: `bkg-${Date.now()}`,
      bookingCode: newBookingCode,
      createdAt: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) + ' WIB'
    };

    setBookings((prev) => [newBooking, ...prev]);

    // Update schedule booked count
    setSchedules((prev) =>
      prev.map((sch) => {
        if (sch.id === bookingData.scheduleId) {
          const newBooked = sch.quotaBooked + bookingData.totalParticipants;
          let newStatus = sch.status;
          if (newBooked >= sch.quotaTotal) {
            newStatus = 'Full';
          } else if (sch.quotaTotal - newBooked <= 3) {
            newStatus = 'Almost Full';
          }
          return {
            ...sch,
            quotaBooked: newBooked,
            status: newStatus
          };
        }
        return sch;
      })
    );

    // Record in transactions
    const newTrx: Transaction = {
      id: `trx-${Date.now()}`,
      bookingId: newBooking.id,
      bookingCode: newBookingCode,
      customerName: newBooking.customerName,
      amount: newBooking.finalAmount,
      paymentMethod: `${newBooking.paymentMethod} Transfer Manual`,
      status: 'Pending',
      date: new Date().toISOString().substring(0, 16).replace('T', ' '),
      type: 'Payment'
    };
    setTransactions((prev) => [newTrx, ...prev]);

    showToast(`Pemesanan berhasil! Kode Booking Anda: ${newBookingCode}`, 'success');
    return newBooking;
  };

  const submitPaymentProof = (bookingCode: string, proofUrl: string): boolean => {
    let found = false;
    setBookings((prev) =>
      prev.map((b) => {
        if (b.bookingCode.toUpperCase() === bookingCode.toUpperCase()) {
          found = true;
          return {
            ...b,
            paymentProofUrl: proofUrl,
            paymentStatus: 'Menunggu Verifikasi'
          };
        }
        return b;
      })
    );

    if (found) {
      showToast('Bukti transfer berhasil diunggah! Menunggu verifikasi tim keuangan.', 'success');
    } else {
      showToast('Kode booking tidak ditemukan. Mohon cek kembali.', 'error');
    }
    return found;
  };

  const approvePayment = (bookingId: string, verifierName: string = 'Staf Keuangan Bendot') => {
    let targetBookingCode = '';
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          targetBookingCode = b.bookingCode;
          return {
            ...b,
            paymentStatus: 'Terkonfirmasi',
            verifiedBy: verifierName,
            verifiedAt: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) + ' WIB'
          };
        }
        return b;
      })
    );

    // Update transaction
    if (targetBookingCode) {
      setTransactions((prev) =>
        prev.map((trx) =>
          trx.bookingCode === targetBookingCode ? { ...trx, status: 'Success' } : trx
        )
      );
      showToast(`Pembayaran booking ${targetBookingCode} berhasil disetujui!`, 'success');
    }
  };

  const rejectPayment = (bookingId: string, reason: string, verifierName: string = 'Staf Keuangan Bendot') => {
    let targetBookingCode = '';
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          targetBookingCode = b.bookingCode;
          return {
            ...b,
            paymentStatus: 'Ditolak',
            rejectionReason: reason,
            verifiedBy: verifierName,
            verifiedAt: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) + ' WIB'
          };
        }
        return b;
      })
    );

    if (targetBookingCode) {
      setTransactions((prev) =>
        prev.map((trx) =>
          trx.bookingCode === targetBookingCode ? { ...trx, status: 'Failed' } : trx
        )
      );
      showToast(`Pembayaran booking ${targetBookingCode} ditolak. Catatan tersimpan.`, 'warning');
    }
  };

  const toggleParticipantCheckIn = (bookingId: string, participantId: string) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          return {
            ...b,
            participants: b.participants.map((p) =>
              p.id === participantId ? { ...p, checkedIn: !p.checkedIn } : p
            )
          };
        }
        return b;
      })
    );
  };

  const addTrip = (tripData: Omit<Trip, 'id'>) => {
    const newTrip: Trip = {
      ...tripData,
      id: `trip-${Date.now()}`
    };
    setTrips((prev) => [newTrip, ...prev]);
    showToast(`Trip ${newTrip.title} berhasil ditambahkan ke katalog!`, 'success');
  };

  const updateTrip = (id: string, updated: Partial<Trip>) => {
    setTrips((prev) => prev.map((t) => (t.id === id ? { ...t, ...updated } : t)));
    showToast('Data trip berhasil diperbarui.', 'success');
  };

  const deleteTrip = (id: string) => {
    setTrips((prev) => prev.filter((t) => t.id !== id));
    showToast('Trip telah dihapus dari katalog.', 'info');
  };

  const addSchedule = (scheduleData: Omit<Schedule, 'id'>): { success: boolean; error?: string } => {
    // Clash check: is the guide assigned to another departure on the same date?
    if (scheduleData.guideId) {
      const clash = schedules.find(
        (s) =>
          s.guideId === scheduleData.guideId &&
          s.departureDate === scheduleData.departureDate &&
          s.status !== 'Cancelled'
      );
      if (clash) {
        const guide = guides.find((g) => g.id === scheduleData.guideId);
        const clashedTrip = trips.find((t) => t.id === clash.tripId);
        return {
          success: false,
          error: `Bentrok Jadwal! Pemandu ${guide?.name || 'terpilih'} sudah ditugaskan pada trip "${clashedTrip?.title || 'Trip Lain'}" di tanggal ${scheduleData.departureDate}. Silakan pilih pemandu lain.`
        };
      }
    }

    const newSchedule: Schedule = {
      ...scheduleData,
      id: `sch-${Date.now()}`
    };
    setSchedules((prev) => [...prev, newSchedule]);
    showToast('Jadwal keberangkatan baru berhasil ditambahkan.', 'success');
    return { success: true };
  };

  const updateSchedule = (id: string, updated: Partial<Schedule>) => {
    setSchedules((prev) => prev.map((s) => (s.id === id ? { ...s, ...updated } : s)));
    showToast('Jadwal keberangkatan diperbarui.', 'success');
  };

  const deleteSchedule = (id: string) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id));
    showToast('Jadwal telah dihapus.', 'info');
  };

  const addGuide = (guideData: Omit<Guide, 'id'>) => {
    const newGuide: Guide = {
      ...guideData,
      id: `guide-${Date.now()}`
    };
    setGuides((prev) => [...prev, newGuide]);
    showToast(`Pemandu ${newGuide.name} berhasil didaftarkan.`, 'success');
  };

  const updateGuide = (id: string, updated: Partial<Guide>) => {
    setGuides((prev) => prev.map((g) => (g.id === id ? { ...g, ...updated } : g)));
    showToast('Data pemandu berhasil diperbarui.', 'success');
  };

  const resetAllData = () => {
    setTrips(initialTrips);
    setSchedules(initialSchedules);
    setGuides(initialGuides);
    setBookings(initialBookings);
    setTransactions(initialTransactions);
    localStorage.clear();
    showToast('Semua data berhasil direset ke kondisi awal.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        trips,
        categories,
        destinations,
        schedules,
        guides,
        bookings,
        banners,
        transactions,
        currentView,
        setCurrentView,
        adminTab,
        setAdminTab,
        selectedScheduleForManifestId,
        setSelectedScheduleForManifestId,
        selectedTripForDetail,
        setSelectedTripForDetail,
        selectedTripForBooking,
        setSelectedTripForBooking,
        bookingSuccessData,
        setBookingSuccessData,
        addBooking,
        submitPaymentProof,
        approvePayment,
        rejectPayment,
        toggleParticipantCheckIn,
        addTrip,
        updateTrip,
        deleteTrip,
        addSchedule,
        updateSchedule,
        deleteSchedule,
        addGuide,
        updateGuide,
        resetAllData,
        toasts,
        showToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
