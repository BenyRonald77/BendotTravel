import { Trip, Category, Destination, Schedule, Guide, Booking, Banner, Transaction } from '../types';

export const initialCategories: Category[] = [
  {
    id: 'cat-1',
    name: 'Gunung & Vulkanik',
    slug: 'gunung',
    description: 'Petualangan kawah aktif, lautan pasir, dan sunrise magis di puncak nusantara.',
    iconName: 'Mountain'
  },
  {
    id: 'cat-2',
    name: 'Bahari & Snorkeling',
    slug: 'bahari',
    description: 'Eksplorasi terumbu karang warna-warni, pulau tak berpenghuni, dan laut kristal.',
    iconName: 'Waves'
  },
  {
    id: 'cat-3',
    name: 'Safari & Alam Bebas',
    slug: 'safari',
    description: 'Savana luas, satwa liar eksotis, dan rimbunnya hutan tropis perawan.',
    iconName: 'Compass'
  },
  {
    id: 'cat-4',
    name: 'Budaya & Tradisi',
    slug: 'budaya',
    description: 'Mengenal kearifan lokal suku Osing, tarian tradisional, dan kuliner otentik.',
    iconName: 'Sparkles'
  },
  {
    id: 'cat-5',
    name: 'Trekking & Air Terjun',
    slug: 'trekking',
    description: 'Menyusuri aliran sungai jernih, kebun cengkeh peninggalan kolonial, dan air terjun tersembunyi.',
    iconName: 'Footprints'
  }
];

export const initialDestinations: Destination[] = [
  {
    id: 'dest-1',
    name: 'Kawah Ijen & Blue Fire',
    province: 'Jawa Timur',
    image: 'https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?auto=format&fit=crop&w=1000&q=80',
    description: 'Kawah asam terbesar di dunia dengan fenomena api biru mistis yang hanya ada dua di dunia.',
    tripCount: 4
  },
  {
    id: 'dest-2',
    name: 'Taman Nasional Baluran',
    province: 'Jawa Timur',
    image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1000&q=80',
    description: 'Savana Bekol Afrika van Java dengan kawanan banteng liar, rusa, dan elang bondol.',
    tripCount: 3
  },
  {
    id: 'dest-3',
    name: 'Gunung Bromo & Lautan Pasir',
    province: 'Jawa Timur',
    image: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1000&q=80',
    description: 'Pemandangan matahari terbit spektakuler berlatar puncak Semeru dan kaldera Bromo.',
    tripCount: 5
  },
  {
    id: 'dest-4',
    name: 'Pulau Menjangan & Tabuhan',
    province: 'Bali Barat / Banyuwangi',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80',
    description: 'Taman Nasional Bali Barat dengan underwater wall diving terbaik dan biota laut langka.',
    tripCount: 2
  },
  {
    id: 'dest-5',
    name: 'Desa Adat Kemiren',
    province: 'Jawa Timur',
    image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1000&q=80',
    description: 'Pusat kebudayaan Wong Osing asli dengan tradisi musik lesung dan kopi sangrai legendaris.',
    tripCount: 2
  }
];

