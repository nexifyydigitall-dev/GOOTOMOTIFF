import React, { useState } from 'react';
import logoGoOtomotif from '../assets/images/logo_go_otomotif.png';
import { Product, ProductCategory, MotorcycleBrand, ItemType, StoreSettings } from '../types';
import { CATEGORIES_LIST, PRODUCTS_DATA } from '../data/products';
import { formatRupiah } from '../utils/whatsapp';
import { 
  X, 
  Plus, 
  Edit3, 
  Trash2, 
  Download, 
  Upload, 
  RotateCcw, 
  Check, 
  Search, 
  Code2, 
  Sliders, 
  Lock, 
  KeyRound, 
  Eye, 
  EyeOff, 
  Copy, 
  Store, 
  LogOut, 
  ShieldCheck, 
  FileText,
  AlertCircle,
  FolderArchive
} from 'lucide-react';

interface AdminManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSaveProducts: (updatedProducts: Product[]) => void;
  onLogout: () => void;
  currentPin: string;
  onUpdatePin: (newPin: string) => void;
  storeSettings: StoreSettings;
  onSaveStoreSettings: (newSettings: StoreSettings) => void;
}

export const AdminManagerModal: React.FC<AdminManagerModalProps> = ({
  isOpen,
  onClose,
  products,
  onSaveProducts,
  onLogout,
  currentPin,
  onUpdatePin,
  storeSettings,
  onSaveStoreSettings,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'list' | 'form' | 'store' | 'backup' | 'security' | 'guide'>('list');
  const [searchFilter, setSearchFilter] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Security (PIN) State
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [pinChangeMsg, setPinChangeMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Store Settings Form State
  const [storeForm, setStoreForm] = useState<StoreSettings>({ ...storeSettings });

  // Product / Program Form states
  const [formName, setFormName] = useState('');
  const [formSku, setFormSku] = useState('');
  const [formPartNumber, setFormPartNumber] = useState('');
  const [formBarcode, setFormBarcode] = useState('');
  const [formCategory, setFormCategory] = useState<Exclude<ProductCategory, 'Semua'>>('Program Training Montir');
  const [formItemType, setFormItemType] = useState<ItemType>('training');
  const [formBrand, setFormBrand] = useState('GO OTOMOTIF');
  const [formPrice, setFormPrice] = useState<number>(1500000);
  const [formOriginalPrice, setFormOriginalPrice] = useState<number | undefined>(undefined);
  const [formStockStatus, setFormStockStatus] = useState<'ready' | 'open_batch'>('open_batch');
  const [formBatchSchedule, setFormBatchSchedule] = useState('Batch Baru: Pendaftaran Dibuka');
  const [formDuration, setFormDuration] = useState('14 Hari (80% Praktek)');
  const [formCurriculum, setFormCurriculum] = useState('Injeksi, Kelistrikan, Scanner OBD-2');
  const [formImage, setFormImage] = useState('/src/assets/images/training_injection_scanner_1792342707406.jpg');
  const [formDescription, setFormDescription] = useState('');
  const [formHighlightsText, setFormHighlightsText] = useState('80% Praktek Langsung\nSertifikat Resmi Kelulusan\nBimbingan Buka Bengkel Seumur Hidup');
  const [formCompatibleBrands, setFormCompatibleBrands] = useState<MotorcycleBrand[]>(['Honda', 'Yamaha', 'Universal / Semua Motor']);
  const [formFeatured, setFormFeatured] = useState(false);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleOpenAddForm = () => {
    setEditingProduct(null);
    setFormName('');
    setFormSku(`GO-${Math.floor(1000 + Math.random() * 9000)}`);
    setFormPartNumber(`PRT-${Math.floor(1000 + Math.random() * 9000)}`);
    setFormBarcode(`899${Math.floor(1000000000 + Math.random() * 9000000000)}`);
    setFormCategory('Program Training Montir');
    setFormItemType('training');
    setFormBrand('GO OTOMOTIF Academy');
    setFormPrice(2000000);
    setFormOriginalPrice(undefined);
    setFormStockStatus('open_batch');
    setFormBatchSchedule('Batch Baru: Pendaftaran Buka');
    setFormDuration('14 Hari Praktek');
    setFormCurriculum('Injeksi EFI, Scanner OBD-2, Kelistrikan Motor');
    setFormImage('/src/assets/images/training_injection_scanner_1792342707406.jpg');
    setFormDescription('Deskripsi lengkap mengenai program pelatihan atau sparepart motor ini.');
    setFormHighlightsText('80% Praktek Langsung\nSertifikat Resmi Kelulusan\nKonsultasi Gratis Selamanya');
    setFormCompatibleBrands(['Honda', 'Yamaha', 'Universal / Semua Motor']);
    setFormFeatured(false);
    setActiveTab('form');
  };

  const handleOpenEditForm = (prod: Product) => {
    setEditingProduct(prod);
    setFormName(prod.name);
    setFormSku(prod.sku);
    setFormPartNumber(prod.partNumber || prod.specs?.partNumber || '');
    setFormBarcode(prod.barcode || '');
    setFormCategory(prod.category);
    setFormItemType(prod.itemType);
    setFormBrand(prod.brand);
    setFormPrice(prod.price);
    setFormOriginalPrice(prod.originalPrice);
    setFormStockStatus(prod.stockStatus);
    setFormBatchSchedule(prod.batchSchedule || '');
    setFormDuration(prod.specs?.duration || '');
    setFormCurriculum(prod.specs?.curriculum || '');
    setFormImage(prod.image);
    setFormDescription(prod.description);
    setFormHighlightsText(prod.highlights?.join('\n') || '');
    setFormCompatibleBrands(prod.compatibleBrands || ['Universal / Semua Motor']);
    setFormFeatured(Boolean(prod.featured));
    setActiveTab('form');
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      alert('Nama produk / program harus diisi.');
      return;
    }

    const highlightsArray = formHighlightsText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const updatedItem: Product = {
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      name: formName.trim(),
      sku: formSku.trim() || `GO-${Date.now().toString().slice(-4)}`,
      partNumber: formPartNumber.trim() || undefined,
      barcode: formBarcode.trim() || undefined,
      category: formCategory,
      itemType: formItemType,
      brand: formBrand.trim() || 'GO OTOMOTIF',
      compatibleBrands: formCompatibleBrands.length > 0 ? formCompatibleBrands : ['Universal / Semua Motor'],
      compatibleModels: [formBrand],
      price: Number(formPrice) || 0,
      originalPrice: formOriginalPrice ? Number(formOriginalPrice) : undefined,
      stockStatus: formStockStatus,
      batchSchedule: formStockStatus === 'open_batch' ? formBatchSchedule : undefined,
      rating: editingProduct ? editingProduct.rating : 5.0,
      reviewsCount: editingProduct ? editingProduct.reviewsCount : 12,
      image: formImage.trim() || '/src/assets/images/hero_motorcycle_training_parts_1792342706050.jpg',
      description: formDescription.trim(),
      highlights: highlightsArray,
      specs: {
        duration: formDuration ? formDuration.trim() : undefined,
        curriculum: formCurriculum ? formCurriculum.trim() : undefined,
        certificate: formItemType === 'training' ? 'Sertifikat Kelulusan Resmi GO OTOMOTIF' : undefined,
        warranty: formItemType === 'training' ? 'Jaminan Mengulang Gratis' : 'Garansi Keaslian Part 100%',
        origin: 'GO OTOMOTIF Center',
        partNumber: formPartNumber.trim() || undefined,
      },
      featured: formFeatured,
      tags: [formCategory.toLowerCase(), formBrand.toLowerCase(), formItemType],
    };

    let newProducts: Product[];
    if (editingProduct) {
      newProducts = products.map(p => p.id === editingProduct.id ? updatedItem : p);
      showToast('Data program / sparepart berhasil diperbarui!');
    } else {
      newProducts = [updatedItem, ...products];
      showToast('Program / Sparepart baru berhasil ditambahkan ke katalog!');
    }

    onSaveProducts(newProducts);
    setActiveTab('list');
  };

  const handleDeleteProduct = (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus "${name}" dari katalog?`)) {
      const filtered = products.filter(p => p.id !== id);
      onSaveProducts(filtered);
      showToast(`"${name}" telah dihapus.`);
    }
  };

  const handleResetToDefault = () => {
    if (confirm('Kembalikan semua data ke katalog awal GO OTOMOTIF? Perubahan manual Anda akan di-reset.')) {
      onSaveProducts(PRODUCTS_DATA);
      showToast('Katalog berhasil dikembalikan ke data default bawaan!');
    }
  };

  const handleSaveStore = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveStoreSettings(storeForm);
    showToast('Pengaturan bengkel dan nomor WhatsApp berhasil disimpan!');
  };

  const handleUpdatePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPinInput.trim() || newPinInput.trim().length < 4) {
      setPinChangeMsg({ type: 'error', text: 'PIN minimal terdiri dari 4 karakter / angka.' });
      return;
    }
    if (newPinInput.trim() !== confirmPinInput.trim()) {
      setPinChangeMsg({ type: 'error', text: 'Konfirmasi PIN tidak cocok. Silakan ulangi.' });
      return;
    }

    onUpdatePin(newPinInput.trim());
    setNewPinInput('');
    setConfirmPinInput('');
    setPinChangeMsg({ type: 'success', text: 'PIN Keamanan Admin berhasil diubah!' });
    showToast('PIN Rahasia Admin berhasil diperbarui!');
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(products, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `katalog-go-otomotif-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('File JSON katalog berhasil diunduh!');
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].name && parsed[0].price !== undefined) {
            onSaveProducts(parsed);
            showToast(`Berhasil mengimpor ${parsed.length} item katalog!`);
            setActiveTab('list');
          } else {
            alert('Format file JSON tidak valid. Pastikan file berisi array produk.');
          }
        } catch {
          alert('Gagal membaca file JSON. Pastikan file valid.');
        }
      };
    }
  };

  const handleCopyCodeSnippet = () => {
    const code = `// Data Katalog Produk & Program Training GO OTOMOTIF\n// Generated at: ${new Date().toLocaleString('id-ID')}\n\nimport { Product, ProductCategory, MotorcycleBrand, StoreSettings } from '../types';\n\nexport const DEFAULT_STORE_SETTINGS: StoreSettings = ${JSON.stringify(storeSettings, null, 2)};\n\nexport const PRODUCTS_DATA: Product[] = ${JSON.stringify(products, null, 2)};\n`;
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
      showToast('Kode TypeScript berhasil disalin ke clipboard!');
    });
  };

  const filteredItems = products.filter(p => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div 
        className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-200 flex items-center justify-between bg-zinc-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <img 
              src={logoGoOtomotif} 
              alt="GO Otomotif" 
              className="h-8 w-auto object-contain"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">Panel Pengelola Rahasia GO OTOMOTIF</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800">
                  Hidden Admin Mode
                </span>
              </div>
              <span className="text-[11px] text-zinc-400">Kelola Katalog, Program Montir, Kontak WhatsApp & Pengaturan</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onLogout}
              title="Kunci / Keluar dari Admin"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg transition"
            >
              <LogOut className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden sm:inline">Kunci / Keluar</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup panel"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-4 py-2.5 border-b border-zinc-200 bg-zinc-100 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveTab('list')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                activeTab === 'list'
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'bg-white text-zinc-700 hover:bg-zinc-200'
              }`}
            >
              Daftar Program & Part ({products.length})
            </button>

            <button
              type="button"
              onClick={handleOpenAddForm}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1 transition ${
                activeTab === 'form' && !editingProduct
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-white text-zinc-700 hover:bg-zinc-200'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Baru</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('store')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1 transition ${
                activeTab === 'store'
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'bg-white text-zinc-700 hover:bg-zinc-200'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Profil Bengkel & WA</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('backup')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1 transition ${
                activeTab === 'backup'
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'bg-white text-zinc-700 hover:bg-zinc-200'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Backup & Salin Kode</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('security')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1 transition ${
                activeTab === 'security'
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'bg-white text-zinc-700 hover:bg-zinc-200'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Ganti PIN</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('guide')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1 transition ${
                activeTab === 'guide'
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'bg-white text-zinc-700 hover:bg-zinc-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Panduan Update</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleResetToDefault}
            className="text-[11px] text-zinc-500 hover:text-red-600 flex items-center gap-1 font-semibold ml-auto"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Bawaan</span>
          </button>
        </div>

        {/* Notification Toast */}
        {notification && (
          <div className="bg-emerald-600 text-white text-xs px-4 py-2 font-semibold flex items-center justify-center gap-1.5 animate-fade-in shrink-0">
            <Check className="w-4 h-4" />
            <span>{notification}</span>
          </div>
        )}

        {/* Tab 1: List Products & Programs */}
        {activeTab === 'list' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Cari program training, sparepart, atau SKU..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-zinc-50 border border-zinc-300 rounded-lg focus:outline-none focus:border-red-600"
                />
              </div>

              <button
                type="button"
                onClick={handleOpenAddForm}
                className="px-3.5 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 shadow-xs transition"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Program / Part Baru</span>
              </button>
            </div>

            <div className="border border-zinc-200 rounded-xl overflow-hidden divide-y divide-zinc-200">
              {filteredItems.length === 0 ? (
                <div className="py-12 text-center text-zinc-500 text-xs">
                  Tidak ada data yang cocok dengan pencarian &quot;{searchFilter}&quot;.
                </div>
              ) : (
                filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 sm:p-4 bg-white hover:bg-zinc-50/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 rounded-lg object-cover bg-zinc-200 shrink-0 border border-zinc-200"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 text-[11px] text-zinc-500">
                          <span className="font-bold text-red-600 uppercase">{item.brand}</span>
                          <span aria-hidden="true">·</span>
                          <span className="truncate">{item.category}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono text-zinc-400">{item.sku}</span>
                        </div>
                        <h4 className="text-sm font-bold text-zinc-900 truncate">
                          {item.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5 text-xs">
                          <span className="font-extrabold text-zinc-900 tabular-nums">
                            {formatRupiah(item.price)}
                          </span>
                          {item.batchSchedule && (
                            <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                              {item.batchSchedule}
                            </span>
                          )}
                          {item.featured && (
                            <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                              ⭐ Unggulan
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        type="button"
                        onClick={() => handleOpenEditForm(item)}
                        className="px-3 py-1.5 text-xs font-semibold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-lg flex items-center gap-1 transition"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(item.id, item.name)}
                        className="px-2.5 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg flex items-center gap-1 transition"
                        title="Hapus item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Form Tambah / Edit */}
        {activeTab === 'form' && (
          <form onSubmit={handleSubmitForm} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
              <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                {editingProduct ? <Edit3 className="w-4 h-4 text-red-600" /> : <Plus className="w-4 h-4 text-red-600" />}
                <span>{editingProduct ? `Edit: ${editingProduct.name}` : 'Tambah Program / Sparepart Baru'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setActiveTab('list')}
                className="text-xs text-zinc-500 hover:text-zinc-800"
              >
                Batal & Kembali ke Daftar
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Nama Produk / Program *
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Misal: Kursus Injeksi Honda & Yamaha 14 Hari"
                  className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-300 rounded-lg focus:outline-none focus:border-red-600 font-semibold text-zinc-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Kode SKU / ID
                </label>
                <input
                  type="text"
                  value={formSku}
                  onChange={(e) => setFormSku(e.target.value)}
                  placeholder="Misal: GO-TRN-INJ2"
                  className="w-full px-3 py-2 text-xs font-mono bg-zinc-50 border border-zinc-300 rounded-lg focus:outline-none focus:border-red-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Kode Spare Part Pabrikan / OEM *
                </label>
                <input
                  type="text"
                  value={formPartNumber}
                  onChange={(e) => setFormPartNumber(e.target.value)}
                  placeholder="Contoh: 23100-K44-V01, CPR9EAIX-9"
                  className="w-full px-3 py-2 text-xs font-mono font-bold text-zinc-900 bg-zinc-50 border border-zinc-300 rounded-lg focus:outline-none focus:border-red-600"
                />
                <p className="text-[10px] text-zinc-500 mt-1">
                  Kode resmi yang dicari pembeli atau teknisi bengkel.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1 flex items-center justify-between">
                  <span>Nomor Barcode Fisik (EAN/Code 128)</span>
                  <button
                    type="button"
                    onClick={() => setFormBarcode(`899${Math.floor(1000000000 + Math.random() * 9000000000)}`)}
                    className="text-[10px] text-red-600 hover:underline font-semibold"
                  >
                    + Generate Acak
                  </button>
                </label>
                <input
                  type="text"
                  value={formBarcode}
                  onChange={(e) => setFormBarcode(e.target.value)}
                  placeholder="Contoh: 8992775102014"
                  className="w-full px-3 py-2 text-xs font-mono font-bold text-zinc-900 bg-zinc-50 border border-zinc-300 rounded-lg focus:outline-none focus:border-red-600"
                />
                <p className="text-[10px] text-zinc-500 mt-1">
                  Nomor barcode pada dus kemasan barang untuk dipindai scanner.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Tipe Penawaran
                </label>
                <select
                  value={formItemType}
                  onChange={(e) => setFormItemType(e.target.value as ItemType)}
                  className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-300 rounded-lg focus:outline-none focus:border-red-600 font-medium"
                >
                  <option value="training">Program Training Montir</option>
                  <option value="package">Paket Buka Bengkel / Bundling</option>
                  <option value="sparepart">Sparepart Satuan / Grosir</option>
                  <option value="tools">Tools / Scanner Bengkel</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Kategori Katalog
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-300 rounded-lg focus:outline-none focus:border-red-600 font-medium"
                >
                  {CATEGORIES_LIST.filter(c => c !== 'Semua').map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Brand / Penyelenggara
                </label>
                <input
                  type="text"
                  value={formBrand}
                  onChange={(e) => setFormBrand(e.target.value)}
                  placeholder="GO OTOMOTIF Academy / Supply"
                  className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-300 rounded-lg focus:outline-none focus:border-red-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Harga / Biaya Kursus (Rp) *
                </label>
                <input
                  type="number"
                  value={formPrice}
                  onChange={(e) => setFormPrice(Number(e.target.value))}
                  placeholder="2850000"
                  className="w-full px-3 py-2 text-xs font-bold text-zinc-900 bg-zinc-50 border border-zinc-300 rounded-lg focus:outline-none focus:border-red-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Harga Coret / Normal (Opsional)
                </label>
                <input
                  type="number"
                  value={formOriginalPrice || ''}
                  onChange={(e) => setFormOriginalPrice(e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="Misal: 3500000"
                  className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-300 rounded-lg focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Status Ketersediaan
                </label>
                <select
                  value={formStockStatus}
                  onChange={(e) => setFormStockStatus(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-300 rounded-lg focus:outline-none focus:border-red-600 font-medium"
                >
                  <option value="open_batch">Batch Pendaftaran Buka</option>
                  <option value="ready">Ready Stock (Siap Kirim / Diambil)</option>
                </select>
              </div>
            </div>

            {/* Training Specific Fields */}
            {formItemType === 'training' && (
              <div className="p-3.5 bg-red-50/60 rounded-xl border border-red-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-red-950 mb-1">
                    Status Batch Jadwal
                  </label>
                  <input
                    type="text"
                    value={formBatchSchedule}
                    onChange={(e) => setFormBatchSchedule(e.target.value)}
                    placeholder="Batch 14: Mulai 10 November"
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-red-300 rounded-lg focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-red-950 mb-1">
                    Durasi Belajar
                  </label>
                  <input
                    type="text"
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    placeholder="14 Hari (80% Praktek)"
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-red-300 rounded-lg focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-red-950 mb-1">
                    Fokus Kurikulum Materi
                  </label>
                  <input
                    type="text"
                    value={formCurriculum}
                    onChange={(e) => setFormCurriculum(e.target.value)}
                    placeholder="Injeksi FI, Reset ECM, Scanner OBD2"
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-red-300 rounded-lg focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                URL Gambar Foto Produk / Training
              </label>
              <input
                type="text"
                value={formImage}
                onChange={(e) => setFormImage(e.target.value)}
                placeholder="/src/assets/images/... atau https://..."
                className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-300 rounded-lg focus:outline-none focus:border-red-600"
              />
              <div className="flex flex-wrap gap-1.5 mt-2 text-[11px] text-zinc-500 items-center">
                <span className="font-semibold text-zinc-600">Pilih Preset Cepat:</span>
                <button
                  type="button"
                  onClick={() => setFormImage('/src/assets/images/training_injection_scanner_1792342707406.jpg')}
                  className="px-2 py-0.5 bg-zinc-200 hover:bg-zinc-300 rounded text-zinc-800"
                >
                  Scanner & Injeksi
                </button>
                <button
                  type="button"
                  onClick={() => setFormImage('/src/assets/images/hero_motorcycle_training_parts_1792342706050.jpg')}
                  className="px-2 py-0.5 bg-zinc-200 hover:bg-zinc-300 rounded text-zinc-800"
                >
                  Akademi Montir
                </button>
                <button
                  type="button"
                  onClick={() => setFormImage('/src/assets/images/product_cvt_matic_roller_belt_1792342707337.jpg')}
                  className="px-2 py-0.5 bg-zinc-200 hover:bg-zinc-300 rounded text-zinc-800"
                >
                  Set CVT Matic
                </button>
                <button
                  type="button"
                  onClick={() => setFormImage('/src/assets/images/product_paket_buka_bengkel_1792342707445.jpg')}
                  className="px-2 py-0.5 bg-zinc-200 hover:bg-zinc-300 rounded text-zinc-800"
                >
                  Paket Buka Bengkel
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                Deskripsi Lengkap
              </label>
              <textarea
                rows={3}
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Jelaskan secara detail kelebihan, materi apa saja yang didapat, atau spesifikasi suku cadang..."
                className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-300 rounded-lg focus:outline-none focus:border-red-600 leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                Poin Keunggulan / Fasilitas (Satu baris satu poin):
              </label>
              <textarea
                rows={3}
                value={formHighlightsText}
                onChange={(e) => setFormHighlightsText(e.target.value)}
                placeholder="80% Praktek Langsung&#10;Termasuk Sertifikat Kelulusan&#10;Bimbingan Seumur Hidup"
                className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-300 rounded-lg focus:outline-none focus:border-red-600 font-mono text-[11px]"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <label className="flex items-center gap-2 text-xs font-bold text-zinc-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formFeatured}
                  onChange={(e) => setFormFeatured(e.target.checked)}
                  className="w-4 h-4 rounded text-red-600 focus:ring-red-600 border-zinc-300 accent-red-600"
                />
                <span>Tampilkan sebagai Program / Produk Unggulan di Halaman Utama</span>
              </label>
            </div>

            <div className="pt-4 border-t border-zinc-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('list')}
                className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 rounded-lg transition"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg shadow-sm transition"
              >
                {editingProduct ? 'Simpan Perubahan' : 'Tambahkan ke Katalog'}
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Profil Bengkel & Kontak WhatsApp */}
        {activeTab === 'store' && (
          <form onSubmit={handleSaveStore} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 mb-1 flex items-center gap-2">
                <Store className="w-4 h-4 text-red-600" />
                <span>Pengaturan Profil Bengkel & WhatsApp Penerima</span>
              </h3>
              <p className="text-xs text-zinc-500">
                Pemesanan sparepart dan pendaftaran kursus montir dari pengunjung akan otomatis diarahkan ke nomor WhatsApp ini.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Nama Bengkel / Usaha *
                </label>
                <input
                  type="text"
                  value={storeForm.storeName}
                  onChange={(e) => setStoreForm({ ...storeForm, storeName: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-300 rounded-lg focus:outline-none focus:border-red-600 font-bold text-zinc-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Nomor WhatsApp Penerima Order / Pendaftaran *
                </label>
                <input
                  type="text"
                  value={storeForm.whatsappNumber}
                  onChange={(e) => setStoreForm({ ...storeForm, whatsappNumber: e.target.value })}
                  placeholder="Contoh: 6281234567890 (Gunakan kode 62)"
                  className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-300 rounded-lg focus:outline-none focus:border-red-600 font-mono text-zinc-900 font-bold"
                  required
                />
                <p className="text-[10px] text-zinc-500 mt-1">
                  Gunakan format internasional tanpa spasi atau strip (misal: 6281234567890).
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                Tagline / Slogan Usaha
              </label>
              <input
                type="text"
                value={storeForm.tagline}
                onChange={(e) => setStoreForm({ ...storeForm, tagline: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-300 rounded-lg focus:outline-none focus:border-red-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Kota / Wilayah Operasional
                </label>
                <input
                  type="text"
                  value={storeForm.location}
                  onChange={(e) => setStoreForm({ ...storeForm, location: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-300 rounded-lg focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Jam Buka & Operasional
                </label>
                <input
                  type="text"
                  value={storeForm.operatingHours}
                  onChange={(e) => setStoreForm({ ...storeForm, operatingHours: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-300 rounded-lg focus:outline-none focus:border-red-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                Alamat Lengkap Workshop / Workshop Training
              </label>
              <textarea
                rows={2}
                value={storeForm.addressDetail}
                onChange={(e) => setStoreForm({ ...storeForm, addressDetail: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-300 rounded-lg focus:outline-none focus:border-red-600"
              />
            </div>

            <div className="pt-4 border-t border-zinc-200 flex items-center justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg shadow-sm transition"
              >
                Simpan Profil & Kontak WhatsApp
              </button>
            </div>
          </form>
        )}

        {/* Tab 4: Backup, Restore & Salin Kode */}
        {activeTab === 'backup' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 mb-1">
                Unduh File Website & Backup Data
              </h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Anda dapat mengunduh seluruh website ke dalam 1 file <strong>index.html</strong> tunggal yang siap dibuka langsung di browser offline atau diupload ke hosting cPanel, serta mengunduh paket lengkap ZIP.
              </p>
            </div>

            {/* Direct Download Options for index.html & ZIP */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl space-y-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-red-600 text-white">
                  <Download className="w-4 h-4" />
                </span>
                <h4 className="text-sm font-bold text-zinc-900">
                  Unduh File Website GO OTOMOTIF (Siap Pakai)
                </h4>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Pilih format unduhan yang Anda inginkan. File ini bisa langsung dibuka di laptop/HP tanpa install aplikasi tambahan:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <a
                  href="/download/index.html"
                  download="index.html"
                  className="p-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold text-xs flex items-center justify-between transition shadow-sm group"
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-5 h-5 text-red-200 group-hover:scale-110 transition-transform" />
                    <div className="text-left">
                      <div className="font-extrabold">Unduh File index.html</div>
                      <div className="text-[10px] text-red-100 font-normal">Single-File (Semua Kode Disatukan)</div>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-white" />
                </a>

                <a
                  href="/download/go_otomotif_website.zip"
                  download="go_otomotif_website.zip"
                  className="p-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl font-bold text-xs flex items-center justify-between transition shadow-sm group"
                >
                  <div className="flex items-center gap-2.5">
                    <FolderArchive className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
                    <div className="text-left">
                      <div className="font-extrabold">Unduh Paket ZIP Lengkap</div>
                      <div className="text-[10px] text-zinc-400 font-normal">Berisi index.html + Gambar + Asset</div>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-white" />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-3">
                <div className="p-2 bg-red-100 text-red-700 w-fit rounded-lg">
                  <Download className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-zinc-900">Download Cadangan (JSON)</h4>
                <p className="text-xs text-zinc-500">
                  Simpan seluruh {products.length} item data katalog ke file `.json` di komputer atau smartphone Anda.
                </p>
                <button
                  type="button"
                  onClick={handleExportJSON}
                  className="w-full py-2 px-3 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition"
                >
                  <Download className="w-4 h-4" />
                  <span>Download File JSON</span>
                </button>
              </div>

              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-3">
                <div className="p-2 bg-emerald-100 text-emerald-700 w-fit rounded-lg">
                  <Upload className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-zinc-900">Restore / Unggah JSON</h4>
                <p className="text-xs text-zinc-500">
                  Perbarui atau pulihkan katalog sekaligus dengan mengunggah kembali file JSON backup.
                </p>
                <label className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition">
                  <Upload className="w-4 h-4" />
                  <span>Pilih & Unggah File JSON</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportJSON}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Salin Kode TypeScript untuk Source Code */}
            <div className="p-4 bg-zinc-900 text-white rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-red-400" />
                  <h4 className="text-xs font-bold text-white">Salin Kode TypeScript untuk File Source Code</h4>
                </div>
                <button
                  type="button"
                  onClick={handleCopyCodeSnippet}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition shadow-xs"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Tersalin!' : 'Salin Kode untuk src/data/products.ts'}</span>
                </button>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Jika Anda ingin perubahan yang Anda buat di browser tersimpan permanen di dalam source code repository (`src/data/products.ts`), cukup klik tombol <strong>Salin Kode</strong> di atas lalu paste ke file tersebut.
              </p>
            </div>
          </div>
        )}

        {/* Tab 5: Ganti PIN Keamanan Admin */}
        {activeTab === 'security' && (
          <form onSubmit={handleUpdatePinSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 max-w-lg">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 mb-1 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-red-600" />
                <span>Pengaturan Keamanan & Ganti PIN Rahasia</span>
              </h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                PIN ini digunakan untuk membuka panel admin yang disembunyikan. Hanya Anda yang mengetahui PIN ini agar orang lain tidak dapat mengubah katalog atau menu yang tersedia.
              </p>
            </div>

            {pinChangeMsg && (
              <div className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                pinChangeMsg.type === 'success' 
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' 
                  : 'bg-red-50 text-red-800 border border-red-300'
              }`}>
                {pinChangeMsg.type === 'success' ? <Check className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />}
                <span>{pinChangeMsg.text}</span>
              </div>
            )}

            <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg text-xs text-zinc-600">
              PIN saat ini: <span className="font-mono font-bold text-zinc-900 bg-zinc-200 px-2 py-0.5 rounded ml-1">{currentPin}</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                PIN Baru (Minimal 4 Angka/Karakter) *
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
                <input
                  type={showPin ? 'text' : 'password'}
                  value={newPinInput}
                  onChange={(e) => setNewPinInput(e.target.value)}
                  placeholder="Masukkan PIN baru"
                  className="w-full pl-9 pr-10 py-2 text-xs bg-zinc-50 border border-zinc-300 rounded-lg focus:outline-none focus:border-red-600 font-mono tracking-wider font-bold"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-600"
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                Ulangi Konfirmasi PIN Baru *
              </label>
              <input
                type={showPin ? 'text' : 'password'}
                value={confirmPinInput}
                onChange={(e) => setConfirmPinInput(e.target.value)}
                placeholder="Ketik ulang PIN baru"
                className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-300 rounded-lg focus:outline-none focus:border-red-600 font-mono tracking-wider font-bold"
                required
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg shadow-sm transition"
            >
              Simpan & Perbarui PIN
            </button>
          </form>
        )}

        {/* Tab 6: Panduan Update Program di Website */}
        {activeTab === 'guide' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 mb-1 flex items-center gap-2">
                <Code2 className="w-4 h-4 text-red-600" />
                <span>Panduan Lengkap: Cara Update Data & Program Website</span>
              </h3>
              <p className="text-xs text-zinc-500">
                Ada 4 cara mudah untuk memperbarui data, program kursus, atau stok suku cadang di website GO OTOMOTIF:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2">
                <div className="w-6 h-6 rounded-full bg-red-600 text-white font-bold flex items-center justify-center text-xs">
                  1
                </div>
                <h4 className="font-bold text-zinc-900">Langsung via Panel Admin Rahasia Ini (Paling Mudah)</h4>
                <p className="text-zinc-600 leading-relaxed">
                  Cukup buka panel ini kapan saja (tekan <kbd className="px-1.5 py-0.5 bg-zinc-200 rounded font-mono font-bold">Ctrl + Shift + A</kbd> atau klik ikon gembok kecil di footer), lalu tekan tombol <strong>Tambah Baru</strong> atau <strong>Edit</strong>. Data langsung tersimpan seketika di browser tanpa menyentuh koding sama sekali!
                </p>
              </div>

              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2">
                <div className="w-6 h-6 rounded-full bg-red-600 text-white font-bold flex items-center justify-center text-xs">
                  2
                </div>
                <h4 className="font-bold text-zinc-900">Lewat Chat Perintah AI (Otomatis & Cepat)</h4>
                <p className="text-zinc-600 leading-relaxed">
                  Anda cukup ketik permintaan di chat asisten, misalnya: <em>&quot;Tolong tambahkan program training Montir Balap harga 3.5jt dan perbarui nomor WhatsApp ke 081234xxx&quot;</em>. AI akan langsung mengupdate file kode secara otomatis.
                </p>
              </div>

              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2">
                <div className="w-6 h-6 rounded-full bg-red-600 text-white font-bold flex items-center justify-center text-xs">
                  3
                </div>
                <h4 className="font-bold text-zinc-900">Ekspor / Impor File JSON</h4>
                <p className="text-zinc-600 leading-relaxed">
                  Buka tab <strong>&quot;Backup & Salin Kode&quot;</strong>, download file JSON. Anda bisa mengedit data di file tersebut dengan aplikasi teks apapun, lalu upload kembali untuk memperbarui ratusan produk sekaligus dalam hitungan detik.
                </p>
              </div>

              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2">
                <div className="w-6 h-6 rounded-full bg-red-600 text-white font-bold flex items-center justify-center text-xs">
                  4
                </div>
                <h4 className="font-bold text-zinc-900">Edit File Kode Sumber Langsung</h4>
                <p className="text-zinc-600 leading-relaxed">
                  File sumber utama terletak di <span className="font-mono text-red-600 font-bold">src/data/products.ts</span>. Anda bisa menggunakan tombol <strong>&quot;Salin Kode untuk products.ts&quot;</strong> dari tab Backup lalu paste ke file tersebut.
                </p>
              </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
              <span className="font-bold flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-700" />
                Cara Membuka Menu Admin yang Disembunyikan:
              </span>
              <ul className="list-disc list-inside space-y-1 text-amber-800 pt-1">
                <li>Tekan tombol keyboard: <kbd className="px-1.5 py-0.5 bg-amber-200 rounded font-mono font-bold text-amber-950">Ctrl + Shift + A</kbd> (atau <kbd className="px-1.5 py-0.5 bg-amber-200 rounded font-mono font-bold text-amber-950">Cmd + Shift + A</kbd> di Mac).</li>
                <li>Klik 3 kali pada logo GO OTOMOTIF di bagian atas.</li>
                <li>Atau klik ikon gembok kecil di baris paling bawah halaman (footer).</li>
                <li>Ketik PIN rahasia Anda (PIN bawaan: <span className="font-mono font-bold">8888</span>).</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
