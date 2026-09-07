export interface ItineraryItem {
  time: string;
  activity: string;
}

export interface Trip {
  id: string;
  code: string;
  title: string;
  category: string;
  destination: string;
  duration: string;
  price: number;
  quotaMin: number;
  quotaMax: number;
  meetingPoint: string;
  image: string;
  description: string;
  highlights: string[];
  itinerary: ItineraryItem[];
  includes: string[];
  excludes: string[];
  status: 'Published' | 'Draft';
  rating: number;
  reviewsCount: number;
  featured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
}

export interface Destination {
  id: string;
  name: string;
  province: string;
  image: string;
  description: string;
  tripCount: number;
}

export interface Schedule {
  id: string;
  tripId: string;
  departureDate: string; // YYYY-MM-DD
  returnDate: string;
  quotaTotal: number;
  quotaBooked: number;
  guideId: string;
  status: 'Open' | 'Almost Full' | 'Full' | 'Completed' | 'Cancelled';
}

export interface Participant {
  id: string;
  name: string;
  nik: string;
  gender: 'L' | 'P';
  phone: string;
  emergencyContact: string;
  checkedIn: boolean;
}

export interface Booking {
  id: string;
  bookingCode: string;
  scheduleId: string;
  tripId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  totalParticipants: number;
  participants: Participant[];
  totalAmount: number;
  uniqueCode: number;
  finalAmount: number;
  paymentMethod: 'BCA' | 'Mandiri' | 'BRI' | 'QRIS';
  paymentProofUrl?: string;
  paymentStatus: 'Pending' | 'Menunggu Verifikasi' | 'Terkonfirmasi' | 'Ditolak';
  verifiedBy?: string;
  verifiedAt?: string;
  rejectionReason?: string;
  notes?: string;
  createdAt: string;
}

export interface GuideCertification {
  id: string;
  name: string;
  issuer: string;
  validUntil: string;
  status: 'Active' | 'Expiring Soon' | 'Expired';
}

export interface Guide {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar: string;
  specialty: string;
  rating: number;
  completedTrips: number;
  certifications: GuideCertification[];
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  image: string;
  tripId?: string;
  active: boolean;
}

export interface Transaction {
  id: string;
  bookingId: string;
  bookingCode: string;
  customerName: string;
  amount: number;
  paymentMethod: string;
  status: 'Success' | 'Pending' | 'Failed';
  date: string;
  type: 'Payment' | 'Refund';
}