export const initialTrips: Trip[] = [
  {
    id: 'trip-1',
    code: 'BND-IJEN',
    title: 'Open Trip Kawah Ijen Midnight Blue Fire & Sunrise',
    category: 'Gunung & Vulkanik',
    destination: 'Kawah Ijen & Blue Fire',
    duration: '1 Hari (Midnight)',
    price: 350000,
    quotaMin: 4,
    quotaMax: 15,
    meetingPoint: 'Basecamp Bendot Travel / Stasiun Karangasem Banyuwangi',
    image: 'https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?auto=format&fit=crop&w=1200&q=80',
    description: 'Saksikan keajaiban alam api biru (Blue Fire) Kawah Ijen yang hanya ada dua di muka bumi. Pendakian malam ditemani pemandu lokal bersertifikat, lengkap dengan masker gas respirator standar militer, tongkat trekking, dan momen matahari terbit di atas danau kawah toska.',
    highlights: [
      'Fenomena langka Blue Fire kawah belerang',
      'Golden sunrise di bibir kawah ketinggian 2.386 mdpl',
      'Masker gas respirator ganda & kacamata pelindung steril',
      'Dokumentasi foto ciamik oleh team leader'
    ],
    itinerary: [
      { time: '00.00 - 00.30', activity: 'Penjemputan di meeting point Stasiun Banyuwangi Kota / Basecamp Bendot' },
      { time: '00.30 - 01.45', activity: 'Perjalanan menuju Pos Paltuding (kaki Kawah Ijen)' },
      { time: '01.45 - 02.00', activity: 'Briefing keselamatan, pembagian masker gas dan headlamp' },
      { time: '02.00 - 04.00', activity: 'Trekking menuju bibir kawah & turun ke spot Blue Fire' },
      { time: '04.00 - 05.30', activity: 'Menyaksikan fenomena Blue Fire dan interaksi dengan penambang belerang' },
      { time: '05.30 - 06.45', activity: 'Menikmati Sunrise kawah toska & sesi foto pemandangan' },
      { time: '06.45 - 08.00', activity: 'Perjalanan turun kembali ke Pos Paltuding' },
      { time: '08.00 - 09.30', activity: 'Sarapan hangat khas lereng Ijen & perjalanan kembali ke Basecamp' }
    ],
    includes: [
      'Transportasi PP AC dari meeting point',
      'Tiket masuk resmi BKSDA Kawah Ijen & asuransi',
      'Pemandu lokal berlisensi HPI / BNSP',
      'Masker gas respirator ganda & tongkat trekking',
      'Headlamp penerangan malam',
      'Sarapan pagi dan air mineral hangat'
    ],
    excludes: [
      'Troli dorong (taksi dorong lokal jika dibutuhkan)',
      'Pengeluaran pribadi di luar paket',
      'Tip sukarela untuk pemandu'
    ],
    status: 'Published',
    rating: 4.95,
    reviewsCount: 342,
    featured: true
  },
  {
    id: 'trip-2',
    code: 'BND-BLR',
    title: 'Eksplor Taman Nasional Baluran — Little Africa in Java',
    category: 'Safari & Alam Bebas',
    destination: 'Taman Nasional Baluran',
    duration: '1 Hari Penuh',
    price: 275000,
    quotaMin: 5,
    quotaMax: 14,
    meetingPoint: 'Basecamp Bendot Banyuwangi / Area Pelabuhan Ketapang',
    image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80',
    description: 'Jelajahi keindahan savana terluas di Pulau Jawa. Rasakan atmosfer safari padang rumput khas benua Afrika, temui kawanan banteng jawa, kawanan monyet ekor panjang, rusa timor liar, hingga keindahan Pantai Bama dan jembatan hutan mangrove yang menenangkan.',
    highlights: [
      'Foto ikonik di Savana Bekol dengan latar belakang Gunung Baluran',
      'Menara pandang pemantauan kawanan banteng & satwa liar',
      'Dermaga mangrove dan Pantai Bama yang asri',
      'Mampir kuliner Nasi Tempong khas Blambangan'
    ],
    itinerary: [
      { time: '07.30 - 08.00', activity: 'Kumpul di meeting point & briefing perjalanan' },
      { time: '08.00 - 09.30', activity: 'Perjalanan menuju gerbang Taman Nasional Baluran Batangan' },
      { time: '09.30 - 11.30', activity: 'Melewati Evergreen forest & safari Savana Bekol' },
      { time: '11.30 - 12.30', activity: 'Istirahat, makan siang di kantin rimba Bama' },
      { time: '12.30 - 14.30', activity: 'Eksplor Pantai Bama & jembatan pandang hutan mangrove' },
      { time: '14.30 - 16.00', activity: 'Spotting satwa sore hari di kubangan Savana Bekol' },
      { time: '16.00 - 17.30', activity: 'Perjalanan kembali ke pusat kota Banyuwangi' }
    ],
    includes: [
      'Transportasi kendaraan ber-AC',
      'Tiket masuk resmi Taman Nasional Baluran',
      'Pemandu wisata bersertifikasi TN Baluran',
      'Makan siang lezat & air mineral',
      'Dokumentasi foto'
    ],
    excludes: [
      'Pengeluaran pribadi & jajan',
      'Sewa kano / aktivitas air di Pantai Bama'
    ],
    status: 'Published',
    rating: 4.88,
    reviewsCount: 218,
    featured: true
  },
  {
    id: 'trip-3',
    code: 'BND-BRM',
    title: 'Midnight Bromo Sunrise & Jeep Adventure 4x4',
    category: 'Gunung & Vulkanik',
    destination: 'Gunung Bromo & Lautan Pasir',
    duration: '1 Hari (Midnight)',
    price: 420000,
    quotaMin: 6,
    quotaMax: 18,
    meetingPoint: 'Rest Area Sukapura Probolinggo / Stasiun Probolinggo',
    image: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1200&q=80',
    description: 'Petualangan memacu adrenalin dengan Jeep Toyota Hardtop 4x4 menembus dinginnya malam kaldera Bromo. Menikmati lukisan langit fajar di puncak Penanjakan / Bukit Kingkong, mendaki bibir kawah aktif, berfoto di Pasir Berbisik dan hamparan Bukit Teletubbies.',
    highlights: [
      'Sunrise legendaris Penanjakan dengan panorama Mahameru',
      'Naik Jeep 4x4 melintasi lautan pasir kaldera Tengger',
      'Mendaki 250 anak tangga menuju kawah Bromo',
      'Spot foto Pasir Berbisik, Pura Poten, & Bukit Savana Teletubbies'
    ],
    itinerary: [
      { time: '01.00 - 01.30', activity: 'Titik kumpul & pengelompokan unit Jeep 4x4' },
      { time: '01.30 - 03.30', activity: 'Off-road menuju viewpoint Sunrise Bukit Kingkong / Prahu' },
      { time: '03.30 - 05.45', activity: 'Menikmati kopi hangat & momen Golden Sunrise Bromo' },
      { time: '05.45 - 08.00', activity: 'Menuju Lautan Pasir, jalan kaki/sewa kuda ke kawah Bromo & Pura Poten' },
      { time: '08.00 - 09.30', activity: 'Foto estetik di Pasir Berbisik dan Savana Bukit Teletubbies' },
      { time: '09.30 - 10.30', activity: 'Kembali ke pos Sukapura & makan pagi penutupan trip' }
    ],
    includes: [
      'Jeep 4x4 Toyota Landcruiser berlisensi resmi Paguyuban',
      'Tiket masuk TNBTS (Taman Nasional Bromo Tengger Semeru)',
      'Driver berpengalaman merangkap tour guide',
      'Air mineral & asuransi perjalanan'
    ],
    excludes: [
      'Sewa kuda ke tangga kawah Bromo',
      'Sewa jaket / sarung tangan tebal di lokasi',
      'Makan di luar jadwal'
    ],
    status: 'Published',
    rating: 4.96,
    reviewsCount: 512,
    featured: true
  },
  {
    id: 'trip-4',
    code: 'BND-MNJ',
    title: 'Snorkeling Surga Bawah Laut Menjangan & Pulau Tabuhan',
    category: 'Bahari & Snorkeling',
    destination: 'Pulau Menjangan & Tabuhan',
    duration: '1 Hari (07.30 - 17.00)',
    price: 490000,
    quotaMin: 6,
    quotaMax: 12,
    meetingPoint: 'Pantai Grand Watu Dodol (GWD) Banyuwangi',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
    description: 'Menyelami dua mutiara bahari Selat Bali dalam satu hari! Pulau Menjangan dengan keajaiban coral garden dinding karang vertikal dan ikan badut (Nemo), dilanjutkan ke Pulau Tabuhan dengan pasir putih bersih dan perairan toska yang memanjakan mata.',
    highlights: [
      'Snorkeling di Coral Garden & Sandy Slope Pulau Menjangan',
      'Bertemu penyu laut dan ratusan ikan karang tropis',
      'Eksplorasi pulau tanpa penghuni Tabuhan yang instagrammable',
      'Dokumentasi underwater profesional dengan kamera GoPro'
    ],
    itinerary: [
      { time: '07.30 - 08.00', activity: 'Registrasi di Pantai Grand Watu Dodol (GWD), fitting alat snorkeling' },
      { time: '08.00 - 09.30', activity: 'Menyeberang ke Pulau Menjangan dengan perahu wisata bermotor' },
      { time: '09.30 - 12.00', activity: 'Snorkeling spot Coral Garden & Pos 2 Menjangan' },
      { time: '12.00 - 13.00', activity: 'Makan siang box di dermaga kayu pulau Menjangan' },
      { time: '13.00 - 14.30', activity: 'Berlayar menuju Pulau Tabuhan Banyuwangi' },
      { time: '14.30 - 16.00', activity: 'Bermain pasir putih, keliling pulau Tabuhan & foto underwater' },
      { time: '16.00 - 17.00', activity: 'Kembali ke Pantai GWD, bilas air tawar & pembagian file dokumentasi' }
    ],
    includes: [
      'Perahu penyeberangan mesin ganda berstandar keselamatan',
      'Life jacket / pelampung & set masker + snorkel lengkap',
      'Tiket masuk TN Bali Barat & Pulau Tabuhan',
      'Makan siang prasmanan/box + buah segar + air mineral',
      'Dokumentasi underwater GoPro foto & video unlimited',
      'Guide pemandu snorkeling berlisensi PADI / POSSI'
    ],
    excludes: [
      'Fin / kaki katak (tersedia sewa di lokasi)',
      'Kebutuhan pribadi dan transportasi ke meeting point'
    ],
    status: 'Published',
    rating: 4.97,
    reviewsCount: 189,
    featured: true
  },
  {
    id: 'trip-5',
    code: 'BND-KMR',
    title: 'Jelajah Warisan Budaya Osing Kemiren & Kuliner Tradisional',
    category: 'Budaya & Tradisi',
    destination: 'Desa Adat Kemiren',
    duration: '1 Hari (Setengah Hari)',
    price: 220000,
    quotaMin: 4,
    quotaMax: 15,
    meetingPoint: 'Balai Desa Adat Kemiren / Sanggar Genjah Arum',
    image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1200&q=80',
    description: 'Menyelami kehangatan masyarakat asli Banyuwangi, Wong Osing. Belajar meracik kopi sangrai khas dengan wajan tanah liat, menikmati atraksi musik lesung Gedhog, berkeliling rumah tradisional tikel balung, dan mencicipi hidangan kuliner sakral Pecel Pitik.',
    highlights: [
      'Eksplorasi arsitektur rumah adat Osing berusia ratusan tahun',
      'Workshop sangrai dan seduh kopi bersama maestro kopi lokal',
      'Menyantap makan siang tradisi Pecel Pitik khas suku Osing',
      'Pertunjukan tabuhan lesung dan tarian Gandrung Banyuwangi'
    ],
    itinerary: [
      { time: '08.30 - 09.00', activity: 'Penyambutan tamu dengan wedang jahe sereh di sanggar adat' },
      { time: '09.00 - 10.30', activity: 'Keliling kampung mengenal filosofi rumah adat Tikel Balung' },
      { time: '10.30 - 12.00', activity: 'Praktik memanggang biji kopi tradisional & mencicipi seduhan kopi' },
      { time: '12.00 - 13.30', activity: 'Makan siang bersama sajian Pecel Pitik dan lauk pelengkap' },
      { time: '13.30 - 14.30', activity: 'Menyaksikan tarian barong / gandrung & interaksi budaya' }
    ],
    includes: [
      'Pemandu lokal sesepuh budaya Osing',
      'Makan siang komplit hidangan istimewa Pecel Pitik',
      'Cicipan kopi sangrai & camilan tradisional kue kucur',
      'Donasi pelestarian sanggar seni adat',
      'Souvenir bubuk kopi khas Kemiren'
    ],
    excludes: [
      'Transportasi menuju Desa Kemiren',
      'Belanja cinderamata kerajinan batik'
    ],
    status: 'Published',
    rating: 4.91,
    reviewsCount: 96,
    featured: false
  },
  {
    id: 'trip-6',
    code: 'BND-KBD',
    title: 'Trekking Hutan Hujan & Air Terjun Kembar Jagir - Kalibendo',
    category: 'Trekking & Air Terjun',
    destination: 'Kawah Ijen & Blue Fire',
    duration: '1 Hari (08.00 - 14.00)',
    price: 240000,
    quotaMin: 4,
    quotaMax: 15,
    meetingPoint: 'Basecamp Bendot / Area Perkebunan Kalibendo',
    image: 'https://images.unsplash.com/photo-1546587348-d12660c30c50?auto=format&fit=crop&w=1200&q=80',
    description: 'Rasakan kesegaran udara pegunungan dengan trekking ringan menyusuri sungai berbatu, perkebunan cengkeh dan karet peninggalan kolonial Belanda, hingga tiba di dinding tebing air terjun alami Kalibendo dan Air Terjun Kembar Jagir.',
    highlights: [
      'Trekking teduh di bawah rindangnya pohon karet & cengkeh',
      'Mandi di kolam alami air terjun mata air pegunungan',
      'Spot foto jembatan gantung peninggalan era perkebunan',
      'Kelapa muda segar di tepi aliran sungai'
    ],
    itinerary: [
      { time: '08.00 - 08.30', activity: 'Kumpul di gerbang perkebunan Kalibendo, cek kelengkapan' },
      { time: '08.30 - 10.30', activity: 'Trekking santai jalur kebun kopi, karet, dan susur sungai kecil' },
      { time: '10.30 - 12.00', activity: 'Berenang dan bersantai di Air Terjun Kalibendo yang sejuk' },
      { time: '12.00 - 13.00', activity: 'Menikmati kelapa muda & makan siang bekal daun pisang' },
      { time: '13.00 - 14.00', activity: 'Melanjutkan ke Air Terjun Jagir (Air Terjun Kembar) & selesai' }
    ],
    includes: [
      'Tiket kawasan perkebunan & perizinan wisata air terjun',
      'Tour guide pemandu jalur alam',
      'Makan siang tradisional bekal daun & kelapa muda utuh',
      'P3K standar lapangan'
    ],
    excludes: [
      'Pakaian ganti pribadi',
      'Transportasi ke lokasi'
    ],
    status: 'Published',
    rating: 4.85,
    reviewsCount: 78,
    featured: false
  }
];

