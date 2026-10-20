import { Product, ProductCategory, MotorcycleBrand, StoreSettings } from '../types';

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  storeName: 'GO OTOMOTIF',
  whatsappNumber: '6281234567890',
  location: 'Pusat Distribusi & Training Center, Indonesia',
  addressDetail: 'Jl. Raya Industri Otomotif No. 12B (Kompleks Ruko Sentra Motor), Jakarta / Bekasi',
  tagline: 'Manajemen Sparepart Motor, Paket Buka Bengkel & Pelatihan Montir Motor Profesional',
  operatingHours: 'Senin - Sabtu: 08.00 - 17.30 WIB | Konsultasi WhatsApp 24 Jam',
  googleMapsUrl: 'https://maps.google.com',
};

export const MOTORCYCLE_BRANDS_LIST: MotorcycleBrand[] = [
  'Semua Merk',
  'Honda',
  'Yamaha',
  'Suzuki',
  'Kawasaki',
  'Universal / Semua Motor'
];

export const PRODUCTS_DATA: Product[] = [
  // 1. Training Montir Injeksi
  {
    id: 'trn-inj-01',
    name: 'Training Montir Injeksi Modern & Diagnosa Scanner OBD-2',
    sku: 'GO-TRN-INJ',
    partNumber: 'GO-ACD-INJ01',
    barcode: '8997012300018',
    category: 'Program Training Montir',
    itemType: 'training',
    brand: 'GO OTOMOTIF Academy',
    compatibleBrands: ['Honda', 'Yamaha', 'Suzuki', 'Kawasaki', 'Universal / Semua Motor'],
    compatibleModels: ['Beat FI/ESP', 'Vario 125/160', 'Scoopy', 'NMAX/Aerox Connected', 'PCX', 'Mio M3'],
    price: 2850000,
    originalPrice: 3500000,
    stockStatus: 'open_batch',
    batchSchedule: 'Batch 14: Pendaftaran Buka (Mulai Senin Depan)',
    rating: 5.0,
    reviewsCount: 142,
    image: '/src/assets/images/training_injection_scanner_1792342707406.jpg',
    description: 'Pelatihan teknisi motor injeksi dari nol sampai mahir membaca kode error sensor, reset ECM/ECU, setting altitude, kalibrasi Throttle Body, hingga trik mengatasi motor mogok injeksi. 80% praktek langsung dengan motor latihan Honda, Yamaha, dan alat scanner modern.',
    highlights: [
      '80% Praktek Langsung + 20% Teori Terapan',
      'Praktek menggunakan Scanner Motor Injeksi Digital OBD-2',
      'Termasuk Sertifikat Kelulusan Resmi & Modul Eksklusif',
      'Bimbingan konsultasi troubleshooting kerusakan seumur hidup via grup alumni'
    ],
    specs: {
      duration: '14 Hari Intensif (Senin - Sabtu 09.00 - 16.00 WIB)',
      curriculum: 'Sistem EFI, Sensor TPS/EOT/O2, Injektor, Fuel Pump, Reset ECM, Scanner OBD2',
      certificate: 'Sertifikat Kelulusan Resmi GO OTOMOTIF',
      partNumber: 'GO-ACD-INJ01',
      origin: 'Training Center GO OTOMOTIF',
      warranty: 'Jaminan Mengulang GRATIS jika belum paham'
    },
    variants: {
      name: 'Pilihan Waktu Kelas',
      options: ['Kelas Reguler Intensif (14 Hari Penuh)', 'Kelas Akhir Pekan (Sabtu - Minggu 4 Minggu)', 'Kelas Privat 1-on-1 dengan Instruktur']
    },
    featured: true,
    tags: ['training', 'kursus montir', 'injeksi', 'scanner obd2', 'mekanik motor', 'academy']
  },

  // 2. Paket Buka Usaha Bengkel Motor
  {
    id: 'pkg-bengkel-01',
    name: 'Paket Buka Usaha Bengkel Motor Pemula (120+ Item Fast-Moving)',
    sku: 'GO-PKG-BENGKEL',
    partNumber: 'GO-MOD-PKG120',
    barcode: '8997012300025',
    category: 'Paket Buka Usaha Bengkel',
    itemType: 'package',
    brand: 'GO OTOMOTIF Supply',
    compatibleBrands: ['Honda', 'Yamaha', 'Suzuki', 'Universal / Semua Motor'],
    compatibleModels: ['Semua Motor Matic, Bebek & Sport Populer di Indonesia'],
    price: 5500000,
    originalPrice: 6500000,
    stockStatus: 'ready',
    rating: 4.9,
    reviewsCount: 78,
    image: '/src/assets/images/product_paket_buka_bengkel_1792342707445.jpg',
    description: 'Solusi lengkap bagi Anda yang ingin memulai bisnis toko spare part atau bengkel motor mandiri. Paket terdiri dari 120+ jenis suku cadang fast-moving paling laris (oli, kampas rem, busi, ban dalam, v-belt, roller, kabel, sekring) + bonus software manajemen stok bengkel.',
    highlights: [
      'Kombinasi 120+ jenis part fast-moving terbukti cepat berputar (margin 30-50%)',
      'Termasuk Software POS Kasir & Pembukuan Stok Spare Part',
      'Bonus Banner Toko / Spanduk Nama Bengkel Anda',
      'Daftar kontak supplier resmi tangan pertama untuk repeat order harga pabrik'
    ],
    specs: {
      capacity: 'Total 120+ Item Suku Cadang (Siap Pajang)',
      partNumber: 'GO-MOD-PKG120',
      moq: '1 Paket Buka Bengkel',
      warranty: 'Garansi Retur Part jika ada cacat pabrik',
      origin: 'Gudang GO OTOMOTIF Jakarta/Bekasi'
    },
    variants: {
      name: 'Pilihan Paket Usaha',
      options: ['Paket Pemula Rp 5.5 Juta (Fast Moving)', 'Paket Lengkap Rp 10 Juta (+ Tool Set Mekanik)', 'Paket Grosir Toko Rp 20 Juta (Katalog Lengkap)']
    },
    featured: true,
    tags: ['paket buka bengkel', 'grosir sparepart', 'manajemen stok', 'usaha bengkel', 'modal bengkel']
  },

  // 3. V-Belt & Roller Kit CVT BeAT K44
  {
    id: 'prt-cvt-03',
    name: 'Set V-Belt & Roller CVT Matic Honda BeAT FI / Scoopy / Vario 110',
    sku: 'GO-PRT-CVT01',
    partNumber: '23100-K44-V01',
    barcode: '8992775102014',
    category: 'CVT & Transmisi Matic',
    itemType: 'sparepart',
    brand: 'AHM Genuine Parts / OEM',
    compatibleBrands: ['Honda'],
    compatibleModels: ['Honda Beat FI ESP', 'Scoopy ESP', 'Vario 110 ESP', 'Beat Street'],
    price: 135000,
    originalPrice: 165000,
    stockStatus: 'ready',
    rating: 4.9,
    reviewsCount: 218,
    image: '/src/assets/images/product_cvt_matic_roller_belt_1792342707337.jpg',
    description: 'Drive Belt dan Roller Set standar original untuk motor matic Honda ESP. Terbuat dari karet sintetis EPDM bertulang benang poliester tahan gesekan suhu tinggi. Menjamin akselerasi responsif dan bebas slip pada putaran mesin tinggi.',
    highlights: [
      'Kode Part OEM Asli 23100-K44-V01',
      'Termasuk 1 pcs V-Belt + 6 pcs Roller standar presisi 15 gram',
      'Bahan EPDM anti retak dan tahan panas hingga 120°C',
      'Umur pakai teruji hingga 24.000 KM'
    ],
    specs: {
      partNumber: '23100-K44-V01',
      origin: 'Honda Genuine Parts Standard',
      warranty: 'Garansi Original 100%',
      durability: '20.000 - 24.000 KM'
    },
    variants: {
      name: 'Pilihan Varian',
      options: ['Standar Pabrik (Roller 15g)', 'Akselerasi Ringan (Roller 12g)', 'Touring/Beban (Roller 13g)']
    },
    featured: true,
    tags: ['v-belt', 'roller', 'cvt matic', 'sparepart motor', 'beat', 'k44', 'honda']
  },

  // 4. Busi Iridium NGK Laser
  {
    id: 'prt-spk-09',
    name: 'Busi Iridium NGK Laser Spark Plug CPR9EAIX-9',
    sku: 'NGK-CPR9-IRID',
    partNumber: 'CPR9EAIX-9',
    barcode: '8994512093817',
    category: 'Sparepart Motor Fast-Moving',
    itemType: 'sparepart',
    brand: 'NGK Spark Plugs Japan',
    compatibleBrands: ['Honda', 'Yamaha'],
    compatibleModels: ['Vario 125/150/160', 'PCX 150/160', 'ADV 150/160', 'NMAX 155', 'Aerox 155', 'Sonic 150R', 'CB150R'],
    price: 98000,
    originalPrice: 120000,
    stockStatus: 'ready',
    rating: 5.0,
    reviewsCount: 310,
    image: '/src/assets/images/product_iridium_spark_plugs_1792341141329.jpg',
    description: 'Busi elektroda jarum Iridium 0.6mm presisi tinggi. Menghasilkan percikan api biru yang terfokus, pembakaran bensin jauh lebih sempurna, tarikan spontan dan konsumsi bahan bakar lebih irit. Tahan panas hingga 2.500°C.',
    highlights: [
      'Elektroda ujung runcing 0.6mm berbahan Iridium murni',
      'Starter motor di pagi hari langsung hidup responsif',
      'Daya tahan 3x lebih lama dari busi nikel standar (hingga 40.000 KM)',
      'Anti kerak karbon pada ruang bakar mesin'
    ],
    specs: {
      partNumber: 'CPR9EAIX-9',
      origin: 'NGK Spark Plug Co. Japan',
      warranty: 'Original Japan 100%',
      durability: '30.000 - 40.000 KM'
    },
    variants: {
      name: 'Jumlah Pembelian',
      options: ['1 Pcs (Satuan)', 'Box Isi 4 Pcs (Hemat 10%)', 'Paket Toko 10 Pcs']
    },
    featured: true,
    tags: ['busi', 'iridium', 'ngk', 'vario', 'nmax', 'pcx', 'aerox', 'pengapian']
  },

  // 5. Oli Mesin Matic Honda AHM Oil MPX2 0.8L
  {
    id: 'prt-oil-08',
    name: 'Oli Mesin Matic Honda AHM Oil MPX2 10W-30 (0.8 Liter)',
    sku: 'HND-OIL-MPX2',
    partNumber: '08232-M99-K8NZ1',
    barcode: '8991389201994',
    category: 'Oli & Chemical Motor',
    itemType: 'sparepart',
    brand: 'AHM Oil Original',
    compatibleBrands: ['Honda'],
    compatibleModels: ['Beat FI/ESP', 'Vario 110/125/150', 'Scoopy', 'Genio', 'Spacy'],
    price: 49000,
    originalPrice: 58000,
    stockStatus: 'ready',
    rating: 4.9,
    reviewsCount: 420,
    image: '/src/assets/images/product_synthetic_engine_oil_1792341139751.jpg',
    description: 'Pelumas mesin motor matic resmi pabrikan Honda. Diformulasikan khusus dengan teknologi Engine Protection Technology untuk melindungi komponen kopling kering matic, menjaga mesin tetap adem di kemacetan, dan hemat bensin.',
    highlights: [
      'Spesifikasi resmi SAE 10W-30, JASO MB, API SL',
      'Barcode QR segel tutup botol anti-pemalsuan bisa discan',
      'Perlindungan maksimal piston dan klep terhadap keausan gesekan',
      'Stok selalu batch terbaru distributor resmi'
    ],
    specs: {
      partNumber: '08232-M99-K8NZ1',
      capacity: '0.8 Liter (800 ml)',
      origin: 'PT Astra Honda Motor Indonesia',
      warranty: 'Keaslian Terjamin 100%'
    },
    variants: {
      name: 'Pilihan Order',
      options: ['1 Botol (0.8L)', 'Paket Oli Mesin + Oli Gardan MPX', 'Dus Isi 24 Botol (Grosir Toko)']
    },
    featured: true,
    tags: ['oli mesin', 'mpx2', 'honda', 'beat', 'vario', 'oli matic', 'pelumas']
  },

  // 6. Aki Kering Motor GS Astra GTZ-5S 12V Maintenance Free
  {
    id: 'prt-bat-10',
    name: 'Aki Motor Kering GS Astra GTZ-5S 12V 3.5Ah Maintenance Free',
    sku: 'GS-GTZ5S-MF',
    partNumber: 'GTZ-5S-12V',
    barcode: '8996001293812',
    category: 'Sparepart Motor Fast-Moving',
    itemType: 'sparepart',
    brand: 'GS Astra Battery',
    compatibleBrands: ['Honda', 'Yamaha', 'Suzuki'],
    compatibleModels: ['Honda Beat, Vario 110, Scoopy, Supra X 125, Revo', 'Yamaha Mio Soul, Vixion, Xeon', 'Suzuki Shogun 125, Spin'],
    price: 195000,
    originalPrice: 230000,
    stockStatus: 'ready',
    rating: 4.9,
    reviewsCount: 185,
    image: '/src/assets/images/product_car_battery_mf_1792341139603.jpg',
    description: 'Aki motor bebas perawatan (Maintenance Free) standar pabrik motor nomor 1 di Indonesia. Tidak perlu isi air aki selamanya, tegangan voltase stabil untuk menghidupkan starter elektrik dan kelistrikan lampu injeksi.',
    highlights: [
      'Tipe GTZ-5S (12V 3.5 Ampere Hour)',
      'Teknologi Valve Regulated Lead Acid (VRLA) anti tumpah',
      'Daya CCA starter kuat, putaran dinamo starter enteng seketika',
      'Garansi toko 3 bulan ganti baru'
    ],
    specs: {
      partNumber: 'GTZ-5S-12V',
      capacity: '12 Volt / 3.5 Ah',
      origin: 'PT GS Battery Indonesia',
      warranty: 'Garansi 3 Bulan Tukar Baru'
    },
    variants: {
      name: 'Tipe Pemasangan',
      options: ['Ambil Sendiri / Kirim Part', 'Termasuk Pasang di Bengkel GO OTOMOTIF']
    },
    featured: false,
    tags: ['aki motor', 'gtz5s', 'gs astra', 'kelistrikan', 'starter', 'aki kering']
  },

  // 7. V-Belt Original Yamaha NMAX 155 / Aerox 155
  {
    id: 'prt-vbl-11',
    name: 'V-Belt Drive CVT Original Yamaha NMAX 155 / Aerox 155',
    sku: 'YMH-VBL-NMAX',
    partNumber: '2DP-E7641-00',
    barcode: '8998822019482',
    category: 'CVT & Transmisi Matic',
    itemType: 'sparepart',
    brand: 'Yamaha Genuine Parts (YGP)',
    compatibleBrands: ['Yamaha'],
    compatibleModels: ['Yamaha NMAX 155 Old/New Connected', 'Yamaha Aerox 155', 'Yamaha Lexi 125'],
    price: 145000,
    originalPrice: 175000,
    stockStatus: 'ready',
    rating: 4.9,
    reviewsCount: 164,
    image: '/src/assets/images/product_cvt_matic_roller_belt_1792342707337.jpg',
    description: 'Sabuk penggerak CVT original Yamaha dengan kode part 2DP-E7641-00. Terbuat dari material kompon karet berkualitas tinggi yang fleksibel dan kuat menahan torsi besar mesin maxi Yamaha 155cc VVA.',
    highlights: [
      'Kode Part Asli YGP 2DP-E7641-00 dengan stiker hologram 3D',
      'Tahan hentakan torsi akselerasi mesin 155cc Blue Core',
      'Bebas bunyi mendecit saat akselerasi awal',
      'Rekomendasi penggantian setiap 20.000 - 25.000 KM'
    ],
    specs: {
      partNumber: '2DP-E7641-00',
      origin: 'PT Yamaha Indonesia Motor Mfg.',
      warranty: 'Jaminan Asli Yamaha 100%'
    },
    variants: {
      name: 'Pilihan Varian',
      options: ['Hanya V-Belt 2DP', 'Paket V-Belt + Roller YGP 13g (6 Pcs)']
    },
    featured: false,
    tags: ['v-belt nmax', 'yamaha', 'aerox', '2dp', 'cvt', 'sparepart motor']
  },

  // 8. Paket Grosir Kampas Rem Honda BeAT / Vario
  {
    id: 'prt-brk-06',
    name: 'Kampas Rem Cakram Depan Motor Honda BeAT / Vario / Scoopy',
    sku: 'GO-GRS-BRAKE',
    partNumber: '06455-KVB-T01',
    barcode: '8993175402028',
    category: 'Sparepart Motor Fast-Moving',
    itemType: 'sparepart',
    brand: 'Nissin / AHM OEM Quality',
    compatibleBrands: ['Honda'],
    compatibleModels: ['Beat Karbu/FI/ESP', 'Vario 110/125/150', 'Scoopy', 'Spacy'],
    price: 35000,
    originalPrice: 48000,
    stockStatus: 'ready',
    rating: 4.8,
    reviewsCount: 289,
    image: '/src/assets/images/product_ceramic_brake_pads_1792341140142.jpg',
    description: 'Brake pad kampas rem cakram depan sepeda motor matic Honda. Menggunakan bahan non-asbes semi-metalik yang pakem, tidak berdecit di saat basah/hujan, dan tidak mengikis piringan cakram motor.',
    highlights: [
      'Kode Part Pabrik 06455-KVB-T01',
      'Pengereman pakem seketika tanpa selip',
      'Bahan ramah lingkungan bebas asbes',
      'Tersedia harga eceran maupun paket grosir isi 10 pcs untuk bengkel'
    ],
    specs: {
      partNumber: '06455-KVB-T01',
      origin: 'Nissin Brake Standard',
      warranty: 'Garansi Presisi Pasang PNP'
    },
    variants: {
      name: 'Jumlah Pesanan',
      options: ['1 Set (Eceran Depan)', 'Paket Depan + Belakang (Tromol)', 'Grosir Bengkel Isi 10 Set']
    },
    featured: false,
    tags: ['kampas rem', 'honda', 'beat', 'vario', 'brake pad', 'fast moving']
  },

  // 9. Scanner Motor Injeksi OBD-2 Pro
  {
    id: 'tls-scn-05',
    name: 'Scanner Diagnosa Motor Injeksi Universal Bluetooth OBD-2',
    sku: 'GO-TLS-SCANNER',
    partNumber: 'MS-OBD2-PRO',
    barcode: '8998019283712',
    category: 'Tools & Scanner Injeksi',
    itemType: 'tools',
    brand: 'Master-Scan Moto Pro',
    compatibleBrands: ['Honda', 'Yamaha', 'Suzuki', 'Kawasaki', 'Universal / Semua Motor'],
    compatibleModels: ['Semua Motor Injeksi OBD-2 Indonesia'],
    price: 1850000,
    originalPrice: 2200000,
    stockStatus: 'ready',
    rating: 4.9,
    reviewsCount: 52,
    image: '/src/assets/images/training_injection_scanner_1792342707406.jpg',
    description: 'Alat scanner wajib bagi bengkel modern. Mampu membaca kode kerusakan motor (DTC), menghapus riwayat error, membaca putaran RPM, suhu mesin, bukaan gas TPS, tegangan baterai, serta reset ECM Honda dan Yamaha langsung dari layar atau aplikasi smartphone Android.',
    highlights: [
      'Kabel konektor lengkap untuk soket DLC Honda, Yamaha, Suzuki, Kawasaki',
      'Menu berbahasa Indonesia, sangat mudah dipahami pemula',
      'Dapat mendeteksi kerusakan sensor dalam hitungan 5 detik',
      'Garansi mesin scanner 1 tahun ganti baru'
    ],
    specs: {
      partNumber: 'MS-OBD2-PRO',
      capacity: 'Layar TFT Warna + Bluetooth Koneksi Smartphone',
      origin: 'Alat Khusus Bengkel Motor Injeksi',
      warranty: 'Garansi Unit 12 Bulan Resmi GO OTOMOTIF'
    },
    variants: {
      name: 'Kelengkapan Paket',
      options: ['Paket Standar (Kabel Honda & Yamaha)', 'Paket Komplit Semua Merk (Honda, Yamaha, Suzuki, Kawasaki)']
    },
    featured: false,
    tags: ['scanner motor', 'obd2', 'alat bengkel', 'tools', 'injeksi', 'diagnostic']
  },

  // 10. Kursus Spesialis CVT Motor Matic
  {
    id: 'trn-cvt-02',
    name: 'Kursus Spesialis CVT Motor Matic & Setting Performa',
    sku: 'GO-TRN-CVT',
    partNumber: 'GO-ACD-CVT02',
    barcode: '8997012300032',
    category: 'Program Training Montir',
    itemType: 'training',
    brand: 'GO OTOMOTIF Academy',
    compatibleBrands: ['Honda', 'Yamaha', 'Suzuki'],
    compatibleModels: ['Beat', 'Scoopy', 'Vario 125/150/160', 'NMAX', 'Aerox', 'Mio', 'Lexi'],
    price: 1750000,
    stockStatus: 'open_batch',
    batchSchedule: 'Batch 8: Kelas Setiap Hari Sabtu-Minggu',
    rating: 4.9,
    reviewsCount: 96,
    image: '/src/assets/images/product_cvt_matic_roller_belt_1792342707337.jpg',
    description: 'Pelatihan teknis menguasai sistem transmisi Continuously Variable Transmission (CVT) matic. Mengatasi masalah gredek tarikan awal, analisa keausan v-belt, roller peyang, kampas ganda selip, penggantian sil kruk as bocor, dan teknik bubut pulley derajat kencang.',
    highlights: [
      'Praktik langsung bongkar pasang CVT dengan kunci tracker profesional',
      'Trik jitu hilangkan getar gredek Beat, Vario & NMAX tanpa kambuh',
      'Rumus perhitungan berat roller gramatur untuk harian & tanjakan',
      'Sertifikat kelulusan spesialis CVT GO OTOMOTIF'
    ],
    specs: {
      duration: '7 Hari / 4 Pertemuan Weekend',
      curriculum: 'Pulley Primer/Sekunder, V-Belt, Kampas Ganda, Torque Cam, Grease CVT',
      certificate: 'Sertifikat Kompetensi CVT Matic',
      partNumber: 'GO-ACD-CVT02',
      warranty: 'Free konsultasi teknis selamanya'
    },
    variants: {
      name: 'Pilihan Jadwal',
      options: ['Kelas Weekend (Sabtu & Minggu)', 'Kelas Weekday (Senin - Rabu)', 'Kelas Intensif 3 Hari']
    },
    featured: false,
    tags: ['training cvt', 'matic', 'gredek', 'roller', 'v-belt', 'montir matic']
  },

  // 11. Pelatihan Overhaul Mesin
  {
    id: 'trn-ovh-04',
    name: 'Pelatihan Overhaul & Turun Mesin Motor 4-Tak & 2-Tak',
    sku: 'GO-TRN-OVH',
    partNumber: 'GO-ACD-OVH03',
    barcode: '8997012300049',
    category: 'Program Training Montir',
    itemType: 'training',
    brand: 'GO OTOMOTIF Academy',
    compatibleBrands: ['Honda', 'Yamaha', 'Suzuki', 'Kawasaki', 'Universal / Semua Motor'],
    compatibleModels: ['Mesin Matic, Bebek Karbu/Injeksi, dan Motor Sport 150cc'],
    price: 2450000,
    stockStatus: 'open_batch',
    batchSchedule: 'Batch 11: Pendaftaran Terbuka',
    rating: 5.0,
    reviewsCount: 68,
    image: '/src/assets/images/hero_motorcycle_training_parts_1792342706050.jpg',
    description: 'Pelatihan teknis komprehensif membongkar, menganalisis kerusakan jeroan mesin, mengukur clearance celah ring piston, skir klep, ganti setang seher, kalibrasi rantai keteng noken as, hingga menyusun kembali mesin sampai hidup normal.',
    highlights: [
      'Praktek langsung dengan mesin motor latihan asli',
      'Kuasai penggunaan jangka sorong mikrometer & dial gauge',
      'Teknik skir klep bocor & setel celah klep (feeler gauge)',
      'Cocok untuk calon mekanik yang ingin siap kerja di bengkel besar'
    ],
    specs: {
      duration: '10 Hari Praktek Penuh',
      curriculum: 'Klep & Noken As, Piston & Blok Silinder, Kruk As, Transmisi Rasio, Pompa Oli',
      certificate: 'Sertifikat Kompetensi Overhaul Mesin',
      partNumber: 'GO-ACD-OVH03'
    },
    variants: {
      name: 'Fokus Pelatihan',
      options: ['Mesin Motor 4-Tak Modern (Matic & Bebek)', 'Mesin Motor Sport 150cc DOHC (CBR/R15)', 'Kombinasi 4-Tak & Mesin 2-Tak (RX-King/Ninja)']
    },
    featured: false,
    tags: ['overhaul', 'turun mesin', 'training montir', 'bongkar mesin', 'mekanik']
  },

  // 12. Masterclass Bisnis Bengkel
  {
    id: 'trn-mgt-07',
    name: 'Masterclass Manajemen Stok Sparepart & Bisnis Bengkel Motor',
    sku: 'GO-TRN-MGT',
    partNumber: 'GO-BIZ-MGT04',
    barcode: '8997012300056',
    category: 'Program Training Montir',
    itemType: 'training',
    brand: 'GO OTOMOTIF Business',
    compatibleBrands: ['Universal / Semua Motor'],
    compatibleModels: ['Cocok untuk Pemilik Bengkel, Calon Pengusaha & Kepala Mekanik'],
    price: 1500000,
    originalPrice: 2000000,
    stockStatus: 'open_batch',
    batchSchedule: 'Batch 6: Kelas Online & Offline Tersedia',
    rating: 5.0,
    reviewsCount: 43,
    image: '/src/assets/images/hero_motorcycle_training_parts_1792342706050.jpg',
    description: 'Bimbingan bisnis membuka dan mengelola bengkel motor yang untung dan berkelanjutan. Pelajari rumus mengelola perputaran stok spare part (dead stock vs fast moving), sistem gaji bagi hasil mekanik, strategi penetapan harga jasa, dan pemasaran bengkel agar selalu ramai.',
    highlights: [
      'Template Excel Manajemen Inventaris & Kartu Stok Sparepart',
      'Formula Bagi Hasil & Insentif Montir yang Adil & Memotivasi',
      'Analisis Modal Awal Buka Bengkel (Break Even Point & ROI)',
      'Akses jaringan distributor spare part motor harga tangan pertama'
    ],
    specs: {
      duration: '3 Hari Intensif + 6 Bulan Bimbingan Bisnis',
      curriculum: 'Manajemen Stok, Keuangan, SOP Mekanik, Rekrutmen Montir, Pemasangan POS',
      certificate: 'Sertifikat Manajemen Bengkel Profesional',
      partNumber: 'GO-BIZ-MGT04'
    },
    variants: {
      name: 'Format Belajar',
      options: ['Tatap Muka Langsung di Training Center', 'Kelas Online Interaktif Zoom + Rekaman']
    },
    featured: false,
    tags: ['manajemen sparepart', 'bisnis bengkel', 'pelatihan', 'stok barang', 'wirausaha']
  }
];

export const CATEGORIES_LIST: ProductCategory[] = [
  'Semua',
  'Sparepart Motor Fast-Moving',
  'Paket Buka Usaha Bengkel',
  'Program Training Montir',
  'CVT & Transmisi Matic',
  'Tools & Scanner Injeksi',
  'Oli & Chemical Motor',
];
