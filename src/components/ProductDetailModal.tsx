import React, { useState } from 'react';
import { Product } from '../types';
import { formatRupiah, openWhatsAppChat, createSingleProductWhatsAppMessage } from '../utils/whatsapp';
import { BarcodeView } from './BarcodeView';
import { X, MessageCircle, ShoppingBag, Heart, Star, Check, Share2, ShieldCheck, GraduationCap, PackageCheck, CheckCircle2 } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, variant?: string, quantity?: number) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  storeName: string;
  storeWhatsAppNumber: string;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
  storeName,
  storeWhatsAppNumber,
}) => {
  if (!product) return null;

  const isTraining = product.itemType === 'training';

  const [selectedVariant, setSelectedVariant] = useState<string>(
    product.variants?.options[0] || ''
  );
  const [quantity, setQuantity] = useState(1);
  const [participantName, setParticipantName] = useState('');
  const [motorcycleModel, setMotorcycleModel] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [addedToast, setAddedToast] = useState(false);

  const subtotal = product.price * quantity;

  const handleOrderWhatsApp = () => {
    const message = createSingleProductWhatsAppMessage(
      product,
      storeName,
      selectedVariant || undefined,
      quantity,
      participantName || undefined,
      motorcycleModel || undefined
    );
    openWhatsAppChat(storeWhatsAppNumber, message);
  };

  const handleAddToCart = () => {
    onAddToCart(product, selectedVariant || undefined, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 1600);
  };

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fade-in">
      <div 
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden my-auto border border-zinc-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Controls */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyLink}
            title="Salin tautan"
            className="p-2 rounded-full bg-white/90 backdrop-blur-xs text-zinc-600 hover:text-zinc-900 shadow-xs border border-zinc-200 transition"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => onToggleWishlist(product)}
            title="Simpan ke favorit"
            className="p-2 rounded-full bg-white/90 backdrop-blur-xs text-zinc-600 hover:text-red-600 shadow-xs border border-zinc-200 transition"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-600 text-red-600' : ''}`} />
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup detail"
            className="p-2 rounded-full bg-white/90 backdrop-blur-xs text-zinc-600 hover:text-zinc-900 shadow-xs border border-zinc-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
          {/* Gallery / Image Column */}
          <div className="md:col-span-5 bg-zinc-100 p-5 sm:p-6 flex flex-col justify-start items-center relative space-y-4">
            <div className="w-full aspect-square rounded-xl overflow-hidden bg-white shadow-sm border border-zinc-200">
              <img
                src={product.image}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Scannable Barcode Label Card */}
            <BarcodeView
              barcode={product.barcode}
              partNumber={product.partNumber || product.specs?.partNumber}
              sku={product.sku}
              productName={product.name}
              brand={product.brand}
              price={product.price}
              className="w-full"
            />
            
            {/* Guarantee info */}
            <div className="w-full space-y-2 text-xs text-zinc-700">
              {isTraining ? (
                <>
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/80 border border-zinc-200/80">
                    <GraduationCap className="w-4 h-4 text-red-600 shrink-0" />
                    <span>80% Praktek Langsung + Sertifikat Resmi</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/80 border border-zinc-200/80">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Jaminan Mengulang GRATIS Jika Belum Mahir</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/80 border border-zinc-200/80">
                    <PackageCheck className="w-4 h-4 text-red-600 shrink-0" />
                    <span>100% Suku Cadang Terverifikasi Presisi & Awet</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/80 border border-zinc-200/80">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Akses Suplai Grosir Tangan Pertama dari Distributor</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Details & Purchase Module Column */}
          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Category, Brand & Stock */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                <span className="font-extrabold text-zinc-900">{product.brand}</span>
                <span aria-hidden="true">·</span>
                <span>{product.category}</span>
                <span aria-hidden="true">·</span>
                <span className="font-bold text-emerald-700">
                  {isTraining ? (product.batchSchedule || 'Batch Terbuka') : 'Ready Stock'}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-zinc-900 leading-snug">
                {product.name}
              </h2>

              {/* Part Number & Barcode Badge */}
              <div className="flex flex-wrap items-center gap-2">
                {(product.partNumber || product.specs?.partNumber) && (
                  <div className="px-2.5 py-1 rounded-md bg-zinc-100 border border-zinc-200 text-xs font-mono font-bold text-zinc-800">
                    <span className="text-zinc-500 font-sans mr-1">Kode Sparepart:</span>
                    <span>{product.partNumber || product.specs?.partNumber}</span>
                  </div>
                )}
                {product.barcode && (
                  <div className="px-2.5 py-1 rounded-md bg-red-50 border border-red-200 text-xs font-mono font-bold text-red-700">
                    <span className="text-red-500 font-sans mr-1">Barcode:</span>
                    <span>{product.barcode}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <div className="text-2xl font-black text-zinc-900 tabular-nums">
                  {formatRupiah(product.price)}
                </div>
                {product.originalPrice && (
                  <div className="text-sm text-zinc-400 line-through tabular-nums">
                    {formatRupiah(product.originalPrice)}
                  </div>
                )}
                <div className="flex items-center gap-1 ml-auto text-xs font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span className="tabular-nums">{product.rating.toFixed(1)}</span>
                  <span className="text-zinc-400 font-normal">({product.reviewsCount})</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                {product.description}
              </p>

              {/* Highlights */}
              {product.highlights && (
                <div className="pt-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
                    {isTraining ? 'Fasilitas & Kurikulum Pelatihan' : 'Keunggulan Suku Cadang / Paket'}
                  </h4>
                  <ul className="space-y-1.5 text-xs text-zinc-700">
                    {product.highlights.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-red-600 mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Variant selector */}
              {product.variants && (
                <div className="pt-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                    {product.variants.name}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.options.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setSelectedVariant(opt)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${
                          selectedVariant === opt
                            ? 'border-red-600 bg-red-50 text-red-700'
                            : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-zinc-300'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Training or Motorcycle Info Fields */}
              {isTraining ? (
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Nama Calon Peserta Kursus (Opsional):
                  </label>
                  <input
                    type="text"
                    value={participantName}
                    onChange={(e) => setParticipantName(e.target.value)}
                    placeholder="Contoh: Rian Pratama"
                    className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-300 rounded-lg focus:outline-none focus:border-red-600 text-zinc-800"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Tipe Motor Anda / Nama Bengkel Pemesan:
                  </label>
                  <input
                    type="text"
                    value={motorcycleModel}
                    onChange={(e) => setMotorcycleModel(e.target.value)}
                    placeholder="Contoh: Honda Beat ESP 2021 / Bengkel Sahabat Motor"
                    className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-300 rounded-lg focus:outline-none focus:border-red-600 text-zinc-800"
                  />
                </div>
              )}

              {/* Technical Specifications */}
              <div className="pt-2 border-t border-zinc-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Informasi Lengkap</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {product.specs?.duration && (
                    <div>
                      <span className="text-zinc-400 block">Durasi Belajar</span>
                      <span className="font-semibold text-zinc-800">{product.specs.duration}</span>
                    </div>
                  )}
                  {product.specs?.certificate && (
                    <div>
                      <span className="text-zinc-400 block">Sertifikasi</span>
                      <span className="font-semibold text-zinc-800">{product.specs.certificate}</span>
                    </div>
                  )}
                  {product.specs?.curriculum && (
                    <div className="col-span-2">
                      <span className="text-zinc-400 block">Fokus Materi</span>
                      <span className="font-semibold text-zinc-800">{product.specs.curriculum}</span>
                    </div>
                  )}
                  {product.specs?.moq && (
                    <div>
                      <span className="text-zinc-400 block">Minimal Order</span>
                      <span className="font-semibold text-zinc-800">{product.specs.moq}</span>
                    </div>
                  )}
                  {product.specs?.warranty && (
                    <div>
                      <span className="text-zinc-400 block">Jaminan</span>
                      <span className="font-semibold text-zinc-800">{product.specs.warranty}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Contiguous purchase controls */}
            <div className="pt-6 mt-6 border-t border-zinc-200 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-zinc-600">
                    {isTraining ? 'Jumlah Peserta:' : 'Jumlah:'}
                  </span>
                  <div className="flex items-center border border-zinc-300 rounded-lg bg-zinc-50">
                    <button
                      type="button"
                      disabled={quantity <= 1}
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-2.5 py-1 text-sm font-bold text-zinc-700 hover:bg-zinc-200 disabled:opacity-40 rounded-l-lg transition"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-xs font-bold tabular-nums text-zinc-900">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-2.5 py-1 text-sm font-bold text-zinc-700 hover:bg-zinc-200 rounded-r-lg transition"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-zinc-400 block">Total Biaya</span>
                  <span className="text-lg font-black text-zinc-900 tabular-nums">
                    {formatRupiah(subtotal)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold text-zinc-900 bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 rounded-xl transition"
                >
                  {addedToast ? <Check className="w-4 h-4 text-emerald-600" /> : <ShoppingBag className="w-4 h-4 text-zinc-700" />}
                  <span>{addedToast ? 'Tersimpan' : (isTraining ? '+ Masukkan Keranjang' : '+ Keranjang')}</span>
                </button>

                <button
                  type="button"
                  onClick={handleOrderWhatsApp}
                  className="flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{isTraining ? 'Daftar Training via WA' : 'Pesan via WhatsApp'}</span>
                </button>
              </div>

              <p className="text-[11px] text-center text-zinc-400">
                Konsultasi & pemesanan suku cadang dipandu langsung oleh tim admin GO OTOMOTIF via WhatsApp resmi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