export const initialGuides: Guide[] = [
  {
    id: 'guide-1',
    name: 'Kang Bendot Suharjo',
    phone: '0812-3456-7890',
    email: 'bendot.lead@bendottravel.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    specialty: 'Gunung & Blue Fire (Chief Field Leader)',
    rating: 4.98,
    completedTrips: 486,
    certifications: [
      {
        id: 'cert-1',
        name: 'Sertifikasi BNSP Pemandu Wisata Gunung Madya',
        issuer: 'BNSP / Lembaga Sertifikasi Pariwisata',
        validUntil: '2027-11-20',
        status: 'Active'
      },
      {
        id: 'cert-2',
        name: 'Sertifikat Emergency First Responder (P3K Alam Terbuka)',
        issuer: 'PMI & Basarnas',
        validUntil: '2026-10-15', // Akan segera diperbarui
        status: 'Expiring Soon'
      },
      {
        id: 'cert-3',
        name: 'Lisensi Resmi Anggota HPI Jawa Timur',
        issuer: 'Himpunan Pramuwisata Indonesia',
        validUntil: '2028-03-01',
        status: 'Active'
      }
    ]
  },
  {
    id: 'guide-2',
    name: 'Rizky Pratama (Cak Ilham)',
    phone: '0813-8899-1122',
    email: 'ilham.dive@bendottravel.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    specialty: 'Bahari, Snorkeling & Underwater Photography',
    rating: 4.95,
    completedTrips: 320,
    certifications: [
      {
        id: 'cert-4',
        name: 'PADI Rescue Diver & Skin Diving Instructor',
        issuer: 'PADI Asia Pacific',
        validUntil: '2027-08-10',
        status: 'Active'
      },
      {
        id: 'cert-5',
        name: 'Sertifikasi Pemandu Wisata Selam & Snorkeling BNSP',
        issuer: 'BNSP Kelautan',
        validUntil: '2028-01-20',
        status: 'Active'
      }
    ]
  },
  {
    id: 'guide-3',
    name: 'Bayu Samudra Adji',
    phone: '0821-4567-9900',
    email: 'bayu.wild@bendottravel.com',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=300&q=80',
    specialty: 'Naturalist Guide Safari Baluran & Bromo',
    rating: 4.92,
    completedTrips: 215,
    certifications: [
      {
        id: 'cert-6',
        name: 'Sertifikasi Pemandu Ekowisata & Satwa Liar',
        issuer: 'Kementerian Lingkungan Hidup & Kehutanan',
        validUntil: '2027-04-12',
        status: 'Active'
      }
    ]
  },
  {
    id: 'guide-4',
    name: 'Nyi Dewi Sri Rahayu',
    phone: '0857-3344-5566',
    email: 'dewi.culture@bendottravel.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    specialty: 'Storyteller Adat Osing & Gastronomi Lokal',
    rating: 4.96,
    completedTrips: 184,
    certifications: [
      {
        id: 'cert-7',
        name: 'Lisensi Pemandu Warisan Budaya Daerah',
        issuer: 'Dinas Kebudayaan & Pariwisata Kab. Banyuwangi',
        validUntil: '2028-06-30',
        status: 'Active'
      }
    ]
  }
];

