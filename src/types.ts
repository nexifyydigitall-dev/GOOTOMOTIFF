export type ProductCategory = 
  | 'Semua'
  | 'Sparepart Motor Fast-Moving'
  | 'Paket Buka Usaha Bengkel'
  | 'Program Training Montir'
  | 'CVT & Transmisi Matic'
  | 'Tools & Scanner Injeksi'
  | 'Oli & Chemical Motor';

export type MotorcycleBrand = 
  | 'Semua Merk'
  | 'Honda'
  | 'Yamaha'
  | 'Suzuki'
  | 'Kawasaki'
  | 'Universal / Semua Motor';

export type ItemType = 'sparepart' | 'training' | 'tools' | 'package';

export interface Product {
  id: string;
  name: string;
  sku: string;
  partNumber?: string; // Kode Sparepart resmi pabrikan (OEM Part Number)
  barcode?: string; // Kode Barcode EAN-13 / Code128 untuk discan
  category: Exclude<ProductCategory, 'Semua'>;
  itemType: ItemType;
  brand: string;
  compatibleBrands: MotorcycleBrand[];
  compatibleModels: string[];
  price: number;
  originalPrice?: number;
  stockStatus: 'ready' | 'open_batch'; // ready untuk sparepart, open_batch untuk kelas training
  batchSchedule?: string; // e.g. "Batch 12: Mulai 10 November 2026"
  rating: number;
  reviewsCount: number;
  image: string;
  gallery?: string[];
  description: string;
  highlights: string[];
  specs: {
    duration?: string; // untuk training, e.g. "14 Hari (80% Praktek)"
    curriculum?: string; // e.g. "Injeksi FI, Reset ECM, Scanner OBD2"
    certificate?: string; // e.g. "Sertifikat Kelulusan GO OTOMOTIF"
    partNumber?: string;
    capacity?: string;
    warranty?: string;
    origin?: string;
    durability?: string;
    moq?: string; // Minimum order quantity e.g. "1 Paket" atau "1 Pcs"
  };
  variants?: {
    name: string;
    options: string[];
  };
  featured?: boolean;
  tags: string[];
}

export interface CartItem {
  id: string;
  product: Product;
  selectedVariant?: string;
  quantity: number;
  notes?: string;
}

export interface CustomerOrderInfo {
  name: string;
  phone: string;
  orderType: 'sparepart_order' | 'training_registration';
  storeOrWorkshopName?: string; // Nama bengkel / toko jika beli grosir spare part
  participantPurpose?: string; // e.g. "Ingin Buka Bengkel Baru", "Upgrade Skill Mekanik", "Hobi Otomotif"
  preferredBatchSchedule?: string; // Jadwal kelas jika training
  address?: string;
  city: string;
  notes: string;
  paymentMethod: 'Transfer BCA' | 'Transfer Mandiri' | 'QRIS' | 'Bayar di Workshop' | 'DP Training 50%';
}

export interface StoreSettings {
  storeName: string;
  whatsappNumber: string;
  location: string;
  addressDetail: string;
  tagline: string;
  operatingHours: string;
  googleMapsUrl?: string;
}