export const initialSchedules: Schedule[] = [
  {
    id: 'sch-1',
    tripId: 'trip-1',
    departureDate: '2026-09-12',
    returnDate: '2026-09-12',
    quotaTotal: 15,
    quotaBooked: 13,
    guideId: 'guide-1',
    status: 'Almost Full' // Sisa 2 kursi
  },
  {
    id: 'sch-2',
    tripId: 'trip-1',
    departureDate: '2026-09-19',
    returnDate: '2026-09-19',
    quotaTotal: 15,
    quotaBooked: 6,
    guideId: 'guide-1',
    status: 'Open'
  },
  {
    id: 'sch-3',
    tripId: 'trip-2',
    departureDate: '2026-09-13',
    returnDate: '2026-09-13',
    quotaTotal: 14,
    quotaBooked: 8,
    guideId: 'guide-3',
    status: 'Open'
  },
  {
    id: 'sch-4',
    tripId: 'trip-3',
    departureDate: '2026-09-13',
    returnDate: '2026-09-13',
    quotaTotal: 18,
    quotaBooked: 18,
    guideId: 'guide-3',
    status: 'Full'
  },
  {
    id: 'sch-5',
    tripId: 'trip-4',
    departureDate: '2026-09-20',
    returnDate: '2026-09-20',
    quotaTotal: 12,
    quotaBooked: 5,
    guideId: 'guide-2',
    status: 'Open'
  },
  {
    id: 'sch-6',
    tripId: 'trip-5',
    departureDate: '2026-09-26',
    returnDate: '2026-09-26',
    quotaTotal: 15,
    quotaBooked: 4,
    guideId: 'guide-4',
    status: 'Open'
  }
];

export const initialBookings: Booking[] = [
  {
    id: 'bkg-1',
    bookingCode: 'BND-2026-X89K',
    scheduleId: 'sch-1',
    tripId: 'trip-1',
    customerName: 'Dimas Ardiansyah',
    customerEmail: 'dimas.ardian@gmail.com',
    customerPhone: '0812-9876-5432',
    totalParticipants: 2,
    participants: [
      {
        id: 'p-1',
        name: 'Dimas Ardiansyah',
        nik: '3510091204950001',
        gender: 'L',
        phone: '0812-9876-5432',
        emergencyContact: 'Ibu Ratna (0812-1111-2222)',
        checkedIn: true
      },
      {
        id: 'p-2',
        name: 'Tiara Anindita',
        nik: '3510095508960002',
        gender: 'P',
        phone: '0813-2222-3333',
        emergencyContact: 'Ibu Ratna (0812-1111-2222)',
        checkedIn: true
      }
    ],
    totalAmount: 700000,
    uniqueCode: 147,
    finalAmount: 700147,
    paymentMethod: 'BCA',
    paymentProofUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
    paymentStatus: 'Terkonfirmasi',
    verifiedBy: 'Staf Keuangan - Sarah',
    verifiedAt: '2026-09-05 14:20 WIB',
    createdAt: '2026-09-05 13:10 WIB'
  },
  {
    id: 'bkg-2',
    bookingCode: 'BND-2026-W42R',
    scheduleId: 'sch-1',
    tripId: 'trip-1',
    customerName: 'Farhan Maulana',
    customerEmail: 'farhan.m@yahoo.com',
    customerPhone: '0852-3344-7788',
    totalParticipants: 2,
    participants: [
      {
        id: 'p-3',
        name: 'Farhan Maulana',
        nik: '3201121509980003',
        gender: 'L',
        phone: '0852-3344-7788',
        emergencyContact: 'Ayah Budi (0852-0000-1111)',
        checkedIn: false
      },
      {
        id: 'p-4',
        name: 'Bagus Setyo',
        nik: '3201121803990004',
        gender: 'L',
        phone: '0852-7777-8888',
        emergencyContact: 'Ayah Budi (0852-0000-1111)',
        checkedIn: false
      }
    ],
    totalAmount: 700000,
    uniqueCode: 284,
    finalAmount: 700284,
    paymentMethod: 'Mandiri',
    paymentProofUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80',
    paymentStatus: 'Menunggu Verifikasi',
    notes: 'Sudah transfer via Mandiri Livin pukul 09.30 WIB tadi.',
    createdAt: '2026-09-06 09:35 WIB'
  },
  {
    id: 'bkg-3',
    bookingCode: 'BND-2026-Q15P',
    scheduleId: 'sch-3',
    tripId: 'trip-2',
    customerName: 'Nadia Salsabila',
    customerEmail: 'nadia.salsa@outlook.com',
    customerPhone: '0878-1234-5678',
    totalParticipants: 1,
    participants: [
      {
        id: 'p-5',
        name: 'Nadia Salsabila',
        nik: '3174056201010005',
        gender: 'P',
        phone: '0878-1234-5678',
        emergencyContact: 'Kakak Hendra (0878-9999-0000)',
        checkedIn: false
      }
    ],
    totalAmount: 275000,
    uniqueCode: 312,
    finalAmount: 275312,
    paymentMethod: 'QRIS',
    paymentStatus: 'Pending',
    createdAt: '2026-09-06 18:15 WIB'
  }
];

export const initialBanners: Banner[] = [
  {
    id: 'ban-1',
    title: 'Pesona Blue Fire & Kawah Ijen',
    subtitle: 'Keberangkatan Setiap Hari Jumat & Sabtu Malam. Kuota Terbatas!',
    tag: 'Best Seller 2026',
    image: 'https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?auto=format&fit=crop&w=1600&q=80',
    tripId: 'trip-1',
    active: true
  },
  {
    id: 'ban-2',
    title: 'Safari Savana Baluran & Pantai Bama',
    subtitle: 'Jelajahi Padang Rumput Afrika van Java Bersama Guide Ahli Satwa Liar',
    tag: 'Petualangan Keluarga',
    image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1600&q=80',
    tripId: 'trip-2',
    active: true
  },
  {
    id: 'ban-3',
    title: 'Snorkeling Surga Bawah Laut Menjangan',
    subtitle: 'Dinding Karang Spektakuler & Air Sebening Kaca. Free Dokumentasi GoPro!',
    tag: 'Favorit Bahari',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1600&q=80',
    tripId: 'trip-4',
    active: true
  }
];

export const initialTransactions: Transaction[] = [
  {
    id: 'trx-101',
    bookingId: 'bkg-1',
    bookingCode: 'BND-2026-X89K',
    customerName: 'Dimas Ardiansyah',
    amount: 700147,
    paymentMethod: 'BCA Transfer Manual',
    status: 'Success',
    date: '2026-09-05 14:20',
    type: 'Payment'
  },
  {
    id: 'trx-102',
    bookingId: 'bkg-2',
    bookingCode: 'BND-2026-W42R',
    customerName: 'Farhan Maulana',
    amount: 700284,
    paymentMethod: 'Mandiri Transfer Manual',
    status: 'Pending',
    date: '2026-09-06 09:35',
    type: 'Payment'
  }
];
